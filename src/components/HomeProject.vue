<template>
  <section class="projects">
    <div class="intro"><span id="title">Our Projects</span></div>
    <div class="projects-container">
      
      <div class="projects-cart">
        <Card v-for="(project, index) in projects.slice(0, 4)" :key="project.id" :project="project"
          :image-url="project.projectImage" />
        <h3 class = "view" @click = "viewMore">View more...</h3>
      </div>
      
    </div>

  </section>
</template>

<script>
import Card from './Card.vue';
import firebaseApp from '../Firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
  components: {
    Card
  },

  data() {
    return {
      projects: []
    }
  },

  mounted() {
    this.fetchProjects();
  },

  methods: {
    async fetchProjects() {
      try {
        const listOfProjects = await getDocs(collection(db, "Project Collection"))
        listOfProjects.forEach((doc) => {
          let project = doc.data();
          if (!project.projectCompleted) {
            project.id = doc.id;
            this.projects.push(project);
          }
        });
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    },
    viewMore() {
      this.$router.push("/project");
    }
  }
}
</script>

<style scoped>
.intro {
  text-align: center;
}

.projects {
  background-color: white;
  color: black;
}

#title {
  text-align: center;

  font-size: 45px;
  font-family: Inter;
  font-weight: 600;

  word-wrap: break-word;
}

.projects-cart {
  height: 350px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 8px;
  overflow: scroll;
}

.projects-container {
  margin-left: 50px;
  font-size: 25px;
  font-weight: 550px;
}

.view {
  text-align: center;
  font-size: 23px;
  font-weight: 550px;
  cursor: pointer;
  padding-left: 15px;
  padding-top: 100px;
}
</style>
