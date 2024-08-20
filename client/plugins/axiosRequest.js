import axios from 'axios';
import Vue from "vue";
import jwt_decode from 'jwt-decode';
import axiosJson from '@/assets/jsons/axios';

Vue.mixin({
    data() {
        return {
            backendUrl: process.env.backendURL,
            jwt: null,
            rToken: null
        }
    },
    methods: {
        // type은 post get 두방식. params는 api, data 2가지로 구성.
        async axiosRequest(type, params) {
            console.log(`Func axiosRequest api: ${params.api}; type: ${type}`);

            this.jwt = sessionStorage.getItem('jwt');
            let response;

            await this.checkCookie();

            try {
                response = await this.sendAxios(type, params);
            } catch {
                console.log('axiosRequestFunc err');
            } finally {
                return response;
            }
        },

        // type: post, get과 같은 요청 방식.
        // params.api => 요청 full url; params.data => 전달할 payload;
        // params.headers => jwt비교를 위해 꼭 jwt가 들어가야함 params.responseType => get방식으로 storage 접근 시 필요
        async sendAxios(type, params) {
            let result = null;
            let requestAgain = false;

            await this.$axios({
                url: params.api,
                method: type,
                data: params.data ? params.data : '',
                headers: params.headers ? params.headers : { 'jwt': this.jwt },
                responseType: params.responseType ? params.responseType :'',
                timeout: 4000
            })
            .then((res) => {
                console.log(`axios send success`);
                result = res;
            })
            .catch((error) => {
                console.log(`axios send fail. err: ${error}`);
                const err = error.response;
                if (err.status == '401') {
                    if (err.data == 'none' || err.data == 'mutated')  {
                        this.$store.commit('token/mutateTokenState', 1);
                        return;
                    } else if (err.data == 'expired') {
                        requestAgain = true;
                    } else {
                        result = err;
                    }
                }
            })

            if (requestAgain) {
                result = await requestNewJwt(type, params);
            }

            return result;
        },

        // access token의 유효 시간이 만료된 경우 refresh token으로 access token, refresh token 다시 받아오기
        async requestNewJwt(type, params) {
            console.log(`func request Token`);
            // 암호화된 refresh token
            this.rToken = this.$store.state.token.enRToken;
            // refresh token 복호화
            const decRToken = await this.decryptData(this.rToken);

            const errorState = false;

            this.checkJwt(decRToken)

            // 복호화에 실패한 경우
            if (!decRToken) return this.$store.commit('token/mutateTokenState', 1);
        
            await axios
                .post(this.backendUrl + axiosJson.account.token_refresh, {
                    refreshToken: decRToken,
                    token_type: 'default'
                })
                .then((res) => {
                    // new access token, refresh token setting
                    this.jwt = res.accessToken;
                    sessionStorage.setItem('jwt', this.jwt);

                    // refresh_token 암호화
                    const enRtoken = this.encryptData(res.refreshToken);

                    this.$store.commit('token/setRToken', enRtoken);

                    this.setTokenCookie();
                })
                .catch((error) => {
                    errorState = true;
                    console.log(`token refresh err: ${error}`);
                    const err = error.response;
                    if (err.status == 401) {
                        if (err.data == 'none' || err.data == 'mutated') {
                            this.$store.commit('token/mutateTokenState', 1);
                        } else if (err.data == 'expired') {
                            // refresh token도 만료된경우 로그아웃.
                            this.$store.commit('token/mutateTokenState', 2);
                        }
                    }
                })
            
            if (!type && !params) return; // workflow page에서 요청이 들어온 경우

            if (errorState) return; // err인 경우 그냥 return 시킨다.

            return await this.sendAxios(type, params); // 정상적으로 토큰 재발급받았을 시 기존 요청 다시 보낸다.
        },

        // 와트톡과의 token 공유를 위하여.
        async setTokenCookie() {
            if (this.jwt == null) this.jwt = sessionStorage.getItem('jwt')
            // access totken 암호화 refresh token은 이미 암호화해서 저장시켜둠.
            const enAToken = await this.encryptData(this.jwt);
            const enRToken = this.$store.state.token.enRToken;

            // 암호화된 access token, refresh token cookie에 저장.
            setCookie(`${sessionStorage.getItem('id')}enAToken`, enAToken);
            setCookie(`${sessionStorage.getItem('id')}enRToken`, enRToken);
        },

        // axios 요청 전에, watttalk에서 신규로 발급받은 token이 있는지 확인!
        checkCookie() {
            // cookie에 없는 경우 비교할 필요 x return true
            if (!getCookie(`${sessionStorage.getItem('id')}enAToken`) && !getCookie(`${sessionStorage.getItem('id')}enRToken`)) return true;

            const enAToken = getCookie(`${sessionStorage.getItem('id')}enAToken`);
            const enRToken = getCookie(`${sessionStorage.getItem('id')}enRToken`);
            // access token은 vue에서는 복호화된 것을 저장되나, cookie에는 암호화가 올라가기 때문에 복호화 해줌.
            const deAToken = this.decryptData(enAToken)

            // 복호화 실패시
            if (!deAToken) return this.$store.commit('token/mutateTokenState', 1);

            // 쿠키 저장 값과 내 저장값을 비교 후 동일한 경우는 처리 불필요.
            // 다른 경우 -> talk에서 신규 발급받은 경우!
            if (deAToken !== this.jwt && enRToken !== this.$store.state.token.enRToken) {
                this.jwt = deAToken;
                sessionStorage.setItem('jwt', deAToken);
                deleteCookie(`${sessionStorage.getItem('id')}enAToken`);

                
                this.$store.commit('token/setRToken', enRToken);
                deleteCookie(`${sessionStorage.getItem('id')}enRToken`);
            }
            
            return true;
        },
        // workflow전용 jwt 확인. <- workflow는 manager-back과 직접적인 통신이 이루어 지지 않으므로 jwt 해독해서 확인
        checkJwt() {
            const self = this;
            let expTime; // jwt exp time
            const presentTime = Math.floor((new Date()).getTime() / 1000); // 현재 unixTime sec
            this.jwt = sessionStorage.getItem("jwt");
            let decodeResult = true;

            try {
                const decodeJwt = jwt_decode(this.jwt);
                expTime = decodeJwt.exp; // unixTime sec
            } catch {
                console.log("decode error")
                decodeResult = false;
            } finally {
                // jwt 유효시간이 지난 경우 재요청
                if (expTime < presentTime) {
                    this.requestNewJwt();
                } else if (decodeResult == false) {
                    // decode 실패시 변조 혹은 없음으로 판단 후 로그아웃
                    this.$store.commit('token/mutateTokenState', 1);
                } else {
                    // 정상임
                    return;
                }
            }
        }
    }
})

// assets/scripts/data/cookie의 내용을 못 가여와서 해당 파일 내용 복제.
/* 쿠키 저장함수 (쿠키이름, 쿠키저장변수값, 쿠키유효기간설정) */
function setCookie(cookieName, cookieValue, exdays) {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + exdays)
    const value =
        escape(cookieValue) +
        (exdays == null ? "" : "; expires= " + exdate.toUTCString())
    console.log(value)
    document.cookie = cookieName + "=" + value
}

    /* 저장된 쿠키값 불러오는 함수 (쿠키이름) */
function getCookie(cookieName) {
    let i
    let x
    let y
    const ARRcookies = document.cookie.split(";")
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="))
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1)
        x = x.replace(/^\s+|\s+$/g, "")

        if (x === cookieName) {
        return unescape(y)
        }
    }
}

    /* 저장된 쿠키값 삭제하는 함수 (쿠키이름) */
function deleteCookie(cookieName) {
    const date = new Date()
    date.setDate(date.getDate() - 100)
    const Cookie = cookieName + "=; expires= " + date.toUTCString()
    document.cookie = Cookie
}
