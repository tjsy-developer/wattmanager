/* eslint-disable no-undef */
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const strict = false
export const state = () => ({
	enRToken: null,
    tokenState: 0, // 0: 정상; 1: 변조 || 없음; 2: 만료;
    tokenType: 0 // 0: default. 1: call
})


export const mutations = {
    setRToken(state, payload) {
        console.log(`set enRToken`)
        state.enRToken = payload;
    },
    mutateTokenState(state, payload) {
        state.tokenState = payload;
    },
    setTokenType(state, payload) {
        state.tokenType = payload;
    },
    initToken(state) {
        state.enRToken = null;
        state.tokenState = 0;
        state.tokenType = 0;
    }
}

