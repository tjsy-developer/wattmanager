<template>
  <div v-if="selected" class="row justify-center videoPlay">
    <div class="col-auto row">
      <div class="col column left">
        <div v-if="selected.videoCheck == 'preparing'" class="securityWrap" style="width: 100%; height: 500px; border: 1px solid #D9D9D9">
          <img class="col-auto" src="@/assets/images/videoSecurity.gif" />
          <span class="securityText" style="margin-top: 10px;">{{ $t("videoSecurity_1") }}</span>
          <span class="securityText">{{ $t("videoSecurity_2") }}</span>
        </div>
        <video
          v-else-if="selected.videoCheck != 'preparing' && useBento4 == true"
          class="col-auto"
          id="videoPlayer"
          :poster="selected.thumbnail"
          autoplay
          controls
          controlsList="nodownload"
        ></video>
        <video class="col-auto" :src="selected.video" id="videoPlayer" v-else :poster="selected.thumbnail" autoplay controls controlsList="nodownload"></video>
        <div class="col row leftContents content-start">
          <div class="col-12 row">
            <div class="col row items-center">
              <span>{{ selected.title?selected.title:"-" }}</span>
              <button @click="favoriteBtnClick">
                <img v-if="selected.favorite" src="@/assets/images/player_icon_pin_a.png" />
                <img v-else src="@/assets/images/player_icon_pin.png" />
              </button>
            </div>
            <div class="col-auto row content-end">
              <button class="row items-center" @click="shareBtnClick">
                <img src="@/assets/images/icon_share.png" />
                <span>{{ $t("listComp")[7] }}</span>
              </button>
              <button class="row items-center" @click="saveBtnClick">
                <img src="@/assets/images/icon_save.png" />
                <span>{{ $t("listComp")[8] }}</span>
              </button>
              <button class="row items-center" @click="editBtnClick">
                <img src="@/assets/images/icon_edit.png" />
                <span>{{ $t("infoFilters")[7] }}</span>
              </button>
              <button class="row items-center" @click="removeBtnClick">
                <img src="@/assets/images/icon_delete.png" />
                <span>{{ $t("createAndEditComp")[3] }}</span>
              </button>
            </div>
          </div>
          <div class="col-12 divisionLine"></div>
          <div class="col-12 row">
            <div class="col-12">
              <img src="@/assets/images/icon_class.png" />
              <span>{{ $t("listComp")[9] }}</span>
              <span>I</span>
              <span>{{ selected.code ? selected.code : "-" }}</span>
            </div>
            <div class="col-12">
              <img src="@/assets/images/icon_member.png" />
              <span>{{ $t("listComp")[10] }}</span>
              <span>I</span>
              <span>{{ selected.people }}</span>
            </div>
            <div class="col-12">
              <img src="@/assets/images/icon_member.png" />
              <span>{{ $t("listComp")[3] }}</span>
              <span>I</span>
              <span>{{ selected.hq + " " + selected.branch }}</span>
            </div>
            <div class="col-12">
              <img src="@/assets/images/icon_date.png" />
              <span>{{ $t("listComp")[11] }}</span>
              <span>I</span>
              <span>{{ getTimeZoneEndSeconds(selected.date) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-auto column content-start right">
        <div class="col-auto row items-end">
          <span>{{ $t("listComp")[4] }}</span>
          <span>{{ $t("videoPlayComp")[0] }}</span>
        </div>
        <div class="col-auto">
          <button v-for="filter in filters" :style="{ background:filter.isChicked?'#0061D1':'#D0D5E5' }" @click="filterBtnClick(filter)">{{ filter.name }}</button>
        </div>
        <div class="col-auto divisionLine"></div>
        <div class="col row content-start">
          <button
            v-if="rightListInfiniteScrollCompData.rightList"
            class="col-12 row content-start filteredContents items-center"
            v-for="(filteredContent, filteredContentKey) in rightListInfiniteScrollCompData.rightList"
            :key="filteredContentKey"
            @click="filteredContentBtnClick(filteredContent)"
          >
            <img class="col-auto" :src="filteredContent.thumbnail" />
            <div class="col row">
              <span class="col-12">{{ filteredContent.title ? filteredContent.title : "-" }}</span>
              <span class="col-12">{{ rightListViewPeople(filteredContent) }}</span>
              <span class="col-12">{{ filteredContent.code ? filteredContent.code : "-" }}</span>
              <span class="col-12">{{ getTimeZoneEndSeconds(filteredContent.date) }}</span>
            </div>
          </button>
          <rightListInfiniteScroll class="col-12" :compData="rightListInfiniteScrollCompData"></rightListInfiniteScroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MediaPlayer } from "dashjs"
import showShareModal from "@/assets/scripts/data/showShareModal"
import rightListInfiniteScroll from "@/components/data/rightListInfiniteScroll"
import favorite from "@/assets/scripts/data/favorite"
// import downloadWithAxios from "@/assets/scripts/data/downloadWithAxios"
import axiosJson from "@/assets/jsons/axios"
import fileDownload from "@/assets/scripts/data/download"


export default {
  components: { rightListInfiniteScroll },
  props: ["compData"],
  data() {
    return {
      useBento4: process.env.use_bento4,
      videoThumnailBlob: [],
      videoBlob: [],
      selected: undefined,
      editSaveAuth: 0,
      selectedCount: 0,
      filters: [
        { name: this.$t("listComp")[9], isChicked: true },
        { name: this.$t("listComp")[10], isChicked: true },
        { name: this.$t("listComp")[12], isChicked: true },
        { name: this.$t("listComp")[11], isChicked: true }
      ],
      rightListInfiniteScrollCompData: {
        rightBarListEnd: 0,
        axios: this.$axios,
        rightListThumnailBlob: [],
        rightList: [],
        isFilterBtnClick: false,
        canReset: true,
        getRightListDataUrl: axiosJson.attachment.att_sub_video_list,
        getRightListDataParams: undefined,
        async setRightListData(getListData) {
          const self = this
          console.log("getListData", getListData)
          console.log("setRightListData start")

          if (getListData.length === 0) {
            // getListData가 0일 경우 예외처리
            console.log("getListData Length 0 ! > rightBarListEnd")
            self.rightBarListEnd++
          }

          for (let i = 0; i < getListData.length; i++) {
            // get Thnumnail Image
            await self.axios
              .get(
                getListData[i].file_path +
                  "/capture_images/" +
                  getListData[i].file_name.split(".mp4")[0] +
                  ".png",
                {
                  responseType: "blob"
                }
              )
              // 예외처리
              .catch(function(error) {
                if (error.response) {
                  console.log(
                    "rightbar response error code: ",
                    error.response.status
                  )
                  if (error.response.status === 404) {
                    self.rightList.push({
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
                      favorite: false
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
                  // Thumnail Image Blob URL create
                  const blobURL = URL.createObjectURL(blobres.data)
                  // console.log("blobURL: " + i + " start : ", blobURL)

                  self.rightListThumnailBlob.push(blobURL)

                  self.rightList.push({
                    seq: getListData[i].att_seq,
                    video:
                      getListData[i].file_path + "/" + getListData[i].file_name,
                    thumbnail:
                      self.rightListThumnailBlob[
                        self.rightListThumnailBlob.length - 1
                      ],
                    title: getListData[i].title,
                    code: getListData[i].category,
                    people: getListData[i].joined_members,
                    hq: getListData[i].hq_alias,
                    branch: getListData[i].br_alias,
                    date: getListData[i].save_time,
                    favorite: false
                  })
                }
              })
            // 마지막 일 경우 체크
            if (i === getListData.length - 1) {
              if (self.rightBarListEnd === 0) {
                console.log("getListData Last ! > rightBarListEnd")
                self.rightBarListEnd++
              }
            }
          }
          console.log("setRightListData end")
          console.log(self.getRightListDataParams)
          // }
        }
      }
    }
  },
  computed: {
    rightListViewPeople() {
      return e => {
        if (e.people) {
          const val = e.people.indexOf(",")
          if (val > -1) {
            const people = e.people.split(",")
            // eslint-disable-next-line eqeqeq
            return this.$t("listComp2", [people[0], people.length - 1])
          } else {
            return e.people
          }
        } else {
          return "No Members"
        }
      }
    },
    getRightBarListEnd() {
      return this.rightListInfiniteScrollCompData.rightBarListEnd
    }
  },
  methods: {
    setRightListDataParams() {
      console.log("setRightListDataParams")
      // alert(this.selected.date)
      // console.log(this.getTimeZoneEndMonth(this.selected.date))
      const dateArr = this.getTimeZoneEndMonth(this.selected.date).split("-")
      const dateYear = dateArr[0]
      const dateMonth = dateArr[1]

      this.rightListInfiniteScrollCompData.getRightListDataParams = {
        keyword: this.selected.seq,
        order_by_column: "",
        order_by_status: "",
        page: 0,
        category: this.filters[0].isChicked
          ? this.selected.code
            ? [this.selected.code]
            : []
          : [],
        joined_members: this.filters[1].isChicked ? [this.selected.people] : [],
        title: this.filters[2].isChicked ? [this.selected.title] : [],
        save_time: this.filters[3].isChicked
          ? [
              [
                this.createStartTimeStemp(dateYear, dateMonth),
                this.createEndTimeStemp(dateYear, dateMonth)
              ]
            ]
          : []
      }
    },
    getSelected() {
      const getSeq = Number(this.$route.query.seq)
      if (!getSeq) {
        return
      }
      const token = localStorage.getItem("jwt")
      const self = this
      console.log("getSelected !!")
      this.$axios
        .post(process.env.backendURL + axiosJson.attachment.att_info_one, {
          att_seq: getSeq,
          jwt: token
        })
        .then(function(res) {
          if (!res.data.length) history.back()
          if (
            // eslint-disable-next-line eqeqeq
            self.$route.name != "attachment-picture" &&
            // eslint-disable-next-line eqeqeq
            res.data[0].file_type != "video"
          )
            history.back()

          /* preparing - 암호화 이미지 보여주는 부분 */
          if (self.selected === undefined) {
            // console.log("selected undefined")
            self.selected = {
              seq: res.data[0].att_seq,
              videoCheck: "preparing",
              video: res.data[0].file_path + "/" + res.data[0].file_name,
              thumbnail:
                res.data[0].file_path +
                "/capture_images/" +
                res.data[0].file_name.split(".mp4")[0] +
                ".png",
              title: res.data[0].title,
              code: res.data[0].category,
              people: res.data[0].joined_members,
              hq: res.data[0].hq_alias,
              branch: res.data[0].br_alias,
              date: res.data[0].save_time,
              favorite: res.data[0].favYN !== "0",
              fileName: res.data[0].file_name,
              videoName: res.data[0].file_path + "/" + res.data[0].file_name
            }

            self.compData.isVideoPlayDataLoaded = true
            self.setRightListDataParams()
          } else if (
            self.selected !== undefined &&
            self.selected.videoCheck !== "success"
          ) {
            // console.log("selected.videoCheck", self.selected.videoCheck)
            self.selected = {
              seq: res.data[0].att_seq,
              videoCheck: "preparing",
              video: res.data[0].file_path + "/" + res.data[0].file_name,
              thumbnail:
                res.data[0].file_path +
                "/capture_images/" +
                res.data[0].file_name.split(".mp4")[0] +
                ".png",
              title: res.data[0].title,
              code: res.data[0].category,
              people: res.data[0].joined_members,
              hq: res.data[0].hq_alias,
              branch: res.data[0].br_alias,
              date: res.data[0].save_time,
              favorite: res.data[0].favYN !== "0",
              fileName: res.data[0].file_name,
              videoName: res.data[0].file_path + "/" + res.data[0].file_name
            }

            self.compData.isVideoPlayDataLoaded = true
            self.setRightListDataParams()
          }
        })
        .catch(function(error) {
          console.log("videoplay.vue getSelected error : ", error)
        })
    },
    filterBtnClick(filter) {
      if (this.rightListInfiniteScrollCompData.canReset) {
        this.rightListInfiniteScrollCompData.canReset = false
        if (filter.isChicked) filter.isChicked = false
        else filter.isChicked = true

        if (this.rightListInfiniteScrollCompData.isFilterBtnClick)
          this.rightListInfiniteScrollCompData.isFilterBtnClick = false
        else this.rightListInfiniteScrollCompData.isFilterBtnClick = true
        this.rightListInfiniteScrollCompData.rightList = []
        this.setRightListDataParams()
        this.rightListInfiniteScrollCompData.getRightListDataParams.page = 999
      }
    },
    favoriteBtnClick() {
      if (this.selected.favorite) {
        this.selected.favorite = false
        favorite.remove(this.selected.seq, this)
      } else {
        this.selected.favorite = true
        favorite.add(this.selected.seq)
      }
    },
    shareBtnClick() {
      showShareModal(this.$modal, location.href)
    },
    saveBtnClick(e) {
      fileDownload(this.selected, this)
    },
    editBtnClick() {
      console.log("editBtnClick")
      window.open(
        "./attachment/video/edit?seq=" + this.$route.query.seq,
        "_self"
      )
    },
    removeBtnClick(e) {
      const self = this
      const token = localStorage.getItem("jwt")
      const result = confirm(self.$t("listComp")[18])
      console.log(result)
      if (result) {
        self.$axios
          .post(process.env.backendURL + axiosJson.attachment.att_delete, {
            att_seq: parseInt(this.$route.query.seq),
            jwt: token
          })
          .then(function(res) {
            if (res) {
              alert(self.$t("listComp")[14])
              window.location.href = document.referrer
            } else alert(self.$t("listComp")[15])
          })
          .catch(function(error) {
            console.log("list.vue removeBtnClick error : ", error)
            alert(self.$t("listComp")[15])
          })
      } else {
      }
    },
    getPageNumber(seq) {
      return this.$axios
        .post(
          process.env.backendURL + axiosJson.attachment.att_return_page_number,
          {
            att_seq: seq,
            jwt: localStorage.getItem("jwt")
          }
        )
        .then(response => {
          return response.data
        })
        .catch(err => {
          console.log("videoPlay.vue filteredContentBtnClick error", err)
        })
    },
    filteredContentBtnClick(e) {
      const getViewType = this.$route.query.viewType

      this.getPageNumber(e.seq).then(response => {
        if (response)
          open(
            location.origin +
              "/attachment/video?page=" +
              response +
              "&viewType=" +
              getViewType +
              "&seq=" +
              e.seq,
            "_self"
          )
      })
    },
    createStartTimeStemp(year, month) {
      // month는 0베이스이다. 그래서 -1을 해줘야한다
      const now = new Date(year, month - 1)
      // // const standard = now.getTime() / 1000 + now.getTimezoneOffset() * 60
      const standard = now.getTime() / 1000
      const returnDate = Math.round(standard)
      return returnDate
    },
    createEndTimeStemp(year, month) {
      // month는 0베이스이다. 그래서 -1을 해줘야하지만, 해당 월의 마지막 시간을 구하는 것이기에 -1을 해주지 않음
      const date = new Date(year, month)
      // date.setDate(new Date(year, month, 0).getDate())
      const standard = date.getTime() / 1000 // 밀리초를 초 형식으로 변환
      return Math.round(standard - 1)
    },
    getTimeZoneEndSeconds(standard) {
      const now = new Date(Number(standard) * 1000)
      const month = ("0" + (now.getMonth() + 1)).slice(-2)
      const date = ("0" + now.getDate()).slice(-2)
      const hours = ("0" + now.getHours()).slice(-2)
      const minutes = ("0" + now.getMinutes()).slice(-2)
      const seconds = ("0" + now.getSeconds()).slice(-2)

      const convertToDate =
        now.getFullYear() +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds

      return convertToDate
    },
    getTimeZoneEndMonth(standard) {
      const now = new Date(Number(standard) * 1000)
      const month = ("0" + (now.getMonth() + 1)).slice(-2)

      const convertToDate = now.getFullYear() + "-" + month

      return convertToDate
    }
  },
  mounted() {
    console.log("videoPlay mounted !!")
    // const self = this
    // const getQuery = this.$route.query
    // if (getQuery.seq)
    //   this.getPageNumber(Number(getQuery.seq)).then(response => {
    //     // eslint-disable-next-line eqeqeq
    //     alert("mounted")
    //     // eslint-disable-next-line eqeqeq
    //     if (response && getQuery.page != response) {
    //       self.getSelected()
    //       // open(
    //       //   location.origin +
    //       //     "/attachment/video?page=" +
    //       //     response +
    //       //     "&viewType=" +
    //       //     getQuery.viewType +
    //       //     "&seq=" +
    //       //     getQuery.seq,
    //       //   "_self"
    //       // )
    //     } else {
    //       self.getSelected()
    //     }
    //   })
    // console.log(this.rightListInfiniteScrollCompData.rightList)
    // setTimeout(function() {
    //   const index = self.compData.listData.findIndex(
    //     // eslint-disable-next-line eqeqeq
    //     i => i.seq == self.$route.query.seq
    //   )
    //   console.log(self.compData.listData[index].rate)
    //   self.editSaveAuth = self.compData.listData[index].rate
    // }, 400)
  },
  watch: {
    "compData.listData"() {
      const self = this
      const getQuery = this.$route.query
      if (getQuery.seq)
        this.getPageNumber(Number(getQuery.seq)).then(response => {
          // eslint-disable-next-line eqeqeq
          // eslint-disable-next-line eqeqeq
          if (response && getQuery.page != response) {
            // self.getSelected()
            open(
              location.origin +
                "/attachment/video?page=" +
                response +
                "&viewType=" +
                getQuery.viewType +
                "&seq=" +
                getQuery.seq,
              "_self"
            )
          } else if (this.selectedCount === 0) {
            // 한번만 실행하기 위해서 0일 경우에만 실행한다.
            this.selectedCount++
            // console.log("123456")
            self.getSelected()
          }
        })
    },
    getRightBarListEnd(result) {
      console.log("getRightBarListEnd Function !")
      if (result === 1) {
        const self = this
        // 썸네일 blob
        this.$axios
          .get(self.selected.thumbnail, {
            responseType: "blob"
          })
          // 예외처리
          .catch(function(error) {
            // 썸네일 이미지가 없어도, 영상을 불러와서 접근할 수 있도록 수정
            if (error.response) {
              console.log(
                "getSelected Video thumbnail response error code: ",
                error.response.status
              )
              if (error.response.status === 404) {
                // 영상의 소스를 삽입 하고, 썸네일은 공백으로 보낸다.

                // 파일명 추출
                const fileFullName = self.selected.video.split("/")
                // 이전에는 .으로 잘랐으나 비회원 계정 co.kr가 존재하므로 .mp4로 자른다
                const fileName = fileFullName[fileFullName.length - 1].split(
                  ".mp4"
                )[0]

                console.log(
                  "att_videoPlay url: " +
                    process.env.att_videoPlayPath +
                    fileName +
                    "/stream.mpd"
                )

                // self.selected.video를 이용하여 videoPlay 추가
                // streaming 영상 소스 삽입
                if (process.env.use_bento4) {
                  setTimeout(function() {
                    const url =
                      process.env.att_videoPlayPath + fileName + "/stream.mpd"
                    const player = MediaPlayer().create()
                    console.log(url)
                    player.initialize(
                      document.querySelector("#videoPlayer"),
                      url,
                      true
                    )
                    player.play()
                  }, 500)
                }

                self.selected.videoCheck = "success"
                self.selected.thumbnail = ""

                // self.$axios
                //   .get(self.selected.video, {
                //     responseType: "blob"
                //   })
                //   .then(function(blobres) {
                //     if (blobres) {
                //       // Thumnail Image Blob URL create
                //       const videoBlobURL = URL.createObjectURL(blobres.data)
                //       // console.log("blobURL: " + i + " start : ", blobURL)

                //       // console.log("videoBlobURL: ", videoBlobURL)
                //       self.videoBlob.push(videoBlobURL)

                //       self.selected.video = videoBlobURL
                //       self.selected.videoCheck = "success"
                //       self.selected.thumbnail = ""
                //     }
                //   })
              }
            } else if (error.request) {
              console.log("getSelected Video thumbnail request error")
            } else {
              console.log("getSelected Video thumbnail axios error: ", error)
            }
          })
          .then(function(blobres) {
            if (blobres) {
              // Thumnail Image Blob URL create
              const imageBlobURL = URL.createObjectURL(blobres.data)
              // console.log("blobURL: " + i + " start : ", blobURL)

              // console.log("imageBlob: ", imageBlobURL)
              self.videoThumnailBlob.push(imageBlobURL)
              self.selected.thumbnail = imageBlobURL

              // 파일명 추출
              const fileFullName = self.selected.video.split("/")
              // 이전에는 .으로 잘랐으나 비회원 계정 co.kr가 존재하므로 .mp4로 자른다
              const fileName = fileFullName[fileFullName.length - 1].split(
                ".mp4"
              )[0]

              console.log(
                "att_videoPlay url: " +
                  process.env.att_videoPlayPath +
                  fileName +
                  "/stream.mpd"
              )

              // streaming 영상 소스 삽입
              if (process.env.use_bento4) {
                setTimeout(function() {
                  const url =
                    process.env.att_videoPlayPath + fileName + "/stream.mpd"
                  const player = MediaPlayer().create()
                  console.log(url)
                  player.initialize(
                    document.querySelector("#videoPlayer"),
                    url,
                    true
                  )
                  player.play()
                }, 500)
              }

              self.selected.videoCheck = "success"

              // // 비디오 영상 blob
              // self.$axios
              //   .get(self.selected.video, {
              //     responseType: "blob"
              //   })
              //   .then(function(blobres) {
              //     if (blobres) {
              //       // Thumnail Image Blob URL create
              //       const videoBlobURL = URL.createObjectURL(blobres.data)
              //       // console.log("blobURL: " + i + " start : ", blobURL)

              //       // console.log("videoBlobURL: ", videoBlobURL)
              //       self.videoBlob.push(videoBlobURL)

              //       self.selected.video = videoBlobURL
              //       self.selected.videoCheck = "success"
              //       self.selected.thumbnail = imageBlobURL
              //     }
              //   })
            }
          })
      }
    }
  },
  beforeDestroy() {
    // blobURL remove
    console.log("videoThumnailBlob", this.videoThumnailBlob)
    if (this.videoThumnailBlob !== undefined) {
      if (this.videoThumnailBlob.length > 0) {
        for (let i = 0; i < this.videoThumnailBlob.length; i++) {
          console.log("revoke videoThumnailBlob")
          URL.revokeObjectURL(this.videoThumnailBlob[i])
        }
      }
    }

    // rightBar blobURL remove
    console.log("rightListThumnailBlob", this.rightListThumnailBlob)
    if (this.rightListThumnailBlob !== undefined) {
      if (this.rightListThumnailBlob.length > 0) {
        for (let i = 0; i < this.rightListThumnailBlob.length; i++) {
          console.log("revoke rightListThumnailBlob")
          URL.revokeObjectURL(this.rightListThumnailBlob[i])
        }
      }
    }

    // video blobURL remove
    // if (this.videoBlob.length > 0) {
    //   for (let i = 0; i < this.videoBlob.length; i++) {
    //     console.log("revoke videoBlob")
    //     URL.revokeObjectURL(this.videoBlob[i])
    //   }
    // }
  }
}
</script>

<style lang="sass" scoped>
.videoPlay
  width: 100%
  min-width: $contentMaxWidth
  background: white
  margin-top: 20px
  padding: 30px 0

.videoPlay>div
  width: $contentMaxWidth
  max-height: 720px

.left
  height: 100%

  >video
    width: 100%
    height: 500px
    background-color: black

  > .securityWrap > img
    width: 200px
    height: 200px
    position: relative
    margin-top: 80px
    margin-left: 40%

.securityText
  width: 100%
  height: 30px
  font-size: 16px
  text-align: center

.leftContents
  width: 100%
  border: 1px solid #D9D9D9
  padding: 25px

.left
  >div:nth-child(2)
    >div:nth-child(1)
      >div:nth-child(1)
        >span
          font-size: 20px
          font-weight: 800
          max-width: 90%
          +ellipsis

        >button
          margin-left: 5px

      >div:nth-child(2)
        margin-left: 15px
        font-size: 12px
        color: #6B6B6B

        >button
          margin-left: 15px
          font-size: 12px
          color: #6B6B6B

    >div:nth-child(3)
      font-size: 14px

      >div
        >img,
        >span
          padding-right: 5px

      >div:nth-child(1)
        margin-top: 18px

        >span:nth-child(4)
          max-width: 87%
          +ellipsis

      >div:nth-child(2)
        >span:nth-child(4)
          max-width: 87%
          +ellipsis

      >div:nth-child(3)
        >span:nth-child(4)
          max-width: 87%
          +ellipsis

      >div:nth-child(2),
      >div:nth-child(3),
      >div:nth-child(4)
        margin-top: 10px

.divisionLine
  height: 1px !important
  background: #D9D9D9
  margin-top: 10px

.right
  width: 370px
  height: 100%
  padding: 30px 10px 0 30px
  border: 1px solid #D9D9D9

.right>div
  width: 100%

.right>div:nth-child(1)>span:nth-child(1)
  font-size: 18px
  font-weight: 800

.right>div:nth-child(1)>span:nth-child(2)
  font-size: 10px
  color: #9F9F9F
  margin-left: 8px
  padding-bottom: 3px

.right>div:nth-child(2)
  margin-top: 10px

.right>div:nth-child(2)>button
  width: 60px
  font-size: 10px
  padding: 4px 0
  margin-right: 5px
  color: white
  border-radius: 20px

.filteredContents:not(:first-child)
  margin-top: 20px

.filteredContents
  max-height: 80px

  >img
    width: 140px
    height: 100%
    object-fit: cover

  >div
    height: 100%

    >span
      font-size: 12px
      text-align: left
      +ellipsis
      padding: 0 10px

      &:not(:first-child)
        margin-top: 2px

      &:nth-child(1)
        color: #0061D1
        font-weight: 800

      &:nth-child(4)
        font-size: 11px
        color: #9F9F9F

.right>div:last-child
  margin: 20px 0 15px
  overflow-y: auto
  &::-webkit-scrollbar
    width: 5px
  &::-webkit-scrollbar-track
    background-color: #F2F2F2
    border-radius: 3px
  &::-webkit-scrollbar-thumb
    background-color: #DBDBDB
    outline: 1px solid slategrey
    border-radius: 3px
</style>
