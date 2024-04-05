<script setup>
import Heading from "../components/Heading.vue";
import HomeProject from "../components/HomeProject.vue";
</script>

<template> 
    <div class = "project-page-wrapper">
        <Heading/>
        <HomeProject/>
    </div>
</template>
<script>
    export default {
        name:"About",
        components: {
            Heading,
            HomeProject
        }
    }
</script>

<style scoped>
.project-page-wrapper {
    background-color:white;
}
</style>



