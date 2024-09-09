import axios from 'axios';
import jwt_decode from 'jwt-decode';
import axiosJson from '@/assets/jsons/axios';
import CryptoJS from 'crypto-js';

let jwt = null;
let rToken = null;
const key = process.env.skey
const backendUrl = process.env.backendURL

 // type은 post get 두방식. params는 api, data 2가지로 구성.
export async function axiosRequest(type, params) {
    console.log(`Func axiosRequest api: ${params.api}; type: ${type}`);

    jwt = sessionStorage.getItem('jwt');
    let response;

    // await checkCookie();

    try {
        response = await sendAxios(type, params);
    } catch {
        console.log('axiosRequestFunc err');
    }
    
    return response;
};

// type: post, get과 같은 요청 방식.
// params.api => 요청 full url; params.data => 전달할 payload;
// params.headers => jwt비교를 위해 꼭 jwt가 들어가야함 params.responseType => get방식으로 storage 접근 시 필요
async function sendAxios(type, params) {
    let result = null;
    let requestAgain = false;

    await axios({
        url: params.api,
        method: type,
        data: params.data ? params.data : '',
        headers: params.headers ? params.headers : { 'jwt': jwt },
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
        if (err.status == 401) {
            if (err.data == 'none' || err.data == 'mutated')  {
                window.$nuxt.$store.commit('token/mutateTokenState', 1);
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
};

// access token의 유효 시간이 만료된 경우 refresh token으로 access token, refresh token 다시 받아오기
export async function requestNewJwt(type, params) {
    console.log(`func request Token`);
    // 암호화된 refresh token
    rToken = window.$nuxt.$store.state.token.enRToken;
    // refresh token 복호화
    const decRToken = decryptData(rToken);

    const errorState = false;

    // 복호화에 실패한 경우
    if (!decRToken) return window.$nuxt.$store.commit('token/mutateTokenState', 1);
    
    console.log(`decode success`);

    // deviceType은 watttalk 때문에 생겼다. manager에서는 빈값 유지
    await axios
        .post(backendUrl + axiosJson.account.token_refresh, {
            refreshToken: decRToken,
            deviceType: ''
        })
        .then((res) => {
            console.log(res)
            // new access token, refresh token setting
            jwt = res.data[0];
            sessionStorage.setItem('jwt', jwt);

            // refresh_token 암호화
            const enRtoken = encryptData(res.data[1]);

            window.$nuxt$store.commit('token/setRToken', enRtoken);
            toastMessage()
        })
        .catch((error) => {
            console.log(`axios send fail. err: ${error}`);
            const err = error.response;
            if (err.status == 401) {
                console.log("!!!!!!!!!!!")
                if (err.data == 'none' || err.data == 'mutated')  {
                    console.log(`n/m`)
                    return window.$nuxt.$store.commit('token/mutateTokenState', 1);
                } else if (err.data == 'expired') {
                    console.log('e')
                    // refresh token도 만료된경우 로그아웃.
                    return window.$nuxt.$store.commit('token/mutateTokenState', 2);
                } else {
                    return  console.log(err)
                }
            }
        })
    
    if (!type && !params) return; // workflow page에서 요청이 들어온 경우

    if (errorState) return; // err인 경우 그냥 return 시킨다.
    console.log(`resend axios`);
    return await sendAxios(type, params); // 정상적으로 토큰 재발급받았을 시 기존 요청 다시 보낸다.
};

// workflow전용 jwt 확인. <- workflow는 manager-back과 직접적인 통신이 이루어 지지 않으므로 jwt 해독해서 확인
export function checkJwt() {
    let expTime; // jwt exp time
    const presentTime = Math.floor((new Date()).getTime() / 1000); // 현재 unixTime sec
    jwt = sessionStorage.getItem("jwt");
    let decodeResult = true;

    try {
        const decodeJwt = jwt_decode(jwt);
        expTime = decodeJwt.exp; // unixTime sec
    } catch {
        console.log("decode error")
        decodeResult = false;
    } finally {
        // jwt 유효시간이 지난 경우 재요청
        if (expTime < presentTime) {
            requestNewJwt();
        } else if (decodeResult == false) {
            // decode 실패시 변조 혹은 없음으로 판단 후 로그아웃
            window.$nuxt.$store.commit('token/mutateTokenState', 1);
        } else {
            // 정상임
            return;
        }
    }
};

// 와트톡과의 token 공유
function toastMessage(aj, rj) {
    const params = {
        id: sessionStorage.getItem('id'),
        at: aj,
        rt: rj
    };
    window.postMessage({ type: 'changeToken', data: params });
};

// 암호화.
export function encryptData(data) {
    console.log('function encrypt')
    let encryptData;
    try {
      encryptData = CryptoJS.AES.encrypt(data, key).toString();
      return encryptData;
    } catch (err) {
      console.log(`encrypt error: ${err.message}`);
      encryptData = false;
    }
    return encryptData;

};

// 복호화.
function decryptData(data) {
    console.log('function decrypt')
    try {
      const decryptBytes = CryptoJS.AES.decrypt(data, key);
    
      const decryptData = decryptBytes.toString(CryptoJS.enc.Utf8);

      return decryptData;
    } catch  (err) {
      // 복호화 못한 경우
      console.log(`decrypt error: ${err.message}`);
      return false;
    }
};