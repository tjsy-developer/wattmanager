<template>
	<div class="col-12 row justify-center search">
		<div class="col-auto row items-center">
			<div class="col-auto searchText">{{ $t("searchBarComp")[4] }}</div>
			<input class="col searchInput" id="searchInput" @keyup.enter="searchBtnClick" v-model="inputVal" />
			<img v-if="inputVal!=undefined" class="searchDeleteBtn" src="@/assets/images/bt_input_delete.png" @click="deleteBtn" :alt="$t('searchBarComp')[7]" />
			<button class="col-auto searchBtn" @click="searchBtnClick">{{ $t("searchBarComp")[4] }}</button>
		</div>
	</div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // eslint-disable-next-line prettier/prettier
      inputVal: '',
	  mutationState: ""
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
      else this.deleteBtn()
    },
    deleteBtn() {
      window.open("./" + this.$route.name + "?page=1", "_self")
    }
  },
  mounted() {
    this.inputVal = this.$route.query.keyword
	if (sessionStorage.getItem("mutationState")) {
      this.mutationState = sessionStorage.getItem("mutationState")
    } else {
      this.mutationState = false
    }
  },
  computed: {
    getMutationState() {
      return this.mutationState
    }
  },
  watch: {
    getMutationState(res) {
      if (res == "true") {
        sessionStorage.removeItem("mutationState")
        location.reload()
      }
    }
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
	outline: none
	font-size: 15px
	font-weight: 600

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
