<template>
<div class="music-page">
  <div>

    <div class="music-add-btn">
      <el-button  type="primary" @click="dialogFormVisible = true">
        添加音乐
      </el-button>

      <el-button  type="success" @click="goPhoto">
        照片管理
      </el-button>

      <div class="music-audio">
        <el-tag  style="font-weight: 500; font-size: 14px; color: #0aa370" type="warning">{{curMusicName}}</el-tag>
        <audio  :src="musicUrl" controls ref="musicPlayer" autoplay></audio>
      </div>


      <div style="margin-left: auto">
        <el-input
            v-model="musicName"
            style="margin-right:5px; width: 240px"
            placeholder="请输入歌曲名称"
            @input="doSearch"
        />
        <el-button  @click="doSearch">
          搜索
        </el-button>
      </div>

    </div>


    <el-dialog v-model="dialogFormVisible" :close-on-click-modal=false :title="editTitle" width="600">
      <el-upload
          ref="musicUpload"
          class="upload-music"
          action="/file/oss/upload"
          multiple
          :on-success="handleUploadMusicSuccess"
      >
        <el-button type="primary" :disabled="modifying">点击上传音频</el-button>
      </el-upload>


      <el-form :model="music">
        <el-form-item label="音乐名称" :label-width="formLabelWidth" >
          <el-input v-model="music.musicName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="歌手" :label-width="formLabelWidth">
          <el-input v-model="music.singer" autocomplete="off" />
        </el-form-item>
        <el-form-item label="路径" :label-width="formLabelWidth" >
          <el-input v-model="music.path" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth" >
          <el-upload
              class="avatar-uploader"
              action="/file/oss/upload"
              :show-file-list="false"
              :on-success="handleCoverSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{editBtn}}
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>

  <div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="musicName" label="歌曲名称" width="250" />
      <el-table-column prop="singer" label="歌手" width="120" />
      <el-table-column prop="path" label="路径" width="600" />
      <el-table-column prop="cover" label="封面" width="200" >
        <template #default="scope">
          <el-avatar shape="square" :size="100" fit="fit" :src="scope.row.cover" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="160">
        <template #default="scope">
          <el-button type="success" size="small" @click="doPlay(scope.row)">播放</el-button>
          <el-button type="primary" size="small" @click="doEdit(scope.row.id)">编辑</el-button>
          <el-popconfirm title="你确定要删除该音乐么?"  @confirm="doDelete(scope.row.id)" width="200px">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="music-pagination-bar">
    <el-pagination
        background
        @current-change="onPageChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        layout="prev, pager, next"
        :total="pagination.totalCount">
    </el-pagination>
  </div>

</div>
</template>

<script>

import * as api from '../api/api.js'
import { ElMessage } from 'element-plus'
export default {
  data() {
    return {
      music: {
        id: '',
        musicName: '',
        fileName: '',
        singer: '',
        path: '',
        cover: '',
        coverName: '',
        mainColor: ''
      },
      tableData: [],
      dialogFormVisible: false,
      imageUrl: '',
      formLabelWidth: '140px',
      pagination: {
        totalCount: 0,
        pageSize: 20,
        currentPage: 1
      },
      modifying: false,
      editBtn: '添加',
      editTitle: '添加音乐',
      musicName: '',
      musicUrl: '',
      curMusicName: ''
    }
  },

  methods: {
    goPhoto() {
      this.$router.push({
        path: '/photo',
      })
    },
    onPageChange(page) {
      this.pagination.currentPage = page
      this.getMusicList()
    },

    handleUploadMusicSuccess(response, uploadFile) {
      console.log(response)
      this.music.musicName = uploadFile.name
      this.music.path = response.data.link
      this.music.fileName = response.data.name
      this.music.id = response.data.id
      this.$refs.musicUpload.clearFiles()
    },
    handleCoverSuccess(response) {
      console.log(response)
      this.imageUrl = response.data.link
      this.music.coverName = response.data.name
      this.music.cover = response.data.link
      this.music.mainColor = response.data.color
    },
    handleCancel() {
      this.music.id = ''
      this.music.musicName = ''
      this.music.singer = ''
      this.music.cover = ''
      this.music.path = ''
      this.music.fileName = ''
      this.music.coverName = ''
      this.imageUrl = ''
      this.dialogFormVisible = false
      this.$refs.musicUpload.clearFiles()
      this.editBtn = '添加'
      this.editTitle = '添加音乐'
    },
    handleSubmit() {
      console.log(this.music)
      if (this.modifying) {
        this.modifying = false
        api.modifyMusic(this.music).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            ElMessage({
              message: result.data,
              type: 'success',
            })
            this.dialogFormVisible = false
            // 获取列表
            this.getMusicList()
            this.handleCancel()
          } else {
            ElMessage.error(result.data)
          }
        })
      } else {
        api.addMusic(this.music).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            ElMessage({
              message: result.data,
              type: 'success',
            })
            this.dialogFormVisible = false
            // 获取列表
            this.getMusicList()
            this.handleCancel()
          } else {
            ElMessage.error(result.data)
          }
        })
      }

    },
    getMusicList() {
      api.getMusicList(this.pagination.currentPage, this.pagination.pageSize, this.musicName).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.tableData = result.data.records
          this.pagination.pageSize = result.data.size
          this.pagination.currentPage = result.data.current
          this.pagination.totalCount = result.data.total
          console.log(this.tableData)
          // this.tableData.forEach((item) => {
          //   item.coverBlob = 'data:image/png;base64,' + item.coverBlob
          // })
        }
      })
    },
    doDelete(id) {
      console.log(id)
      api.deleteMusic(id).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          ElMessage({
            message: result.data,
            type: 'success',
          })
          this.getMusicList()
        } else {
          ElMessage.error(result.data)
        }
      })
    },
    doPlay(row) {
      console.log(row)
      // this.$router.push({
      //   path: '/playMusic/' + id,
      // })
      this.musicUrl = row.path.split('?')[0]
      this.curMusicName = row.musicName.split('.')[0]
      this.$refs.musicPlayer.play()
    },
    doEdit(id) {
      api.getLocalMusic(id).then(res => {
        console.log(res.data)
        this.music.id = id;
        this.music.musicName = res.data.title
        this.music.singer = res.data.author
        this.music.path = res.data.url
        this.imageUrl = res.data.pic
        this.modifying = true
        console.log(this.music)
        this.editTitle = '修改音乐'
        this.editBtn = '修改'
        this.dialogFormVisible = true
      })
    },
    doSearch() {
      this.getMusicList()
    }
  },
  mounted() {
    this.getMusicList()
  },

}


</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader {
  text-align: center;
  cursor: pointer;
  line-height: 140px;
  background: #f0f1f3;
  border-radius: 5%;
  border-style: dot-dash !important;
  border-color: #181818 !important;
}

  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.music-page {
  margin: 20px;
}
.music-add-btn {
  display: flex;
  align-items: center;
  text-align: center;
}

.music-pagination-bar {
  margin-top: 20px;
}

.music-audio {
  margin-left: auto;

  display: flex;
  align-items: center;
  text-align: center;
}


</style>