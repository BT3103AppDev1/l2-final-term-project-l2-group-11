<script>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
    import { getStorage, ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage';
    import firebaseApp from '../Firebase.js';

    export default {
        props: ['userId'],


        setup(props) {
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
    <div class="edit-profile-container">
        <h1>We Heard You Want to Edit Your Profile!</h1>
        
        <div id="photo-placeholder">
            <img :src="profileImageUrl" alt="Profile Image">
            <input type="file" @change="handleImageUpload">

        </div>

        <input type="file" ref="fileInput" @change="handleImageUpload" style="display: none;">
        <button id = "edit-picture" @click="$refs.fileInput.click()">Edit Profile Image</button>

        <form @submit.prevent="saveProfile">
            <label for="name">Name:</label>
            <input id="name" type="text" v-model="formData.name">

            <label for="skills">Skills (comma and space separated):</label>
            <input id="skills" type="text" v-model="formData.skills">

            <label for="interests"> Interests (comma and space separated):</label>
            <input id="interests" type="text" v-model="formData.interests">

            <label for="shortBio"> Short Bio (less than 30 words): </label>
            <input id="shortBio" type="text" v-model="formData.shortBio">

            <label for="description"> Describe Yourself: </label>
            <input id="description" type="text" v-model="formData.description">

            <label for="linkedin"> LinkedIn Profile Link: </label>
            <input id="linkedin" type="text" v-model="formData.linkedin">

            <label for="instagram"> Instagram Profile Link: </label>
            <input id="instagram" type="text" v-model="formData.instagram">

            <label for="telegram"> Telegram Profile Link: </label>
            <input id="telegram" type="text" v-model="formData.telegram">

            <button type="submit">Save Changes</button>
        </form>
    </div>
</template>

<style scoped>



.edit-profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 30px;
    font-weight: bolder;
}

.edit-profile-container form {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    width: 100%;
    font-size: 20px;
}

.edit-profile-container input{
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 25px;
    margin-bottom: 20px;

}

.edit-profile-container label{
    font-size: 25px;

}

.edit-profile-container button{
    background-color: #FF6A3D; /* Orange background color */
    color: white; /* White text */
    font-weight: bold; /* Make the text bold */
    border: none; /* No border */
    border-radius: 20px; /* Rounded corners */
    padding: 10px 20px; /* Top/bottom padding of 10px and left/right padding of 20px */
    text-transform: uppercase; /* Uppercase text */
    cursor: pointer; /* Change mouse pointer to indicate button */
    font-size: 30px; /* Button text size */
    outline: none; /* Remove focus outline */
    transition: background-color 0.3s ease;
    margin: auto;
    display: block;
    margin-top: 10px;
}

#edit-picture {
    background-color: #FF6A3D; /* Orange background color */
    color: white; /* White text */
    font-weight: bold; /* Make the text bold */
    border: none; /* No border */
    border-radius: 20px; /* Rounded corners */
    padding: 10px 10px; /* Top/bottom padding of 10px and left/right padding of 20px */
    text-transform: uppercase; /* Uppercase text */
    cursor: pointer; /* Change mouse pointer to indicate button */
    font-size: 20px; /* Button text size */
    outline: none; /* Remove focus outline */
    transition: background-color 0.3s ease;
    margin: auto;
    display: block;
    margin-top: 10px;
}

#photo-placeholder {
    margin-top: 20px;
    width: 260px;
    height: 260px;
    border-radius: 50%; /* Keeps the circular shape */
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Ensures no overflow outside the circular boundary */
    position: relative; /* Position relative to allow absolute positioning inside */
}

#photo-placeholder img {
    width: 100%; /* Make image fill the container */
    height: auto; /* Maintain aspect ratio */
    position: absolute; /* Position it over your placeholder */
    top: 50%; /* Align the top edge of the image in the center of the container */
    left: 50%; /* Align the left edge of the image in the center of the container */
    transform: translate(-50%, -50%); /* Offset the image back to center properly */
}
</style>
