<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import createFiltersJson from "@/assets/jsons/info/branch/createFilters"
// import getFilters from "@/assets/scripts/info/getFilters"
import setComboBox from "@/assets/scripts/info/setComboBox"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"
import domain from "@/assets/jsons/domain/domain"

export default {
  layout: "main",
  data() {
    return {
      compData: {
        listTitle: this.$t("branch")[0],
        createAndEditTitle: this.$t("branch")[1],
        listFilters: undefined,
        createAndEditSpanSize: 120,
        type: "create",
        createBtnClick() {
          const token = localStorage.getItem("jwt")
          console.log(this.listFilters)
          btnsClick.create(
            this.listFilters,
            domain.domain.backend1 + "branchRest/br_create",
            {
              alias: getInfo.getInputValue(0),
              alias_en: getInfo.getInputValue(1),
              en_seq: getInfo.getSelectValue(this.listFilters, 1),
              hq_seq: getInfo.getSelectValue(this.listFilters, 2),
              order_by_num: Number(getInfo.getInputValue(2)),
              jwt: token
            }
          )
        }
      }
    }
  },
  mounted() {
    getInfo.setLang(this.$t("getInfo"))
    btnsClick.setLang([
      this.$t("btnsClick")[0],
      this.$t("btnsClick")[1],
      this.$t("account")[6],
      this.$t("attachment")[1],
      this.$t("attachment")[2],
      this.$t("listComp")[14],
      this.$t("listComp")[15]
    ])

    const self = this
    getInfo
      .enterprise()
      .then(enterpriseRes => {
        getInfo.enterpriseCompData.options = enterpriseRes
      })
      .then(() => {
        self.compData.listFilters = setComboBox(createFiltersJson, undefined, [
          getInfo.enterpriseCompData,
          getInfo.hqCompData
        ])
      })
  }
}
</script>

<style lang="sass" scoped></style>
