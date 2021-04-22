<template>
  <div class="container">
    <el-card class="top_card">
      <el-row>
        <el-col :span="12">
          <div class="header">
            <el-breadcrumb separator=">>">
              <el-breadcrumb-item :to="{ path: '/data/presentation' }">数据统计</el-breadcrumb-item>
              <el-breadcrumb-item>志愿者位置分布图</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="card-content">
      <div slot="header">
        <div class="infos">
          <i class="el-icon-place"></i>
          <el-tag class="tag1">
            <span>志愿者位置分布图</span>
          </el-tag>
          <div class="time">
            <span>时间：</span>
            <span class="all" @click="handleAllClick">全部</span>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="date"
              value-format="timestamp"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
      </div>

      <el-row class="map-row">
        <el-col class="map-col" :span="24">
          <div class="map">
            <div id="amap"></div>
          </div>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import { isSupportCanvas, getRandomIndex } from '@/utils/hook'
import Vue from "vue";

export default defineComponent ({
  setup(props, ctx) {
    const map = ref<HTMLDivElement | null>(null)
    const dateRange = ref<number[]>([])
    const volunteerPosData = ref<{
            lng: number,
            lat: number,
          }[]>([])
    const center = ref([116.418261, 39.921984])

    const pickerOptions = ref({
        disabledDate(time: Date) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker: Vue) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker: Vue) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker: Vue) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
    })

    const getData = () => {
      ctx.root.$http.post('admin/data_show/v_position', {
        begin: dateRange.value[0] || 0,
        end: dateRange.value[1] || Date.now(),
      }).then(res => {
        const list = res.data.data || []
        volunteerPosData.value = []

        if (list.length > 0) {
          const centerPos = list[0]
          center.value = [centerPos.v_position[0], centerPos.v_position[1]]

          list.forEach(item => {
            volunteerPosData.value.push({
              lng: item.v_position[0],
              lat: item.v_position[1],
            })
          })
        }
      })
    }

    getData()

    const handleAllClick = () => {
      dateRange.value = []
      dateRange.value.push(0)
      dateRange.value.push(Date.now())
      getData()
    }

    watch(dateRange, () => {
      dateRange.value !== null? getData() : ''
    })

    onMounted(() => {
      watch([center, volunteerPosData], () => {
      try {
        var map = new AMap.Map("amap", {
            resizeEnable: true,
            center: center.value,
            zoom: 11
        })

        for (let i = 0; i < volunteerPosData.value.length; i++) {
          const marker = new AMap.Marker({
            position: new AMap.LngLat(volunteerPosData.value[i]?.lng || 104.09789, volunteerPosData.value[i]?.lat || 30.67664),
            title: '走失地点',
            clickable: true,
            map: map,
          })
          map.add(marker)
        }
        map.setFitView()
      } catch(err) {
        console.error(err)
      }

      })
    })

    return {
      map,
      pickerOptions,
      dateRange,
      handleAllClick,
      // handleTabClick,
      // activeName,
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: rgba(146, 79, 79, 0);
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
    padding: 5px 30px;
    position: relative;
    display: flex;
    align-items: center;
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
    .time {
      position: absolute;
      right: 60px;
      top: 5px;
      .all {
        cursor: pointer;
        margin-right: 20px;
        &:hover {
          color: #2e1ff7;
        }
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
  .card-content {
    margin-bottom: 20px;
    margin-left: 10px;
    margin-top: 10px;
    /*background: url("../../../pages/asset/背景3.jpg");*/
    background: url("../../pages/asset/卡片背景.png");
  }
  .map-row {
    height: 100%;
    .map-col {
      height: 100%;
    }
  }
  .map {
    flex: 1;
    display: inline-block;
    width: 100%;
    #amap {
      border: 1px solid #DCDFE6;
      /*width: 100%;*/
      height: 700px;
    }
  }
}
</style>

<style>
.el-card__body {
  height: 100%;
}
</style>

<style>
.el-tabs__content {
    height: 100%;
}
</style>
