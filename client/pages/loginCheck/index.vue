<template>
    <div class="row content-start video"></div>
</template>
<script>
import cookieSetting from "@/assets/scripts/data/cookie";

export default {
    mounted() {
        this.getUrlParameter()
    },
    methods: {
        getUrlParameter() {
            sessionStorage.setItem("id", this.$route.query.id)
			sessionStorage.setItem("auth", this.$route.query.auth)
			sessionStorage.setItem("hqSeq", this.$route.query.hqSeq)
			sessionStorage.setItem("enSeq", this.$route.query.enSeq)
			sessionStorage.setItem("brSeq", this.$route.query.brSeq)
			sessionStorage.setItem("logined", this.$route.query.logined)
			sessionStorage.setItem("userSeq", this.$route.query.userSeq)
			sessionStorage.setItem("deviceType", this.$route.query.deviceType)
            let checkParameter = true
            
            const cookieName = this.$route.query.id + "jwt"

            const getCookieJwt = cookieSetting.getCookie(cookieName)

            if (getCookieJwt !== this.$route.query.jwt) {
                alert(this.$t("loginCheck")[0])
                sessionStorage.clear()
                this.$store.dispatch('user/logout')
                open("/", "_self")
            } else {
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
                    // watt talk에서 여는 경우 로그인 정보 확인 후 attchment로 보내줌
                    if (this.$route.query.type == "video") {
                        window.location.href = "attachment/video?page=1&viewType=gallery&lang=" + this.$route.query.lang
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
            }
        }
    }
}
</script>