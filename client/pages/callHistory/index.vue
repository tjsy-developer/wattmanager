<template lang="pug">
	.row.content-start.notice
		.col-12.row.justify-center
			.col-12(v-if="compData.listTitle").row.justify-center.titleBar
				span {{ compData.title }}
			.col-12#printBox.row.justify-center
				.col-12.row.justify-end.list
					.col.row.justify-end.items-center
						span.subLabel 검색 기간:
						.row.items-center.justify-end
							.row
								input.dateBox(type="date" v-model="startDate" :max="endDate")
								input.dateBox(type="date" v-model="endDate" :min="startDate")
							.row
								button(@click="setPeriod(1)").buttons.buttons--grey 1개월
								button(@click="setPeriod(3)").buttons.buttons--grey 3개월
								button(@click="setPeriod(6)").buttons.buttons--grey 6개월
								button(@click="setPeriod(12)").buttons.buttons--grey 1년
							.row.items-center.justify-end(style="margin-left: 20px")
								select.partList(style="display: none" v-model="selectedPartic")
									option(value="") 선택안함
									option(value=option v-for="option in compData.option") {{ option }}
								button(@click="getCallHistory").buttons.buttons--green 조회
								button(@click="print()").buttons.buttons--blue 프린트
					//- .col-4.row.justify-end.items-center
					//- 	span.subLabel(style="display: none") 참여자:

				//- 통화 이력 division 시작위치
				.col-12.row.justify-end.list
					.col-4.row.items-end
						span.row.items-end.col-auto.subTitle {{ compData.listTitle }}
						a(v-if="compData.auth == 4 || compData.auth == 3", :href="$route.name + '/create'").col-auto.createBtn {{ $t("createAndEditComp")[0] }}
					.col-8.row.justify-end.items-end
						span.displayDetails ◎ 전체 통화 건수 : {{ entireCallCount }} 건
						span.displayDetails ◎ 전체 통화 시간 : {{ entireCallTime }}
				.col-12.content-start.list
					.col-12.row.listFilters
						div(v-for="bar in compData.listFilters", :class="[ bar.width?'col-auto':'col' ]", :style="{ width: bar.width+'%' }").row.justify-center
							button(v-if="bar.align").row.items-center
								span.titleBarText {{ bar.text }}
								img(v-if="$route.query.column == bar.align.column && $route.query.status == 'asc'", src="@/assets/images/list_icon_arrow_up.png", :style="{opacity:$route.query.column == bar.align.column ? 1 : 0.5}").alignIcon
								img(v-else, src="@/assets/images/list_icon_arrow_down.png", :style="{opacity:$route.query.column == bar.align.column ? 1 : 0.5}").alignIcon
							span(v-else) {{ bar.text }}
					.col-12.row.contents.page-break(v-for="(bars, listIndex) in compData.listData" v-if="compData.listData")
						div.content
							span(v-for="(bar, fileterIndex) in bars"  :key="fileterIndex" :style="{width: compData.listFilters[fileterIndex].width + '%'}") {{ bar }}
					.col-12.row.no-data-division(v-if="compData.listData.length == 0")
						.co-12 조회된 데이터가 없습니다.
				//- 참여자 통화 시간 division 시작위치
				.divisionLine.col-12
				.col-12.row.justify-end.list(v-if="false")
					.col-12.row.items-end
						span.row.items-end.col-auto.subTitle 참여자 통화 시간
						a(v-if="compData.auth == 4 || compData.auth == 3", :href="$route.name + '/create'").col-auto.createBtn {{ $t("createAndEditComp")[0] }}
				.col-12.row.content-start.list.individual-list(v-if="false")
					.row.listFilters
						div(v-for="bar in compData.individualList",:style="{ width: 250 +'px' }").row.justify-center
							span {{ bar.text }}
					.col-12.row.contents(v-for="(bars, listIndex) in compData.participantsList")
						div.content
							span(v-for="(bar, fileterIndex) in bars" :key="fileterIndex" :style="{width: 250 + 'px'}") {{ bar }}
</template>
<script>
import filtersJson from "@/assets/jsons/info/callHistory/filters"
import getFilters from "@/assets/scripts/info/getFilters"
import axiosJson from "@/assets/jsons/axios"
import domain from "@/assets/jsons/domain/domain"

