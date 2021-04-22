<template>
  <div class="container">
    <el-card class="top_card">
      <el-row>
        <el-col :span="12">
          <div class="header">
            <el-breadcrumb separator=">>">
              <el-breadcrumb-item :to="{ path: '/people/volunteer' }">人员信息</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/people/volunteer' }">志愿者</el-breadcrumb-item>
              <el-breadcrumb-item>详细信息</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="card-content">
      <div slot="header" class="card-header">
        <div class="infos">
          <i class="el-icon-document-remove"></i>
          <el-tag class="tag1">
            <span>志愿者详细信息</span>
          </el-tag>
        </div>
      </div>

      <el-row>
        <el-col :span="12">
          <el-card class="card-msg">
            <div class="infos">
              <el-tag class="tag2">
                <span>志愿者信息</span>
              </el-tag>
            </div>
            <el-divider/>

            <el-row>
              <el-col :span="8">
                <el-row><span class="detailDesCSS">姓名</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.name }}</span></el-row>
              </el-col>
              <el-col :span="8">
                <el-row><span class="detailDesCSS">性别</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.sex }}</span></el-row>
              </el-col>
              <el-col :span="8">
                <el-row><span class="detailDesCSS">年龄</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.age }}</span></el-row>
              </el-col>
            </el-row>
            <el-divider/>

            <el-row>
              <el-col :span="12">
                <el-row><span class="detailDesCSS">志愿者身份</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.identity? '普通志愿者' : '任务负责人' }}</span></el-row>
              </el-col>
              <el-col :span="12">
                <el-row><span class="detailDesCSS">志愿者状态</span></el-row>
                <el-row><span class="detailValueCSS"><state-tag :state="obj.state"></state-tag></span></el-row>
              </el-col>
            </el-row>
            <el-divider/>

            <el-row>
              <el-col :span="12">
                <el-row><span class="detailDesCSS">联系电话</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.phone  }}</span></el-row>
              </el-col>
              <el-col :span="12">
                <el-row><span class="detailDesCSS">身份证号</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.idcard }}</span></el-row>
              </el-col>
            </el-row>
            <el-divider/>

            <div class="btn-box">
              <el-button class="change-btn" type="primary">点击修改</el-button>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <div class="map-box">
                <!-- <span class="sec-title">走失地点：</span> -->
                <el-card class="card-msg">
                  <div slot="header">
                    <el-row>
                      <el-col :span="6"><span class="detailDesCSS">老人走失地点：</span></el-col>
                      <el-col :span="18"><span class="detailValueCSS">{{ obj.lost_area }}</span></el-col>
                    </el-row>
                  </div>
                  <div>
                    <div id="amap"></div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch, onMounted } from "@vue/composition-api";
import { useCurrentRoute, isSupportCanvas } from "~/utils/hook";
import { DataItem as UnhandledItem } from 'utils/apis/declares/unhandled-res'
import StateTag from '@/components/mission/StateTag.vue'
import LevelTag from '@/components/mission/LevelTag.vue'

export default defineComponent ({
  components: {
    StateTag,
    LevelTag,
  },
  setup(props, ctx) {
    const route = useCurrentRoute()
    const { value: { params: { id: param }} } = route
    const obj = ref({})

    ctx.root.$http.get(`admin/user_info/volunteer/${param}`)
      .then(res => {
        obj.value = res.data.data
      })
      .catch(err => console.error)

    const lostPosition = computed(() => obj.value?.position || [104.09789, 30.67664])

    onMounted(() => {

      if (!isSupportCanvas()) {
        alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
      }

      watch(lostPosition, () => {
        try {
          const map = new AMap.Map("amap", {
            resizeEnable: true,
            center: [lostPosition.value[0], lostPosition.value[1]],
            // center: [104.09789, 30.67664],  // 沙河大学
            zoom: 11
          })

          const marker = new AMap.Marker({
            // position: new AMap.LngLat(104.09789, 30.67664),
            position: new AMap.LngLat(lostPosition.value[0], lostPosition.value[1]),
            title: '走失地点',
            clickable: true,
          })

          map.add(marker)
        } catch(err) {
          console.error(err);
        }
      })

    })

    return {
      obj,
    }
  }
})
</script>

<style lang="scss">
  .container {
    width: 100%;
    .header {
      border: 1px solid #DCDFE6;
      padding: 10px;
    }
    .detailDesCSS {
      color: #959595;
      font-size: 14px;
    }
    .detailValueCSS {
      font-size: 16px;
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
      }
      .tag2 {
        font-size: 16px;
        font-weight: bolder;
        border-radius: 13px;
        background-color: #B7D2CF;
        margin-left: -25px;
      }
    }
    .card-msg {
      margin-right: 15px;
      margin-left: 15px;
      margin-bottom: 30px;
      .btn-box {
        display: flex;
        justify-content: center;
        padding-top: 30px;
      }
    }
    .map-box {
      flex: 1;
      display: inline-block;
      /*position: relative;*/
      width: 100%;
      #amap {
        // margin-left: 80px;
        /*width: 100%;*/
        height: 300px;
      }
    }
    .top_card {
      margin-top: 0;
      margin-left: 0;
      margin-right: 0;
      /*background-color: #f2f2f2;*/
      background: url("../../../pages/asset/朦胧背景3.jpg");
      outline-width: 1px;
      border-bottom-color: #f2f2f2;
      elevation: lower;
      border-radius: 2px;
    }
    .card-content {
      margin-bottom: -20px;
      /*background: url("../../../pages/asset/背景3.jpg");*/
      background: url("../../../pages/asset/卡片背景.png");
    }
    .sec-title {
      position: absolute;
      top: 0;
      left: 0;
    }
    .divide {
      color: #000000;
      border-color: black;
      background-color: rgba(0, 0, 0, 0);
      margin-top: -30px;
      margin-bottom: 0;
    }
  }

</style>
