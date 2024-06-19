<template>
    <div class="voice-recorder">
        <van-button type="primary" @click="startRecording" :disabled="isRecording" style="margin-right: 20px;">开始录音</van-button>
        <van-button plain type="primary" @click="stopRecording" :disabled="!isRecording">结束录音</van-button>

    </div>
    <div v-if="isRecording">
        <van-divider>录音时间</van-divider>
        <div>{{ formatTime(recordingTime) }}</div>
    </div>
    <div v-if="audioUrl" style="text-align: center;">
        <van-divider>录音预览</van-divider>
        <audio :src="audioUrl" controls></audio>

        <van-button type="primary" @click="uploadAudio">上传录音</van-button>
    </div>
</template>

<script>
import { Filesystem, FilesystemDirectory, FilesystemEncoding } from '@capacitor/filesystem';
import { Http } from '@capacitor-community/http';

export default {
    name: 'VoiceRecorder',
    data() {
        return {
            isRecording: false,
            audioUrl: null,
            mediaRecorder: null,
            recordingTime: 0,
            recordingInterval:null,
            audioChunks: [],
            audioFile: null,
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
                this.mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    this.audioUrl = URL.createObjectURL(audioBlob);

                    // Save the audio file
                    const base64Data = await this.convertBlobToBase64(audioBlob);
                    const result = await Filesystem.writeFile({
                        path: 'recording.wav',
                        data: base64Data,
                        directory: FilesystemDirectory.Data,
                        encoding: FilesystemEncoding.UTF8
                    });
                    this.audioFile = result.uri;
                };
                this.mediaRecorder.start();
                this.recordingInterval = setInterval(() => {
                    this.recordingTime++;
                }, 1000);
            } catch (error) {
                console.error('Error accessing microphone', error);
                this.isRecording = false;
            }
        },

        stopRecording() {
            this.isRecording = false;
            clearInterval(this.recordingInterval);
            if (this.mediaRecorder) {
                this.mediaRecorder.stop();
            }
        },
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        },
        async convertBlobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        },
        async uploadAudio() {
            if (!this.audioFile) {
                alert('No audio recorded yet!');
                return;
            }

            try {
                const file = await Filesystem.readFile({
                    path: this.audioFile,
                    directory: FilesystemDirectory.Data,
                    encoding: FilesystemEncoding.UTF8
                });

                const formData = new FormData();
                formData.append('file', this.base64ToBlob(file.data), 'recording.wav');

                const response = await Http.post({
                    url: 'YOUR_UPLOAD_URL',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: formData
                });

                console.log('File uploaded successfully:', response);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        },
        base64ToBlob(base64, type = 'audio/wav') {
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
        }
    }
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
