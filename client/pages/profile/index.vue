<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import axiosJson from "@/assets/jsons/axios";
import getInfo from "@/assets/scripts/info/getInfo";
import profile from "@/components/forgotPasswordModal/profile";


export default {
  layout: "main",
  data() {
    return {
      defaultProfileBlob: "",
      deviceType: 0,
      auth: 0,
      useEnterprise: process.env.useEnterprise,
      compData: {
        self: this,
        userSeq: undefined,
        listTitle: this.$t("profile"),
        check2Factor: false,
        imageFile: "",
        listFilters: [
          {
            text: '',
          },
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
        async editBtnClick() {
          const deviceType = sessionStorage.getItem("deviceType")
          console.log(this.selected, "selected")
          const getSelf = this.self
          const getInput = document.querySelectorAll("input")
          try {
            for (let i = 4; i < getInput.length - 1; i++) {
              // eslint-disable-next-line no-throw-literal
              // if (!getInput[i].value && getSelf.auth != 4) throw "input undefined"
            }
            const pattern = /\s/g
            if (getInfo.getInputValue(4).match(pattern)) {
              alert(this.nameSpaceCheck)
            } else {
              let formData = new FormData()
              const savePath = process.env.profilePhotoSavefolder
              const profileImg = this.imageFile


              console.log(profileImg)
              
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
              if (formData) {
                const backendAPI = process.env.backendURL + axiosJson.fileupload.profile_photos
                
                getSelf.$axios
                  .post(backendAPI, formData, { headers })
                  .then((res) => {
                    const fileName = process.env.profilePhotoUrl + res.data.FILE_NAME
                    getSelf.$axios
                      // .post("userRest/user_update_my", {
                      .post(process.env.backendURL + "userRest/user_update_my",
                        {
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
                          image: fileName,
                          phone_number:
                            deviceType != 2 && getSelf.compData.check2Factor !== false
                              ? getInfo.getInputValue(7)
                              : "",
                          birthday:
                            deviceType != 2 && getSelf.compData.check2Factor !== false
                            ? getInfo.getInputValue(8)
                            : "",
                          jwt: sessionStorage.getItem("jwt")
                        },
                        {
                          headers: {
                            jwt: sessionStorage.getItem("jwt")
                          }
                        }
                      )
                      .then(function(res) {
                        console.log(res.data == "Duplicate phone_number")
                        if (res.data === "Success") alert(getSelf.$t("attachment")[1])
                        else if (res.data === "Exceeded quota") alert(getSelf.$t("ExceededQuota"))
                        else if (res.data === "Duplicate Name") alert(getSelf.$t("device")[4])
                        else if (res.data === "Duplicate Name_en") alert(getSelf.$t("device")[5])
                        else if (res.data === "Duplicate Email") alert(getSelf.$t("user")[5])
                        else if (res.data === "Duplicate phone_number") alert(getSelf.$t("attachment")[5])
                        else alert(getSelf.$t("attachment")[2])
                      })
                      .catch(function(error) {
                        console.log("profile.vue error : ", error)
                        alert(getSelf.$t("attachment")[2])
                      })
                  })
                  .catch((err) => {
                    console.log("profile image save fail", err)
                    alert(getSelf.$t("attachment")[2])
                  })
              } else {
                getSelf.$axios
                  // .post("userRest/user_update_my", {
                  .post(process.env.backendURL + "userRest/user_update_my",
                    {
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
                      image: deviceType != 2
                        ? this.selected[9]
                        : this.selected[7],
                      phone_number:
                        deviceType != 2 && getSelf.compData.check2Factor !== false
                          ? getInfo.getInputValue(7)
                          : "",
                      birthday:
                        deviceType != 2 && getSelf.compData.check2Factor !== false
                        ? getInfo.getInputValue(8)
                        : "",
                      jwt: sessionStorage.getItem("jwt")
                    },
                    {
                      headers: {
                        jwt: sessionStorage.getItem("jwt")
                      }
                    }
                  )
                  .then(function(res) {
                    if (res.data === "Success") alert(getSelf.$t("attachment")[1])
                    else if (res.data === "Exceeded quota") alert(getSelf.$t("ExceededQuota"))
                    else if (res.data === "Duplicate Name") alert(getSelf.$t("device")[4])
                    else if (res.data === "Duplicate Name_en") alert(getSelf.$t("device")[5])
                    else if (res.data === "Duplicate Email") alert(getSelf.$t("user")[5])
                    else if (res.data === "Duplicate phone_number") alert(getSelf.$t("attachment")[5])
                    else alert(getSelf.$t("attachment")[2])
                  })
                  .catch(function(error) {
                    console.log("profile.vue error : ", error)
                    alert(getSelf.$t("attachment")[2])
                  })
              }
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
          if (!value.text) return value
          const columnText = value?.text.toLowerCase().replaceAll(" ", '')
          if ((columnText === "휴대폰번호" || columnText === "생년월일" || columnText === "cellphone" || columnText === "birthday")) {
            if (this.compData.check2Factor === false) {
              return {
                ...value,
                edit: 'none'
              }
            } return {
              ...value, 
              edit: 'disabled'
            }
          } 
          return value
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
    const getUserSeq = Number(sessionStorage.getItem("userSeq"))
    this.compData.userSeq = getUserSeq
    const self = this
    const params = {
      data: {
        user_seq: getUserSeq,
        jwt: sessionStorage.getItem("jwt")
      },
      api: process.env.backendURL + axiosJson.user.user_info_one
    }
    this.axiosRequest('post', params)
      .then(async function(res) {

        sessionStorage.setItem("deviceType", res.data.device_type)

            if (res.data.image) {
              let checkAdmin = false
              if (res.data.id == "administrator" || res.data.id.includes("wattsupport")) {
                checkAdmin = true
              }
              res.data.image = await self.convertImageToBlob(res.data.image)
              // 글라스 혹은 admin 계정
              if (checkAdmin == true || res.data.device_type == 2){
                self.compData.listFilters.splice(8, 2)
                self.compData.selected = [
                  res.data.id,
                  res.data.en_alias,
                  res.data.hq_alias,
                  res.data.br_alias,
                  res.data.name,
                  res.data.name_en,
                  res.data.email,
                  res.data.image ? res.data.image : undefined
                ]
              } else {
                // pc 일반
                self.compData.selected = [
                  res.data.id,
                  res.data.en_alias,
                  res.data.hq_alias,
                  res.data.br_alias,
                  res.data.name,
                  res.data.name_en,
                  res.data.email,
                  res.data.phone_number || '',
                  res.data.birthday || '',
                  res.data.image ? res.data.image : undefined
                ]
              }
            } else {
              // 사진이 없는 경우
              let checkAdmin = false
              if (res.data.id == "administrator" || res.data.id.includes("wattsupport")) {
                checkAdmin = true
              }
              console.log(checkAdmin)
              if (checkAdmin == "true" || res.data.device_type == 2) {
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
        }
        console.log(self.compData.listFilters)
        self.appSetting({
          en_seq: res.data.en_seq,
          hq_seq: res.data.hq_seq,
          br_seq: res.data.br_seq
        })
    })
    .catch(function(error) {
      console.log("user profile page error : ", error)
    })
    this.deviceType = sessionStorage.getItem("deviceType")
    this.auth = sessionStorage.getItem("auth")
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
