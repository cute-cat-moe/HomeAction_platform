<template>
  <div class="container">
    <el-card class="top_card">
      <el-row>
        <el-col :span="12">
          <div class="header">
            <el-breadcrumb separator=">>">
              <el-breadcrumb-item :to="{ path: '/people/family' }">人员信息</el-breadcrumb-item>
              <el-breadcrumb-item>老人家属</el-breadcrumb-item>
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
            <span>老人家属信息</span>
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
            prop="oid"
            label="家属编号"
            width="width">
          </el-table-column>
          <el-table-column
            prop="r_name"
            label="家属姓名"
            width="width">
          </el-table-column>
          <el-table-column
            prop="o_name"
            label="走失老人姓名"
            width="width">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="家属电话"
            width="width">
          </el-table-column>
          <el-table-column
            prop="state"
            label="老人状态"
            width="width">
            <template slot-scope="scope">
            <span class="class-one" :class="{'class-two': scope.row.state}">
              {{ scope.row.state? '走失中': '已找到'}}
            </span>
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import { useCurrentRoute } from '@/utils/hook'
import { taskStateMap } from '@/utils/const'

export default defineComponent ({
    setup(props, ctx) {
        const route = useCurrentRoute()
        const taskHandledList = ref([])
        const searchInput = ref('')
        const currentCursor = ref(1)

        ctx.root.$http.get('admin/user_info/relation').then(res => {
          taskHandledList.value = res.data.data
        }).catch(err => {
          console.error('errerrerrerr', err)
        })

        const totalNum = computed(() => taskHandledList.value.length || 0)
        const taskShowList = computed(() => taskHandledList.value.slice(10 * (currentCursor.value - 1), 10 * currentCursor.value))

        const handleClick = (val) => {
          ctx.root.$router.push(ctx.root.$getSeniorRelationRoute(val.oid))
        }

        const handleCurrentChange = (val) => {
          currentCursor.value = val
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
        }
    }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
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
  .table {
    padding: 10px 30px;
    .pagination {
      margin: 30px 0;
      display: flex;
      justify-content: center;
    }
  }
}
.class-one {
  color: red;
}
.class-two {
  color: green;
}
</style>
