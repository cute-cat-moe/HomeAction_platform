<template>
  <el-container class="container">
    <main-header class="header"></main-header>
    <el-aside class="aside" width="200px">
      <el-menu class="el-menu-vertical-demo" :default-active="activeIndex" :router="true" active-text-color="blue">
        <el-divider class="divider1"></el-divider>
        <el-submenu index="mission">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span class="title_one">任务中心</span>
          </template>

          <el-menu-item index="unhandled" class="el-menu-item" :route="{ path: '/mission/unhandled' }">
            <i class="el-icon-document"></i>
            <span class="title_two">未完成任务</span>
          </el-menu-item>

          <el-divider class="divider2"></el-divider>
          <el-menu-item index="handled" class="el-menu-item" :route="{ path: '/mission/handled' }">
            <i class="el-icon-document-checked"></i>
            <span class="title_two">已完成任务</span>
          </el-menu-item>

          <el-divider class="divider2"></el-divider>
          <el-menu-item index="handling" class="el-menu-item" :route="{ path: '/mission/handling' }">
            <i class="el-icon-document-remove"></i>
            <span class="title_two">待审核任务</span>
          </el-menu-item>
        </el-submenu>
        <el-divider class="divider1"></el-divider>

        <el-submenu index="data">
          <template slot="title">
            <i class="el-icon-s-data"></i>
            <span class="title_one">数据统计</span>
          </template>

          <el-menu-item index="presentation" class="el-menu-item" :route="{ path: '/data/presentation'}">
            <i class="el-icon-data-line"></i>
            <span class="title_two">任务数据展示</span>
          </el-menu-item>

          <el-divider class="divider2"></el-divider>
          <el-menu-item index="chart" class="el-menu-item" :route="{ path: '/data/alert' }">
            <i class="el-icon-place"></i>
            <span class="title_two">热力预警图</span>
          </el-menu-item>

          <el-divider class="divider2"></el-divider>
          <el-menu-item index="position" class="el-menu-item" :route="{ path: '/data/position' }">
            <i class="el-icon-location-outline"></i>
            <span class="title_two">志愿者位置分布图</span>
          </el-menu-item>
        </el-submenu>
        <el-divider class="divider1"></el-divider>

        <el-submenu index="people">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span class="title_one">人员信息</span>
          </template>

          <el-menu-item index="administrator" class="el-menu-item" :route="{ path: '/people/administrator' }">
            <i class="el-icon-user"></i>
            <span class="title_two">管理员</span>
          </el-menu-item>

          <el-divider class="divider2"></el-divider>
          <el-menu-item index="volunteer" class="el-menu-item" :route="{ path: '/people/volunteer' }">
            <i class="el-icon-user"></i>
            <span class="title_two">志愿者</span>
          </el-menu-item>

          <el-divider class="divider2"></el-divider>
          <el-menu-item index="pfamily" class="el-menu-item" :route="{ path: '/people/pfamily' }">
            <i class="el-icon-user"></i>
            <span class="title_two">老人家属</span>
          </el-menu-item>
        </el-submenu>
        <el-divider class="divider1"></el-divider>

        <el-submenu index="notice">
          <template slot="title">
            <i class="el-icon-s-unfold"></i>
            <span class="title_one">新闻中心</span>
          </template>
          <el-menu-item index="principle" class="el-menu-item" :route="{ path: '/news/release' }">
            <i class="el-icon-edit"></i>
            <span class="title_two">发布新闻</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-divider class="divider1"></el-divider>
    </el-aside>
    <el-main class="main">
      <router-view class="view"></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api'
import ViewContainer from '@/components/ViewContainer.vue'
import MainHeader from '@/components/MainHeader.vue'
import { useCurrentRoute } from '@/utils/hook'

export default defineComponent({
  components: {
    ViewContainer,
    MainHeader,
  },
  setup(props, ctx) {
    const { value: { path }} = useCurrentRoute()

    const activeIndex = ref('unhandled')

    activeIndex.value = path?.split('/')[2] || 'unhandled'

    // const user = computed(() => ctx.root.$store.state)

    onMounted(() => {
      if (!ctx.root.$store.state.token) {
        const userInfo = window.sessionStorage.getItem('user')
        ctx.root.$store.commit('update', userInfo)
      }
    })

    return {
      activeIndex,
    }
  }
})
</script>

<style lang="scss" scoped>
.aside {
  height: 100vh;
  border-right: 1px solid grey;
  margin-top: 50px;
  position: fixed;
  z-index: 1000;
  /*background-color: #BBD2EA;*/
  background: url("../pages/asset/朦胧背景.jpg");
}
.container {
  background-color: #f2f2f2;
  width: 100%;
  .header {
    z-index: 1000;
  }
}
.main {
  // width: calc(100% - 200px);
  width: 100%;
  margin-top: 30px;
  // margin-left: 0;
  margin-left: 205px;
  margin-right: -40px;
  /*background: url("../pages/asset/背景2.jpg");*/
  background: url("../pages/asset/背景3.jpg");
  /*background-color: #f2f2f2;*/
  .view {
    margin-left: -20px;
    background-color: rgba(0, 0, 0, 0);
  }
}
.el-menu-vertical-demo {
  /*background-color: #B8E0E4;*/
  background: url("../pages/asset/朦胧背景1.jpg");
  // position: fixed;
  // width: 200px;
}
.el-menu-item {
  /*background-color: #DCDBCE;*/
  background: url("../pages/asset/朦胧背景2.jpg");
}
.title_one {
  color: #2f2f2f;
}
.title_two {
  color: #636363;
}
.divider1 {
  margin-top: 0.5px;
  margin-bottom: 0.5px;
  color: black;
  background-color: #aaa7a7;
}
.divider2 {
  margin-bottom: 0.2px;
  margin-top: 0.2px;
  background-color: #ffffff;
  color: #ffffff;
}
</style>
