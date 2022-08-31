<template lang="pug">
	.row.justify-center.content-start.infoCreateAndEditContainer
		.col-12.row.justify-center.titleBar
			span(v-if="uploadOrFilebox == 'upload'") {{ $t("upload") }}
			span(v-else) {{ $t("fileBox") }}
		.col-12.row.justify-center.items-center
			.col-12.divisionLine
			.col-12.row.inputOptions.items-center.justify-center
				.col-12.row.inputOptions.items-center(v-if="uploadOrFilebox == 'upload'")
					p.col-12.discript {{ $t("upload text")[0] }}
					p.col-12.discript {{ $t("upload text")[1] }}
					p.col-12.discript {{ $t("upload text")[2] }}
					p.col-12.discript {{ $t("upload text")[3] }}
				.row.items-center.justify-center(v-else).fileBoxWrap
					span.fileBoxSentence {{ $t("fileBox text") }}
				.col-12.divisionLine
				.col-12.row.inputOptions.items-center
				span.col-auto {{ $t("upload text")[4] }}
				input.col-9(v-model="detailPath" v-if="uploadOrFilebox == 'upload'")
				div.col-9(v-if="uploadOrFilebox == 'filebox'" contentEditable="false" v-model="selectionFileName" style="background: white; max-height: 300px; height: auto; min-height: 30px; padding: 5px")#fileBoxFileName
				input(type="file", accept="*", @change='fileSelect()' ref="uploadFiles" multiple).col.fileSelectBtn
				//- img(src="@/assets/images/icons8-xls-48.png")
				//-input(type="file", accept="image/*", @change="fileTypeInputChange($event, contentKey-1)")#fileTypeInput.fileTypeInput
				.col-12.divisionLine
			.col-12.row.inputOptions.items-center
			.col-12.uploadBtn
				button(@click="submit") {{ $t("upload text")[6] }}
		infoForm(:compData="compData")
</template>

<script>
// import autoSize from "autosize"
import domain from "@/assets/jsons/domain/domain"
import filtersJson from "@/assets/jsons/info/upload/filters"
// import setGetListDataParams from "@/assets/scripts/info/setGetListDataParams"
import getFilters from "@/assets/scripts/info/getFilters"
import axiosJson from "@/assets/jsons/axios"

