<template>
    <div id ="nav">
        <router-link to = "/" class = "nav-logo-link">
            <div class = "nav-logo">
                <img class = "nav-kaizen-logo" src = "../assets/kaizenlogo.jpeg"/>
                <img class = "nav-kaizen" src = "../assets/kaizen.jpeg"/>
            </div>
        </router-link>
        <div class = "link-button-container">
            <div class = "link">
                <router-link to = "/" class = "router-link" > About </router-link> 
                <router-link to = "/project" class = "router-link" > Project </router-link> 
            </div>
            <div v-if = "!isLoggedIn" class = "login-register-buttons">
               <router-link to = "/auth" class = "router-link">Login</router-link>
               <router-link to = "/auth" class = "router-link">Register</router-link>
            </div>
            <button v-else v-on:click.prevent = "tempLogout">Temp logout button</button>
        </div>
    </div>
</template>

<script>
    import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
    export default {
    data() {
        return {
            isLoggedIn : false,
        }
    }, 
    methods : {
        tempLogout() {
            const auth = getAuth();
            const user = auth.currentUser;
            signOut(auth,user);
            this.$router.push("/");
        }
    }, 
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.isLoggedIn = true;
                const uid = user.uid;
            } else {
                this.isLoggedIn = false;
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
    width:100%;
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
  }

  .link {
    display:flex;
    flex-direction:row;
    gap: 30px;
    align-items:center;
    height:100%;
    color:#F5793B;
    padding-left:100px;
  }
  .link .router-link {
    color: #F5793B;
    font-size: 20px;
    font-weight: 600;
    background-color:white;
  }

  .link .router-link-active {
    text-decoration: underline;
    font-size:25px;
  }

  .link .router-link:hover {
    background-color:white;
    font-size:25px;
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
</style>