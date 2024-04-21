<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
    <Navbar :profileImageUrl="profileImageUrl" />
    <div class = router-view>
        <router-view @profile-updated="updateProfileImageUrl"/>
    </div>
</template>
  
<script>  
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import firebaseApp from './Firebase.js';
import firebase from './uifire.js';
import 'firebase/compat/auth';
import { getFirestore } from "firebase/firestore";
import { collection, getDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const db = getFirestore(firebaseApp);
  export default {
    name: 'App',
    data() {
      return {
        uid:'',
        profileImageUrl: '',
      };
    },
    methods: {
      updateProfileImageUrl(newImageUrl) {
        this.profileImageUrl = newImageUrl;
      },
    },

    mounted() {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          this.uid = user.uid;
          const docRef = doc(db, "User Information", user.uid);
          const docSnap = await getDoc(docRef);
          this.profileImageUrl = docSnap.data().profileImageUrl
        }
      })
    }          
  }
  </script>
  
  <style>
  #app {
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    height:100vh;
    width:100vw;
  }

  .router-view {
    height:90%;
    width:100vw;
  }

  
  </style>
















