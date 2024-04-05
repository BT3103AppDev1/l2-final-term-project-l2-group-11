<template>
    <div id="navBar">
        <h3>"Fake nav bar"</h3>
    </div>
    <SearchProjects/>
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

