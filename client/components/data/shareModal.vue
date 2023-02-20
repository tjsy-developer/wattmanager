<template>
	<div class="row shareModal">
		<div class="col-12 row justify-between">
			<div class="col-auto">
				<span class="shareText">{{ $t("listComp")[7] }}</span>
			</div>
			<div class="col-auto">
				<button class="closeBtn" @click="closeBtnClick">
					<img class="closeImg" src="@/assets/images/list_icon_filter_x.png" />
				</button>
			</div>
		</div>
		<div class="col-12 shareBtns">
			<button class="row shareBtn" @click="eMailShareBtnClick">
				<div class="col-12 row justify-center items-center shareBtnImg">
					<span>e-mail</span>
				</div>
				<span class="col-12 shareBtnText">{{ $t("shareModalComp")[0] }}</span>
			</button>
		</div>
		<div class="col-12 row shareCopy">
			<input class="col" id="shareCopyInput" readonly, :value="url" />
			<button class="col-auto" @click="shareCopyBtnClick">{{ $t("shareModalComp")[1] }}</button>
		</div>
	</div>
</template>

<script>
export default {
  props: ["url"],
  data() {
    return {}
  },
  methods: {
    eMailShareBtnClick() {
      open(
        "mailto:?body=" +
          document.getElementById("shareCopyInput").value.replace(/&/gi, "%26")
      )
    },
    shareCopyBtnClick() {
      const copyText = document.getElementById("shareCopyInput")
      copyText.select()
      document.execCommand("Copy")
      copyText.setSelectionRange(0, 0)
      alert(this.$t("shareModalComp")[2])
    },
    closeBtnClick() {
      this.$modal.hide("shareModal")
    }
  }
}
</script>

<style lang="sass" scoped>
.shareModal
	width: 100%
	height: 100%
	background: white
	padding: 30px

.shareText
	font-size: 16px

.closeBtn
	padding: 10px

.closeImg
	width: 100%

.shareBtns
	margin-top: 20px

.shareBtn
	width: 60px
	margin: 8px

.shareBtnImg
	width: 60px
	height: 60px
	color: white
	background-color: gray
	border-radius: 50%

.shareBtnText
	margin-top: 8px

.shareCopy
	border: 1px solid #ededed
	border-radius: 2px
	background-color: #fafafa
	margin-top: 20px

	>input
		padding: 10px

	>button
		color: #065fd4
		padding: 10px 20px
</style>
