<template>
    <div class = "create-project-wrapper">
    <h1>Ignite <span style="color:black">your</span> passion</h1>

    <div class="backgroundImage-wrapper">
        <img id="backgroundImage" v-if="projectBackground" :src="projectBackground" alt="not found">
        <img id="backgroundImage" v-else src="../assets/CpppImage.png" alt="not found">
        <button id="addBackground" @click="triggerFileUploadForBackground">Add Background</button>
        <!-- Hidden file input -->
        <input type="file" id="backgroundUpload" ref="backgroundUpload" @change="handleBackgroundUpload($event)"
            style="display: none;">
    </div>

    <div class="container">
        <div class="left-side">
            <div class="thumbnail">
                <div class="thumbnailImage">
                    <img id="thumbnail" v-if="projectImage" :src="projectImage" alt="not found">
                    <img id="thumbnail" v-else src="../assets/CpppThumbnail.png" alt="not found">
                </div> 
                <div class="addThumbnailButton">
                    <button id="addThumbnail" @click="triggerFileUpload">Add Thumbnail</button>
                </div>
                <!-- Hidden file input -->
                <input type="file" id="photoUpload" ref="photoUpload" @change="handleFileUpload($event)"
                    style="display: none;">
            </div>
            <div class="description">
                <h3>Description</h3>
                <textarea id="description" required v-model="projectDescription"></textarea>
            </div> 
        </div>

        <div class="right-side">
            <div class="projectName">
                <h3>Project Name (Max 50 characters)</h3>
                <textarea id="projectName" required v-model="projectName" maxlength="50"></textarea>
            </div> 

            <div class="skill">
                <h3>Skills (Add a comma between each skill)</h3>
                <textarea id="skill" required v-model="skillsRequired"></textarea>
            </div>

            <div class="membersRequired">
                <h3>Number of Members</h3>
                <textarea id="membersRequired" required v-model="membersRequired"></textarea>
            </div> 

            <div class="signUpDeadline">
                <h3>Sign Up Deadline</h3>
                <input type="date" id="signUpDeadline" required v-model.lazy="signupDeadline">
            </div> 

            <div class="projectStart">
                <h3>Project Start Date</h3>
                <input type="date" id="projectStart" required v-model.lazy="projectStart">
            </div> 

            <div class="projectEnd">
                <h3>Project End Date</h3>
                <input type="date" id="projectEnd" required v-model.lazy="projectEnd">
            </div> 

            <div class="findOutMore">
                <h3>Link</h3>
                <textarea id="findOutMore" v-model="findOutMore"></textarea>
            </div>
        </div>
    </div> 

    <div class="launchProj">
        <button id = "launchProj-button" @click="saveChanges(), this.$router.push({ name: 'ProjProfile', params: { id: this.$route.params.id } })"
            :disabled="projectEnd === null || projectStart === null || signupDeadline === null || skillsRequired == '' || membersRequired == '' || projectDescription == '' || projectName == ''">Save Changes</button>
    </div>
</div>
</template>

<script>
import firebaseApp from '../Firebase.js'
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
const db = getFirestore(firebaseApp);

