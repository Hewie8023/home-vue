<template>
  <div class="clock-container">
    <flip-item :total="2" :current="timeArr[0]"/>
    <flip-item :total="9" :current="timeArr[1]"/>
    <div class="colon"></div>
    <flip-item :total="5" :current="timeArr[2]"/>
    <flip-item :total="9" :current="timeArr[3]"/>
    <div class="colon"></div>
    <flip-item :total="5" :current="timeArr[4]"/>
    <flip-item :total="9" :current="timeArr[5]"/>
  </div>
</template>

<script setup="ts">
import FlipItem from '../components/FlipItem.vue'
import { getTimeArr } from '@/utils/utils'
import useWebSocket from '@/utils/websocket';
import {onMounted, ref, onUnmounted} from "vue";
import {onBeforeRouteLeave, useRouter} from 'vue-router'
import {stopTask} from "@/api/api";

const wsOptions = {
  url: "ws://127.0.0.1:8080/websocket/clock"
};
let timer
const { open, close, reconnect, on, send } = useWebSocket(wsOptions);
const timeArr = ref('')
const router = useRouter()

onMounted(() => {
  stopTask()
  timeArr.value = getTimeArr()
  startTimer()

  open();//在onMounted钩子中调用open函数，链接websocket

  // 注册消息接收处理函数
  on('message', (data) => {
    if (!data.ws.includes('clock')) {
      router.push({path: data.ws })
    }
  });

});

onUnmounted(() => {
  stopTimer()
  close(true)
  console.log('clock page unmounted ... ')

})
// onBeforeRouteLeave(() => {
//   stopTimer()
//   close()
//   console.log('clock page route leave ... ')
// })

function startTimer() {
  timer = setTimeout(() => {
    stopTimer()
    timeArr.value = getTimeArr()
    startTimer()
  }, 1000)
}

function stopTimer() {
  clearTimeout(timer)
}

</script>

<style>

.clock-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000 !important;
}

.colon {
  height: 50px;
  padding: 0 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.colon::after,
.colon::before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  background: rgba(244, 244, 244, 0.7);
  border-radius: 50%;
}
</style>

