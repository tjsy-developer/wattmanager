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
            // logsheet url에 en, hq, br seq와 wattmanager1임을 알려주는 version을 get 방식으로 보냄
            this.logsheetURL =
                process.env.logsheetURL +
                "?en_seq=" + localStorage.getItem("enSeq") +
                "&hq_seq=" + localStorage.getItem("hqSeq") +
                "&br_seq="  + localStorage.getItem("brSeq") +
                "&version=1"
        },
    }
</script>

<style lang="scss" scoped>
iframe {
    display: block;
    width: 100%;
    height: 915px;
    margin: 0px;
    padding: 0px;
    background-color: #f7f7f7; 
}
</style>