<template>
    <iframe ref="logsheetFrame" class="iframe" :src="logsheetURL"></iframe>
</template>

<script>
    export default {
        layout: "main",
        data () {
            return {
                logsheetURL: process.env.logsheetURL
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