
export const state = () => ({
    aid: 0,
    name: '',
    sex: '',
    phone: '',
    state: false,
    token: '',
})

export const mutations = {
    update(state, newState) {
        Object.assign(state, newState)
    }
}
