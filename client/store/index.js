import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const state = () => ({
    mutationState: false
})


export const  mutations = {
    setMutationState(state, payload) {
        state.mutationState = payload
    }
}