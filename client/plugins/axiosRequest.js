import axios from 'axios';
import Vue from "vue";
import jwt_decode from 'jwt-decode';

Vue.mixin({
    data() {
        return {
            backendUrl: process.env.backendUrl,
            jwt: sessionStorage.getItem(jwt)
        }
    },
    methods: {
       async axiosRequest(type, params) {
            let response = null;
            switch(type) {
                case 'post':
                    response = await axiosPost(params);
                    break;
                case 'get':
                    response = await axiosGet(params);
                    break;
            }
            return response;
        }
    }
})

async function axiosPost(params) {
    const result = await
        axios.post(
            backendUrl + params.api,
            params.data
        )
        .then((res) => {
            if (res.jwtResult == 'mutated') {
                alert('변조됨')
                return;
            } else if (res.jwtResult == 'expired') {
                console.log('만료됨');
                requestNewJwt();
            } else {
                res
            }
        })
        .catch((err) => {
            console.log(`axios Post error: ${err}`)
        })
    return result
};

async function axiosGet(params) {
    const result = await
        axios.get(
            params
        )
        .then((res) => {
            if (res.jwtResult == 'mutated') {
                alert('변조됨')
                return;
            } else if (res.jwtResult == 'expired') {
                console.log('만료됨');
                requestNewJwt(params);
            } else {
                res
            }
        })
        .catch((err) => {
            console.log(`axios Post error: ${err}`)
        })
};

async function requestNewJwt() {};