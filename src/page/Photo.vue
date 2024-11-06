<template>
  <div class="photo-page">
    <div>

      <div class="photo-add-btn">

        <el-button type="primary" @click="dialogFormVisible = true">
          添加照片
        </el-button>

        <el-button type="success" @click="goMusic">
          音乐管理
        </el-button>

      </div>



      <el-dialog v-model="dialogFormVisible" :close-on-click-modal=false title="添加照片" width="600">

        <el-form :model="photo">
          <el-form-item label="照片名称" :label-width="formLabelWidth" >
            <el-input v-model="photo.photoName" autocomplete="off" disabled/>
          </el-form-item>
          <el-form-item label="照片" :label-width="formLabelWidth" >
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
              添加
            </el-button>
          </div>
        </template>
      </el-dialog>

    </div>

    <div>

      <el-table :data="tableData" style="width: 100%" >
        <el-table-column fixed prop="id" label="照片ID" width="250" />
        <el-table-column prop="photoName" label="照片名称" width="250" />
        <el-table-column label="照片" width="200" >
          <template #default="scope">
            <el-avatar shape="square" :size="100" fit="fit" :src="scope.row.link" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <!--          <el-button link type="primary" size="small" @click="doDelete(scope.row.id)">删除</el-button>-->
            <el-popconfirm title="你确定要删除该照片么?"  @confirm="doDelete(scope.row.id)" width="200px">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
<!--            <el-button link type="primary" size="small" @click="doPlay(scope.row.id)">播放</el-button>-->
          </template>
        </el-table-column>
      </el-table>

    </div>

    <div class="photo-pagination-bar">
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
import {deletePhoto} from "../api/api.js";
export default {
  data() {
    return {
      photo: {
        id: '',
        photoName: '',
        link: '',
        mainColor: ''
      },
      tableData: [],
      dialogFormVisible: false,
      imageUrl: '',
      formLabelWidth: '140px',
      pagination: {
        totalCount: 0,
        pageSize: 5,
        currentPage: 1
      }
    }
  },

  methods: {
    goMusic() {
      this.$router.push({
        path: '/music',
      })
    },
    handleCoverSuccess(response) {
      console.log(response)
      this.imageUrl = response.data.link
      this.photo.photoName = response.data.name
      this.photo.link = this.imageUrl
      this.photo.mainColor = response.data.color
      // this.handleCancel()
      // this.getPhotoList()
      // this.dialogFormVisible = false
    },
    handleCancel() {
      this.photo.id = ''
      this.photo.photoName = ''
      this.photo.link = ''
      this.imageUrl = ''
      this.dialogFormVisible = false
    },
    handleSubmit() {
      console.log(this.photo)
      api.addPhoto(this.photo).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          ElMessage({
            message: result.data,
            type: 'success',
          })
          this.dialogFormVisible = false
          // 获取列表
          this.getPhotoList()
          this.handleCancel()
        } else {
          ElMessage.error(result.data)
        }
      })
    },
    getPhotoList() {
      console.log(this.pagination)
      api.getPhotos(this.pagination.currentPage, this.pagination.pageSize).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.tableData = result.data.records
          this.pagination.pageSize = result.data.size
          this.pagination.currentPage = result.data.current
          this.pagination.totalCount = result.data.total
          // this.tableData.forEach((item) => {
          //   item.imgBlob = 'data:image/png;base64,' + item.imgBlob
          // })
          console.log(this.tableData)
        }
      })
    },
    onPageChange(page) {
      this.pagination.currentPage = page
      this.getPhotoList()
    },
    doDelete(id) {
      console.log(id)
      api.deletePhoto(id).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          ElMessage({
            message: result.data,
            type: 'success',
          })
          this.getPhotoList()
        } else {
          ElMessage.error(result.data)
        }
      })
    },

  },
  mounted() {
    this.getPhotoList()
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

.hewie {
  color: RGB(169,182,188);
}

.photo-page {
  margin: 20px;
}

.photo-add-btn {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.photo-pagination-bar {
  margin-top: 20px;
}
</style>