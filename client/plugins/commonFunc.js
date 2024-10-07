/* 2021.01.26 common Func :: ksh */
import Vue from "vue";
import { axiosRequest } from "./axiosRequest";

Vue.mixin({
  methods: {
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
      url = "?en_seq=" + sessionStorage.getItem("enSeq") +
          "&hq_seq=" + sessionStorage.getItem("hqSeq") +
          "&br_seq=" + sessionStorage.getItem("brSeq") +
          "&auth=" + sessionStorage.getItem("auth") +
          "&user_id=" + sessionStorage.getItem("id") +
          "&user_name=" + sessionStorage.getItem("userName") +
          "&version=1&lang=" + sessionStorage.getItem("languageCode") +
          "&task_type=" + type + 
          "&lang=" + sessionStorage.getItem("languageCode")
      if (sessionStorage.getItem('init')) {
        url = url + '&init=true'
      }
      if (sessionStorage.getItem("id") != "administrator") {
        url = url + "&iframe_title=" + logSheetTitle + templateID
      }
      return url
    },
    isValidPassword(value) {
      const rulesType = Number(process.env.pwdRulesType)
      let passwordRegex
      switch (rulesType) {
        case 0:
          passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{10,}$/;
          return passwordRegex.test(value)
        case 1:
          passwordRegex = /^.{10,}$/
          return passwordRegex.test(value)
        case 2:
          passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/
          return passwordRegex.test(value)
        case 3:
          passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/; 
          return passwordRegex.test(value)
        default:
          return true
      }
    },
    async convertImageToBlob(src) {
      try {
        const result = await axios
          .get(
            src + `?token=${sessionStorage.getItem("jwt")}`,
            {
              timeout: 4000,
              responseType: "blob",
            }
        )
        let blobURL = ''
        if (result.status === 200) {
          blobURL = URL.createObjectURL(result.data)
        }
        return blobURL
      } catch (err) {
        console.log(err)
        return ''
      }
      
    }
  },
});
