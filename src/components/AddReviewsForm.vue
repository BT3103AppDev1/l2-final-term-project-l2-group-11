<template>
    <form>
     
        <div class = "heading">
            <h4>Leave a Review!</h4>
            <button type = "button" v-on:click.prevent = "closeReviewForm">X</button>
        </div>
      
        <div class = "ratings">
            <img src = "../assets/lit-star.png" v-on:click.prevent = "setRatingsToOne"/>
            <img v-if = "ratings < 2" src = "../assets/unlit-star.png" v-on:click.prevent = "setRatingsToTwo"/>
            <img v-else src = "../assets/lit-star.png" v-on:click.prevent = "setRatingsToTwo"/>

            <img v-if = "ratings < 3" src = "../assets/unlit-star.png" v-on:click.prevent = "setRatingsToThree"/>
            <img v-else  src = "../assets/lit-star.png" v-on:click.prevent = "setRatingsToThree"/>

            <img v-if = "ratings < 4" src = "../assets/unlit-star.png" v-on:click.prevent = "setRatingsToFour"/>
            <img v-else src = "../assets/lit-star.png" v-on:click.prevent = "setRatingsToFour"/>

            <img v-if = "ratings < 5" src = "../assets/unlit-star.png" v-on:click.prevent = "setRatingsToFive"/>
            <img v-else src = "../assets/lit-star.png" v-on:click.prevent = "setRatingsToFive"/>
        </div>

        <div class = "project-title">
            <h3>Project Title</h3>
            <h4>{{ reviewProjectTitle }}</h4>
        </div>
        
        <div class = "review">
            <label for = "review-textarea">Review (Max 500 Characters)</label>
            <textarea maxLength = "500" placeholder="Add your review" v-model = "review" type = "text" id = "review-textarea">
            </textarea>
        </div>
        <div class = "add-review-button">
            <button type = "button" v-on:click.prevent = "submitReviewForm">Upload</button>
        </div>
    </form>
</template>

<script>
import uuidv4 from "../Uuid.js"
import firebaseApp from "../Firebase.js";
import { getFirestore, doc, deleteDoc, collection, getDoc, setDoc, getDocs} from "firebase/firestore";
const db = getFirestore(firebaseApp);
export default {
    data() {
        return {
            review:"",
            ratings:1
        }
    }, 
    methods : {
        async submitReviewForm() {
            alert("review submited!");
            let reviewerID = this.uid;
            let reviewRef = doc(db, "User Information", "" + this.profileUserId, "Reviews", uuidv4());
            let currentDate = new Date();
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            currentDate = day + "/" + month + "/" + year;
            await setDoc(reviewRef, {
                reviewerID : String(reviewerID),
                projectTitle: String(this.reviewProjectTitle),
                review : String(this.review),
                date : currentDate,
                ratings : this.ratings
            });
            this.ratings = 1;
            this.review = "";
            this.$emit("uploadReview");
            this.$emit("closeReviewFormPopup");
        },
        closeReviewForm() {
            this.$emit("closeReviewFormPopup");
            this.ratings = 1;
            this.review = "";
        },
        setRatingsToOne() {
            this.ratings = 1;
        },
        setRatingsToTwo() {
            this.ratings = 2;
        },
        setRatingsToThree() {
            this.ratings = 3;
        },
        setRatingsToFour() {
            this.ratings = 4;
        },
        setRatingsToFive() {
            this.ratings = 5;
        },
    },
    emits: ["closeReviewFormPopup", "uploadReview"],
    props : {
        uid : String,
        profileUserId : String,
        reviewProjectTitle : String
    }
}
</script>

<style scoped>
form {
    height:420px;
    width:580px;
    display:flex;
    flex-direction:column;
    justify-content: flex-start;
    align-items: center;
    background-color: #F9EEEE;
    color:white;
    border-radius:10px;
    border: 2px solid orange ;
}


.heading {
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    width:90%;
    height:40px;
    margin-top:20px;
}

.heading h4 {
    font-size:35px;
    font-weight:bold;
    color:orange;
    width:95%;
}

.heading button {
    border:none;
    background-color: transparent;
    font-weight:300;
    font-size:30px;
    color:grey;
    width:5%;
}

.ratings {
    margin-top:15px;
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap:2px;
    height:30px;
    width:90%;
}

.ratings img{
    height:30px;
    width:30px;
    object-fit: contain;
}

.project-title {
    margin-top:15px;
    display: flex;
    flex-direction:column;
    width:90%;
    height:60px;
    justify-content: center;
    align-items: left;
}

.project-title h3 {
    color:orange;
    font-size: 20px;
    font-weight:500;
}

.project-title h4 {
    color:black;
    font-size: 17px;
    font-weight:500;
}


.review { 
    margin-top:5px;
    display: flex;
    flex-direction:column;
    width:90%;
    height:170px;
    justify-content: flex-start;
    align-items: left;
}

.review label {
    color:orange;
    font-size: 20px;
    font-weight:500;
}

.review textarea {
    width:100%;
    border-radius:10px;
    border:1px solid orange;
    resize:none;
    height:140px;
}

.add-review-button {
    height:40px;
    width:90%;
    display:flex;
    flex-direction:row;
    justify-content: flex-end;
    align-items: center;
    margin:15px 0px;
}

.add-review-button button {
    height:100%;
    width:150px;
    border: 2px solid orange;
    border-radius:5px;
    background-color: white;
    color:orange;
    font-weight:900;
    font-size:15px;
}

.add-review-button button:hover {
    background-color: orange;
    color:white;

}
</style>
