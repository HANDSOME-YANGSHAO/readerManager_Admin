<template>
  <el-card class="container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/infoManage/adminManage' }">信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮组 -->
    <div class="btn-group">
      <el-button @click="openAddUser"> 添加 </el-button>
    </div>
    <!-- 信息表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="userName" label="姓名"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column label="角色">
        <template #default="scope">
          <div v-if="scope.row.role === 3">普通管理员</div>
          <div v-if="scope.row.role === 4">超级管理员</div>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <div class="flex-group">
            <el-tag type="warning" @click="openEdit(scope.row)" effect="dark" round> 编辑 </el-tag>
            <el-popconfirm
              hide-icon
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认删除？"
              @confirm="deleteUser(scope.row)"
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
    <!-- 编辑对话框 -->
    <el-dialog v-model="editDialog" title="编辑用户信息" :close-delay="50">
      <el-form
        ref="editFormRef"
        :model="editFormData"
        label-width="150px"
        :rules="editRules"
        :hide-required-asterisk="true"
      >
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="editFormData.userName"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="editFormData.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select placeholder="选择班级" v-model="editFormData.sex">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select placeholder="选择角色" v-model="editFormData.role">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="form_buttons">
          <el-button @click="submitEditUser(editFormRef)" type="primary">提交</el-button>
          <el-button @click="closeEditDialog(editFormRef)" type="info">取消</el-button>
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
let tableData: INFO.UserInfo[] = reactive([])
const pagination: Ref<INFO.pagination> = ref({
  pageNum: 1,
  pageSize: 10,
  total: 20
})
const handleCurrentChange = () => {
  console.log('分页请求获取数据列表', pagination.value)
}

// 编辑表单
const formType = ref(0) // 0：编辑表单, 1:添加表单
const editFormRef = ref<FormInstance>()
const editDialog = ref(false)
const editFormData = reactive({
  userId: '', // 发送编辑请求用
  userName: '',
  account: '',
  password: '',
  role: 0,
  sex: ''
})
const editRules = reactive<FormRules>({
  userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  account: [{ required: true, message: '账号不能够为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  role: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }]
})
const sexOptions = [
  {
    value: '男生',
    label: '男生'
  },
  {
    value: '女生',
    label: '女生'
  }
]
const roleOptions = [
  {
    label: '普通管理员',
    value: 3
  },
  {
    label: '超级管理员',
    value: 4
  }
]
const submitEditUser = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formType.value === 0) {
        console.log('发送请求，改变当前管理员信息', editFormData)
        ElMessage({
          message: '更新角色信息成功',
          type: 'success'
        })
      } else {
        console.log('发送请求，创建当前管理员', editFormData)
        ElMessage({
          message: '添加角色成功',
          type: 'success'
        })
      }
      console.log('发送请求, 重新刷新数据列表')
      editDialog.value = false
    } else {
      console.log('表单校验失败', fields)
    }
  })
}
const closeEditDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  editDialog.value = false
}

// 添加用户
const openAddUser = () => {
  formType.value = 1
  editFormData.account = ''
  editFormData.password = ''
  editFormData.role = 3
  editFormData.sex = '男生'
  editFormData.userName = ''
  editFormData.userId = ''
  editDialog.value = true
}

// 表格操作（编辑，删除）
const openEdit = (row: INFO.UserInfo) => {
  formType.value = 0
  editFormData.account = row.account
  editFormData.password = row.password
  editFormData.role = row.role
  editFormData.sex = row.sex
  editFormData.userName = row.userName
  editFormData.userId = row.userId
  editDialog.value = true
}
const deleteUser = (row: INFO.UserInfo) => {
  console.log('发送请求删除用户信息', row.userId)
  console.log('发送请求，重新刷新数据列表')
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

// 初始化操作
const init = () => {
  console.log('发送请求获取管理员列表')
  tableData = [
    {
      userId: '998',
      userName: '信息部李老师',
      account: '123456',
      password: '111',
      classInfo: [],
      role: 3,
      sex: '男生'
    },
    {
      userId: '999',
      userName: '信息部主任',
      account: 'abc',
      password: '222',
      classInfo: [],
      role: 4,
      sex: '男生'
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
