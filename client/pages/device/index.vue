<template>
  <infoForm :compData="compData"></infoForm>
</template>

<script>
import filtersJson from "@/assets/jsons/info/device/filters"
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import getFilters from "@/assets/scripts/info/getFilters"
import axiosJson from "@/assets/jsons/axios"

export default {
  layout: "main",
  data() {
    return {
      compData: {
        title: this.$t("device")[2],
        listTitle: this.$t("device")[0],
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            "DEVICE NAME",
            "DEVICE ID",
            "SERIAL NUM",
            this.$t("infoFilters")[1],
            this.$t("infoFilters")[2],
            this.$t("infoFilters")[3],
            this.$t("infoFilters")[8],
            this.$t("infoFilters")[11],
            this.$t("infoFilters")[7]
          ],
          filtersJson
        ),
        listData: [],
        deviceTypeList: [],
        getListDataUrl: axiosJson.device.dev_list,
        getListCountUrl: axiosJson.device.dev_list_count,
        getListDataParams: {
          keyword: "",
          order_by_column: "",
          order_by_status: "",
          page: 0
        },
        self: this,
        setListData(getListData) {
          for (let i = 0; i < getListData.length; i++) {
            this.listData.push([
              this.self.$i18n.locale === "ko"
                ? getListData[i].device_name
                : getListData[i].device_name_en,
              getListData[i].device_id,
              getListData[i].serial_num,
              getListData[i].en_alias,
              getListData[i].hq_alias,
              getListData[i].br_alias,
              getListData[i].approval_status === 1
                ? this.self.$t("getInfo")[11]
                : this.self.$t("getInfo")[10],
              getListData[i].order_by_num,
              {
                seq: getListData[i].dev_seq,
                auth: true
              }
            ])
            this.deviceTypeList.push(getListData[i].device_type)
          }
        }
      }
    }
  },
  mounted() {
    
    setGetListDataParams(this.$route.query, this.compData.getListDataParams)
  }
}
</script>

<style lang="sass" scoped></style>
