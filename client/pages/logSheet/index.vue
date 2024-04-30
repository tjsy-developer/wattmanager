// tbm
<template>
    <div class="mainWrap">
        <iframe ref="logsheetFrame" id="logSheet" class="iframe" :src="logsheetURL" :style="{height: wattmanger2Height}" scrolling="no"></iframe>
    </div>
</template>


<script>
import axiosJson from "@/assets/jsons/axios";

    export default {
        layout: "main",
        data () {
            return {
                logsheetURL: "",
                bodyHeight: "",
                wattmanger2Height: 0,
                refreshURL: "",
                logsheetInterval: "",
                data: false,
                logsheetTitle: "로그시트",
                templateID: ""
            }
        },
        mounted() {
            let presentUrl = window.location.origin
            if (presentUrl.includes("localhost")) {
                presentUrl =" https://dev.watttalk.kr:8222"
            }
            const initLogSheetURL = presentUrl + "/wattmanager2/safetycheck"
            const logsheetIframeURL = this.switchDomainURL(initLogSheetURL)
            const splitDomain = logsheetIframeURL.split("/")
            const logSheetDomain = splitDomain[0] + "//" + splitDomain[2]
            if (sessionStorage.getItem("init") == "true") {
                if (sessionStorage.getItem("tbmTitle")) {
                    this.logsheetTitle = sessionStorage.getItem("tbmTitle")
                } else {
                    this.logsheetTitle = "로그시트"
                }
                if (sessionStorage.getItem("tbmTemplateID")) {
                    this.templateID = sessionStorage.getItem("tbmTemplateID")
                } else {
                    this.templateID = ""
                }
                this.$nuxt.$emit("selectLoadingBar", true)
                this.logsheetURL =
                    initLogSheetURL +
                    "?en_seq=" + sessionStorage.getItem("enSeq")+
                    "&hq_seq=" + sessionStorage.getItem("hqSeq")+
                    "&br_seq=" + sessionStorage.getItem("brSeq") +
                    "&auth=" + sessionStorage.getItem("auth") +
                    "&version=1&lang=" + sessionStorage.getItem("languageCode") +
                    "&logsheetTitle=" + this.logsheetTitle +
                    "&template_id=" + this.templateID
            } // 로그시트 첫페이지 새로고침 시
            else if (sessionStorage.getItem("init") == "false" && sessionStorage.getItem("path_name") == "/wattmanager2/safetycheck") {
                this.logsheetURL = logsheetIframeURL +
                "?init=false"
            } else {
                // 로그시트 일일~ 상세보기 화면
                this.logsheetURL = logSheetDomain + sessionStorage.getItem("path_name")
                // "?init=false"
            }
            window.addEventListener("message", (e) => {
                const checkURL = logsheetIframeURL.split("/")
                const originURL = checkURL[0] + "//" + checkURL[2]
                if (e.origin == originURL) {
                    this.childData(e.data)
                }
            })
        },
        methods: {
            childData(params) {
                const url = params.current_path
                const scrollTop = params.scrollTop
                const height = params.height
                if (url) {
                    this.childPath(url)
                }
                if (height) {
                    this.calcHeight(height)
                }
                if (scrollTop) {
                    this.scrollInToTop(height)
                }
            },
            childPath(url) {
                if (sessionStorage.getItem("init") == "true"|| sessionStorage.getItem("init") == null) {
                    sessionStorage.setItem("init", false) 
                    this.$nuxt.$emit("selectLoadingBar", false)
                }
                if (url == "/wattmanager2/safetycheck") {
                    sessionStorage.setItem("path_name", url)
                    sessionStorage.setItem("init", false)
                } else {
                    sessionStorage.setItem("path_name", url)
                    sessionStorage.setItem("init", false)
                }
            },
            calcHeight(params) {
                const mainWrap = document.getElementById("__nuxt")
                mainWrap.style.overflow = "auto"
                if (params == "auto") {
					document.getElementById("logSheet").style.height = params
				} else {
					document.getElementById("logSheet").style.height = params + "px"
				}
            },
            scrollInToTop(params) {
                if (params == "auto") {
                    const mainWrap = document.getElementById("__nuxt")
                    mainWrap.style.overflow = "hidden"
                }
                document.getElementById("main").scrollIntoView({behavior: "smooth"})
            }
        },
        beforeDestroy() {
            // 등록된 eventListener의 경우 기본적인 window event여서 제거시 sideeffect가 생길 것 같아 제거하지 않음
        }
    }
</script>

<style lang="scss" scoped>
.mainWrap {
    width: 100%;
    background-color: #f7f7f7;
}
iframe {
    width: 100%;
    margin: 0px;
    padding: 0px;
    min-height: calc(100vh - 84px);
    background-color: #f7f7f7; 
}
</style>