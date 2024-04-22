
<template>
    <form id = "authForm">
        <div class = "label-input-div">
            <label for = "auth-email-input">Email Address</label>
            <input type = "text" autocomplete = "off" v-model = "EmailAddress" id = "auth-email-input" placeholder = " Email address">
        </div>
        <div class = "label-input-div">
            <label for = "auth-password-input">Password</label>
            <input type = "password" autocomplete = "off" v-model = "Password" id = "auth-password-input" placeholder = " Password">
        </div>

        <div  class = "label-input-div">
            <label for = "auth-confirm-password-input">Confirm Password</label>
            <input type = "password" autocomplete = "off" v-model = "ConfirmPassword" id = "auth-confirm-password-input" placeholder = "confirm password">
        </div>
        <button type = "button" v-on:click.prevent = "register">Register</button>
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
            ConfirmPassword: "",
            loading: false,

        }
    },
    methods : {
        async register() {
            let regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]/;

            if (this.Password != this.ConfirmPassword) {
                alert("Passwords do not match, please try again");
            } else if (!regex.test(this.Password)) {
                console.log(this.Password);
                console.log(regex.test(this.Password));
                alert("Password has to contain a least one special, one uppercase and one lowercase character and has to be at least 8 character long");
            }
            else {
                try {
                    const userCredential = await createUserWithEmailAndPassword(getAuth(), this.EmailAddress.toLowerCase(), this.Password)
                    const user = userCredential.user;
                    const userID = user.uid;
                    const userDocRef = doc(db, 'User Information', userID);
                    //this creates a new document in Firestore

                    await setDoc(userDocRef, {
                        email: this.EmailAddress,
                        skills: "",
                        interests: "",
                        shortBio: "",
                        description: "",
                        linkedin: "",
                        instagram: "",
                        telegram: "",
                        savedProjects: [],
                        pastProjects: [],
                        currentProjects: [],
                        hostedProjects: [],
                        pendingProjects: [],
                    });
                    //store email address in the doc above.

                    console.log("User registered and Firestore document created with User ID")
                    this.$router.push({name: 'SignUpQuestionaire', params: { userId: userID } });

                } catch(error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode == "auth/email-already-in-use") {
                    alert("This email already has a registered account.")
                } else {
                    alert("Please enter a valid email.")
                }
                //alert("Registration is not successful, please try again!");
            };
            }
            this.loading = false;
        }
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

</style>
