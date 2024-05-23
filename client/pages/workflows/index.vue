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
                } else {
                    this.loading = false
                }
                this.logsheetURL = initLogSheetURL + urlParams
                this.setSubTitle(urlParams)
            } // 로그시트 첫페이지 새로고침 시
            else if (sessionStorage.getItem("init") == "false") {
                this.setReloadedPath(logsheetIframeURL)
                this.setSubTitle(sessionStorage.getItem("path_name"))
            }
        },
        setReloadedPath(logsheetIframeURL) {
            const type = Number(sessionStorage.getItem("taskType"))
            // type 1: 안전패트롤, 2: 일일점검, 3: 메모, 4: tbm
            if (type == 1 || type == 3) {
                // 안전패트롤, 메모 reload
                this.logsheetURL = window.location.origin + sessionStorage.getItem("path_name")    
            } else {
                if (!sessionStorage.getItem("path_name").includes("/temp") && !sessionStorage.getItem("path_name").includes("/setting") && !sessionStorage.getItem("path_name").includes("/logsheet/template")) {
                    // 일일점검, tbm 최초화면
                        this.logsheetURL = logsheetIframeURL +
                    "?init=false"
                } else {
                    // 일일점검, tbm 상세보기 화면
                    this.logsheetURL = window.location.origin + sessionStorage.getItem("path_name")
                }
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
                this.loading = false
                sessionStorage.setItem("path_name", url)
            } else {
				sessionStorage.setItem("path_name", url)
			}
            this.setSubTitle(url)
			this.loading = false
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
            if (params.includes("/logsheet/template")) {
                this.workflowTitleKo = "템플릿"
                this.workflowTitleEn = "Template"
            }
            if (params.includes("/safetycheck/setting")) {
                this.workflowTitleKo = "TBM 세부화면"
                this.workflowTitleEn = "TBM Detailed screen"
            }
            const splitParamas = params.split("/")
            const url = splitParamas[splitParamas.length - 1]
            if (url.includes("create")) {
                this.titleKo = `${this.workflowTitleKo} 생성`
                this.titleEn = `${this.workflowTitleEn} created`
            } else if (url.includes("detail")) {
                this.titleKo = `${this.workflowTitleKo} 상세`
                this.titleEn = `${this.workflowTitleEn} details`
            } else if (url.includes("edit") || url.includes("modify") || url.includes("update")) {
                this.titleKo = `${this.workflowTitleKo} 수정`
                this.titleEn = `${this.workflowTitleEn} edit`
            } else if (url == "temp") {
                this.titleKo = `일일 ${this.workflowTitleKo}`
                this.titleEn = `daily ${this.workflowTitleKo}`
            } else if (url.includes("setting")) {
                this.titleKo = `${this.workflowTitleKo} 설정`
                this.titleEn = `${this.workflowTitleKo} setting`
            }
            else {
                this.titleKo = `${this.workflowTitleKo} 관리`
                this.titleEn = `${this.workflowTitleKo} Management`
            }
            this.loading = false
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
