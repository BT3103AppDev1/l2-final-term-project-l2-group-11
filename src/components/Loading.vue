<template>
    <div class = "loading-spinner-box-wrapper">
        <div class = "loading-spinner-box">
            <h5>Loading</h5>
        </div>
    </div>
</template>



<style scoped>
.loading-spinner-box {
    background-color:white;
    height:100px;
    width:100px;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items:center;
    color:#F5793B;
    border: 2px solid #F5793B;
    border-radius:10px;
}

.loading-spinner-box-wrapper {
    background-color:transparent;
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items:center;
    position:fixed;
    top:0px;
    left:0px;
    font-size:20px;
    z-index:2;
}

</style>