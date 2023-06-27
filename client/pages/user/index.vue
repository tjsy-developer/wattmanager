<template>
  <infoForm :compData="compData"></infoForm>
</template>

<script>
import filtersJson from "@/assets/jsons/info/user/filters"
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import getFilters from "@/assets/scripts/info/getFilters"
import axiosJson from "@/assets/jsons/axios"

export default {
  layout: "main",
  data() {
    return {
      defaultUserProfileBlob: "",
      compData: {
        self: this,
        title: this.$t("user")[2],
        listTitle: this.$t("user")[0],
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            "ID",
            this.$t("infoFilters")[1],
            this.$t("infoFilters")[2],
            this.$t("infoFilters")[3],
            this.$t("infoFilters")[9],
            this.$t("infoFilters")[10],
            this.$t("infoFilters")[8],
            this.$t("infoFilters")[11],
            this.$t("infoFilters")[7],
          ],
          filtersJson
        ),
        listData: [],
        deviceTypeList: [],
        // getListDataUrl: axiosJson.user.user_list,
        // getListCountUrl: axiosJson.user.user_list_count,
        getListDataUrl: axiosJson.user.user_list,
        getListCountUrl: axiosJson.user.user_list_count,
        getListDataParams: {
          keyword: "",
          order_by_column: "",
          order_by_status: "",
          page: 0
        },
        setListData(getListData) {
          for (let i = 0; i < getListData.length; i++) {
            this.listData.push([
              getListData[i].id,
              getListData[i].en_alias,
              getListData[i].hq_alias,
              getListData[i].br_alias,
              getListData[i].name,
              getListData[i].auth === 0
                ? this.self.$t("getInfo")[5]
                : getListData[i].auth === 1
                ? this.self.$t("getInfo")[6]
                : getListData[i].auth === 2
                ? this.self.$t("getInfo")[7]
                : getListData[i].auth === 3
                ? this.self.$t("getInfo")[8]
                : getListData[i].auth === 4
                ? "와트"
                : "미확인",
              getListData[i].approval_status === 1
                ? this.self.$t("getInfo")[11]
                : this.self.$t("getInfo")[10],
              getListData[i].order_by_num,
              {
                seq: getListData[i].user_seq,
                auth: getListData[i].auth < localStorage.getItem("auth")
              }
            ])
            this.deviceTypeList.push(getListData[i].device_type)
          }
          console.log(this.listData)
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
