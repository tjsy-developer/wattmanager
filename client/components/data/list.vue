<template>
  <div class="row justify-center dataList">
    <div class="row justify-between items-center maxWidth">
      <span v-if="$route.name == 'attachment-video'" class="col-auto title">{{ $t("listComp")[0] }}</span>
      <span v-else-if="$route.name == 'attachment-picture'" class="col-auto title">{{ $t("listComp")[1] }}</span>
      <span v-else-if="$route.name == 'attachment-favorite'" class="col-auto title favoriteTitle">{{ $t("searchBarComp")[6] }}</span>
      <changeViewType v-if="$route.name != 'attachment-favorite'" class="col-auto"></changeViewType>
      <div v-if="$route.query.viewType == 'gallery' && $route.name != 'attachment-favorite'" class="col-12 row galleryView">
        <div class="row" v-for="(galleryContent, galleryContentKey) in compData.listData" :key="galleryContentKey">
          <div v-if="galleryContent.rate != 100 && $route.name == 'attachment-video'" class="col-12 contentImg">
            <div class="row justify-center items-center uploading">
              <div class="row col-12 justify-center">
                <p v-if="galleryContent.rate == 0 && galleryContent.recording_fail == null" class="col-12 galleryProgressText">{{ $t("Upload progress text")[0] }} <br> {{ $t("Upload progress text")[3] }}</p>
                <p v-else-if="galleryContent.rate == 0 && galleryContent.recording_fail == 'Y'" class="col-12 galleryProgressText">
                  {{ $t("Upload progress text")[5] }} <br>
                  {{ $t("Upload progress text")[6] }} <br>
                  <div v-if="galleryContent.recording_fail == 'Y'" style="margin-top: 10px" class="row justify-center items-center">
                    <button class="recordingBtn" @click="requestVideoRecording(galleryContent)">
                      <img class="recordingBtnIcon" src="@/assets/images/ic_reset.png" />
                      <span class="col-12 recordingBtnText">{{ $t("Upload progress text")[7] }}</span>
                    </button>
                  </div>
                </p>
                <p v-if="0 < galleryContent.rate &&galleryContent.rate < 90" class="col-12 galleryProgressText">{{ $t("Upload progress text")[1] }} <br> {{ $t("Upload progress text")[3] }}</p>
                <p v-if="90 <= galleryContent.rate" class="col-12 galleryProgressText">{{ $t("Upload progress text")[2] }} <br> {{ $t("Upload progress text")[4] }}</p>
                <div v-if="0 < galleryContent.rate && galleryContent.rate < 90 && galleryContent.recording_fail != 'Y'" class="row col-8 prog">
                  <div class="progs" id="progressing" :style='{width: galleryContent.rate + "%"}'></div>
                </div>
                <p v-if="0 < galleryContent.rate &&galleryContent.rate < 90" :style="{color: 60 <= galleryContent.rate ? 'white': 'black'}" class="col-12 gauge">{{ galleryContent.rate }} %</p>
              </div>
            </div>
          </div>
          <div v-else-if="galleryContent.rate == 100" class="col-12 contentImg" @mouseenter="contentImgMouseenter" @mouseleave="contentImgMouseleave">
            <div v-if="galleryContent.seq != $route.query.seq" class="row justify-center items-center contentImgHover">
              <button v-if="galleryContent.rate == 100" @click="editBtnClick(galleryContent)">
                <img src="@/assets/images/list_img_hover_icon_edit.png" />
              </button>
              <button @click="downloadBtnClick(galleryContent)">
                <img src="@/assets/images/list_img_hover_icon_download.png" />
              </button>
              <button v-if="$route.name == 'attachment-video'" @click="videoPlayBtnClick(galleryContent)">
                <img src="@/assets/images/list_img_hover_icon_play.png" />
              </button>
              <button v-else-if="$route.name == 'attachment-picture'" @click.exact="picturePlayBtnClick($event, galleryContent)">
                <img src="@/assets/images/list_img_hover_icon_preview.png" />
              </button>
              <button @click="removeBtnClick(galleryContent)">
                <img src="@/assets/images/list_img_hover_icon_delete.png" />
              </button>
            </div>
            <img v-if="$route.name == 'attachment-picture'" :src="galleryContent.img" />
            <img v-else-if="$route.name == 'attachment-video'" :src="galleryContent.thumbnail" />
            <div v-if="galleryContent.seq == $route.query.seq" class="col-12 row justify-center items-center galleryCurrentPlaying">
              <span v-if="$route.name == 'attachment-video'">{{ $t("listComp")[2] }}</span>
            </div>
          </div>
          <div class="col-12 row contentTextBox">
            <span class="col-12 galleryViewTitle">{{ galleryContent.title && galleryContent.title != " " ? galleryContent.title : $t("enter title") }}</span>
            <div class="col-12 galleryViewDivisionLine"></div>
            <span class="col-12 galleryViewPeople">{{ galleryViewPeople(galleryContent) }}</span>
            <span class="col-12 galleryViewBelong">{{ $t("listComp")[3] }} : {{ galleryContent.hq + " " + galleryContent.branch }}</span>
            <span class="col-12 galleryViewDate">
              {{ getTimeZoneEndSeconds(galleryContent.date) }} {{ galleryContent.running_time !== null && galleryContent.running_time !== undefined ? "(" + getTotalVideoTime(galleryContent.running_time) + ")" : ''}}
            </span>
            <img v-if="galleryContent.code" class="tagIcon" src="@/assets/images/ic_tag.png" />
            <span v-if="galleryContent.code" class="col-auto galleryViewCode">{{ galleryContent.code }}</span>
            <div v-else class="col-auto galleryViewCode">&nbsp</div>
          </div>
        </div>
      </div>
      <div v-else-if="$route.query.viewType == 'list' && $route.name != 'attachment-favorite'" class="col-12 row listView">
        <div class="col-12 row items-center filter">
          <div class="col-auto row items-center">
            <img src="@/assets/images/list_icon_filter_bk.png" />
            <span class="filterTitle">{{ $t("listComp")[4] }}</span>
          </div>
          <div class="col-auto row items-center">
            <button
              v-if="selectedFilter.group !== 'hq_alias' && selectedFilter.group !== 'en_alias'"
              class="col-auto row items-center filterBox"
              v-for="selectedFilter in selectedFilters"
						  @click="filterBoxBtnClick(selectedFilter)"
            >
              <span v-if="selectedFilter.group === 'br_alias'">
                {{ loginUserAuth < 4 ? selectedFilter.upperText + " " + selectedFilter.text :  selectedFilter.topUpperText + " " + selectedFilter.upperText + " " + selectedFilter.text}}
              </span>
              <span v-else>{{ selectedFilter.text || selectedFilter }}</span>
              <img class="filterBoxXIcon" src="@/assets/images/list_icon_filter_x.png" />
            </button>
          </div>
        </div>
        <div class="col-12 row items-center titleBar">
          <div class="col-auto row justify-center titleBarFilters" v-for="(titleBarFilter, titleBarFilterKey) in titleBarFilters" :key="titleBarFilterKey">
            <button @click="alignBtnClick(titleBarFilter)">
              <img v-if="$route.query.column == titleBarFilter.align.column && $route.query.status == 'asc'" class="alignIcon" src="@/assets/images/list_icon_arrow_up.png" :style="{opacity:$route.query.column == titleBarFilter.align.column ? 1 : 0.5}" />
              <img v-else, src="@/assets/images/list_icon_arrow_down.png" class="alignIcon" :style="{opacity:$route.query.column == titleBarFilter.align.column ? 1 : 0.5}" />
              <span class="titleText">{{ titleBarFilter.text }}</span>
            </button>
            <button v-if="titleBarFilter.filterList" @click="filterBtnClick(titleBarFilter, titleBarFilterKey)">
              <img src="@/assets/images/list_icon_filter_wh.png" />
            </button>
            <filterBox
              v-show="titleBarFilter.isFilterClicked"
              :compData="titleBarFilter.filterList"
              ref="childFilterBox"
              @dataSetting="setData"
              :selectedFilters="selectedFilters"
              :titleBarFilterKey="titleBarFilterKey"
              :getFilterListUrl="titleBarFilter.getFilterListUrl"
              :titleBarFilterAlign="titleBarFilter.align"
              v-click-outside="clickOutsideEvent"
            ></filterBox>
          </div>
        </div>
        <div class="col-12 row items-center listViewList" v-for="(listContent, listContentKey) in compData.listData" :key="listContentKey">
          <div v-if="listContent.rate !== 100 && listContent.seq != $route.query.seq" class="col-auto row items-center listViewUploading">
            <div v-if="listContent.seq != $route.query.seq" class="row justify-center items-center uploading" v-show="true">
              <div class="row col-12 justify-center">
                <p v-if="0 == listContent.rate && listContent.recording_fail != 'Y'" class="col-12 listProgressText">
                  {{ $t("Upload progress short text")[0] }} <br> {{ $t("Upload progress short text")[3] }}
                </p>
                <p v-else-if="listContent.rate == 0 && listContent.recording_fail == 'Y'" class="col-12 listProgressText">
                  {{ $t("Upload progress short text")[5] }} <br>
                  <div v-if="listContent.recording_fail == 'Y'" class="row justify-center items-center" style="margin-top: 4px">
                    <button class="listRecordingBtn" @click="requestVideoRecording(listContent)">
                      <img class="listRecordingBtnIcon" src="@/assets/images/ic_reset_14.png" />
                      <span class="col-12 listRecordingBtnText">{{ $t("Upload progress short text")[6] }}</span>
                    </button>
                  </div>
                </p>
                <p v-if="0 < listContent.rate && listContent.rate < 90" class="col-12 listProgressText">
                  {{ $t("Upload progress short text")[1] }} <br> {{ $t("Upload progress short text")[3] }}
                </p>
                <p v-if="90 <= listContent.rate" class="col-12 listProgressText">{{ $t("Upload progress short text")[2] }} <br> {{ $t("Upload progress short text")[4] }}</p>
                <div v-if="0 < listContent.rate && listContent.rate < 90" class="row col-9 prog" style="height: 12px; margin-top: 2px">
                  <div class="progs" id="progressing" :style='{width: listContent.rate + "%", "height": "12px"}'></div>
                  <p v-if="0 < listContent.rate && listContent.rate < 90" class="col-12 listProgressGage" :style="{color: 70 <= listContent.rate ? 'white': 'black'}">
                    {{ listContent.rate }} %
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="listContent.rate == 100 || listContent.seq == $route.query.seq" class="col-auto row items-center">
            <button
              class="listContentVideoBtn"
              @click="$route.name == 'attachment-video'? videoPlayBtnClick(listContent):$route.name == 'attachment-picture'?picturePlayBtnClick(undefined, listContent):undefined"
            >
              <img v-if="$route.name== 'attachment-picture'" class="listViewImg" :src="listContent.img" />
              <img v-else-if="$route.name== 'attachment-video'" class="listViewImg" :src="listContent.thumbnail" />
              <div v-if="listContent.seq == $route.query.seq" class="col-12 row justify-center items-center listCurrentPlaying">
                <span v-if="$route.name == 'attachment-video'">{{ $t("listComp")[5] }}</span>
              </div>
            </button>
          </div>
          <div class="col-auto column items-center listViewPeople">
            <span>{{ listViewPeople(listContent) }}</span>
          </div>
          <span class="col">{{ listContent.title?listContent.title:"-" }}</span>
          <span class="col-auto listViewCode">{{ listContent.code?listContent.code:"-" }}</span>
          <span class="col-auto listViewBelong">{{ listContent.hq }} <br> {{listContent.branch}}</span>
          <div class="col-auto column items-center listViewDate">
            <span>{{ getTimeZoneEndSeconds(listContent.date).split(" ")[0] }}</span>
            <span>{{ getTimeZoneEndSeconds(listContent.date).split(" ")[1] }}</span>
          </div>
          <div class="col-auto row listViewIcons" :style="{width:listContent.rate != 100 ? '154px' : undefined}">
            <button v-if="listContent.rate == 100" @click="editBtnClick(listContent)">
              <img src="@/assets/images/list_icon_edit.png" />
            </button>
            <button v-if="listContent.rate == 100" @click="favoriteBtnClick(listContent, listContentKey)" :style="{marginLeft: listContent.rate !== 100 ? '84px': undefined}">
              <img v-if="listContent.favorite" src="@/assets/images/list_icon_pin_on.png" />
              <img v-else src="@/assets/images/list_icon_pin.png" />
            </button>
            <button v-if="listContent.rate == 100" @click="downloadBtnClick(listContent)" >
              <img src="@/assets/images/list_icon_download.png" />
            </button>
            <button v-if="listContent.rate == 100" @click="removeBtnClick(listContent)" :style="{marginRight: listContent.rate !== 100 ? '0px': undefined}">
              <img src="@/assets/images/ic_trash.png" />
            </button>
          </div>
        </div>
      </div>
      <div v-else class="col-12 row favoriteContent" v-for="(favoriteContent, favoriteContentKey) in compData.listData" :key="favoriteContentKey">
        <div class="col-auto" @mouseenter="contentImgMouseenter" @mouseleave="contentImgMouseleave">
          <div v-if="favoriteContent.seq != $route.query.seq" class="row justify-center items-center contentImgHover">
            <button @click="editBtnClick(favoriteContent)">
              <img src="@/assets/images/list_img_hover_icon_edit.png" />
            </button>
            <button @click="downloadBtnClick(favoriteContent)">
              <img src="@/assets/images/list_img_hover_icon_download.png" />
            </button>
            <button v-if="favoriteContent.video" @click="videoPlayBtnClick(favoriteContent)">
              <img src="@/assets/images/list_img_hover_icon_play.png" />
            </button>
            <button v-else-if="favoriteContent.img" @click.exact="picturePlayBtnClick($event, favoriteContent)">
              <img src="@/assets/images/list_img_hover_icon_preview.png" />
            </button>
            <button @click="removeBtnClick(favoriteContent)">
              <img src="@/assets/images/list_img_hover_icon_delete.png" />
            </button>
          </div>
          <img v-if="favoriteContent.img" :src="favoriteContent.img" />
          <img v-else-if="favoriteContent.video" :src="favoriteContent.thumbnail" />
          <div v-if="favoriteContent.seq == $route.query.seq" class="col-12 row justify-center items-center galleryCurrentPlaying">
            <span v-if="favoriteContent.fileType == 'video'">{{ $t("listComp")[2] }}</span>
          </div>
        </div>
        <div class="col row content-start">
          <div class="col-12 row">
            <div class="col">
              <span>{{ favoriteContent.title }}</span>
            </div>
            <div class="col-auto">
              <button class="row items-center" @click="removeFavoriteBtnClick(favoriteContent)">
                <img src="@/assets/images/icon_delete.png" />
                <span>{{ $t("listComp")[6] }}</span>
              </button>
              <button class="row items-center" @click="shareBtnClick(favoriteContent)">
                <img src="@/assets/images/icon_share.png" />
                <span>{{ $t("listComp")[7] }}</span>
              </button>
              <button class="row items-center" @click="downloadBtnClick(favoriteContent)">
                <img src="@/assets/images/icon_save.png" />
                <span>{{ $t("listComp")[8] }}</span>
              </button>
              <button class="row items-center" @click="editBtnClick(favoriteContent)">
                <img src="@/assets/images/icon_edit.png" />
                <span>{{ $t("infoFilters")[7] }}</span>
              </button>
            </div>
          </div>
          <div class="col-12 row content-end">
            <div class="col-12">
              <img src="@/assets/images/icon_class.png" />
              <span>{{ $t("listComp")[9] }}</span>
              <span>I</span>
              <span>{{ favoriteContent.code?favoriteContent.code:"-" }}</span>
            </div>
            <div class="col-12">
              <img src="@/assets/images/icon_member.png" />
              <span>{{ $t("listComp")[10] }}</span>
              <span>I</span>
              <span>{{ listViewPeople(favoriteContent) }}</span>
            </div>
            <div class="col-12">
              <img src="@/assets/images/icon_date.png" />
              <span>{{ $t("listComp")[11] }}</span>
              <span>I</span>
              <span>{{ getTimeZoneEndSeconds(favoriteContent.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pagination class="col-12" :compData="compData"></pagination>
  </div>
</template>

<script>
import filterBox from "@/components/data/filterBox"
import pictureZoomInModal from "@/components/data/pictureZoomInModal"
import changeViewType from "@/components/data/changeViewType"
import showShareModal from "@/assets/scripts/data/showShareModal"
import initLocalStorage from "@/assets/scripts/initialize/localStorage"
import favorite from "@/assets/scripts/data/favorite"
import axiosJson from "@/assets/jsons/axios"
// import downloadWithAxios from "@/assets/scripts/data/downloadWithAxios"
import fileDownload from "@/assets/scripts/data/download"
import domain from "@/assets/jsons/domain/domain"

export default {
  components: {
    filterBox,
    changeViewType
  },
  props: ["compData"],
  data() {
    return {
      selectedFilters: [],
      titleBarFilters: [
        {
          text: this.$t("listComp")[10],
          isFilterClicked: false,
          getFilterListUrl: axiosJson.attachment.att_member_list,
          filterList: [],
          align: {
            column: "joined_members",
            status: "desc"
          }
        },
        {
          text: this.$t("listComp")[12],
          align: {
            column: "title",
            status: "desc"
          }
        },
        {
          text: this.$t("listComp")[9],
          isFilterClicked: false,
          getFilterListUrl: axiosJson.attachment.att_category_list,
          filterList: [],
          align: {
            column: "category",
            status: "desc"
          }
        },
        {
          text: this.$t("listComp")[3],
          isFilterClicked: false,
          getFilterListUrl: axiosJson.attachment.att_belong_list,
          filterList: [],
          align: {
            column: "hq_alias",
            status: "desc"
          }
        },
        {
          text: this.$t("listComp")[11],
          isFilterClicked: false,
          filterList: "calendar",
          align: {
            column: "save_time",
            status: "desc"
          }
        }
      ],
      totalVideoTime: "",
      state: true,
      loginUserAuth: 0,
      cnt: 0
    }
  },
  computed: {
    galleryViewPeople() {
      return e => {
        // const people = e.people.split(",")
        if (e.people != null) {
          const people = e.people.split(",")
          if (people.length === 1)
            return this.$t("listComp")[10] + " : " + people[0]
          else
            return (
              this.$t("listComp")[10] +
              " : " +
              this.$t("listComp2", [people[0], people.length - 1])
            )
        } else {
          return this.$t("listComp")[10] + " : " + this.$t("none")
        }
      }
    },
    listViewPeople() {
      return e => {
        if (e.people != null) {
          const people = e.people.split(",")
          if (people.length === 1) return people[0]
          else return this.$t("listComp2", [people[0], people.length - 1])
        } else {
          return "-"
        }
      }
    }
  },
  methods: {
    setData(val, index) {
      console.log("**********************")
      this.titleBarFilters[index].filterList = []
      for (let i = 0; i < val.length; i++) {
        console.log(val[i])
        this.titleBarFilters[index].filterList.push(val[i])
      }
    },
    numberPad(n, width) {
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join("0") + n
    },
    // 비디오 시간 가져오기
    getTotalVideoTime(secondTime) {
      let hour = 0
      let minute = 0
      let seconds = 0
      let totalTimeText = ""
      const curLang = sessionStorage.getItem("languageCode")

      minute = Math.floor(secondTime / 60)
      seconds = secondTime % 60

      if (minute >= 60) {
        hour = Math.floor(minute / 60)
        minute = minute % 60
      }

      // 영어일때만 두자리수 빈공간에 "0" 으로 채워준다
      if (curLang === "en") {
        hour = this.numberPad(String(hour), 2)
        minute = this.numberPad(String(minute), 2)
        seconds = this.numberPad(String(seconds), 2)
      }

      if (hour && hour !== 0) {
        totalTimeText += `${hour}${this.$t("time")[0]}`
      }
      if (minute && minute !== 0) {
        totalTimeText += `${minute}${this.$t("time")[1]}`
      }
      if (seconds && seconds !== 0) {
        totalTimeText += `${seconds}${this.$t("time")[2]}`
      }

      return `${totalTimeText}`
    },
    contentImgMouseenter(e) {
      if (e.target.children[0].tagName === "DIV")
        e.target.children[0].style.visibility = "visible"
    },
    contentImgMouseleave(e) {
      if (e.target.children[0].tagName === "DIV")
        e.target.children[0].style.visibility = "hidden"
    },
    editBtnClick(e) {
      if (this.$route.name === "attachment-favorite") {
        if (e.fileType === "video")
          window.open("/attachment/video/edit?seq=" + e.seq, "_self")
        else if (e.fileType === "picture")
          window.open("/attachment/picture/edit?seq=" + e.seq, "_self")
      } else window.open(this.$route.path + "/edit?seq=" + e.seq, "_self")
    },
    downloadBtnClick(e) {
      fileDownload(e, this)
    },
    videoPlayBtnClick(e) {
      let path =
        "/attachment" +
        (this.$route.name === "attachment-video" ? "/video" : "/favorite")
      const getKeyword = this.$route.query.keyword
      const getColumn = this.$route.query.column
      const getStatus = this.$route.query.status
      const getPage = this.$route.query.page
      const getViewType = this.$route.query.viewType

      if (getKeyword) {
        path += "?keyword=" + getKeyword
        if (getColumn) path += "&column=" + getColumn + "&status=" + getStatus
        path += "&page=" + getPage
      } else if (getColumn)
        path +=
          "?column=" + getColumn + "&status=" + getStatus + "&page=" + getPage
      else path += "?page=" + getPage

      path += "&viewType=" + getViewType
      path += "&seq=" + e.seq
      window.open(path, "_self")
    },
    picturePlayBtnClick(self, e) {
      if (this.$route.name === "attachment-picture")
        this.$router
          .replace({
            path: "",
            query: {
              page: this.$route.query.page,
              viewType: this.$route.query.viewType,
              seq: e.seq
            }
          })
          .catch(error => {
            if (error.name !== "NavigationDuplicated") {
              throw error
            }
          })

      if (self) self.target.parentNode.parentNode.style.visibility = "hidden"

      const modalsContainerStyle = document.getElementById("modalsContainer")
        .style
      modalsContainerStyle.display = "block"
      this.$modal.show(
        pictureZoomInModal,
        {
          imgSrc: e.img,
          title: e.title
        },
        {
          name: "pictureZoomInModal",
          width: 1000,
          height: 570
        },
        {
          "before-close": () => {
            this.$router
              .replace({
                path: "",
                query: {
                  page: this.$route.query.page,
                  viewType: this.$route.query.viewType
                }
              })
              .catch(error => {
                if (error.name !== "NavigationDuplicated") {
                  throw error
                }
              })

            modalsContainerStyle.display = "none"
          }
        }
      )
    },
    removeBtnClick(e) {
      const self = this
      const token = localStorage.getItem("jwt")
      const result = confirm(self.$t("listComp")[18])
      if (result) {
        this.$axios
          .post(domain.domain.backend1 + axiosJson.attachment.att_delete, {
            att_seq: e.seq,
            jwt: token
          })
          .then(function(res) {
            if (res) {
              alert(self.$t("listComp")[14])
              window.location.reload()
            } else alert(self.$t("listComp")[15])
          })
          .catch(function(error) {
            console.log("list.vue removeBtnClick error : ", error)
            alert(self.$t("listComp")[15])
          })
      } else {
      }
    },
    favoriteBtnClick(e, index) {
      if (e.favorite) {
        // e.favorite = false
        this.$set(this.compData.listData[index], "favorite", false)
        favorite.remove(e.seq, this)
      } else {
        // e.favorite = true
        this.$set(this.compData.listData[index], "favorite", true)
        favorite.add(e.seq)
      }
    },
    removeFavoriteBtnClick(e) {
      favorite.remove(e.seq, this)
    },

    // 선택된 filter를 localStorate에 저장
    filterBoxBtnClick(e) {
      const getSelectedFilters = initLocalStorage.get("selectedFilters")

      if (e.constructor === Object) {
        let selectedFilterIndex = 0
        // 지사명이 겹칠수도 있기때문에 hq_seq,br_seq도 체크해주어야한다
        if (e.group === "br_alias") {
          selectedFilterIndex = getSelectedFilters.findIndex(
            x =>
              x.text === e.text &&
              x.value[0] === e.value[0] &&
              x.value[1] === e.value[1]
          )
        } else {
          selectedFilterIndex = getSelectedFilters.findIndex(
            x => x.text === e.text
          )
        }
        getSelectedFilters.splice(selectedFilterIndex, 1)
      } else getSelectedFilters.splice(getSelectedFilters.indexOf(e), 1)

      initLocalStorage.set("selectedFilters", getSelectedFilters)

      window.location.reload()
    },
    alignBtnClick(e) {
      const getKeyword = this.$route.query.keyword
      const getViewType = this.$route.query.viewType
      const getColumn = e.align.column
      let getStatus = e.align.status

      if (
        getStatus === this.$route.query.status &&
        getColumn === this.$route.query.column
      )
        getStatus = "asc"

      if (getKeyword)
        window.open(
          this.$route.path +
            "?keyword=" +
            getKeyword +
            "&column=" +
            e.align.column +
            "&status=" +
            getStatus +
            "&page=1" +
            "&viewType=" +
            getViewType,
          "_self"
        )
      else {
        window.open(
          this.$route.path +
            "?column=" +
            e.align.column +
            "&status=" +
            getStatus +
            "&page=1" +
            "&viewType=" +
            getViewType,
          "_self"
        )
      }
    },
    // 필터 클릭시 list setting
    setTitleBarFilterList(index) {
      const getTitleBarFilter = this.titleBarFilters[index]
      const token = localStorage.getItem("jwt")

      if (getTitleBarFilter.getFilterListUrl)
        this.$axios
          .post(domain.domain.backend1 + getTitleBarFilter.getFilterListUrl, {
            jwt: token
          })
          .then(function(res) {
            console.log(res)
            if (getTitleBarFilter.filterList.length)
              getTitleBarFilter.filterList = []

            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i] != null && res.data[i] !== "")
                if (getTitleBarFilter.align.column === "hq_alias") {
                  if (res.data[i].en_alias !== null) {
                    // filterList 배열에 현재 추가할 기업 존재여부확인
                    const EnPresenceCheck = getTitleBarFilter.filterList.some(
                      item => item.value[1] === res.data[i].en_seq
                    )
                    // 기업이 존재하지 않는다면 넣는다
                    if (!EnPresenceCheck) {
                      getTitleBarFilter.filterList.push({
                        text: res.data[i].en_alias,
                        value: [null, res.data[i].en_seq],
                        group: "en_alias",
                        subGroup: []
                      })
                    }

                    // 본부정보를 object에 저장
                    const hqList = {}
                    hqList.upperText = res.data[i].en_alias
                    hqList.text = res.data[i].hq_alias
                    hqList.value = [res.data[i].en_seq, res.data[i].hq_seq]
                    hqList.group = "hq_alias"
                    hqList.subGroup = []

                    // filterList 객체에서 소속된 기업의 인덱스를 찾는다
                    const enIndex = getTitleBarFilter.filterList.findIndex(
                      obj => obj.value[1] === res.data[i].en_seq
                    )

                    // filterList > hqGroup 현재 추가할 본부 존재여부확인
                    const HQPresenceCheck = getTitleBarFilter.filterList[
                      enIndex
                    ].subGroup.some(
                      item =>
                        item.value[0] === res.data[i].en_seq &&
                        item.value[1] === res.data[i].hq_seq
                    )

                    //  true: 이미 해당 본부는 추가되어있는 상태 , false : 본부정보를 해당 기업 subGroup에 푸시한다
                    if (!HQPresenceCheck) {
                      getTitleBarFilter.filterList[enIndex].subGroup.push(
                        hqList
                      )
                    }

                    // filterList 객체에서 소속된 본부의 인덱스를 찾는다
                    const hqIndex = getTitleBarFilter.filterList[
                      enIndex
                    ].subGroup.findIndex(
                      obj =>
                        obj.value[0] === res.data[i].en_seq &&
                        obj.value[1] === res.data[i].hq_seq
                    )

                    // filterList > hqGroup 현재 추가할 지사 존재여부확인
                    const BrPresenceCheck = getTitleBarFilter.filterList[
                      enIndex
                    ].subGroup[hqIndex].subGroup.some(
                      item =>
                        item.value[0] === res.data[i].en_seq &&
                        item.value[1] === res.data[i].hq_seq &&
                        item.value[2] === res.data[i].br_seq
                    )

                    // 지사청보를 object에 저장
                    const brList = {}
                    brList.topUpperText = res.data[i].en_alias
                    brList.upperText = res.data[i].hq_alias
                    brList.text = res.data[i].br_alias
                    brList.value = [res.data[i].hq_seq, res.data[i].br_seq]
                    brList.group = "br_alias"

                    //  true: 이미 해당 본부는 추가되어있는 상태 , false : 지사정보를 본부 > subGroup에 푸시한다
                    if (!BrPresenceCheck) {
                      getTitleBarFilter.filterList[enIndex].subGroup[
                        hqIndex
                      ].subGroup.push(brList)
                    }
                  }
                } else {
                  // 소속필터를 제외한 필터
                  getTitleBarFilter.filterList.push({
                    text: res.data[i],
                    value: res.data[i],
                    group: getTitleBarFilter.align.column
                  })
                }
            }
            const getSelectedFiltersOptions = initLocalStorage.get(
              "selectedFiltersOptions"
            )
            getSelectedFiltersOptions.searchKeyword = ""
            getSelectedFiltersOptions.searchList = getTitleBarFilter.filterList

            initLocalStorage.set(
              "selectedFiltersOptions",
              getSelectedFiltersOptions
            )
          })
          .catch(function(error) {
            console.log("data list.vue created error : ", error)
          })
    },
    // 필터 박스 열기 버튼
    filterBtnClick(e, index) {
      if (e.filterList !== "calendar")
        document.getElementById("filterBoxSearchInput" + index).value = ""

      this.setTitleBarFilterList(index)

      if (e.isFilterClicked) {
        e.isFilterClicked = false
        initLocalStorage.remove("selectedFiltersOptions")
      } else {
        for (let i = 0; i < this.titleBarFilters.length; i++)
          this.titleBarFilters[i].isFilterClicked = false
        e.isFilterClicked = true
        initLocalStorage.set("selectedFiltersOptions", { column: index + 1 })

        // 소속 필터의 경우만 해당
        if (index === 3) {
          this.$refs.childFilterBox[3].filterBoxOpenInitial()
        }
      }
    },
    clickOutsideEvent(e) {
      if (e.target.src !== require("@/assets/images/list_icon_filter_wh.png")) {
        for (let i = 0; i < this.titleBarFilters.length; i++)
          this.titleBarFilters[i].isFilterClicked = false

        initLocalStorage.remove("selectedFiltersOptions")
      }
    },
    shareBtnClick(e) {
      const token = localStorage.getItem("jwt")
      this.$axios
        .post(
          e.fileType === "video"
            ? domain.domain.backend1 +
                axiosJson.attachment.att_return_page_number
            : domain.domain.backend1 +
                axiosJson.attachment.att_return_page_number_picture,
          {
            att_seq: e.seq,
            jwt: token
          }
        )
        .then(response => {
          if (response.data)
            showShareModal(
              this.$modal,
              location.href.slice(0, location.href.indexOf("favorite")) +
                (e.fileType === "picture" ? "picture" : "video") +
                "?page=" +
                response.data +
                "&viewType=gallery&seq=" +
                e.seq
            )
        })
        .catch(err => {
          console.log("list.vue shareBtnClick error", err)
        })
    },
    getTimeZoneEndSeconds(standard) {
      const now = new Date(standard * 1000)

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
    // 영상 녹화 재요청
    requestVideoRecording(videoInfo) {
      let hostNameURL = ""

      if (window.location.hostname === "localhost") {
        hostNameURL = domain.domain.powertalk.state[1].split("login")[0]
      } else {
        hostNameURL = domain.domain.powertalk.state[2].split("login")[0]
      }

      const url =
        hostNameURL +
        "requestVideoRecording?unique_roomid=" +
        videoInfo.unique_roomid +
        "&att_seq=" +
        videoInfo.seq

      const popupWidth = "500"
      const popupHeight = "300"

      // 팝업을 가운데 위치시키기 위해 가운데 위치 값 구하기
      const locationLeft = Math.ceil((window.screen.width - popupWidth) / 2)
      const locationTop = Math.ceil((window.screen.height - popupHeight) / 2)

      window.open(
        url,
        "_blank",
        "width=" +
          popupWidth +
          ", height=" +
          popupHeight +
          ", left=" +
          locationLeft +
          ", top=" +
          locationTop
      )

      setTimeout(() => {
        // 페이지 새로고침
        window.location.reload()
      }, 1500)
    }
  },
  mounted() {
    console.log("*****titleBarFilters mounted start")
    // 로컬스토리지에서 필터 옵션 목록을 가져온다
    const getSelectedFiltersOptions = initLocalStorage.get(
      "selectedFiltersOptions"
    )

    if (getSelectedFiltersOptions && getSelectedFiltersOptions.column) {
      this.titleBarFilters[
        getSelectedFiltersOptions.column - 1
      ].isFilterClicked = true

      if (getSelectedFiltersOptions.searchList) {
        this.titleBarFilters[getSelectedFiltersOptions.column - 1].filterList =
          getSelectedFiltersOptions.searchList
        document.getElementById(
          "filterBoxSearchInput" + (getSelectedFiltersOptions.column - 1)
        ).value = getSelectedFiltersOptions.searchKeyword
      } else this.setTitleBarFilterList(getSelectedFiltersOptions.column - 1)
    }
    const getSelectedFilters = initLocalStorage.get("selectedFilters")
    if (getSelectedFilters && getSelectedFilters.length) {
      for (let i = 0; i < getSelectedFilters.length; i++) {
        this.selectedFilters.push(getSelectedFilters[i])
        // 클릭한 소속을 펼침
        if (
          getSelectedFilters[i].group === "br_alias" ||
          getSelectedFilters[i].group === "hq_alias"
        ) {
          let column = ""
          if (getSelectedFilters[i].group === "br_alias") {
            column = "hq_alias"
          } else {
            column = "en_alias"
          }
          setTimeout(() => {
            // 자식 컴포넌트에서 함수 실행
            if (this.loginUserAuth === 4) {
              this.$refs.childFilterBox[3].subordinateOpenClose(
                getSelectedFilters[i],
                "initial",
                column
              )
            }
          }, 300)
        }
      }
    }
    if (
      getSelectedFiltersOptions &&
      this.loginUserAuth !== 4 &&
      getSelectedFiltersOptions.column === 4
    ) {
      if (getSelectedFiltersOptions.searchKeyword !== "") {
        this.$refs.childFilterBox[3].searchBtnClick()
      }
    }
    this.loginUserAuth = localStorage.getItem("auth")
  },
  watch: {
    "compData.listData"() {
      const route = this.$route
      if (route.query.seq && route.name === "attachment-picture") {
        for (let i = 0; i < this.compData.listData.length; i++) {
          if (this.compData.listData[i].seq === Number(route.query.seq))
            this.picturePlayBtnClick(undefined, this.compData.listData[i])
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.dataList
	width: 100%
	margin-top: 50px

.maxWidth
	width: $contentMaxWidth
	margin-bottom: 40px

.title
	font-size: 20px
	font-weight: 800
	margin-left: 10px

.favoriteTitle
	margin-bottom: 27px

.galleryView
	margin-top: 27px

	>div
		width: 23.79%

	>div:not(:nth-child(4n))
		margin-right: 20px

	>div:nth-child(n+5)
		padding-top: 20px

.contentImg
	height: 170px !important
	background: white
	border: 1px solid #D1D1D1

	>img,
	>video
		width: 100%
		height: 100%
		object-fit: contain

.contentImgHover
	visibility: hidden
	position: absolute
	top: 0
	left: 0
	width: 100%
	height: 100%
	background-color: rgba(0, 0, 0, 0.7)
	z-index: 1

	>button:not(:nth-child(1))
		margin-left: 20px

.uploading
	visibility: visible
	position: absolute
	top: 0
	left: 0
	width: 100%
	height: 100%
	background-color: rgba(0, 0, 0, 0.7)
	z-index: 1

.videoMark
	position: absolute
	top: 0
	left: 0
	width: 100%
	height: 100%

	>.videoMarkList
		width: 30px
		height: 30px

.galleryCurrentPlaying
	position: absolute
	top: 0
	width: 100%
	height: 100%
	color: white
	background-color: rgba(0, 0, 0, 0.7)

.contentTextBox
	padding: 15px
	background: white
	border: 1px solid #D1D1D1
	border-top: 0

.galleryViewTitle
	+ellipsis
	font-size: 16px
	font-weight: 800

.galleryViewDivisionLine
	height: 1px !important
	border: 1px solid #D9D9D9
	margin: 10px 0 10px

.galleryViewCode
	+ellipsis
	font-size: 11px
	margin-top: 1px
	color: #a1988ff

.galleryViewPeople,
.galleryViewBelong,
.galleryViewDate
	margin-top: 3px

.galleryViewPeople,
.galleryViewBelong,
.galleryViewDate
	+ellipsis
	font-size: 12px

.listView
	margin-top: 27px

.filter
	padding: 8px 20px
	background: white
	min-height: 47px

.filterTitle
	font-size: 12px
	margin: 0 6px 0 4px

.filterBox
	font-size: 12px
	padding: 3px 10px
	border: 1px solid #BBBBBB
	border-radius: 13px
	margin: 2.5px 2.5px

.filterBoxXIcon
	margin-left: 9px

.titleBar
	padding: 15px 0
	color: white
	background: #0061D1
	margin-top: 6px

.titleBarFilters:first-child
	width: 160px
	margin-left: 155px

.titleBarFilters:nth-child(2)
	width: 260px

.titleBarFilters:nth-child(3)
	width: 230px

.titleBarFilters:nth-child(4)
	width: 100px

.titleBarFilters:last-child
	width: 145px

.titleBarFilters>button:first-child
	margin-right: 8px

.titleText
	color: white

.listView>div:nth-child(3)
	margin-top: 10px

.listViewList
	font-size: 12px
	font-weight: 600
	padding: 5px 0
	margin-top: 15px
	background: white
	text-align: center

.listViewList>span
	padding: 0 10px

.listViewList>span:nth-child(3),
.listViewList>span:nth-child(4)
	+ellipsis

.listViewImg
	display: block
	width: 105px
	height: 60px
	margin: 0 25px
	font-size: 12px

.listCurrentPlaying
	position: absolute
	top: 0
	width: 105px
	height: 60px
	margin: 0 25px
	color: white
	background-color: rgba(0, 0, 0, 0.7)

.listViewPeople
	width: 160px

	>span
		width: 100%
		+ellipsis

.listViewCode
	width: 230px

.listViewBelong
	width: 110px
	word-break: break-all

.listViewDate
	width: 138px

.listViewIcons
	margin: 0 25px

.listViewIcons
	>button
		&:nth-child(2)
			margin: 0 12px
		&:nth-child(3)
			margin-right: 12px

.listViewIcons>button:hover:before
	content: ""
	position: absolute
	width: 100%
	height: 100%
	top: 0
	left: 0
	background: #0061D1
	opacity: 0.3
	z-index: 1

.favoriteContent
	background: white
	margin-top: 2px

	>div:nth-child(1)
		width: 300px
		height: 170px
		margin: 13px 45px

		>img,
		>video
			width: 100%
			height: 100%

	>div:nth-child(2)
		padding: 30px 0

	>div>div:nth-child(1)>div:nth-child(1)
		font-size: 20px
		font-weight: 800

		>span
			width: 100%
			+ellipsis

	>div>div:nth-child(1)>div:nth-child(2)
		margin-right: 30px

		>button
			margin-left: 15px

		>button>span
			font-size: 12px
			color: #6D6D6D

	>div:nth-child(2)>div:nth-child(2)
		height: 100%
		padding-bottom: 30px

		>div
			padding-top: 3px

		>div>img,
		>div>span
			padding-right: 5px

		>div:nth-child(1)>span:nth-child(4)
			max-width: 85%
			+ellipsis

		>div>span:nth-child(3)
			color: #0061D1

.prog
	background: white
	height: 14px
	border-radius: 15px
	margin-top: 3px

.progs
	height: 15px
	background: #2a8bf4
	color:#fff
	text-align: center
	line-height: 50px
	border-radius: 15px

.listViewUploading
	display: block
	width: 105px
	height: 60px
	margin: 0 25px
	font-size: 12px

.tagIcon
	height: 12px
	margin-top: 3px
	margin-right: 3px

.galleryProgressText
	margin: auto
	text-align: center
	color: white
	padding-bottom: 3px
	font-size: 13px

.listProgressText
	margin: auto
	text-align: center
	color: white
	font-size: 10px

.gauge
  padding-bottom: 3px
  position: absolute
  top: 42px
  left: 6px
  font-size: 13px
  margin: auto
  text-align: center

.listProgressGage
	margin: auto
	text-align: center
	font-size: 9px
	position: absolute
	bottom: -2px
	margin-left: 2px

.recordingBtn
  width: 86px
  height: 26px
  background-color: #fff
  color: black
  font-size: 14px
  font-weight: bold
  border-radius: 3px
  justify-content: center
  display: flex

.recordingBtnIcon
  margin-top: 3px

.recordingBtnText
  margin-left: 3px
  margin-top: 3px

.listRecordingBtn
  width: 56px
  height: 18px
  background-color: #fff
  color: black
  font-size: 9px
  font-weight: bold
  border-radius: 3px
  justify-content: center
  display: flex

.listRecordingBtnIcon
  margin-top: 2px

.listRecordingBtnText
  margin-left: 2px
  margin-top: 1px
</style>
