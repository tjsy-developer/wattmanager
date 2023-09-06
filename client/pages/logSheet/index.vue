<template>
    <div class="mainWrap">
        <iframe ref="logsheetFrame" id="logSheet" class="iframe" :src="logsheetURL"></iframe>
        <button class="refreshBtn" @click="refresh()">새로고침</button>
    </div>
</template>

<script>
import footer from "@/components/main/footer"
    export default {
        layout: "main",
        components: {
            footer
        },
        data () {
            return {
                logsheetURL: "",
                bodyHeight: "",
                wattmanger2Height: 0,
                refreshURL: ""
            }
        },
        mounted() {
            document.getElementById("__nuxt").style.overflow = "hidden"
                // logsheet url에 en, hq, br seq와 wattmanager1임을 알려주는 version을 get 방식으로 보냄
            this.logsheetURL =
                process.env.logsheetURL +
                "?en_seq=" + localStorage.getItem("enSeq") +
                "&hq_seq=" + localStorage.getItem("hqSeq") +
                "&br_seq="  + localStorage.getItem("brSeq") +
                "&version=1"
            this.refreshURL = this.logsheetURL
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
                }
            },
            refresh() {
                this.logsheetURL = this.refreshURL
            }
        },
        beforeDestroy() {
            // sessionStorage.removeItem("logsheetURL")
        }
    }
</script>

<style lang="scss" scoped>
.mainWrap {
    width: 100%;
    height: 100%;
}
iframe {
    width: 100%;
    margin: 0px;
    padding: 0px;
    min-height: calc(100vh - 84px);
    background-color: #f7f7f7; 
}
.refreshBtn {
    position: absolute;
    top: 40px;
    right: 6%;
    height: 30px;
    background-color: white;
    padding: 5px;
    box-shadow: 0px 3px 10px #0000004A;
    z-index: 999;
}
</style>