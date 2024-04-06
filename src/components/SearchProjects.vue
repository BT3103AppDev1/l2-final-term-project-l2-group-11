<script>
import Card from './Card.vue';
import firebaseApp from '../Firebase.js';
import firebase from '../uifire.js';
import 'firebase/compat/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
  components: {
    Card
  },

  data() {
    return {
      userstate: false,
      searchInput: '',
      projects: [],
      filteredProjects: []
    }
  },
  created() {
    this.fetchProjects();
  },

  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userstate = true; // User is logged in
      } else {
        this.userstate = false;
      }
    })
  },

  methods: {
    async fetchProjects() {
      try {
        const listOfProjects = await getDocs(collection(db, "Project Collection"))
        listOfProjects.forEach((doc) => {
          let project = doc.data();
          project.id = doc.id;
          this.projects.push(project);
        });
        this.filteredProjects = this.projects;
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    },

    searchProjects() {
      if (!this.searchInput) {
        this.filteredProjects = this.projects;
      } else {
        // Convert search term to lower case and filter the projects
        const lowerCaseSearchTerm = this.searchInput.toLowerCase();
        this.filteredProjects = this.projects.filter(project =>
          project.projectName.toLowerCase().includes(lowerCaseSearchTerm) ||
          project.projectDescription.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }
    },

    createProject() {
      console.log('Project created!');
    }
  }
}
</script>

<template>
  <body>
    <div id="flex-container">
      <div id="title-container">
        <div id="title">
          <mark class="orange">Collab</mark> <mark class="black">with your peer to</mark> <mark class="orange"> explore your potential</mark> <br>
        </div>
        <div id="search-bar">
          <input type="text" v-model="searchInput" placeholder="Search" id="rounded-search" @keyup.enter="submitSearch"/>
          <button @click="searchProjects" id="searchProjectButton">Search</button>
          <button @click="createProject" id="createProjectButton">Create your project</button>
        </div>
      </div>

      <div v-if = "searchInput.length == 0" class="projects-container">
        <div class="projectCategory">
          <p>Mobile App Development</p>
        </div>
        <div class="projects-cart">
          <Card v-for="project in projects" :key="project.id" :project="project" :image-url="project.projectImage"/>
        </div>

        <div class="projectCategory">
          <p>Machine Learning</p>
        </div>
        <div class="projects-cart">
          <Card v-for="project in projects" :key="project.id" :project="project" :image-url="project.projectImage"/>
        </div>
      </div>

      <div v-else-if="filteredProjects.length == 0" class="projects-container">
        <div class="projectCategory">
          <p>{{ searchInput }}</p>
        </div>
        <div class="no-results">
          No results found
        </div>
      </div>

      <div v-else class="projects-container">
        <div class="projectCategory">
          <p>{{ searchInput }}</p>
        </div>
        <div class="projects-cart">
          <Card v-for="project in filteredProjects" :key="project.id" :project="project" :image-url="project.projectImage"/>
        </div>
      </div>
    </div>
  </body>
</template>


<style scoped>

#flex-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

#navBar {
  height: 40px
}

#title {
  margin-top: 15px;
  font-size: 35px;
  font-weight: 650;
  text-align: center;
}

#title-container {
  height: 150px;
  background-color: #ffece4;
  text-align: center
}

#search-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 50px;
  align-items: baseline;
}

#rounded-search {
  border: 1px solid #ccc;
  padding: 8px 15px;
  border-radius: 20px; /* This makes the input rounded */
  outline: none;
  font-size: 16px;
  width: 600px;
  height: 30px;
}

#createProjectButton, #searchProjectButton {
  background-color: #ff7424;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  border: none;
  height: 30px;
  cursor: pointer;
}

mark.orange {
    color:#F5793B;
    background: none;
}

mark.black {
  color:black;
  background: none;
}

.projects-container {
  margin-left: 50px;
  font-size: 25px;
  font-weight: 550px;
}

.projectCategory {
  color: black;
  font-weight: 300px;
}

.projects-cart {
  height: 350px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 8px;
  overflow: scroll;
}
</style>
