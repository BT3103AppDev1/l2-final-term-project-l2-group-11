<script setup>
import AuthForm from "../components/AuthForm.vue";
</script>

<template>
    <div class = "view-container">
        <AuthForm/>
    </div>
</template>

<script>
    export default {
        name:"Authentication",
        components: {
            AuthForm
        }
    }
</script>

<style scoped>
.view-container {
    width:100%;
    height:100%;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
}

</style>
