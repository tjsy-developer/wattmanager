<template>
  <infoForm :compData="compData"></infoForm>
</template>

<script>
import filtersJson from "@/assets/jsons/info/enterprise/filters"
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import getFilters from "@/assets/scripts/info/getFilters"
import axiosJson from "@/assets/jsons/axios"

export default {
  layout: "main",
  data() {
    return {
      compData: {
        title: this.$t("enterprise")[3],
        listTitle: this.$t("enterprise")[0],
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            "SEQ",
            "Alias",
            this.$t("infoFilters")[7]
          ],
          filtersJson
        ),
        self: this,
        listData: [],
        getListDataUrl: axiosJson.enterprise.en_list,
        getListCountUrl: axiosJson.enterprise.en_list_count,
        getListDataParams: {
          keyword: "",
          order_by_column: "",
          order_by_status: "",
          page: 0
        },
        setListData(getListData) {
          console.log(getListData)
          for (let i = 0; i < getListData.length; i++)
            this.listData.push([
              getListData[i].en_seq,
              this.self.$i18n.locale === "ko"
                ? getListData[i].alias
                : getListData[i].alias_en,
              {
                order_by_num: getListData[i].order_by_num,
                auth: false
              }
            ])
        },
        canCreate: true
      }
    }
  },
  mounted() {
    this.refreshToken()
    setGetListDataParams(this.$route.query, this.compData.getListDataParams)
  }
}
</script>

<style lang="sass" scoped></style>
