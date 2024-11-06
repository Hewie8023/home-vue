<template>
  <div class="container" ref="container">
    <img class="image" ref="image" :src="imgSrc" />
  </div>
</template>

<script>
import * as api from '../api/api.js'
export default {
  data() {
    return {
      items: [],
      timer: null,
      index: 0,
      imgSrc: 'https://pic.netbian.com/uploads/allimg/240911/193124-17260542846c8e.jpg',
      imgList: [],
      resSrc: [],
      isClear: false,
      timerArray: [],
      countDown: 15,
      countDownTimer: null,
      countDownArray: [],
      websock: null,
    }
  },
  created() { // 页面创建生命周期函数
    // this.initWebSocket()
    // this.countDownFun();
  },
  destroyed: function () { // 离开页面生命周期函数
    this.clearTimer()
  },
  beforeDestroy() {
    this.clearTimer()
    if (this.countDownTimer) {
      clearInterval(this.countDownTimer);
      this.countDownTimer = null;
    }
    this.cleanws()
  },
  mounted() {
    // this.listPhotos();
  },
  methods: {
    // initWebSocket: function () {
    //   // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
    //   // this.websock = new WebSocket("ws://192.168.3.234:8080/websocket/hewie");
    //   if (this.websock && this.websock.readyState !== WebSocket.CLOSED) {
    //     this.websock.close()
    //   }
    //   this.websock = new WebSocket("ws://127.0.0.1:8080/websocket/hewie");
    //   this.websock.onopen = this.websocketonopen;
    //   this.websock.onerror = this.websocketonerror;
    //   this.websock.onmessage = this.websocketonmessage;
    //   this.websock.onclose = this.websocketclose;
    //   console.log("start init")
    // },
    // websocketonopen: function () {
    //   console.log("WebSocket连接成功");
    // },
    // websocketonerror: function () {
    //   console.log("WebSocket连接发生错误");
    // },
    // websocketonmessage: function (e) {
    //   console.log(e.data);
    //   if(e.data === "stop") {
    //     console.log("stop");
    //     this.listPhotos()
    //   } else if (e.data === "off hdmi") {
    //       //切换到时钟页面
    //     console.log(e.data)
    //     this.$router.push({path: '/clock'})
    //   } else if (e.data === "on hdmi") {
    //     //切换回index
    //     this.$router.push({path: '/index'})
    //   } else {
    //     this.$router.push({path: '/index'})
    //     this.clearTimer()
    //     this.clearCountDownTimer()
    //     console.log(e.data);
    //     //请求获取音乐封面的url
    //     let container = this.$refs.container
    //     let image = this.$refs.image
    //     api.getMusicCover(e.data).then(result => {
    //       console.log(result)
    //       this.items = result.data
    //       image.src = this.items[0].link
    //       container.style.backgroundColor = this.items[0].mainColor
    //     })
    //   }
    // },
    // websocketclose: function (e) {
    //   console.log("connection closed (" + e.code + ")");
    //   // this.reconnect();
    // },
    // reconnect() {
    //   setTimeout(() => {
    //     this.initWebSocket();
    //   }, 5000);
    // },
    // cleanws() {
    //   if (this.websock) {
    //     this.websock.close()
    //     this.websock = null;
    //   }
    // },
    // listPhotos() {
    //   api.getPhotoList(1, 30).then(result => {
    //     console.log(result.data)
    //     this.items = result.data
    //     // element.style.backgroundImage = 'url('+ this.imgSrc + ')'
    //
    //     this.timer = setInterval(() => {
    //       this.index++
    //       console.log('这条信息将在10秒后显示');
    //       if (this.index >= this.items.length) {
    //         this.index = 0;
    //       }
    //       this.imgSrc = 'data:image/png;base64,' + this.items[this.index]
    //       // element.style.backgroundImage = 'url('+ this.imgSrc + ')'
    //
    //       // this.imgSrc = src
    //     }, 8000); // 10000毫秒后执行
    //   })
    // },
    listPhotos() {
      this.clearCountDownTimer()
      this.countDown = 15;
      // this.countDownFun();

      api.getPhotoList(1, 30).then(result => {
        console.log(result.data)
        this.items = result.data
        let container = this.$refs.container
        let image = this.$refs.image
        let index = 0;
        let that = this
        image.src = that.items[index].link
        container.style.backgroundColor = that.items[index].mainColor
        this.updateImgSrc(index)
      })
    },

    updateImgSrc(index) {
      this.clearTimer()
      let container = this.$refs.container
      let image = this.$refs.image
      if(index===this.items.length-1){
        index=0;
      }
      else {
        index = index + 1;
      }
      image.style.opacity = '0'
      image.style.filter = 'alpha(opacity=0)'
      image.src = this.items[index].link
      setTimeout(() => {
        image.style.opacity = '1'
        container.style.backgroundColor = this.items[index].mainColor
      }, 450)
      this.timer = setInterval(() => {
        this.updateImgSrc(index)
      }, 10000)
      this.timerArray.push(this.timer)
    },

    clearTimer() {
      if (this.timerArray.length > 0) {
        console.log(this.timerArray)
        this.timerArray.forEach(t => clearInterval(t))
      }
      this.timerArray = []
    },
    // 倒计时
    countDownFun() {
      this.clearCountDownTimer()
      this.countDown -= 1;
      console.log("count===>" + this.countDown)
      if (this.countDown <= 0) {
        clearInterval(this.countDownTimer);
        this.countDownTimer = null;
        localStorage.clear();
        sessionStorage.clear();
        this.$router.push({path: '/clock'})
      }
      this.countDownTimer = setInterval(() => {
        this.countDownFun()
      }, 1000);

    },
    clearCountDownTimer() {
      if (this.countDownArray.length > 0) {
        this.countDownArray.forEach(e => clearInterval(e))
      }
      this.countDownArray = []
    }

  },


}
</script>

