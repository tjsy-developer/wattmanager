<template>
  <div class="row justify-center content-start qrCreateContainer">
    <div class="col-12 row justify-center titleBar">
      <span>QR</span>
    </div>
    <div class="col-12 row content-start">
      <div class="row col-12 justify-end" style="height: 50px;">
        <div class="tab active row justify-center items-center" @click.self="fileType(1, $event)">{{ $t("elecFile")[0] }}</div>
        <div class="tab row justify-center items-center" @click.self="fileType(0, $event)">{{ $t("elecFolder")[0] }}</div>
      </div>
      <div class="col-12 divisionLine" style="margin-top: 0px"></div>
      <div class="col-12 row inputOptions items-center">
        <div class="col-12 row inputOptions items-center"></div>
        <span class="col-auto row justify-center">{{ type == 1 ? $t("elecFile")[1] : $t("elecFolder")[1] }}</span>
        <div v-if="type == 1" class="col electFileInputBox" contentEditable="false" id="elecFileName"></div>
        <input v-if="type == 1" class="col-2 fileSelectBtn" type="file" accept="*" @change='fileSelect()' ref="uploadFiles" multiple style="margin-left: 14px;" />
        <input v-if="type == 0" class="col electFolderInputBox" v-model="enterFolderPath" id="elecFolderPath" :placeholder="$t('elecFolder')[2]" style="margin-right: 10px; padding-left: 10px;" />
        <div class="col-12 divisionLine"></div>
      </div>
      <div class="col-12 createBtns">
        <button @click="readyState ? fileUpload() : QRCreateBtnClick(curQrInfo.QRList, curQrInfo.QRName)">{{ $t("powerQR text")[5] }}</button>
        <button @click="QRprintBtnClick">{{ $t("powerQR text")[6] }}</button>
        <div class="col resizeContainer">
          <span class="label">{{ $t("powerQR text")[7] }} (cm)</span>
          <span>W:</span>
          <input class="qrWidth" v-model="qrWidth" name="W" @keyup="QRresizeBtnClick($event)" />
          <span>X</span>
          <span>H:</span>
          <input class="qrHeight" v-model="qrHeight" name="H" @keyup="QRresizeBtnClick($event)" />
        </div>
      </div>
      <div :v-if="isCreateQR" class="col-12 justify-center qrContainer">
        <div class="col-12 qrContain" v-for="(item) in qrCodeImg">
          <img clas="safetyQR" :src="item.imgUrl" id="image" :style="{width:Width+'px',height:Height+'px'}" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode"

