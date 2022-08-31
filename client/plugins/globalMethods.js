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
    }
  }
})
