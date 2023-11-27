import axios from "axios"
import axiosJson from "@/assets/jsons/axios"
import { param } from "jquery"

const btnsClick = {
  lang: [
    "생성 완료",
    "생성 실패",
    "내용을 모두 입력해 주세요.",
    "수정 완료",
    "수정 실패",
    "삭제 완료",
    "삭제 실패",
    "할당량 초과"
  ],
  setLang(lang) {
    btnsClick.lang = lang
  },
  create(listFilters, path, params) {
    const getInput = document.querySelectorAll("input")
    try {
      for (let i = 0; i < listFilters.length; i++) {
        if (listFilters[i].edit === "select") {
          if (!listFilters[i].selectCompData.selectedValue)
            // eslint-disable-next-line no-throw-literal
            throw "listFilters undefined"
        }
      }
      for (let i = 0; i < getInput.length; i++) {
        // eslint-disable-next-line no-throw-literal
        if (!getInput[i].value) throw "input undefined"
      }
      axios
        .post(path, params)
        .then(function(res) {
          if (res.data) {
            alert(btnsClick.lang[0])
            sessionStorage.removeItem("deviceType")
            sessionStorage.removeItem("check2Factor")
            window.location.href = document.referrer
          } else alert(btnsClick.lang[1])
        })
        .catch(function(error) {
          console.log("createBtnClick.js edit axios error : ", error)
          alert(btnsClick.lang[1])
        })
    } catch (editError) {
      if (
        editError === "listFilters undefined" ||
        editError === "input undefined"
      )
        alert(btnsClick.lang[2])
      else {
        console.log("createBtnClick.js edit function error : ", editError)
        alert(btnsClick.lang[1])
      }
    }
  },
  edit(listFilters, path, params) {
    const getInput = document.querySelectorAll("input")
    try {
      for (let i = 0; i < listFilters.length; i++) {
        if (listFilters[i].edit === "select") {
          if (!listFilters[i].selectCompData.selectedValue)
            // eslint-disable-next-line no-throw-literal
            throw "listFilters undefined"
        }
      }
      for (let i = 0; i < getInput.length; i++) {
        // eslint-disable-next-line no-throw-literal
        if (!getInput[i].value) throw "input undefined"
      }

      axios
        .post(path, params)
        .then(function(res) {
          if (res.data) {
            alert(btnsClick.lang[3])
            sessionStorage.removeItem("deviceType")
            sessionStorage.removeItem("check2Factor")
            window.location.href = document.referrer
          } else alert(btnsClick.lang[4])
        })
        .catch(function(error) {
          console.log("editBtnClick.js edit axios error : ", error)
          alert(btnsClick.lang[4])
        })
    } catch (editError) {
      if (
        editError === "listFilters undefined" ||
        editError === "input undefined"
      )
        alert(btnsClick.lang[2])
      else {
        console.log("editBtnClick.js edit function error : ", editError)
        alert(btnsClick.lang[4])
      }
    }
  },
  edit2(listFilters, path, params, num) {
    const getInput = document.querySelectorAll("input")
    try {
      for (let i = 0; i < listFilters.length; i++) {
        if (listFilters[i].edit === "select") {
          if (!listFilters[i].selectCompData.selectedValue)
            // eslint-disable-next-line no-throw-literal
            throw "listFilters undefined"
        }
      }
      const check2Factor = sessionStorage.getItem("check2Factor")
      for (let i = 0; i < getInput.length - num; i++) {
        const slicePath = path.split("/")
        const confirmPath = slicePath[slicePath.length - 1]
        // 회원 정보 수정 클릭 시- 정렬번호 빈값체크 하지않음
        if (confirmPath === "user_update" && getInput.length - 5 === i) {
          if (!getInput[i].value) {
            params.order_by_num = 999
          }
          break
          // 디바이스 정보 수정 클릭 시- ProductNum, Serial 및 정렬번호 빈값체크 하지않음
        } else if (confirmPath === "dev_update") {
          if (i === 5) {
            if (!getInput[i].value) {
              params.order_by_num = 999
            }
            break
          }
          if (i === 0) {
            if (!getInput[i].value) {
              params.product_num = ""
            }
            break
          } 
          if (i === 2) {
            if (!getInput[i].value) {
              params.serial_num = ""
            }
            break
          }
        }
        // eslint-disable-next-line no-throw-literal
        if (!getInput[i].value){
          if (check2Factor === "False" && i == 4) {
            getInput[i].value = ""
          } else if (check2Factor === "False" && i == 5) {
            getInput[i].value = ""
          } else {
            throw "input undefined" 
          }
        }
      }
      const backendAPI = process.env.backendURL + axiosJson.fileupload.profile_photos
      const headers = params.formDataHeader
      if (params.imgFormData) {
        console.log("사용자 프로필 이미지 존재. 이미지 저장 실행")
        axios
          .post(backendAPI, params.imgFormData, { headers })
          .then((res) => {
            console.log("profileImg save success")
            const fileName = process.env.profilePhotoUrl + "\\" + res.data.FILE_NAME
            params.image = fileName
            axios
              .post(path, params)
              .then(function(res) {
                if (res) {
                  if (res.data === "Success") {
                    alert(btnsClick.lang[3])
                    sessionStorage.removeItem("deviceType")
                    sessionStorage.removeItem("check2Factor")
                    console.log(document.referrer)
                    window.location.href = document.referrer
                  } else if (res.data === "Exceeded quota") alert(btnsClick.lang[7])
                  else if (res.data === "Duplicate Name") alert(btnsClick.lang[8])
                  else if (res.data === "Duplicate Name en") alert(btnsClick.lang[9])
                  else if (res.data === "Duplicate Email") alert(btnsClick.lang[11])
                  else if (res.data === "Duplicate Phone_number") alert(btnsClick.lang[12])
                  else alert(btnsClick.lang[4])
                } else alert(btnsClick.lang[4])
              })
              .catch(function(error) {
                console.log("editBtnClick.js edit axios error : ", error)
                alert(btnsClick.lang[4])
              })
          })
          .catch((err) => {
            console.log("fail to save profileImg")
            alert(btnsClick.lang[4])
          })
          return
      } else {
        axios
          .post(path, params)
          .then(function(res) {
            if (res) {
              if (res.data === "Success") {
                alert(btnsClick.lang[3])
                sessionStorage.removeItem("deviceType")
                sessionStorage.removeItem("check2Factor")
                console.log(document.referrer)
                window.location.href = document.referrer
              } else if (res.data === "Exceeded quota") alert(btnsClick.lang[7])
              else if (res.data === "Duplicate Name") alert(btnsClick.lang[8])
              else if (res.data === "Duplicate Name en") alert(btnsClick.lang[9])
              else if (res.data === "Duplicate Email") alert(btnsClick.lang[11])
              else if (res.data === "Duplicate Phone_number") alert(btnsClick.lang[12])
              else alert(btnsClick.lang[4])
            } else alert(btnsClick.lang[4])
          })
          .catch(function(error) {
            console.log("editBtnClick.js edit axios error : ", error)
            alert(btnsClick.lang[4])
          })
      }
    } catch (editError) {
      if (
        editError === "listFilters undefined" ||
        editError === "input undefined"
      )
        alert(btnsClick.lang[2])
      else {
        console.log("editBtnClick.js edit function error : ", editError)
        alert(btnsClick.lang[4])
      }
    }
  },
  delete(path, params) {
    axios
      .post(path, params)
      .then(function(res) {
        if (res.data) {
          alert(btnsClick.lang[5])
          sessionStorage.removeItem("deviceType")
          sessionStorage.removeItem("check2Factor")
          window.location.href = document.referrer
        } else {
          console.log(btnsClick.lang[6])
          alert(btnsClick.lang[6])
        }
      })
      .catch(function(error) {
        console.log("editBtnClick.js delete axios error : ", error)
        alert(btnsClick.lang[6])
      })
  }
}

export default btnsClick
