<template>
  <div class="header-container">
    <img src="~@/pages/asset/home_action.png" alt="LOGO">
    <!--      <el-divider class="divider" direction="vertical"></el-divider>-->
    <span class="title">——智能救援指挥系统平台</span>
    <user-info class="user-info"></user-info>
<!--    <el-image src="~@/pages/asset/菱形渐变.jpg" class="image">-->
<!--    </el-image>-->

  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import UserInfo from '@/components/UserInfo.vue'

export default defineComponent ({
    components: {
        UserInfo,
    },
    setup(props, ctx) {}
})
</script>

<style lang="scss" scoped>
.header-container {
    height: 50px;
    width: 100%;
    position: fixed;
    background: url("../pages/asset/菱形渐变.jpg");
    padding: 10px 20px;
    display: flex;
    align-items: center;
    z-index: 2;

    .image {
      height: 50px;
    }

    img {
        width: 100px;
    }

    .title {
      color: #DCDFE6;
      font-weight: bolder;
      font-size: 18px;
    }

    .divider {
        font-size: 30px;
        color: rgb(121, 137, 168);
        margin: 0 30px;
    }

    .user-info {
        position: absolute;
        right: 10px;
        color: #DCDFE6;
    }
}
</style>
