<template>
  <el-card class="container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/infoManage/classManage' }">信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮组 -->
    <div class="btn-group">
      <el-button @click="openAddClass"> 添加 </el-button>
    </div>
    <!-- 信息表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="classNum" label="班级号"></el-table-column>
      <el-table-column prop="className" label="班级名"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <div class="flex-group">
            <el-tag type="warning" @click="openEditClass(scope.row)" effect="dark" round>
              编辑
            </el-tag>
            <el-popconfirm
              hide-icon
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认删除？"
              @confirm="deleteClass(scope.row)"
            >
              <template #reference>
                <el-tag type="danger" effect="dark" round> 删除 </el-tag>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="pagination.pageNum"
      v-model:page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total"
      @current-change="handleCurrentChange"
    />
    <!-- 班级信息对话框 -->
    <el-dialog v-model="classDialog" title="班级信息" :close-delay="50">
      <el-form
        ref="classFormRef"
        :model="classFormData"
        label-width="150px"
        :rules="classFormRules"
        :hide-required-asterisk="true"
      >
        <el-form-item label="班级号" prop="classNum">
          <el-input v-model="classFormData.classNum"></el-input>
        </el-form-item>
        <el-form-item label="班级名" prop="className">
          <el-input v-model="classFormData.className"></el-input>
        </el-form-item>
        <div class="form_buttons">
          <el-button @click="submitEditClass(classFormRef)" type="primary">提交</el-button>
          <el-button @click="closeEditDialog(classFormRef)" type="info">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, Ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 分页列表
let tableData: INFO.ClassInfo[] = reactive([])
const pagination: Ref<INFO.pagination> = ref({
  pageNum: 1,
  pageSize: 10,
  total: 20
})
const handleCurrentChange = () => {
  console.log('分页请求获取数据列表', pagination.value)
}

// 老师信息对话框、表单
const classFormRef = ref<FormInstance>()
const formType = ref(0) // 0:编辑表单 1：添加表单
const classDialog = ref(false)
const classFormData = reactive({
  classId: '',
  classNum: '',
  className: ''
})
const classFormRules = reactive<FormRules>({
  classNum: [{ required: true, message: '班级号不能为空', trigger: 'blur' }],
  className: [{ required: true, message: '班级名不能为空', trigger: 'blur' }]
})
const submitEditClass = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formType.value === 0) {
        console.log('发送请求，改变班级信息', classFormData)
        ElMessage({
          message: '更新班级信息成功',
          type: 'success'
        })
      } else {
        console.log('发送请求，添加班级', classFormData)
        ElMessage({
          message: '班级添加成功',
          type: 'success'
        })
      }
      console.log('发送请求, 重新刷新数据列表')
      classDialog.value = false
    } else {
      console.log('表单校验失败', fields)
    }
  })
}
const closeEditDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  classDialog.value = false
}

// 列表操作（增删查改）
const openEditClass = (row: INFO.ClassInfo) => {
  formType.value = 0
  classFormData.classId = row.classId
  classFormData.classNum = row.classNum
  classFormData.className = row.className
  classDialog.value = true
}
const openAddClass = () => {
  formType.value = 1
  classFormData.classId = ''
  classFormData.classNum = ''
  classFormData.className = ''
  classDialog.value = true
}
const deleteClass = (row: INFO.ClassInfo) => {
  console.log(`根据班级id：${row.classId}发送请求，删除当前班级`)
  console.log('发送请求，重新刷新数据列表')
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

// 初始化
const init = () => {
  console.log('发送请求，获取班级列表数据')
  tableData = [
    {
      className: '一年级五班',
      classNum: '04031802',
      classId: '123'
    },
    {
      className: '二年级三班',
      classNum: '04031804',
      classId: '124'
    },
    {
      className: '一年级五班',
      classNum: '04031802',
      classId: '123'
    },
    {
      className: '二年级三班',
      classNum: '04031804',
      classId: '124'
    },
    {
      className: '一年级五班',
      classNum: '04031802',
      classId: '123'
    },
    {
      className: '二年级三班',
      classNum: '04031804',
      classId: '124'
    }
  ]
}
init()
</script>

<style scoped lang="scss">
.container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  .el-pagination {
    position: absolute;
    bottom: 5px;
  }
  .el-table {
    margin-bottom: 50px;
  }
}
.flex-group {
  display: flex;
  flex-wrap: wrap;
  .el-tag {
    margin: 0 5px 5px 0;
    cursor: pointer;
  }
}
.btn-group {
  display: flex;
  justify-content: right;
}
.el-table {
  margin-top: 10px;
}
.el-form {
  .form_buttons {
    display: flex;
    justify-content: space-around;
    button {
      width: 100px;
    }
  }
  .el-input {
    width: 70%;
  }
}
</style>
