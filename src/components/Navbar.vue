<template>
    <div id ="nav">
        <router-link to = "/" class = "nav-logo-link">
            <div class = "nav-logo">
                <img class = "nav-kaizen-logo" src = "../assets/kaizenlogo.jpeg"/>
                <img class = "nav-kaizen" src = "../assets/Kaizen.jpeg"/>
            </div>
        </router-link>
        <div class = "link-button-container">
            <div class = "link">
                <router-link to = "/" class = "router-link" > About </router-link> 
                <router-link to = "/project" class = "router-link" > Project </router-link> 
            </div>
            <div v-if = "!isLoggedIn" class = "login-register-buttons">
               <router-link to = "/auth/login" class = "router-link">Login</router-link>
               <router-link to = "/auth/register" class = "router-link">Register</router-link>
            </div>
            <div v-else id="profile-menu" @click="toggleDropdown" class="profile-dropdown">
              <img v-bind:src="profileImageUrl" alt="Profile" class="profile-icon" />
              <div v-if="dropdownOpen" class="dropdown-content">
                <a @click="goUserProfile">Your Profile</a>
                <a @click.prevent="tempLogout">Log Out</a>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    import { collection, getDoc, doc, deleteDoc } from "firebase/firestore";
    import firebaseApp from '../Firebase.js';

    const db = getFirestore(firebaseApp);

    export default {

    props: ['profileImageUrl'],

    data() {
        return {
            isLoggedIn : false,
            dropdownOpen: false,
            uid: '',
            userProfile: null,
            profileImageUrl:''
        }
    }, 
    methods : {
        toggleDropdown() {
          this.dropdownOpen = !this.dropdownOpen;
        },
        tempLogout() {
          const auth = getAuth();
          const user = auth.currentUser;
          signOut(auth,user);
          this.$router.push("/");
        },
        goUserProfile() {
          this.$router.push({name: 'Profile', params: {userId: this.uid}});
        }
    }, 
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.isLoggedIn = true;
                this.uid = user.uid;
                const docRef = doc(db, "User Information", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                  this.profileImageUrl = docSnap.data().profileImageUrl || '';
                  console.log('User Data:', docSnap.data());
                  console.log('Questionaire Filled:', docSnap.data().filledQuestionaire);
                  if (!docSnap.data().filledQuestionaire) {
                    console.log('Redirecting to SignUpQuestionaire');
                    this.$router.push({ name: 'SignUpQuestionaire', params: { userId: user.uid } });
                  }
                } 
            } else {
                this.isLoggedIn = false;
                this.uid = '';
                this.userProfile = null;
                this.profileImageUrl = '';
            }
        });
    }
}
</script>
<style scoped>

#nav {
    display:flex;
    flex-direction:row;
    align-items:center;
    height:10%;
    width:100vw;
    background-color: white;
  }
  .nav-logo-link {
    height:100%;
    width:20%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color: white;
  }

  .nav-logo-link:hover {
    background-color: white;
  }

  .nav-logo {
    height:100%;
    width:80%;
    display:flex;
    flex-direction:row;
    align-items:center;
    gap:5px;
    padding-left:30px;
  }

  .nav-logo .nav-kaizen-logo {
    height:30px;
    width:30px;
  }

  .nav-logo .nav-kaizen {
    height:30px;
    width:120px;
  }

  .link-button-container {
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    align-items:center;
    height:100%;
    width:80%;
    padding-right:30px;
  }

  .link {
    display:flex;
    flex-direction:row;
    gap: 30px;
    align-items:center;
    height:100%;
    color:#F5793B;
    /* padding-left:10px; */
  }
  .link .router-link {
    color: #F5793B;
    font-size: 25px;
    font-weight: 600;
    background-color:white;
  }

  .link .router-link-active {
    text-decoration: underline;
    font-size:30px;
  }

  .link .router-link:hover {
    background-color:white;
    font-size:30px;
  }

  .login-register-buttons {
    display:flex;
    flex-direction:row;
    align-items:center;
    height:100%;
    gap: 30px;
    padding-right:30px;
  }

  .login-register-buttons .router-link {
    color:white;
    font-size: 15px;
    font-weight: 400;
    background-color: #F5793B;
    border-radius: 5px;
    height:40px;
    width:75px;
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
  }
  .login-register-buttons .router-link:hover {
    background-color:orange;
  }

  .profile-dropdown {
    display: flex; 
    align-items: center; 
    justify-content: flex-end; 
    cursor: pointer;
    position: relative;
  }

.dropdown-content {
  display: none; /* Hidden by default */
  position: absolute;
  top: 100%;
  right: 0; /* Align the dropdown to the right */
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1; /* Make sure it's on top of other elements */
}

.dropdown-content a {
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  color: black;
}

.profile-dropdown:hover .dropdown-content {
  display: block; /* Show dropdown on hover */
}

/* Style adjustments for when dropdown is active */
.profile-dropdown .dropdown-content {
  display: block;
}

.profile-icon {
  width: 40px; /* Adjust size as needed */
  height: 40px; /* Adjust size as needed */
  border-radius: 50%; /* Makes the image round */
  object-fit: cover; /* Ensures the image covers the area without distortion */
  cursor: pointer; /* Changes the cursor to indicate it's clickable */
  position: relative;
}
</style>
