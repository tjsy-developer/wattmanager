<template>
  <div class="row justify-center content-start qrCreateContainer">
    <div class="col-12 row justify-center titleBar">
      <span>{{ $t("powerQR") }}</span>
    </div>
    <div class="col-12 row content-start">
      <div class="col-12 divisionLine"></div>
      <div class="col-12 row inputOptions items-center">
        <span class="col-auto">{{ $t("powerQR text")[0] }}</span>
        <input class="col" v-model="name" />
        <div class="col-12 divisionLine"></div>
        <div class="col-12 row inputOptions items-center"></div>
        <div class="col-auto">{{ $t("powerQR text")[1] }}</div>
        <input class="col" v-model="age" />
        <div class="col-12 divisionLine"></div>
        <div class="col-12 row inputOptions items-center"></div>
        <span class="col-auto">{{ $t("powerQR text")[2] }}</span>
        <input class="col" v-model="blood_type" />
        <div class="col-12 divisionLine"></div>
        <div class="col-12 row inputOptions items-center"></div>
        <span clas="col=auto">{{ $t("powerQR text")[3] }}</span>
        <input class="col" v-model="medical_history" />
        <div class="col-12 divisionLine"></div>
        <div class="col-12 row inputOptions items-center"></div>
        <span class="col-auto">{{ $t("powerQR text")[4] }}</span>
        <input class="col" v-model="hqts" />
        <div class="col-12 divisionLine"></div>
      </div>
      <div class="col-12 createBtns">
        <button @click="QRCreateBtnClick">{{ $t("powerQR text")[5] }}</button>
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
          <img class="safetyQR" :src="item.imgUrl" id="image" :style="{width:Width+'px',height:Height+'px'}" />
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
      Height: 151
    }
  },
  mounted() {
    this.refreshToken()
  },
  methods: {
    // QR 생성
    QRCreateBtnClick() {
      if (
        this.name === "" ||
        this.age === "" ||
        this.blood_type === "" ||
        this.medical_history === "" ||
        this.hqts === ""
      ) {
        alert(this.$t("notEnterAlert"))
      } else {
        this.isCreateQR = true
        const QrInfo =
          '{"name":"' +
          this.name +
          '","age":"' +
          this.age +
          '","blood_type":"' +
          this.blood_type +
          '","medical_history":"' +
          this.medical_history +
          '","hqts":"' +
          this.hqts +
          '"}'
        console.log(QrInfo)

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
        const qr = QRCode.create(QrInfo, opts)
        console.log("---QR생성----" + qr)
        const imgUrl = QRCode.toDataURL(QrInfo, opts)
        console.log("---QR생성된 URL----" + imgUrl)

        /* prototype promise */
        imgUrl.then(value => {
          const arr = {}
          arr.name = this.name
          arr.imgUrl = value
          this.qrCodeImg.push(arr)
        })
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
      if (changeProperty === "W") {
        this.Width = this.conversion(event.target.value)
        this.Height = this.conversion(this.qrHeight)
      } else {
        this.width = this.conversion(this.qrWidth)
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

.qrCreateContainer
	width: 100%
	min-width: 1260px
	min-height: $contentHeight
	background-color: $contentBackground

.qrCreateContainer>div:not(.titleBar),
.titleBar>span
	width: 1260px

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

.inputOptions>input:not(.fileTypeInput)
	height: 38px
	font-size: 14px
	background-color: white
	border: 1px solid #D9D9D9
	padding: 12px

.createBtns,
.editBtns
	margin-top: 40px

.createBtns>button:nth-child(1)
	color: white
	background-color: #1DBFA4
	padding: 10px 36px

.createBtns>button:nth-child(2),
.editBtns>button:nth-child(2)
	color: white
	background-color: #9F9F9F
	padding: 10px 36px
	margin-left: 8px

.editBtns>button:nth-child(1)
	color: white
	background-color: #008BCF
	padding: 10px 36px

.editBtns>button:nth-child(3)
	color: white
	background-color: #BF1D1D
	padding: 10px 36px
	margin-left: 8px

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
