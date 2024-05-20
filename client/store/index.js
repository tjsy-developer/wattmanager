import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const state = () => ({
    mutationState: false,
    safety: "",
    daily: "",
    memo2: "",
    safetyKo: "",
    safetyEn: "",
    dailyKo: "",
    dailyEn: "",
    moemo2Ko: "",
    moemo2En: "",
    tbm: "",
    tbmKo: "",
    tbmEn: ""
})


export const  mutations = {
    setMutationState(state, payload) {
        state.mutationState = payload
    },
    setHeaderInfo(state, payload) {
        state.safety= payload.safety
        state.daily = payload.daily
        state.memo2 = payload.memo2
        state.tbm = payload.tbm
        
        state.safetyKo = payload.safetyKo
        state.safetyEn = payload.safetyEn
        
        state.dailyKo = payload.dailyKo
        state.dailyEn = payload.dailyEn

        state.moemo2Ko = payload.moemo2Ko
        state.moemo2En = payload.moemo2En

        state.tbmKo = payload.tbmKo
        state.tbmEn = payload.tbmEn
    }
}