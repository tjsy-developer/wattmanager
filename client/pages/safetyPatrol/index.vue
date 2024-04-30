<template>
    <div class="mainWrap">
        <iframe ref="logsheetFrame" id="logSheet" class="iframe" :src="logsheetURL" :style="{height: wattmanger2Height}" scrolling="no"></iframe>
    </div>
</template>


<script>
export default {
    layout: "main",
    data () {
        return {
            logsheetURL: "",
            bodyHeight: "",
            wattmanger2Height: 0,
            refreshURL: "",
            logsheetInterval: "",
            data: false
        }
    },
    mounted() {
        let presentUrl = window.location.origin
        let templateID
        let logSheetTitle
        if (presentUrl.includes("localhost")) {
            presentUrl =" https://dev.watttalk.kr:8222"
            templateID = "safetypatrolKC"
            logSheetTitle = "안전패트롤"
        } else {
            templateID = sessionStorage.getItem("safetypatrolTemplateID")
            logSheetTitle = sessionStorage.getItem("safetypatrolTitle")
        }

        
        const initLogSheetURL = presentUrl + "/wattmanager2/safetypatrol"
        const logsheetIframeURL = this.switchDomainURL(initLogSheetURL)
        const splitDomain = logsheetIframeURL.split("/")
        const logSheetDomain = splitDomain[0] + "//" + splitDomain[2]
        if (sessionStorage.getItem("init") == "true") {
            this.$nuxt.$emit("selectLoadingBar", true)
            this.logsheetURL =
                initLogSheetURL +
                "?en_seq=" + sessionStorage.getItem("enSeq")+
                "&hq_seq=" + sessionStorage.getItem("hqSeq")+
                "&br_seq=" + sessionStorage.getItem("brSeq") +
                "&auth=" + sessionStorage.getItem("auth") +
                "&version=1&lang=" + sessionStorage.getItem("languageCode") +
                "&logsheetTitle=" + logSheetTitle + "&template_id=" +  templateID +
                "&user_id=" + sessionStorage.getItem("id") +
                "&user_name=" + sessionStorage.getItem("userName")
        } // 로그시트 첫페이지 새로고침 시
        else if (sessionStorage.getItem("init") == "false") {
            this.logsheetURL = window.location.origin + sessionStorage.getItem("path_name")
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
                sessionStorage.setItem("path_name", url)
            } else {
				sessionStorage.setItem("path_name", url)
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