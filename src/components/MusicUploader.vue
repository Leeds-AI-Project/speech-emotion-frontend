<template>
    <div class="header">
        <img src="../assets/imgs/logo.png" style="height:40px;">
    </div>

    <van-swipe class="my-swipe" indicator-color="grey">
        <van-swipe-item>
            <UpLoader></UpLoader>
        </van-swipe-item>
        <van-swipe-item>
            <VoiceRecorder></VoiceRecorder>
        </van-swipe-item>
    </van-swipe>


    <van-tabbar v-model="active">
        <van-tabbar-item icon="audio">音频分析</van-tabbar-item>
        <van-tabbar-item icon="manager">我的</van-tabbar-item>
    </van-tabbar>

</template>

<script>
import UpLoader from "@/components/UpLoader.vue";
import VoiceRecorder from "@/components/VoiceRecorder.vue";

export default {
    name: "index",
    components: {VoiceRecorder, UpLoader}
}
</script>

<style scoped>
body {
    padding: 0px;
}

.header {
    text-align: center;
    margin: 0;
    padding: 0;
    height: 50px;
    background: #3377dd;
    line-height: 50px;
}


:deep(.van-swipe__indicator )
{
    --van-swipe-indicator-size: 15px;
    opacity:1;
    --van-swipe-indicator-active-opacity:0.2;
}
.my-swipe .van-swipe-item {


    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;

}
.my-swipe .van-swipe-item[data-v-cc12edcf]{
    line-height: 0px;
}
.my-swipe{
    height:600px;

}
</style>