<template lang="pug">
	infoCreateAndEdit(:compData="compData")
</template>

<script>
import filtersJson from "@/assets/jsons/info/user/editFilters"
import getFilters from "@/assets/scripts/info/getFilters"
import setComboBox from "@/assets/scripts/info/setComboBox"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"
import axiosJson from "@/assets/jsons/axios"
import domain from "@/assets/jsons/domain/domain"

export default {
  layout: "main",
  data() {
    return {
      token: "",
      defaultUserProfileBlob: "",
      compData: {
        userSeq: Number(this.$route.query.seq),
        listTitle: this.$t("user")[0],
        createAndEditTitle: this.$t("user")[1],
        listFilters: undefined,
        createAndEditSpanSize: 120,
        type: "edit",
        selected: [],
        nameSpaceCheck: this.$t("no spaces text"),
        editBtnClick() {
          const getCheckboxCompData = this.listFilters[9].checkboxCompData
          const token = localStorage.getItem("jwt")
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
            btnsClick.edit2(
              this.listFilters,
              domain.domain.backend1 + "userRest/user_update",
              {
                user_seq: this.userSeq,
                id: getInfo.getInputValue(0),
                name: getInfo.getInputValue(1),
                en_seq: getInfo.getSelectValue(this.listFilters, 2),
                hq_seq: getInfo.getSelectValue(this.listFilters, 3),
                br_seq: getInfo.getSelectValue(this.listFilters, 4),
                auth: getInfo.getSelectValue(this.listFilters, 6),
                approval_status: getInfo.getSelectValue(this.listFilters, 7),
                glass_app_range: setGlassAppRange,
                image: this.selected[10],
                pc_app_range: this.selected[11],
                order_by_num: Number(getInfo.getInputValue(inputLength - 2)),
                device_type: this.selected[12],
                email: getInfo.getInputValue(2),
                jwt: token
              },
              1
            )
          }
        },
        deleteBtnClick() {
          const token = localStorage.getItem("jwt")
          const result = confirm(btnsClick.lang[10])
          if (result) {
            btnsClick.delete(domain.domain.backend1 + "userRest/user_delete", {
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
    }
  },
  mounted() {
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
      this.$t("user")[5]
    ])

    const self = this
    this.token = localStorage.getItem("jwt")
    this.$axios
      .post(domain.domain.backend1 + axiosJson.user.user_info_one, {
        user_seq: self.compData.userSeq,
        jwt: this.token
      })
      .then(function(res) {
        console.log(res)
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
          res.data.image ? self.hexToAscii(res.data.image) : undefined,
          res.data.pc_app_range,
          res.data.device_type
        ]

        if (res.data.image) {
          fetch(self.hexToAscii(res.data.image))
            .then(response => response.blob())
            .then(function(resultBlob) {
              // const blobURL = URL.createObjectURL(resultBlob)
              self.defaultUserProfileBlob = URL.createObjectURL(resultBlob)
              console.log("userProfile blobURL: ", self.defaultUserProfileBlob)

              // 사용자에게 보여주는 blob 처리된 이미지 src 적용
              setTimeout(() => {
                const profileImage = document.getElementById("fileTypeInputImg")
                profileImage.src = self.defaultUserProfileBlob
              }, 1000)
            })
        } else {
          self.compData.selected[10] = undefined
        }
      })
      .catch(function(error) {
        console.log("user edit page error : ", error)
      })
      .then(function() {
        getInfo
          .enterprise()
          .then(enterpriseRes => {
            getInfo.enterpriseCompData.options = enterpriseRes
          })
          .then(() => {
            getInfo
              .hq(self.compData.selected[1])
              .then(hqRes => {
                getInfo.hqCompData.options = hqRes
              })
              .then(() => {
                getInfo
                  .branch(self.compData.selected[2])
                  .then(branchRes => {
                    getInfo.branchCompData.options = branchRes
                  })
                  .then(() => {
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

                    if (self.compData.selected[12] === 2) {
                      self.$axios
                        .post(
                          domain.domain.backend1 +
                            "userRest/user_info_one_app_list",
                          {
                            br_seq: self.compData.selected[3],
                            jwt: localStorage.getItem("jwt")
                          }
                        )
                        .then(function(userInfoOneAppList) {
                          console.log(userInfoOneAppList)
                          if (userInfoOneAppList.data) {
                            const getGlassAppRange = self.compData.selected[8].split(
                              "|"
                            )
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
