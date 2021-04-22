<template>
 <div class="container">
   <el-card class="top_card">
     <el-row>
       <el-col :span="12">
         <div class="header">
           <el-breadcrumb separator=">>">
             <el-breadcrumb-item :to="{ path: '/data/presentation' }">数据统计</el-breadcrumb-item>
             <el-breadcrumb-item>热力预警图</el-breadcrumb-item>
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
           <span>热力预警图</span>
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
import { getRandomIndex, isSupportCanvas } from '@/utils/hook'

export default defineComponent ({
  setup(props, ctx) {
    const map = ref<HTMLDivElement | null>(null)
    const dateRange = ref<number[]>([])
    const heatmapData = ref<{
            lng: number,
            lat: number,
            count: number
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
      ctx.root.$http.post('admin/data_show/lost_position', {
        begin: dateRange.value[0] || 0,
        end: dateRange.value[1] || Date.now(),
      }).then(res => {        
        const list = res.data.data || []
        heatmapData.value = []
        
        if (list.length > 0) {
          const centerPos = list[0]
          center.value = [centerPos.lost_position[0], centerPos.lost_position[1]]

          list.forEach(item => {
            heatmapData.value.push({
              lng: item.lost_position[0],
              lat: item.lost_position[1],
              count: getRandomIndex(100)
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
      watch([center, heatmapData], () => {
        try {
          var map = new AMap.Map("amap", {
            resizeEnable: true,
            center: center.value,
            zoom: 11
          })

          if (!isSupportCanvas()) {
              alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
          }

          var heatmap
          
          map.plugin(["AMap.Heatmap"], () => {
            //初始化heatmap对象
            heatmap = new AMap.Heatmap(map, {
                radius: 25, //给定半径
                opacity: [0, 0.8]
            })
            //设置数据集：该数据为北京部分“公园”数据
            heatmap.setDataSet({
                data: heatmapData.value,
                max: 100
            })
          })
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
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
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
    height: 100%;
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
    height: 75%;
    padding: 20px 50px;
    .card {
      height: 100%;
      .amap {
        height: 100%;
      }
    }
  }
}
#amap {
  width: 100%;
  height: 100%;
}
</style>

<style>
.el-card__body {
  height: 100%;
}
</style>
