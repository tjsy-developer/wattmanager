<template lang="pug">
	.row.content-start.data
		dataSearchBar
		dataVideoPlay(:compData="compData")
		dataList(v-show="!$route.query.seq || $route.query.seq && compData.isVideoPlayDataLoaded", :compData="compData")
</template>

<script>
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import axiosJson from "@/assets/jsons/axios"

export default {
  layout: "main",
  data() {
    return {
      compData: {
        axios: this.$axios,
        blobPictureURL: [],
        blobThumbnailURL: [],
        listData: [],
        isVideoPlayDataLoaded: false,
        getListDataUrl: axiosJson.attachment.fav_list,
        getListCountUrl: axiosJson.attachment.fav_list_count,
        getListDataParams: {
          keyword: "",
          order_by_column: "",
          order_by_status: "",
          page: 0
        },
        async setListData(getListData) {
          const self = this
          for (let i = 0; i < getListData.length; i++) {
            let errorFlag = false
            if (getListData[i].file_type === "video") {
              // get blobThumbnailURL
              await this.axios
                .get(
                  getListData[i].file_path +
                    "/capture_images/" +
                    getListData[i].file_name.split(".")[0] +
                    ".png",
                  {
                    responseType: "blob"
                  }
                )
                // 예외처리
                .catch(function(error) {
                  if (error.response) {
                    console.log(
                      "favorite response error code: ",
                      error.response.status
                    )
                    if (error.response.status === 404) {
                      // error Flag -> 이것이 true 라면, 밑에서 push안하고 여기서 push한다.
                      errorFlag = true

                      self.listData.push({
                        seq: getListData[i].att_seq,
                        favSeq: getListData[i].fav_seq,
                        video:
                          getListData[i].file_path +
                          "/" +
                          getListData[i].file_name,
                        thumbnail: require("@/assets/images/attach_noImage.png"),
                        img: undefined,
                        title: getListData[i].title,
                        code: getListData[i].category,
                        people: getListData[i].joined_members,
                        hq: getListData[i].hq_alias,
                        branch: getListData[i].br_alias,
                        date: getListData[i].save_time,
                        fileType: getListData[i].file_type,
                        favorite: true
                      })
                    }
                  } else if (error.request) {
                    console.log("favorite request error")
                  } else {
                    console.log("favorite index axios error: ", error)
                  }
                })
                .then(function(blobres) {
                  if (blobres) {
                    // Thumbnail Blob URL create
                    const blobURL = URL.createObjectURL(blobres.data)
                    // console.log(
                    //   "Thumbnail blobURL: " + i + " start : ",
                    //   blobURL
                    // )

                    // blobThumbnailURL Array
                    self.blobThumbnailURL.push(blobURL)
                  }
                })
            } else if (getListData[i].file_type === "picture") {
              // get blobPictureURL
              await self.axios
                .get(
                  getListData[i].file_path + "/" + getListData[i].file_name,
                  {
                    responseType: "blob"
                  }
                )
                // 예외처리
                .catch(function(error) {
                  if (error.response) {
                    console.log(
                      "picture response error code: ",
                      error.response.status
                    )
                    if (error.response.status === 404) {
                      // error Flag -> 이것이 true 라면, 밑에서 push안하고 여기서 push한다.
                      errorFlag = true

                      self.listData.push({
                        seq: getListData[i].att_seq,
                        favSeq: getListData[i].fav_seq,
                        video: undefined,
                        thumbnail: undefined,
                        img: require("@/assets/images/attach_noImage.png"),
                        title: getListData[i].title,
                        code: getListData[i].category,
                        people: getListData[i].joined_members,
                        hq: getListData[i].hq_alias,
                        branch: getListData[i].br_alias,
                        date: getListData[i].save_time,
                        fileType: getListData[i].file_type,
                        favorite: true
                      })
                    }
                  } else if (error.request) {
                    console.log("request error")
                  } else {
                    console.log("picture index axios error: ", error)
                  }
                })
                .then(function(blobres) {
                  if (blobres) {
                    // picture Blob URL create
                    const blobURL = URL.createObjectURL(blobres.data)
                    console.log("picture blobURL: " + i + " start : ", blobURL)

                    // blobPictureURL Array
                    self.blobPictureURL.push(blobURL)
                  }
                })
            }

            // 에러가 아닐 경우에만 push
            if (!errorFlag) {
              this.listData.push({
                seq: getListData[i].att_seq,
                favSeq: getListData[i].fav_seq,
                video:
                  getListData[i].file_type === "video"
                    ? getListData[i].file_path + "/" + getListData[i].file_name
                    : undefined,
                videoName:
                  getListData[i].file_type === "video"
                    ? getListData[i].file_path + "/" + getListData[i].file_name
                    : undefined,
                thumbnail:
                  getListData[i].file_type === "video"
                    ? self.blobThumbnailURL[self.blobThumbnailURL.length - 1]
                    : undefined,
                img:
                  getListData[i].file_type === "picture"
                    ? self.blobPictureURL[self.blobPictureURL.length - 1]
                    : undefined,
                imgName:
                  getListData[i].file_type === "picture"
                    ? getListData[i].file_path + "/" + getListData[i].file_name
                    : undefined,
                title: getListData[i].title,
                code: getListData[i].category,
                people: getListData[i].joined_members,
                hq: getListData[i].hq_alias,
                branch: getListData[i].br_alias,
                date: getListData[i].save_time,
                fileType: getListData[i].file_type,
                favorite: true
              })
            }
          }
        }
      }
    }
  },
  mounted() {
    setGetListDataParams(this.$route.query, this.compData.getListDataParams)
  },
  beforeDestroy() {
    if (this.blobThumbnailURL !== undefined) {
      if (this.blobThumbnailURL.length > 0) {
        for (let i = 0; i < this.blobThumbnailURL.length; i++) {
          URL.revokeObjectURL(this.blobThumbnailURL[i])
        }
      }
    }

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
