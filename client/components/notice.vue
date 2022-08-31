<template lang="pug">
	.col-auto.row.notice
		.col-12
			button(@click="noticeClick").noticeBtn.row.items-center
				img(src="@/assets/images/ic_notice_w.png")
				span {{ $t("notice")[0] }}
		.col-12(v-show="isOpened").row.container.items-start
			.col-12.row.items-center.title
				.titleIcon
					img(src="@/assets/images/ic_notice_r.png")
				span.titleText {{ $t("notice")[0] }}
				.space
				button(@click="noticeClick").titleClose
					img(src="@/assets/images/ic_close.png")
			.col-12.row.listContainer.content-start
				button.col-12(@click="listContainerClick(notice)", v-for="notice in list").list.row
					span(:style="{webkitLineClamp: notice.isClicked ? 'unset' : 3 }").listText.col {{ notice.content }}
					span(v-if="notice.isClicked").listIcon.col-auto ▲
					span(v-else).listIcon.col-auto ▼
</template>

<script>
import domain from "@/assets/jsons/domain/domain"

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
  created() {
    const self = this
    this.$axios
      .$post(domain.domain.backend1 + "noticeRest/notice_list", {
        // 2021.02.04 ksy- watt 기업번호 적용
        en_seq: 1
      })
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
