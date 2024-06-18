<template>

    <div class="voice-recorder">
        <van-button type="primary" @click="startRecording" :disabled="isRecording" style="margin-right: 20px;">开始录音</van-button>
        <van-button plain type="primary" @click="stopRecording" :disabled="!isRecording">结束录音</van-button>

    </div>
    <div v-if="audioUrl" style="text-align: center">
        <van-divider>录音预览</van-divider>
        <audio :src="audioUrl" controls></audio>
    </div>
</template>

<script>

export default {
    name: 'VoiceRecorder',
    data() {
        return {
            isRecording: false,
            audioUrl: null,
            mediaRecorder: null,
            audioChunks: [],
        };
    },
    methods: {
        async startRecording() {
            this.isRecording = true;
            this.audioChunks = [];
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    this.audioUrl = URL.createObjectURL(audioBlob);
                };
                this.mediaRecorder.start();
            } catch (error) {
                console.error('Error accessing microphone', error);
                this.isRecording = false;
            }
        },
        stopRecording() {
            this.isRecording = false;
            if (this.mediaRecorder) {
                this.mediaRecorder.stop();
            }
        },
    },
};
</script>

<style scoped>
.voice-recorder {
    padding: 20px;
    display: flex;
    justify-content: center;
}
</style>
