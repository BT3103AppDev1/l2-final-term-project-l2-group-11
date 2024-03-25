<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
    <Navbar />
    <div class = router-view>
        <router-view/>
    </div>
  </template>
  
  <script>  
    import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
    
  export default {
    name: 'App',
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
















