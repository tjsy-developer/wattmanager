<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import axiosJson from "@/assets/jsons/axios"
import filtersJson from "@/assets/jsons/info/user/editFilters"
import glassEditFilters from "@/assets/jsons/info/user/glassEditFilters"
import btnsClick from "@/assets/scripts/info/btnsClick"
import getFilters from "@/assets/scripts/info/getFilters"
import getInfo from "@/assets/scripts/info/getInfo"
import setComboBox from "@/assets/scripts/info/setComboBox"


export default {
  layout: "main",
  data() {
    return {
      token: "",
      defaultUserProfileBlob: "",
      compData: {
        self: this,        
        useEnterprise: process.env.useEnterprise,
        userSeq: Number(this.$route.query.seq),
        listTitle: this.$t("user")[0],
        createAndEditTitle: this.$t("user")[1],
        listFilters: undefined,
        createAndEditSpanSize: 120,
        type: "edit",
        selected: [],
        check2Factor: false,
        nameSpaceCheck: this.$t("no spaces text"),
        phoneNumber: "",
        birthday: "",
        imageFile: "",
        isGuest: "",
        editBtnClick() {
          let checkGuest = ""
          const getSelf = this.self
          if (sessionStorage.getItem("editUserDeviceType") != 2) {
            if (getInfo.getInputValue(6) == "true") {
              checkGuest = 1
            } else {
              checkGuest = 0
            }
          }
          let formData = new FormData()
          const savePath = process.env.profilePhotoSavefolder
          const profileImg = this.imageFile
          
          const headers = {
            "Content-Type": "multipart/form-data",
            "jwt": sessionStorage.getItem("jwt")
          }
          formData.append("save_folder", savePath)
          if (profileImg) {
            formData.append("upload_file", profileImg)
          } else {
            formData = null
          }
          const getCheckboxCompData = this.listFilters[9].checkboxCompData
          const token = sessionStorage.getItem("jwt")
          const setCheckboxCompData = []
          for (let i = 0; i < getCheckboxCompData.list.length; i++) {
            if (
              getCheckboxCompData.selected.includes(
                String(getCheckboxCompData.list[i].value)
              ) ||
              getCheckboxCompData.selected.includes(
                getCheckboxCompData.list[i].value
              )
            )
              setCheckboxCompData.push(getCheckboxCompData.list[i])
          }

          let setGlassAppRange = ""
          if (setCheckboxCompData.length) {
            setCheckboxCompData.sort((a, b) => {
              return a.sort > b.sort ? 1 : a.sort < b.sort ? -1 : 0
            })
            const setGlassAppRangeArr = []
            for (let i = 0; i < setCheckboxCompData.length; i++)
              setGlassAppRangeArr.push(setCheckboxCompData[i].value)
            setGlassAppRange = setGlassAppRangeArr.join("|") + "|"
          }
          const inputLength = document.querySelectorAll("input").length
          const pattern = /\s/g
          if (getInfo.getInputValue(1).match(pattern)) {
          } else {
            if (getInfo.getInputValue(0).includes("wattsupport")) {
              getSelf.compData.check2Factor = false
            }
            // 글라스가 아닌경우
            if (sessionStorage.getItem("editUserDeviceType") != 2) {
              btnsClick.edit2(
                this.listFilters,
                process.env.backendURL + "userRest/user_update",
                {
                  user_seq: this.userSeq,
                  id: getInfo.getInputValue(0),
                  name: getInfo.getInputValue(1),
                  en_seq: getInfo.getSelectValue(this.listFilters, 2),
                  hq_seq: getInfo.getSelectValue(this.listFilters, 3),
                  br_seq: getInfo.getSelectValue(this.listFilters, 4),
                  auth: Number(getInfo.getSelectValue(this.listFilters, 6)),
                  approval_status: getInfo.getSelectValue(this.listFilters, 7),
                  glass_app_range: setGlassAppRange,
                  image: this.selected[13] ? this.selected[13] : "",
                  pc_app_range: "",
                  order_by_num: Number(getInfo.getInputValue(inputLength - 5)),
                  device_type: Number(sessionStorage.getItem("editUserDeviceType")),
                  phone_number: getInfo.getInputValue(4),
                  birthday: getInfo.getInputValue(5),
                  email: getInfo.getInputValue(2),
                  guest: checkGuest,
                  jwt: token,
                  imgFormData: formData,
                  formDataHeader: headers
                },
                1
              )
            } else {
              // 글라스인 경우
              btnsClick.edit2(
                this.listFilters,
                process.env.backendURL + "userRest/user_update",
                {
                  user_seq: this.userSeq,
                  id: getInfo.getInputValue(0),
                  name: getInfo.getInputValue(1),
                  en_seq: getInfo.getSelectValue(this.listFilters, 2),
                  hq_seq: getInfo.getSelectValue(this.listFilters, 3),
                  br_seq: getInfo.getSelectValue(this.listFilters, 4),
                  auth: Number(getInfo.getSelectValue(this.listFilters, 6)),
                  approval_status: getInfo.getSelectValue(this.listFilters, 7),
                  glass_app_range: setGlassAppRange,
                  image: this.selected[10] ? this.selected[10] : "",
                  pc_app_range: "",
                  order_by_num: Number(getInfo.getInputValue(inputLength - 2)),
                  device_type: Number(sessionStorage.getItem("editUserDeviceType")),
                  phone_number: "",
                  birthday: "",
                  email: getInfo.getInputValue(2),
                  jwt: token,
                  imgFormData: formData,
                  formDataHeader: headers,
                  guest: 0
                },
                1
              )
            }
          }
        },
        deleteBtnClick() {
          const token = sessionStorage.getItem("jwt")
          const result = confirm(btnsClick.lang[10])
          if (result) {
            btnsClick.delete(process.env.backendURL + "userRest/user_delete", {
              user_seq: this.userSeq,
              jwt: token
            }) 
          } else {
          }
        }
      }
    }
  },
  methods: {
    hexToAscii(getStr) {
      const hex = getStr.toString()
      let str = ""
      for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
      }

      return str
    },
    async appSetting(params) {
      try {
        const appDetailJson = await getInfo.appSetting(params)
        const appInfo = JSON.parse(appDetailJson)
        this.compData.check2Factor = JSON.parse(appInfo["2factor"].toLowerCase())
      } catch(error) {
        this.compData.check2Factor = undefined
      } finally {
        sessionStorage.setItem("check2Factor", this.compData.check2Factor)
        this.compData.listFilters = this.compData.listFilters.map((value) => {
          const columnText = value.text.toLowerCase().replaceAll(" ", '')
          if ((columnText === "휴대폰번호" || columnText === "생년월일" || columnText === "cellphone" || columnText === "birthday")) {
            if (this.compData.check2Factor === false) {
              return {
                ...value,
                edit: 'none'
              }
            } else {
              return {
                ...value,
                edit: true
              }
            }
          } return value
        })
      }
    }
  },
  async mounted() {
    this.refreshToken()
    window.addEventListener("imageInputed", (e) => {
      console.log(e)
      this.compData.imageFile = e.detail
    })
    if (window.location.hostname == 'dlencmedia.watttalk.kr') {
      this.useEnterprise = "dlenc"
    }
    const self = this
    getInfo.setAuthority()
    getInfo.setLang(this.$t("getInfo"))
    btnsClick.setLang([
      this.$t("btnsClick")[0],
      this.$t("btnsClick")[1],
      this.$t("account")[6],
      this.$t("attachment")[1],
      this.$t("attachment")[2],
      this.$t("listComp")[14],
      this.$t("listComp")[15],
      this.$t("ExceededQuota"),
      this.$t("device")[4],
      this.$t("device")[5],
      this.$t("user")[4],
      this.$t("user")[5],
      this.$t("attachment")[5]
    ])
    this.token = sessionStorage.getItem("jwt")
    const params = {
      data: {
        user_seq: self.compData.userSeq,
        jwt: this.token
      },
      api: process.env.backendURL + axiosJson.user.user_info_one
    }
    this.axiosRequest('post', params)
      .then(async function (res) {
        if (self.$store.state.user.permissionLevel <= res.data.auth) {
          self.$router.replace('/err/404');
        }
        sessionStorage.setItem("editUserDeviceType", res.data.device_type)
        if (res.data.phone_number) {
              self.phoneNumber = res.data.phone_number
            }
            if (res.data.birthday) {
              self.birthday = res.data.birthday
            }
            if (res.data.guest) {
              self.compData.isGuest = res.data.guest
            }
            if (res.data.image) {
              res.data.image = await self.convertImageToBlob(res.data.image)
            }
            // 글라스가 아닌 경우
            if (res.data.device_type != 2) {
              self.compData.selected = [
                res.data.id,
                res.data.en_seq,
                res.data.hq_seq,
                res.data.br_seq,
                res.data.name,
                res.data.auth,
                res.data.approval_status,
                res.data.email,
                res.data.glass_app_range,
                res.data.order_by_num,
                res.data.phone_number,
                res.data.birthday,
                res.data.guest,
                res.data.image ? res.data.image : undefined,
                res.data.pc_app_range,
                res.data.device_type,
              ]
            } else {
              // 글라스인 경우
              self.compData.selected = [
                res.data.id,
                res.data.en_seq,
                res.data.hq_seq,
                res.data.br_seq,
                res.data.name,
                res.data.auth,
                res.data.approval_status,
                res.data.email,
                res.data.glass_app_range,
                res.data.order_by_num,
                res.data.image ? res.data.image : undefined,
                res.data.pc_app_range,
                res.data.device_type,
              ]
            }
            if (res.data.image) {
              const profileImage =  res.data.image
            } else {
              if (res.data.device_type !== 2) {
                self.compData.selected[12] = undefined
              } else {
                // 이미지 없을때 초기값 설정
                self.compData.selected[10] = undefined
              }
            }
            getInfo
              .enterprise()
              .then(enterpriseRes => {
                getInfo.enterpriseCompData.options = enterpriseRes
              })
              .then(() => {
                getInfo
                  .hq(res.data.en_seq)
                  .then(hqRes => {
                    getInfo.hqCompData.options = hqRes
                  })
                  .then(() => {
                    getInfo
                      .branch(res.data.hq_seq)
                      .then(branchRes => {
                        getInfo.branchCompData.options = branchRes
                      })
                      .then(() => {
                        if (res.data.device_type == 3) {
                          self.compData.listFilters = setComboBox(
                            getFilters(
                              [
                                self.$t("infoFilters")[0],
                                "ID",
                                self.$t("infoFilters")[1],
                                self.$t("infoFilters")[2],
                                self.$t("infoFilters")[3],
                                self.$t("infoFilters")[9],
                                self.$t("infoFilters")[10],
                                self.$t("infoFilters")[8],
                                self.$t("infoFilters")[14],
                                self.$t("user")[3],
                                self.$t("infoFilters")[11],
                                self.$t("profile text")[6],
                                self.$t("profile text")[8],
                                self.$t("profile text")[9],
                                self.$t("profile text")[7],
                                self.$t("infoFilters")[7]
                              ],
                              filtersJson
                            ),
                            self.compData.selected,
                            [
                              getInfo.enterpriseCompData,
                              getInfo.hqCompData,
                              getInfo.branchCompData,
                              getInfo.authority,
                              getInfo.permission
                            ]
                          )
                          self.appSetting({
                            en_seq: res.data.en_seq,
                            hq_seq: res.data.hq_seq,
                            br_seq: res.data.br_seq
                          })
                        } else if (res.data.device_type === 2) {
                          self.compData.listFilters = setComboBox(
                            getFilters(
                              [
                                self.$t("infoFilters")[0],
                                "ID",
                                self.$t("infoFilters")[1],
                                self.$t("infoFilters")[2],
                                self.$t("infoFilters")[3],
                                self.$t("infoFilters")[9],
                                self.$t("infoFilters")[10],
                                self.$t("infoFilters")[8],
                                self.$t("infoFilters")[14],
                                self.$t("user")[3],
                                self.$t("infoFilters")[11],
                                self.$t("profile text")[7],
                                self.$t("infoFilters")[7]
                              ],
                              glassEditFilters
                            ),
                            self.compData.selected,
                            [
                              getInfo.enterpriseCompData,
                              getInfo.hqCompData,
                              getInfo.branchCompData,
                              getInfo.authority,
                              getInfo.permission
                            ]
                          )
                          const parameter = {
                            data: {
                              br_seq: res.data.br_seq,
                              jwt: sessionStorage.getItem("jwt")
                            },
                            api: process.env.backendURL + "userRest/user_info_one_app_list"
                          }
                          self.axiosRequest('post', parameter)
                            .then(function(userInfoOneAppList) {
                              if (userInfoOneAppList.data) {
                              console.log(userInfoOneAppList)
                                const getGlassAppRange = self.compData.selected[8]?.split(
                                  "|"
                                ) || []
                                self.compData.listFilters[9].checkboxCompData.selected = getGlassAppRange.slice(
                                  0,
                                  getGlassAppRange.length - 1
                                )

                                const setSelectedUserInfoOneAppList = []
                                const setUnSelectedUserInfoOneAppList = []
                                for (
                                  let i = 0;
                                  i < userInfoOneAppList.data.length;
                                  i++
                                ) {
                                  const getCurrentAppSeq = String(
                                    userInfoOneAppList.data[i].app_seq
                                  )
                                  const getCurrentIndex = getGlassAppRange.indexOf(
                                    getCurrentAppSeq
                                  )

                                  const setUserInfoOneAppListObj = {
                                    text:
                                      self.$i18n.locale === "ko"
                                        ? userInfoOneAppList.data[i].app_name_kor
                                        : userInfoOneAppList.data[i].app_name_eng,
                                    value: userInfoOneAppList.data[i].app_seq,
                                    sort: 0
                                  }

                                  if (getGlassAppRange.includes(getCurrentAppSeq)) {
                                    setUserInfoOneAppListObj.sort =
                                      getCurrentIndex + 1
                                    setSelectedUserInfoOneAppList.push(
                                      setUserInfoOneAppListObj
                                    )
                                  } else
                                    setUnSelectedUserInfoOneAppList.push(
                                      setUserInfoOneAppListObj
                                    )
                                }

                                setSelectedUserInfoOneAppList.sort((a, b) => {
                                  return a.sort > b.sort
                                    ? 1
                                    : a.sort < b.sort
                                    ? -1
                                    : 0
                                })

                                self.compData.listFilters[9].checkboxCompData.list = setSelectedUserInfoOneAppList.concat(
                                  setUnSelectedUserInfoOneAppList
                                )
                              }
                            })
                            .catch(function(userInfoOneAppListError) {
                              console.log(
                                "ajax user_info_one_app_list_error : ",
                                userInfoOneAppListError
                              )
                            })
                        } else {
                          self.compData.listFilters[9].edit = false
                        }
                      })
                  })
              })
      })
      .catch(function(error) {
        console.log("user edit page error : ", error)
      })
  },
  computed: {
    selectBranchValue() {
      if (!this.compData.listFilters) return
      return getInfo.getSelectValue(this.compData.listFilters, 4)
    }
  },
  watch: {
    selectBranchValue(newVal, oldVal) {
      this.appSetting({
        en_seq: getInfo.getSelectValue(this.compData.listFilters, 2),
        hq_seq: getInfo.getSelectValue(this.compData.listFilters, 3),
        br_seq: newVal
      })
    }
  },
  beforeDestroy() {
    if (this.defaultUserProfileBlob !== undefined) {
      if (this.defaultUserProfileBlob !== "") {
        URL.revokeObjectURL(this.defaultUserProfileBlob)
      }
    }
  }
}
</script>

<style lang="sass" scoped></style>
