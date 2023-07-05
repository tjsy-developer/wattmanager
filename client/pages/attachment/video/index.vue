<template>
  <div class="row content-start video">
    <dataSearchBar></dataSearchBar>
    <dataVideoPlay :compData="compData"></dataVideoPlay>
    <dataList v-show="!$route.query.seq || $route.query.seq && compData.isVideoPlayDataLoaded" :compData="compData"></dataList>
  </div>
</template>

<script>
// import VueCookie from "vue-cookie"
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import setGetListDataParamsFilters from "@/assets/scripts/data/setGetListDataParamsFilters"
import axiosJson from "@/assets/jsons/axios"


export default {
  layout: "main",
  data() {
    return {
      authority: 0,
      deviceType: 0,
      compData: {
        blobImageURL: [],
        axios: this.$axios,
        listData: [],
        isVideoPlayDataLoaded: false,
        getListDataUrl: axiosJson.attachment.att_video_list,
        getListCountUrl: axiosJson.attachment.att_video_list_count,
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
        videolFileName: "",
        async setListData(getListData) {
          const self = this
          console.log(getListData)
          // listData init
          this.listData = []
          for (let i = 0; i < getListData.length; i++) {
            if (getListData[i].file_name.includes(".mp4")) {
              this.videolFileName = getListData[i].file_name.split(".mp4")[0]
            } else if (getListData[i].file_name.includes(".webm")) {
              this.videolFileName = getListData[i].file_name.split(".webm")[0]
            }
            if (getListData[i].rate >= 0 && getListData[i].rate < 100) {
              console.log("listData rate >= 0 || rate < 100")
              console.log("fileName", getListData[i].file_name)
              console.log(this.videolFileName)

              this.listData.push({
                seq: getListData[i].att_seq,
                video:
                  getListData[i].file_path + "/" + getListData[i].file_name,
                thumbnail:
                  getListData[i].file_path +
                  "/capture_images/" +
                  this.videolFileName +
                  ".png",
                title: getListData[i].title,
                code: getListData[i].category,
                people: getListData[i].joined_members,
                hq: getListData[i].hq_alias,
                branch: getListData[i].br_alias,
                date: getListData[i].save_time,
                favorite: getListData[i].favYN !== "0",
                rate: getListData[i].rate,
                videoName:
                  getListData[i].file_path + "/" + getListData[i].file_name,
                // recording_fail: "Y",
                recording_fail: getListData[i].recording_fail,
                // unique_roomid: "dsfasdf-12312ss-aaadd-12345667"
                unique_roomid: getListData[i].unique_roomid,
                running_time: getListData[i].running_time
              })
            } else if (getListData[i].rate === 100) {
              // get Thnumnail Image
              await this.axios
                .get(
                  getListData[i].file_path +
                    "/capture_images/" +
                    this.videolFileName +
                    ".png",
                  {
                    responseType: "blob"
                  }
                )
                // 예외처리
                .catch(function(error) {
                  if (error.response) {
                    console.log(
                      "video response error code: ",
                      error.response.status
                    )
                    if (error.response.status === 404) {
                      self.listData.push({
                        seq: getListData[i].att_seq,
                        video:
                          getListData[i].file_path +
                          "/" +
                          getListData[i].file_name,
                        thumbnail: require("@/assets/images/attach_noImage.png"),
                        title: getListData[i].title,
                        code: getListData[i].category,
                        people: getListData[i].joined_members,
                        hq: getListData[i].hq_alias,
                        branch: getListData[i].br_alias,
                        date: getListData[i].save_time,
                        favorite: getListData[i].favYN !== "0",
                        rate: getListData[i].rate,
                        running_time: getListData[i].running_time
                      })
                    }
                  } else if (error.request) {
                    console.log("video request error")
                  } else {
                    console.log("video index axios error: ", error)
                  }
                })
                .then(function(blobres) {
                  if (blobres) {
                    // Thumnail Image Blob URL create
                    const blobURL = URL.createObjectURL(blobres.data)
                    // console.log("blobURL: " + i + " start : ", blobURL)

                    // blobImage Array
                    self.blobImageURL.push(blobURL)

                    self.listData.push({
                      seq: getListData[i].att_seq,
                      video:
                        getListData[i].file_path +
                        "/" +
                        getListData[i].file_name,
                      thumbnail:
                        self.blobImageURL[self.blobImageURL.length - 1],
                      title: getListData[i].title,
                      code: getListData[i].category,
                      people: getListData[i].joined_members,
                      hq: getListData[i].hq_alias,
                      branch: getListData[i].br_alias,
                      date: getListData[i].save_time,
                      favorite: getListData[i].favYN !== "0",
                      rate: getListData[i].rate,
                      videoName:
                        getListData[i].file_path +
                        "/" +
                        getListData[i].file_name,
                      running_time: getListData[i].running_time
                    })
                  }
                })
            }
          }
        }
      }
    }
  },
  beforeMount() {
    this.authority = localStorage.getItem("auth")
    this.deviceType = localStorage.getItem("deviceType")
    // att_access_user = false 일 경우 일반 사용자 tab권한 없음 --> 삼성엔지니어링 요구사항
    // att_access_user = true 일 경우 기존 권한 조건
    // eslint-disable-next-line eqeqeq
    if (process.env.att_access_user === false && this.authority == 0) {
      // 일반사용자만 tab 권한 없음
      this.attViewAuth = true
    } else {
      // 1. att_access_user 이 true 이거나
      // 2. att_access_user 이 false 일경우 auth > 0 이라면 tab 권한 있음
      this.attViewAuth = false
    }

    if (this.deviceType === 2 || this.attViewAuth) {
      location.href = "/attachment/memo?page=1&viewType=gallery"
      // open("/attachment/memo?page=1&viewType=gallery", "_self")
    }
  },
  mounted() {
    setGetListDataParams(this.$route.query, this.compData.getListDataParams)
    setGetListDataParamsFilters(this.compData.getListDataParams)
  },
  beforeDestroy() {
    if (this.blobImageURL !== undefined) {
      if (this.blobImageURL.length > 0) {
        for (let i = 0; i < this.blobImageURL.length; i++) {
          URL.revokeObjectURL(this.blobImageURL[i])
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"

.video
  width: 100%
  min-height: $contentHeight
  background: $contentBackground
</style>
