
<template>
    <h1>Ignite <span style="color:black">your</span> passion</h1><br>
    <div class="background">
        <img id="backgroundImage" v-if="projectBackground" :src="projectBackground" alt="not found">
        <img id="backgroundImage" v-else src="../assets/CpppImage.png" alt="not found">
        <br>
        <button id="addBackground" @click="triggerFileUploadForBackground">Change Background</button>
        <!-- Hidden file input -->
        <input type="file" id="backgroundUpload" ref="backgroundUpload" @change="handleBackgroundUpload($event)"
            style="display: none;">
    </div> <br> <br>

    <div class="container">
        <div class="left-side">
            <div class="thumbnail">
                <div class="thumbnailImage">
                    <img id="thumbnail" v-if="projectImage" :src="projectImage" alt="not found">
                    <img id="thumbnail" v-else src="../assets/CpppThumbnail.png" alt="not found">
                </div> <br>

                <div class="addThumbnailButton">
                    <br> <br>
                    <button id="addThumbnail" @click="triggerFileUpload">Change Thumbnail</button>
                </div> <br>
                <!-- Hidden file input -->
                <input type="file" id="photoUpload" ref="photoUpload" @change="handleFileUpload($event)"
                    style="display: none;">
            </div> <br>
            <div class="description">
                <h3>Description</h3>
                <textarea id="description" required v-model="projectDescription"></textarea>
            </div> <br>
        </div>

        <div class="right-side">
            <div class="projectName">
                <h3>Project Name</h3>
                <textarea id="projectName" required v-model="projectName"></textarea>
            </div> <br>

            <div class="skill">
                <h3>Skills (Add a comma between each skill)</h3>
                <textarea id="skill" required v-model="skillsRequired"></textarea>
            </div> <br>

            <div class="membersRequired">
                <h3>Number of Members</h3>
                <textarea id="membersRequired" required v-model="membersRequired"></textarea>
            </div> <br>

            <div class="signUpDeadline">
                <h3>Sign Up Deadline</h3>
                <input type="date" id="signUpDeadline" required v-model.lazy="signupDeadline">
            </div> <br>

            <div class="projectStart">
                <h3>Project Start Date</h3>
                <input type="date" id="projectStart" required v-model.lazy="projectStart">
            </div> <br>

            <div class="projectEnd">
                <h3>Project End Date</h3>
                <input type="date" id="projectEnd" required v-model.lazy="projectEnd">
            </div> <br>

            <div class="findOutMore">
                <h3>Link</h3>
                <textarea id="findOutMore" required v-model="findOutMore"></textarea>
            </div>
        </div>
    </div> <br>

    <div class="saveChanges">
        <button @click="saveChanges(), $router.push('Project')"
            :disabled="projectEnd === null || projectStart === null || signupDeadline === null || skillsRequired == '' || membersRequired == '' || projectDescription == '' || projectName == ''">Save
            Change</button>
    </div>
</template>

<script>
import firebaseApp from '../Firebase.js'
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc,Timestamp } from "firebase/firestore";
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
        },

        convertDateToTimestamp(dateStr) {
            // Assuming dateStr is in "YYYY-MM-DD"
            const parts = dateStr.split("-"); // Split the string into parts
            const date = new Date(parts[0], parts[1] - 1, parts[2]); // Create a new Date object, note months are 0-indexed

            return Timestamp.fromDate(date); // Convert the Date object to a Firestore Timestamp
        },


        // isValidDate(dateStr) {
        //     const regex = /^\d{2}\/\d{2}\/\d{4}$/; // Checks for the "DD/MM/YYYY" format
        //     if (!dateStr.match(regex)) {
        //         return false; // Returns false if date does not match the format
        //     }

        //     const [day, month, year] = dateStr.split("/").map(Number);
        //     const date = new Date(year, month - 1, day); // Creates a Date object

        //     const now = new Date(); // Current date for comparison
        //     now.setHours(0, 0, 0, 0); // Normalize current date to avoid hour-minute-second comparison

        //     // Check if it's a valid date and not in the past
        //     if (date.getTime() < now.getTime() || date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        //         return false;
        //     }

        //     return true;
        // },

        // compareDates(start, end) {
        //     const [startDay, startMonth, startYear] = start.split("/").map(Number);
        //     const [endDay, endMonth, endYear] = end.split("/").map(Number);

        //     const startDate = new Date(startYear, startMonth - 1, startDay);
        //     const endDate = new Date(endYear, endMonth - 1, endDay);

        //     return endDate > startDate; // True if end date is after start date
        // },

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
h1 {
    text-align: center;
    font-size: 45px;
    color: #f5793b;
}

h3 {
    font-size: 20px;
    color: #f5793b;
}

.background {
    text-align: center;
    overflow: hidden;
}

#backgroundImage {
    height: 200px;
    width: 80%;
}

.thumbnail {
    display: flex;
    gap: 30px;
}

.thumbnailImage {
    width: 50%;
    text-align: right;
    overflow: hidden;
}

.thumbnailImage img {
    height: 180px;
    width: 360px;
    height: auto;
}

.container {
    display: flex;
    margin-left: 10%;
    margin-right: 5%;
    gap: 5%;
}

.right-side {
    width: 50%;
}

#description {
    height: 400px;
}

input {
    font-size: 35px;
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
    height: 50px;
    resize: none;
    outline: none;
    width: 90%;
    font-size: 18px;
    padding: 15px;
    border-radius: 3px;
    border: none;
    background-color: rgb(212, 211, 211);
}

.saveChanges {
    display: flex;
    justify-content: center;
}

.saveChanges button:disabled {
    background-color: gray;
}
</style>
