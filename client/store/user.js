// store/index.js
export const state = () => ({
    isAuthenticated: false,
    permissionLevel: undefined // 사용자의 권한 레벨 (기본값은 0)
})

export const mutations = {
    setAuthenticated(state, payload) {
        state.isAuthenticated = payload
    },
    setPermissionLevel(state, payload) {
        state.permissionLevel = Number(payload)
  }
}

export const actions = {
    login({ commit }, { permissionLevel }) {
        // 로그인 로직 수행 후, 사용자 권한 레벨 설정
        commit('setAuthenticated', true)
        commit('setPermissionLevel', permissionLevel)
    },
    logout({ commit }) {
        commit('setAuthenticated', false)
        commit('setPermissionLevel', undefined)
    }
}