<script>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
    import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage';
    import firebaseApp from '../Firebase.js';

    export default {
        props: ['userId'],


        setup(props, { emit }) {
            const route = useRoute();
            const router = useRouter();

            const profileImageUrl = ref('');

            const db = getFirestore(firebaseApp);
            const storage = getStorage(firebaseApp);


            onMounted(async () => {
                const userDocRef = doc(db, 'User Information', props.userId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists() && userDocSnap.data().profileImageUrl) {
                    profileImageUrl.value = userDocSnap.data().profileImageUrl;
                } else {
                    // Use a specific path if your default image is at a known, fixed path
                    const defaultImageRef = storageRef(storage, 'path/to/your/default/image.jpg');
                    profileImageUrl.value = await getDownloadURL(defaultImageRef);
                }
            });

            const userId = route.params.userId; // or use props if you're passing props
            const formData = ref({
                name: '',
                skills: '',
                interests: '',
                shortBio: '',
                description: '',
                linkedin: '',
                instagram: '',
                telegram: '',
            });

            const fetchUserData = async () => {
                const docRef = doc(db, 'User Information', userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Fill formData with existing data
                    Object.assign(formData.value, docSnap.data());
                }
            };

            const saveProfile = async () => {
                // Add the new profile image URL to formData before saving.
                formData.value.profileImageUrl = profileImageUrl.value;
                const docRef = doc(db, 'User Information', userId);
                await updateDoc(docRef, formData.value);
                console.log(profileImageUrl.value);
                emit('profile-updated', profileImageUrl.value);
                router.push({ name: 'Profile', params: { userId } });
            };

            onMounted(fetchUserData);

            //function to handle the image upload.

            const handleImageUpload = async (event) => {
                const file = event.target.files[0];
                if(!file) return;

                const imageRef = storageRef(storage, `profileImages/${props.userId}/${file.name}`);
                try {
                    const snapshot = await uploadBytes(imageRef, file);
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    profileImageUrl.value = downloadURL;
                    // Update Firestore with the new image URL
                    const docRef = doc(db, 'User Information', props.userId);
                    await updateDoc(docRef, { profileImageUrl: downloadURL });
                } catch (error) {
                    console.error("Error uploading image: ", error);
                }
            }

            return {
                formData,
                saveProfile,
                profileImageUrl,
                handleImageUpload,
            };
        }
    }

</script>

<template>
    <div class = "main-container">

        <div class = "title-container"> 
            <h3>We Heard You Want to <span class = "title-orange">Edit</span> Your <span class = "title-orange">Profile!</span></h3>
        </div>

        <div class = "profileSection">

        <div id="photo-placeholder">
            <img :src="profileImageUrl" alt="Profile Image">
        </div>

        <input type="file" ref="fileInput" @change="handleImageUpload" style="display: none;">
        <button id = "addPhotoButton" @click="$refs.fileInput.click()">Edit Image</button>

        </div>

        <form @submit.prevent="saveProfile"> 
           
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
               <label for = "shortBio">Short Bio (Max 150 characters): </label>
               <input type = "text" id = "shortBio" v-model = "formData.shortBio" maxlength="150" placeholder = "Enter details about yourself here">
           </div>

           <div id = "description">
                <label for = "description"> Describe Yourself (Max 600 characters)</label>
                <textarea type = "text" id = "description" v-model = "formData.description" maxLength = "600" required placeholder = "Enter details about yourself here"></textarea>
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
            <button type = "submit" id = "saveButton"> Save Changes </button>
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
  width: 100%; 
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
    border-radius: 5px; /* Rounded corners */
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

form textarea {
    width: 100%; 
    height:150px;
    border-radius: 5px;
    border:1px solid black;
    resize:none;
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
    width:120px;
    border:none;
    margin-bottom:20px;
    margin-top:20px;
}

#saveButton:hover {
    background-color: orange;
}

</style>
