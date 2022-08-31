<template lang="pug">
	infoCreateAndEdit(:compData="compData")
</template>

<script>
import filtersJson from "@/assets/jsons/info/device/editFilters"
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
      compData: {
        devSeq: Number(this.$route.query.seq),
        listTitle: this.$t("device")[0],
        createAndEditTitle: this.$t("device")[1],
        listFilters: undefined,
        createAndEditSpanSize: 140,
        type: "edit",
        selected: [],
        nameSpaceCheck: this.$t("no spaces text"),
        editBtnClick() {
          const token = localStorage.getItem("jwt")
          const pattern = /\s/g
          if (getInfo.getInputValue(3).match(pattern)) {
            alert(this.nameSpaceCheck)
          } else if (getInfo.getInputValue(4).match(pattern)) {
            alert(this.nameSpaceCheck)
          } else {
            btnsClick.edit2(
              this.listFilters,
              domain.domain.backend1 + "deviceRest/dev_update",
              {
                dev_seq: this.devSeq,
                en_seq: getInfo.getSelectValue(this.listFilters, 4),
                hq_seq: getInfo.getSelectValue(this.listFilters, 5),
                br_seq: getInfo.getSelectValue(this.listFilters, 6),
                device_id: this.selected[1],
                product_num: getInfo.getInputValue(0),
                serial_num: getInfo.getInputValue(2),
                device_name: getInfo.getInputValue(3),
                device_name_en: getInfo.getInputValue(4),
                approval_status: getInfo.getSelectValue(this.listFilters, 9),
                order_by_num: Number(getInfo.getInputValue(5)),
                device_type: this.selected[10],
                jwt: token
              },
              0
            )
          }
        },
        deleteBtnClick() {
          const token = localStorage.getItem("jwt")
          const result = confirm(btnsClick.lang[10])
          if (result) {
            btnsClick.delete(domain.domain.backend1 + "deviceRest/dev_delete", {
              dev_seq: this.devSeq,
              jwt: token
            })
          } else {
          }
        }
      }
    }
  },
  created() {
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
      this.$t("device")[3]
    ])
  },
  mounted() {
    getInfo.setAuthority()
    getInfo.setLang(this.$t("getInfo"))
    const self = this
    this.token = localStorage.getItem("jwt")
    this.$axios
      .post(domain.domain.backend1 + axiosJson.device.dev_info_one, {
        dev_seq: self.compData.devSeq,
        jwt: this.token
      })
      .then(function(res) {
        console.log(res)
        self.compData.selected = [
          res.data[0].product_num,
          res.data[0].device_id,
          res.data[0].serial_num,
          res.data[0].en_seq,
          res.data[0].hq_seq,
          res.data[0].br_seq,
          res.data[0].device_name,
          res.data[0].device_name_en,
          res.data[0].approval_status,
          res.data[0].order_by_num,
          res.data[0].device_type
        ]
      })
      .catch(function(error) {
        console.log("device edit page error : ", error)
      })
      .then(function() {
        getInfo
          .enterprise()
          .then(enterpriseRes => {
            getInfo.enterpriseCompData.options = enterpriseRes
          })
          .then(() => {
            getInfo
              .hq(self.compData.selected[3])
              .then(hqRes => {
                getInfo.hqCompData.options = hqRes
              })
              .then(() => {
                getInfo
                  .branch(self.compData.selected[4])
                  .then(branchRes => {
                    getInfo.branchCompData.options = branchRes
                  })
                  .then(() => {
                    self.compData.listFilters = setComboBox(
                      getFilters(
                        [
                          self.$t("infoFilters")[0],
                          "PRODUCT NUM",
                          "DEVICE ID",
                          "SERIAL NUM",
                          self.$t("infoFilters")[1],
                          self.$t("infoFilters")[2],
                          self.$t("infoFilters")[3],
                          "DEVICE NAME(kor)",
                          "DEVICE NAME(eng)",
                          self.$t("infoFilters")[8],
                          self.$t("infoFilters")[11],
                          self.$t("infoFilters")[7]
                        ],
                        filtersJson
                      ),
                      self.compData.selected,
                      [
                        getInfo.enterpriseCompData,
                        getInfo.hqCompData,
                        getInfo.branchCompData,
                        getInfo.permission
                      ]
                    )
                  })
              })
          })
      })
  }
}
</script>

<style lang="sass" scoped></style>
