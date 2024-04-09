<script>
import firebaseApp from '../Firebase.js';
import { ref, onMounted } from 'vue';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';


export default {

    props: ['userId'],

    data() {

        return {
            // pageBackgroundColor: '#FDF8F6' 
            
        };

    },

    methods: {

        //method to trigger file input
        triggerEditProfileUpload() {
            this.$refs.editProfileUpload.click();
        },

        //method to handle the file selection
        async handleEditProfileUpload(event) {
            const file = event.target.files[0];
            if (!file) {
                //handle the case where no files were selected
                return;
            }

            try {
                const storage = getStorage(firebaseApp);
                const imageRef = storageRef(storage, 'profileImages/' + this.userId + '/' + file.name);
                const snapshot = await uploadBytes(imageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Save the image URL in Firestore
                const docRef = doc(getFirestore(), 'User Information', this.userId);
                await setDoc(docRef, { profileImageUrl: downloadURL }, { merge: true });

                // Update the userData reactive property
                this.userData.profileImageUrl = downloadURL;

            } catch(error) {
                console.error("Error uploading image: ", error);
            }
        },
    },

    setup(props) {


        const userData = ref({}); // This will hold our user data
        // const userId = 'theUserIdFromAuth'; // You'll get this from your auth state

        const icons = ref({
            linkedin: '',
            instagram: '',
            telegram: ''
        });

        const storage = getStorage(firebaseApp);

    //load user data while page loads
        onMounted(async () => {
            console.log(props.userId);
            const db = getFirestore();
            const docRef = doc(db, 'User Information', props.userId);  
            //of the authentication state of the page. e.g. whether the user is logged in 
            
            try{
                const linkedinIconRef = storageRef(storage, 'LinkedIn.png');
                const instagramIconRef = storageRef(storage, 'Instagram.jpeg');
                const telegramIconRef = storageRef(storage, 'Telegram.png');

                icons.value.linkedin = await getDownloadURL(linkedinIconRef);
                icons.value.instagram = await getDownloadURL(instagramIconRef);
                icons.value.telegram = await getDownloadURL(telegramIconRef);

                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("successful")
                    userData.value = docSnap.data();
                    userData.value.interestsArray = userData.value.interests.split(', ');
                    userData.value.skillsArray = userData.value.skills.split(', ');

                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error("Error getting document:", error);
            }

        });

        return {
            userData,
            icons,
            // triggerEditProfileUpload,
            // handleEditProfileUpload
        };
    },
    }
    </script>


<template>
    <div class = 'main-container'>

        <div id = "profile-section">

            <div id = photo-userbio> 
                <div id = photo-editButton>
                    <div id="photo-placeholder">
                        <img v-if="userData.profileImageUrl" :src="userData.profileImageUrl" alt="Profile Preview">
                        <h2 v-else>p</h2>
                    </div>
                    <button id = "edit-profile" @click = "triggerEditProfileUpload"> Edit Profile </button>
                    <!-- Hidden file input for editing profile -->
                    <input type="file" id="editProfileUpload" ref="editProfileUpload" @change="handleEditProfileUpload" style="display: none;">
                </div>


                <div id = "username-bio">
                    <div v-if = "userData">
                    <h1 :class = "{'strong-bold': userData.name}">{{ userData.name }} </h1><!-- display username-->
                    </div>
                    <div v-if = "userData">
                        <h3> Short Bio: {{ userData.shortBio }} </h3>
                    </div>
                </div>
            </div>

            <div id = "socialMediaWrapper"> <!--to wrap the social media icons on the rhs-->
                <div id = "skills-description">
                    <div id="skills-interests">
                        <div class="interests">
                            <h2>Interests</h2>
                            <div class="tags">
                                <span v-for="interest in userData.interestsArray" :key="interest">{{ interest }}</span>
                            </div>
                        </div>
                        <div class="skills">
                            <h2>Skills</h2>
                            <div class="tags">
                                <span v-for="skills in userData.skillsArray" :key="skills">{{ skills }}</span>
                            </div>
                        </div>
                    </div>

                    <div id = description> 
                        <h1>Description</h1>
                        <div v-if = "userData">
                            <h3> {{ userData.description }}</h3>
                        </div>

                    </div>

                </div> <!--end of skills description-->


                <div class = "socialMediaIconsHeading">

                    <button id = 'reviewsButton'>Reviews</button>

                    <h2 class="socialMediaHeading">Social Media</h2> <!-- Heading for the icons -->

                    <div class = "socialMediaIcons"> 
                        <a v-if = "userData.linkedin" :href= "userData.linkedin" target = "_blank">
                            <img :src = "icons.linkedin" alt = "LinkedIn" />
                        </a>

                        <!-- Instagram -->
                        <a v-if="userData.instagram" :href="userData.instagram" target="_blank">
                            <img :src="icons.instagram" alt="Instagram">
                        </a>

                        <!-- Telegram -->
                        <a v-if="userData.telegram" :href="userData.telegram" target="_blank">
                            <img :src="icons.telegram" alt="Telegram">
                        </a>

                </div> 

                </div>
               
            </div> <!--end of social media wrapper-->

        
        </div> <!--end of profile section-->


        <div id = "project-container">

        </div>


    </div> <!--end of main container-->
</template>


<style scoped>

.main-container {
    display: flex;
    flex-direction: column; /* Stack children vertically */
    /* justify-content: space-between; */
    min-height: 100vh; /* Minimum height to fill the viewport */
    padding-top: 20px; /* Add padding at the top if needed */

}

#photo-userbio {
    display: flex;
    flex-direction: row;
}

