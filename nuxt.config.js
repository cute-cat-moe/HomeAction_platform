const withPrefix = (prefix, routes) =>
  routes.map(item => {
    item.path = prefix + item.path
    return item
  })

// module.exports = {} 等同于
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'HomeAction_admin',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        type: 'text/javascript',
        // 引入高德地图 JavaScript API：https://developer.amap.com/api/jsapi-v2/guide/abc/load
        // key 对应 env.mapAppJSAPIKey
        src:
          'https://webapi.amap.com/maps?v=1.4.15&key=19cbf88408e8e5f8ecaea53755271299',
      },
    ],
  },
  render: {
    injectScripts: true,
  },
  server: {
    port: 3000,
    host: 'localhost',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'github-markdown-css',
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/global.css',
    'bytemd/dist/index.min.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '@/plugins/universal.ts'},
    {src: '@/plugins/element-ui'},
    {src: '@/plugins/newUniverse.ts', mode: 'client'},
    {src: '@/plugins/axios.ts'},
    {src: '@/plugins/router.ts'},
    {src: '@/plugins/dayjs.ts'},
    {src: '@/plugins/echarts.ts'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dayjs'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
  
  router: {
    linkActiveClass: "route-active",
    linkExactActiveClass: "router-link-exact-active",
    extendRoutes(routes, resolve) {
      routes.unshift(
        // 登录
        {
          path: '/login',
          name: 'login',
          component: resolve(__dirname, '@/pages/Login')
        },
        {
          path: '/',
          name: 'index',
          redirect: { path: '/mission/unhandled'},
          component: resolve(__dirname, '@/pages/index'),
          children: [
            // 任务
            {
              path: 'mission/unhandled',
              name: 'missionUnhandled',
              component: resolve(__dirname, '@/pages/mission/Unhandled')
            },
            {
              path: 'mission/handled',
              name: 'missionHandled',
              component: resolve(__dirname, '@/pages/mission/Handled')
            },
            {
              path: 'mission/handling',
              name: 'missionHandling',
              component: resolve(__dirname, '@/pages/mission/Handling')
            },
            
            // 任务详情
            {
              path: 'mission/unhandled/detail/:id',
              name: 'missionUnhandledDetail',
              component: resolve(__dirname, '@/pages/mission/details/UnhandledDetail')
            },
            {
              path: 'mission/handled/detail/:id',
              name: 'missionHandledDetail',
              component: resolve(__dirname, '@/pages/mission/details/HandledDetail')
            },
            {
              path: 'mission/handling/detail/:id',
              name: 'missionHandlingDetail',
              component: resolve(__dirname, '@/pages/mission/details/HandlingDetail')
            },

            // 数据
            {
              path: 'data/presentation',
              name: 'dataPresentation',
              component: resolve(__dirname, '@/pages/data/Presentation')
            },
            {
              path: 'data/alert',
              name: 'dataChart',
              component: resolve(__dirname, '@/pages/data/Chart')
            },
            {
              path: 'data/position',
              name: 'dataPosition',
              component: resolve(__dirname, '@/pages/data/Position')
            },
            
            // 人员
            {
              path: 'people/administrator',
              name: 'peopleAdministrator',
              component: resolve(__dirname, '@/pages/people/Administrator')
            },
            {
              path: 'people/volunteer',
              name: 'peopleVolunteer',
              component: resolve(__dirname, '@/pages/people/Volunteer')
            },
            {
              path: 'people/pfamily',
              name: 'peopleFamily',
              component: resolve(__dirname, '@/pages/people/Family')
            },

            // 人员详细
            {
              path: 'people/administrator/detail/:id',
              name: 'peopleAdministratorDetail',
              component: resolve(__dirname, '@/pages/people/component/AdministratorDetail')
            },
            {
              path: 'people/volunteer/detail/:id',
              name: 'peopleVolunteerDetail',
              component: resolve(__dirname, '@/pages/people/component/VolunteerDetail')
            },
            {
              path: 'people/pfamily/detail/:id',
              name: 'peopleFamilyDetail',
              component: resolve(__dirname, '@/pages/people/component/FamilyDetail')
            },
            
            // 消息
            {
              path: 'news/release',
              name: 'noticePrinciple',
              component: resolve(__dirname, '@/pages/notice/Principle')
            },
          ]
        }
      )
    }
  }
}
