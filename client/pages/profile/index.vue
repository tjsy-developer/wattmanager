<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import getInfo from "@/assets/scripts/info/getInfo"
import axiosJson from "@/assets/jsons/axios"
import profile from "@/components/forgotPasswordModal/profile"
import domain from "@/assets/jsons/domain/domain"

export default {
  layout: "main",
  data() {
    return {
      defaultProfileBlob: "",
      deviceType: 0,
      auth: 0,
      useEnterprise: domain.useEnterprise,
      compData: {
        self: this,
        userSeq: undefined,
        listTitle: this.$t("profile"),
        check2Factor: "",
        listFilters: [
          {},
          {
            text: this.$t("id"),
            edit: "disabled"
          },
          {
            text: this.$t("profile text")[0],
            edit: "disabled"
          },
          {
            text: this.$t("profile text")[1],
            edit: "disabled"
          },
          {
            text: this.$t("profile text")[2],
            edit: "disabled"
          },
          {
            text: this.$t("profile text")[3],
            edit: true
          },
          {
            text: this.$t("profile text")[4],
            // eslint-disable-next-line eqeqeq
            edit: true
          },
          {
            text: this.$t("profile text")[5],
            edit: true
          },
          {
            text: this.$t("profile text")[6],
            edit: "disabled"
          },
          {
            text: this.$t("profile text")[8],
            edit: "disabled"
          },
          {
            text: this.$t("profile text")[7],
            edit: "file"
          },
          {}
        ],
        createAndEditSpanSize: 120,
        type: "edit",
        selected: [],
        nameSpaceCheck: this.$t("no spaces text"),
        editBtnClick() {
          const deviceType = localStorage.getItem("deviceType")
          console.log(this.selected, "selected")
          const getSelf = this.self
          const getInput = document.querySelectorAll("input")
          try {
            for (let i = 4; i < getInput.length - 1; i++) {
              // eslint-disable-next-line no-throw-literal
              if (!getInput[i].value) throw "input undefined"
            }
            const pattern = /\s/g
            if (getInfo.getInputValue(4).match(pattern)) {
              alert(this.nameSpaceCheck)
            } else {
              // console.log("email---", getInfo.getInputValue(6))
              // console.log("name_en---", getInfo.getInputValue(5))
              // console.log("name---", getInfo.getInputValue(4))
              // console.log(getInfo.getInputValue(3))
              // console.log(getSelf.deviceType)
              // console.log(getSelf.auth)
              // if (getSelf.deviceType === 3 && getSelf.auth !== 4) {
              //   console.log(getInfo.getInputValue(5))
              //   console.log(getInfo.getInputValue(6))
              // } else {
              //   console.log("null")
              //   console.log(getInfo.getInputValue(5))
              // }
              getSelf.$axios
                // .post("userRest/user_update_my", {
                .post(domain.domain.backend1 + "userRest/user_update_my", {
                  user_seq: this.userSeq,
                  name: getInfo.getInputValue(4),
                  name_en:
                    // eslint-disable-next-line eqeqeq
                    getSelf.deviceType == 3 && getSelf.auth != 4
                      ? getInfo.getInputValue(5)
                      : null,
                  email:
                    // eslint-disable-next-line eqeqeq
                    getSelf.deviceType == 3 && getSelf.auth != 4
                      ? getInfo.getInputValue(6)
                      : getInfo.getInputValue(5),
                  // image: this.selected[7],
                  image:
                    getSelf.check2Factor == "True" && deviceType != 2
                      ? this.selected[9]
                      : this.selected[7],
                  phone_number:
                    getSelf.check2Factor == "True" && deviceType != 2
                      ? getInfo.getInputValue(7)
                      : "",
                  birthday:
                    getSelf.check2Factor == "True" && deviceType != 2
                    ? getInfo.getInputValue(8)
                    : "",
                  jwt: localStorage.getItem("jwt")
                })
                .then(function(res) {
                  console.log(res.data)
                  if (res.data === "Success") {
                    alert(getSelf.$t("attachment")[1])
                  } else if (res.data === "Exceeded quota")
                    alert(getSelf.$t("ExceededQuota"))
                  else if (res.data === "Duplicate Name")
                    alert(getSelf.$t("device")[4])
                  else if (res.data === "Duplicate Name_en")
                    alert(getSelf.$t("device")[5])
                  else if (res.data === "Duplicate Email")
                    alert(getSelf.$t("user")[5])
                  else alert(getSelf.$t("attachment")[2])

                  // if (res.data) alert(getSelf.$t("attachment")[1])
                  // else alert(getSelf.$t("attachment")[2])
                  // if (res.data === "Success") alert(getSelf.$t("attachment")[1])
                  // else if (res.data === "Exceeded quota")
                  //   alert(getSelf.$t("ExceededQuota"))
                  // else if (res.data === "Duplicate Name")
                  //   alert(getSelf.$t("device")[4])
                  // else alert(getSelf.$t("attachment")[2])
                })
                .catch(function(error) {
                  console.log("profile.vue error : ", error)
                  alert(getSelf.$t("attachment")[2])
                })
            }
          } catch (editError) {
            if (editError === "input undefined") alert(getSelf.$t("account")[6])
            else {
              console.log("profile.vue error : ", editError)
              alert(getSelf.$t("attachment")[2])
            }
          }
        },
        deleteBtnClick() {
          const modalsContainerStyle = document.getElementById(
            "modalsContainer"
          ).style
          modalsContainerStyle.display = "block"

          this.self.$modal.show(
            profile,
            { userSeq: this.userSeq },
            {
              name: "forgotPasswordModal",
              width: innerWidth <= 500 ? 340 : 400,
              height: 380
            },
            {
              "before-close": () => {
                modalsContainerStyle.display = "none"
              }
            }
          )
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
    }
  },
  mounted() {
    if (window.location.hostname == 'dlenc.watttalk.kr') {
      // dlenc 분기처리!!
      this.useEnterprise = "dlenc"
    } else if (window.location.hostname == 'dlencmedia.watttalk.kr') {
      this.useEnterprise = "dlenc"
    }
    const getUserSeq = Number(localStorage.getItem("userSeq"))
    this.compData.userSeq = getUserSeq
    const self = this
    this.$axios
      // .post(axiosJson.user.user_info_one, {
      .post(domain.domain.backend1 + axiosJson.user.user_info_one, {
        user_seq: getUserSeq,
        jwt: localStorage.getItem("jwt")
      })
      .then(function(res) {
        console.log(res)
        sessionStorage.setItem("deviceType", res.data.device_type)
        self.$axios
          .post(domain.domain.backend1 + axiosJson.app.app_powertalkweb_info, {
            en_seq: res.data.en_seq,
            hq_seq: res.data.hq_seq,
            br_seq: res.data.br_seq
          })
          .then((response) => {
            const jsonFactorList = response.data[0].app_detail_json
            const factorList = JSON.parse(jsonFactorList)
            self.check2Factor = factorList["2factor"]
            if (self.useEnterprise != "dlenc") {
              self.check2Factor = "False"
            }
          })
          .catch((err) => {
            if (err == "TypeError: Cannot read properties of undefined (reading 'app_detail_json')") {
              self.check2Factor = "False"
            } else {
              console.log("2Factor Error :", err)
            }
          })
          .then(() => {
            if (res.data.image) {
              fetch(self.hexToAscii(res.data.image))
                .then(response => response.blob())
                .then(function(resultBlob) {
                  // const blobURL = URL.createObjectURL(resultBlob)
                  self.defaultProfileBlob = URL.createObjectURL(resultBlob)
                  console.log("profile blobURL: ", self.defaultProfileBlob)
                  if (self.check2Factor == "True") {
                    if (res.data.id == "administrator" || sessionStorage.getItem("deviceType") == 2){
                      self.compData.listFilters.splice(8, 2)
                      self.compData.selected = [
                        res.data.id,
                        res.data.en_alias,
                        res.data.hq_alias,
                        res.data.br_alias,
                        res.data.name,
                        res.data.name_en,
                        res.data.email,
                        res.data.image ? self.hexToAscii(res.data.image) : undefined
                      ]
                    } else {
                      self.compData.selected = [
                        res.data.id,
                        res.data.en_alias,
                        res.data.hq_alias,
                        res.data.br_alias,
                        res.data.name,
                        res.data.name_en,
                        res.data.email,
                        res.data.phone_number,
                        res.data.birthday,
                        res.data.image ? self.hexToAscii(res.data.image) : undefined
                      ]
                    }
                  } else {
                    self.compData.listFilters.splice(8, 2)
                    self.compData.selected = [
                        res.data.id,
                        res.data.en_alias,
                        res.data.hq_alias,
                        res.data.br_alias,
                        res.data.name,
                        res.data.name_en,
                        res.data.email,
                        res.data.image ? self.hexToAscii(res.data.image) : undefined
                      ]
                  }
                })

              // 사용자에게 보여주는 blob 처리된 이미지 src 적용
              setTimeout(() => {
                const profileImage = document.getElementById("fileTypeInputImg")
                profileImage.src = self.defaultProfileBlob
              }, 1000)
            } else {
              if (self.check2Factor == "True") {
                if (res.data.id == "administrator" || sessionStorage.getItem("deviceType") == 2) {
                  self.compData.listFilters.splice(8, 2)
                  self.compData.selected = [
                    res.data.id,
                    res.data.en_alias,
                    res.data.hq_alias,
                    res.data.br_alias,
                    res.data.name,
                    res.data.name_en,
                    res.data.email,
                    undefined
                  ]
                } else {
                  self.compData.selected = [
                    res.data.id,
                    res.data.en_alias,
                    res.data.hq_alias,
                    res.data.br_alias,
                    res.data.name,
                    res.data.name_en,
                    res.data.email,
                    res.data.phone_number,
                    res.data.birthday,
                    undefined
                  ]
                }
              } else {
                self.compData.listFilters.splice(8, 2)
                self.compData.selected = [
                  res.data.id,
                  res.data.en_alias,
                  res.data.hq_alias,
                  res.data.br_alias,
                  res.data.name,
                  res.data.name_en,
                  res.data.email,
                  undefined
                ]
              }
            }
          })
      })
      .catch(function(error) {
        console.log("user profile page error : ", error)
      })
    this.deviceType = localStorage.getItem("deviceType")
    this.auth = localStorage.getItem("auth")
    // eslint-disable-next-line eqeqeq
    if (this.deviceType == 3 && this.auth != 4) {
      this.compData.listFilters[6].edit = true
    } else {
      this.compData.listFilters[6].edit = false
    }
  },
  beforeDestroy() {
    if (this.defaultProfileBlob !== undefined) {
      if (this.defaultProfileBlob !== "") {
        URL.revokeObjectURL(this.defaultProfileBlob)
      }
    }
  }
}
</script>

<style lang="sass" scoped></style>
