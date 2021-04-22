// 看了一下，这个类型太多了，先不写了，有时间再加类型检查


export interface DataItem {
    config: {
        url: string,
        method: string,
        headers: {},
        baseURL: string,
        transformRequest: {},
        data: {},
        status: number,
        statusText: string,
    }
}
