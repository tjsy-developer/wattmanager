<template>
    <iframe ref="logsheetFrame" id="logSheet" class="iframe" :src="logsheetURL"></iframe>
</template>

<script>
    export default {
        layout: "main",
        data () {
            return {
                logsheetURL: process.env.logsheetURL,
                checkLoad: false,
                checked: false
            }
        },
        mounted() {
            window.addEventListener("message", (event) => {
                if (event.origin == "http://192.168.20.66:4000") {
                    console.log("타니?")
                    this.checkLoad = true
                }
            })
        },
        computed: {
            watchLoad() {
                return this.checkLoad
            }
        },
        watch: {
            watchLoad() {
                if (!this.checked) {
                    console.log(this.checkLoad)
                    if (this.checkLoad) {
                        const iframe = document.getElementById("logSheet")
                        const params = {
                            en_seq: localStorage.getItem("enSeq"),
                            hq_seq: localStorage.getItem("hqSeq"),
                            br_seq: localStorage.getItem("brSeq")        
                        }
                        iframe.contentWindow.postMessage(params, "http://192.168.20.66:4000")
                    }
                    this.checked = true
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
iframe {
    display: block;
    width: 100%;
    height: 100vh;
    min-height: 893px;
    max-height: 936px;
    margin: 0px;
    padding: 0px;
    // overflow: hidden;
}
</style>