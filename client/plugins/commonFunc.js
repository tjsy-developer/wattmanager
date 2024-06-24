/* 2021.01.26 common Func :: ksh */
import Vue from "vue";

Vue.mixin({
  methods: {
    // checkLoginTime() {
    //   // 현재 시간
    //   const currentTime = Math.floor(Date.now() / 1000)

    //   // 로그인 시에 기록된 시간
    //   const loginTime = cookieSetting.getCookie("managerLoginTime")

    //   const unix24Hour = 1 * 60
    //   if (loginTime == "calling") {
    //     return
    //   } else if(loginTime == "logout") {
    //     window.dispatchEvent(new Event("forceLogoutEvent"))
    //   } else if (currentTime > loginTime + unix24Hour) {
    //     cookieSetting.deleteCookie("managerLoginTime")
    //     cookieSetting.setCookie("managerLoinTime", "logout")
    //     window.dispatchEvent(new Event("forceLogoutEvent"))
    //   }
    // }
    /**
     * 특정 도메인의 경우 iframe 도메인네임을 접속 도메인값으로 변경
     * @param url 로그시트 iframe 호출 URL 
     * @returns 변경된 iframe ULR 값
     */
    switchDomainURL(url) {
      const getURL = url;
      const checkDomains = ["kepco.watttalk.kr", "dev.watttalk.kr"];
      const currentDomain = window.location.hostname;

      let updatedRes = '';
      // 현재 도메인이 checkDomains 배열에 포함되어 있는 경우에만 URL을 변경합니다.
      if (checkDomains.includes(currentDomain)) {
        const regex = /^(https?:\/\/)([^:\/]+)(:\d+)?(.*)/;
        const match = getURL.match(regex);
        if (match) {
          const originalPort = match[3] ? match[3] : '';
          updatedRes = `${match[1]}${currentDomain}${originalPort}${match[4]}`;
        }
      } else {
        updatedRes = url;
      }

      return updatedRes ? updatedRes : url;
    },
    setUrlParameter() {
      const type = Number(sessionStorage.getItem("taskType"))
      // type => 1: 안전패트롤, 2: 일일점검, 3: 메모, 4: TBM
      let url = ""
      let templateID = ""
      let logSheetTitle = ""
      switch(type) {
        case 1:
          templateID = sessionStorage.getItem("safetyPatrolTemplateID") != `""` ? `&template_id=${sessionStorage.getItem("safetyPatrolTemplateID")}` : "&template_id="
          logSheetTitle = sessionStorage.getItem("safetyPatrolTitle")
          break
        case 2:
          templateID = sessionStorage.getItem("dailyCheckTemplateID") != `""` ? `&template_id=${sessionStorage.getItem("dailyCheckTemplateID")}` : "&template_id="
          logSheetTitle = sessionStorage.getItem("dailyCheckTitle")
          break
        case 3:
          templateID = sessionStorage.getItem("memo2TemplateID") != `""` ? `&template_id=${sessionStorage.getItem("memo2TemplateID")}` : "&template_id="
          logSheetTitle = sessionStorage.getItem("memo2Title")
          break
        case 4:
          templateID = sessionStorage.getItem("tbmTemplateID") != `""` ? `&template_id=${sessionStorage.getItem("tbmTemplateID")}` : "&template_id="
          logSheetTitle = sessionStorage.getItem("tbmTitle")
          break
      }
      if (type == 2 || type == 4) {
        url = "?en_seq=" + sessionStorage.getItem("enSeq")+
          "&hq_seq=" + sessionStorage.getItem("hqSeq")+
          "&br_seq=" + sessionStorage.getItem("brSeq") +
          "&auth=" + sessionStorage.getItem("auth") +
          "&user_id=" + sessionStorage.getItem("id") +
          "&user_name=" + sessionStorage.getItem("userName") +
          "&version=1&lang=" + sessionStorage.getItem("languageCode") +
          "&task_type=" + type
        if (sessionStorage.getItem("id") != "administrator") {
          url = url + "&iframe_title=" + logSheetTitle + templateID
        }
      } else {
        url = "?en_seq=" + sessionStorage.getItem("enSeq")+
          "&hq_seq=" + sessionStorage.getItem("hqSeq")+
          "&br_seq=" + sessionStorage.getItem("brSeq") +
          "&auth=" + sessionStorage.getItem("auth") +
          "&version=1&lang=" + sessionStorage.getItem("languageCode") +
          "&user_id=" + sessionStorage.getItem("id") +
          "&user_name=" + sessionStorage.getItem("userName") +
          "&task_type=" + type
        if (sessionStorage.getItem("id") != "administrator") {
          url = url + 
          "&iframe_title=" + logSheetTitle + templateID
        }
      }
      return url
    }
  },
});
