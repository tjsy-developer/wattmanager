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
                logsheetInterval: ""
            }
        },
        mounted() {
            const splitDomain = process.env.logsheetURL.split("/")
            console.log(splitDomain)
            const logSheetDomain = splitDomain[0] + "//" + splitDomain[2]
            if (sessionStorage.getItem("init") == 'true') {
                this.$nuxt.$emit("selectLoadingBar", true)
                this.logsheetURL =
                    process.env.logsheetURL +
                    "?en_seq=" + localStorage.getItem("enSeq")+
                    "&hq_seq=" + localStorage.getItem("hqSeq")+
                    "&br_seq=" + localStorage.getItem("brSeq") +
                    "&version=1"

            } // 로그시트 첫페이지 새로고침 시
            else if (sessionStorage.getItem("init") == 'false' && sessionStorage.getItem("path_name") == "/wattmanager2/safetycheck") {
                this.logsheetURL = logSheetDomain + sessionStorage.getItem("path_name") +
                "?init=false"
            } else {
                // 로그시트 일일~ 상세보기 화면
                this.logsheetURL = logSheetDomain + sessionStorage.getItem("path_name") +
                "?init=false"
            }
            window.addEventListener("message", (e) => {
                const checkURL = process.env.logsheetURL.split("/")
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
                if (url) {
                    this.childPath(url)
                }
                if (scrollTop) {
                    this.scrollInToTop()
                }
            },
            childPath(url) {
                if (sessionStorage.getItem("init") == 'true'|| sessionStorage.getItem("init") == null) {
                    sessionStorage.setItem("init", false) 
                    this.$nuxt.$emit("selectLoadingBar", false)
                } else if (url == "/wattmanager2/safetycheck") {
                    sessionStorage.setItem("path_name", url)
                    sessionStorage.setItem("init", false)
                } else {
                    sessionStorage.setItem("path_name", url)
                    sessionStorage.setItem("init", false)
                }
                this.calcHeight()
            },
            calcHeight() {
                if (this.logsheetInterval) {
                    clearInterval(this.logsheetInterval)
                }
                // iframe 높이 초기화 먼저 진행
                document.getElementById("logSheet").style.height = "auto"
                document.getElementsByClassName("mainFooter")[0].style.display = "none"
                // wattmanager2의 data가 많은 경우 data를 전부 가져 오기 전에 높이를 구해 버린다. 이를 방지하기 위해 계속 체크해준다
                this.logsheetInterval = setInterval(() => {
                    const wattmanager2MainWrap = document.getElementById("logSheet").contentWindow.document.getElementById("root")
                    const wattmanager2BottomDiv = document.getElementById("logSheet").contentWindow.document.getElementsByClassName("sc-dIfARi eptRVp")[0]
                    // wattmanager2BottomDiv height 10vh를 덮어 씌움
                    wattmanager2BottomDiv.style.height = "40px"
                    // wattmanager2에서 min-height 10vh로 지정한거를 덮어 씌움
                    wattmanager2BottomDiv.style.minHeight = "40px"
                    this.wattmanger2Height = wattmanager2MainWrap.offsetHeight + "px"
                    document.getElementById("logSheet").style.height = this.wattmanger2Height
                    document.getElementsByClassName("mainFooter")[0].style.display = "flex"
                    document.getElementsByClassName("mainFooter")[0].style.bottom = "0px"
                }, 400)
                setTimeout(() => {
                    clearInterval(this.logsheetInterval)
                }, 20000)
            },
            scrollInToTop() {
                document.getElementsByClassName("mainWrap")[0].scrollIntoView({behavior: "smooth"})
            },
        },
        beforeDestroy() {
            if (this.logsheetInterval) {
                clearInterval(this.logsheetInterval)
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