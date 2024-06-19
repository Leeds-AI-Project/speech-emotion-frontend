<template>
    <div class="voice-recorder">
        <van-button type="primary" @click="startRecording" :disabled="isRecording" style="margin-right: 20px; " >开始录音</van-button>
        <van-button plain type="primary" @click="stopRecording" :disabled="!isRecording">结束录音</van-button>
    </div>
    <div v-if="isRecording" style="text-align: center; margin-top: 20px;">
        <van-divider>录音时间</van-divider>
        <div style="color:black">{{ formatTime(recordingTime) }}</div>
    </div>
    <div v-if="audioUrl" style="text-align: center;">
        <audio :src="audioUrl" controls></audio>
    </div>
    <div style="margin: 10px;">
        <van-button type="primary" >上传音频</van-button>
    </div>
</template>

<script>
import { VoiceRecorder } from 'capacitor-voice-recorder';

export default {
    name: 'VoiceRecorderComponent',
    data() {
        return {
            isRecording: false,
            recordingTime: 0,
            recordingInterval: null,
            audioUrl: null,
        };
    },
    methods: {
        async startRecording() {
            try {
                await VoiceRecorder.requestAudioRecordingPermission();
                const result = await VoiceRecorder.startRecording();
                if (result.value) {
                    this.isRecording = true;
                    this.recordingTime = 0;
                    this.startTimer();
                } else {
                    console.error('Failed to start recording');
                }
            } catch (error) {
                console.error('Error starting recording:', error);
            }
        },
        async stopRecording() {
            try {
                const result = await VoiceRecorder.stopRecording();
                if (result.value.recordDataBase64) {
                    const audioBlob = this.base64ToBlob(result.value.recordDataBase64, 'audio/aac');
                    this.audioUrl = URL.createObjectURL(audioBlob);
                }
                this.isRecording = false;
                this.stopTimer();
            } catch (error) {
                console.error('Error stopping recording:', error);
            }
        },
        startTimer() {
            this.recordingInterval = setInterval(() => {
                this.recordingTime++;
            }, 1000);
        },
        stopTimer() {
            clearInterval(this.recordingInterval);
            this.recordingInterval = null;
        },
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        },
        base64ToBlob(base64, type) {
            const byteCharacters = atob(base64);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            return new Blob(byteArrays, { type });
        },
    },
};
</script>

<style scoped>
.voice-recorder {
    margin: 0 auto;
    padding: 20px;
    display: flex;
    justify-content: center;
    text-align: center;
}
</style>
