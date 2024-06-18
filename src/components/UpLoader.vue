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
    </div>

</template>

<script>
import { Uploader, Toast ,Button} from 'vant';

export default {
    name: "UpLoader",
    components: {
        'van-uploader': Uploader
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
    border: 2px dashed #ccc; /* 虚线边框 */
    border-radius: 4px; /* 边框圆角 */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff; /* 背景色 */
    cursor: pointer; /* 鼠标指针样式 */
    position: relative; /* 相对定位 */
}

.myfilename {
    width: 200px;
    display: inline-block; /* 使元素能够包含内容并应用样式 */
    padding: 10px; /* 内边距，根据需要调整 */
    border: 4px solid #d3b4f5; /* 浅紫色，内边框颜色 */
    border-radius: 5px;
    background-color: #f0e6ff; /* 浅紫色，背景色 */
    position: relative;
    z-index: 0;
}




</style>
