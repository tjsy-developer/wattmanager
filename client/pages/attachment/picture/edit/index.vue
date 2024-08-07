<template>
  <infoCreateAndEdit :compData="compData"></infoCreateAndEdit>
</template>

<script>
import filtersJson from "@/assets/jsons/data/filters"
import getFilters from "@/assets/scripts/info/getFilters"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"
import axiosJson from "@/assets/jsons/axios"


export default {
  layout: "main",
  data() {
    return {
      blobPictureURL: [],
      compData: {
        axios: this.$axios,
        self: this,
        attSeq: Number(this.$route.query.seq),
        listFilters: filtersJson,
        createAndEditSpanSize: 120,
        type: "pictureEdit",
        selected: [],
        editBtnClick() {
          // if (getInfo.getInputValue(0) == "")
          // 	return alert(this.$t("attachment")[0])
          // const getSelf = this.self
          // 변경 했음
          const getSelf = this.self
          if (getInfo.getInputValue(0) === "")
            return alert(getSelf.$t("attachment")[0])
          this.axios
            .post(process.env.backendURL + axiosJson.attachment.att_update, {
              att_seq: this.attSeq,
              title: getInfo.getInputValue(0),
              category: getInfo.getInputValue(1),
              jwt: sessionStorage.getItem("jwt")
            })
            .then(function(res) {
              if (res) {
                alert(getSelf.$t("attachment")[1])
                window.history.back()
              } else alert(getSelf.$t("attachment")[2])
            })
            .catch(function(error) {
              console.log("picture edit error : ", error)
              alert(getSelf.$t("attachment")[2])
            })
        },
        deleteBtnClick() {
          const result = confirm(btnsClick.lang[7])
          if (result) {
            btnsClick.delete(process.env.backendURL + "attRest/att_delete", {
              att_seq: this.attSeq,
              jwt: sessionStorage.getItem("jwt")
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
    this.refreshToken()
    if (sessionStorage.auth) {
      const self = this
      this.$axios
        .post(process.env.backendURL + axiosJson.attachment.att_info_one, {
          att_seq: self.compData.attSeq,
          jwt: sessionStorage.getItem("jwt")
        })
        .then(function(res) {
          self.compData.axios
            .get(res.data[0].file_path + "/" + res.data[0].file_name, {
              responseType: "blob"
            })
            .then(function(blobres) {
              if (blobres) {
                // picture Blob URL create
                const blobURL = URL.createObjectURL(blobres.data)
                // console.log("blobURL: ", blobURL)

                // blobPictureURL Array
                self.blobPictureURL.push(blobURL)

                self.compData.selected = [
                  self.blobPictureURL[self.blobPictureURL.length - 1],
                  res.data[0].title,
                  res.data[0].category,
                  res.data[0].joined_members,
                  res.data[0].hq_alias + " " + res.data[0].br_alias,
                  res.data[0].save_time
                ]
              }
            })
        })
        .catch(function(error) {
          console.log("picture edit page error : ", error)
        })
    }
  },
  beforeDestroy() {
    if (this.blobPictureURL.length > 0) {
      for (let i = 0; i < this.blobPictureURL.length; i++) {
        URL.revokeObjectURL(this.blobPictureURL[i])
      }
    }
  }
}
</script>

<style lang="sass" scoped></style>
