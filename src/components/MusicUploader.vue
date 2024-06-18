
<template>
    <UpLoader></UpLoader>
    <VoiceRecorder></VoiceRecorder>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import UpLoader from "@/components/UpLoader.vue";
import VoiceRecorder from "@/components/VoiceRecorder.vue";

export default {
    name: "index",
    components: {VoiceRecorder, UpLoader}
}
</script>

<style scoped>

</style>