<style scoped>

.photo-show {
  width: 1920px;
  height:1080px;
  /*width: 800px;*/
  /*height:600px;*/
  border: 1px solid #e2e9f3;
  position:relative;
  overflow:hidden;
  /*background: rgba(22, 255, 255, 0.8); !* 白色背景和半透明度 *!*/
  mix-blend-mode: multiply; /* 混合模式 */
  left: 0; /* 左边对齐 */
  top: 0; /* 顶部对齐 */
}
/*img{*/
/*  position: absolute;*/
/*  top:0;*/
/*  left:50%;*/
/*  height:100%;*/
/*  transform:translateX(-50%);*/
/*}*/


/*.background {*/
/*  width: 1920px;*/
/*  height:1080px;*/
/*  !*width: 800px;*!*/
/*  !*height:600px;*!*/
/*  overflow: hidden;*/
/*}*/

/*.background-content {*/
/*  width: 1920px;*/
/*  height:1080px;*/
/*  !*width: 800px;*!*/
/*  !*height:600px;*!*/
/*  position: relative;*/
/*  !* 让图片居中显示 *!*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*}*/

.background-content-image {
  position: absolute;
  /* 重点，不能让背景大过于展示的图片 */
  z-index: -1;
  width: 1920px;
  /*width: 800px;*/
  height: 100%;
  filter: blur(8px);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.3s; /* 过渡效果，平滑切换 */
}

/*img {*/
/*  max-height: 100%;*/
/*  transition: all 0.3s; !* 过渡效果，平滑切换 *!*/
/*}*/

/*.fullscreen-image-container {*/
/*  position: fixed;*/
/*  top: 0;*/
/*  left: 0;*/
/*  width: 100vw;*/
/*  height: 100vh;*/
/*  background-color: rgba(0, 0, 0, 0.5); !* 半透明背景 *!*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  z-index: 9999; !* 确保图片在最上层 *!*/
/*}*/

/*.fullscreen-image {*/
/*  max-width: 100%;*/
/*  max-height: 100%;*/
/*}*/


/*.el-image {*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  overflow: hidden;*/
/*}*/

.fullscreen-image-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white; /* Optional: A black background */
  overflow: hidden;
}

.fullscreen-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Maintain aspect ratio and contain within the viewport */
}

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
  height: auto;
  max-width: 100%;
  max-height: 100%;
  transition: opacity 1s ease-in-out;
}
</style>