<template>
  <div class="container">
    <el-card class="top_card">
      <el-row>
        <el-col :span="12">
          <div class="header">
            <el-breadcrumb separator=">>">
              <el-breadcrumb-item :to="{ path: '/people/volunteer' }">人员信息</el-breadcrumb-item>
              <el-breadcrumb-item>志愿者</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="table_card">
      <div slot="header">
        <div class="infos">
          <i class="el-icon-user"></i>
          <el-tag class="tag1">
            <span>志愿者信息</span>
          </el-tag>
          <el-button type="primary" @click="handleAddVolunteer">
            <i class="el-icon-circle-plus"></i>
            添加志愿者
          </el-button>
          <div class="search">
            <el-input v-model="searchInput" class="input" maxlength="200px" prefix-icon="el-icon-search"></el-input>
            <el-button type="primary">筛选</el-button>
          </div>
        </div>
      </div>

      <div class="table">
        <el-table
          stripe
          :data="taskShowList"
          style="width: 100%">
          <el-table-column
            prop="vid"
            label="志愿者编号"
            width="width">
          </el-table-column>
          <el-table-column
            prop="name"
            label="志愿者姓名"
            width="width">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            width="width">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="志愿者电话"
            width="width">
          </el-table-column>
          <el-table-column
            prop="state"
            label="志愿者状态"
            width="width">
            <template slot-scope="scope">
              <span class="class0" v-if="scope.row.state === 0">备勤中</span>
              <span class="class1" v-if="scope.row.state === 1">忙碌中</span>
              <span class="class2" v-if="scope.row.state === 2">任务中</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="identity"
            label="志愿者身份"
            width="width">
            <template slot-scope="scope">
              {{ scope.row.identity? '任务负责人': '普通志愿者'}}
            </template>
          </el-table-column>
          <el-table-column
            label="详细信息"
            width="width">
            <template slot-scope="scope">
              <el-button type="text" @click="handleClick(scope.row)">点击查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          layout="prev, pager, next"
          :total="totalNum"
          :current-page="currentCursor"
          @current-change="handleCurrentChange"
          background
        >
        </el-pagination>
      </div>
    </el-card>
    <el-drawer
      title="添加管理员"
      :visible.sync="visible"
      direction="rtl"
      ref="drawer"
      :before-close="handleDrawerClose">
      <div class="demo-drawer__content">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item label="志愿者姓名" :label-width="formLabelWidth" prop="name">
            <el-input class="input" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="志愿者性别" :label-width="formLabelWidth" prop="sex">
            <el-select v-model="form.sex">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="志愿者年龄" :label-width="formLabelWidth" prop="name">
            <el-input class="input" v-model="form.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="志愿者身份" :label-width="formLabelWidth" prop="sex">
            <el-select v-model="form.identity">
              <el-option label="任务负责人" :value="true"></el-option>
              <el-option label="普通志愿者" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="志愿者电话" :label-width="formLabelWidth" prop="phone">
            <el-input class="input" v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idcard">
            <el-input class="input" v-model="form.idcard" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import { useCurrentRoute } from '@/utils/hook'
import { taskStateMap } from '@/utils/const'
import { MessageBox } from 'element-ui'

export default defineComponent ({
    setup(props, ctx) {
        const route = useCurrentRoute()
        const taskHandledList = ref([])
        const searchInput = ref('')
        const currentCursor = ref(1)
        const visible = ref(false)
        const loading = ref(false)
        const formLabelWidth = '100px'

        const form = ref({
          name: '',
          sex: '',
          age: 0,
          identity: false,
          phone: '',
          idcard: '',
        })

        const rules = ref({
          name: [
            { required: true, message: '请输入管理员姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请输入管理员性别', trigger: 'blur' },
            { enum: ['男', '女'], message: '请输入男或女', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '请输入管理员年龄', trigger: 'blur' },
            { pattern: '^[0-9]*$', message: '请输入正确的年龄', trigger: 'blur' }
          ],
          identity: [
            { required: true, message: '请输入管理员身份', trigger: 'blur' },
            { enum: [false, true], message: '请输入正确的身份', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入管理员手机号', trigger: 'blur' },
            { len: 11, message: '请输入正确的手机号', pattern: '^[0-9]*$', trigger: 'blur' }
          ],
          idcard: [
            { required: true, message: '请输入管理员身份证号', trigger: 'blur' },
            { len: 18, message: '请输入正确的身份证号', trigger: 'blur' }
          ],
        })

        const getData = () => {
          ctx.root.$http.get('admin/user_info/volunteer').then(res => {
            taskHandledList.value = res.data.data
          }).catch(err => {
            console.error(err)
          })
        }

        getData()

        const totalNum = computed(() => taskHandledList.value.length || 0)
        const taskShowList = computed(() => taskHandledList.value.slice(10 * (currentCursor.value - 1), 10 * currentCursor.value))

        const handleClick = (val) => {
          ctx.root.$router.push(ctx.root.$getPeopleVolunteerDetailRoute(val.vid))
        }

        const handleCurrentChange = (val) => {
          currentCursor.value = val
        }

        const handleAddVolunteer = () => {
          visible.value = true
          ctx.refs.formRef? ctx.refs.formRef.resetFields(): ''
        }

        const handleDrawerClose = (done: Function) => {
          ctx.refs.formRef.validate(valid => {
            if (valid) {
              loading.value = true
              MessageBox.confirm('确认添加？').then(res => {
                ctx.root.$http.post('admin/user_info/volunteer/add', [form.value])
                  .then(res => {
                    if (res.data.meta.success || false) {
                      ctx.root.$message({
                          message: '添加成功',
                          type: 'success'
                      })
                      getData()
                    } else {
                      ctx.root.$message.error('添加失败')
                    }
                  })
                done()
              }).catch(err => console.error)
              .finally(() => {
                loading.value = false
              })
            }
          })
        }

        const cancelForm = () => {
          loading.value = false
          visible.value = false
        }

        return {
          taskHandledList,
          taskShowList,
          searchInput,
          totalNum,
          handleClick,
          taskStateMap,
          currentCursor,
          handleCurrentChange,
          handleAddVolunteer,
          handleDrawerClose,
          rules,
          form,
          cancelForm,
          visible,
          formLabelWidth,
          loading
        }
    }
})
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100%;
  .header {
    border: 1px solid #DCDFE6;
    padding: 10px;
    border-radius: 15px;
    background: #f2f2f2;
  }
  .infos {
    width: 100%;
    padding: 20px 30px;
    position: relative;
    font-size: 20px;
    font-weight: bolder;
    .tag1 {
      margin-left: 20px;
      margin-right: 20px;
      font-size: 20px;
      font-weight: bolder;
      border-radius: 10px;
      elevation: higher;
    }
    .search {
      width: 400px;
      position: absolute;
      top: 20px;
      right: 30px;
      display: flex;
      .input {
        width: 300px;
        margin-right: 10px;
      }
    }
  }
  .top_card {
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
    /*background-color: #f2f2f2;*/
    background: url("../../pages/asset/朦胧背景3.jpg");
    outline-width: 1px;
    border-bottom-color: #f2f2f2;
    elevation: lower;
    border-radius: 2px;
  }
  .table_card {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    /*background-color: #c4c4c4;*/
    /*background: url("../../pages/asset/黄色渐变.jpg");*/
  }
  .demo-drawer__footer {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
  }
  .table {
    padding: 10px 30px;
    .pagination {
      margin: 30px 0;
      display: flex;
      justify-content: center;
    }
    .class0 {
      color: orange;
    }
    .class1 {
      color: blue;
    }
    .class2 {
      color: green;
    }
  }
}
</style>
