<template>
    <div class = "project-page-wrapper">
        <SearchProjects/>
    </div>
</template>

<script>
import SearchProjects from '../components/SearchProjects.vue'
import firebase from '../uifire.js';
import 'firebase/compat/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";  

export default {
    name: 'Project',
    
    components: {
      SearchProjects
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
.project-page-wrapper {
    height:100%;
    width:100%;
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items: center;
}
</style>

