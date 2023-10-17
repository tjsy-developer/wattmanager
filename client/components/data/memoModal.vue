<template>
  <div class="column content-start memoModal">
    <div class="col-auto row full-width colseButtonContainer">
			<button class="zipSaveBtn" @click="zipSave()">{{ $t("zipDownload") }}</button>
      <button class="colseButton" @click="closeClick">X</button>
    </div>
    <div class="col row full-width contentsContainer">
      <div v-if="files.length != 0" v-for="(file, fileKey) in files" :key="fileKey" class="col-12 row file">
        <img v-if="file.file_type == 'P'" class="col-12" :src="webServerFilePathJson.original + file.original_name" />
        <video
          v-else-if="file.file_type == 'V'"
          class="col-12"
          :src="webServerFilePathJson.original + file.original_name"
          :poster="webServerFilePathJson.thumbnail + file.thumbnail_name"
          controls
        />
        <img v-else :src="webServerFilePathJson.thumbnail + file.thumbnail_name" />
        <button v-if="file.file_type == 'F'" class="pdfViewFile" @click="openPdf(webServerFilePathJson.original + file.original_name)">
          PDF {{ $t("open") }}
        </button>
        <button class="saveFile" @click="saveFileClick(file)" :style="{right: editAuth || userId == compData.userId ? '140px' : '30px'}">{{ $t("listComp")[8] }}</button>
        <button v-if="editAuth || userId == compData.userId" class="deleteFile" @click="deleteFileClick(file, fileKey)">{{ $t("memoModalComp")[0] }}</button>
      </div>
      <div class="col-12 empty" v-if="files.length == 0">
        <img class="memoEmptyImg" src="@/assets/images/ic_image.png" />
        <span class="memoEmptyText">{{ $t("memo no data")}}</span>
      </div>
      <section class="col-12 row content-start memoModalSection">
        <span class="col-12 memoModalDate">{{ getTimeZoneEndMinutes(compData.saveTime) }}</span>
        <span class="col-12 memoModalTitle">{{ $t("memo")[0] }}ㅣ{{ compData.userName }}</span>
        <section class="col-12 row memoModalSection2">
          <span class="col-auto">{{ $t("memo")[1] }}</span>
          <textarea v-if="editAuth || userId == compData.userId" class="col" id="memoModalTextarea" :placeholder="$t('memoModalComp')[1]">{{ compData.contents }}</textarea>
          <span v-else class="col" id="memoModalSpan">{{ compData.contents }}</span>
        </section>
        <div class="col-12 row justify-end memoBtns">
          <button v-if="editAuth || userId == compData.userId" class="memoModalSaveBtn" @click="saveBtnClick">{{ $t("memoModalComp")[2] }}</button>
          <button v-if="editAuth || userId == compData.userId" class="memoModalDeleteBtn" @click="deleteBtnClick">{{ $t("memoModalComp")[3] }}</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import autoSize from "autosize"
import axiosJson from "@/assets/jsons/axios"
const JSZip = require("jszip")

