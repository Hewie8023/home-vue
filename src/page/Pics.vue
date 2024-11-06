<template>
  <div class="container" ref="container">
    <img class="image" ref="image" :src="imgSrc" />
    <!-- 背景图片高斯模糊形成渐变效果 -->
    <img
        class="object-fill bg-poster"
        :src="imgSrc"
        :draggable="false"
    />
    <div class="inner"></div>
  </div>
</template>

<script setup="ts">
import useWebSocket from '@/utils/websocket';
import {onMounted, ref, onUnmounted} from "vue";
import {onBeforeRouteLeave, useRouter} from 'vue-router'
import {startTask, stopTask} from "@/api/api"

const wsOptions = {
  url: "ws://127.0.0.1:8080/websocket/pics"
};
const { open, close, reconnect, on, send } = useWebSocket(wsOptions);
const router = useRouter()
const imgSrc = ref('')
const container = ref(null)

onMounted(() => {

  open();//在onMounted钩子中调用open函数，链接websocket
  // window.addEventListener('beforeunload', (event) => {
  //   console.log("before upload")
  //   stopTask()
  // })
  startTask()

  // 注册消息接收处理函数
  on('message', (data) => {
    if (data.ws != null) {
        if (!data.ws.includes('pics')) {
          router.push({path: data.ws })
        }
    }
    if (data.pic != null) {
      console.log(data.pic["link"])
      console.log(data.pic["mainColor"])
      imgSrc.value = data.pic["link"]
      console.log("pic value..." + imgSrc.value)
      container.value.style.backgroundColor = data.pic["mainColor"]
    }
  });

  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  close(true)
  console.log("pics page unmounted...")
  stopTask()

  window.removeEventListener('beforeunload', handleBeforeUnload);
})

function handleBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = '';
    console.log("before upload")
    stopTask()
}
// onBeforeRouteLeave(() => {
//   close()
//   console.log("pics page beforeRouteLeave...")
//   stopTask()
// })
</script>

<style>
.container{
  position: fixed; /* 使容器固定定位 */
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover; /* 背景图片覆盖整个容器 */
  background-position: center; /* 背景图片居中 */
}

.image {
  width: auto;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  transition: opacity 1s ease-in-out;
}

.bg-poster {
  position: fixed;
  left:50%;
  top:50%;
  z-index: -2;
  transform:translate(-50%,-50%);
  width: 100%;
  background-size: contain;
}

.inner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
}

</style>