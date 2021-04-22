import { updateRouteData } from '@/utils/hook'
import * as routeMethod from '@/utils/route'
import Vue from 'vue'
import echarts from 'echarts'

Object.assign(
    Vue.prototype,
    routeMethod,
)

Vue.prototype.$echarts = echarts

export default function universal({ app: { router } }) {
    router.afterEach(updateRouteData)

}
