<template>
  <div class="col-auto row notice">
    <div class="col-12">
      <button class="noticeBtn row items-center" @click="noticeClick">
        <img src="@/assets/images/ic_notice_w.png" />
        <span>{{ $t("notice")[0] }}</span>
      </button>
    </div>
    <div class="col-12 row container items-start" v-show="isOpened">
      <div class="col-12 row items-center title">
        <div class="titleIcon">
          <img src="@/assets/images/ic_notice_r.png" />
        </div>
        <span class="titleText">{{ $t("notice")[0] }}</span>
        <div class="space"></div>
        <button class="col-12 list row" @click="listContainerClick(notice)" v-for="notice in list">
          <span class="listText col" :style="{webkitLineClamp: notice.isClicked ? 'unset' : 3 }">{{ notice.content }}</span>
          <span v-if="notice.isClicked" class="listIcon col-auto">▲</span>
          <span v-else class="listIcon col-auto">▼</span>
        </button>
      </div>
    </div>
  </div>
</template></template>

<script>
import { axiosRequest } from "@/plugins/axiosRequest"

export default {
  data() {
    return {
      isOpened: false,
      list: []
    }
  },
  methods: {
    noticeClick() {
      if (this.isOpened === false) this.isOpened = true
      else this.isOpened = false
    },
    listContainerClick(e) {
      if (e.isClicked === false) e.isClicked = true
      else e.isClicked = false
    }
  },
  async created() {
    const self = this
    const params = {
      data:{
        en_seq: 1
      },
      api: process.env.backendURL + "noticeRest/notice_list"
    }
    await axiosRequest('post', params)
      .then(res => {
        console.log(res)
        if (res.length > 0) self.isOpened = true
        const dateTimeFormat = new Intl.DateTimeFormat("en", {
          year: "numeric",
          month: "short",
          day: "2-digit"
        })

        for (let i = 0; i < res.length; i++) {
          const [
            { value: month },
            ,
            { value: day },
            ,
            { value: year }
          ] = dateTimeFormat.formatToParts(new Date(res[i].save_time))
          const setList = {
            content:
              "[" + day + "th-" + month + "-" + year + "] " + res[i].content,
            isClicked: false
          }
          self.list.push(setList)
        }
      })
      .catch(err => {
        console.log("notice.vue error : ", err)
      })
  }
}
</script>

<style lang="sass" scoped>
.notice
	position: absolute
	top: -40px
	left: 0
	color: white

.noticeBtn
	color: white
	padding: 4px 10px
	background: #424242

	>span
		padding-top: 2px
		margin-left: 4px

.container
	width: 380px
	border: 3px solid #ca1515
	margin-top: 9px
	background: white

.title
	background: #ca1515
	padding: 6px

.titleText
	margin-left: 6px

.space
	flex: 1 0 1%

.titleClose
	color: white
	font-weigth: bolder

.listContainer
	padding: 12px
	height: 311px
	overflow: auto

.list
	padding: 12px
	border: 1px solid #eee

	&:not(:first-child)
		margin-top: 10px

.listText
	text-align: left
	overflow: hidden
	display: -webkit-box
	-webkit-box-orient: vertical

.listIcon
	color: #eee
</style>