export default {
  props: ["compData", "files", "webServerFilePathJson"],
  data() {
    return {
      userId: localStorage.getItem("id"),
      auth: localStorage.getItem("auth"),
      loginUserHqSeq: localStorage.getItem("hqSeq"),
      loginUserBrSeq: localStorage.getItem("brSeq"),
      editAuth: true
    }
  },
  methods: {
    saveBtnClick() {
      const getValue = document.getElementById("memoModalTextarea").value
      const self = this
      this.$axios
        .post(process.env.backendURL + axiosJson.memo.memo_update, {
          memo_seq: this.compData.seq,
          memo_contents: getValue,
          jwt: localStorage.getItem("jwt")
        })
        .then(function(res) {
          if (res) {
            alert(self.$t("attachment")[1])
            self.compData.contents = getValue
          } else alert(self.$t("attachment")[2])
        })
        .catch(function(error) {
          console.log("memoModal page error : ", error)
        })
    },
    deleteBtnClick() {
      const self = this
      const result = confirm(self.$t("memoModalComp")[8])
      if (result) {
        this.$axios
          .post(process.env.backendURL + axiosJson.memo.memo_join_file_delete, {
            memo_seq: this.compData.seq,
            jwt: localStorage.getItem("jwt")
          })
          .then(function(res) {
            if (res) {
              self.$axios
                .post(process.env.backendURL + axiosJson.memo.memo_delete, {
                  memo_seq: self.compData.seq,
                  jwt: localStorage.getItem("jwt")
                })
                .then(function(res2) {
                  if (res2) {
                    alert(self.$t("memoModalComp")[4])
                    location.reload()
                  } else alert(self.$t("memoModalComp")[5])
                })
                .catch(function(error) {
                  console.log("memoModal page error : ", error)
                })
            } else alert(self.$t("memoModalComp")[7])
          })
          .catch(function(error) {
            console.log("memoModal page error : ", error)
          })
      } else {
      }
    },
    saveFileClick(file) {
      const link = document.createElement("a")
      const dataUrl = this.webServerFilePathJson.original + file.original_name
      link.style.display = "none"
      link.href = dataUrl
      link.download = file.original_name
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(dataUrl)
      })
    },
    deleteFileClick(file, fileKey) {
      const self = this
      const result = confirm(self.$t("memoModalComp")[9])
      if (result) {
        this.$axios
          .post(process.env.backendURL + axiosJson.memo.file_delete, {
            file_seq: file.file_seq,
            jwt: localStorage.getItem("jwt")
          })
          .then(function(res) {
            if (res.data === "pass") {
              alert(self.$t("memoModalComp")[6])
              self.files.splice(fileKey, 1)
              if (self.files.length)
                self.compData.thumbnailName = self.files[0].thumbnail_name
              else self.compData.thumbnailName = null
            } else if (res.data === "fail") {
              alert(self.$t("memoModalComp")[7])
            } else alert(self.$t("memoModalComp")[7])
          })
          .catch(function(error) {
            console.log("memoModal deleteFileClick error : ", error)
          })
      } else {
      }
    },
    closeClick() {
      this.$modal.hide("memoModal")
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
    },
    openPdf(src) {
      const win = window.open()
      win.document.body.style.margin = "0px"
      const embed = document.createElement("EMBED")
      embed.setAttribute("src", src)
      embed.setAttribute("width", "100%")
      embed.setAttribute("height", "100%")
      win.document.body.appendChild(embed)
    },
    memoEditAuth(writerHqSeq, writerBrSeq) {
      /* 최종관리자, 기업관리자 인경우 기업,본부,지사를 따로 체크하지 않는다 */
      // console.log("my auth ==> ", this.auth)
      // console.log("my hq_seq ==> ", this.loginUserHqSeq)
      // console.log("my br_seq ==> ", this.loginUserBrSeq)

      // console.log("writer hq_seq ==> ", writerHqSeq)
      // console.log("writer br_seq ==> ", writerBrSeq)

      /* 로그인한 사용자가 본부관리자인경우 작성자와 본부가 같은지  체크 후 삭제권한 부여 */
      // eslint-disable-next-line eqeqeq
      if (this.auth == 2) {
        // eslint-disable-next-line eqeqeq
        if (this.loginUserHqSeq != writerHqSeq) {
          return false
        }
        /* 로그인한 사용자가 지사관리자인경우 작성자와 본부,지사가 같은지 체크 후 삭제권한 부여 */
        // eslint-disable-next-line eqeqeq
      } else if (this.auth == 1) {
        if (
          // eslint-disable-next-line eqeqeq
          this.loginUserHqSeq != writerHqSeq ||
          // eslint-disable-next-line eqeqeq
          this.loginUserBrSeq != writerBrSeq
        ) {
          return false
        }
        /* 사용자는 메모 삭제 권한 없음 */
        // eslint-disable-next-line eqeqeq
      } else if (this.auth == 0) {
        return false
      }
      return true
    },
    async zipSave() {
      const zip = new JSZip()
			const date = new Date()
			const dYear = date.getFullYear()
			const dMonth = date.getMonth() + 1
			const dDate = date.getDate()
      let folderName = ""
			if (sessionStorage.getItem("languageCode") == "ko") {
				folderName = "와트_메모_" + dYear + dMonth + dDate
			} else {
				folderName = "Watt_Memo_" + dYear + dMonth + dDate
			}
			let fileName = ""
			// src: this.webServerFilePathJson.original + ele.original_name,
			for (let iLoop = 0; iLoop < this.files.length; ++iLoop) {
				const ele = this.files[iLoop]

				// 파일 명
				fileName = ele.original_name

				// 이미지 저장 생성 부분
				const response = await fetch(this.webServerFilePathJson.original + ele.original_name)
				const data = await response.blob()
				zip.file(fileName, data)
			}
			zip.generateAsync({type: "blob"}).then((zip) => {
				const zipLink = document.createElement("a")
				// zip 폴더에 접근할 수 있는 url 생성
				zipLink.href = URL.createObjectURL(zip)
				// 폴더명 지정
				zipLink.download = folderName
				zipLink.click()
				// zip 폴더 다운로드 후 생성한 url 제거
				zipLink.remove()
				URL.revokeObjectURL(zip)
			})
    }
  },
  mounted() {
    console.log(this.compData)
    this.editAuth = this.memoEditAuth(
      this.compData.writerHqSeq,
      this.compData.writerBrSeq
    )
    // console.log("my editAuth==? ", this.editAuth)
    // console.log(
    //   "userId / compData.userId ==>",
    //   this.userId,
    //   "/",
    //   this.compData.userId
    // )
    autoSize(document.getElementById("memoModalTextarea"))
  }
}
</script>

