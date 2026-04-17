<template>
  <div class="photo-type-page">
    <div>
      <div class="photo-type-add-btn">
        <el-button type="primary" @click="dialogFormVisible = true">
          添加照片类型
        </el-button>
        <el-button type="success" @click="goMusic">
          音乐管理
        </el-button>
        <el-button type="success" @click="goPhoto">
          照片管理
        </el-button>
      </div>

      <el-dialog v-model="dialogFormVisible" :close-on-click-modal=false title="添加照片类型" width="600">

        <el-form :model="photoType">
          <el-form-item label="类型名称">
            <el-input v-model="photoType.typeName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="类型描述">
            <el-input type="textarea" v-model="photoType.description" autocomplete="off"/>
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
        <el-table-column fixed prop="id" label="照片类型ID" width="250" />
        <el-table-column prop="typeName" label="照片类型名称" width="250" />
        <el-table-column prop="description" label="描述" width="200" />
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <!--          <el-button link type="primary" size="small" @click="doDelete(scope.row.id)">删除</el-button>-->
            <el-popconfirm title="你确定要删除该照片类型么?"  @confirm="doDelete(scope.row.id)" width="200px">
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
import * as api from "@/api/api";
import {ElMessage} from "element-plus";

export default {
  name: "PhotoType.vue",
  data() {
    return {
      photoType: {
        id: '',
        typeName: '',
        description: '',
      },
      tableData: [],
      dialogFormVisible: false,
      pagination: {
        totalCount: 0,
        pageSize: 5,
        currentPage: 1
      }
    }
  },
  mounted() {
    this.getPhotoTypeList()
  },

  methods: {
    goPhoto() {
      this.$router.push({
        path: '/photo',
      })
    },
    goMusic() {
      this.$router.push({
        path: '/music',
      })
    },
    handleCancel() {
      this.photoType.id = ''
      this.photoType.typeName = ''
      this.photoType.description = ''
      this.dialogFormVisible = false
    },
    handleSubmit() {
      console.log(this.photoType)
      api.addPhotoType(this.photoType).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          ElMessage({
            message: result.data,
            type: 'success',
          })
          this.dialogFormVisible = false
          // 获取列表
          this.getPhotoTypeList()
          this.handleCancel()
        } else {
          ElMessage.error(result.data)
        }
      })
    },
    getPhotoTypeList() {
      api.listPhotoType(this.pagination.currentPage, this.pagination.pageSize).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.tableData = result.data.records
          this.pagination.pageSize = result.data.size
          this.pagination.currentPage = result.data.current
          this.pagination.totalCount = result.data.total
          console.log(this.tableData)
        }
      })
    }

  }
}
</script>

<style>
.photo-type-page {
  margin: 20px;
}

.photo-type-add-btn {
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