<template lang="pug">
  .row.justify-center.infiniteScrollp
    .col-auto.row.justify-center
      .col-12(style="height:1px")
      infinite-loading(ref="infiniteLoading", v-if="compData.rightList.length" spinner="spiral" @infinite="infiniteScroll")
        template(slot="no-more") &nbsp
        template(slot="no-results") &nbsp
</template>

<script>
import InfiniteLoading from "vue-infinite-loading"
import domain from "@/assets/jsons/domain/domain"

export default {
  components: {
    InfiniteLoading
  },
  props: ["compData", "resetPage"],
  data() {
    return {
      page: 0,
      initFlag: false
    }
  },
  computed: {
    url() {
      return domain.domain.backend1 + this.compData.getRightListDataUrl
    }
  },
  methods: {
    async fetchData() {
      this.page++
      this.compData.getRightListDataParams.page = this.page
      this.compData.getRightListDataParams.jwt = localStorage.getItem("jwt")
      console.log("fetchData Params url: ", this.url)
      console.log(
        "fetchData Params getRightListDataParams: ",
        this.compData.getRightListDataParams
      )
      console.log("request" + this.compData.getRightListDataParams.page)
      const response = await this.$axios.post(
        this.url,
        this.compData.getRightListDataParams
      )
      console.log("fetchData", response.data)
      this.compData.setRightListData(response.data)
    },
    infiniteScroll(state) {
      console.log("initScroll")
      console.log("request before" + this.compData.getRightListDataParams.page)
      // 필터 클릭 시 초기화 한다
      // eslint-disable-next-line eqeqeq
      if (this.compData.getRightListDataParams.page == 999) {
        this.page = 0
      }
      console.log("page init", this.page)
      this.compData.getRightListDataParams.jwt = localStorage.getItem("jwt")
      this.page++
      this.compData.getRightListDataParams.page = this.page
      console.log("request after" + this.compData.getRightListDataParams.page)
      console.log("state", state)
      console.log("page", this.compData.getRightListDataParams.page)
      setTimeout(() => {
        if (this.compData.getRightListDataParams.jwt === undefined) {
          this.compData.getRightListDataParams.jwt = localStorage.getItem("jwt")
        }
        // console.log("this.url", this.url)
        // console.log("getRightList", this.compData.getRightListDataParams)
        this.$axios
          .post(this.url, this.compData.getRightListDataParams)
          .then(response => {
            if (response.data.length) {
              this.compData.setRightListData(response.data)
              state.loaded()
            } else if (state.complete) state.complete()
            this.compData.canReset = true
          })
          .catch(err => {
            console.log(err)
          })
      }, 1000)
    }
  },
  created() {
    const self = this
    setTimeout(function() {
      self.fetchData()
    }, 500)
  },
  mounted() {
    console.log("rightbar scroll mounted")
  },
  watch: {
    "compData.isFilterBtnClick"(newVal, oldVal) {
      const getRightListDataParams = this.compData.getRightListDataParams
      if (
        getRightListDataParams.category.length ||
        getRightListDataParams.joined_members.length ||
        getRightListDataParams.title.length ||
        getRightListDataParams.save_time.length
      )
        this.infiniteScroll({ loaded() {} })
      else this.compData.canReset = true
    }
  }
}
</script>

<style lang="sass" scoped>
.infiniteScroll
  width: 100%
  height: auto

  >div
    width: $contentMaxWidth
</style>
