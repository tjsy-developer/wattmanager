<template>
  <div class="row content-start memo">
    <dataSearchBar></dataSearchBar>
    <div class="row justify-center memolist">
      <div class="row justify-between items-center titleContainer maxWidth">
        <span class="col-auto title">{{ $t("memo")[2] }}</span>
        <div class="col row justify-end">
          <changeViewType class="col-auto"></changeViewType>
          <a class="col-auto createBtn" :href="'attachment/memo/create'">{{ $t("createAndEditComp")[0] }}</a>
        </div>
        <div class="row col-12">
          <button v-if="$route.query.viewType == 'gallery'" class="row memoBtn" v-for="memo in compData.listData" @click="memoBtnClick(memo)">
            <div v-if="memo.thumbnailName != null" class="col-12 row memoImgContainer">
              <img class="memoImg" :src="webServerFilePathJson.thumbnail + memo.thumbnailName" />
              <div v-if="memo.fileType == 'V'" class="col-12 row justify-center items-center markImg">
                <img src="@/assets/images/list_icon_play50.png" />
              </div>
            </div>
            <div v-else class="col-12 empty">
              <img class="memoGalleyEmptyImg" src="@/assets/images/ic_image.png" />
              <span class="memoGalleyEmptyText">{{ $t("memo no data")}}</span>
            </div>
            <section class="col-12 row memoSection">
              <span class="col-12 memoDate">{{ getTimeZoneEndMinutes(memo.saveTime) }}</span>
              <span class="col-12 memoTitle">{{ $t("memo")[0] }}ㅣ{{ memo.userName }}</span>
              <span class="col-12 memoText">{{ $t("memo")[1] }}ㅣ{{ memo.contents }}</span>
            </section>
          </button>
          <button v-else class="col-12 row items-center listViewMemoBtn" @click="memoBtnClick(memo)">
            <div v-if="memo.thumbnailName != null" class="col-auto row listViewMemoImgContainer">
              <img class="memoImg" :src="webServerFilePathJson.thumbnail + memo.thumbnailName" />
              <div v-if="memo.fileType == 'V'" class="col-12 row justify-center items-center markImg">
                <img src="@/assets/images/list_icon_play50.png" />
              </div>
            </div>
            <div v-else class="col-auto listViewEmpty">
              <img class="memolistViewEmptyImg" src="@/assets/images/ic_image.png" />
              <span class="memolistViewEmptyText">{{ $t("memo no data")}}</span>
            </div>
            <section class="col row listViewMemoSection">
              <span class="col-12 memoDate">{{ getTimeZoneEndMinutes(memo.saveTime) }}</span>
              <span class="col-12 memoTitle">{{ $t("memo")[0] }}ㅣ{{ memo.userName }}</span>
              <span class="col-12 memoText">{{ $t("memo")[1] }}ㅣ{{ memo.contents }}</span>
            </section>
          </button>
        </div>
        <pagination class="col-12 memoPagination" :compData="compData"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import memoModal from "@/components/data/memoModal"
import axiosJson from "@/assets/jsons/axios"
import changeViewType from "@/components/data/changeViewType"
import domain from "@/assets/jsons/domain/domain"

const baseUrl = domain.powermemo

// "https://powermanagercloud.powertalk.co.kr/sftp/powermanager/PowerMemo/" // watt
// const baseUrl = "https://samsungengineeringcloud.powertalk.kr/sftp/smartg/PowerMemo/" //samsung
// const baseUrl = "https://kpjbcloud.powertalk.co.kr/sftp/kpjb/PowerMemo/" //kpjb
// const baseUrl = "https://koreaexpressway.powertalk.co.kr/PowerMemo/"