#project-container {
    display:flex;
    flex-direction: column;
    color: white;
    min-height: 100vh;
}

#profile-section {
    display: flex;
    flex-direction: column; 
    align-items: flex-start;
    background-color: #FDF8F6;
    width: 3000px;
    height: 950px;
}

#username-bio {
    margin-left: 80px;
    font-size: 35px;
    margin-top: 50px;
    margin-bottom: 500px;
}

.strong-bold {
    font-weight:650;
}

#project-container {
    background-color: white;
    height: 500px;
}

#photo-editButton {
    display: flex;
    flex-direction: column; /* Stack the children (image and button) vertically */
    align-items: center; /* Center align the children */
    justify-content: center; /* Align children to the start of the flex container */
    margin-left: 200px;
    margin-bottom: 550px;
}

#photo-placeholder {
    width: 250px;
    height: 250px;
    border-radius: 50%; /* Keeps the circular shape */
    background-color: #ccc;
    border: 5px solid black;
    margin-top: 60px;
    margin-bottom: 10px;
    overflow: hidden; /* Ensures no overflow outside the circular boundary */
    position: relative; /* Position relative to allow absolute positioning inside */
}

#edit-profile {
    background-color: #FF6A3D; /* Orange background color */
    color: white; /* White text */
    font-weight: bold; /* Make the text bold */
    border: none; /* No border */
    border-radius: 20px; /* Rounded corners */
    padding: 10px 20px; /* Top/bottom padding of 10px and left/right padding of 20px */
    text-transform: uppercase; /* Uppercase text */
    cursor: pointer; /* Change mouse pointer to indicate button */
    font-size: 1.5rem; /* Button text size */
    outline: none; /* Remove focus outline */
    transition: background-color 0.3s ease;
}

.tags span {
  display: inline-block;
  margin: 0.5rem;
  padding: 1rem 3rem;
  background-color: #D9D9D9; /* Example background color */
  color: #333; /* Example text color */
  cursor: default;
  font-size:25px;
}

.interests h2, .skills h2 {
    font-weight:650;
    font-size:35px;
}


#skills-description {
    position: relative;
    display: flex;
    flex-direction: column;
    bottom: 1000px;
    margin-left: 530px;
    margin-top: 450px;
    width: 50%;
    flex-grow: 2; /* give it flexibility to grow as needed */
}

#skills-interests {
    margin-top: 10px;
}

#description {
    margin-top: 30px;
    width: 90%;
}


#description h1 {
    font-weight: 650;
    font-size: 35px
}

#description h3 {
    font-size: 30px
}


#photo-placeholder img {
    width: 100%; /* Make image fill the container */
    height: auto; /* Maintain aspect ratio */
    position: absolute; /* Position it over placeholder */
    top: 50%; /* Align the top edge of the image in the center of the container */
    left: 50%; /* Align the left edge of the image in the center of the container */
    transform: translate(-50%, -50%); /* Offset the image back to center properly */
}

.socialMediaIcons img {
    width: 100px; /* Set a fixed width for all icons */
    height: 100px; /* Set a fixed height for all icons */
    object-fit: contain; /* This ensures that the entire image is visible, scaled to fit within the frame */
    margin: 0 10px; /*add space between each email */ 
}

.socialMediaIcons {
    display: flex;
    justify-content: flex-start;
    text-align: center;
}
.socialMediaHeading {
  font-size: 30px; /* Example font size, adjust as necessary */
  font-weight: bold; /* If you want the heading to be bold */
  margin-bottom: 10px; /* Space between the heading and the icons */
}

.socialMediaIconsHeading {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: flex-start;
    bottom: 500px;
    right: 350px;
}

#socialMediaWrapper {
    display:flex;
    flex-direction: row;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}

#reviewsButton {
    background-color: #FF6A3D; /* Orange background color */
    color: white; /* White text */
    font-weight: bold; /* Make the text bold */
    border: none; /* No border */
    border-radius: 20px; /* Rounded corners */
    padding: 15px 20px; /* Top/bottom padding of 10px and left/right padding of 20px */
    text-transform: uppercase; /* Uppercase text */
    cursor: pointer; /* Change mouse pointer to indicate button */
    font-size: 1.5rem; /* Button text size */
    outline: none; /* Remove focus outline */
    transition: background-color 0.3s ease;
    margin-bottom: 50px;
}

</style>