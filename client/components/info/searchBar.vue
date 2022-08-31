<template lang="pug">
	.col-12.row.justify-center.search
		.col-auto.row.items-center
			.col-auto.searchText {{ $t("searchBarComp")[4] }}
			input(id="searchInput", @keyup.enter="searchBtnClick" v-model="inputVal").col.searchInput
			img(v-if="inputVal!=undefined" src="@/assets/images/bt_input_delete.png" @click="deleteBtn" :alt="$t('searchBarComp')[7]").searchDeleteBtn
			button(@click="searchBtnClick").col-auto.searchBtn {{ $t("searchBarComp")[4] }}
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // eslint-disable-next-line prettier/prettier
      inputVal: ''
    }
  },
  methods: {
    searchBtnClick() {
      const infoSearchInputValue = document.getElementById("searchInput").value

      if (infoSearchInputValue)
        window.open(
          "./" +
            this.$route.name +
            "?keyword=" +
            infoSearchInputValue +
            "&page=1",
          "_self"
        )
      else alert(this.$t("searchBarComp")[5])
    },
    deleteBtn() {
      window.open("./" + this.$route.name + "?page=1", "_self")
    }
  },
  mounted() {
    this.inputVal = this.$route.query.keyword
  }
}
</script>

<style lang="sass" scoped>
.search
	padding: 25px 0
	background: transparent linear-gradient(180deg, #0061D1 0%, #23A3DC 100%) 0% 0% no-repeat padding-box

.search>div
	width: $contentMaxWidth

.searchText
	font-size: 18px
	font-weight: bold
	color: white

.searchInput
	padding: 10px
	background: white
	height: 38px
	margin-left: 25px
	border-radius: 2px

.searchDeleteBtn
	position: absolute
	right: 125px
	cursor: pointer

	&:hover
		border-radius: 5px
		border: 1px solid grey

.searchBtn
	width: 98px !important
	height: 38px
	font-size: 14px
	font-weight: bold
	color: white
	background: #1DBFA4 0% 0% no-repeat padding-box
	margin-left: 16px
	border-radius: 2px

@media (min-width: 0)
	width: none !important
</style>
