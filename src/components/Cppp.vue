<template>
    <h1>Ignite <span style="color:black">your</span> passion</h1><br>
    <div>
        <img src="../assets/CpppImage.png" alt="error" class="center-image">
    </div> <br> <br>

    <div class="container1">
        <div class="left">
            <button id="addBackground">Add Background</button> <br><br><br>
            <img src="../assets/CpppThumbnail.png" alt="error"> <br><br><br>
            <button id="addThumbnail">Add Thumbnail</button>
        </div>

        <div class="right">
            <div class="projectTitle">
                <h3>Project Title</h3>
                <textarea id="projectTitle" required v-model="projectTitle"></textarea>
            </div> <br>

            <div class="description">
                <h3>Description</h3>
                <textarea id="description" required v-model="projectDescription"></textarea>
            </div> <br>

            <div class="skill">
                <h3>Skills</h3>
                <textarea id="skill" required v-model="skillsRequired"></textarea>
            </div>
        </div>
    </div>

    <div class="container2">
        <div class="left2">
            <div class="noOfMember">
                <h3>Number of Members</h3>
                <textarea id="noOfMember" required v-model="noOfMember"></textarea>
            </div> <br>

            <div class="projTimeline">
                <h3>Project Timeline</h3>
                <textarea id="projTimeline" required v-model="projectTimeline"></textarea>
            </div> <br>
        </div>
        <div class="right2">
            <div class="signUpDeadline">
                <h3>Sign Up Deadline</h3>
                <textarea id="signUpDeadline" required v-model="signupDeadline"></textarea>
            </div> <br>

            <div class="findOutMore">
                <h3>Find Out More</h3>
                <textarea id="findOutMore" required v-model="findOutMore"></textarea>
            </div>
        </div>
    </div> <br>
    <div class="launchProj">
        <button @click="launchProject">Launch Project</button>
    </div>


</template>

<script>
import firebaseApp from '../firebase.js'
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
    name: 'Cppp',

    data() {
        return {
            projectTitle: "",
            projectDescription: "",
            skillsRequired: "",
            noOfMember: "",
            projectTimeline: "",
            signupDeadline: "",
            findOutMore: "",
            projectHost: "",
        }
    },

    methods: {
        async launchProject() {
            console.log("IN LP")
            alert(" Launching your project : " + projectTitle)

            try {
                const docRef = await setDoc(doc(db, "Project Collection", String(this.projectTitle)), {
                    Project_Title: this.projectTitle, Description: this.projectDescription, Skills_Required: this.skillsRequired,
                    Find_Out_More: this.findOutMore, Number_of_Members: this.noOfMember, Project_Timeline: this.projectTimeline, Sign_Up_Deadline: this.signupDeadline,
                });
                console.log(docRef)
            }
            catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    }
}
</script>

<style scoped>
h1 {
    text-align: center;
    font-size: 45px;
}

.container1 {
    display: flex;
}

.container2 {
    margin-left: 9%;
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.left {
    margin-left: 9%;
    flex-direction: column;
    width: 40%;
}

.right {
    flex-direction: column;
}

.left2 {
    width: 44%;
}

.right2 {
    width: 47%;
}

.center-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

button {
    background-color: #f5793b;
    border: none;
    color: white;
    padding: 20px;
    width: 200px;
    text-align: center;
    text-decoration: none;
    font-size: 18px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 3px;
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

textarea {
    resize: none;
    outline: none;
    font-size: 18px;
    padding: 20px;
    border-radius: 3px;
    border: none;
    background-color: rgb(212, 211, 211);
}

#projectTitle,
#description,
#skill {
    width: 460px;
}

#noOfMember,
#projTimeline,
#signUpDeadline,
#findOutMore {
    width: 460px;
}

h1 {
    color: #f5793b;
}

h3 {
    font-size: 20px;
    color: #f5793b;
}

.launchProj {
    margin-left: 9%;
}
</style>
