<template>
     <div class = "view-container">
        <ProjProfile/>
    </div>
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

<style scoped>
.view-container {
    width:100%;
    height:100%;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
}

</style>