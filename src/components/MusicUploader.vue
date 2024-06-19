
<template>
    <div style="margin: 0 auto;text-align: center">

    <UpLoader></UpLoader>
        <hr>
        <hr>
    <VoiceRecorder></VoiceRecorder>

    </div>

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