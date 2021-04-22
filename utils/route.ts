import $axios from '@nuxtjs/axios'
declare module 'vue/types/vue' {
    interface Vue {
        $getMissionUnhandledRoute: typeof $getMissionUnhandledRoute
        $getMissionUnhandledDetailRoute: typeof $getMissionUnhandledDetailRoute,
        $getMissionHandlingDetailRoute: typeof $getMissionHandlingDetailRoute,
        $getMissionHandledDetailRoute: typeof $getMissionHandledDetailRoute,
        $getPeopleVolunteerDetailRoute: typeof $getPeopleVolunteerDetailRoute,
        $axios: typeof $axios,
        $http: typeof $axios,
        $getSeniorRelationRoute: typeof $getSeniorRelationRoute,
    }
}

export function $getMissionUnhandledRoute() {
    return { path: '/mission/unhandled' }
}

export function $getMissionHandledRoute() {
    return {
        name: 'missionHandled',
    }
}

export function $getMissionHandlingdRoute() {
    return {
        name: 'missionHandling',
    }
}

export function $getMissionUnhandledDetailRoute(id: string) {
    return {
        path: `/mission/unhandled/detail/${id}`
    }
}

export function $getMissionHandlingDetailRoute(id: string) {
    return {
        path: `/mission/handling/detail/${id}`
    }
}

export function $getMissionHandledDetailRoute(id: string) {
    return {
        path: `/mission/handled/detail/${id}`
    }
}

export function $getAdministratorDetailRoute(id: string) {
  return {
    path: `/people/administrator/detail/${id}`
  }
}

export function $getPeopleVolunteerDetailRoute(id: string) {
    return {
        path: `/people/volunteer/detail/${id}`
    }
}

export function $getSeniorRelationRoute(id: string) {
    return {
        path: `/people/pfamily/detail/${id}`
    }
}
