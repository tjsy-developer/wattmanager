<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import createAndEditFiltersJson from "@/assets/jsons/info/app/createAndEditFilters"
import getFilters from "@/assets/scripts/info/getFilters"
import setComboBox from "@/assets/scripts/info/setComboBox"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"


export default {
  layout: "main",
  data() {
    return {
      compData: {
        listTitle: this.$t("app")[0],
        createAndEditTitle: this.$t("app")[1],
        listFilters: undefined,
        createAndEditSpanSize: 143,
        type: "create",
        limitText: this.$t("Limit number of characters"),
        createBtnClick() {
          const token = sessionStorage.getItem("jwt")
          if (getInfo.getTextareaValue(0).length > 4000) {
            alert(this.limitText)
          } else {
            console.log(getInfo.getTextareaValue(0).length)
            btnsClick.create(
              this.listFilters,
              process.env.backendURL + "appRest/app_create",
              {
                app_code_seq: getInfo.getSelectValue(this.listFilters, 1),
                en_seq: getInfo.getSelectValue(this.listFilters, 2),
                hq_seq: getInfo.getSelectValue(this.listFilters, 3),
                br_seq: getInfo.getSelectValue(this.listFilters, 4),
                app_name_kor: getInfo.getInputValue(0),
                app_name_eng: getInfo.getInputValue(1),
                app_package_name: getInfo.getInputValue(2),
                app_version: getInfo.getInputValue(3),
                use_on_pc: parseInt(
                  getInfo.getSelectValue(this.listFilters, 9)
                ),
                use_on_glass: parseInt(
                  getInfo.getSelectValue(this.listFilters, 10)
                ),
                app_detail_json: getInfo.getTextareaValue(0),
                jwt: token
              }
            )
          }
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
      this.$t("listComp")[15],
      this.$t("app")[8]
    ])

    const self = this
    getInfo
      .appCode()
      .then(appCodeRes => {
        getInfo.appCodeCompData.options = appCodeRes
      })
      .then(() => {
        getInfo
          .enterprise()
          .then(enterpriseRes => {
            getInfo.enterpriseCompData.options = enterpriseRes
          })
          .then(() => {
            self.compData.listFilters = setComboBox(
              getFilters(
                [
                  self.$t("infoFilters")[0],
                  self.$t("infoCreateAndEditFilters")[0],
                  self.$t("infoFilters")[1],
                  self.$t("infoFilters")[2],
                  self.$t("infoFilters")[3],
                  self.$t("infoCreateAndEditFilters")[1],
                  self.$t("infoCreateAndEditFilters")[2],
                  self.$t("infoFilters")[5],
                  self.$t("infoFilters")[6],
                  self.$t("useOnPC"),
                  self.$t("useOnGlass"),
                  self.$t("appDetailJson"),
                  // self.$t("appDetailJsonUsage")
                ],
                createAndEditFiltersJson
              ),
              self.compData.selected,
              [
                getInfo.appCodeCompData,
                getInfo.enterpriseCompData,
                getInfo.hqCompData,
                getInfo.branchCompData,
                {
                  placeholder: self.$t("app")[4],
                  options: [
                    {
                      text: self.$t("app")[6],
                      en_text: self.$t("app")[6],
                      value: 1
                    },
                    {
                      text: self.$t("app")[7],
                      en_text: self.$t("app")[7],
                      value: 0
                    }
                  ],
                  selectedText: undefined,
                  selectedValue: undefined
                },
                {
                  placeholder: self.$t("app")[5],
                  options: [
                    {
                      text: self.$t("app")[6],
                      en_text: self.$t("app")[6],
                      value: 1
                    },
                    {
                      text: self.$t("app")[7],
                      en_text: self.$t("app")[7],
                      value: 0
                    }
                  ],
                  selectedText: undefined,
                  selectedValue: undefined
                },
                // {
                //   safety: self.$t("jsonExplanation")[0],
                //   daily: self.$t("jsonExplanation")[1],
                //   memo: self.$t("jsonExplanation")[2],
                //   tbm: self.$t("jsonExplanation")[3]
                // }
              ]
            )
          })
      })
  }
}
</script>

<style lang="sass" scoped></style>
