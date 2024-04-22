<template>
    <section class="heading-section">
        <div class="bg"></div>
        <img class="pic" src="./icons/home-pic.png" />
        <div class="frame">
            <div class="text">
                <div class="heading">
                    <span id="collab">Collab and Conquer <br> </span>
                    <span id="meet"> Meet like-minded individuals <br> to work on a project with!</span>
                </div>
                <div class="subtitle">
                    Enhance your porforlio with anyone, anywhere, anytime
                </div>
                <button v-if= "!userstate" id="join" type="button" @click="gotoAuth">Join our community</button>
            </div>
        </div>
    </section> <br>

    <section class="students-section">
        <div class="students">
            <div class="intro">
                <h1 id="title">Our Students </h1>
                <span id="description">Cultivating elite talent from top-tier institutions</span>
            </div>
            <div class="logos">
                <img src='./icons/client1.png'>
                <img src='./icons/client2.png'>
                <img src='./icons/client3.png'>
                <img src='./icons/client4.png'>
                <img src='./icons/client5.png'>
                <img src='./icons/client6.png'>
                <img src='./icons/client7.png'>
            </div>
        </div>
    </section>
</template>

<script>
import firebase from '../uifire.js';
import 'firebase/compat/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    data() {
        return {
            userstate: false,
            uid: '',
        }
    },
    
    async mounted() {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                this.userstate = true; // User is logged in
                this.uid = user.uid;
            } else {
                this.userstate = false; // User is not logged in
                this.uid = '';
            }
        })
    },
    
    methods: {
        gotoAuth() {
            this.$router.push("/auth/register");
        }
    }
}
</script>

<style scoped>

.heading-section {
    height: 414.21px;
    position: relative;
}

.bg {
    width: 100%;
    height: 100%;

    position: absolute;
    background: #fdf8f6;
}
.students-section {
    background-color: white;
}

.pic {
    width: 500px;
    height: 356px;
    left: 921px;
    top: 29px;
    position: absolute;
}

.frame {
    height: 280.57px;
    left: 122px;
    top: 67px;
    position: absolute;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 22.27px;
    display: inline-flex;
}

.text {
    align-self: stretch;
    height: 234px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 11.14px;
    display: flex;
}

.heading {
    align-self: stretch;
}

#collab {
    color: #f5793b;
    font-size: 65px;
    font-family: Garamond, serif;
    font-weight: 600;
    line-height: 60px;
    word-wrap: break-word;
}

#meet {
    color: #4d4d4d;
    font-size: 55px;
    font-family: Garamond, serif;
    font-weight: 600;
    line-height: 55px;
    word-wrap: break-word;
}

.subtitle {
    align-self: stretch;
    color: #717171;
    font-size: 24px;
    font-family: Garamond, serif;
    font-weight: 400;
    line-height: 60px;
    word-wrap: break-word;
}



#join {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 32px;
    padding-left: 32px;
    background: #f5793b;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    display: inline-flex;
    font-size: 20px;
    color: white;
    font-family: Garamond, serif;
    font-weight: 600;
    border-color: #f5793b;

}

.intro {
    text-align: center;
}

#title {
    text-align: center;

    font-size: 45px;
    font-family: Inter;
    font-weight: 600;

    word-wrap: break-word;
}

#description {
    text-align: center;
    color: #565454;
    font-size: 20px;
    font-family: Garamond, serif;
    font-weight: 400;
    line-height: 10px;
    word-wrap: break-word;
}

.students {
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
    padding-left: 15%;
    padding-right: 15%;
    align-items: center;
    gap: 11.14px;
    display: inline-flex;
    color:black;
}

.logos {
    align-self: stretch;
    height: 68.21px;
    justify-content: space-between;
    align-items: center;
    display: inline-flex;
}
</style>