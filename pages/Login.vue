<template>
  <div class="container">
      <div class="login-box">
<!--        <div class="avatar_box">-->
<!--            <img src="./asset/v.png" alt="logo">-->
<!--        </div>-->
        <div class="left-box">
          <!--              <img src="./asset/v.png" alt="">-->
          <el-image :src="require('./asset/v.png')" fit="cover"></el-image>
        </div>
        <div class="form">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            label-width="60px"
            class="login-form"
            :rules="loginFormRules"
          >
            <div class="header">
              <el-row>
                <img src="~@/pages/asset/home_action.png" alt="LOGO">
              </el-row>
              <el-row>
                <span class="title">——智能救援指挥系统平台</span>
              </el-row>
            </div>
            <el-form-item label="手机号" label-width="80px" prop="phone">
              <el-input v-model="loginForm.phone" :validate-event="true">
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="80px" prop="password">
              <el-input v-model="loginForm.password" type="password" :validate-event="true">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" round @click="login">登录</el-button>
              <el-button type="info" round @click="resetLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRef } from "@vue/composition-api";
import axios from 'axios'

export default defineComponent ({
    components: {},
    setup(props, ctx) {
        const loginForm = reactive({
            phone: '',
            password: '',
        })

        const loginFormRules = ref({
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur"},
          { min: 4, max: 11, message: "请输入正确的手机号", pattern: '^[0-9]*$', trigger: "blur"}
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur"},
          { min: 6, max: 15, message: "长度在6到15个字符之间", trigger: "blur"}
        ]
      })

        const login = () => {
          ctx.refs.loginFormRef.validate( async (valid) => {
            if (!valid) {
                return
            }
            const {data: res} = await ctx.root.$axios.post('admin/user/login', loginForm);
            if (res.meta.status !== 200) {
                window.sessionStorage.clear()
                return ctx.root.$message.error("登陆失败！");
            }
            ctx.root.$message.success("登陆成功！");
            const token = res.data.token;
            window.sessionStorage.clear();
            window.sessionStorage.setItem("token", token);
            ctx.root.$store.commit('update', res.data)
            window.sessionStorage.setItem('name', res.data.name)
            ctx.root.$router.replace('/');
            })
        }

        const resetLoginForm = () => {
            ctx.refs.loginFormRef.resetFields()
        }

        return {
            loginForm,
            resetLoginForm,
            login,
            loginFormRules,
        }
    }
})
</script>

<style lang="scss" scoped>
.container {
    background: url("../pages/asset/海报.jpg") 100% / 100%;
    height: 100vh;
    min-height: 600px;
    position: relative;

    .login-box {
      width: 70%;
      height: 70%;
      position: relative;
      top: 50%;
      left: 50%;
      background: #FFFFFF;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #909090;
      border-radius: 10px;
      background: url("../pages/asset/朦胧.jpg") 100% 100% / 100%;

      .left-box {
        width: 60%;
        height: 100%;
        transform: translate(0, 0);
        position: relative;
        border-radius: 10px;
        background-color: #F4EEDA;
      };
      .login-form {
        top: 10%;
        left: 60%;
        width: 40%;
        height: 100%;
        position: absolute;
        padding: 0 20px;
        box-sizing: border-box;
        .header {
          margin-top: 20px;
          font-size: 20px;
          font-weight: bolder;
          margin-bottom: 100px;
          img {
            width: 160px;
          }
          .title {
            color: #6f6f6f;
            font-weight: bolder;
            font-size: 20px;
            margin-left: 60px;
            margin-bottom: 40px;
          }
        }
      }
    }

    .btns {
    display: flex;
    justify-content: center;
    }
}
</style>
