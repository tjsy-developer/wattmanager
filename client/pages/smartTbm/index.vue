<template>
    <div class="mainWrap">
        <iframe ref="smarttbmFrame" id="smarttbm" class="iframe" :src="smarttbmURL" :style="{height: wattmanger2Height}" scrolling="no"></iframe>
    </div>
</template>

<script>
    export default {
        layout: "main",
        data () {
            return {
                smarttbmURL: "",
                bodyHeight: "",
                wattmanger2Height: 0,
                refreshURL: "",
                smarttbmInterval: "",
                data: false
            }
        },
        mounted() {
            const splitDomain = process.env.smarttbmURL.split("/")
            const smarttbmDomain = splitDomain[0] + "//" + splitDomain[2]
            if (sessionStorage.getItem("init") == 'true') {
                this.$nuxt.$emit("selectLoadingBar", true)
                this.smarttbmURL =
                    process.env.smarttbmURL +
                    "?en_seq=" + sessionStorage.getItem("enSeq")+
                    "&hq_seq=" + sessionStorage.getItem("hqSeq")+
                    "&br_seq=" + sessionStorage.getItem("brSeq") +
                    "&auth=" + sessionStorage.getItem("auth") +
                    "&version=1&lang=" + sessionStorage.getItem("languageCode")
            } // 로그시트 첫페이지 새로고침 시
            else if (sessionStorage.getItem("init") == 'false' && sessionStorage.getItem("path_name") == "/wattmanager2/smarttbm") {
                this.smarttbmURL = process.env.smarttbmURL +
                "?init=false"
            } else {
                // 로그시트 일일~ 상세보기 화면
                this.smarttbmURL = smarttbmDomain + sessionStorage.getItem("path_name") +
                "?init=false"
            }
            window.addEventListener("message", (e) => {
                const checkURL = process.env.smarttbmURL.split("/")
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
                if (sessionStorage.getItem("init") == 'true'|| sessionStorage.getItem("init") == null) {
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
					document.getElementById("smarttbm").style.height = params
				} else {
					document.getElementById("smarttbm").style.height = params + "px"
				}
            },
            scrollInToTop(params) {
                if (params == "auto") {
                    const mainWrap = document.getElementById("__nuxt")
                    mainWrap.style.overflow = "hidden"
                }
                document.getElementById("main").scrollIntoView({behavior: "smooth"})
            },
        },
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