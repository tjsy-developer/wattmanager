<template>
  <infoForm :compData="compData"></infoForm>
</template>

<script>
import filtersJson from "@/assets/jsons/info/app/filters"
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import getFilters from "@/assets/scripts/info/getFilters"
import axiosJson from "@/assets/jsons/axios"
// 

export default {
  layout: "main",
  data() {
    return {
      compData: {
        title: this.$t("app")[3],
        listTitle: this.$t("app")[0],
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            this.$t("infoFilters")[1],
            this.$t("infoFilters")[2],
            this.$t("infoFilters")[3],
            this.$t("infoFilters")[4],
            this.$t("infoFilters")[5],
            this.$t("infoFilters")[6],
            this.$t("infoFilters")[7]
          ],
          filtersJson
        ),
        listData: [],
        getListDataUrl: axiosJson.app.app_list,
        getListCountUrl: axiosJson.app.app_list_count,
        getListDataParams: {
          keyword: "",
          order_by_column: "",
          order_by_status: "",
          page: 0
        },
        self: this,
        setListData(getListData) {
          for (let i = 0; i < getListData.length; i++)
            this.listData.push([
              getListData[i].en_alias,
              getListData[i].hq_alias,
              getListData[i].br_alias,
              this.self.$i18n.locale === "ko"
                ? getListData[i].app_name_kor
                : getListData[i].app_name_eng,
              getListData[i].app_package_name,
              getListData[i].app_version,
              {
                seq: getListData[i].app_seq,
                auth: true
              }
            ])
        },
        canCreate: true
      }
    }
  },
  mounted() {
    
    setGetListDataParams(this.$route.query, this.compData.getListDataParams)
  }
}
</script>

<style lang="sass" scoped></style>
