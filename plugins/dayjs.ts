import Vue from "vue";
import dayjs from 'dayjs'

Vue.filter('date', (val: number, str: string) => {
    return dayjs(val).format(str)
})
