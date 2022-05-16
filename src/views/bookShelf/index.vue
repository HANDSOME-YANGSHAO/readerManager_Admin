<template>
  <el-card class="container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/bookManage/bookShelf' }">书籍管理</el-breadcrumb-item>
      <el-breadcrumb-item>书架</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮组 -->
    <div class="btn-group">
      <el-button @click="openAdd"> 添加 </el-button>
    </div>
    <!-- 信息表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="coverSrc" label="封面" width="200">
        <template #default="scope">
          <div class="center">
            <img :src="scope.row.coverSrc" alt="封面" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bookName" label="书名" width="120"></el-table-column>
      <el-table-column prop="author" label="作者" width="120"></el-table-column>
      <el-table-column prop="introduction" label="简介">
        <template #default="scope">
          <div class="introduction">
            {{ scope.row.introduction }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div class="flex-group">
            <el-tag @click="check(scope.row)" effect="dark" round> 查看 </el-tag>
            <el-tag type="warning" @click="openEdit(scope.row)" effect="dark" round> 编辑 </el-tag>
            <el-popconfirm
              hide-icon
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认删除？"
              @confirm="deleteBook(scope.row)"
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
    <!-- 书本信息对话框 -->
    <el-dialog v-model="bookDialog" title="书本信息">
      <el-form
        ref="bookFormRef"
        :model="bookFormData"
        label-width="150px"
        :rules="bookFormRules"
        :hide-required-asterisk="true"
      >
        <el-form-item label="封面" prop="coverSrc">
          <el-input :disabled="isCheck" v-model="bookFormData.coverSrc"></el-input>
        </el-form-item>
        <el-form-item label="书名" prop="bookName">
          <el-input :disabled="isCheck" v-model="bookFormData.bookName"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input :disabled="isCheck" v-model="bookFormData.author"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            :disabled="isCheck"
            type="textarea"
            :autosize="{ minRows: 5 }"
            v-model="bookFormData.introduction"
          ></el-input>
        </el-form-item>
        <div class="form_buttons">
          <el-button v-if="isCheck" @click="closeEditDialog(bookFormRef)" type="primary">确定</el-button>
          <el-button v-else @click="submitEdit(bookFormRef)" type="primary">提交</el-button>
          <el-button @click="closeEditDialog(bookFormRef)" type="info">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 分页列表
let tableData: INFO.bookInfo[] = reactive([])
const pagination: Ref<INFO.pagination> = ref({
  pageNum: 1,
  pageSize: 4,
  total: 20
})
const handleCurrentChange = () => {
  console.log('分页请求获取数据列表', pagination.value)
}

// 书籍对话框和表单
const bookFormRef = ref<FormInstance>()
const formType = ref(0) // 0:编辑表单 1：添加表单 2: 查看表单
const bookDialog = ref(false)
const isCheck = computed(() => {
  return formType.value === 2
})
const bookFormData = reactive({
  bookName: '',
  coverSrc: '',
  author: '',
  introduction: ''
})
const bookFormRules = reactive<FormRules>({
  bookName: [{ required: true, message: '书名不能为空', trigger: 'blur' }],
  author: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
  introduction: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
  coverSrc: [{ required: true, message: '封面地址不能为空', trigger: 'blur' }]
})
const submitEdit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formType.value === 0) {
        console.log('发送请求，改变书本信息', bookFormData)
        ElMessage({
          message: '更新成功',
          type: 'success'
        })
      } else {
        console.log('发送请求，添加书本', bookFormData)
        ElMessage({
          message: '添加成功',
          type: 'success'
        })
      }
      console.log('发送请求, 重新刷新数据列表')
      bookDialog.value = false
    } else {
      console.log('表单校验失败', fields)
    }
  })
}
const closeEditDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (!isCheck.value) formEl.resetFields()
  bookDialog.value = false
}

