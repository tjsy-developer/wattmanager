<template>
	<div class="row content-start form">
		<div class="col-12 row justify-center">
			<span v-if="compData.title != false" class="formTitle">{{ compData.title }}</span>
			<infoSearchBar v-if="compData.search != false" class="col-12"></infoSearchBar>
			<div class="col-12 row justify-center">
				<div class="row justify-between createDiv">
					<span v-if="compData.listTitle != false" class="col-auto createTitle">{{ compData.listTitle }}</span>
					<a v-if="compData.canCreate" class="col-auto createBtn" :href="$route.name + '/create'">{{ $t("createAndEditComp")[0] }}</a>
				</div>
			</div>
			<infoList class="col-8" :compData="compData"></infoList>
		</div>
		<pagination class="col-12" :compData="compData"></pagination>
	</div>
</template>

<script>
export default {
  layout: "main",
  props: ["compData"]
}
</script>

<style lang="sass" scoped>
.form
	width: 100%
	min-height: $contentHeight
	background: $contentBackground

	>div>div:nth-child(3)
		margin-top: 35px

.formTitle
	width: $contentMaxWidth
	font-size: 24px
	font-weight: 800
	padding: 29px 0 20px

.createDiv
	width: $contentMaxWidth

	>.createTitle
		height: 41px
		font-size: 22px
		font-weight: 800

	>.createBtn
		color: white
		padding: 10px 35px
		background: #1DBFA4 0% 0% no-repeat padding-box
		border-radius: 2px
</style>
