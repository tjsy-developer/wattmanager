// safetypatrol
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
        this.setIframeUrl()
        window.addEventListener("message", (e) => {
            const checkURL = window.location.origin.split(":")
            const originURL = window.location.origin
            if (e.origin == originURL) {
                this.childData(e.data)
            }
        })
    },
    methods: {
        setIframeUrl() {
            let presentUrl = window.location.origin
            if (presentUrl.includes("localhost")) {
                presentUrl =" https://dev.watttalk.kr:8222"
            }
            const type = Number(sessionStorage.getItem("taskType"))
            let initLogSheetURL
            switch(type) {
                case 1:
                    initLogSheetURL = presentUrl + "/wattmanager2/safetypatrol"
                    break
                case 2:
                case 4:
                    initLogSheetURL = presentUrl + "/wattmanager2/safetycheck"
                    break
                case 3:
                    initLogSheetURL = presentUrl + "/wattmanager2/memo"
                    break
            }
            
            const logsheetIframeURL = this.switchDomainURL(initLogSheetURL)
            const urlParams = this.setUrlParameter()
            if (sessionStorage.getItem("init") == "true") {
                if (!window.location.origin.includes("localhost")) {
                    this.$nuxt.$emit("selectLoadingBar", true)
                }
                this.logsheetURL = initLogSheetURL + urlParams
            } // 로그시트 첫페이지 새로고침 시
            else if (sessionStorage.getItem("init") == "false") {
            this.setReloadedPath(logsheetIframeURL)
            }
        },
        setReloadedPath(logsheetIframeURL) {
            const type = Number(sessionStorage.getItem("taskType"))
            // type 1: 안전패트롤, 2: 일일점검, 3: 메모, 4: tbm
            if (type == 1 || type == 3) {
                // 안전패트롤, 메모 reload
                this.logsheetURL = window.location.origin + sessionStorage.getItem("path_name")    
            } else if (sessionStorage.getItem("path_name") == "/wattmanager2/safetycheck") {
                // 일일점검, tbm 최초화면
                    this.logsheetURL = logsheetIframeURL +
                "?init=false"
            } else {
                // 일일점검, tbm 상세보기 화면
                this.logsheetURL = window.location.origin + sessionStorage.getItem("path_name")
            }
        },
        childData(params) {
            const url = params.current_path
            const scrollTop = params.scrollTop
            const height = params.height
            if (params == "workflow content modified") {
                this.setIframeUrl()
            }
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
