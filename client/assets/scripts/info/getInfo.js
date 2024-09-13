import axios from "axios"
import { axiosRequest } from "../../../plugins/axiosRequest"
// eslint-disable-next-line no-unused-vars


const getInfo = {
  setLang(lang) {
    getInfo.enterpriseCompData.placeholder = lang[0]
    getInfo.enterpriseCompData.selectedText = lang[0]
    getInfo.hqCompData.placeholder = lang[1]
    getInfo.hqCompData.selectedText = lang[1]
    getInfo.branchCompData.placeholder = lang[2]
    getInfo.branchCompData.selectedText = lang[2]
    getInfo.appCodeCompData.placeholder = lang[3]
    getInfo.appCodeCompData.selectedText = lang[3]
    getInfo.authority.placeholder = lang[4]
    getInfo.authority.selectedText = lang[4]
    for (let i = 0; i < getInfo.authority.options.length; i++) {
      getInfo.authority.options[i].text = lang[i + 5]
    }
    // getInfo.authority.options[0].text = lang[5]
    // getInfo.authority.options[1].text = lang[6]
    // getInfo.authority.options[2].text = lang[7]
    // getInfo.authority.options[3].text = lang[8]
    getInfo.authority.selectedText = getInfo.authority.options[0]
    getInfo.permission.placeholder = lang[9]
    getInfo.permission.selectedText = lang[9]
    getInfo.permission.options[0].text = lang[10]
    getInfo.permission.options[1].text = lang[11]
    getInfo.permission.selectedText = getInfo.permission.options[0]
    // const token = sessionStorage.getItem("jwt")
    getInfo.enList.placeholder = lang[12]
    getInfo.enList.selectedText = lang[12]
    getInfo.hqList.placeholder = lang[13]
    getInfo.hqList.selectedText = lang[13]
    getInfo.brList.placeholder = lang[14]
    getInfo.brList.selectedText = lang[14]
  },
  async enterprise() {
    const response = await axiosRequest('post', {api: process.env.backendURL + "accountRest/en_list", headers: ''})
      .then(function(res) {
        const result = []
        for (let i = 0; i < res.data.length; i++)
          result.push({
            text: res.data[i].alias,
            en_text: res.data[i].alias_en,
            value: res.data[i].en_seq
          })
        return result
      })
      .catch(function(error) {
        console.log(error)
      })
    return response
  },
  async hq(enSeq) {
    const response = await axiosRequest('post', {api: process.env.backendURL + "accountRest/hq_list", data: {en_seq: enSeq}, headers: ''})
    .then(function(res) {
      const result = []
      for (let i = 0; i < res.data.length; i++)
        result.push({
          text: res.data[i].alias,
          en_text: res.data[i].alias_en,
          value: res.data[i].en_seq
        })
      return result
    })
    .catch(function(error) {
      console.log(error)
    })
    return response
  },
  async branch(hqSeq) {
    const response = await axiosRequest('post', {api: process.env.backendURL + "accountRest/br_list", data: {hq_seq: hqSeq}, headers: ''})
      .then(function(res) {
        const result = []
        for (let i = 0; i < res.data.length; i++)
          result.push({
            text: res.data[i].alias,
            en_text: res.data[i].alias_en,
            value: res.data[i].en_seq
          })
        return result
      })
      .catch(function(error) {
        console.log(error)
      })
    return response
  },
  async appCode() {
    const response = await axiosRequest('post', {api: process.env.backendURL + "appRest/app_code_list", data: {jwt: sessionStorage.getItem("jwt")}})
      .then(function(res) {
        const result = []
        for (let i = 0; i < res.data.length; i++)
          result.push({
            text: res.data[i].app_name,
            en_text: res.data[i].app_name,
            value: res.data[i].app_code_seq
          })
        console.log()
        return result
      })
      .catch(function(error) {
        console.log(error)
      })
    return response
  },
  /**
   * powertalkweb 앱 정보 설정 값
   * @param {{ en_seq: number, hq_seq: number, br_seq: number}} params 
   * @returns 
   */
  async appSetting(params) {
    const response = await axiosRequest('post', {api: process.env.backendURL + "appRest/app_powertalkweb_info", data: {...params}})
      .then(function (res) {
        return res.data?.[0]?.app_detail_json || {}
      })
      .catch(function(error) {
        console.log(error)
        return {}
      })
        .finally()
    return response
  },
  deviceType() {
    return ["PC", "Mobile", "Glass"]
  },
  deviceTypeObj() {
    return [
      { text: "PC", en_text: "PC", value: 3 },
      { text: "Glass", en_text: "Glass", value: 2 }
    ]
  },
  enterpriseCompData: {
    placeholder: "기업 선택",
    options: undefined,
    selectedText: undefined,
    selectedValue: undefined,
    change(e) {
      getInfo.hq(this.selectedValue).then(res => {
        getInfo.hqCompData.options = res
        getInfo.branchCompData.options = undefined
      })
    }
  },
  enList: {
    placeholder: "기업 선택",
    options: undefined,
    selectedText: undefined,
    selectedValue: undefined,
    change(e) {
      getInfo.hq(this.selectedValue).then(res => {
        getInfo.hqList.options = res
        getInfo.brList.options = undefined
      })
    }
  },
  hqCompData: {
    placeholder: "본부 선택",
    options: undefined,
    selectedText: undefined,
    selectedValue: undefined,
    change(e) {
      getInfo.branch(this.selectedValue).then(res => {
        getInfo.branchCompData.options = res
      })
    }
  },
  hqList: {
    placeholder: "본부 선택",
    options: undefined,
    selectedText: undefined,
    selectedValue: undefined,
    change(e) {
      getInfo.branch(this.selectedValue).then(res => {
        getInfo.brList.options = res
      })
    }
  },
  branchCompData: {
    placeholder: "지사 선택",
    options: undefined,
    selectedText: undefined,
    selectedValue: undefined
  },
  brList: {
    placeholder: "지사 선택",
    options: undefined,
    selectedText: undefined,
    selectedValue: undefined
  },
  appCodeCompData: {
    placeholder: "앱 코드 선택",
    options: undefined,
    selectedText: undefined,
    selectedValue: undefined
  },
  authority: {
    placeholder: "권한 선택",
    options: [
      { text: "사용자", value: 0 },
      { text: "지사 관리자", value: 1 },
      { text: "본부 관리자", value: 2 },
      { text: "기업 관리자", value: 3 }
    ],
    selectedText: undefined,
    selectedValue: undefined
  },
  permission: {
    placeholder: "승인 여부 선택",
    options: [
      { text: "미승인", value: 0 },
      { text: "승인", value: 1 }
    ],
    selectedText: undefined,
    selectedValue: undefined
  },
  setAuthority() {
    const authority = window.sessionStorage.getItem("auth")
    if (authority < 4) {
      getInfo.enterpriseCompData.disabled = true
      getInfo.authority.options.splice(3)
    }
    if (authority < 3) {
      getInfo.hqCompData.disabled = true
      getInfo.authority.options.splice(2)
    }
    if (authority < 2) {
      getInfo.branchCompData.disabled = true
      getInfo.authority.options.splice(1)
    }
  },
  getInputValue(index) {
    return document.querySelectorAll("input")[index]?.value
  },
  getTextareaValue(index) {
    return document.querySelectorAll("textarea")[index].value
  },
  getSelectValue(listFilters, index) {
    return listFilters[index].selectCompData.selectedValue
  }
}

export default getInfo
