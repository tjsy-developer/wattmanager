<template>
	<div class="row justify-center mainFooter">
		<div class="row maxWidth">
			<div class="col-12 divisionLine"></div>
			<span class="col-12 text">
				{{ $t("footer")[0] }} I {{ $t("footer")[1] }} I {{ $t("footer")[2] }}<br>{{ $t("footer")[3] }}<br><br>Copyright © 2020 WATT CO.LTD. All Rights Reserved.
			</span>
		</div>
	</div>
</template>
<script>
export default {}
</script>

<style lang="sass" scoped>
.mainFooter
	width: 100%
	background: $contentBackground

.maxWidth
	width: $contentMaxWidth

.divisionLine
	height: 1px !important
	border: 1px solid #D9D9D9
	margin-top: 42px

.text
	font-size: 10px
	text-align: center
	color: #BBBBBB
	margin: 20px 0 20px
</style>
