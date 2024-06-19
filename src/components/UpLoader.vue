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

        </div>
        <span class="myfilename" style="height:50px;font-size:15px;color:black">{{ filename }}</span>

        <div v-if="audioUrl" style="text-align: center; margin-top: 20px;">
            <audio :src="audioUrl" controls></audio>
        </div>
        <div style="transform: translate(50%,50%) ;position:absolute;bottom:80px;width:50%">
            <van-button type="primary" @click="uploadAudio" :disabled="fileList.length === 0">分析音频文件</van-button>
        </div>
    </div>
</template>

<script>
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { Http } from '@capacitor-community/http';
import { Toast, Button, Divider } from 'vant';

export default {
    name: "UpLoader",
    components: {
        'van-button': Button,
        'van-divider': Divider
    },
    data() {
        return {
            fileList: [], // 用于存储选择的音频文件列表
            audioUrl: null, // 用于存储录音文件的 URL
        };
    },
    computed: {
        filename() {
            console.log(this.fileList.length)
            if (this.fileList.length == 0) {
                console.log('hhh')
                return '未上传音频';
            }
            console.log('name',this.fileList[0].name)
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
                // 生成预览 URL
                this.audioUrl = URL.createObjectURL(file);
                console.log('file',this.filename)
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
                    formData.append('file', this.base64ToBlob(base64Data, file.type), file.name);

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
                console.error('Error uploading file:', error);
                Toast.fail('文件上传失败');
            }
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
    background-size: 150px 150px;
    background-repeat: no-repeat;
    background-position: center;
    margin: 20px auto;
    width: 150px;
    height: 150px;
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
    line-height:50px;

    border-radius: 5px;


    position: relative;
    z-index: 0;
}
.my-swipe .van-swipe-item[data-v-cc12edcf] {

    line-height: 0px;
}
</style>
