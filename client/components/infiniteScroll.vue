<template>
  <div class="row justify-center infiniteScroll">
    <div class="col-auto row justify-center">
      <div class="col-12" style="height:1px">
        <infinite-loading v-if="compData.listData.length" spinner="spiral" @infinite="infiniteScroll">
          <template slot="no-more">&nbsp</template>
          <template slot="no-results">&nbsp</template>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading"
import { axiosRequest } from "@/plugins/axiosRequest"

export default {
  components: {
    InfiniteLoading
  },
  props: ["compData"],
  computed: {
    url() {
      // ksy변경부분
      return process.env.backendURL + this.compData.getListDataUrl
    }
  },
  methods: {
    async fetchData() {
      const params = {
        data: this.compData.getListDataParams,
        api: this.url
      }
      const response = await axiosRequest('post', params)
      this.compData.setListData(response.data)
    },
    infiniteScroll(state) {
      setTimeout(() => {
        const params = {
          data: thithis.urls.compData.getListDataParams,
          api: this.url
        }
        axiosRequest('post', params)
          .then(response => {
            if (response.data.length) {
              this.compData.setListData(response.data)
              state.loaded()
            } else {
              state.complete()
            }
          })
          .catch(err => {
            console.log(err)
          })
      }, 500)
      this.compData.getListDataParams.page++
    }
  },
  created() {
    this.fetchData()
    this.compData.getListDataParams.page++
  }
}
</script>

<style lang="sass" scoped>
.infiniteScroll
	width: 100%
	height: auto

	>div
		width: 1260px
</style>
