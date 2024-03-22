<script setup>
import loadingSpinner from "./Loading.vue";
</script>

<template>
    <div class = "authForm-container">
        <loadingSpinner v-show = "loading"/>
        <div class = "logo">
            <img class = "kaizen-logo" src = "../assets/kaizenlogo.jpeg"/>
            <img class = "kaizen" src = "../assets/Kaizen.jpeg"/>
        </div>
        <form id = "authForm">
            <div class = "label-input-div">
                <label for = "auth-email-input">Email Address</label>
                <input type = "text" v-model = "EmailAddress" id = "auth-email-input" placeholder = " Email address">
            </div>
            <div v-show = "state != 'Verify'" class = "label-input-div">
                <label for = "auth-password-input">Password</label>
                <input type = "text" v-model = "Password" id = "auth-password-input" placeholder = " Password">
            </div>
            <div v-show = "state == 'Verify'" class = "label-input-div">
                <label for = "auth-verification-code-input">Verification Code</label>
                <div class = "auth-verification-code-input-div">
                    <input type = "text" v-model = "VerificationCode" id = "auth-verification-code-input" placeholder = " Verification Code">
                    <button type = "button" :disabled = "EmailAddress == ''" v-on:click = "requestCode">Request Code</button>
                </div>
            </div>

            <div v-show = "state == 'Register' || state == 'Verified'" class = "label-input-div">
                <label for = "auth-confirm-password-input">Confirm Password</label>
                <input type = "text" v-model = "ConfirmPassword" id = "auth-confirm-password-input" placeholder = "confirm password">
            </div>

            <button v-show = "state == 'Login'" type = "button" :disabled = "EmailAddress == '' && Password == ''" v-on:click = "login">Login</button>
            <button v-show = "state == 'Register'" type = "button" :disabled = "EmailAddress == '' && Password == '' && ConfirmPassword == ''" v-on:click = "register">Register</button>
            <button v-show = "state == 'Verified'" type = "button" :disabled = "EmailAddress == '' && Password == '' && ConfirmPassword == ''" v-on:click = "resetPassword">Reset</button>
            <button v-show = "state == 'Verify'" type = "button" :disabled = "EmailAddress == '' && VerificationCode == ''" v-on:click = "verify">Verify</button>
        </form>
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

export default {
    data() {
        return {
            EmailAddress: "",
            Password: "",
            ConfirmPassword: "",
            VerificationCode: "",
            state: "Login",
            loading: false
        }
    },
    methods : {
        toggleAuthState() {
            if (this.state == "Login") {
                this.state = "Register";
                this.EmailAddress = ""
                this.Password = "",
                this.ConfirmPassword = ""
            } else {
                this.state = "Login";
                this.EmailAddress = ""
                this.ConfirmPassword = "",
                this.Password = ""
            }
        },

        async login() {
            this.loading = true;
            console.log(this.EmailAddress);
            let userCred = await getDoc(doc(db,"KaizenPersonalTest", this.EmailAddress));
            if (!userCred.exists()) {
                this.loading = false;
                alert("This email does not have an account, please try again");
            } else {
                if (userCred.data().password == this.Password) {
                    this.loading = false;
                    alert("Login successful");
                } else {
                    this.loading = false;
                    alert("Invalid password please try again");
                }
            }
            this.loading = false;
        },

        async register() {
            this.loading = true;
            if (this.Password != this.ConfirmPassword) {
                this.loading = false;
                alert("Passwords do not match, please try again");
            } else {
                let userCred = await getDoc(doc(db,"KaizenPersonalTest", this.EmailAddress));
                if (userCred.exists()) {
                    this.loading = false;
                    alert("This email already has a registered an account, please try again");
                } else {
                    await setDoc(doc(db,"KaizenPersonalTest", this.EmailAddress), {
                        password : this.Password
                    });
                    this.loading = false;
                    alert("Email registered successfully");
                }
            }
        },

        updateStateToVerify() {
            this.state = "Verify";
            this.EmailAddress = "";
            this.Password = "";
            this.ConfirmPassword = "";
        },

        requestCode() {

        },
        verify() {

        },
        resetPassword() {

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

#authForm {
    display:flex;
    flex-direction:column;
    justify-content: flex-start;
    align-items: center;
    background-color: #F9EEEE;
}

#authForm .label-input-div {
    display:flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items:left;
    margin-bottom:10px;
}
#authForm input {
    width: 350px;
    height:35px;
    border:none;
    border-radius: 3px;
    background-color: #cacaca;
}

#authForm label {
    font-size: 13px;
    color:#F5793B;
}

.auth-verification-code-input-div {
    width:350px;
    display:flex;
    flex-direction:row;
    justify-content: flex-start;
    align-items:center;
}

#authForm .auth-verification-code-input-div input {
    width:275px;
    border-radius: 3px 0px 0px 3px;
}

.other-auth-options {
    margin-top:15px;
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    width: 350px;
}

#authForm button {
    outline: none;
    border: none;
    background-color: #F5793B;
    color:#FDF8F6;
    font-size: 13px;
    height:30px;
    width: 65px;
    border-radius:3px;   
}

#authForm button:disabled {
    background-color: grey;
}

#authForm .auth-verification-code-input-div button {
    width:75px;
    height:35px;
    border-radius: 0px 3px 3px 0px;
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