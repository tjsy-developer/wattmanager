import Vue from "vue"

export const state = () => ({
    userPhoneNum: undefined
})

export const mutations = {
    getPhoneNum(state, payload) {
        state.userPhoneNum = payload
    }
}