<style lang="sass" scoped>
.memoModal
	width: 100%
	height: 100%
	background: white

.colseButtonContainer
	display: flex
	border-bottom: 1px solid #d9d9d9
	justify-content: space-between
	align-items: center

.colseButton
	padding: 10px 20px
	font-size: 20px
	font-weight: bold
	color: gray
	right: 30px

.contentsContainer
	overflow-y: auto

.file
	padding: 30px
	border-bottom: 1px solid #d9d9d9

.empty
	height: 400px
	background-color: #d3d3d3
	text-align: center

.pdfViewFile
	position: absolute
	width: 100px
	height: 40px
	top: 30px
	right: 250px
	color: white
	background-color: #9e9e9e
	&:hover
		background-color: #757575

.zipSaveBtn
	width: 100px
	height: 40px
	color: white
	background-color: #008bcf
	left: 30px
.saveFile
	position: absolute
	width: 100px
	height: 40px
	top: 30px
	// right: 140px
	color: white
	background-color: #008bcf

.deleteFile
	position: absolute
	width: 100px
	height: 40px
	top: 30px
	right: 30px
	color: white
	background-color: #bf1d1d

.memoModalSection
	padding: 20px
	padding-bottom: 50px

.memoModalDate,
.memoModalTitle
	+ellipsis

.memoModalDate
	font-size: 14px
	color: #676767

.memoModalTitle
	width: 100%
	font-size: 16px
	font-weight: 700
	color: #005bac
	padding-top: 8px

.memoModalSection2
	padding-top: 12px

	span
		padding-top: 5px
		padding-right: 15px

	#memoModalSpan,
	#memoModalTextarea
		font-size: 15px
		padding: 5px

	#memoModalTextarea
		border: 1px solid #d3d3d3

.memoBtns
	padding-top: 20px

.memoModalSaveBtn,
.memoModalDeleteBtn
	width: 100px
	height: 40px
	margin-right: 15px
	color: white

.memoModalSaveBtn
	background-color: #008bcf

.memoModalDeleteBtn
	background-color: #bf1d1d

.memoEmptyImg
  position: absolute
  top: 32%
  left: 45%
  width: 95px

.memoEmptyText
	width: 100%
	position: absolute
	top: 52%
	color: #a5a5a5
	font-size: large

// .pdfView
//   width: 923px
//   height: 479px
//   position: absolute
//   z-index: 2
//   display: flex
//   align-items: center
//   justify-content: center
//   &:hover
//     background: rgba(0, 0, 0, 0.2)
//     .pdfOpen
//       display: block

// .pdfOpen
//   display: none
//   padding: 5px 20px
//   color: black
//   background: white
//   border-radius: 4px
//   text-align: center
//   font-size: 16px
//   &:hover
//     background: #757575
//     color: #fff

</style>
