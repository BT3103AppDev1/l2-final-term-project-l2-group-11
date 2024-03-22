<script setup>
import Heading from "../components/Heading.vue";
import Project from "../components/HomeProject.vue";
</script>

<template>
    <Heading/>
    <Project/>
</template>

<script>
    export default {
        name:"About",
        components: {
            Heading,
            Project
        }
    }
</script>



