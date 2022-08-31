<template lang="pug">
	.row.justify-center.items-center.account
		.row.justify-center.items-center.accountWin
			img(src="@/assets/images/login_banner.png").accountWinImg.col-6
			.col-6.column.items-center.accountRight
				.col.row.items-center
					.maxWidth(v-if="!isCreateQR")
						.row.justify-center.items-end.title
							span.col-auto ACCOUNT JOIN
							button(v-if="$i18n.locale != 'ko'", @click="switchLocale('ko')").col-auto.localeBtn / 한국어
							button(v-else-if="$i18n.locale != 'en'", @click="switchLocale('en')").col-auto.localeBtn / English
						input(id="accountID", placeholder="ID", v-model="id").input
						button(@click="idCheckBtnClick").signUpBtn ID CHECK
						input(placeholder="Password", v-model="password", type="password").input
						input(placeholder="Password Check", v-model="passwordCheck", type="password").input
						input(placeholder="Name", v-model="name").input
						input(placeholder="E-mail", v-model="EMail").input
						selectComp(:compData="deviceTypeCompData")
						selectComp(:compData="enterpriseCompData")
						selectComp(:compData="hqCompData")
						selectComp(:compData="branchCompData")
						button(@click="signUpBtnClick").signUpBtn {{ !deviceTypeCompData.selectedValue || deviceTypeCompData.selectedValue == 3 ? "SIGN UP" : "Create QR" }}
					.maxWidth.qrcode(v-else)
						transition(name="qrcode", mode="out-in")
							.emptyQrCode(v-if="!qrCodeImg", key="emptyQrCode").row.justify-center
								.col-12.row.justify-center
									.emptyQrCodeBox
								span {{ $t("account")[0] }}
							.loadQrCode(v-else, key="loadQrCode").row.justify-center
								.col-12.row.justify-center
									img(:src="qrCodeImg" id="image")
									//-VueQrcode(:value="value" :width="size")
								span {{ $t("account")[1] }}
				a(href="/").col-auto BACK
</template>

<script>
import QRCode from "qrcode"
import getInfo from "@/assets/scripts/info/getInfo"
import axiosJson from "@/assets/jsons/axios"
import domain from "@/assets/jsons/domain/domain"

