<template>
  <infoForm :compData="compData"></infoForm>
</template>

<script>
import filtersJson from "@/assets/jsons/info/branch/listfilter"
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import getFilters from "@/assets/scripts/info/getFilters"
import axiosJson from "@/assets/jsons/axios"

export default {
  layout: "main",
  data() {
    return {
      compData: {
        title: this.$t("branch")[3],
        listTitle: this.$t("branch")[0],
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            "SEQ",
            this.$t("infoFilters")[13],
            "Alias",
            this.$t("infoFilters")[7]
          ],
          filtersJson
        ),
        self: this,
        listData: [],
        getListDataUrl: axiosJson.branch.br_list,
        getListCountUrl: axiosJson.branch.br_list_count,
        getListDataParams: {
          keyword: "",
          order_by_column: "",
          order_by_status: "",
          page: 0
        },
        setListData(getListData) {
          for (let i = 0; i < getListData.length; i++)
            this.listData.push([
              getListData[i].br_seq,
              this.self.$i18n.locale === "ko"
                ? getListData[i].en_alias + "(" + getListData[i].en_seq + ") + " + getListData[i].hq_alias + "(" + getListData[i].hq_seq + ")"
                : getListData[i].en_alias_en + "(" + getListData[i].en_seq + ") + " + getListData[i].hq_alias_en + "(" + getListData[i].hq_seq + ")",
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