export default {
    name: 'EditProjectProfile',

    data() {
        return {
            projectName: "",
            projectDescription: "",
            skillsRequired: "",
            membersRequired: "",
            signupDeadline: null,
            findOutMore: "",
            projectHost: "",
            projectMembers: [],
            projectID: "",
            projectImage: null,
            projectThumbnailUrl: null,
            projectBackground: "",
            projectStart: null,
            projectEnd: null,
            pendingMembers: []
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
            this.skillsRequired = projectData.skillsRequired;
            this.pendingMembers = projectData.pendingMembers;
            this.findOutMore = projectData.Find_Out_More;
            this.projectImage = projectData.projectImage;
            this.projectBackground = projectData.projectBackground;
            let projectEndTimestampToDate = new Date(projectData.projectEnd.seconds * 1000);
            let projectStartTimestampToDate = new Date(projectData.projectStart.seconds * 1000);
            let signupDeadlineTimestampToDate = new Date(projectData.signupDeadline.seconds * 1000);
            this.projectEnd = "" + projectEndTimestampToDate.getFullYear() + "-" + (Math.floor(projectEndTimestampToDate.getMonth() / 10) === 0 ? "0" + projectEndTimestampToDate.getMonth() : projectEndTimestampToDate.getMonth()) + "-" + (Math.floor(projectEndTimestampToDate.getDay() / 10) === 0 ? "0" + projectEndTimestampToDate.getDay() : projectEndTimestampToDate.getDay());
            this.projectStart = "" + projectStartTimestampToDate.getFullYear() + "-" + (Math.floor(projectStartTimestampToDate.getMonth() / 10) === 0 ? "0" + projectStartTimestampToDate.getMonth() : projectStartTimestampToDate.getMonth()) + "-" + (Math.floor(projectStartTimestampToDate.getDay() / 10) === 0 ? "0" + projectStartTimestampToDate.getDay() : projectStartTimestampToDate.getDay());
            this.signupDeadline = "" + signupDeadlineTimestampToDate.getFullYear() + "-" + (Math.floor(signupDeadlineTimestampToDate.getMonth() / 10) === 0 ? "0" + signupDeadlineTimestampToDate.getMonth() : signupDeadlineTimestampToDate.getMonth()) + "-" + (Math.floor(signupDeadlineTimestampToDate.getDay() / 10) === 0 ? "0" + signupDeadlineTimestampToDate.getDay() : signupDeadlineTimestampToDate.getDay());
        },

        convertDateToTimestamp(dateStr) {
            // Assuming dateStr is in "YYYY-MM-DD"
            const parts = dateStr.split("-"); // Split the string into parts
            const date = new Date(parts[0], parts[1] - 1, parts[2]); // Create a new Date object, note months are 0-indexed

            return Timestamp.fromDate(date); // Convert the Date object to a Firestore Timestamp
        },


        async saveChanges() {
            console.log("IN LP")
            alert("Saving changes to your project")

            try {
                const docRef = await updateDoc(doc(db, "Project Collection", this.projectID), {
                    projectName: this.projectName, projectDescription: this.projectDescription, skillsRequired: this.skillsRequired,
                    Find_Out_More: this.findOutMore, membersRequired: parseInt(this.membersRequired), projectStart: this.convertDateToTimestamp(this.projectStart),
                    projectEnd: this.convertDateToTimestamp(this.projectEnd), signupDeadline: this.convertDateToTimestamp(this.signupDeadline), projectID: this.projectID, projectHost: this.projectHost,
                    projectMembers: this.projectMembers, projectImage: this.projectImage, projectBackground: this.projectBackground,
                    projectImage: this.projectImage, projectThumbnailUrl: this.projectThumbnailUrl
                });
            }
            catch (error) {
                console.error("Error saving document: ", error);
            }
        },

        triggerFileUpload() {
            // Trigger the hidden file input when the button is clicked
            this.$refs.photoUpload.click();
        },

        // Handle the file being selected
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Proceed to read and upload the file
                this.previewImage(file);
            }
        },

        // Function to read the file and display a preview
        async previewImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.projectImage = e.target.result;
            };

            reader.onloadend = async () => {
                // This should be called when the reader has finished reading the file
                try {
                    const downloadURL = await this.uploadImage(file);
                    if (downloadURL) {
                        this.projectThumbnailUrl = downloadURL;
                        const docRef = doc(db, 'Project Collection', this.projectID);
                        await setDoc(docRef, {
                            projectImage: downloadURL, // Save the image URL in Firestore
                        }, { merge: true });
                        console.log("Firestore document updated with image URL");
                    }
                } catch (error) {
                    console.error("Error updating Firestore document or uploading image: ", error);
                }
            };
            reader.readAsDataURL(file); // Start reading the file
        },

        //handles the upload of the image to Firebase Storage.
        async uploadImage(file) {
            const storage = getStorage(firebaseApp);
            const imageRef = storageRef(storage, 'projectImages/' + this.projectID + '/' + file.name);

            try {
                // Upload the file to Firebase Storage
                const snapshot = await uploadBytes(imageRef, file);

                // Return the download URL
                const downloadURL = await getDownloadURL(snapshot.ref);
                return downloadURL;
            } catch (error) {
                console.error("Failed to upload image: ", error);
                throw error;
            }
        },

        triggerFileUploadForBackground() {
            // Trigger the hidden file input when the button is clicked
            this.$refs.backgroundUpload.click();
        },

        handleBackgroundUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Proceed to read and upload the file
                this.previewBackground(file);
            }
        },

        // Function to read the file and display a preview
        async previewBackground(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.projectBackgroundPreview = e.target.result;
            };

            reader.onloadend = async () => {
                const downloadURL = await this.uploadBackground(file);
                if (downloadURL) {
                    this.projectBackground = downloadURL;
                }
            };
            reader.readAsDataURL(file); // Start reading the file
        },

        //handles the upload of the image to Firebase Storage.
        async uploadBackground(file) {
            const storage = getStorage(firebaseApp);
            const imageRef = storageRef(storage, 'projectBackground/' + this.projectID + '/' + file.name);

            try {
                // Upload the file to Firebase Storage
                const snapshot = await uploadBytes(imageRef, file);

                // Return the download URL
                const downloadURL = await getDownloadURL(snapshot.ref);
                return downloadURL;
            } catch (error) {
                console.error("Failed to upload image: ", error);
                throw error;
            }
        },
    },

    mounted() {
        this.fetchProjectDetails();
    }
}
</script>

<style scoped>
.create-project-wrapper {
    display:flex;
    flex-direction:column;
    height:100%;
    width:100%;
    justify-content: flex-start;
    align-items:center;
    gap:20px;
}
h1 {
    width:100%;
    text-align: center;
    font-size: 50px;
    color: #f5793b;
    font-weight:500;
}

h3 {
    font-size: 20px;
    color: #f5793b;
}

.backgroundImage-wrapper {
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items:center;
    height:320px;
    width:100%;
}

#backgroundImage {
    height: 200px;
    width: 1300px;
    margin-bottom:20px;
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: top;
    width:1300px;
}

.left-side {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: left;
    width:600px;
    gap:5px;
}

.thumbnail {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width:100%;
}

.thumbnailImage {
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.thumbnailImage img {
    height: 180px;
    width: 300px;
    object-fit: contain;
}

.right-side {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: left;
    width:600px;
    gap:5px;
}

.right-side input {
    font-size: 25px;
    border:1px solid orange;
}

.right-side textarea {
    height:50px;
}


#description {
    height: 300px;
    width:100%;
}

button {
    background-color: #f5793b;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    padding:15px;
    width:200px;
    font-size: 18px;
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
    height: 40px;
    resize: none;
    outline: none;
    width: 600px;
    font-size: 18px;
    padding: 15px;
    border-radius: 3px;
    border: 1px solid orange;
    background-color: white;
}

#launchProj-button:disabled {
    background-color: gray;
}

#launchProj-button {
    margin-bottom: 20px;
}
</style>