<template>
  <div class="row content-start data">
    <dataSearchBar></dataSearchBar>
    <dataList :compData="compData"></dataList>
  </div>
</template>

<script>
import axiosJson from "@/assets/jsons/axios";
import setGetListDataParamsFilters from "@/assets/scripts/data/setGetListDataParamsFilters";
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams";

export default {
  layout: "main",
  data() {
    return {
      compData: {
        axios: this.$axios,
        blobPictureURL: [],
        listData: [],
        getListDataUrl: axiosJson.attachment.att_pic_list,
        getListCountUrl: axiosJson.attachment.att_pic_list_count,
        getListDataParams: {
          keyword: "",
          order_by_column: "",
          order_by_status: "",
          page: 0,
          joined_members: [],
          category: [],
          hq_alias: [],
          save_time: []
        },
        async setListData(getListData) {
          const self = this
          for (let i = 0; i < getListData.length; i++){
            // get Thnumnail Image
            await this.axios
              .get(getListData[i].file_path + "/" + getListData[i].file_name
                + `?token=${sessionStorage.getItem("jwt")}`,
                {
                  timeout: 1000,
                  responseType: "blob"
                }
              )
              // 예외처리
              .catch(function(error) {
                if (error.response) {
                  console.log("response error code: ", error.response.status)
                  if (error.response.status === 404) {
                    self.listData.push({
                      seq: getListData[i].att_seq,
                      img: require("@/assets/images/attach_noImage.png"),
                      title: getListData[i].title,
                      code: getListData[i].category,
                      people: getListData[i].joined_members,
                      hq: getListData[i].hq_alias,
                      branch: getListData[i].br_alias,
                      date: getListData[i].save_time,
                      favorite: getListData[i].favYN !== "0",
                      rate: 100
                    })
                  }
                } else if (error.request) {
                  console.log("request error")
                  console.log(`picture request error : ${error.request}`)
                    console.log(`picture request error status : ${error.request.status}`)
                    if (error.request.status == 0){
                      self.listData.push({
                      seq: getListData[i].att_seq,
                      img: require("@/assets/images/attach_noImage.png"),
                      title: getListData[i].title,
                      code: getListData[i].category,
                      people: getListData[i].joined_members,
                      hq: getListData[i].hq_alias,
                      branch: getListData[i].br_alias,
                      date: getListData[i].save_time,
                      favorite: getListData[i].favYN !== "0",
                      rate: 100
                    })
                    }
                } else {
                  console.log("picture index axios error: ", error)
                }
              })
              .then(function(blobres) {
                if (blobres) {
                  // picture Blob URL create
                  const blobURL = URL.createObjectURL(blobres.data)
                  // console.log("blobURL: " + i + " start : ", blobURL)

                  // blobPictureURL Array
                  self.blobPictureURL.push(blobURL)

                  self.listData.push({
                    seq: getListData[i].att_seq,
                    imgName:
                      getListData[i].file_path + "/" + getListData[i].file_name,
                    img: self.blobPictureURL[self.blobPictureURL.length - 1],
                    originalBlob: self.blobPictureURL[self.blobPictureURL.length - 1],
                    title: getListData[i].title,
                    code: getListData[i].category,
                    people: getListData[i].joined_members,
                    hq: getListData[i].hq_alias,
                    branch: getListData[i].br_alias,
                    date: getListData[i].save_time,
                    favorite: getListData[i].favYN !== "0",
                    rate: 100
                  })
                }
              })
          }
        }
      }
    }
  },
  mounted() {
    
    setGetListDataParams(this.$route.query, this.compData.getListDataParams)
    setGetListDataParamsFilters(this.compData.getListDataParams)
  },
  beforeDestroy() {
    if (this.blobPictureURL !== undefined) {
      if (this.blobPictureURL.length > 0) {
        for (let i = 0; i < this.blobPictureURL.length; i++) {
          URL.revokeObjectURL(this.blobPictureURL[i])
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"

.data
  width: 100%
  min-height: $contentHeight
  background: $contentBackground
</style>
