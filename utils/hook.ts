import { computed, reactive } from '@vue/composition-api'
import { Location } from 'vue-router'

const routeData = reactive({ params: {}, query: {}, route: {} } as {
    params: Location['params'],
    query: Location['query'],
    route: Location
})

export function updateRouteData(route: Location) {
    routeData.params = route.params
    routeData.query = route.query
    routeData.route = route
}

export function useCurrentRoute() {
    return computed(() => routeData.route || {})
}

export function useRouteParams() {
    return computed(() => routeData.params || {})
}

export function useRouteQuery() {
    return computed(() => routeData.query || {})
}

//判断浏览区是否支持canvas
export const isSupportCanvas = () => {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

export function getRandomIndex(max: number) {
    return Math.random() * max;
}