export default {
  components: {},
  data() {
    return {
      id: undefined,
      idCheck: undefined,
      password: undefined,
      passwordCheck: undefined,
      name: undefined,
      EMail: undefined,
      deviceTypeCompData: {
        placeholder: "Device Type",
        options: getInfo.deviceTypeObj(),
        selectedText: undefined,
        selectedValue: undefined
      },
      enterpriseCompData: getInfo.enterprise().then(res => {
        getInfo.enterpriseCompData.options = res
        this.enterpriseCompData = getInfo.enterpriseCompData
      }),
      hqCompData: getInfo.hqCompData,
      branchCompData: getInfo.branchCompData,
      isCreateQR: false,
      qrCodeImg: undefined,
      ret: undefined
    }
  },
  methods: {
    switchLocale(locale) {
      sessionStorage.setItem("languageCode", locale)
      location.reload()
    },
    idCheckBtnClick() {
      if (this.id) {
        if (!/^[A-Za-z0-9_\\-]{4,50}$/.test(this.id))
          return alert(this.$t("account")[11])
        // eslint-disable-next-line no-global-assign
        self = this
        this.$axios
          // .post(axiosJson.account.user_id_check, {
          .post(domain.domain.backend1 + axiosJson.account.user_id_check, {
            id: this.id
          })
          .then(function(response) {
            if (response.data) {
              self.idCheck = self.id
              alert(self.$t("account")[3])
            } else {
              self.idCheck = undefined
              alert(self.$t("account")[4])
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      } else {
        document.getElementById("accountID").focus()
        alert(this.$t("account")[5])
      }
    },
    signUpBtnClick() {
      if (this.deviceTypeCompData.selectedValue === 3) {
        // eslint-disable-next-line no-global-assign
        self = this
        if (
          !this.id ||
          !this.password ||
          !this.passwordCheck ||
          !this.name ||
          !this.EMail ||
          !this.enterpriseCompData.selectedValue ||
          !this.hqCompData.selectedValue ||
          !this.branchCompData.selectedValue
        )
          return alert(this.$t("account")[6])

        if (this.id !== this.idCheck) {
          document.getElementById("accountID").focus()
          return alert(this.$t("account")[7])
        }

        if (this.password !== this.passwordCheck)
          return alert(this.$t("account")[8])

        this.$axios
          // .post(axiosJson.account.user_insert, {
          .post(domain.domain.backend1 + axiosJson.account.user_insert, {
            id: this.id,
            password: this.password,
            name: this.name,
            email: this.EMail,
            en_seq: this.enterpriseCompData.selectedValue,
            hq_seq: this.hqCompData.selectedValue,
            br_seq: this.branchCompData.selectedValue,
            device_type: this.deviceTypeCompData.selectedValue
          })
          .then(function(response) {
            if (response.data) {
              alert(self.$t("account")[9])
              window.open("/", "_self")
            } else alert(self.$t("account")[10])
          })
          .catch(function(error) {
            console.log(error)
          })
      } else if (this.deviceTypeCompData.selectedValue === 2) {
        // 디바이스타입이 글라스라면
        if (
          // 빈값이나 선택값이 남아있는 경우 팝업창
          !this.id ||
          !this.password ||
          !this.passwordCheck ||
          !this.name ||
          !this.EMail ||
          !this.enterpriseCompData.selectedValue ||
          !this.hqCompData.selectedValue ||
          !this.branchCompData.selectedValue
        )
          return alert(this.$t("account")[6])

        if (this.id !== this.idCheck) {
          document.getElementById("accountID").focus()
          return alert(this.$t("account")[7])
        }

        if (this.password !== this.passwordCheck)
          return alert(this.$t("account")[8])
        // Qr생성 true
        this.isCreateQR = true

        const enSelect = document.querySelectorAll("select")[1]
        const hqSelect = document.querySelectorAll("select")[2]
        const brSelect = document.querySelectorAll("select")[3]

        const QrInfo =
          '{"id":"' +
          this.id +
          '","name":"' +
          this.name +
          '","email":"' +
          this.EMail +
          '","password":"' +
          this.password +
          '","enSeq":"' +
          this.enterpriseCompData.selectedValue +
          '","enAlias":"' +
          enSelect[enSelect.selectedIndex].text +
          '","hqSeq":"' +
          this.hqCompData.selectedValue +
          '","hqAlias":"' +
          hqSelect[hqSelect.selectedIndex].text +
          '","brSeq":"' +
          this.branchCompData.selectedValue +
          '","brAlias":"' +
          brSelect[brSelect.selectedIndex].text +
          '"}'
        console.log(QrInfo)

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
        console.log(qr)
        const imgUrl = QRCode.toDataURL(QrInfo, opts)
        console.log(imgUrl)
        // prototype promise
        imgUrl.then(value => {
          this.qrCodeImg = value
          console.log(value)
        })
        /* const getQrcode =
					"https://chart.googleapis.com/chart?cht=qr&chl=" +
					'{"id":"' +
					this.id +
					'","name":"' +
					this.name +
					'","email":"' +
					this.EMail +
					'","password":"' +
					this.password +
					'","enSeq":"' +
					this.enterpriseCompData.selectedValue +
					'","enAlias":"' +
					enSelect[enSelect.selectedIndex].text +
					'","hqSeq":"' +
					this.hqCompData.selectedValue +
					'","hqAlias":"' +
					hqSelect[hqSelect.selectedIndex].text +
					'","brSeq":"' +
					this.branchCompData.selectedValue +
					'","brAlias":"' +
					brSelect[brSelect.selectedIndex].text +
					'"}' +
					"&chs=320x320&chld=L|0"

				this.$axios.$get(getQrcode).then(res => {
					this.qrCodeImg = getQrcode
				}) */
      } else alert(this.$t("account")[2])
    }
  },
  mounted() {
    getInfo.setLang(this.$t("getInfo"))
  }
}
</script>

<style lang="sass" scoped>
.account
	width: 100%
	min-width: $contentMaxWidth
	height: 100%
	background: #EFF0F1

.accountWin
	width: 1170px
	height: 900px

.accountWinImg
	height: 100%
	object-fit: cover

.accountRight
	height: 100%
	background: white

	>a
		color: #26439A
		font-weight: 800
		margin-bottom: 30px

.maxWidth
	width: 455px

	.title
		width: 100%
		margin-bottom: 15px

		>span
			font-size: 20px
			text-align: center

		>button
			margin-left: 10px

	input[type=password]
		font-family: auto

	>.input,
	>select
		width: 100%
		padding: 16px
		border: 1px solid #D9D9D9
		font-size: 15px
		font-weight: bold
		margin-top: 10px

	>.signUpBtn
		width: 100%
		padding: 16px
		margin-top: 8px
		background: #26439A
		color: white

.qrcode
	>.emptyQrCode,
	>.loadQrCode
		width: 100%

		>span
			margin-top: 20px

.emptyQrCodeBox
	width: 320px
	height: 320px
	background-color: #efefef

.qrcode-enter-active, .qrcode-leave-active
	transition: opacity .5s

.qrcode-enter, .qrcode-leave-to
	opacity: 0

@media screen and (max-width: 500px)
	.account
		min-width: unset

	.accountWin
		width: inherit

	.accountRight
		width: inherit
		padding: 30px

		.maxWidth
			width: inherit

	.accountWinImg
		display: none

	.accountRight>a
		margin-bottom: unset
</style>
