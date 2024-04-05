<template>
    <div class="heading">
        <img src="../assets/CpppImage.png" alt="error" class="center-image"><br><br>

        <div class="titleDetail">
            <div class="title">
                <h1 id="projTitle">{{ projectName }}</h1><br>
                <div class="buttons">
                    <button id="button1">Edit project detail</button>
                    <button id="button2">Manage project</button>
                </div>
            </div>

            <div class="importantDetail">
                <h4>Project Host: {{ projectHost }}</h4>
                <h4>Project Members: {{ projectMembers }}</h4>
                <h4>Members Required: {{ membersRequired }}<span id="membersRequired"></span></h4>
                <h4>Sign-up Deadline: {{ signupDeadline }}<span id="deadline"></span></h4>
            </div>
        </div>
    </div><br>

    <div class="detail">
        <div class="description">
            <h2>{{ projectDescription }}</h2>
            <span id="description"></span>
        </div>

        <div class="skillsRequired">
            <h2>Skills Required</h2>
            <span id="skill">{{ skillsRequired }}</span>
        </div>

        <div class="commitment">
            <h2>Project Commitment</h2>
            <span id="timeline">{{ projectStart }} to {{ projectEnd }}</span>
        </div>

        <a id="findOutMore">Find Out More</a>
    </div>
</template>

<script>
import firebaseApp from '../Firebase.js'
import { getFirestore } from "firebase/firestore";
import { getDoc, doc } from "firebase/firestore";


const db = getFirestore(firebaseApp);

export default {
    name: 'ProjProfile',

    data() {
        return {
            projectID: "",
            projectName: "",
            projectDescription: "",
            projectHost: "",
            projectMembers: [],
            membersRequired: 0,
            signupDeadline: "",
            skillsRequired: [],
            projectStart: "",
            projectEnd: ""
        }
    },

    methods:{
        async fetchProjectDetails() {
            this.projectID = this.$route.params.id;
            let docRef = doc(db, "Project Collection", this.projectID);
            let docSnap = await getDoc(docRef);
            let projectData = docSnap.data()
            this.projectName = projectData.projectName;
            this.projectDescription = projectData.projectDescription;
            this.projectHost = projectData.projectHost;
            this.projectMembers = projectData.projectMembers;
            this.membersRequired = projectData.membersRequired;
            this.signupDeadline = projectData.signupDeadline.toDate().toDateString();
            this.skillsRequired = projectData.skillsRequired;
            this.projectStart = projectData.projectStart.toDate().toDateString();
            this.projectEnd = projectData.projectEnd.toDate().toDateString();  
        }
    },

    mounted() {
        this.fetchProjectDetails()
    }
}
</script>

<style scoped>
.heading {
    height: 400px;
    background-color: #ffece4;
}

img {
    height: 170px;
    width: 100%;
}

.titleDetail {
    display: flex;
    padding-right: 10px;
}

.title {
    width: 1100px;
}

#projTitle {
    font-size: 45px;
    padding-left: 100px;
    width: 1000px;
    text-align: left;
}

.importantDetail {
    float: right;
    border: #f5793b;
    border-radius: 3px;
    height: 200px;
    width: 200px;
    background-color: #f5793b;
}

.buttons {
    display: flex;
    gap: 100px;
    padding-left: 100px;
}

button {
    background-color: black;
    border: none;
    color: white;
    padding: 15px;
    width: 175px;
    text-align: center;
    text-decoration: none;
    font-size: 18px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: box-shadow, transform;
    transition-property: box-shadow, transform;
}

button:hover,
button:focus,
button:active {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.detail {
    display: flex;
    flex-direction: column;
    gap: 50px;
    padding-left: 100px;
    padding-right: 100px;
}
</style>