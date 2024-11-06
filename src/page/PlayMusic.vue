<template>
<div class="player">
  <div class="content">
    <!-- 音乐详情内容 -->
    <div class="music-content">
      <!-- 左侧黑胶唱片 -->
      <div class="left-song-cover">
        <!-- 唱片臂 -->
        <div class="song-arm">
          <!-- 这里通过类名控制唱片臂的旋转角度 -->
          <img
              class="w-full h-full rotate-[-45deg]"
              src="@/assets/arm.png"
              mode="aspectFit"
          />
        </div>

        <!-- 黑胶唱片，这里控制图片旋转 -->
        <div
            class="song-disc"
            :class="{ rotate: true }"
            :style="{
              'animation-play-state':  'running',
            }"
        >
          <img
              class="song-poster1"
              src="@/assets/heijiaochangpian.png"
              mode="aspectFill"
          />
          <!-- 歌曲封面海报 -->
          <img
              class="song-poster"
              :src="audioCover"
              mode="aspectFill"
          />
        </div>
      </div>

      <div class="music-desc">
        <div class="name">{{audioName}}</div>
        <div class="singer">{{audioAuthor}}</div>
      </div>
    </div>
  </div>

  <!-- 背景图片高斯模糊形成渐变效果 -->
  <img
      class="object-fill bg-poster"
      :src="audioCover"
      :draggable="false"
  />
  <div class="inner"></div>

    <audio @ended="onAudioEnded" id="audio" autoplay ref="audioPlayer" :src="audioSrc"></audio>

</div>
</template>

<script setup="ts">
import useWebSocket from '@/utils/websocket';
import {onMounted, ref, onUnmounted, reactive, watch} from "vue";
import {onBeforeRouteLeave, useRouter, useRoute} from 'vue-router'
import {getRandomMusic, getLocalMusic} from "@/api/api";

const PlayBack_data = reactive({
  loopType: localStorage.getItem("PlayBackLoopType") ?? 1, //循环方式 1:列表循环 2:单曲循环
  textShowArr: [], //展示的歌词
  index_one: localStorage.getItem("PlayBackOneIndex") - 0 ?? 0, //第一层下标
  index_two: localStorage.getItem("PlayBackTwoIndex") - 0 ?? 0, //第二层下标
  bgColor: "", //背景色
  status: true, //是否播放
  the_num: 0, //当前播放进度
  max_num: 0, //总时间
  preload_num: 0, //预加载百分比
  the_text_index: 0, //当前歌词下标
  go_index: 0, //歌词指示器的下标
});
const wsOptions = {
  url: "ws://127.0.0.1:8080/websocket/playMusic"
};
const { open, close, reconnect, on, send } = useWebSocket(wsOptions);
const router = useRouter()
const audioSrc = ref('')
const audioPlayer = ref<HTMLAudioElement>(null)
const audioCover = ref('')
const audioName = ref('')
const audioAuthor = ref('')
const timer = ref(null)

const route = useRoute()
const paramId = route.params.id

onMounted(() => {
  console.log(route)
  console.log(paramId)

  open();//在onMounted钩子中调用open函数，链接websocket
  // 注册消息接收处理函数
  on('message', (data) => {
    router.push({path: data.ws })
    // if (!data.ws.includes('playMusic')) {
    //   router.push({path: data.ws })
    // } else {
    //   let id = data.ws.split('/')[1]
    //   if (id !== '-1') {
    //     router.push({path: data.ws })
    //   }
    // }
  });

  if (paramId === '-1') {
    fetchRandomMusic()
  } else {
    fetchLocalMusic(paramId)
  }
});

watch(
    () => route.params,
    (newParams, oldParams) => {
      console.log('路由参数变化了', newParams, oldParams);

      if (newParams.id === '-1') {
        fetchRandomMusic()
      } else {
        fetchLocalMusic(newParams.id)
      }
    },
    {
      deep: true
    }
)


function onAudioEnded() {
  console.log("播放完成...继续下一首...")
  fetchRandomMusic()
  let audio = document.getElementById('audio')
  audio.play()
  console.log(audio)
  console.log("paly...")
}

onUnmounted(() => {
  close(true)
  audioPlayer.value?.stop();
  console.log('play music page unmounted ...')
})
// onBeforeRouteLeave(() => {
//
//   close()
//   audioPlayer.value?.stop();
//   console.log('play music page route leave ...')
// })

function fetchRandomMusic() {
  getRandomMusic().then(res => {
    console.log(res)
    audioCover.value = res.data.pic
    audioSrc.value = res.data.url.split('?')[0]
    audioAuthor.value = res.data.author
    audioName.value = res.data.title.split('.')[0]
  })
}

function fetchLocalMusic(id) {
  console.log("id===>" + id)
  getLocalMusic(id).then(res => {
    audioCover.value = res.data.pic
    audioSrc.value = res.data.url.split('?')[0]
    audioAuthor.value = res.data.author
    audioName.value = res.data.title.split('.')[0]
    console.log(res.data)
  })
}


</script>

<style scoped>
.player {
  height: 100%;
}
.content {
  position: relative;
  height: calc(100% - 50px);
  overflow-y: scroll;
  /*定义滚动条外层轨道的样式*/
  /*定义滚动条整体的样式*/
  /*滚动条里面可以拖动的那个*/
}

.content::-webkit-scrollbar-track {
  border-radius: 10px;
}

.content::-webkit-scrollbar {
  width: 10px;
  background-color: rgba(255, 255, 255, 0);
}

.content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.2);
}

.content .delete-menu {
  position: absolute;
  z-index: 99;
  font-size: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}

.content .delete-menu .action {
  /*padding: 8px 16px;*/
  cursor: pointer;
}

.content .delete-menu .action:hover {
  border-radius: 4px;
  background: var(--el-fill-color-light);
}

.rotate {
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

.music-content {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  gap: 40px;
  margin: 0 30px 50px 100px;
}

.music-content .left-song-cover {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  /*height: 80%;*/
  margin: auto;
  padding: 60px;
}

.music-content .left-song-cover .song-arm {
  width: 200px;
  height: 400px;
  position: absolute;
  right: 44%;
  top: -30px;
  transform: translateX(70%) rotate(-10deg);
  z-index: 2;
}

.music-content .left-song-cover .song-arm > img {
  transition: all 0.5s ease;
  transform-origin: top left;
  transform: scale(0.7);
}

.music-content .left-song-cover .song-disc {
  position: relative;
  z-index: 1;
  width: 650px;
  height: 650px;
  margin-top: 30px;
  border-radius: 50%;
  border: 15px solid rgba(211, 200, 200, 0.8);
}


.music-content .left-song-cover .song-disc .song-poster1 {
  width: 103%;
  height: 103%;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}


.music-content .left-song-cover .song-disc .song-poster {
  width: 55%;
  height: 55%;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

.music-desc {
  color: #ffffff;
  font-size: 40px;
  font-weight: 400;
  padding-right: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /*white-space: nowrap;*/
}
.name {
  margin-bottom: 10px;
  font-size: 80px;
  font-weight: 600;
  overflow-wrap: break-word;
  text-align: center;
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
  backdrop-filter: blur(80px);
}

</style>