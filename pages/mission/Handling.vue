<template>
  <div class="container">
    <el-card class="top_card">
      <el-row>
        <el-col :span="12">
          <div class="header">
            <el-breadcrumb separator=">>">
              <el-breadcrumb-item :to="{ path: '/mission/handling' }">任务中心</el-breadcrumb-item>
              <el-breadcrumb-item>待审核任务</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="table_card">
      <div slot="header">
        <div class="infos">
          <i class="el-icon-document-remove"></i>
          <el-tag class="tag1">
            <span>任务信息</span>
          </el-tag>
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
            prop="tid"
            label="任务编号"
            width="width">
          </el-table-column>
          <el-table-column
            prop="upload_time"
            label="上传时间"
            width="width">
            <template slot-scope="scope">
              {{ scope.row.upload_time | date('YYYY-MM-DD HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="old_name"
            label="走失老人"
            width="width">
          </el-table-column>
          <el-table-column
            prop="relation_name"
            label="老人家属"
            width="width">
          </el-table-column>
          <el-table-column
            prop="relation_phone"
            label="家属电话"
            width="width">
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import { useCurrentRoute } from '@/utils/hook'
import { taskStateMap } from '@/utils/const'

export default defineComponent ({
    setup(props, ctx) {
        const route = useCurrentRoute()
        const taskAuditingList = ref([])
        const searchInput = ref('')
        const currentCursor = ref(1)

        ctx.root.$http.get('admin/task_center/task_audit').then(res => {
          taskAuditingList.value = res.data.data
        }).catch(err => console.error)

        const totalNum = computed(() => taskAuditingList.value.length || 0)
        const taskShowList = computed(() => taskAuditingList.value.slice(10 * (currentCursor.value - 1), 10 * currentCursor.value))

        const handleClick = (val) => {
          ctx.root.$router.push(ctx.root.$getMissionHandlingDetailRoute(val.tid))
        }

        const handleCurrentChange = (val) => {
          currentCursor.value = val
        }

        return {
          taskAuditingList,
          taskShowList,
          searchInput,
          totalNum,
          handleClick,
          taskStateMap,
          currentCursor,
          handleCurrentChange,
        }
    }
})
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  .header {
    border: 2px solid #DCDFE6;
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
  .table {
    padding: 10px 30px;
    .pagination {
      margin: 30px 0;
      display: flex;
      justify-content: center;
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
}
</style>
