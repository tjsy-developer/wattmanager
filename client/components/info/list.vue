<template lang="pug">
	.row.content-start.list
		.col-12.row.listFilters
			div(v-for="bar in compData.listFilters", :class="[ bar.width?'col-auto':'col' ]", :style="{ width: bar.width+'px' }").row.justify-center
				button(v-if="bar.align", @click="alignBtnClick(bar)").row.items-center
					span.titleBarText {{bar.text}}
					img(v-if="$route.query.column == bar.align.column && $route.query.status == 'asc' && compData.align !== false", src="@/assets/images/list_icon_arrow_up.png", :style="{opacity:$route.query.column == bar.align.column ? 1 : 0.5}").alignIcon
					img(v-else-if="compData.align !== false" , src="@/assets/images/list_icon_arrow_down.png", :style="{opacity:$route.query.column == bar.align.column ? 1 : 0.5}").alignIcon
				span(v-else) {{bar.text}}
		.col-12.row.contents
			.col-12(v-for="(contents, contentskey) in compData.listData", :key="contentskey").row
				span(:style="{ width: compData.listFilters[0].width+'px' }") {{ contents[contents.length-1].seq ? contents[contents.length-1].seq : contents[contents.length-1].order_by_num }}
				.row.justify-center.items-center.content(
					v-for="(content, contentKey) in contents",
					v-if="contentKey != contents.length-1"
					:key="contentKey",
					:class="[ compData.listFilters[contentKey+1] && compData.listFilters[contentKey+1].width?'col-auto':'col' ]",
					:style="{ width: compData.listFilters[contentKey+1] && compData.listFilters[contentKey+1].width+'px' }"
				)
					img(v-if="compData.deviceTypeList && contentKey == 0 && compData.title == $t('user')[2] || compData.deviceTypeList && contentKey == 1 && compData.title == $t('device')[2]" :src="deviceTypeIcons[compData.deviceTypeList[contentskey]-1]").col-auto
					span(:style="{maxWidth: compData.deviceTypeList && contentKey == 0 && compData.title == $t('user')[2] || compData.deviceTypeList && contentKey == 1 && compData.title == $t('device')[2] ? 'calc(100% - 30px)' : undefined }").col-auto {{ content }}
				.row(:class="[ compData.listFilters[compData.listFilters.length-1].width?'col-auto':'col' ]", :style="{ width: compData.listFilters[compData.listFilters.length-1].width+'px' }").justify-center
					a(v-if="contents[contents.length-1].auth && $route.name != 'upload'", :href="$route.name + '/edit?seq=' + contents[contents.length-1].seq")
						img(src="@/assets/images/member_list_icon_edit.png")
					a(v-else-if="contents[contents.length-1].auth == false && $route.name == 'user'", :href="$route.name + '/edit?seq=' + contents[contents.length-1].seq")
					.upload(v-else-if="$route.name == 'upload'")
						button(v-if="$route.query.viewType == 'upload'" style="padding-right: 10px;" disabled)
							img(src="@/assets/images/list_icon_download.png")
						button(v-if="$route.query.viewType == 'upload'" disabled)
							img(src="@/assets/images/ic_trash.png")
						button(v-if="$route.query.viewType == 'filebox'" @click="downloadBtn(`${filePath}${contents[contents.length-1].fileName}`)" style="padding-right: 10px;")
							img(src="@/assets/images/list_icon_download.png")
						button(v-if="$route.query.viewType == 'filebox'" @click="deleteUploadList(contents[contents.length-1].seq, contents[contents.length-1].fileName)")
							img(src="@/assets/images/ic_trash.png")
					a(v-else , :href="$route.name + '/edit?seq=' + contents[0]")
						img(src="@/assets/images/member_list_icon_edit.png")
</template>

<script>
import domain from "@/assets/jsons/domain/domain"
import axiosJson from "@/assets/jsons/axios"
export default {
  components: {},
  props: ["compData"],
  data() {
    return {
      contentsPerPage: 10,
      deviceTypeIcons: [
        require("@/assets/images/icon_device_phone.png"),
        require("@/assets/images/icon_device_glass.png"),
        require("@/assets/images/icon_device_pc.png")
      ],
      filePath: domain.att_filePath,
      fileuploadApi: "",
      uploadOrfileBox: ""
    }
  },
  methods: {
    alignBtnClick(e) {
      console.log("alignBtnClick", e)
      const getKeyword = this.$route.query.keyword
      const getColumn = e.align.column
      let getStatus = e.align.status

      if (
        getStatus === this.$route.query.status &&
        getColumn === this.$route.query.column
      )
        getStatus = "asc"

      if (getKeyword)
        window.open(
          "/" +
            this.$route.name +
            "?keyword=" +
            getKeyword +
            "&column=" +
            e.align.column +
            "&status=" +
            getStatus +
            "&page=1",
          "_self"
        )
      else {
        window.open(
          "/" +
            this.$route.name +
            "?column=" +
            e.align.column +
            "&status=" +
            getStatus +
            "&page=1",
          "_self"
        )
      }
    },
    deleteUploadList(seq, fileName) {
      const currentLang = sessionStorage.getItem("languageCode")

      let deleteFileQAText = ""
      if (currentLang === "ko") {
        deleteFileQAText = fileName + this.$t("deleteFile")
      } else {
        deleteFileQAText = this.$t("deleteFile") + fileName
      }

      const QAResult = confirm(deleteFileQAText)

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

      if (QAResult) {
        const dataParams = {
          jwt: localStorage.getItem("jwt"),
          upload_seq: seq,
          file_path: domain.detailFilePath + "\\\\",
          file_name: fileName
        }
        // upload는 삭제할 일이 없다
        // file_path
        // dev (filebox, upload)-> "D:\\\\Storage\\\\powertalk\\\\dev\\\\filebox",
        // meet (filebox) domain.fileBoxBackend + domain.detailFilePath "D:\\\\cloud\\\\powertalk\\\\meet\\\\filebox"
        // meet (upload) domain.domain.backend1
        this.$axios
          .post(this.fileuploadApi + axiosJson.upload.upload_delete, dataParams)
          .then(function(res) {
            if (res.data === "success") {
              window.location.reload()
            } else {
              alert(this.t("memoModalComp")[7])
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    },
    downloadBtn(fileUrl) {
      this.$axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob",
        credmential: true
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        const fileName = fileUrl.split("/")
        link.style.display = "none"
        link.href = url
        link.download = fileName[fileName.length - 1]
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }, 0)
      })
    }
  },
  mounted() {
    console.log(this.compData.listData)
    this.uploadOrfileBox = this.$route.query.viewType
  }
}
</script>

<style lang="sass" scoped>
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

.contents>div
	background: white
	padding: 25px 0

.contents>div:first-child
	margin-top: 10px

.contents>div
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

@media (min-width: 0)
	.row>.col-8
		height: auto
		width: 1260px
</style>
