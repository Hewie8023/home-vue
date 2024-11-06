<script setup>
</script>

<template>
  <div id="app" >
    <router-view></router-view>

    <div class="weather-box">
    <v-mini-weather class="weather-info" url="http://localhost:8080/weather">
      <template #default="{weather, icon}">
        <!--插入图标-->
        <v-mini-weather-icon :icon="icon" class="weather-icon" type="line"></v-mini-weather-icon>
        <!--DIY内容-->
        <div class="weather-text2">{{weather.temp}}</div><!--°C-->
        <div>
          <div class="weather-text">{{weather.weather}}</div>
          <div class="weather-text1">{{weather.cityname}}</div>
        </div>
      </template>
    </v-mini-weather>
  </div>
  </div>
</template>

<style >

/*修改存放图标和文本的大盒子的样式*/
.weather-info {
  /*float: right !important;*/
  left: 1100px;
  /*left: 450px;*/
  height: 200px;
  bottom:0;
  width:100%;
  position: absolute;
  display: flex;
  align-items: center;
}
/*修改图标样式*/
.weather-icon {
  width: 240px;
  height: 240px;
  margin-right: 10px;
}
/*修改文本样式*/
.weather-text {
  color: #e6e6e6;
  font-size: 55px;
  font-weight: 600;
  display: block;
  text-transform: uppercase;
  margin-bottom: 10px;
  /*margin-right: 10px;*/
}

.weather-text1 {
  font-size: 40px;
  font-weight: 400;
  color: #e6e6e6;
  display: block;
  float: right;
  /*margin-right: 20px;*/
}

.weather-text2{
  font-size: 150px;
  font-weight: 600;
  color: white;
  display: block;
  margin-right: 20px;
  font-family: "Microsoft YaHei","微软雅黑";
}

</style>
