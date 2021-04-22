import Vue from 'vue'
// import echarts from 'echarts'
var echarts = require('echarts')    // 离谱，不能 import，可能版本不对

Vue.prototype.$echarts = echarts
