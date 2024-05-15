import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const state = () => ({
    mutationState: false,
    tbmKo: "",
    tbmEn: "",
    safetyKo: "",
    safetyEn: ""
})


export const  mutations = {
    setMutationState(state, payload) {
        state.mutationState = payload
    },
    setHeaderInfo(state, payload) {
        state.tbmKo = payload.tbmKo
        state.tbmEn = payload.tbmEn
        state.safetyKo = payload.safetyKo
        state.safetyEn = payload.safetyEn
    }
}