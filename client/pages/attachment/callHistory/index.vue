<template>
	<div class="row content-start data">
		<dataSearchBar></dataSearchBar>
		<dataList></dataList>
	</div>
</template>

<script>
export default {
    layout: "main",
	mounted() {
		this.refreshToken()
	}
}
</script>