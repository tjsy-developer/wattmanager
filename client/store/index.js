import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const state = () => ({
    mutationState: false,
    prevUrl: undefined,
    expiredToken: false
})


export const  mutations = {
    setMutationState(state, payload) {
        state.mutationState = payload
    },
    setPrevUrl(state, payload) {
        state.prevUrl = payload
    },
    setTokenState(state, payload) {
        state.expiredToken = payload
    }
}