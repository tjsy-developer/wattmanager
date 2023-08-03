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
      if (localStorage.getItem("opendDialog") == "true") {
				clearTimeout(this.timer)
				window.dispatchEvent(closeDialogEvent)
				this.timer = setTimeout(() => {
					window.dispatchEvent(openDialogEvent)

					this.timer = setTimeout(() => {
						window.dispatchEvent(closeDialogEvent)
					}, 3000)
				}, 0)
			} else {
				clearTimeout(this.timer)
				window.dispatchEvent(openDialogEvent)
				this.timer = setTimeout(() => {
					window.dispatchEvent(closeDialogEvent)
				}, 3000)
			}
    }
  }
})
