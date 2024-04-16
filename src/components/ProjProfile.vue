<template>
    <div class = "proj-profile-wrapper">
    <div class="heading">
        <img src="../assets/CpppImage.png" alt="error" class="center-image">
        <div class="titleDetail">
            <div class="title">
                <h1 id="projTitle">{{ projectName }}</h1>

                <div v-if="this.uid == this.projectHost" class="buttonsForHost">
                    <button id="button1"
                        @click="$router.push({ name: 'EditProjectProfile', params: { id: this.projectID } })">
                        Edit Project Detail</button>
                    <button id="button2" @click="manageProject">Manage Project</button>
                </div>


                <div v-else-if="this.pendingMembers.includes(this.uid)" class="buttonForPendingApplication">
                    <button id="button1" @click="withdrawApplication">Withdraw Application</button>
                </div>

                <div v-else-if="this.projectMembers.includes(this.uid)" class="buttonsForMember">
                    <button id="button1" @click="leaveProject">Leave Project ABC</button>
                </div>

                <div v-else class="buttonsForOther">
                    <button id="button1" @click="applyForProject">Apply For Project</button>
                    <button id="button2">Save Project</button>
                </div>
            </div>

            <div class="adminDetails">
                <div v-show = "projectMembers.length > 0" class = host-details>
                    <h4>Project Host:</h4>
                    <img v-bind:src = "projectMembers.length > 0 ? projectMembers[0].profileImageUrl : ''" v-on:click="visitProfilePage(projectMembers[0].userId)" />
                </div>
                <div v-show = "projectMembers.length > 0" class = members-details>
                    <h4>Project Members: {{ projectMembers.length > 1 ? "" : "No member yet!" }}</h4>
                    <div v-for = "member in projectMembers.slice(1)" class = "members-container">
                        <img v-bind:src = member.profileImageUrl v-on:click="visitProfilePage(member.userId)"/>
                    </div>
                </div>
                <h4>Members Required: {{ membersRequired }}</h4>
                <h4>Sign-up Deadline: {{ signupDeadline }}</h4>
            </div>
        </div>
    </div>

    <div class="detail">
        <div class="description">
            <p>{{ projectDescription }}</p>
        </div>

        <div class="skillsRequired">
            <h2>Skills Required</h2>
            <div class="tags-container">
                <span class="tags" v-for="skill in skillsRequired" :key="skills">{{ skill }}</span>
            </div>
        </div>

        <div class="commitment">
            <h2>Project Commitment</h2>
            <span id="timeline">{{ projectStart }} to {{ projectEnd }}</span>
        </div>

        <a id="findOutMore">Find Out More</a>
    </div>
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
            projectMembers: [],
            membersRequired: 0,
            signupDeadline: "",
            skillsRequired: [],
            projectStart: "",
            projectEnd: "",
            uid: "",
            pendingMembers: [],
        }
    },

    methods: {
        async fetchProjectDetails() {
            let tempProjectMember = [];
            this.projectID = this.$route.params.id;
            let docRef = doc(db, "Project Collection", this.projectID);
            let docSnap = await getDoc(docRef);
            let projectData = docSnap.data()
            this.projectName = projectData.projectName;
            this.projectDescription = projectData.projectDescription;

            let hostDetail = {}
            let hostDetails = await getDoc(doc(db, "User Information", "" + projectData.projectHost));
            hostDetail.userId = projectData.projectHost;
            hostDetail.profileImageUrl = hostDetails.data().profileImageUrl;
            tempProjectMember.push(hostDetail);

            for (let i = 0; i < projectData.projectMembers.length; i++) {
                let memberDetails = await getDoc(doc(db, "User Information", "" + projectData.projectMembers[i]));
                let memberDetail = {};
                memberDetail.userId = projectData.projectMembers[i];
                memberDetail.profileImageUrl = memberDetails.data().profileImageUrl;
                tempProjectMember.push(memberDetail);
            }
            this.projectMembers = tempProjectMember;
            this.membersRequired = projectData.membersRequired;
            this.signupDeadline = projectData.signupDeadline.toDate().toDateString();
            this.skillsRequired = projectData.skillsRequired.split(",");
            this.projectStart = projectData.projectStart.toDate().toDateString();
            this.projectEnd = projectData.projectEnd.toDate().toDateString();
            this.pendingMembers = projectData.pendingMembers;
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
        },

        async leaveProject() {
            // Remove the user from the project members list
            this.projectMembers = this.projectMembers.filter(member => member !== this.uid);
            // Update the project document
            const docRef = doc(db, "Project Collection", this.projectID)
            await updateDoc(docRef, {
                projectMembers: this.projectMembers,
            });
            alert("Left project");
        },

        async withdrawApplication() {
            // Remove the user from the pending members list
            this.pendingMembers = this.pendingMembers.filter(member => member !== this.uid);
            // Update the project document
            const docRef = doc(db, "Project Collection", this.projectID)
            await updateDoc(docRef, {
                pendingMembers: this.pendingMembers,
            });
            alert("Withdrawn application");
        },

        visitProfilePage(userId) {
            this.$router.push("/Profile/" + userId);
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
.proj-profile-wrapper {
    height: 100%;
    width:100%;
    background-color: white;
    display:flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: scroll;
}
.heading {
    height: 55%;
    width:100%;
    background-color: #ffece4;
    display:flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.heading img {
    height: 40%;
    width: 100%;
    object-fit: fill;
}

.titleDetail {
    display: flex;
    flex-direction:row;
    justify-content: space-between;
    align-items: center;
    padding:0 10%;
    height:60%;
    width:100%;
}

.titleDetail .title {
    height:100%;
    width:70%;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: left;
    
}

#projTitle {
    font-size: 70px;
    text-align: left;

}

.adminDetails {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: right;
   font-size:15px;
   font-weight: 1000;
   height:100%;
   width:30%;
   gap:15px;
}

.adminDetails h4 {
    font-size:17px;
    font-weight: 700;
    text-align: left;
}

.adminDetails > h4 {
    height: 40px;
}

.host-details {
    display: flex;
   flex-direction: row;
   justify-content: flex-start;
   align-items: center;
   gap:10px;
   height:40px;
}

.host-details img, .members-container img  {
    height:40px;
    width:40px;
    object-fit:cover;
    border-radius: 50%;
    border:1px solid black;
}

.members-details {
    display: flex;
   flex-direction: row;
   justify-content: flex-start;
   align-items: center;
   gap:10px;
   height:40px;
}

.members-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap:5px;
    height:40px;
    overflow: scroll;
}


.buttonsForHost,
.buttonsForMember,
.buttonsForOther,
.buttonForPendingApplication {
    display: flex;
    gap: 50px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
}

button {
    background-color: rgb(255, 111, 0);
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
    justify-content: flex-start;
    align-items: left;
    padding:0 10%;
    gap:30px;
    width: 100%;
}

.detail .description p {
    font-size:20px;
    text-align: left;
}


.detail .skillsRequired h2,  .detail .commitment h2{
    font-size: 25px;
    font-weight: bold;
    text-align: left;
}

#findOutMore {
    color:rgb(255, 157, 0);
    font-size: 20px;
    font-weight: bold;
    background-color: transparent;
    transition: font-size 700ms;
    margin-bottom: 30px;;
}

#findOutMore:hover {
    font-size: 23px;
    background-color: transparent;
    
}

.tags-container {
    height:50px;
    width:100%;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content: flex-start;
    overflow: scroll;
}

.tags {
    height:30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color:black;
    background-color: rgb(181, 174, 174);
    padding: 0px 10px;
    margin-right: 10px;
}


</style>
