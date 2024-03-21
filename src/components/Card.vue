<template>
    <div class = "project-card" >
        <img src = "../assets/cardImage.png"/>
        <div class = "project-card-details">
            <div class = "card-header">
                <div class = "user-details">
                    <img src = "../assets/cardImage.png"/>
                    <h4>{{ user }}</h4>
                </div>
                <div class = "ratings">
                    <img src = "../assets/rating.png"/>
                </div>
            </div>
            <div class = "card-body">
                <div class = "project-details">
                    <h4>Project: {{ projectName }}</h4>
                    <h5>Skill Level : {{skillLevel}}</h5>
                </div>
                <div class = "bookmark-icon">
                    <img v-on:click = "toggleBookmark" v-if = "bookmarked" src = "../assets/bookmark-white.png"/>
                    <img v-on:click = "toggleBookmark" v-else color = "black" src = "../assets/bookmark.png"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                user : "Peter Pan",
                bookmarked : false,
                projectName: "Iris Flower Classification",
                skillLevel : "Beginner"

            }
        },
        methods : {
            toggleBookmark() {
                this.bookmarked = !this.bookmarked
            }
        }
    }

</script>

<style scoped>
.project-card {
    height: 230px;
    width: 280px;
    display:flex;
    flex-direction:column;
    justify-content: flex-start;
    align-items: center;
    background-color: orange;
    border-radius: 5px;
}

.project-card img {
    height: 65%;
    width: 100%;
    border-radius: 5px;
}

.project-card-details {
    height:35%;
    width: 100%;
    display:flex;
    flex-direction:column;
    justify-content: flex-start;
    align-items: center;
    padding-top:5px;
}

.project-card-details .card-header {
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    align-items: center;
    width:100%;
    height:40%;
}

.user-details {
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    padding-left:10px;
    color:white;
}

.user-details img {
    height:30px;
    width:30px;
    padding-right:5px;
    border-radius:100%;
}

.ratings img {
    height:50px;
    width:55px;
    padding-right:10px;
}

.project-card-details .card-body {
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    align-items: center;
    height:60%;
    width:100%;
    color:white;

}

.project-details {
    display:flex;
    flex-direction:column;
    justify-content: flex-start;
    align-items: left;
    font-size: 12px;
    padding-left:10px;
}

.bookmark-icon img {
    height:30px;
    width:35px;
    padding-right:10px;
}

</style>

