<script>
import Card from '../components/Card.vue';
import firebaseApp from '../Firebase.js';
import firebase from '../uifire.js';
import 'firebase/compat/auth';
import { ref, onMounted } from 'vue';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {

    components: {
        Card
    },

    props: [
        "userId",
        "projectId"
    ],

    data() {
        return {
            activeTab: 'my-projects', // Default active tab
            userstate: false,
            uid: '',
            userProfile: null,
            hostedProjects: [],
            currentProjects: [],
            pastProjects: [],
            savedProjects: [],
            pendingProjects: [],

        };
    },

    mounted() {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                this.userstate = true; // User is logged in
                this.uid = user.uid;
                const userRef = doc(db, 'User Information', this.userId);
                const userSnap = await getDoc(userRef);
                this.userProfile = userSnap.data();
                this.hostedProjects = this.convertIdToProjects(this.userProfile.hostedProjects);
                this.currentProjects = this.convertIdToProjects(this.userProfile.currentProjects);
                this.pastProjects = this.convertIdToProjects(this.userProfile.pastProjects);
                this.savedProjects = this.convertIdToProjects(this.userProfile.savedProjects);
                this.pendingProjects = this.convertIdToProjects(this.userProfile.pendingProjects);

            } else {
                this.userstate = false;
            }
        })
    },

    methods: {

        setActiveTab(tab) {
            this.activeTab = tab;
        },

        convertIdToProjects(idList) {
            let newProjectList = [];
            for (let i = 0; i < idList.length; i++) {
                let docRef = doc(db, 'Project Collection', idList[i]);
                getDoc(docRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        let project = docSnap.data();
                        project.id = docSnap.id;
                        // Assuming pendingMembers is an array of user IDs
                        project.pendingMembersCount = project.pendingMembers ? project.pendingMembers.length : 0;
                        newProjectList.push(project);
                    }
                });
            }
            return newProjectList;
        },

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

            } catch (error) {
                console.error("Error uploading image: ", error);
            }
        },

        editProfile() {
            this.$router.push({ name: 'EditProfile', params: { userId: this.uid } });
        },

        goToReviewsPage() {
            if (this.projectId !== null) {
                this.$router.push({ name: 'ReviewsPage', params: { userId: this.userId, projectId : this.projectId} });
            } else {
                this.$router.push({ name: 'ReviewsPage', params: { userId: this.userId} });
            }
        }
    },

    setup(props) {


        const userData = ref({}); // This will hold our user data
        // const userId = 'theUserIdFromAuth'; // You'll get this from your auth state

        const icons = ref({
            linkedin: '',
            instagram: '',
            telegram: '',
        });

        const storage = getStorage(firebaseApp);

        //load user data while page loads
        onMounted(async () => {
            const db = getFirestore();
            const docRef = doc(db, 'User Information', "" + props.userId);
            //of the authentication state of the page. e.g. whether the user is logged in

            try {
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
    watch: {
            '$route.params.userId': function(newUserId, oldUserId) {
                if (newUserId !== oldUserId) {
                    window.location.reload();
                }
            }
        }
    }

</script>

<template>
  <div class="main-container">
    <div class="profile-section">
      <div class="userbio">
        <div class="profile-pic-and-username-bio-wrapper">
          <div class="photo-editButton">
            <div class="photo-placeholder">
              <img
                v-if="userData.profileImageUrl"
                :src="userData.profileImageUrl"
                alt="Profile Preview"
              />
              <h2 v-else>p</h2>
            </div>

            <!-- Hidden file input for editing profile -->
            <!-- <input type="file" id="editProfileUpload" ref="editProfileUpload" @change="handleEditProfileUpload" style="display: none;"> -->
          </div>
          <div class="username-bio">
            <h3 v-if="userData" :class="{ 'strong-bold': userData.name }">
              {{ userData.name }}
            </h3>
            <!-- display username-->
            <h6 v-if="userData">Short Bio: {{ userData.shortBio }}</h6>
          </div>
        </div>

        <div class="skills-description">
          <div class="interests">
            <h3>Interests</h3>
            <div class="tags-container">
              <span
                class="tags"
                v-for="interest in userData.interestsArray"
                :key="interest"
                >{{ interest }}</span
              >
            </div>
          </div>

          <div class="skills">
            <h3>Skills</h3>
            <div class="tags-container">
              <span
                class="tags"
                v-for="skills in userData.skillsArray"
                :key="skills"
                >{{ skills }}</span
              >
            </div>
          </div>

          <div class="description">
            <h3>Description</h3>
            <div v-if="userData">
              <p>{{ userData.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="socialMediaWrapper">
        <!--to wrap the social media icons on the rhs-->
        <button v-show="uid === userId" id="edit-profile" @click="editProfile">
          Edit Profile
        </button>
        <button id="reviewsButton" @click="goToReviewsPage">Reviews</button>

        <h2 class="socialMediaHeading">Social Media</h2>
        <!-- Heading for the icons -->

        <div class="socialMediaIcons">
          <a v-if="userData.linkedin" :href="userData.linkedin" target="_blank">
            <img :src="icons.linkedin" alt="LinkedIn" />
          </a>

          <img
            v-else
            :src="icons.linkedin"
            alt="LinkedIn"
            class="icon-disabled"
          />
          <!--displays Linkedin icon if user link is invalid-->

          <!-- Instagram -->
          <a
            v-if="userData.instagram"
            :href="userData.instagram"
            target="_blank"
          >
            <img :src="icons.instagram" alt="Instagram" />
          </a>

          <img
            v-else
            :src="icons.instagram"
            alt="Instagram"
            class="icon-disabled"
          />
          <!--displays Instagram icon even if user link is invalid-->

          <!-- Telegram -->
          <a v-if="userData.telegram" :href="userData.telegram" target="_blank">
            <img :src="icons.telegram" alt="Telegram" />
          </a>

          <img
            v-else
            :src="icons.telegram"
            alt="Telegram"
            class="icon-disabled"
          />
          <!--displays Telegram icon even if user link is invalid-->
        </div>
      </div>
    </div>
    <div class="tabs">
      <span
        :class="{ active: activeTab === 'my-projects' }"
        @click="setActiveTab('my-projects')"
        >My Projects</span
      >
      <span
        :class="{ active: activeTab === 'current-projects' }"
        @click="setActiveTab('current-projects')"
        >Current Projects</span
      >
      <span
        :class="{ active: activeTab === 'past-projects' }"
        @click="setActiveTab('past-projects')"
        >Past Projects</span
      >
      <span v-show = "uid === userId"
        :class="{ active: activeTab === 'saved-projects' }"
        @click="setActiveTab('saved-projects')"
        >Saved Projects</span
      >
      <span v-show = "uid === userId"
        :class="{ active: activeTab === 'pending-projects' }"
        @click="setActiveTab('pending-projects')"
        >Pending Projects</span
      >
    </div>

    <div class="project-container-wrapper">
      <div v-show="activeTab === 'my-projects'" class="project-container">
        <h1 class = "empty-project-tab" v-show = "hostedProjects.length === 0">No Hosted Project, Create Your First One Now!</h1>
        <Card
          v-for="project in hostedProjects"
          :key="project.id"
          :project="project"
          :image-url="project.projectImage"
          :pendingMembersCount="project.pendingMembersCount"
          :show-notifications="uid === userId"
        />
      </div>
      <div class="project-container" v-show="activeTab === 'current-projects'">
        <h1  class = "empty-project-tab" v-show = "currentProjects.length === 0">No Current Project, Join a Project Now!</h1>
        <Card
          v-for="project in currentProjects"
          :key="project.id"
          :project="project"
          :image-url="project.projectImage"
        />
      </div>
      <div class="project-container" v-show="activeTab === 'past-projects'">
        <h1 class = "empty-project-tab" v-show = "pastProjects.length === 0">No Past Project</h1>
        <Card
          v-for="project in pastProjects"
          :key="project.id"
          :project="project"
          :image-url="project.projectImage"
        />
      </div>
      <div class="project-container" v-show="activeTab === 'saved-projects'">
        <h1 class = "empty-project-tab" v-show = "savedProjects.length === 0">No Saved Project, Save a Project Now!</h1>
        <Card
          v-for="project in savedProjects"
          :key="project.id"
          :project="project"
          :image-url="project.projectImage"
        />
      </div>
      <div class="project-container" v-show="activeTab === 'pending-projects'">
        <h1 class = "empty-project-tab" v-show = "pendingProjects.length === 0">No Pending Project, Apply For a Project Now!</h1>
        <Card
          v-for="project in pendingProjects"
          :key="project.id"
          :project="project"
          :image-url="project.projectImage"
        />
      </div>
    </div>
  </div>
  <!--end of main container-->
</template>

<style scoped>
.main-container {
  width: 100%;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: scroll;
}

.profile-section {
  width: 100%;
  padding: 2% 10%;
  height: 550px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #fdf8f6;
}

.userbio {
  height: 100%;
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
}

.profile-pic-and-username-bio-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 120px;
}

.photo-editButton {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 120px;
  height: 100%;
  margin-right: 30px;
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  outline: 2px solid black;
}

.photo-placeholder img {
  height: 100%;
  width: 100%;
  object-fit: 100%;
  border-radius: 50%;
}

.photo-placeholder button:hover {
  background-color: orange;
}

.username-bio {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  width: 80%;
  height: 100%;
  font-size: 30px;
}

.strong-bold {
  font-weight: bold;
}

.skills-description {
  margin-top: 20px;
  height: 450px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  gap: 15px;
}

.interests,
.skills {
  height: 80px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  font-size: 17px;
}

.skills h3,
.interests h3,
.description h3 {
  font-weight: bold;
}

.tags-container {
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.tags {
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: black;
  background-color: rgb(181, 174, 174);
  padding: 0px 10px;
  margin-right: 10px;
}

.description {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  font-size: 17px;
}

.socialMediaWrapper {
  height: 100%;
  width: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#edit-profile {
  width: 100%;
  height: 40px;
  background-color: #ff6a3d;
  outline: none;
  border: 5px;
  color: white;
  font-size: 15px;
  margin-bottom: 20px;
}

#edit-profile:hover {
  background-color: orange;
}

#reviewsButton {
  width: 100%;
  height: 40px;
  background-color: #ff6a3d;
  outline: none;
  border: 5px;
  color: white;
  font-size: 15px;
  margin-bottom: 20px;
}

#reviewsButton:hover {
  background-color: orange;
}

.socialMediaHeading {
  width: 100%;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
}

.socialMediaIcons {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.socialMediaIcons img {
  height: 45px;
  width: 45px;
  object-fit: contain;
  border-radius: 5px;
}

.tabs {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  width: 100%;
  padding: 0% 10%;
  margin-top:20px;
  margin-bottom: 20px;
  font-size: 17px;
  font-weight: 1000px;
  gap: 30px;
  cursor: pointer;
}

.tabs span {
  transition: font-size 700ms;
}

.tabs span:hover {
  font-size: 22px;
}

.tabs .active {
  text-decoration: underline;
  color: rgba(255, 115, 0, 0.975);
  font-weight: bold;
  font-size: 22px;
}

.project-container-wrapper {
  width: 100%;
  padding:0% 10%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.empty-project-tab {
    text-align: center;
    padding-top:100px;
    width:100%;
    height:300px;
    font-size: 50px;
    color: rgba(255, 115, 0, 0.975);
}

.project-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap; /* This allows the items to wrap to the next line */
  justify-content: flex-start;
  align-items: flex-start; /* Align items at the start of the cross axis */
  gap: 30px; /* You can adjust this gap to your preference */
  padding-top: 5px;
}

.projects-cart {
  height: 300px;
  width: 300px;
}

.card {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -100px;
  /* Adjust this to move the badge outside of the card as desired */
  right: -1000px;
  /* Adjust this to move the badge outside of the card as desired */
  background-color: red;
  color: white;
  border-radius: 5000%;
  padding: 5px;
  font-size: 100rem;
  z-index: 100;
  /* Ensure the badge is above the card */
  /* Additional styles for centering content if needed */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
