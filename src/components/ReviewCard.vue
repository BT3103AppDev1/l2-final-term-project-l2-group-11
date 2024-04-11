<template>
    <div class = "review-card-container">
        <div class = "review-header">
            <div class = "reviewer-details">
                <img v-bind:src = "reviewDetails.reviewerProfilePic"/>
                <h5>{{ reviewDetails.reviewerUsername }}</h5>
            </div>
            <h5>Date of Review: {{ reviewDetails.date }}</h5>
        </div>
            <img v-if = "reviewDetails.ratings === 5" src = "../assets/rating.png" class = "ratings"/>
            <img v-else-if = "reviewDetails.ratings === 4" src = "../assets/rating.png" class = "ratings"/>
            <img v-else-if = "reviewDetails.ratings === 3" src = "../assets/rating.png" class = "ratings"/>
            <img v-else-if = "reviewDetails.ratings === 2" src = "../assets/rating.png" class = "ratings"/>
            <img v-else src = "../assets/rating.png" class = "ratings"/>

        <h3>{{ reviewDetails.projectTitle }}</h3>
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
    justify-content:center;
    align-items:left;
    width:100%;
    height:100%;
}

.review-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width:100%;
    height:20%;
}

.review-header h5 {
    font-size: 17px;
    color:black;
}

.reviewer-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width:100px;
    height:100%;
}

.reviewer-details img {
    height:40px;
    width:40px;
    object-fit:cover;
    border-radius: 50%;
}

.reviewer-details h5 {
    font-size: 17px;
    margin-left:7px;
}

.review-card-container h3 {
    font-weight:bold;
    color:orange;
}

img.ratings {
    height:50px;
    width:70px;
    object-fit: cover;
}

.review {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width:100%;
    color:black;
}

</style>