export default {
    layout: "main",
    data() {
        return {
			startDate: "",
			endDate: "",
			selectedPartic: "",
			toggleParticTable: "",
			entireCallCount: 0,
			entireCallTime: 0,
			noData: false,
			div: "",
			initBody: "",
            compData: {
                title: "통화 이력",
                listTitle: "통화 이력",
                listData: [],
				participantsList: [
					["홍길동1", "통화시간"],
					["홍길동2", "통화시간"],
					["홍길동3", "통화시간"]
				],
                listFilters: getFilters(
                [
                   "번호",
                   "참여자",
                   "통화 시작 시간",
                   "통화 종료 시간",
                   "통화 시간"
                ],
                filtersJson
                ),
				individualList: [
					{ text: "참여자", width: 200 },
					{ text: "통화 시간", width: 200 }
				],
                getListDataParams: {
                    keyword: "",
                    order_by_column: "",
                    order_by_status: "",
                    page: 0
                },
				option: []
            }
        }
    },
	mounted() {
		this.setPeriod(1)
		this.getCallHistory()
	},
	methods: {
		print(id) {
			document.getElementById('__nuxt').style.overflow = 'visible'
			window.print(); // blocking
			document.getElementById('__nuxt').style.overflow = 'auto'
		},
		getCallHistory() {
			const [startDateTs, endDateTs] = this.convertToTimestamp()

			if (!startDateTs || !endDateTs) {
				alert(this.$t("검색 기간을 입력해주세요."))
				return
			}

			const params = {
				// en_seq: parseInt(localStorage.getItem("enSeq")),
				en_seq: parseInt(localStorage.getItem("enSeq")),
				start_time: startDateTs,
				end_time: endDateTs,
				device_id: this.selectedPartic ? this.selectedPartic : null
			}
			// 로딩바 on
			this.$nuxt.$emit("selectLoadingBar", true)

			this.$axios
			.post(domain.domain.backend1 + axiosJson.call.callHistory_list, params)
			.then((res)=> {
				console.log(res)
				// res.data[0] :: 통화이력 Array
				// res.data[1] :: 전체통화건수, 전체통화시간 Array
				const callHistoryResult = res.data[0]
				const entireCallTime = res.data[1]
				
				// 전체 통화건수
				this.entireCallCount = entireCallTime[0].call_count

				// 전체 통화 시간 - 00:00:00 -> 00시간 00분 00초로 변환
				if (entireCallTime[0].call_total_time) {
					const splitentireCallTime = entireCallTime[0].call_total_time.split(":")
					this.entireCallTime = `${splitentireCallTime[0]} ${this.$t("time")[0]}  ${splitentireCallTime[1]} ${this.$t("time")[1]} ${splitentireCallTime[0]} ${this.$t("time")[2]}`
				} else {
					this.entireCallTime = "-"
				}
				
				this.compData.listData = []
				this.compData.option = []
				for (let i = 0; i < callHistoryResult.length; i++) {
					const setStartTime = this.getTimeZoneEndSeconds(callHistoryResult[i].start_time)
					const setEndTime = this.getTimeZoneEndSeconds(callHistoryResult[i].end_time)
					
					// 참여자 추출
					const priv = callHistoryResult[i].participants.split(",")
					
					for(let index = 0; index < priv.length; index ++) {
						priv[index] = priv[index].trim()
						if (!this.compData.option.includes(priv[index])) {
							this.compData.option.push(priv[index])
						}
					}
					// 통화이력 리스트 push
					this.compData.listData.push([
						i + 1,
						callHistoryResult[i].participants,
						setStartTime,
						setEndTime,
						callHistoryResult[i].call_time
					])

				}
				// 로딩바 off
				this.$nuxt.$emit("selectLoadingBar", false)
			})
			.catch((error) => {
				console.log(error)
			})
		},
		// 검색기간 , 참여자 조건으로 통화이력 조회
		convertToTimestamp() {
			console.log(this.startDate, this.endDate, this.selectedPartic)
			// 참여자 목록 토글
			this.toggleParticTable = this.selectedPartic

			const splitStartDate = this.startDate.split("-")
			const splitEndDate = this.endDate.split("-")

			// TS :: timestamp 값으로 변환
			const startDateToTS = new Date(splitStartDate[0], splitStartDate[1]- 1, splitStartDate[2], 0, 0, 0).getTime()
			const endDateToTS = new Date(splitEndDate[0], splitEndDate[1]- 1, splitEndDate[2], 23, 59, 59).getTime()
			console.log("timestamp", startDateToTS, endDateToTS)
			console.log("dateTime", new Date(startDateToTS), new Date(endDateToTS))
			return [startDateToTS, endDateToTS]
		},
		getTimeZoneEndSeconds(standard) {
			const now = new Date(standard)
			const month = String(now.getMonth() + 1).toString().padStart(2, "0")
			const date = now.getDate().toString().padStart(2, "0")
			let hours = (now.getHours() < 12) ? now.getHours() : (now.getHours() - 12)
			hours = hours.toString().padStart(2, "0")
			const minutes = now.getMinutes().toString().padStart(2, "0")
			const seconds = now.getSeconds().toString().padStart(2, "0")
			const ampm = now.getHours() > 12 ? 'PM' : 'AM'

			const convertToDate =
				`${now.getFullYear()}-${month}-${date} ${hours}:${minutes}:${seconds} ${ampm}`

			return convertToDate
    	},
		// 기간 설정
		setPeriod(subtractMonth) {
			// subtractMonth :: 현재 일자 기준으로 차감할 월

			// 검색 기간 시작 날짜셋팅
			const now = new Date()
			const endYear = now.getFullYear()
			const endMonth =  String(now.getMonth() + 1).toString().padStart(2, "0")
			const endDay = now.getDate().toString().padStart(2, "0")
			const formattedendDate = [endYear, endMonth, endDay].join("-")
			this.endDate = formattedendDate

			// 검색 기간 마지막 날짜셋팅
			const onMonthAgo = new Date()
			onMonthAgo.setMonth(now.getMonth() - subtractMonth)
			const startYear = onMonthAgo.getFullYear()
			const startMonth = (onMonthAgo.getMonth() + 1).toString().padStart(2, "0")
			const startDay = onMonthAgo.getDate().toString().padStart(2, "0")
			const formattedStartDate = [startYear, startMonth, startDay].join("-")
			this.startDate = formattedStartDate
		}
	}
}
</script>
<style scoped lang="sass">
@import "@/assets/styles/infoTitle"

