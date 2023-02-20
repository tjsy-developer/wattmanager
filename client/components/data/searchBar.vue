<template>
	<div class="row justify-center searchBar">
		<div class="row justify-between items-center maxWidth">
			<span class="col-auto title"> {{ $t("searchBarComp")[0] }}</span>
			<div class="col-auto row">
				<a
					v-if="attViewAuth == false && deviceType != '2'"
					class="col-auto tab"
					:href="'/attachment/video?page=1&viewType=' + $route.query.viewType"
					:style="{ background:$route.name == 'attachment-video' ? '#0061D1' : '#BFCCD6' }"
					@click="clearLocalStorage"
				>
					{{ $t("searchBarComp")[1] }}
				</a>
				<a
					v-if="attViewAuth == false && deviceType != '2'"
					class="col-auto tab"
					:href="'/attachment/picture?page=1&viewType=' + $route.query.viewType"
					:style="{ background:$route.name == 'attachment-picture' ? '#0061D1' : '#BFCCD6' }"
					@click="clearLocalStorage"
				>
					{{ $t("searchBarComp")[2] }}
				</a>
				<a
					v-if="attViewAuth == false && deviceType != '2'"
					class="col-auto tab"
					:href="'/attachment/favorite?page=1&viewType=' + $route.query.viewType"
					:style="{ background:$route.name == 'attachment-favorite' ? '#0061D1' : '#BFCCD6' }"
					@click="clearLocalStorage"
				>
					{{ $t("searchBarComp")[3] }}
				</a>
				<a
					class="col-auto tab"
					:href="'/attachment/memo?page=1&viewType=' + $route.query.viewType"
					:style="{ background:$route.name == 'attachment-memo' ? '#0061D1' : '#BFCCD6' }"
					@click="clearLocalStorage"
				>
					{{ $t("memo")[1] }}
				</a>
			</div>
			<div class="col-12 row items-center search">
				<div class="col-auto searchText">{{ $t("searchBarComp")[4] }}</div>
				<input class="col searchInput" id="searchInput" @keyup.enter="searchBtnClick" v-model="inputVal" />
				<img v-if="inputVal!=''" class="searchDeleteBtn" src="@/assets/images/bt_input_delete.png" @click="deleteBtn" />
				<button class="col-auto searchBtn" @click="searchBtnClick">{{ $t("searchBarComp")[4] }}</button>
			</div>
		</div>
	</div>
</template>

<script>
import domain from "@/assets/jsons/domain/domain"

export default {
  data() {
    return {
      deviceType: undefined,
      inputVal: "",
      auth: 0,
      // eslint-disable-next-line eqeqeq
      attViewAuth: false
      // eslint-disable-next-line eqeqeq
    }
  },
  methods: {
    searchBtnClick() {
      const infoSearchInputValue = document.getElementById("searchInput").value

      if (infoSearchInputValue)
        window.open(
          this.$route.path +
            "?keyword=" +
            infoSearchInputValue +
            "&page=1" +
            "&viewType=" +
            this.$route.query.viewType,
          "_self"
        )
      else alert(this.$t("searchBarComp")[5])
    },
    clearLocalStorage() {
      localStorage.removeItem("selectedFilters")
      localStorage.removeItem("selectedFiltersOptions")
    },
    deleteBtn() {
      window.open(
        this.$route.path + "?page=1&viewType=" + this.$route.query.viewType,
        "_self"
      )
    }
  },
  mounted() {
    this.deviceType = localStorage.getItem("deviceType")
    this.auth = localStorage.getItem("auth")

    // att_access_user = false 일 경우 일반 사용자 tab권한 없음 --> 삼성엔지니어링 요구사항
    // att_access_user = true 일 경우 기존 권한 조건
    // eslint-disable-next-line eqeqeq
    if (domain.att_access_user === false && this.auth == 0) {
      // 일반사용자만 tab 권한 없음
      this.attViewAuth = true
    } else {
      // 1. att_access_user 이 true 이거나
      // 2. att_access_user 이 false 일경우 auth > 0 이라면 tab 권한 있음
      this.attViewAuth = false
    }
    console.log(this.attViewAuth)
  }
}
</script>

<style lang="sass" scoped>
.searchBar
	width: 100%
	padding-top: 33px
	background-color: $contentBackground

.maxWidth
	width: $contentMaxWidth

.title
	font-size: 20px
	font-weight: 800
	margin-left: 10px

.tab
	padding: 13px 40px 9px 40px
	color: white
	border-radius: 10px 10px 0px 0px
	margin-top: 3px
	margin-right: 2px

	&:last-child
		margin-right: 13px

.search
	height: 88px !important
	background: transparent linear-gradient(180deg, #0061D1 0%, #23A3DC 100%) 0% 0% no-repeat padding-box !important
	border-radius: 4px

.searchText
	font-size: 18px
	font-weight: bold
	color: white
	margin: 0 20px 0 33px

.searchInput
	padding: 10px
	background: white
	height: 38px
	border-radius: 2px
	outline: none
	font-size: 15px
	font-weight: 600

.searchDeleteBtn
	position: absolute
	right: 140px
	cursor: pointer

	&:hover
		border-radius: 5px
		border: 1px solid grey

.searchBtn
	width: 80px !important
	height: 38px
	font-size: 14px
	font-weight: bold
	color: white
	background: #1DBFA4 0% 0% no-repeat padding-box
	margin: 0 33px 0 17px
	border-radius: 2px

@media (min-width: 0)
	width: none
</style>