export default {
  layout: "main",
  components: {
    changeViewType
  },
  data() {
    return {
      baseUrl: "",
      enSeq: 0,
      webServerFilePathJson: {
        original: baseUrl + "/PowerMemo/Original/",
        thumbnail: baseUrl + "/PowerMemo/Thumbnail/"
      },
      compData: {
        listData: [],
        getListDataUrl: axiosJson.memo.memo_list,
        getListCountUrl: axiosJson.memo.memo_list_count,
        getListDataParams: {
          keyword: "",
          page: 0
        },
        setListData(getListData) {
          for (let i = 0; i < getListData.length; i++)
            this.listData.push({
              seq: getListData[i].memo_seq,
              contents: getListData[i].memo_contents,
              userId: getListData[i].user_id,
              userName: getListData[i].user_name,
              saveTime: getListData[i].save_time,
              thumbnailName: getListData[i].thumbnail_name,
              fileType: getListData[i].file_type,
              writerHqSeq: getListData[i].hq_seq,
              writerBrSeq: getListData[i].br_seq
            })
        }
      }
    }
  },
  methods: {
    memoBtnClick(memo) {
      const modalsContainerStyle = document.getElementById("modalsContainer")
        .style
      modalsContainerStyle.display = "block"

      const self = this
      this.$axios
        .post(domain.domain.backend1 + axiosJson.memo.memo_join_file, {
          memo_seq: memo.seq,
          jwt: localStorage.getItem("jwt")
        })
        .then(function(res) {
          self.$modal.show(
            memoModal,
            {
              compData: memo,
              files: res.data,
              webServerFilePathJson: self.webServerFilePathJson
            },
            {
              name: "memoModal",
              width: 1000,
              height: 570
            },
            {
              "before-close": () => {
                modalsContainerStyle.display = "none"
              }
            }
          )
        })
        .catch(function(error) {
          console.log("attachment page error : ", error)
        })
    },
    getTimeZoneEndMinutes(standard) {
      const now = new Date(standard * 1000)
      const month = ("0" + (now.getMonth() + 1)).slice(-2)
      const date = ("0" + now.getDate()).slice(-2)
      const hours = ("0" + now.getHours()).slice(-2)
      const minutes = ("0" + now.getMinutes()).slice(-2)

      const convertToDate =
        now.getFullYear() +
        this.$t("date")[0] +
        month +
        this.$t("date")[1] +
        date +
        this.$t("date")[2] +
        hours +
        this.$t("date")[3] +
        minutes +
        this.$t("date")[4]

      return convertToDate
    }
  },
  mounted() {
    // if (window.location.hostname === "localhost") {
    //   this.baseUrl =
    //     "https://powermanagercloud.powertalk.co.kr/sftp/powermanager/PowerMemo/" // watt
    //   // "https://samsungengineeringcloud.powertalk.kr/sftp/smartg/PowerMemo/" //samsung
    //   // "https://kpjbcloud.powertalk.co.kr/sftp/kpjb/PowerMemo/" //kpjb
    //   // "https://koreaexpressway.powertalk.co.kr/PowerMemo/"
    // } else {
    //   console.log(window.location.href.split("/"))
    // }
    // console.log(window.location.hostname)
    // this.webServerFilePathJson.original = this.baseUrl + "Original/"
    // this.webServerFilePathJson.thumbnail = this.baseUrl + "Thumbnail/"
    // console.log(this.webServerFilePathJson.original)
    // console.log(this.webServerFilePathJson.thumbnail)
    this.compData.getListDataParams.en_seq = localStorage.getItem("enSeq")
    setGetListDataParams(this.$route.query, this.compData.getListDataParams)
  }
}
</script>

<style lang="sass" scoped>
.memo
	width: 100%
	min-height: $contentHeight
	background: $contentBackground

.titleContainer
	margin: 50px 0 12px 10px

.title
	font-size: 20px
	font-weight: 800

.maxWidth
	width: $contentMaxWidth

.memoBtn
	width: 32.51%
	padding: 15px
	margin-top: 15px
	background-color: white
	border: 1px solid #d3d3d3
	border-bottom: 11px solid #d3d3d3

.memoBtn:nth-child(3n + 2)
	margin: 15px
	margin-bottom: 0

.memoBtn:hover
	border: 1px solid #1b8ce2
	border-bottom: 11px solid #1b8ce2

.memoImgContainer
	width: 100%
	height: 230px

.memoImg
	width: 100%
	height: 100%
	border: 1px solid #d9d9d9

.markImg
	position: absolute
	height: 100%

.empty
	height: 230px
	background-color: #d3d3d3

.memoSection
	text-align: left

.memoDate,
.memoTitle,
.memoText
	+ellipsis

.memoDate
	padding-top: 15px
	font-size: 14px
	color: #676767

.memoTitle
	font-size: 16px
	font-weight: 700
	padding-top: 8px
	color: #0061d1

.memoText
	font-size: 15px
	padding-top: 8px

.memoPagination
	padding-top: 40px

.listViewMemoBtn
	padding: 15px
	margin-top: 15px
	background-color: white
	border: 1px solid #d3d3d3
	border-bottom: 11px solid #d3d3d3

.listViewMemoBtn:hover
	border: 1px solid #1b8ce2
	border-bottom: 11px solid #1b8ce2

$listViewMemoImgContainerWidth: 300px
$listViewMemoImgContainerHeight: 170px

.listViewMemoImgContainer
	width: $listViewMemoImgContainerWidth
	height: $listViewMemoImgContainerHeight

.listViewEmpty
	width: $listViewMemoImgContainerWidth
	height: $listViewMemoImgContainerHeight
	background-color: #d3d3d3

.listViewMemoSection
	padding: 0 20px
	text-align: left

.memolist
	width: 100%

.memoGalleyEmptyImg
	position: absolute
	top: 30%
	left: 39%
	width: 80px

.memoGalleyEmptyText
	width: 100%
	position: absolute
	top: 57%
	color: #9d9d9d
	font-size: medium

.memolistViewEmptyImg
	position: absolute
	top: 30%
	left: 38.5%
	width: 65px

.memolistViewEmptyText
	width: 100%
	position: absolute
	top: 59%
	color: #8d8d8d
	font-size: small

.createBtn
	color: white
	padding: 10px 35px
	background: #1DBFA4 0% 0% no-repeat padding-box
	border-radius: 2px
	margin-right: 5px
</style>
