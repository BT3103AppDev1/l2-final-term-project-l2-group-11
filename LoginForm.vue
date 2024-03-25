<template>
    <form id = "authForm">
        <div class = "label-input-div">
            <label for = "auth-email-input">Email Address</label>
            <input type = "text" v-model = "EmailAddress" id = "auth-email-input" placeholder = " Email address">
        </div>
        <div class = "label-input-div">
            <label for = "auth-password-input">Password</label>
            <input type = "text" v-model = "Password" id = "auth-password-input" placeholder = " Password">
        </div>
        <button  type = "button" :disabled = "EmailAddress == '' && Password == ''" v-on:click.prevent = "login">Login</button>
    </form>
</template>

<script>
import firebaseApp from "../Firebase.js";
import { getFirestore, doc, deleteDoc, collection, getDoc, setDoc} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";

export default {
    data() {
        return {
            EmailAddress: "",
            Password: "",
            loading: false,

        }
    },
    methods : {
        async login() {
            this.loading = true;
            signInWithEmailAndPassword(getAuth(), this.EmailAddress.toLowerCase(), this.Password)
            .then((userCredential) => {
                const user = userCredential.user;
                this.$router.push("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
            this.loading = false;
        },
    }
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
</style>