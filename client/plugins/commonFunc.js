/* 2021.01.26 common Func :: ksh */
import Vue from "vue";
import cookieSetting from "@/assets/scripts/data/cookie";

Vue.mixin({
  methods: {
    checkLoginTime() {
      // 현재 시간
      const currentTime = Math.floor(Date.now() / 1000)

      // 로그인 시에 기록된 시간
      const loginTime = cookieSetting.getCookie("managerLoginTime")

      const unix24Hour = 24 * 60 * 60
      if (loginTime == "calling") {
        return
      } else if(loginTime == "logout") {
        window.dispatchEvent(new Event("forceLogoutEvent"))
      } else if (currentTime > loginTime + unix24Hour) {
        cookieSetting.deleteCookie("managerLoginTime")
        cookieSetting.setCookie("managerLoinTime", "logout")
        window.dispatchEvent(new Event("forceLogoutEvent"))
      }
    }
  },
});
