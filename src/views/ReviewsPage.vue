<script setup>
import ReviewCard from "../components/ReviewCard.vue";
import AddReviewsForm from "../components/AddReviewsForm.vue";
</script>

<template>
    <div v-show = "reviewFormPopup" class = "add-review-form">
        <AddReviewsForm @closeReviewFormPopup = "closeAddReviewPopup" @uploadReview = "refreshReviews" :uid = "uid" />
    </div>

    <div class = "reviews-page-wrapper" :class = "{'block-background' : reviewFormPopup}">
        <div class = "heading">
            <div class = "placeholder"></div>
            <h1>Past Reviews</h1>
            <div class = "placeholder">
                <button v-show = "addReviewAvailable || true" v-on:click.prevent = "addReview">Add Review</button>
            </div>
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
    components: {
        ReviewCard
    },
    methods: {
        addReview() {
            this.reviewFormPopup = true;
        },
        closeAddReviewPopup() { 
            this.reviewFormPopup = false;
        },
        async fetchReviews() {
            let fetchedReviews = await getDocs(collection(db,"User Information","" + props.userId, "Reviews"));
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
                let reviewerUsername = reviewerInfo.name;
                let reviewerProfilePic = reviewerInfo.profileImageUrl;
                reviewData.reviewerUsername = reviewerUsername;
                reviewData.reviewerProfilePic = reviewerProfilePic
            };
            this.reviews = listReviewsData;
        },
        refreshReviews() {
            this.fetchReviews();
        }
    },
    props : {
        addReviewAvailable : Boolean,
        userId : String
    }
}
</script>

<style scoped>

.reviews-page-wrapper {
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    width:100%;
    height:100%;
    background-color: #F9EEEE;
    color:orange;
    overflow: scroll;
}

.heading {
    display:flex;
    flex-direction:row;
    height:100px;
    width:100%;
    justify-content: space-between;
    align-items:center;
    margin-top:30px;
}

.heading .placeholder {
    width:300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.placeholder button {
    width:150px;
    height:40px;
    border-radius:5px;
    background-color: orange;
    color:white;
    border:none;
    font-size:15px;
}

.placeholder button:hover {
    background-color: rgb(255, 191, 0);
}

.heading h1 {
    font-size:50px;
    font-weight:bold;
    height:100%;
    text-align:center;
}


.block-background {
    background-color: #d7d3d3;
    color:rgb(231, 153, 8);
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
    width:700px;
    height:300px;
}
.no-reviews-container {
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width:100%;
    margin-top:100px;
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
    