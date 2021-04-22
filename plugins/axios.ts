import { Message } from 'element-ui'
import Vue from 'vue'
import axios from 'axios'

declare module 'vue/types/vue' {
    interface Vue{
        $axios: typeof $axios,
    }
}

export default function({store, redirect, app:{ router, $axios}}) {
    $axios.defaults.baseURL = 'http://127.0.0.1:3010/'

    $axios.interceptors.request.use(config => {
        config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
        return config
    })

    $axios.interceptors.response.use(res => {
        if(res.status === 200) {
            return res
        }
    }, err => {
        if (err.status === 401) {
            redirect('/login')
            return Message.error('未登录，请登录')
        } else {
            return Message.error('接口错误')
        }
    })

    Vue.prototype.$http = $axios
}


// axios.defaults.baseURL = 'http://127.0.0.1:3010/'

// axios.interceptors.request.use(config => {
//     config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
//     return config
// })

// axios.interceptors.response.use(res => {
//     if(res.status === 200) {
//         Message({
//             message: '成功拿到数据',
//             type: 'success'
//         })
//         return res
//     }
// }, err => {
//     if (err.status === 401) {
//         return Message.error('未登录，请登录')
//     } else {
//         return Message.error('接口错误')
//     }
// })

// Vue.prototype.$http = axios