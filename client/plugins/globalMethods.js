import Vue from "vue"
Vue.mixin({
  methods: {
    deviceCheck() {
      // 디바이스 종류 설정
      const pcDevice = "win16|win32|win64|mac|macintel"

      // 접속한 디바이스 환경
      if (navigator.platform) {
        if (pcDevice.includes(navigator.platform.toLowerCase())) {
          return "PC"
        } else {
          return "Mobile"
        }
      }
    },
    // type: 0 <= korean; 1 <= english
    policyBtnClick() {
      const curLang = sessionStorage.getItem("languageCode")
      if (curLang == "ko") {
        window.open("/policy/korean")
      } else {
        window.open("/policy/english")
      }
    },
    operateDialog(text, type) {
      const closeParams = {
        guideDialogInfo: null,
        guideDialogType: "confirm",
        guideDialogToggle: false
      }
      const dialogInfo = {
        guideDialogInfo: text,
        guideDialogType: type,
        guideDialogToggle: true
      }
      const closeDialogEvent = new CustomEvent("closeDialog", { detail: closeParams })
      const openDialogEvent = new CustomEvent("openDialog", { detail: dialogInfo })
      if (sessionStorage.getItem("opendDialog") == "true") {
				clearTimeout(this.timer)
				window.dispatchEvent(closeDialogEvent)
				this.timer = setTimeout(() => {
					window.dispatchEvent(openDialogEvent)

					this.timer = setTimeout(() => {
						window.dispatchEvent(closeDialogEvent)
					}, 1500)
				}, 0)
			} else {
				clearTimeout(this.timer)
				window.dispatchEvent(openDialogEvent)
				this.timer = setTimeout(() => {
					window.dispatchEvent(closeDialogEvent)
				}, 1500)
			}
    },
    setTaskInfo(appList) { // 기존 ysj 개발자 코드 복사
        if (appList["safetyPatrol"] == "True") {
            if (appList["safetyPatrolTitle"]) {
                sessionStorage.setItem("safetyPatrolTitle", appList["safetyPatrolTitle"])
                sessionStorage.setItem("safetyPatrolTitleEn", appList["safetyPatrolTitleEn"])
            } else {
                sessionStorage.setItem("safetyPatrolTitle", `""`)
                sessionStorage.setItem("safetyPatrolTitleEn", `""`)
            }
            if (appList["safetyPatrolTemplateID"]) {
                sessionStorage.setItem("safetyPatrolTemplateID", appList["safetyPatrolTemplateID"])
            } else {
                sessionStorage.setItem("safetyPatrolTemplateID", `""`)
            }
        }
        if (appList["dailyCheck"] == "True") {
            if (appList["dailyCheckTitle"]) {
                sessionStorage.setItem("dailyCheckTitle", appList["dailyCheckTitle"])
                sessionStorage.setItem("dailyCheckTitleEn", appList["dailyCheckTitleEn"])
            } else {
                sessionStorage.setItem("dailyCheckTitle", `""`)
                sessionStorage.setItem("dailyCheckTitleEn", `""`)
            }
            if (appList["dailyCheckTemplateID"]) {
                sessionStorage.setItem("dailyCheckTemplateID", appList["dailyCheckTemplateID"])
            } else {
                sessionStorage.setItem("dailyCheckTemplateID", `""`)
            }
        }
        if (appList["memo2"] == "True") {
            if (appList["memo2Title"]) {
                sessionStorage.setItem("memo2Title", appList["memo2Title"])
                sessionStorage.setItem("memo2TitleEn", appList["memo2TitleEn"])
            } else {
                sessionStorage.setItem("memo2Title", "")
                sessionStorage.setItem("memo2TitleEn", "")
            }
            if (appList["memo2TemplateID"]) {
                sessionStorage.setItem("memo2TemplateID", appList["memo2TemplateID"])
            } else {
                sessionStorage.setItem("memo2TemplateID", `""`)
            }
        }
        if (appList["tbm"] == "True") {
            if (appList["tbmTitle"]) {
                sessionStorage.setItem("tbmTitle", appList["tbmTitle"])
                sessionStorage.setItem("tbmTitleEn", appList["tbmTitleEn"])
            } else {
                sessionStorage.setItem("tbmTitle", "")
                sessionStorage.setItem("tbmTitleEn", "")
            }
            if (appList["tbmTemplateID"]) {
                sessionStorage.setItem("tbmTemplateID", appList["tbmTemplateID"])
            } else {
                sessionStorage.setItem("tbmTemplateID", `""`)
            }
        }
    }
  }
})
