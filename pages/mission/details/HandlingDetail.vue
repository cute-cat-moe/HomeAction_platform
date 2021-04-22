<template>
  <div class="container">
    <el-card class="top_card">
      <el-row>
        <el-col :span="12">
          <div class="header">
            <el-breadcrumb separator=">>">
              <el-breadcrumb-item :to="{ path: '/mission/handling' }">任务中心</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/mission/handling' }">待审核任务</el-breadcrumb-item>
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
            <span>任务详细信息</span>
          </el-tag>
        </div>
      </div>

      <el-row>
        <el-col :span="8">
          <el-card class="card-msg">
            <div class="infos">
              <el-tag class="tag2">
                <span>走失老人信息</span>
              </el-tag>
            </div>
            <el-divider/>

            <el-row>
              <el-col :span="8">
                <el-row><span class="detailDesCSS">姓名</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.old_name }}</span></el-row>
              </el-col>
              <el-col :span="8">
                <el-row><span class="detailDesCSS">性别</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.old_sex }}</span></el-row>
              </el-col>
              <el-col :span="8">
                <el-row><span class="detailDesCSS">年龄</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.old_age }}</span></el-row>
              </el-col>
            </el-row>
            <el-divider/>

            <el-row>
              <el-col :span="12">
                <el-row><span class="detailDesCSS">家属姓名</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.relation_name }}</span></el-row>
              </el-col>
              <el-col :span="12">
                <el-row><span class="detailDesCSS">家属电话</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.relation_phone }}</span></el-row>
              </el-col>
            </el-row>
            <el-divider/>

            <el-row>
              <el-col :span="12">
                <el-row><span class="detailDesCSS">老人疾病史</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.old_ill }}</span></el-row>
              </el-col>
              <el-col :span="12">
                <el-row><span class="detailDesCSS">老人走失时间</span></el-row>
                <el-row><span class="detailValueCSS">{{ obj.lost_time | date('YYYY-MM-DD HH:mm') }}</span></el-row>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-row>
            <el-col :span="24">
              <el-card class="card-msg">
                <div slot="header"><span class="detailDesCSS">老人近期照片</span></div>
                <el-image lazy :src="photoUrl" :preview-src-list="[photoUrl]"></el-image>
              </el-card>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="8">
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

    ctx.root.$http.get(`admin/task_center/task_audit/${param}`)
      .then(res => {
        // Object.assign(obj, res.data.data)
        obj.value = res.data.data
      })
      .catch(err => console.error)

    const photoUrl = computed(() => 'http://localhost:3010' + obj.value?.photo)
    const lostPosition = computed(() => obj.value?.lost_position || [104.09789, 30.67664])

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
            icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
          })

          map.add(marker)
        } catch(err) {
          console.error(err)
        }
      })

    })

    return {
      obj,
      photoUrl,
    }
  }
})
</script>

<style lang="scss">
.container {
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  .detailDesCSS {
    color: #959595;
    font-size: 14px;
  }
  .detailValueCSS {
    font-size: 16px;
  }
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
}
.card-header {
  font-size: 14px;

  .divide {
    font-size: 30px;
    background-color: black;
  }
}

</style>
