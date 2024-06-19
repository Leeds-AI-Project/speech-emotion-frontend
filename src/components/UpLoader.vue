<template>
    <div class="upload-container">
        <!-- 自定义上传区域，点击时触发文件选择框 -->
        <div class="custom-uploader" @click="triggerFileInput">
            <input
                ref="fileInput"
                type="file"
                accept="audio/*"
                @change="handleFileChange"
                style="display: none;"
            />
            <span v-if="fileList.length === 0">点击上传音频</span>
            <span v-else>{{ filename }}</span>
        </div>
        <span class="myfilename">{{ filename }}</span>
        <div style="margin:10px;"><van-button type="primary" @click="uploadAudio" :disabled="fileList.length === 0">上传音频</van-button></div>
    </div>
</template>

<script>
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { Http } from '@capacitor-community/http';
import { Toast, Button } from 'vant';

export default {
    name: "UpLoader",
    components: {
        'van-button': Button
    },
    data() {
        return {
            fileList: [], // 用于存储选择的音频文件列表
        };
    },
    computed: {
        filename() {
            if (this.fileList.length === 0) {
                return '未选择音频文件';
            }
            return this.fileList[0].name;
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('audio/')) {
                // 替换 fileList 中的文件
                this.fileList = [file];
            } else {
                Toast.fail('请上传音频文件');
            }
        },
        async uploadAudio() {
            if (this.fileList.length === 0) {
                Toast.fail('请先选择音频文件');
                return;
            }

            const file = this.fileList[0];
            try {
                // 读取文件为 base64 编码
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64Data = reader.result.split(',')[1];
                    const path = `audio/${file.name}`;

                    // 将文件写入文件系统
                    await Filesystem.writeFile({
                        path: path,
                        data: base64Data,
                        directory: FilesystemDirectory.Data
                    });

                    // 构建 formData 并上传文件
                    const formData = new FormData();
                    formData.append('file', this.base64ToBlob(base64Data), file.name);

                    const response = await Http.post({
                        url: 'YOUR_UPLOAD_URL',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: formData
                    });

                    if (response.status === 200) {
                        Toast.success('文件上传成功');
                    } else {
                        Toast.fail('文件上传失败');
                    }
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading file', error);
                Toast.fail('文件上传失败');
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
.upload-container {
    padding: 16px;
    text-align: center;
}
.custom-uploader {
    background: url('../assets/imgs/upload_music.png');
    background-size: 80px 80px;
    background-repeat: no-repeat;
    background-position: center;
    margin: 20px auto;
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
    padding: 10px;
    border: 4px solid #d3b4f5;
    border-radius: 5px;
    background-color: #f0e6ff;
    position: relative;
    z-index: 0;
}
</style>
