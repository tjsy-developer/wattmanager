<template>
  <div class="row content-start notice">
    <div class="col-12 row justify-center">
      <div class="col-12 row justify-center titleBar">
        <span>{{ compData.title }}</span>
      </div>
      <div class="col-12 row justify-center">
        <div class="row justify-between subTitleDiv">
          <span class="col-auto subTitle">{{ compData.listTitle }}</span>
          <a v-if="compData.auth == 4 || compData.auth == 3" class="col-auto createBtn" :href="$route.name + '/create'">{{ $t("createAndEditComp")[0] }}</a>
        </div>
      </div>
      <div class="col-12 row content-start list">
        <div class="col-12 row listFilters">
          <div class="row justify-center" v-for="bar in compData.listFilters" :class="[ bar.width?'col-auto':'col' ]" :style="{ width: bar.width+'px' }">
            <button v-if="bar.align" class="row items-center" @click="alignBtnClick(bar)">
              <span class="titleBarText">{{bar.text}}</span>
              <img v-if="$route.query.column == bar.align.column && $route.query.status == 'asc'" class="alignIcon" src="@/assets/images/list_icon_arrow_up.png" :style="{opacity:$route.query.column == bar.align.column ? 1 : 0.5}" />
              <img v-else class="alignIcon" src="@/assets/images/list_icon_arrow_down.png" :style="{opacity:$route.query.column == bar.align.column ? 1 : 0.5}" />
            </button>
            <span v-else>{{bar.text}}</span>
          </div>
        </div>
        <div class="col-12 row contents">
          <a class="contentA col-12 row" v-for="(contents, contentskey) in compData.listData" :key="contentskey" :href="$route.name + '/detail?seq=' + contents[contents.length-1]">
            <span :style="{ width: compData.listFilters[0].width+'px' }">{{contentskey+1+compData.contentsPerPage*($route.query.page -1)}}</span>
            <div
              class="row justify-center items-center content"
              v-for="(content, contentKey) in contents"
							v-if="contentKey != contents.length-1"
							:key="contentKey"
							:class="[ compData.listFilters[contentKey+1] && compData.listFilters[contentKey+1].width?'col-auto':'col' ]"
							:style="{ width: compData.listFilters[contentKey+1] && compData.listFilters[contentKey+1].width+'px' }"
            >
              <span class="col-auto">{{ contentKey == 1 || contentKey == 2 ? getTimeZone(content) : content }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
    <pagination class="col-12" :compData="compData"></pagination>
  </div>
</template>

<script>
import filtersJson from "@/assets/jsons/info/notice/filters"
import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import getFilters from "@/assets/scripts/info/getFilters"

export default {
  layout: "main",
  data() {
    return {
      compData: {
        title: this.$t("notice")[0],
        listTitle: this.$t("notice")[0],
        auth: undefined,
        contentsPerPage: 10,
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            this.$t("notice")[1],
            this.$t("notice")[2],
            this.$t("notice")[3],
            this.$t("notice")[4]
          ],
          filtersJson
        ),
        listData: [],
        getListDataUrl: "noticeRest/notice_admin_list",
        getListCountUrl: "noticeRest/notice_admin_list_count",
        getListDataParams: {
          page: 0
        },
        setListData(getListData) {
          console.log(getListData)
          for (let i = 0; i < getListData.length; i++) {
            this.listData.push([
              getListData[i].content,
              getListData[i].save_time,
              getListData[i].effective_date,
              getListData[i].user_name,
              getListData[i].noti_seq
            ])
          }
        }
      }
    }
  },
  methods: {
    getTimeZone(standard) {
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
    }
  },
  created() {
    setGetListDataParams(this.$route.query, this.compData.getListDataParams)
  },
  mounted() {
    this.compData.auth = sessionStorage.getItem("auth")
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"

.notice
	width: 100%
	min-width: $contentMaxWidth
	min-height: $contentHeight
	background-color: #EFF0F1

.titleBar
	margin-bottom: 36px

	>span
		width: $contentMaxWidth

.subTitleDiv
	width: $contentMaxWidth

.subTitle
	height: 41px
	font-size: 22px
	font-weight: 800

.createBtn
	color: white
	padding: 10px 35px
	background: #1DBFA4 0% 0% no-repeat padding-box
	border-radius: 2px

.list
	width: $contentMaxWidth

.listFilters
	font-size: 16px
	font-weight: bold
	background: #4173AC
	padding: 16px 0 13px
	margin-top: 10px

.listFilters>div>button,
.listFilters>div>span
	color: white

.titleBarText
	padding-left: 10px

.alignIcon
	width: 16px
	height: 12px
	margin-left: 5px

.contents
	font-size: 16px
	text-align: center

.contentA
	background: white
	padding: 25px 0

.contentA:first-child
	margin-top: 10px

.contentA
	margin-top: 4px

.content
	padding: 0 5px

$contentImgSize: 30px

.content>img
	width: $contentImgSize
	height: $contentImgSize
	padding-right: 4px

.content>span
	+ellipsis
</style>
