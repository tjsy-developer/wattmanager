<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import filtersJson from "@/assets/jsons/info/branch/filters"
import getFilters from "@/assets/scripts/info/getFilters"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"
import axiosJson from "@/assets/jsons/axios"
import domain from "@/assets/jsons/domain/domain"

export default {
  layout: "main",
  data() {
    return {
      compData: {
        brSeq: Number(this.$route.query.seq),
        listTitle: this.$t("branch")[0],
        createAndEditTitle: this.$t("branch")[2],
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            this.$t("infoFilters")[13],
            "Alias",
            "Alias_EN",
            this.$t("infoFilters")[11],
            this.$t("infoFilters")[7]
          ],
          filtersJson
        ),
        createAndEditSpanSize: 172,
        type: "edit",
        selected: [],
        editBtnClick() {
          const token = localStorage.getItem("jwt")
          btnsClick.edit(
            this.listFilters,
            domain.domain.backend1 + "branchRest/br_update",
            {
              br_seq: this.selected[4],
              alias: getInfo.getInputValue(1),
              alias_en: getInfo.getInputValue(2),
              hq_seq: this.selected[5],
              order_by_num: Number(getInfo.getInputValue(3)),
              jwt: token
            }
          )
        },
        deleteBtnClick() {
          const token = localStorage.getItem("jwt")
          const result = confirm(btnsClick.lang[7])
          if (result) {
            btnsClick.delete(domain.domain.backend1 + "branchRest/br_delete", {
              br_seq: this.brSeq,
              jwt: token
            })
          } else {
          }
        }
      }
    }
  },
  mounted() {
    btnsClick.setLang([
      this.$t("btnsClick")[0],
      this.$t("btnsClick")[1],
      this.$t("account")[6],
      this.$t("attachment")[1],
      this.$t("attachment")[2],
      this.$t("listComp")[14],
      this.$t("listComp")[15],
      this.$t("branch")[4]
    ])

    const self = this
    this.$axios
      .post(domain.domain.backend1 + axiosJson.branch.br_info_one, {
        br_seq: self.compData.brSeq,
        jwt: localStorage.getItem("jwt")
      })
      .then(function(res) {
        console.log(res)
        self.compData.selected = [
          res.data[0].en_alias + " " + res.data[0].hq_alias,
          res.data[0].alias,
          res.data[0].alias_en,
          res.data[0].order_by_num,
          res.data[0].br_seq,
          res.data[0].hq_seq,
          res.data[0].en_seq
        ]
      })
      .catch(function(error) {
        console.log("branch edit page error : ", error)
      })
  }
}
</script>

<style lang="sass" scoped></style>
