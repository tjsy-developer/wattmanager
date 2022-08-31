<template lang="pug">
	infoCreateAndEdit(v-if="compData.selected", :compData="compData")
</template>

<script>
import filtersJson from "@/assets/jsons/data/filters"
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
        self: this,
        attSeq: Number(this.$route.query.seq),
        listFilters: filtersJson,
        createAndEditSpanSize: 120,
        type: "videoEdit",
        selected: undefined,
        axios: this.$axios,
        editBtnClick() {
          const getSelf = this.self
          if (getInfo.getInputValue(0) === "")
            return alert(getSelf.$t("attachment")[0])

          this.axios
            .post(domain.domain.backend1 + axiosJson.attachment.att_update, {
              att_seq: this.attSeq,
              title: getInfo.getInputValue(0),
              category: getInfo.getInputValue(1),
              jwt: localStorage.getItem("jwt")
            })
            .then(function(res) {
              if (res) {
                alert(getSelf.$t("attachment")[1])
                window.history.back()
              } else alert(getSelf.$t("attachment")[2])
            })
            .catch(function(error) {
              console.log("video edit error : ", error)
              alert(getSelf.$t("attachment")[2])
            })
        },
        deleteBtnClick() {
          const result = confirm(btnsClick.lang[7])
          if (result) {
            btnsClick.delete(domain.domain.backend1 + "attRest/att_delete", {
              att_seq: this.attSeq,
              jwt: localStorage.getItem("jwt")
            })
          } else {
          }
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
      this.$t("listComp")[15],
      this.$t("listComp")[18]
    ])

    getFilters(
      [
        this.$t("listComp")[12],
        this.$t("listComp")[9],
        this.$t("listComp")[10],
        this.$t("listComp")[3],
        this.$t("listComp")[11]
      ],
      filtersJson
    )
  },
  mounted() {
    if (localStorage.auth) {
      const self = this
      this.$axios
        .post(domain.domain.backend1 + axiosJson.attachment.att_info_one, {
          att_seq: self.compData.attSeq,
          jwt: localStorage.getItem("jwt")
        })
        .then(function(res) {
          self.compData.selected = [
            {
              src: res.data[0].file_path + "/" + res.data[0].file_name,
              thumbnail:
                res.data[0].file_path +
                "/capture_images/" +
                res.data[0].file_name.split(".")[0] +
                ".png"
            },
            res.data[0].title,
            res.data[0].category,
            res.data[0].joined_members,
            res.data[0].hq_alias + " " + res.data[0].br_alias,
            res.data[0].save_time
          ]
        })
        .catch(function(error) {
          console.log("video edit page error : ", error)
        })
    }
  }
}
</script>

<style lang="sass" scoped></style>
