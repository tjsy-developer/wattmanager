<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import createAndEditFilters from "@/assets/jsons/info/enterprise/createAndEditFilters"
import getFilters from "@/assets/scripts/info/getFilters"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"

export default {
  layout: "main",
  data() {
    return {
      compData: {
        listTitle: this.$t("enterprise")[0],
        createAndEditTitle: this.$t("enterprise")[1],
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
        type: "create",
        createBtnClick() {
          const token = sessionStorage.getItem("jwt")

          btnsClick.create(
            this.listFilters,
            process.env.backendURL + "enterpriseRest/en_create",
            {
              alias: getInfo.getInputValue(0),
              alias_en: getInfo.getInputValue(1),
              quota_pc: Number(getInfo.getInputValue(2)),
              quota_glass: Number(getInfo.getInputValue(3)),
              quota_mobile: Number(getInfo.getInputValue(4)),
              order_by_num: parseFloat(getInfo.getInputValue(5)),
              storage: 1,
              jwt: token
            }
          )
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
      this.$t("listComp")[15]
    ])
  }
}
</script>

<style lang="sass" scoped></style>
