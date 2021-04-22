<template>
  <div class="container">
    <el-card class="top_card">
      <el-row>
        <el-col :span="12">
          <div class="header">
            <el-breadcrumb separator=">>">
              <el-breadcrumb-item :to="{ path: '/data/presentation' }">数据统计</el-breadcrumb-item>
              <el-breadcrumb-item>任务数据展示</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="card-content" :body-style="{ padding: '0px' }">
      <div slot="header" class="card-header">
        <div class="infos">
          <i class="el-icon-data-line"></i>
          <el-tag class="tag1">
            <span>关键数据</span>
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
    </el-card>

    <el-row>
      <el-col :span="6">
        <el-card class="card1">
          <div slot="header">
            <span>搜救任务数量</span>
          </div>
          <div>
            <div class="infos">
              <i class="el-icon-s-order" style="margin-right: 20px"></i>
              <el-tag class="tag2">
                <span>30</span>
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="card1">
          <div slot="header">
            <span>成功搜救次数</span>
          </div>
          <div>
            <div class="infos">
              <i class="el-icon-s-claim" style="margin-right: 20px"></i>
              <el-tag class="tag2">
                <span>28</span>
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="card1">
          <div slot="header">
            <span>志愿者人数</span>
          </div>
          <div>
            <div class="infos">
              <i class="el-icon-user-solid" style="margin-right: 20px"></i>
              <el-tag class="tag2">
                <span>30</span>
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="card1">
          <div slot="header">
            <span>走失老人数量</span>
          </div>
          <div>
            <div class="infos">
              <i class="el-icon-user" style="margin-right: 20px"></i>
              <el-tag class="tag2">
                <span>30</span>
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="16">
        <div class="map-box">
          <el-card class="card">
            <div slot="header"><div class="infos"><el-tag class="tag3">走失老人位置分布</el-tag></div></div>
            <div>
              <div id="amap"></div>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="8">
        <el-row>
          <el-card class="card">
            <div slot="header"><div class="infos"><el-tag class="tag3">走失老人年龄分布</el-tag></div></div>
            <div id="oldAge"></div>
          </el-card>
        </el-row>

        <el-row>
          <el-card class="card">
            <div slot="header"><div class="infos"><el-tag class="tag3">搜寻时间分布</el-tag></div></div>
            <div id="searchTime"></div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-card class="card">
          <div slot="header"><div class="infos"><el-tag class="tag3">走失老人性别比例</el-tag></div></div>
          <div id="oldSexRatio">
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="card">
          <div slot="header"><div class="infos"><el-tag class="tag3">任务成功结束比例</el-tag></div></div>
          <div id="MissionSuccessRatio">
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="card">
          <div slot="header"><div class="infos"><el-tag class="tag3">任务等级比例</el-tag></div></div>
          <div id="MissionLevelRatio"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch, computed } from "@vue/composition-api";
  import { isSupportCanvas } from '~/utils/hook'
  import Vue from "vue";

  export default defineComponent ({
    setup(props, ctx) {
      const dateRange = ref<number[]>([])

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

      const oldSexRatioData = ref({})
      const missionSuccessData = ref({})
      const missionLevelData = ref({})
      const oldAgeData = ref({})
      const searchTimeData = ref({})
      const lostPosData = ref<{
              lng: number,
              lat: number,
            }[]>([])
      const center = ref([116.418261, 39.921984])

      const fetchData = () => {
        ctx.root.$http.post('admin/data_show/old_sex', {
          begin: dateRange.value[0] || 0,
          end: dateRange.value[1] || Date.now(),
        }).then(res => {
          const data = res.data.data
          oldSexRatioData.value = data
        })

        ctx.root.$http.post('admin/data_show/success', {
          begin: dateRange.value[0] || 0,
          end: dateRange.value[1] || Date.now(),
        }).then(res => {
          const data = res.data.data
          missionSuccessData.value = data
        })

        ctx.root.$http.post('admin/data_show/task_level', {
          begin: dateRange.value[0] || 0,
          end: dateRange.value[1] || Date.now(),
        }).then(res => {
          const data = res.data.data
          missionLevelData.value = data
        })

        ctx.root.$http.post('admin/data_show/old_age', {
          begin: dateRange.value[0] || 0,
          end: dateRange.value[1] || Date.now(),
        }).then(res => {
          const data = res.data.data
          oldAgeData.value = data
        })

        ctx.root.$http.post('admin/data_show/task_time', {
          begin: dateRange.value[0] || 0,
          end: dateRange.value[1] || Date.now(),
        }).then(res => {
          const data = res.data.data
          searchTimeData.value = data
        })

      ctx.root.$http.post('admin/data_show/lost_position', {
        begin: dateRange.value[0] || 0,
        end: dateRange.value[1] || Date.now(),
      }).then(res => {        
        const list = res.data.data || []
        lostPosData.value = []
        
        if (list.length > 0) {
          const centerPos = list[0]
          center.value = [centerPos.lost_position[0], centerPos.lost_position[1]]

          list.forEach(item => {
            lostPosData.value.push({
              lng: item.lost_position[0],
              lat: item.lost_position[1],
            })
          })
        }
      })
      }

      fetchData()
      const lostPosition = computed(() => [104.09789, 30.67664])

      const handleAllClick = () => {
        dateRange.value = []
        dateRange.value.push(0)
        dateRange.value.push(Date.now())
        fetchData()
      }

      watch(dateRange, () => {
        dateRange.value !== null? fetchData() : ''
      })

      onMounted(() => {
        const oldSexRatio = ctx.root.$echarts.init(document.getElementById('oldSexRatio'))
        const MissionSuccessRatio = ctx.root.$echarts.init(document.getElementById('MissionSuccessRatio'))
        const MissionLevelRatio = ctx.root.$echarts.init(document.getElementById('MissionLevelRatio'))
        const oldAge = ctx.root.$echarts.init(document.getElementById('oldAge'))
        const searchTime = ctx.root.$echarts.init(document.getElementById('searchTime'))

        if (!isSupportCanvas()) {
          alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
        }

        try {
          watch([lostPosData, center], () => {
            const map = new AMap.Map("amap", {
              resizeEnable: true,
              center: [center.value[0], center.value[1]],
              // center: [104.09789, 30.67664],  // 沙河大学
              zoom: 11
            })

            for (let i = 0; i < lostPosData.value.length; i++) {
              const marker = new AMap.Marker({
                position: new AMap.LngLat(lostPosData.value[i]?.lng || 104.09789, lostPosData.value[i]?.lat || 30.67664),
                title: '走失地点',
                clickable: true,
                map: map,
                icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
              })
              map.add(marker)
            }
            map.setFitView()
          })
        } catch(err) {
          console.error(err);
        }

        watch(oldSexRatioData, () => {
          oldSexRatio.setOption({
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [
              {
                name: '走失老人性别比例',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  {value: oldSexRatioData.value?.male || 0, name: '男性'},
                  {value: oldSexRatioData.value?.female || 0, name: '女性'},
                ]
              }
            ]
          })
        })

        watch(missionSuccessData, () => {
          MissionSuccessRatio.setOption({
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [
              {
                name: '任务成功比例',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                // itemStyle: {
                //   borderRadius: 10,
                //   borderColor: '#fff',
                //   borderWidth: 2
                // },
                color: ['#61d27e', '#ff3131'],
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  {value: missionSuccessData.value?.success || 0, name: '成功'},
                  {value: missionSuccessData.value?.fail || 0, name: '失败'},
                ]
              }
            ]
          })
        })

        watch(missionLevelData, () => {
          const dataArray = []
          for (let i = 0; i < missionLevelData.value?.level_n; i++) {
            dataArray.push({
              value: missionLevelData.value[`level_${i + 1}`],
              name: `等级_${i + 1}`
            })
          }

          MissionLevelRatio.setOption({
            // title: {
            //     text: '任务等级比例',
            //     left: 'center'
            // },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
            },
            series: [
              {
                name: '任务等级比例',
                type: 'pie',
                radius: '50%',
                data: dataArray,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          })
        })

        watch(oldAgeData, () => {
          oldAge.setOption({
            xAxis: {
              type: 'category',
              data: ['70岁以下', '70-80岁', '80-90岁', '90岁以上']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: [
                {
                  value: oldAgeData.value?.age_0_70 || 0,
                  itemStyle: {
                    color: '#5470c6'
                  }
                },
                {
                  value: oldAgeData.value?.age_70_80 || 0,
                  itemStyle: {
                    color: '#91cc75'
                  }
                },
                {
                  value: oldAgeData.value?.age_80_90 || 0,
                  itemStyle: {
                    color: '#fac858'
                  }
                },
                {
                  value: oldAgeData.value?.age_90_ || 0,
                  itemStyle: {
                    color: '#ee6666'
                  }
                }
              ],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }]
          })  // TODO: 商量一下
        })


        watch(searchTimeData, () => {
          searchTime.setOption({
              xAxis: {
                type: 'category',
                data: ['24小时以内', '24-48小时', '48-72小时', '72小时以上']
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: [
                  {
                    value: searchTimeData.value?.time_0_24 || 0,
                    itemStyle: {
                      color: '#73c0de'
                    }
                  },
                  {
                    value: searchTimeData.value?.time_24_48 || 0,
                    itemStyle: {
                      color: '#3ba272'
                    }
                  },
                  {
                    value: searchTimeData.value?.time_48_72 || 0,
                    itemStyle: {
                      color: '#fc8452'
                    }
                  },
                  {
                    value: searchTimeData.value?.time_72_ || 0,
                    itemStyle: {
                      color: '#9a60b4'
                    }
                  }
                ],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                  color: 'rgba(180, 180, 180, 0.2)'
                }
              }]
            }
          )  // TODO: 商量一下
        })
      })

      return {
        dateRange,
        pickerOptions,
        handleAllClick,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .container {
    .header {
      border: 1px solid #DCDFE6;
      padding: 10px;
      border-radius: 15px;
      background: #f2f2f2;
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
      padding: 5px 30px;
      position: relative;
      display: flex;
      /*justify-content: space-between;*/
      /*align-items: center;*/
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
        width: 100px;
        color: #0066ff;
        border-radius: 13px;
        background-color: #B7D2CF;
        margin-left: 20px;
      }
      .tag3 {
        font-size: 16px;
        /*width: 100px;*/
        color: #686868;
        border-radius: 13px;
        background-color: #f2f2f2;
      }
      .time {
        margin-right: 50px;
        position: absolute;
        top: 5px;
        right: 30px;
        display: flex;
        .all {
          cursor: pointer;
          margin-right: 20px;
          &:hover {
            color: #2e1ff7;
          }
        }
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
        height: 415px;
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
      height: 75px;
      margin-top: 10px;
      margin-left: 10px;
      /*background: url("../../../pages/asset/背景3.jpg");*/
      background: url("../../pages/asset/卡片背景.png");
    }
  }
  .card {
    flex: 1;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 15px;
    background: url("../../pages/asset/卡片背景.png");
  }
  .card1 {
    flex: 1;
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #555555;
    /*background-color: rgba(38, 31, 247, 0.76);*/
    background: url("../../pages/asset/海报.jpg") 100% 100%;
  }
  #oldSexRatio {
    margin-top: -20px;
    margin-bottom: -30px;
    /*width: 100%;*/
    height: 200px;
  }
  #MissionSuccessRatio {
    margin-top: -20px;
    margin-bottom: -30px;
    /*width: 100%;*/
    height: 200px;
  }
  #MissionLevelRatio {
    margin-top: -20px;
    margin-bottom: -30px;
    /*width: 100%;*/
    height: 200px;
  }
  #oldAge {
    margin-top: -50px;
    margin-bottom: -40px;
    /*width: 100%;*/
    height: 230px;
  }
  #searchTime {
    margin-top: -50px;
    margin-bottom: -40px;
    /*width: 100%;*/
    height: 230px;
  }
</style>
