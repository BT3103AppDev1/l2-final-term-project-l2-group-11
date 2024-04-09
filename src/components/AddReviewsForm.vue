<template>
    <form>
        <heading class = "heading">
            <div class = "form-cross">
                <h3>Leave a Review</h3>
                <button type = "button" v-on:click.prevent = "closeReviewForm">X</button>
            </div>
            <img src = "../assets/rating.png" class = "ratings"/>
        </heading>
        <textarea rows = "6" placeholder="Add your review" v-model = "review" type = "text">
        </textarea>
        <div class = "add-review-button">
            <button type = "button" v-on:click.prevent = "submitReviewForm">Upload</button>
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            review:"",
        }
    }, 
    methods : {
        submitReviewForm() {
            alert("review submited");
            this.$emit("closeReviewFormPopup");
        },
        closeReviewForm() {
            this.$emit("closeReviewFormPopup");
        }
    },
    emits: ["closeReviewFormPopup"]
}
</script>

<style scoped>

.heading {
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items:start;
    width:90%;
    height:100px;
    padding-top: 5px;
} 

.form-cross {
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    width:100%;
    height:50px;
}

.heading .form-cross h3 {
    font-size:40px;
    font-weight:bold;
    color:orange;
    width:95%;
}

.heading .form-cross button {
    border:none;
    background-color: transparent;
    font-weight:300;
    font-size:30px;
    color:grey;
    width:5%;
}

form {
    height:320px;
    width:550px;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    background-color: #F9EEEE;
    color:white;
    font-size: 20px;
    border-radius:10px;
    border: 2px solid orange ;
}

textarea {
    width:90%;
    margin-top: 10px;
    border-radius:10px;
    border:1px solid black;
}

.add-review-button {
    height:40px;
    width:90%;
    display:flex;
    flex-direction:row;
    justify-content: flex-end;
    align-items: center;
    margin-top:20px;
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

img.ratings {
    height:70px;
    width:120px;
    object-fit: cover;
}


</style>