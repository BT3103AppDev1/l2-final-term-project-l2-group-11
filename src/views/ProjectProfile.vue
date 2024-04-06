<template>
  <ProjProfile/>
</template>

<script>
import ProjProfile from '../components/ProjProfile.vue'
import firebase from '../uifire.js';
import 'firebase/compat/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";  

export default {
    name: 'ProjectProfile',
    
    components: {
      ProjProfile
    },

  data() {
    return {
      userstate: true,
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userstate = true; // User is logged in
      } else {
        this.userstate = false;
      }
    })
  }
}
</script>