<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import createAndEditFilters from "@/assets/jsons/info/enterprise/createAndEditFilters"
// import filtersJson from "@/assets/jsons/info/enterprise/filters"
import getFilters from "@/assets/scripts/info/getFilters"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"
import axiosJson from "@/assets/jsons/axios"


export default {
  layout: "main",
  data() {
    return {
      token: "",
      compData: {
        enSeq: Number(this.$route.query.seq),
        listTitle: this.$t("enterprise")[0],
        createAndEditTitle: this.$t("enterprise")[2],
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            "Alias",
            "Alias_EN",
            this.$t("quota")[0],
            this.$t("quota")[1],
            this.$t("quota")[2],
            this.$t("infoFilters")[11],
            this.$t("infoFilters")[7]
          ],
          createAndEditFilters
        ),
        createAndEditSpanSize: 120,
        type: "edit",
        selected: [],
        editBtnClick() {
          const token = sessionStorage.getItem("jwt")
          btnsClick.edit(
            this.listFilters,
            process.env.backendURL + "enterpriseRest/en_update",
            {
              en_seq: this.enSeq,
              alias: getInfo.getInputValue(0),
              alias_en: getInfo.getInputValue(1),
              quota_pc: Number(getInfo.getInputValue(2)),
              quota_glass: Number(getInfo.getInputValue(3)),
              quota_mobile: Number(getInfo.getInputValue(4)),
              order_by_num: Number(getInfo.getInputValue(5)),
              storage: this.selected[6],
              jwt: token
            }
          )
        },
        deleteBtnClick() {
          const token = sessionStorage.getItem("jwt")
          const result = confirm(btnsClick.lang[7])
          if (result) {
            btnsClick.delete(
              process.env.backendURL + "enterpriseRest/en_delete",
              {
                en_seq: this.enSeq,
                jwt: token
              }
            )
          } else {
          }
        }
      }
    }
  },
  mounted() {
    this.refreshToken()
    btnsClick.setLang([
      this.$t("btnsClick")[0],
      this.$t("btnsClick")[1],
      this.$t("account")[6],
      this.$t("attachment")[1],
      this.$t("attachment")[2],
      this.$t("listComp")[14],
      this.$t("listComp")[16],
      this.$t("enterprise")[4]
    ])
    const self = this
    this.$axios
      .post(process.env.backendURL + axiosJson.enterprise.en_info_one, {
        en_seq: self.compData.enSeq,
        jwt: sessionStorage.getItem("jwt")
      })
      .then(function(res) {
        console.log(res.data)
        self.compData.selected = [
          res.data[0].alias,
          res.data[0].alias_en,
          res.data[0].quota_pc,
          res.data[0].quota_glass,
          res.data[0].quota_mobile,
          res.data[0].order_by_num,
          res.data[0].storage
        ]
      })
      .catch(function(error) {
        console.log("enterprise edit page error : ", error)
      })
  }
}
</script>

<style lang="sass" scoped></style>
