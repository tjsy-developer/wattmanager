import createPersistedState from 'vuex-persistedstate';

export default ({ store }) => {
    if (process.client) {
         createPersistedState({
            key: 'permission', // 키를 지정합니다. 기본값 'vuex'입니다.
            storage: process.client ? window.sessionStorage : null, // 클라이언트 측 저장소 설정
        })(store);
    }
};