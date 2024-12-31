<template>
    <div class="row content-start video"></div>
</template>
<script>
import cookieSetting from "@/assets/scripts/data/cookie";
import { encryptData } from "../../plugins/axiosRequest";
import { axiosRequest } from "@/plugins/axiosRequest";
import axiosJson from "@/assets/jsons/axios";

export default {
    mounted() {
        this.getUrlParameter()
    },
    methods: {
        async getUrlParameter() {
            sessionStorage.removeItem('jwt');
            sessionStorage.setItem('jwt', this.$route.query.jwt);
            sessionStorage.setItem("id", this.$route.query.id)
			sessionStorage.setItem("auth", this.$route.query.auth)
			sessionStorage.setItem("hqSeq", this.$route.query.hqSeq)
			sessionStorage.setItem("enSeq", this.$route.query.enSeq)
			sessionStorage.setItem("brSeq", this.$route.query.brSeq)
			sessionStorage.setItem("logined", this.$route.query.logined)
			sessionStorage.setItem("userSeq", this.$route.query.userSeq)
			sessionStorage.setItem("deviceType", this.$route.query.deviceType)
            const enRToken =  encryptData(this.$route.query.rToken);
            this.$store.commit('token/setRToken', enRToken)
            let checkParameter = true

            // const getCookieJwt = cookieSetting.getCookie(cookieName)

            // if (getCookieJwt !== this.$route.query.jwt) {
            //     alert(this.$t("loginCheck")[0])
            //     sessionStorage.clear()
            //     this.$store.dispatch('user/logout')
            //     open("/", "_self")
            // } else {
                if (this.$route.query.lang == undefined || this.$route.query.lang == "" || this.$route.query.lang == null) {
                    checkParameter =  false
                }
                if (this.$route.query.id == undefined || this.$route.query.id == "" || this.$route.query.id == null) {
                    checkParameter =  false
                }
                if (this.$route.query.auth == undefined || this.$route.query.auth == "" || this.$route.query.auth == null) {
                    checkParameter =  false
                }
                if (this.$route.query.hqSeq == undefined || this.$route.query.hqSeq == "" || this.$route.query.hqSeq == null) {
                    checkParameter =  false
                }
                if (this.$route.query.enSeq == undefined || this.$route.query.enSeq  == "" || this.$route.query.enSeq  == null) {
                    checkParameter =  false
                }
                if (this.$route.query.brSeq == undefined || this.$route.query.brSeq == "" || this.$route.query.brSeq == null) {
                    checkParameter =  false
                }
                if (this.$route.query.logined == undefined || this.$route.query.logined == "" || this.$route.query.logined == null) {
                    checkParameter =  false
                }
                if (this.$route.query.userSeq == undefined || this.$route.query.userSeq == "" || this.$route.query.userSeq == null) {
                    checkParameter =  false
                }
                if (this.$route.query.deviceType == undefined || this.$route.query.deviceType == "" || this.$route.query.deviceType == null) {
                    checkParameter =  false
                }
                
                if (checkParameter) {
                    this.$store.dispatch('user/login', { permissionLevel:  this.$route.query.auth })
                    const currentTime = Math.floor(Date.now() / 1000)
                    if (process.env.forceLogout24 == true) {
                        const cookieName = sessionStorage.getItem("id") + "ManagerLoginTime"
                        cookieSetting.setCookie(cookieName, currentTime)
                    }
                    const linkType = this.$route.query.type
                    
                    // watt talk에서 여는 경우 로그인 정보 확인 후 attchment로 보내줌
                    if (linkType == "video") {
                        window.location.href = "attachment/video?page=1&viewType=gallery&lang=" + this.$route.query.lang
                    } else if (linkType == "mypage") {
                        window.location.href = "profile?lang=" + this.$route.query.lang
                    } else if (linkType == "memo") {
                        const params = {
                            data: {
                                en_seq: Number(this.$route.query.enSeq),
                                hq_seq: Number(this.$route.query.hqSeq),
                                br_seq: Number(this.$route.query.brSeq),
                            },
                            api: process.env.backendURL + axiosJson.app.app_powertalkweb_info
                        }
                        await axiosRequest('post', params)
                            .then((res) => {
                                if (res.data.length > 0) {
                                    const jsonAppList = res.data[0].app_detail_json
                                    const appList = JSON.parse(jsonAppList)
                                    this.setAppInfo(appList)
                                }
                                sessionStorage.setItem("init", true)
                                sessionStorage.removeItem("taskType")
                                sessionStorage.removeItem("path_name")
                                sessionStorage.removeItem("path_trans")
                                sessionStorage.setItem("taskType", 3)
                                window.location.href = "workflows?lang=" + this.$route.query.lang
                            })
                    } else if (this.$route.query.type == "profile") {
                        // 비밀번호 변경 안내 모달을 통해 접근 한 경우 내정보 > 비밀번호 변경을 실행시켜준다
                        window.open("/profile?changePsw=true", "_self")
                    } 
                } else {
                    alert(this.$t("loginCheck")[0])
                    sessionStorage.clear()
                    this.$store.dispatch('user/logout')
                    open("/", "_self")
                }
            // }
        },
        setAppInfo(appList) {
            if (appList["safetyPatrol"] == "True") {
                if (appList["safetyPatrolTitle"]) {
                    sessionStorage.setItem("safetyPatrolTitle", appList["safetyPatrolTitle"])
                    sessionStorage.setItem("safetyPatrolTitleEn", appList["safetyPatrolTitleEn"])
                } else {
                    sessionStorage.setItem("safetyPatrolTitle", `""`)
                    sessionStorage.setItem("safetyPatrolTitleEn", `""`)
                }
                if (appList["safetyPatrolTemplateID"]) {
                    sessionStorage.setItem("safetyPatrolTemplateID", appList["safetyPatrolTemplateID"])
                } else {
                    sessionStorage.setItem("safetyPatrolTemplateID", `""`)
                }
            }
            if (appList["dailyCheck"] == "True") {
                if (appList["dailyCheckTitle"]) {
                    sessionStorage.setItem("dailyCheckTitle", appList["dailyCheckTitle"])
                    sessionStorage.setItem("dailyCheckTitleEn", appList["dailyCheckTitleEn"])
                } else {
                    sessionStorage.setItem("dailyCheckTitle", `""`)
                    sessionStorage.setItem("dailyCheckTitleEn", `""`)
                }
                if (appList["dailyCheckTemplateID"]) {
                    sessionStorage.setItem("dailyCheckTemplateID", appList["dailyCheckTemplateID"])
                } else {
                    sessionStorage.setItem("dailyCheckTemplateID", `""`)
                }
            }
            if (appList["memo2"] == "True") {
                if (appList["memo2Title"]) {
                    sessionStorage.setItem("memo2Title", appList["memo2Title"])
                    sessionStorage.setItem("memo2TitleEn", appList["memo2TitleEn"])
                } else {
                    sessionStorage.setItem("memo2Title", "")
                    sessionStorage.setItem("memo2TitleEn", "")
                }
                if (appList["memo2TemplateID"]) {
                    sessionStorage.setItem("memo2TemplateID", appList["memo2TemplateID"])
                } else {
                    sessionStorage.setItem("memo2TemplateID", `""`)
                }
            }
            if (appList["tbm"] == "True") {
                if (appList["tbmTitle"]) {
                    sessionStorage.setItem("tbmTitle", appList["tbmTitle"])
                    sessionStorage.setItem("tbmTitleEn", appList["tbmTitleEn"])
                } else {
                    sessionStorage.setItem("tbmTitle", "")
                    sessionStorage.setItem("tbmTitleEn", "")
                }
                if (appList["tbmTemplateID"]) {
                    sessionStorage.setItem("tbmTemplateID", appList["tbmTemplateID"])
                } else {
                    sessionStorage.setItem("tbmTemplateID", `""`)
                }
            }
        }

    }
}
</script>