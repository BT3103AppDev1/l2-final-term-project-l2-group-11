
<template>
    
    <div v-if = "userstate" class="card" @click="goToProjProfile">
        <div v-if="showNotifications && pendingMembersCount" class="notification-badge">
            {{ pendingMembersCount }}
        </div>
        <div class="card-image">
            <img v-bind:src="imageUrl" alt="Very cool picture">
        </div>  
        <div class="card-content">
            <div class="card-header">
                <div class="project-header">
                    {{ project.projectName }}
                </div>
                <div class="project-description">
                    <p>{{ project.projectDescription }}</p>
                </div>
            </div>

            <div class="card-footer">
                <div v-if="this.projectCompleted" class="footer-section time">
                    <span>Project Completed</span>
                </div>
                <div v-else class="footer-section time">
                    <span>{{ this.numDays }} days to go</span>
                </div>
                <div class="bookmark-icon">
                    <img @click.stop="toggleBookmark" v-if="this.bookmarked" src="../assets/bookmark.png" />
                    <img @click.stop="toggleBookmark" v-else src="../assets/bookmark-white.png" />
                </div>
            </div>
        </div>
    </div>

    <div v-else class="card" @click="goToLogin">
        <div class="card-image">
            <img v-bind:src="imageUrl" alt="Very cool picture">
        </div>  
        <div class="card-content">
            <div class="card-header">
                <div class="project-header">
                    {{ project.projectName }}
                </div>
                <div class="project-description">
                    <p>{{ project.projectDescription }}</p>
                </div>
            </div>

            <div class="card-footer">
                <div v-if = "this.projectCompleted" class="footer-section time">
                    <span>Project Completed</span>
                </div>
                <div v-else class="footer-section time">
                    <span>{{ this.numDays }} days to go</span>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import firebaseApp from '../Firebase.js';
import firebase from '../uifire.js';
import 'firebase/compat/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, getDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
data() {
    return {
        userstate: false,
        uid: '',
        bookmarked: false,
        userProfile: null,
        savedProjects:[],
        projectCompleted: false,
        numDays: 0
    }
},

async mounted() {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            this.userstate = true; // User is logged in
            this.uid = user.uid;
            const userRef = doc(db, 'User Information', this.uid);
            const userSnap = await getDoc(userRef);
            this.userProfile = userSnap.data();
            this.savedProjects = this.userProfile.savedProjects;
            this.bookmarked = this.savedProjects.includes(this.project.id);
            this.numDays = Math.round((this.project.projectEnd.toDate().getTime() - new Date().getTime())/(1000 * 3600 * 24));
            this.projectCompleted = this.project.projectCompleted;
        } else {
            this.userstate = false; // User is not logged in
            this.uid = '';
            this.userProfile = null;
            this.savedProjects = [];
            this.projectCompleted = this.project.projectCompleted;
            this.numDays = Math.round((this.project.projectEnd.toDate().getTime() - new Date().getTime())/(1000 * 3600 * 24));
        }
    })
    // To ensure that this is only run the first time when the project is expired
    if (this.project.projectEnd.toDate().getTime() < new Date().getTime() && this.project.projectCompleted == false) {
        const docRef = doc(db, 'Project Collection', this.project.id);
        await updateDoc(docRef, {projectCompleted: true});
        this.project.projectCompleted = true;
        let hostID = this.project.projectHost;
        const hostRef = doc(db, 'User Information', hostID);
        await updateDoc(hostRef, {currentProjects: arrayRemove(this.project.projectID)});
        await updateDoc(hostRef, {pastProjects: arrayUnion(this.project.projectID)});
        this.project.projectMembers.forEach(async (memberID) => {
            let memberRef = doc(db, 'User Information', memberID);
            await updateDoc(memberRef, {currentProjects: arrayRemove(this.project.projectID)});
            await updateDoc(memberRef, {pastProjects: arrayUnion(this.project.projectID)});
        })
    }
},

props: {
    project: Object,
    imageUrl: String,
    pendingMembersCount: Number, // The count of pending members
    showNotifications: {
        type:Boolean,
        default: false
    }
},

methods : {
    async toggleBookmark() {
        this.bookmarked = !this.bookmarked;
        if (this.bookmarked) {
            try {
                let userRef = doc(db, 'User Information', this.uid);
                await updateDoc(userRef, {savedProjects: arrayUnion(this.project.projectID)});
            }

            catch(error) {
                console.error("Error saving project: ", error)
            }
        } else {
            try {
                let userRef = doc(db, 'User Information', this.uid);
                await updateDoc(userRef, {savedProjects: arrayRemove(this.project.projectID)})
            }

            catch(error) {
                console.error("Error deleting project: ", error)
            }
        }
    },

    goToProjProfile() {
        this.$router.push({ name: 'ProjProfile', params: { id: this.project.id } });
    },

    goToLogin() {
        this.$router.push("/auth/register")
    }
}
}
</script>


<style scoped>


.card {
border: 1px solid rgb(218, 220, 224);
border-radius: 16px;
background-color: #fff;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0,0,0,0.1);
overflow: hidden;
width: 300px;
height: 300px;
font-size: 14px;
cursor: pointer;
}

.card-image img {
width: 100%;
height: 170px;
display: block;
}

.card-content {
padding: 10px;
}

.card-header {
width: 280px;
height: 76.4px;
display: flex;
justify-content: space-between;
margin-bottom: 4px;
flex-direction: column;
justify-content: flex-start;
}

.project-header {
color: rgb(32, 33, 36);
font-size: 16px;
font-weight: 600;
line-height: 24px;
margin-bottom: 8px;
}

.project-description {
color: rgb(32, 33, 36);
font-size: 12px;
font-weight: 400;
display: -webkit-box;
-webkit-line-clamp: 2; /* number of lines you want to display */
-webkit-box-orient: vertical;
overflow: hidden;
text-overflow: ellipsis;
}

.card-content p {
color: #333;
margin: 0 0 14px;
}

.card-footer {
border-top: 1px solid #eaeaea;
padding-top: 7px;
display: flex;
flex-wrap: wrap;
justify-content: space-between;
align-items: center;
}

.time {
color: #F5793B;
}

.bookmark-icon img {
height:20px;
width:27px;
padding-right:10px;
cursor: pointer;
}

.card {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 20px; 
  right: 14px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 100; /* Ensure the badge is above the card */
  /* Set width and height for a perfect circle */
  width: 25px; /* Adjust as needed */
  height: 25px; /* Adjust as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(50%, -50%); /* This will center the badge over the corner */
}
</style>