export default {
  layout: "main",
  data() {
    return {
      name: "",
      age: "",
      blood_type: "",
      medical_history: "",
      hqts: "",
      isCreateQR: true,
      qrCodeImg: [],
      qrSize: undefined,
      qrWidth: 4,
      qrHeight: 4,
      Width: 151,
      Height: 151,
      fileuploadApi: "",
      selectionFileName: "",
      enterFolderPath: "",
      type: 1,
      readyState: true,
      curQrInfo: {
        QRName: [],
        QRList: []
      }
    }
  },
  mounted() {
    this.uploadFiles = this.$refs.uploadFiles.files
  },
  methods: {
    fileSelect() {
      this.uploadFiles = this.$refs.uploadFiles.files

      const fileBoxFileNameBox = document.getElementById("elecFileName")
      fileBoxFileNameBox.innerHTML = ""

      for (const pair of this.uploadFiles) {
        fileBoxFileNameBox.innerHTML += "&nbsp;" + pair.name + "<br>"
      }
      this.readyState = true
    },
    fileType(type, e) {
      // 기존 값 초기화
      this.qrCodeImg = []
      this.enterFolderPath = ""

      // 타입변경
      this.type = type

      // 선택된 탭 색상 변경
      const beforeSelected = document.getElementsByClassName("active")
      beforeSelected[0].classList.remove("active")
      e.target.classList.add("active")

      // QR생성 대기상태 초기화
      this.readyState = true
    },
    fileUpload() {
      const formData = new FormData()
      // type value --> 전자파일: 1, 전자폴더 0
      formData.append("type", this.type)

      // 로그인한 사용자의 토큰 정보를 formData에 넣는다
      formData.append("jwt", localStorage.getItem("jwt"))

      let detailPath

      if (this.type === 1) {
        detailPath = process.env.elecFilePath

        // 업로드할 파일이 선택됬는지 체크한다.
        if (this.uploadFiles.length === 0) {
          alert(this.$t("elecFile")[1])
          return
        } else {
          // 선택한 파일을 차례대로 넣는다
          for (let i = 0; i < this.uploadFiles.length; i++) {
            formData.append("uploadFiles", this.uploadFiles[i])
          }
        }
      } else if (this.type === 0) {
        // 생성할 폴더명을 입력했는지 체크한다
        if (this.enterFolderPath.length === 0) {
          alert(this.$t("elecFolder")[2])
          return
        } else {
          detailPath = process.env.elecFolderPath + "\\\\" + this.enterFolderPath
        }
      }

      formData.append("detailPath", detailPath)

      this.fileuploadApi = process.env.fileBoxBackend

      // this.fileuploadApi = "http://192.168.20.79:8090/PowerManagerBackend/"
      // 업로드 api를 호출
      const self = this

      // formData 확인
      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1])
      }

      this.$nuxt.$emit("setLoadingBar", true)
      this.$axios
        .post(this.fileuploadApi + "fileupload/qrcode", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(function(res) {
          console.log(res)
          self.curQrInfo.QRName = []
          self.curQrInfo.QRList = []

          if (res.data) {
            // 전자파일
            if (self.type === 1) {
              const fileBoxFileNameBox = document.getElementById("elecFileName")
              const fileName = res.data.split("\n")

              fileBoxFileNameBox.innerHTML = ""
              const getDomain = process.env.backendURL.split(":")
              const getGlassQrPath = process.env.elecFilePath.split(":\\\\")
              // 응답결과로 저장경로 + 파일명으로 파일 경로를 만든다.
              for (let i = 1; i < fileName.length; i++) {
                const QRfilePath =
                  getDomain[0] +
                  ":" +
                  getDomain[1] +
                  "/" +
                  getGlassQrPath[1] +
                  "\\\\" +
                  fileName[i]

                self.fileTypeCheck(QRfilePath, fileName[i])
              }
              // 전자폴더
            } else if (self.type === 0) {
              const folderNames = res.data.split("folder\\\\")
              const folderNameToUse = folderNames[1]

              self.enterFolderPath = ""
              self.folderTypeCheck(res.data, folderNameToUse)
            }

            // 파일 업로드시 로딩바삽입
            self.$nuxt.$emit("setLoadingBar", false)
            self.readyState = false
          } else {
            console.log("response.data == ''")
            alert(self.$t("QRcreationFailed"))
          }
        })
        .catch(function(error) {
          console.log("File upload error : ", error)
        })
    },
    // 전자파일 QR객체정보를 만든다
    fileTypeCheck(fileURL, QRName) {
      this.isCreateQR = true
      const QrInfo =
        '{"fileURL":"' + fileURL + '", "fileName":"' + QRName + '"}'
      this.curQrInfo.QRName.push(QRName)
      this.curQrInfo.QRList.push(QrInfo)
      this.QRCreateBtnClick(QrInfo, QRName)
    },
    // 전자폴더 QR객체정보를 만든다
    folderTypeCheck(folderURL, QRName) {
      this.isCreateQR = true
      const QrInfo =
        '{"folderURL":"' + folderURL + '", "folderName":"' + QRName + '"}'
      this.curQrInfo.QRName.push(QRName)
      this.curQrInfo.QRList.push(QrInfo)
      this.QRCreateBtnClick(QrInfo, QRName)
    },
    // 실제 QR생성
    createQR(enterQRInfo, enterQRName) {
      /* QR option */
      const opts = {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.3,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff"
        }
      }

      QRCode.create(enterQRInfo, opts)
      const imgUrl = QRCode.toDataURL(enterQRInfo, opts)

      /* prototype promise */
      imgUrl.then(value => {
        const arr = {}
        arr.name = enterQRName
        arr.imgUrl = value
        this.qrCodeImg.push(arr)
      })
    },
    // QR 생성 전 QRInfo 객체타입 체크 후 생성요청 (다중 QR생성때문)
    QRCreateBtnClick(QrInfo, QRName) {
      let enterQRInfo
      let enterQRName
      if (Array.isArray(QrInfo)) {
        for (let i = 0; i < QrInfo.length; i++) {
          enterQRInfo = QrInfo[i]
          enterQRName = QRName[i]
          this.createQR(enterQRInfo, enterQRName)
        }
      } else {
        this.createQR(QrInfo, QRName)
      }
    },
    // QR 인쇄
    QRprintBtnClick() {
      const qrPrint = document.getElementsByClassName("qrContainer")[0]
        .innerHTML
      console.log(qrPrint)
      const win = window.open()
      win.document.open()
      win.document.write(
        "<html><head><title></title><style>" +
          "div:nth-child(0){" +
          "width: 100%;" +
          "}" +
          ".qrContain {" +
          "display: inline-block;" +
          "padding: 10px 10px 10px;" +
          "}" +
          ".qrContain>img {" +
          "display: block;" +
          "}" +
          ".qrContain>span {" +
          "display: block;" +
          "text-align: center;" +
          "}" +
          "</style></haed><div>"
      )
      win.document.write(qrPrint)
      // win.document.write('body, td {font-falmily: Verdana; font-size: 10pt;}');
      win.document.write("</div><body>")
      win.document.write("</body></html>")
      win.document.close()
      win.print()
    },
    /* 변경된 width, height 값 -> px 변환 */
    QRresizeBtnClick(event) {
      const changeProperty = event.target.name

      // a4사이즈 기준으로 최댓값 지정
      if (event.target.value > 21) {
        alert(this.$t("QRMaxValue"))
        event.target.value = 21
      }

      if (changeProperty === "W") {
        this.qrWidth = event.target.value
        this.Width = this.conversion(event.target.value)
        this.Height = this.conversion(this.qrHeight)
      } else {
        this.qrHeight = event.target.value
        this.Width = this.conversion(this.qrWidth)
        this.Height = this.conversion(event.target.value)
      }
    },
    /* cm --> px 변환 */
    conversion(value) {
      const conversionVal = value * 37.795275590551
      return conversionVal
    }
  }
}
</script>
<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"
.tab
	// padding: 13px 40px 9px 40px;
	color: white
	border-radius: 10px 10px 0px 0px
	height: inherit
	font-size: 15px
	width: 185px
	background: #BFCCD6
	cursor: pointer
	width: 150px
	font-weight: bold
	&:first-child
		margin-right: 2px

