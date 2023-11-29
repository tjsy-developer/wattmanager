<template>
  <div class="row justify-center pagination">
    <VueAdsPagination
      v-if="compData.listData.length != 0"
      :page="compData.getListDataParams.page-1"
      :itemsPerPage="itemsPerPage"
      :maxVisiblePages="10"
      :totalItems="totalItems"
      @page-change="pageChange"
    ></VueAdsPagination>
  </div>
</template>

<script>
import VueAdsPagination from "vue-ads-pagination"
// import VueCookie from "vue-cookie"

export default {
  components: {
    VueAdsPagination
  },
  props: ["compData"],
  data() {
    return {
      itemsPerPage: 10,
      totalItems: 0,
      getVideoRateInterval: "",
      getVideo: ""
    }
  },
  methods: {
    pageChange(page, range) {
      const getKeyword = this.$route.query.keyword
      const getColumn = this.$route.query.column
      const getStatus = this.$route.query.status
      const getViewType = this.$route.query.viewType

      let path = this.$route.path
      if (getKeyword) {
        path += "?keyword=" + getKeyword
        if (getColumn) path += "&column=" + getColumn + "&status=" + getStatus
        path += "&page=" + (page + 1)
      } else if (getColumn)
        path +=
          "?column=" +
          getColumn +
          "&status=" +
          getStatus +
          "&page=" +
          (page + 1)
      else path += "?page=" + (page + 1)

      if (getViewType) path += "&viewType=" + getViewType

      window.open(path, "_self")
    },
    getListCount() {
      this.compData.getListDataParams.jwt = sessionStorage.getItem("jwt")

      return this.$axios
        .post(
          process.env.backendURL + this.compData.getListCountUrl,
          this.compData.getListDataParams
        )
        .then(response => {
          console.log(response)
          if (response.data) this.totalItems = response.data
        })
        .catch(err => {
          console.log("pagination.vue getListCount error : ", err)
        })
    },
    getListData() {
      this.compData.getListDataParams.jwt = sessionStorage.getItem("jwt")
      return this.$axios
        .post(
          process.env.backendURL + this.compData.getListDataUrl,
          this.compData.getListDataParams
        )
        .then(response => {
          console.log(response)
          if (response.data.length) {
            this.compData.setListData(response.data)
            return true
          } else return false
        })
        .catch(err => {
          console.log("pagination.vue getListData error : ", err)
        })
    },
    getListFunction() {
      this.getListCount().then(() => {
        this.getListData().then(res => {
          if (!res) {
            const getPage = this.$route.query.page
            if (getPage && getPage !== "1") history.back()
          }
        })
      })
    }
  },
  created() {
    if (
      this.$route.name === "attachment-video" ||
      this.$route.name === "attachment-picture" ||
      this.$route.name === "attachment-memo"
    )
      this.itemsPerPage = 12
  },
  mounted() {
    const self = this

    // 비디오 영상관리 일 경우 interval 5초, 파일 송신율을 실시간으로 반영한다.
    if (this.compData.getListDataUrl === "attRest/att_video_list") {
      self.getListFunction()
      // const getVideo = setInterval(function() {
      //   self.getListFunction()
      // }, 2000)
      // // clearInterval(getVideo)
      // setTimeout(function() {
      //   clearInterval(getVideo)
      // }, 2500)
      this.getVideoRateInterval = setInterval(function() {
        self.getListFunction()
      }, 30000)
    } else {
      self.getListFunction()
    }
  }
}
</script>

<style lang="sass" scoped>
.pagination
	width: 100%
	height: auto
	margin-top: 30px
</style>
