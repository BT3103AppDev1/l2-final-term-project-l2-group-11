<template>
    <div class = "review-card-container">
        <div class = "review-header">
            <div class = "reviewer-details">
                <img v-bind:src = "reviewDetails.reviewerProfilePic"/>
                <h5>{{ reviewDetails.reviewerUsername }}</h5>
            </div>
            <h5 class = "review-date">Date of Review: {{ reviewDetails.date }}</h5>
        </div>

        <div class = "ratings">
            <img src = "../assets/lit-star.png"/>
            <img v-if = "parseInt(reviewDetails.ratings) < 2" src = "../assets/unlit-star.png"/>
            <img v-else src = "../assets/lit-star.png"/>

            <img v-if = "parseInt(reviewDetails.ratings) < 3" src = "../assets/unlit-star.png"/>
            <img v-else  src = "../assets/lit-star.png"/>

            <img v-if = "parseInt(reviewDetails.ratings) < 4" src = "../assets/unlit-star.png"/>
            <img v-else src = "../assets/lit-star.png"/>

            <img v-if = "parseInt(reviewDetails.ratings) < 5" src = "../assets/unlit-star.png"/>
            <img v-else src = "../assets/lit-star.png"/>
        </div>

        <h3 class = "project-title">{{ reviewDetails.projectTitle }}</h3>
        <div class = "review">
            <p>{{reviewDetails.review}}</p>
        </div>
    </div>
</template> 


<script>
export default {
    props : {
        reviewDetails:Object
    }

}
</script>

<style scoped>
.review-card-container {
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:left;
    width:700px;
    height:300px;
}

.review-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width:100%;
    height:50px;
}

.review-header h5 {
    font-size: 17px;
    color:black;
}

.reviewer-details {
    display: flex;
    flex-direction: row;
    gap:10px;
    align-items: center;
    width:60%;
    height:100%;
}

.reviewer-details img {
    height:40px;
    width:40px;
    object-fit:cover;
    border-radius: 50%;
    border:1px solid black;
}

.reviewer-details h5 {
    font-size: 15px;
}

.review-date {
    width:40%;
    text-align: right;
    font-size: 15px;
}

.ratings {
    margin-top:10px;
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap:2px;
    height:20px;
    width:100%;
}
.ratings img {
    height:20px;
    width:20px;
    object-fit: contain;
}

.project-title {
    margin-top:10px;
    font-size:20px;
    color:orange;
    font-weight: bold;
}

.review {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: left;
    width:100%;
    color:black;
}

</style>