.active
	background: #0061D1 !important

.electFileInputBox,
.electFolderInputBox
	background: white
	max-height: 300px
	height: auto
	min-height: 30px
	padding: 5px

.qrCreateContainer
	width: 100%
	min-width: $contentMaxWidth
	min-height: $contentHeight
	background-color: $contentBackground

.qrCreateContainer>div:not(.titleBar),
.titleBar>span
	width: $contentMaxWidth

.titleBar
	margin-bottom: 36px

.createTitle
	font-size: 22px
	font-weight: 800
	margin-bottom: 21px

.divisionLine
	height: 1px !important
	background-color: #D9D9D9
	margin-top: 15px

.inputOptions
	margin-top: 10px

.inputOptions>span
	font-size: 14px
	padding-right: 20px
	min-width: 120px


.createBtns,
.editBtns
	margin-top: 40px

.createBtns
	>button
		padding: 10px 36px
		color: white
		&:nth-child(1)
			background-color: #1DBFA4
			margin-left: 8px

.createBtns>button:nth-child(2),
.editBtns>button:nth-child(2)
	background-color: #9F9F9F
	margin-left: 8px

.editBtns>button:nth-child(3)
	color: white
	background-color: #008BCF
	padding: 10px 36px
.qrContainer
	margin-top: 20px

.qrContain
	display: grid
	padding: 24px 24px 0px 24px
	>img
		margin-bottom: 2px
	>span
		text-align: center
		font-size: 18px

.qrResize
	color: #ffffff
	background-color: #EA5B2F
	padding: 11px 15px
	margin-left: 8px
	>option
		background-color: #ffffff
		color: #000000

.qrWidth,.qrHeight
	background: white
	width: 50px
	height: 34px
	padding-left: 7px
	padding-right: 7px
	margin-left: 10px

.resizeContainer
	float: right

.resizeContainer
	>span
		margin-top: 7px
		margin-left: 10px
</style>
