<script setup>
import ReviewCard from "../components/ReviewCard.vue";
import AddReviewsForm from "../components/AddReviewsForm.vue";
</script>

<template>
    <div v-show = "reviewFormPopup" class = "add-review-form">
        <AddReviewsForm @closeReviewFormPopup = "closeAddReviewPopup"/>
    </div>
    <div class = "reviews-page-wrapper" :class = "{'block-background' : reviewFormPopup}">
        <div class = "heading">
            <div class = "placeholder"></div>
            <h1>Past Reviews</h1>
            <button class = "add-review-button"  v-on:click.prevent = "addReview">Add Review</button>
        </div>
        <div v-if = "reviews.length !== 0" class = "reviews-container">
            <div v-for = "review in reviews" class = "review-container">
                <ReviewCard :reviewDetails = "review"/>
            </div>
        </div>
        <div class = "no-reviews-container" v-else >
            <h2>User does not have a review, be the first to leave a review!</h2>
        </div>
    </div>
</template>

<script>
import firebaseApp from "../Firebase.js";
import { getFirestore, doc, deleteDoc, collection, getDoc, setDoc, getDocs} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged} from "firebase/auth";

export default {
    name:"Reviews",
    data() {
        return {
            reviews: [],
            loading: true,
            uid:null,
            reviewFormPopup:false
        }
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.uid = user.uid;
                this.fetchReviews();
            } else {
                this.uid = null;
            }
        });
    },
    methods:{
        async fetchReviews() {
            let fetchedReviews = await getDocs(collection(db,"User Information","" + this.uid, "Reviews"));
            let listReviewsData = [];
            if (fetchedReviews.empty) {
                return ;
            }
            fetchedReviews.forEach(review => {
                let reviewData = review.data();
                listReviewsData.push(reviewData);
            });
            for (let i = 0; i < listReviewsData.length; i++) {
                let reviewData = listReviewsData[i];
                let reviewerInfo = await getDoc(doc(db, "User Information", "" + reviewData.reviewerID));
                reviewerInfo = reviewerInfo.data();
                let reviewerUsername = reviewerInfo.username;
                let reviewerProfilePic = reviewerInfo.profilePic;
                reviewData.reviewerUsername = reviewerUsername;
                reviewData.reviewerProfilePic = reviewerProfilePic
            };
            this.reviews = listReviewsData;
        }
    },
    components: {
        ReviewCard
    },
    methods: {
        addReview() {
            this.reviewFormPopup = true;
        },
        closeAddReviewPopup() { 
            this.reviewFormPopup = false;
        }
    }
}
</script>

<style scoped>

.heading {
    display:flex;
    flex-direction:row;
    width:100%;
    justify-content: space-between;
    align-items:center;
}

.heading .placeholder {
    width:150px;
}

.heading button {
    width:150px;
    height:40px;
    border-radius:5px;
    background-color: orange;
    color:white;
    border:none;
    font-size:15px;
}

.reviews-page-wrapper {
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    width:100%;
    height:100%;
    background-color: #F9EEEE;
    color:orange;
}

.block-background {
    background-color: #d7d3d3;
    color:rgb(231, 153, 8);
}

.reviews-page-wrapper h1 {
    font-size:50px;
    font-weight:bold;
    height:10%;
    margin-top:20px;
}

.reviews-page-wrapper h2 {
    height:50px;
}

.reviews-page-wrapper .reviews-container {
    display : flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    width:100%;
    margin-top:50px;
}

.review-container {
    display : flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    width:50%;
    height:200px;
}
.no-reviews-container {
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width:100%;
    margin-top:100px;
}

.add-review-button {
    position:relative;
    right:50px;
    top:10px;
}

.add-review-form {
    position:fixed;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    height:80vh;
    width:100vw;
    z-index:2;
}
</style>
    