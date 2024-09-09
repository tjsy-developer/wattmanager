<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import filtersJson from "@/assets/jsons/info/hq/filters"
import getFilters from "@/assets/scripts/info/getFilters"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"
import axiosJson from "@/assets/jsons/axios"


export default {
  layout: "main",
  data() {
    return {
      compData: {
        hqSeq: Number(this.$route.query.seq),
        listTitle: this.$t("headquarters")[0],
        createAndEditTitle: this.$t("headquarters")[2],
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            this.$t("infoFilters")[12],
            "Alias",
            "Alias_EN",
            this.$t("infoFilters")[11],
            this.$t("infoFilters")[7]
          ],
          filtersJson
        ),
        createAndEditSpanSize: 120,
        type: "edit",
        selected: [],
        editBtnClick() {
          const token = sessionStorage.getItem("jwt")
          btnsClick.edit(
            this.listFilters,
            process.env.backendURL + "hqtsRest/hq_update",
            {
              hq_seq: this.hqSeq,
              alias: getInfo.getInputValue(1),
              alias_en: getInfo.getInputValue(2),
              en_seq: this.selected[4],
              order_by_num: Number(getInfo.getInputValue(3)),
              jwt: token
            }
          )
        },
        deleteBtnClick() {
          const token = sessionStorage.getItem("jwt")
          const result = confirm(btnsClick.lang[7])
          if (result) {
            btnsClick.delete(process.env.backendURL + "hqtsRest/hq_delete", {
              hq_seq: this.hqSeq,
              jwt: token
            })
          } else {
          }
        }
      }
    }
  },
  async mounted() {
    this.refreshToken()
    btnsClick.setLang([
      this.$t("btnsClick")[0],
      this.$t("btnsClick")[1],
      this.$t("account")[6],
      this.$t("attachment")[1],
      this.$t("attachment")[2],
      this.$t("listComp")[14],
      this.$t("listComp")[17],
      this.$t("headquarters")[4]
    ])

    const self = this
    const params = {
      data: {
        hq_seq: self.compData.hqSeq,
        jwt: sessionStorage.getItem("jwt")
      },
      api: process.env.backendURL + axiosJson.hq.hq_info_one
    }
    await this.axiosRequest('post', params)
      .then(function(res) {
        console.log(res.data)
        self.compData.selected = [
          res.data[0].en_alias,
          res.data[0].alias,
          res.data[0].alias_en,
          res.data[0].order_by_num,
          res.data[0].en_seq
        ]
      })
      .catch(function(error) {
        console.log("hq edit page error : ", error)
      })
  }
}
</script>

<style lang="sass" scoped></style>
