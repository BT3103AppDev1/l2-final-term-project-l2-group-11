<script setup>
import loadingSpinner from "./Loading.vue";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
import ResetPasswordForm from "./ResetPasswordForm.vue";
</script>

<template>
    <div class = "authForm-container">
        <loadingSpinner v-show = "loading"/>
        <div class = "logo">
            <img class = "kaizen-logo" src = "../assets/kaizenlogo.jpeg"/>
            <img class = "kaizen" src = "../assets/Kaizen.jpeg"/>
        </div>
        <div v-show = "!authOption" class = "auth-options-wrapper">
            <button class = "auth-options" type = "button" v-on:click.prevent = "setAuthOptionToEmail">{{state}} with email</button>
            <button class = "auth-options" type = "button" v-on:click.prevent = "setAuthOptionToGmail">{{state}} with Gmail</button>
        </div>
        <div v-if = "authOption === 'Email'" class = "auth-form-wrapper">
            <LoginForm v-if = "state == 'Login'" />
            <RegisterForm v-else-if= "state == 'Register'" />
            <ResetPasswordForm v-else />
        </div>
        <div v-else class = "auth-form-wrapper">

        </div>
        <button v-show = "authOption === 'Email'" type = "button" class = "auth-options" v-on:click.prevent = "setAuthOptionToGmail">{{state}} with Gmail</button>
        <button v-show = "authOption === 'Gmail'" type = "button" class = "auth-options" v-on:click.prevent = "setAuthOptionToEmail">{{state}} with email</button>
        <div class = "other-auth-options">
            <button type = "button" v-on:click = "toggleAuthState"> 
                <h4 v-if = "state == 'Login'">Do not have an account? Register</h4>
                <h4 v-else>Already have an account? Login </h4>
            </button>
            <button v-show = "state == 'Login'" type = "button" v-on:click = "updateStateToVerify"> 
                <h4>Forget Password</h4>
            </button>
        </div>
    </div>
</template>

<script>
import firebaseApp from "../Firebase.js";
import { getFirestore, doc, deleteDoc, collection, getDoc, setDoc} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default {
    data() {
        return {
            state: "Login",
            authOption : false
        }
    },
    methods : {
        toggleAuthState() {
            if (this.state == "Login") {
                this.state = "Register";
            } else {
                this.state = "Login";
            }
        },
        updateStateToVerify() {
            this.state = "Verify";
        },
        setAuthOptionToEmail() {
            this.authOption = "Email";
        },
        async setAuthOptionToGmail() {
            this.authOption = "Gmail";
            const provider = await new GoogleAuthProvider();
            let success = await signInWithPopup(getAuth(), provider);
            if (success) {
                this.$router.push("/");
            } else {
                this.$router.push("/auth");
            }

        }
    }
}

</script>

<style scoped>

.authForm-container {
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    background-color: #F9EEEE;
    height:100%;
    width:100%;
}

.logo {
    width:350px;
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    gap:30px;
    margin-bottom:20px;
}

.kaizen-logo {
    height:70px;
    width:70px;
}

.kaizen {
    height:70px;
    width:250px;
}

.auth-options-wrapper {
    flex-direction:column;
    justify-content: center;
    align-items: center;
    width:350px;
}

.auth-options {
    height: 40px;
    margin-top: 10px;
    width:350px;
    color:white;
    background-color: orange;
}

.other-auth-options {
    margin-top:15px;
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    width: 350px;
}

.other-auth-options button {
    outline:none;
    border:none;
    background-color: transparent;
    color:#F5793B;
    font-size: 13px;
    padding:0px;
}

.auth-verification-code-input-div {
    display:flex;
    flex-direction:row;
}


</style>