// 列表操作（增删查改）
const check = (row: INFO.bookInfo) => {
  formType.value = 2
  bookFormData.bookName = row.bookName
  bookFormData.coverSrc = row.coverSrc
  bookFormData.author = row.author
  bookFormData.introduction = row.introduction
  bookDialog.value = true
}
const openEdit = (row: INFO.bookInfo) => {
  formType.value = 0
  bookFormData.bookName = row.bookName
  bookFormData.coverSrc = row.coverSrc
  bookFormData.author = row.author
  bookFormData.introduction = row.introduction
  bookDialog.value = true
}
const openAdd = () => {
  formType.value = 1
  bookFormData.bookName = ''
  bookFormData.coverSrc = ''
  bookFormData.introduction = ''
  bookFormData.author = ''
  bookDialog.value = true
}
const deleteBook = (row: INFO.bookInfo) => {
  console.log(`根据班级id：${row.bookId}发送请求，删除当前书本`)
  console.log('发送请求，重新刷新数据列表')
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

// 初始化
const init = () => {
  console.log('发送请求，获取书本列表数据')
  tableData = [
    {
      bookId: 'b1',
      bookName: '红楼梦',
      author: '曹雪芹',
      coverSrc: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/173/926173/t6_926173.jpg',
      introduction:
        '《红楼梦》又名《石头记》，是中国古典小说的巅峰之作，位居“中国古典四大名著”之首。一般认为全书前八十回由清代小说家曹雪芹所作，后四十回由高鹗续成。这部中国文学史上的鸿篇巨制，以其丰富的思想内容、伟大的艺术成就和深远的文化影响成为中国古典文学史上的一朵奇葩。'
    },
    {
      bookId: 'b2',
      bookName: '三国演义',
      author: '罗贯中',
      coverSrc: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/417/139417/t6_139417.jpg',
      introduction:
        '古典小说《三国演义》从汉灵帝黄巾起义写起，到西晋三国统一为止，描写了九十余年的重大历史事件及历史人物的活动，展示了三国兴亡的历史画卷，形象地再现了这一风云变幻的历史时代，生动地揭示了统治集团内部尔虞我诈、争权夺利的关系。 由人民文学出版社出版的《三国演义》是以毛宗岗本为底本、经过多次整理校订而成的迄今国内发行量最大、最权威的版本，自面世以来，一直是市场上最受读者欢迎古典文学名著之一。'
    },
    {
      bookId: 'b3',
      bookName: '简爱',
      author: '夏洛蒂·勃朗特',
      coverSrc:
        'https://wfqqreader-1252317822.image.myqcloud.com/cover/49/31301049/t6_31301049.jpg',
      introduction:
        '本书讲述了这样一个故事：简·爱自幼父母双亡，投靠冷酷的舅母，但舅母无情地抛弃了她。她在一所慈善学校做了六年的学生和两年的教师。十八岁时，简·爱受聘到桑菲尔德府学当家庭教师，认识了主人罗切斯特。两人都被对方独特的气质和丰富的感情所吸引，于是不顾身份和地位的巨大差距深深相爱了。正当他们举行婚礼时，有人证明罗切斯特的前妻还活着。简·爱知道他们不可能有平等的婚姻，于是选择了离开。后来，简·爱意外遇见了她的表兄妹们，并从叔叔那里继承了一笔遗产。但她无法抵御对罗切斯特的刻骨思念，于是便回到了已经失去了财富、身体也遭到火灾严重摧残的罗切斯特身边，毅然跟他结婚。在爱的沐浴下，罗切斯特找回了幸福和健康。'
    },
    {
      bookId: 'b4',
      bookName: '钢铁是怎么样炼成的',
      author: '奥斯特洛夫斯基',
      coverSrc: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/509/787509/t6_787509.jpg',
      introduction:
        '该小说所描写的“非常时期”包括第一次世界大战，二月革命和十月革命，国内战争，与破坏行为、盗匪和小资分子的斗争，给党的反对派的回击，国家的工业化阶段。这些事件形成了书中主人公们的性格和心理，对这些正在形成新的社会关系的人们的命运也产生了重大影响。'
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
  .introduction {
    line-height: 20px;
    max-width: 6rem;
    height: 80px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .center {
    display: flex;
    align-items: center;
    height: 100px;
    img {
      width: 54px;
      height: 78px;
    }
  }
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
