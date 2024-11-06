<template>
    <div class="main-part">
        <!--显示我们的内容-->
        <el-container id="home-content">
            <el-container id="main-container" class="main-container">
                <el-main id="home-center-part">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    export default {


    }
</script>
<style>
.main-part {
  height: 100%;
}
    .main-container {
      margin: 0 0;
      min-width: 1140px;
      position: relative;
    }
    #home-content {
      height: 100%;
    }

    .el-menu-item:focus, .el-menu-item:hover {
      background-color: rgba(10,163,112, .3);
    }
    .el-submenu__title:hover {
      background-color: rgba(10,163,112, .3);
    }
    #left-menu-list-box .el-menu {
        border-right: none;
        background-color: #F2F2F2;
    }

    .el-header {
        background-color: #0aa370;
        line-height: 46px;
        height: 46px !important;
    }

    .el-aside {
        background: #F2F2F2;
        border-right: solid 1px #e6e6e6;
        line-height: 200px;
    }

    .el-main {
        padding: 0 !important;
    }

    body {
      background: #f4f5f6;
      font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,"\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
      font-size: 14px;
      line-height: 1.2;
      color: #595959;
      height: 100%;
    }

    #home-center-part {
      overflow-x: hidden;
    }

</style>