export default {
  layout: "main",
  props: ["isUpload"],
  data() {
    return {
      loadingBarStatus: false,
      detailPath: "",
      selectionFileName: "",
      uploadFiles: [],
      list: true,
      uploadOrFilebox: this.$route.query.viewType,
      fileuploadApi: "",
      compData: {
        self: this,
        title: false,
        align: false,
        type: null,
        search: false,
        listTitle: false,
        listFilters: getFilters(
          [
            this.$t("infoFilters")[0],
            this.$t("infoFilters")[1],
            this.$t("infoFilters")[2],
            this.$t("infoFilters")[3],
            this.$t("infoFilters")[9],
            this.$t("infoFilters")[15],
            this.$t("infoFilters")[16]
          ],
          filtersJson
        ),
        listData: [],
        deviceTypeList: [],
        getListDataUrl: axiosJson.upload.upload_list,
        getListCountUrl: axiosJson.upload.upload_list_count,
        getListDataParams: {
          jwt: "",
          page: 0,
          type: ""
        },
        setListData(getListData) {
          for (let i = 0; i < getListData.length; i++) {
            const a = new Date(getListData[i].upload_date * 1000)
            const year = a.getFullYear()
            const month = ("0" + (a.getMonth() + 1)).slice(-2)
            const date = ("0" + a.getDate()).slice(-2)
            const time = `${year}-${month}-${date}`
            this.listData.push([
              getListData[i].en_alias,
              getListData[i].hq_alias,
              getListData[i].br_alias,
              getListData[i].name,
              // eslint-disable-next-line eqeqeq
              this.type == "upload"
                ? `${getListData[i].file_path}\\\\${getListData[i].file_name}`
                : `\\\\filebox\\\\${getListData[i].file_name}`,
              time,
              {
                seq: getListData[i].upload_seq,
                fileName: getListData[i].file_name
              }
            ])
          }
          console.log(this.listData)
        }
      }
    }
  },
  methods: {
    // 파일 선택시 input text에 파일명을 넣어준다.
    fileSelect() {
      this.uploadFiles = this.$refs.uploadFiles.files

      if (this.uploadOrFilebox === "filebox") {
        // FormData의 값 확인
        const fileBoxFileNameBox = document.getElementById("fileBoxFileName")
        fileBoxFileNameBox.innerHTML = ""
        // const extensionArr = [
        //   "jpg",
        //   "pdf",
        //   "png",
        //   "ppt",
        //   "doc",
        //   "docx",
        //   "xls",
        //   "xlsx",
        //   "zip"
        // ]
        for (const pair of this.uploadFiles) {
          // const dotSplitFileName = pair.name.split(".")
          // const extension = dotSplitFileName[dotSplitFileName.length - 1]
          // const checkExtension = extensionArr.indexOf(extension)
          // if (checkExtension !== -1) {
          //   const imgTag = document.createElement("img")
          //   // const spanTag = document.createElement("span")
          //   imgTag.src = require("@/assets/images/icons8-" +
          //     extensionArr[checkExtension] +
          //     "-48.png")
          //   imgTag.style.height = "20px"
          //   fileBoxFileNameBox.append(imgTag)
          // }
          fileBoxFileNameBox.innerHTML += "&nbsp;" + pair.name + "<br>"
          console.log(fileBoxFileNameBox.value)
        }
      }
    },
    submit() {
      // eslint-disable-next-line prefer-const
      const formData = new FormData()
      // 파일업로드 메뉴: upload 타입 파라미터를, 파일함 메뉴 : filebox 타입 파라미터를 보냄
      formData.append(
        "type",
        // eslint-disable-next-line eqeqeq
        this.uploadOrfileBox == "upload" ? "upload" : "filebox"
      )
      // 로그인한 사용자의 토큰 정보를 formData에 넣는다
      formData.append("jwt", localStorage.getItem("jwt"))

      // 파워매니저에서 업로드 했다라고 구분
      formData.append("pmUpload", true)

      // 업로드할 파일이 선택되지않음
      if (this.uploadFiles.length === 0) {
        alert(this.$t("noUploadFile"))
        return
        // 파일업로드 페이지에서 상세경로를 미입력했을때
      } else if (this.detailPath === "" && this.uploadOrfileBox === "upload") {
        alert(this.$t("upload text")[0])
        return
      }

      formData.append(
        "detailPath",
        // eslint-disable-next-line eqeqeq
        this.uploadOrfileBox == "upload"
          ? this.detailPath.trim()
          : domain.detailFilePath
      )
      // 선택한 파일을 차례대로 넣는다
      for (let i = 0; i < this.uploadFiles.length; i++) {
        formData.append("uploadFiles", this.uploadFiles[i])
      }

      // FormData의 값 확인
      // for (const pair of formData.entries()) {
      //   console.log(pair[0] + ", " + pair[1])
      // }}

      // 파일 업로드시 로딩바삽입
      // alert(this.loadingBarStatus)
      this.loadingBarStatus = true
      this.$nuxt.$emit("setLoadingBar", this.loadingBarStatus)

      /* 업로드 클릭 페이지가 파일함 && doamin.separateBackendUploadPath == true (파일업로드 백엔드 경로 분리)
        일 경우에만 (파일함 백엔드 경로를 호출한다.) */
      if (
        this.uploadOrfileBox === "filebox" &&
        domain.separateBackendUploadPath
      ) {
        this.fileuploadApi = domain.fileBoxBackend
      } else {
        this.fileuploadApi = domain.domain.backend1
      }

      // 업로드 api를 호출
      const self = this
      this.$axios
        .post(this.fileuploadApi + "fileupload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(function(res) {
          // 파일 업로드시 로딩바삽입
          self.loadingBarStatus = false
          self.$nuxt.$emit("setLoadingBar", self.loadingBarStatus)

          if (res.data) {
            setTimeout(() => {
              alert(self.$t("upload text")[7] + res.data)
              window.location.reload()
            }, 200)
          } else {
            setTimeout(() => {
              alert(self.$t("upload text")[8])
              window.location.reload()
            }, 200)
          }
        })
        .catch(function(error) {
          console.log("File upload error : ", error)
        })
    }
  },
  mounted() {
    this.compData.getListDataParams.jwt = localStorage.getItem("jwt")
    this.compData.getListDataParams.page = Number(this.$route.query.page)
    this.uploadOrfileBox = this.$route.query.viewType
    this.compData.type = this.$route.query.viewType
    this.compData.getListDataParams.type = this.$route.query.viewType

    // autoSize(document.getElementById("fileBoxFileName"))
  }
}
</script>
<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"
.infoCreateAndEditContainer
	width: 100%
	min-width: $contentMaxWidth
	min-height: $contentHeight
	background-color: $contentBackground

.infoCreateAndEditContainer>div:not(.titleBar),
.titleBar>span
	width: $contentMaxWidth

.titleBar
	margin-bottom: 36px

.divisionLine
	height: 1px !important
	background-color: #D9D9D9
	margin-top: 15px

.inputOptions
	margin-top: 10px

.inputOptions
	>p
		font:normal normal normal 14px/16px NanumSquare
		padding-left: 26px
	>span
		font-size: 14px
		padding-right: 20px
		min-width: 120px
		padding-left: 26px

.inputOptions
	>input:not(.fileSelectBtn)
		height: 38px
		font-size: 14px
		background-color: white
		border: 1px solid #D9D9D9
		padding: 12px
		width: 955px

.fileSelectBtn
	//color: white
	//background: #9F9F9F 0% 0% no-repeat padding-box
	//padding: 9px 17px
	border-radius: 2px
	margin-left: 7px

.uploadBtn
	margin-top: 40px

.uploadBtn>button:nth-child(1)
	color: white
	background: #008BCF 0% 0% no-repeat padding-box
	padding: 10px 36px

.fileBoxSentence
	font-size: 30px
	font-weight: bold

.fileBoxWrap
	height: 110px

div:disabled
  background: white
</style>
