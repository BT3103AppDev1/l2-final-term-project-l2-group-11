<template>
    <form id = "authForm">
        <div class = "label-input-div">
            <label for = "auth-email-input">Email Address</label>
            <input type = "text" v-model = "EmailAddress" id = "auth-email-input" placeholder = " Email address">
        </div>

        <button class = "request-reset-link-button" v-show = "state == 'Verify'" type = "button" :disabled = "EmailAddress == ''" v-on:click.prevent = "resetPasswordRequest">Request Reset Password Link </button>
    </form>
</template>

<script>
import firebaseApp from "../Firebase.js";

import { getAuth, sendPasswordResetEmail} from "firebase/auth";

export default {
    data() {
        return {
            EmailAddress: "",
            Password: "",
            ConfirmPassword: "",
            VerificationCode: "",
            state: "Verify",
            loading: false,

        }
    },
    methods : {
        resetPasswordRequest() {
            sendPasswordResetEmail(getAuth(firebaseApp), this.EmailAddress)
            .then( () => {
                alert("An email has been sent to reset your password, please check your email!");
                this.$emit("changeStateToLogin");
            })
            .catch((error) => {
                console.log(error);
            });
        },
        requestCode() {

        },
        verify() {
            this.state = "Verified"
        },
        resetPassword() {

        }       
    },
    emits:["changeStateToLogin"]
}
</script>

<style scoped>
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
    border:1px solid #F5793B;
    border-radius: 3px;
    background-color: white;
}

#authForm label {
    font-size: 13px;
    color:#F5793B;
}

#authForm button {
    outline: none;
    border: none;
    background-color: #F5793B;
    color:#FDF8F6;
    font-size: 13px;
    height:35px;
    width: 350px;
    border-radius:3px;   
}

#authForm button:hover {
    background-color: orange;
}




</style>