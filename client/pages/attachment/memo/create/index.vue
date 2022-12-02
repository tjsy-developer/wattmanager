<template lang="pug">
	.row.justify-center.content-start.infoCreate
		.col-12.row.justify-center.titleBar
			span {{ $t("memo")[1] }}
		.col-12.row.justify-center.content-start
			span.col-12.createTitle {{ $t("memo")[3] }}
			.col-12.row
				.col-12.divisionLine
				.col-12.row.editOptions.items-center
					span.col-auto {{ $t("notice")[1] }}
					textarea(rows=10, spellcheck="false" v-model="memoContent").col.textareaClass
				.col-12.divisionLine
				.col-12.row.editOptions.items-center
					span.col-auto {{ $t("upload text")[4] }}
					.column.col
						.col-12.row.justify-between.items-center.memoFiles(v-for="(cnt, cntIndex) in inserFileCnt")
							input(type="text" readOnly).col-10.fileName
							input(type="file"  :name="`file${cntIndex}`", accept=".jpg, .png, .jpeg, .gif, .bmp, .pdf, .mp4" @change="extensionCheck").col.file
			.col-12.divisionLine
			.col-12.row.justify-center.createBtns
				button(@click="createBtnClick") {{ $t("noticeUpload")[0] }}
				button(@click="cancleBtnClick") {{ $t("createAndEditComp")[2] }}
</template>

<script>
import domain from "@/assets/jsons/domain/domain"

export default {

  layout: "main",
  data() {
    return {
      enSeq: undefined,
      id: undefined,
      auth: undefined,
      listFilters: undefined,
      token: undefined,
      inserFileCnt: 5,
			memoContent: ""
    }
  },
  methods: {
		extensionCheck(e) {
			console.log(e.target.files[0].name)
			const extractExtension = e.target.files[0].name.split('.').pop().toLowerCase();
			const possibleExtensions = ['jpg', 'png', 'jpeg', 'pdf', 'gif', 'bmp', 'mp4']
			if (possibleExtensions.indexOf(extractExtension) == -1) {
				alert(extractExtension + this.$t("upload text")[9]);
				e.target.value = ""
				e.target.previousSibling.value = ""
			} else {
				e.target.previousSibling.value = e.target.files[0].name
			}
		},
    createBtnClick() {
        const formData = new FormData()

        // 로그인한 사용자의 토큰 정보를 formData에 넣는다
        formData.append("jwt", localStorage.getItem("jwt"))
        // 백엔드가 userId를 가지고 기업, 본부, 지사번호를 조회한다.
        formData.append("user_id", sessionStorage.getItem("logined"))
        // 파워매니저에서 업로드 했다라고 구분
        formData.append("memo_contents", this.memoContent)
        // 메모 저장 위치
        formData.append("save_folder", domain.powermemoSavefolder)

        // 선택한 파일을 차례대로 넣는다
        const fileEl = document.getElementsByClassName("file")
		let uploadFileCnt = 0
        Array.from(fileEl).forEach((el) => {
            if (el.files[0]) {
				uploadFileCnt++
                formData.append("upload_files", el.files[0])
            }
        })

        //FormData의 값 확인
        // for (const pair of formData.entries()) {
        //     console.log(pair[0], ", ", pair[1])
        // }

		if (uploadFileCnt == 0 && !this.memoContent) {
			alert(this.$t("memo")[6])
			return
		}
        // 파일 업로드시 로딩바삽입
        this.$nuxt.$emit("setLoadingBar", true)
        const self = this
        // 메모 생성 api
        this.$axios
        .post(domain.domain.backend1 + "fileupload/memo_insert", formData, {
            headers: {
                "Content-Type": "multipart/form-data; charset=UTF-8;",
                "jwt": localStorage.getItem("jwt")
            }
        })
        .then(function(res) {
            if (res) {
                console.log(res)
                self.$nuxt.$emit("setLoadingBar", false)
                if (res.data.RESULT == '1000'){
                    alert(self.$t("memo")[4])
                    window.open("/attachment/memo?page=1&viewType=gallery", "_self")
                } else {
                    alert(self.$t("memo")[5])
                }
            }
        })
        .catch(function(error) {
            console.log("memo create error : ", error)
            self.$nuxt.$emit("setLoadingBar", false)
            alert(self.$t("memo")[5])
        })
    },
    cancleBtnClick() {
      window.history.back()
    }
  },
  mounted() {
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"

.infoCreate
	width: 100%
	min-width: $contentMaxWidth
	min-height: $contentHeight
	background-color: $contentBackground

.infoCreate>div:not(.titleBar),
.titleBar>span
	width: $contentMaxWidth

.titleBar
	margin-bottom: 36px

.infoImg
	>img,
	>video
		width: 660px
		margin: 35px 0 15px
		object-fit: cover

.createTitle
	font-size: 22px
	font-weight: 800
	margin-bottom: 21px

.divisionLine
	height: 1px !important
	background-color: #D9D9D9
	margin-top: 15px

.editOptions
	margin-top: 10px

.editOptions>span
	font-size: 14px
	padding-right: 20px
	min-width: 143px

.editOptions>input:not(.fileTypeInput)
	height: 38px
	font-size: 14px
	background-color: white
	border: 1px solid #D9D9D9
	padding: 12px

.createBtns
	margin-top: 40px
	>button
		border-radius: 2px

.createBtns>button:nth-child(1)
	color: white
	background-color: #1DBFA4
	padding: 10px 36px
	&:hover
		background-color: #079980

.createBtns>button:nth-child(2)
	color: white
	background-color: #9F9F9F
	padding: 10px 36px
	margin-left: 15px
	&:hover
		background-color: #707070

.selectCompClass
	width: 100%
	padding: 10px
	border: 1px solid #D9D9D9
	background-color: white

.textareaClass
	font-size: 14px
	background-color: white
	border: 1px solid #D9D9D9
	padding: 12px
	overflow: auto

.fileName
	background: #fff
	border: 1px solid #ececec

.memoFiles
	height: 30px
	margin: 10px 0px
	>input[type="text"]
		border: 1px solid #D9D9D9
		margin-right: 10px
		height: inherit
		cursor: no-drop

input[type="file"]::file-selector-button
	background: white
	border: 1px solid #BDBDBD
	font-family: "NanumSquare"
	padding: 6px 10px
	border-radius: 3px
	background: #FAFAFA
	&:hover
		cursor: pointer
		border: 1px solid #4D4D4D
		// background-color: rgba(129, 129, 129, 0.8)
		// color: #fff
</style>
