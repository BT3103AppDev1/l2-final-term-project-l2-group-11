<template>
    <div class="heading">
        <img id="background" v-if="projectBackground" :src="projectBackground" alt="not found">
        <img id="background" v-else src="../assets/CpppImage.png" alt="not found">

        <div class="titleDetail">
            <div class="title">
                <h1 id="projTitle">{{ projectName }}</h1><br>
                <div v-if="this.uid == this.projectHost" class="buttonsForHost">
                    <button id="button1"
                        @click="$router.push({ name: 'EditProjectProfile', params: { id: this.projectID } })">
                        Edit Project Detail</button>
                    <button id="button2" @click="manageProject">Manage Project</button>
                </div>
                <div v-else-if="this.projectMembers.includes(this.uid) || this.pendingMembers.includes(this.uid)"
                    class="buttonsForMember">
                    <button id="button1" @click="leaveProject">Leave Project</button>
                </div>
                <div v-else class="buttonsForOther">
                    <button id="button1" @click="applyForProject">Appply For Project</button>
                    <button id="button2">Save Project</button>
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
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


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
            projectEnd: "",
            uid: "",
            pendingMembers: [],
            projectBackground: null,
        }
    },

    methods: {
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
            this.pendingMembers = projectData.pendingMembers;
            this.projectBackground = projectData.projectBackground;
        },

        manageProject() {
            const id = this.projectID

            this.$router.push({ path: `/ManagePrj/${id}` })
            //this.$router.push({name: "/ManagePrj", params: {id: this.projectID}});
        },

        async applyForProject() {
            // Add the user to the pending members list
            this.pendingMembers.push(this.uid);
            // Update the project document
            const docRef = doc(db, "Project Collection", this.projectID)
            await updateDoc(docRef, {
                pendingMembers: this.pendingMembers
            });
            alert("Applied for project");

            // reload the page
            window.location.reload();
        },

        async leaveProject() {
            if (this.projectMembers.includes(this.uid)) {
                // Remove the user from the project members list
                this.projectMembers = this.projectMembers.filter(member => member !== this.uid);
                // Update the project document
                const docRef = doc(db, "Project Collection", this.projectID)
                await updateDoc(docRef, {
                    projectMembers: this.projectMembers,
                });
                alert("Left project");
            }

            else if (this.pendingMembers.includes(this.uid)) {
                // Remove the user from the pending members list
                this.pendingMembers = this.pendingMembers.filter(member => member !== this.uid);
                // Update the project document
                const docRef = doc(db, "Project Collection", this.projectID)
                await updateDoc(docRef, {
                    pendingMembers: this.pendingMembers,
                });
                alert("Left project");
            }
            // reload the page
            window.location.reload();
        }
    },

    mounted() {
        this.fetchProjectDetails();

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.uid = user.uid;
            }
        });
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

.buttonsForHost,
.buttonsForMember,
.buttonsForOther {
    display: flex;
    gap: 100px;
    padding-left: 100px;
}

button {
    background-color: black;
    border: none;
    color: white;
    padding: 13px;
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
