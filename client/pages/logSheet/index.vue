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
            if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
                console.log("page reload")
                this.refreshURL = sessionStorage.getItem("refreshURL")
                this.logsheetURL = this.refreshURL
            } else {
                // logsheet url에 en, hq, br seq와 wattmanager1임을 알려주는 version을 get 방식으로 보냄
                this.logsheetURL =
                    process.env.logsheetURL +
                    "?en_seq=" + localStorage.getItem("enSeq") +
                    "&hq_seq=" + localStorage.getItem("hqSeq") +
                    "&br_seq="  + localStorage.getItem("brSeq") +
                    "&version=1"
                this.refreshURL = this.logsheetURL
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
                if (url != "/wattmanager2/safetycheck") {
                    const originURL = process.env.logsheetURL.split("/")
                    this.refreshURL  = originURL[0] + "//" + originURL[2] + url
                } else {
                    this.refreshURL =
                    process.env.logsheetURL +
                    "?en_seq=" + localStorage.getItem("enSeq") +
                    "&hq_seq=" + localStorage.getItem("hqSeq") +
                    "&br_seq="  + localStorage.getItem("brSeq") +
                    "&version=1"
                }
                sessionStorage.setItem("refreshURL", this.refreshURL)
                if (this.logsheetInterval) {
                    clearInterval(this.logsheetInterval)
                }
                // iframe 높이 초기화 먼저 진행
                document.getElementById("logSheet").style.height = "auto"
                document.getElementsByClassName("mainFooter")[0].style.display = "none"
                this.logsheetInterval = setInterval(() => {
                    const test = document.getElementById("logSheet").contentWindow.document.getElementById("root")
                    const removeDiv = document.getElementById("logSheet").contentWindow.document.getElementsByClassName("sc-dIfARi eptRVp")[0]
                    removeDiv.style.height = "0%"
                    this.wattmanger2Height = test.offsetHeight + "px"
                    document.getElementById("logSheet").style.height = this.wattmanger2Height
                    document.getElementsByClassName("mainFooter")[0].style.display = "flex"
                    document.getElementsByClassName("mainFooter")[0].style.bottom = "0px"
                }, 400)
                setTimeout(() => {
                    clearInterval(this.logsheetInterval)
                }, 10000)
            }
        },
    }
</script>

<style lang="scss" scoped>
.mainWrap {
    width: 100%;
}
iframe {
    width: 100%;
    margin: 0px;
    padding: 0px;
    min-height: calc(100vh - 84px);
    background-color: #f7f7f7; 
}
</style>