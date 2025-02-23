/* eslint-disable no-undef */
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const strict = false
export const state = () => ({
	enRToken: null,
    tokenState: 0, // 0: 정상; 1: 변조 || 없음; 2: 만료;
    tokenType: 0, // 0: default. 1: call,
    expiredToken: false
})


export const mutations = {
    setTokenState(state, payload) {
        state.expiredToken = payload
    }, // 무슨 용도인지는 모르겠으나 index.js에서 store 모듈화하기위해 위치 변경
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

export const getters = {}
export const actions = {}

