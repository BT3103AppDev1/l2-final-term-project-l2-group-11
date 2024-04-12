<script>
import firebaseApp from '../Firebase.js';
import {getFirestore, doc, getDoc, setDoc} from 'firebase/firestore';
import {getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const db = getFirestore(firebaseApp);

export default {
    props: ['userId'],
    data() {
        return {
            pageBackgroundColor: '#FDF8F6',

            imageSrc: null, // Used for storing the image data URL for preview
            imageUrl: null,            
            formData: {
                name: '',
                skills: '',
                interests: '',
                shortBio: '',
                description: '',
                linkedin: '',
                instagram: '',
                telegram: '',
            },
            
            documentData: null,
        }
    },

    mounted() {
        console.log(this.userId);
        this.setBodyBackGroundColor(this.pageBackgroundColor);
        this.fetchDocumentData();
    },

    methods: {
        setBodyBackGroundColor(color) {
            //apply background color to the body of the webpage
            document.body.style.backgroundColor = color;
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
                this.imageSrc = e.target.result; 
            };

            reader.onloadend = async () => {
                // This should be called when the reader has finished reading the file
                try {
                    const downloadURL = await this.uploadImage(file);
                    if (downloadURL) {
                        this.imageUrl = downloadURL; 
                        const docRef = doc(db, 'User Information', this.userId);
                        await setDoc(docRef, {
                            profileImageUrl: downloadURL, // Save the image URL in Firestore
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
            const imageRef = storageRef(storage, 'profileImages/' + this.userId + '/' + file.name);
        
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

        
        async fetchDocumentData() {
            const docRef = doc(db, 'User Information', this.userId);
            
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                // Document found, set data to component
                this.documentData = docSnap.data();
                } else {
                console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        },

        async submitForm(event) {

            event.preventDefault();
            // Check if we have a userId, if not, we shouldn't proceed
            if (!this.userId) {
                console.error('No user ID found, cannot update document');
                return;
            }

            const docRef = doc(db, 'User Information', this.userId);

            // Reference the user's document using the userId
            try {
                await setDoc(docRef, {
                name: this.formData.name,
                skills: this.formData.skills,
                interests: this.formData.interests,
                shortBio: this.formData.shortBio,
                description: this.formData.description,
                linkedin: this.formData.linkedin,
                instagram: this.formData.instagram,
                telegram: this.formData.telegram,
                filledQuestionaire: true,
            }, {merge: true}); //merge true is used to not update the elements that are already in the document
            console.log("document successfully updated!")
            alert("Your Profile has been Successfully Created!")

            //after user clicks on save button, navigate him to the profile page.
            this.$router.push({name: 'Profile', params: {userId: this.userId}});
        } catch(error) {
            console.error('Error updating document: ', error);
        }
            // location.reload();
            // } catch (error) {
            //     console.error('Error updating document: ', error);
            // }

        }
    }
}


</script>

<template>

    <div class = "main-container">
        <div class = "title-container"> 
            <h3>Tell Us <span class = "title-orange">More</span> About <span class = "title-orange">You!</span></h3>
        </div>

        <div class = "profileSection">

            <!-- <div id = "photo-placeholder">
                <h2>p</h2>
            </div> --> 

            <div id="photo-placeholder">
                <img v-if="imageSrc" :src="imageSrc" alt="Profile Preview">
                <h2 v-else>p</h2>
            </div>
            
            <button id = "addPhotoButton" @click = "triggerFileUpload">
                Add a photo
            </button>

        </div>

        <!-- Hidden file input -->
        <input type = "file" id = "photoUpload" ref = "photoUpload" @change = "handleFileUpload($event)" style = "display: none;">


        <form @submit.prevent = "submitForm($event)"> 
           
                <div class = "form-heading">
                    <h4>Profile</h4>
                </div>
                <div id = "name">
                    <label for = "name">Name: </label>
                    <input type = "text" id = "name" v-model = "formData.name" required placeholder = "Enter your name">
                </div>
                <div id = "skills">
                    <label for = "skills">Skills (separate by commas): </label>
                    <input type = "text" id = "skills" v-model = "formData.skills" required placeholder = "Enter your skills">
                </div>
                <div id = "interests">
                    <label for = "interests">Interests (separate by commas): </label>
                    <input type = "text" id = "interests" v-model = "formData.interests" required placeholder = "Enter your interests">
                </div>
                <div id = "shortBio">
                    <label for = "shortBio">Short Bio (less than 30 words): </label>
                    <input type = "text" id = "shortBio" v-model = "formData.shortBio" required placeholder = "Enter details about yourself here">
                </div>

                <div id = "description">
                    <label for = "description"> Describe Yourself: </label>
                    <input type = "text" id = "description" v-model = "formData.description" required placeholder = "Enter details about yourself here">
                </div>
                
                <div class = "form-heading">
                    <h4>Social Media</h4>
                </div>
                <div id = "linkedin">
                    <label for = "linkedin">Linkedin Profile Link (optional) </label>
                    <input type = "text" id = "linkedin" v-model = "formData.linkedin" placeholder = "Enter your LinkedIn profile link here">
                </div>

                <div id = "instagram">
                    <label for = "instagram">Instagram Profile Link (optional) </label>
                    <input type = "text" id = "instagram" v-model = "formData.instagram" placeholder = "Enter your Instagram profile link here">
                </div>

                <div id = "telegram">
                    <label for = "telegram">Telegram Profile Link (optional): </label>
                    <input type = "text" id = "telegram" v-model = "formData.telegram" placeholder = "Enter your Telegram profile link here">
                </div>
         
            <button type = "submit" id = "saveButton"> Save </button>


        </form>


    </div>
        
   


</template>

<style scoped>

.main-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.title-container{
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 50px;
  margin-top: 10px;
}

.title-orange {
    color:orange;
}

.profileSection {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    height:230px;
    width:100%;
}

.main-container form {
    width:600px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

#photo-placeholder {
    width: 150px;
    height: 150px;
    border-radius: 50%; /* Keeps the circular shape */
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
}

#photo-placeholder img {
    height:100%;
    width:100%;
    object-fit:contain;
    border-radius: 50%;
    /*
    width: 100%; /* Make image fill the container 
    height: auto; /* Maintain aspect ratio 
    top: 50%; /* Align the top edge of the image in the center of the container 
    left: 50%; /* Align the left edge of the image in the center of the container 
    transform: translate(-50%, -50%); /* Offset the image back to center properly 
    */
    
}

#addPhotoButton {
    background-color: #FF6A3D; /* Orange background color */
    color: white; /* White text */
    font-weight: bold; /* Make the text bold */
    border: none; /* No border */
    border-radius: 10px; /* Rounded corners */
    text-transform: uppercase; /* Uppercase text */
    cursor: pointer; /* Change mouse pointer to indicate button */
    font-size: 20px;
    margin-top:15px;
    height:40px;
    text-align: center;
}

#addPhotoButton:hover {
    background-color: orange;
}

.profileSection {
    display: flex;
    flex-direction: column;
    margin: auto; /* Center the section itself */
    width: fit-content; /* Shrink the width to fit its content */
    margin-top: 2%;
    justify-content: center;
    text-align: center;
    align-content: center;
    margin-bottom:15px;
}

.form-heading {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width:100%;
    margin-top:10px;
    margin-bottom:10px;
}

.form-heading h4 {
    font-size:30px;
    color:orange;
    text-align:left;
    font-weight:bold;
}


form label {
  margin-bottom: 5px;
  width: 100%;
  font-size: 17px;
  text-align: left;
}


form input {
  width: 100%; 
  height:40px;
  border-radius: 5px;
  border:1px solid black;
}


form div {
    display:flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    width:600px;
}

#saveButton {
    background-color: #FF6A3D; /* Orange background color */
    color: white; /* White text */
    font-weight: bold; /* Make the text bold */
    border-radius: 5px; /* Rounded corners */
    text-transform: uppercase; /* Uppercase text */
    cursor: pointer; /* Change mouse pointer to indicate button */
    font-size: 15px; /* Button text size */
    height:40px;
    width:80px;
    border:none;
    margin-bottom:20px;
    margin-top:20px;
}

#saveButton:hover {
    background-color: orange;
}

</style>