@media print
	body
		print-color-adjust: exact !important 
	.page-break
		break-inside: avoid
		break-after: auto
	.titleBar
		display: none
	#printBox
		padding: 20px
	.list
		width: 1200px !important
	.listFilter
		-webkit-print-color-adjust: exact
	@page
		margin: 0
		padding: 20px
		-webkit-print-color-adjust: exact !important
		size: landscape
	
#printBox
	page-break-before:always
	
.notice
	width: 100%
	min-width: $contentMaxWidth
	min-height: $contentHeight
	background-color: #EFF0F1
	print-color-adjust: exact
	-webkit-print-color-adjust: exact

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
	print-color-adjust: exact
	-webkit-print-color-adjust: exact
	border-radius: 2px

.list
	width: $contentMaxWidth

.listFilters
	font-size: 16px
	font-weight: bold
	background: #4173AC
	padding: 16px 0 13px
	margin-top: 10px
	width: inherit
	print-color-adjust: exact
	-webkit-print-color-adjust: exact

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
	width: inherit

.content
	width: inherit
	background: #fff
	padding: 25px 0px
	margin-top: 4px
// 	padding: 0 5px

$contentImgSize: 30px

.content>img
	width: $contentImgSize
	height: $contentImgSize
	padding-right: 4px

.content>span
	+ellipsis

.buttons
	margin-right: 5px
	border-radius: 5px
	width: 66px
	padding: 5px 0px
	color: #fff
	font-size: 13px
	print-color-adjust: exact
	-webkit-print-color-adjust: exact
	&--grey
		background: #707070 0% 0% no-repeat padding-box
		&:hover
			background-color: #034b6e	
	&--blue
		background: #008BCF 0% 0% no-repeat padding-box
		&:hover
			background-color: #034b6e
	&--green
		background: #1DBFA4 0% 0% no-repeat padding-box
		&:hover
			background-color: #079980

.dateBox
	border: 1px solid #ececec
	text-align: center
	padding: 5px
	width: 138px
	background: #fff
	margin-right: 5px
	margin-left: 5px
	text-align: left
	padding-left: 15px

input[type="date"]::-webkit-calendar-picker-indicator
	position: absolute
	top: 7px
	right: 2px
	content: ''
	width: 20px
	height: 22px
	background: url("../../assets/images/ic_calander.png") no-repeat
	z-index: 1
	cursor: pointer   

.partList
	border: 1px solid #ececec
	width: 180px
	background: #fff
	padding: 6px
	margin-left: 5px
	margin-right: 10px

.subLabel
	font-weight: bold
	font-size: 15px

.displayDetails
	font-family: normal normal 800 18px/26px NanumSquare
	font-size: 15px
	font-weight: bolder
	margin: 10px 5px 0px 20px

.divisionLine
	border: 1px solid transparent
	padding: 15px 0px

.no-data-division
	width: inherit
	height: 300px
	background: transparent
	display: flex
	align-items: center
	justify-content: center
	color: fff
	border: 1px solid #e5e5e5
	font-size: 15px



</style>