<template>
  <div>
    <img
      src="../assets/imgs/microphone.jpg"
      alt="microphone"
      style="width: 200px; height: 200px; margin: 30px"
    />
    <div class="voice-recorder">
      <van-button type="primary" @click="startRecording" :disabled="isRecording"
        >开始录音</van-button
      >
      <van-button plain type="primary" @click="stopRecording" :disabled="!isRecording"
        >结束录音</van-button
      >
      <van-button
        type="primary"
        :disabled="!audioUrl"
        round
        icon="guide-o"
        @click="uploadAudio"
      ></van-button>
    </div>
    <div v-if="isRecording" style="text-align: center; margin-top: 20px; margin-bottom: 30px">
      <van-divider>录音时间</van-divider>
      <span style="color: black">{{ formatTime(recordingTime) }}</span>
    </div>
    <div v-if="audioUrl && !isRecording" style="text-align: center; margin-top: 20px">
      <audio :src="audioUrl" controls></audio>
    </div>
    <div style="color: black; margin-top: 30px">{{ result }}</div>
  </div>
</template>

<script>
import { VoiceRecorder } from 'capacitor-voice-recorder'
import { closeToast, showFailToast, showLoadingToast, showSuccessToast } from 'vant'
import axios from 'axios'
export default {
  name: 'VoiceRecorderComponent',
  data() {
    return {
      isRecording: false,
      recordingTime: 0,
      recordingInterval: null,
      audioUrl: null,
      result: '暂无结果'
    }
  },
  methods: {
    async startRecording() {
      try {
        await VoiceRecorder.requestAudioRecordingPermission()
        const result = await VoiceRecorder.startRecording()
        if (result.value) {
          this.isRecording = true
          this.recordingTime = 0
          this.startTimer()
        } else {
          console.error('Failed to start recording')
        }
      } catch (error) {
        console.error('Error starting recording:', error)
      }
    },
    async stopRecording() {
      try {
        const result = await VoiceRecorder.stopRecording()
        if (result.value.recordDataBase64) {
          const audioBlob = this.base64ToBlob(result.value.recordDataBase64, 'audio/aac')
          this.audioUrl = URL.createObjectURL(audioBlob)
        }
        this.isRecording = false
        this.stopTimer()
      } catch (error) {
        console.error('Error stopping recording:', error)
      }
    },
    async uploadAudio() {
      if (!this.audioUrl) {
        alert('没有录音可上传')
        return
      }

      try {
        const audioBlob = await fetch(this.audioUrl).then((r) => r.blob())
        const formData = new FormData()
        formData.append('file', audioBlob, 'recording.wav') // 可以根据你的需求修改文件名和格式
        showLoadingToast({
          message: '评估中',
          duration: 0,
          forbidClick: true
        })
        // 修改URL为你的上传接口地址
        const response = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        closeToast()
        if (response.status === 200) {
          showSuccessToast('评估完成')
          this.result = response.data
        } else {
          showFailToast('文件上传失败')
        }
      } catch (error) {
        console.error('上传出错:', error)
        alert('上传出错：' + error.message)
      }
    },
    startTimer() {
      this.recordingInterval = setInterval(() => {
        this.recordingTime++
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.recordingInterval)
      this.recordingInterval = null
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    },
    base64ToBlob(base64, type) {
      const byteCharacters = atob(base64)
      const byteArrays = []
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512)
        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      return new Blob(byteArrays, { type })
    }
  }
}
</script>

<style scoped>
.voice-recorder {
  margin: 30px auto;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  text-align: center;
}
/*.my-swipe .van-swipe-item[data-v-cc12edcf] {*/

/*    line-height: 0px !important;*/
/*}*/
:deep(.my-swipe .van-swipe-item[data-v-cc12edcf]) {
  line-height: 0px !important;
}
</style>
