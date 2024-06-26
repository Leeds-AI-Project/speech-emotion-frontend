<template>
  <div>
    <div class="upload-container">
      <!-- 自定义上传区域，点击时触发文件选择框 -->
      <div
        class="custom-uploader"
        @click="triggerFileInput"
        style="margin-top: 50px; margin-bottom: 50px"
      >
        <input
          ref="fileInput"
          type="file"
          accept="audio/*"
          @change="handleFileChange"
          style="display: none"
        />
      </div>
      <span class="myfilename" style="height: 50px; font-size: 15px; color: black">{{
        filename
      }}</span>

      <div v-if="audioUrl" style="text-align: center; margin-top: 20px">
        <audio :src="audioUrl" controls style="width: 90%"></audio>
      </div>
    </div>

    <van-button
      type="primary"
      @click="uploadAudio"
      :disabled="fileList.length === 0"
      round
      icon="guide-o"
      style="margin: 20px 0 30px 0"
    ></van-button>
    <div style="color: black">{{ result }}</div>
  </div>
</template>

<script setup lang="ts">
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem'
import { Http } from '@capacitor-community/http'
import { showToast, showFailToast, showLoadingToast, closeToast, showSuccessToast } from 'vant'
import { computed, ref } from 'vue'
import { base64ToBlob } from '@/utils'

const fileList = ref([]) // 用于存储选择的音频文件列表
const audioUrl = ref(null) // 用于存储录音文件的 URL
const result = ref('暂无结果')
const filename = computed(() => {
  console.log(fileList.value.length)
  if (fileList.value.length === 0) {
    console.log('hhh')
    return '未上传音频'
  }
  console.log('name', fileList.value[0].name)
  return fileList.value[0].name
})

const fileInput = ref()

const triggerFileInput = () => {
  fileInput.value.click()
}
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('audio/')) {
    // 替换 fileList 中的文件
    fileList.value = [file]
    // 生成预览 URL
    audioUrl.value = URL.createObjectURL(file)
    console.log('file', filename)
  } else {
    showFailToast('请上传音频文件')
  }
}

const uploadAudio = async () => {
  if (fileList.value.length === 0) {
    showFailToast('请先选择音频文件')
    return
  }

  const file = fileList.value[0]
  try {
    // 读取文件为 base64 编码
    const reader = new FileReader()
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1]
      const path = `audio/${file.name}`

      // 将文件写入文件系统
      await Filesystem.writeFile({
        path: path,
        data: base64Data,
        directory: FilesystemDirectory.Data
      })

      // 构建 formData 并上传文件
      const formData = new FormData()
      formData.append('file', base64ToBlob(base64Data, file.type), file.name)

      showLoadingToast({
        message: '评估中',
        duration: 0,
        forbidClick: true
      })
      const response = await Http.post({
        url: 'http://127.0.0.1:5000/api/upload',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
      closeToast()
      if (response.status === 200) {
        showSuccessToast('评估完成')
        result.value = response.data
      } else {
        showFailToast('文件上传失败')
      }
    }
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('Error uploading file:', error)
    showFailToast('文件上传失败')
  }
}
</script>
<script lang="ts">
export default {
  name: 'UpLoader'
}
</script>
<style scoped>
.upload-container {
  padding: 16px;
  text-align: center;
}
.custom-uploader {
  background: url('../assets/imgs/upload_music.png');
  background-size: 200px 200px;
  background-repeat: no-repeat;
  background-position: center;
  margin: 50px auto;
  width: 200px;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  cursor: pointer;
  position: relative;
}
.myfilename {
  width: 200px;
  display: inline-block;
  line-height: 50px;
  border-radius: 5px;
  position: relative;
  z-index: 0;
}
:deep(.my-swipe .van-swipe-item[data-v-cc12edcf]) {
  line-height: 0px !important;
}
</style>
