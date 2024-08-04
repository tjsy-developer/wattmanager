// safetypatrol
<template>
    <div class="mainWrap">
        <div v-if="!loading" class="col-12 row justify-center titleBar">
            <span>{{ $i18n.locale == 'ko' ? titleKo : titleEn }}</span>
        </div>
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
            data: false,
            workflow: "",
            workflowTitleEn: "",
            titleKo: "관리",
            titleEn: "management",
            loading: true
        }
    },
    beforeMount() {
        const taskType = Number(sessionStorage.getItem("taskType"))
        switch(taskType) {
            case 1:
                this.workflowTitleKo = sessionStorage.getItem("safetyPatrolTitle")
                this.workflowTitleEn = sessionStorage.getItem("safetyPatrolTitleEn")
                break
            case 2:
                this.workflowTitleKo = sessionStorage.getItem("dailyCheckTitle")
                this.workflowTitleEn = sessionStorage.getItem("dailyCheckTitleEn")
                break
            case 3:
                this.workflowTitleKo = sessionStorage.getItem("memo2Title")
                this.workflowTitleEn = sessionStorage.getItem("memo2TitleEn")
                break
            case 4:
                this.workflowTitleKo = sessionStorage.getItem("tbmTitle")
                this.workflowTitleEn = sessionStorage.getItem("tbmTitleEn")
                break
        }
    },
    mounted() {
        this.loading = true
        this.setIframeUrl()
        window.addEventListener("message", (e) => {
            console.log(e)
            const originURL = window.location.origin
            this.childData(e.data)
            // if (e.origin == originURL) {
            //     console.log(e.data)
                
            // }
        })
    },
    methods: {
        setIframeUrl() {
            let presentUrl = window.location.origin
            if (presentUrl.includes("localhost")) {
                presentUrl = "http://localhost:5000"
            }
            const type = Number(sessionStorage.getItem("taskType"))
            let initLogSheetURL
            switch(type) {
                case 1:
                    initLogSheetURL = presentUrl + "/wattmanager2/safetypatrol"
                    break
                case 2:
                    initLogSheetURL = presentUrl + "/wattmanager2/safetycheck"
                    break
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
                    this.loading = true
                } else {
                    this.loading = false
                }
                this.logsheetURL = initLogSheetURL + urlParams
                this.setSubTitle(urlParams)
            } else {
                this.loading = true
                this.setReloadedPath(logsheetIframeURL)
                this.setSubTitle(sessionStorage.getItem("path_name"))
            }
        },
        setReloadedPath(logsheetIframeURL) {
            this.logsheetURL = window.location.origin + sessionStorage.getItem("path_name")
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
            const replaceURL = url.replaceAll('&init=true', '')
            if (sessionStorage.getItem("init") == "true"|| sessionStorage.getItem("init") == null) {
                this.$nuxt.$emit("selectLoadingBar", false)
                this.loading = false
                sessionStorage.setItem("init", false)
                sessionStorage.setItem("path_name", replaceURL)
            } else {
				sessionStorage.setItem("path_name", replaceURL)
			}
            this.setSubTitle(url)
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
        },
        setSubTitle(params) {
            let taskKo = this.workflowTitleKo
            let taskEn = this.workflowTitleEn
            if (params.includes("/logsheet/template")) {
                taskKo = "템플릿"
                taskEn = "Template"
            }
            if (params.includes("/safetycheck/setting")) {
                taskKo = "TBM 세부화면"
                taskEn = "TBM Detailed screen"
            }
            if (!params.includes("/logsheet/template") && !params.includes("/safetycheck/setting")) {}
            const splitParamas = params.split("/")
            const url = splitParamas[splitParamas.length - 1]
            if (url.includes("create")) {
                this.titleKo = `${taskKo} 생성`
                this.titleEn = `${taskEn} created`
            } else if (url.includes("detail")) {
                this.titleKo = `${taskKo} 상세`
                this.titleEn = `${taskEn} details`
            } else if (url.includes("edit") || url.includes("modify") || url.includes("update")) {
                this.titleKo = `${taskKo} 수정`
                this.titleEn = `${taskEn} edit`
            } else if (url == "temp") {
                this.titleKo = `일일 ${taskKo}`
                this.titleEn = `daily ${this.workflowTitleKo}`
            } else if (url.includes("setting")) {
                this.titleKo = `${taskKo} 설정`
                this.titleEn = `${taskEn} setting`
            }
            else {
                this.titleKo = `${taskKo} 관리`
                this.titleEn = `${taskEn} Management`
            }
            this.loading = false
			if (sessionStorage.getItem("path_name")) {
				sessionStorage.setItem("init", false)
			}
        }
    },
    beforeDestroy() {
        this.loading = true
    }
}
</script>

<style lang="scss" scoped>
.mainWrap {
    width: 100%;
    background-color: rgb(250, 250, 250);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
iframe {
    width: 100%;
    margin: 0px;
    padding: 0px;
    min-height: calc(100vh - 84px);
    background-color: #f7f7f7;

}
.titleBar {
    width: 100%;
	font-size: 24px;
	font-weight: 800;
	color: white;
	background: transparent linear-gradient(180deg, #0061D1 0%, #23A3DC 100%) 0% 0% no-repeat padding-box;
    span {
	    padding: 29px 0 23px;
        @media screen and (max-width: 1554px) {
            width: calc(100% - 50px);
        }
        @media screen and (min-width: 1555px) {
            width: calc(100% - 256px);
            max-width: 1554px;
        }
    }
}	
</style>
