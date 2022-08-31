<template lang="pug">
	.row.content-start.form
		.col-12.row.justify-center
			span.formTitle(v-if="compData.title != false") {{ compData.title }}
			infoSearchBar(v-if="compData.search != false").col-12
			.col-12.row.justify-center
				.row.justify-between.createDiv
					span.col-auto.createTitle(v-if="compData.listTitle != false") {{ compData.listTitle }}
					a(v-if="compData.canCreate", :href="$route.name + '/create'").col-auto.createBtn {{ $t("createAndEditComp")[0] }}
			infoList(:compData="compData").col-8
		pagination(:compData="compData").col-12
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
