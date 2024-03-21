<template>
    <div class = "authForm-container">
        <img src = "../assets/Kaizenlogo.jpeg"/>
        <form id = "authForm">
            <div class = "label-input-div">
                <label for = "auth-email-input">Email Address</label>
                <input type = "text" v-model = "EmailAddress" id = "auth-email-input" placeholder = " Email address">
            </div>
            <div class = "label-input-div">
                <label v-show = "state != 'Verify'" for = "auth-password-input">Password</label>
                <input v-show = "state != 'Verify'" type = "text" v-model = "Password" id = "auth-password-input" placeholder = " Password">
            </div>
            
            <div class = "label-input-div">
                <label v-show = "state == 'Verify'" for = "auth-verification-code-input">Verification Code</label>
                <div v-show = "state == 'Verify'" class = "auth-verification-code-input-div">
                    <input type = "text" v-model = "VerificationCode" id = "auth-verification-code-input" placeholder = " Verification Code">
                    <button type = "button" v-on:click = "verify">Verify</button>
                </div>
            </div>

            <div class = "label-input-div">
                <label v-show = "state == 'Register' || state == 'Verified'" for = "auth-confirm-password-input">Confirm Password</label>
                <input v-show = "state == 'Register' || state == 'Verified'" type = "text" v-model = "ConfirmPassword" id = "auth-confirm-password-input" placeholder = "confirm password">
            </div>
            <button type = "button" :disabled = "state == 'Verify'">{{buttonState}}</button>
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

export default {
    data() {
        return {
            EmailAddress: "",
            Password: "",
            ConfirmPassword: "",
            VerificationCode: "",
            state: "Login",
            buttonState: "Login"
        }
    },
    methods : {
        toggleAuthState() {
            if (this.state == "Login") {
                this.state = "Register";
                this.buttonState = "Register"
            } else {
                this.state = "Login";
                this.buttonState = "Login"
            }
        },
        updateStateToVerify() {
            this.state = "Verify";
            this.buttonState = "Reset"
        },
        verify() {
            this.state = "Verified";
        },
       
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

img {
    width:350px;
    margin-bottom:20px;
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
    background-color: #D3D3D3;
    color:grey;
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