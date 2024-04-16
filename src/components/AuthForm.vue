<script setup>
import loadingSpinner from "./Loading.vue";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
import ResetPasswordForm from "./ResetPasswordForm.vue";
</script>

<template>
    <div class = "authForm-container">
        <div class = "logo">
            <img class = "kaizen-logo" src = "../assets/kaizenlogo.jpeg"/>
            <img class = "kaizen" src = "../assets/Kaizen.jpeg"/> 
        </div>
        <div v-show = "!authOption" class = "auth-options-wrapper">
            <button class = "auth-options" type = "button" v-on:click.prevent = "setAuthOptionToEmail">
                <img class = "kaizen-logo" src = "../assets/email.png"/>
                <h4>{{state}} with Email</h4>
            </button>
            <button class = "auth-options" type = "button" v-on:click.prevent = "setAuthOptionToGmail">
                <img class = "kaizen-logo" src = "../assets/gmail.png"/>
                <h4>{{state}} with Gmail</h4>
            </button>
        </div>
        <div v-if = "authOption === 'Email'" class = "auth-form-wrapper">
            <LoginForm v-if = "state == 'Login'" />
            <RegisterForm v-else-if= "state == 'Register'" />
            <ResetPasswordForm v-else @changeStateToLogin = "toggleAuthState" />
        </div>
        <div v-else class = "auth-form-wrapper">

        </div>
        <button v-show = "authOption === 'Email'" type = "button" class = "auth-options" v-on:click.prevent = "setAuthOptionToGmail">
            <img class = "kaizen-logo" src = "../assets/gmail.png"/>
            <h4>{{state}} with Gmail</h4>
        </button>
        <button v-show = "authOption === 'Gmail'" type = "button" class = "auth-options" v-on:click.prevent = "setAuthOptionToEmail">
            <img class = "kaizen-logo" src = "../assets/email.png"/>
            <h4>{{state}} with Email</h4>
        </button>
        <div class = "other-auth-options">

            <router-link v-if = "state == 'Login'" to = "/auth/register" class = "router-link"><h4>Do not have an account? Register</h4></router-link>
            <router-link v-else to = "/auth/login" class = "router-link" v-on:click.prevent = "toggleAuthState"><h4>Already have an account? Login </h4></router-link>
           
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
        let state = this.$route.params.state === "login" ? "Login" : "Register";
        return {
            state: state,
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
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(getAuth(), provider);
                console.log(result.user.email); // Logging the user's email

                // The signed-in user info.
                const user = result.user;


                // Check if this user exists in Firestore
                const docRef = doc(db, "User Information", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (!docSnap.exists()) {
                    // New user - Create a new entry in Firestore
                    await setDoc(doc(db, "User Information", user.uid), {
                        email: user.email,
                        // You can add other user details here from the Google user object
                        questionaireFilled: false,
                    });
                    // Redirect to complete registration if needed
                    this.$router.push({name: 'SignUpQuestionaire', params: { userId: user.uid } });
                } else {
                    // Existing user - Redirect to main page or dashboard
                    this.$router.push("/"); // Assuming "/dashboard" is the route you want
                }
            } catch (error) {
                console.error("Authentication with Google failed", error);
                this.$router.push("/auth");
            }
        }
    },
    components: {
        loadingSpinner,
        LoginForm,
        RegisterForm,
        ResetPasswordForm
    },
    watch : {
        $route(to,from) {
            this.state = this.$route.params.state === "login" ? "Login" : "Register";
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
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    width:350px;
}

.auth-options {
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin-top: 10px;
    width:350px;
    background-color:white;
    color: black;
    border:1px black solid;
    border-radius:2%;
}

.auth-options img {
    height:20px;
    width:20px;
    margin-right:10px;
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

.other-auth-options button:hover {
    color:orange;
}

.other-auth-options .router-link {
    outline:none;
    border:none;
    background-color: transparent;
    color:#F5793B;
    font-size: 13px;
    padding:0px;
}

.other-auth-options .router-link:hover {
    color:orange;
}

.auth-verification-code-input-div {
    display:flex;
    flex-direction:row;
}


</style>