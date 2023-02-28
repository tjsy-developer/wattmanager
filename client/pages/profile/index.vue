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
      compData: {
        self: this,
        userSeq: undefined,
        listTitle: this.$t("profile"),
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
            edit: "file"
          },
          {}
        ],
        createAndEditSpanSize: 120,
        type: "edit",
        selected: [],
        nameSpaceCheck: this.$t("no spaces text"),
        editBtnClick() {
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
                  image: this.selected[7],
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

        if (res.data.image) {
          fetch(self.hexToAscii(res.data.image))
            .then(response => response.blob())
            .then(function(resultBlob) {
              // const blobURL = URL.createObjectURL(resultBlob)
              self.defaultProfileBlob = URL.createObjectURL(resultBlob)
              console.log("profile blobURL: ", self.defaultProfileBlob)

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
            })

          // 사용자에게 보여주는 blob 처리된 이미지 src 적용
          setTimeout(() => {
            const profileImage = document.getElementById("fileTypeInputImg")
            profileImage.src = self.defaultProfileBlob
          }, 1000)
        } else {
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
      })
      .catch(function(error) {
        console.log("user profile page error : ", error)
      })
    this.deviceType = localStorage.getItem("deviceType")
    this.auth = localStorage.getItem("auth")
    console.log(this.deviceType, this.auth)
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
