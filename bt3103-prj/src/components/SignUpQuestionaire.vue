<script>
import app from '../firebase.js';
import {getFirestore} from 'firebase/firestore';
import {doc, getDoc, setDoc} from 'firebase/firestore';

const db = getFirestore(app);

export default {
    data() {
        return {
            pageBackgroundColor: '#FDF8F6',
            
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
            
            documentData: null
        }
    },

    mounted() {
        this.setBodyBackGroundColor(this.pageBackgroundColor);
        this.fetchDocumentData();
    },

    methods: {
        setBodyBackGroundColor(color) {
            //apply background color to the body of the webpage
            document.body.style.backgroundColor = color;
        },
        
        async fetchDocumentData() {
            const docRef = doc(db, 'User Information', 'testUser');
            
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
        }
    }
}


</script>

<template>
        
    <div class = "title-container"> 
        <h1>Tell Us More About You!</h1>
    </div>

    <div class = "profileSection">
<!-- 
        <div id = "profileHeader">
            <h2>Profile</h2>
        </div> -->

        <div id = "photo-placeholder">
            <h2>p</h2>
        </div>
        
        <button id = "addPhotoButton">
            Add a photo
        </button>

    </div>

    <!-- <div id = "connectStatement">
            Connect With Others
    </div> -->

    <form>
        <div class = "input-group">
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

            <div id = "linkedin">
                <label for = "linkedin">Linkedin Profile Link (optional) </label>
                <input type = "text" id = "linkedin" v-model = "formData.linkedin" required placeholder = "Enter your LinkedIn profile link here">
            </div>

            <div id = "instagram">
                <label for = "instagram">Instagram Profile Link (optional) </label>
                <input type = "text" id = "instagram" v-model = "formData.instagram" required placeholder = "Enter your Instagram profile link here">
            </div>

            <div id = "telegram">
                <label for = "telegram">Telegram Profile Link (optional): </label>
                <input type = "text" id = "telegram" v-model = "formData.telegram" required placeholder = "Enter your Telegram profile link here">
            </div>
        </div>

        <button type = "submit" id = "saveButton"> Save </button>
    </form>

    <div v-if="documentData">
      <h2>Document Information</h2>
      <p> E-mail: {{ documentData.Email }}</p>
      <p> Password: {{ documentData.Password }}</p>

    </div>
</template>

<style scoped>

/*to remove all justify content and align-items center for proper alignment. */
.title-container{
  width: 200%; 
  margin-left: 10%; 
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 50px;
}

#profileHeader {
    margin-bottom: 10px;
    color: #F5793B;
    font-size: 40px;
}


#photo-placeholder {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 2%;
}

/* #connectStatement {
    border: 5px solid;
    margin-top: 10%;
    margin-right: -150%;
    margin-left: 150%;
    font-size: 40px;
    color: #F5793B;
    align-items: center;
    justify-content: center;
} */

#addPhotoButton {
    background-color: #FF6A3D; /* Orange background color */
    color: white; /* White text */
    font-weight: bold; /* Make the text bold */
    border: none; /* No border */
    border-radius: 20px; /* Rounded corners */
    padding: 10px 20px; /* Top/bottom padding of 10px and left/right padding of 20px */
    text-transform: uppercase; /* Uppercase text */
    cursor: pointer; /* Change mouse pointer to indicate button */
    font-size: 2rem; /* Button text size */
    outline: none; /* Remove focus outline */
    transition: background-color 0.3s ease;
}

.profileSection {
    margin-top: 10%;
    margin-left: 70%;
    float: left;
    justify-content: center;
    text-align: center;
    align-content: center;
    margin-bottom: 10%;
}

.input-group {
    margin-bottom: 1rem; /* Spacing between form groups */
}

label {
    font-size: 28px;
}

input[type="text"] {
  border: 2px solid #ccc; 
  border-radius: 50px; 
  padding: 8px; 
  font-size: 2rem; 
  width: 250%;
  margin-bottom: 5%;
}

#saveButton {
    background-color: #FF6A3D; /* Orange background color */
    color: white; /* White text */
    font-weight: bold; /* Make the text bold */
    border: none; /* No border */
    border-radius: 20px; /* Rounded corners */
    padding: 10px 20px; /* Top/bottom padding of 10px and left/right padding of 20px */
    text-transform: uppercase; /* Uppercase text */
    cursor: pointer; /* Change mouse pointer to indicate button */
    font-size: 2rem; /* Button text size */
    outline: none; /* Remove focus outline */
    transition: background-color 0.3s ease;
    margin-left: 110%
}

form {
    margin-top: 60%;
    margin-right: 30%;
    margin-left: -50%;
}





</style>

