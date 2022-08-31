<template lang="pug">
	.row.justify-center.infiniteScroll
		.col-auto.row.justify-center
			.col-12(style="height:1px")
			infinite-loading(v-if="compData.listData.length" spinner="spiral" @infinite="infiniteScroll")
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
  props: ["compData"],
  computed: {
    url() {
      // ksy변경부분
      return domain.domain.backend1 + this.compData.getListDataUrl
    }
  },
  methods: {
    async fetchData() {
      const response = await this.$axios.post(
        this.url,
        this.compData.getListDataParams
      )
      this.compData.setListData(response.data)
    },
    infiniteScroll(state) {
      setTimeout(() => {
        this.$axios
          .post(this.url, this.compData.getListDataParams)
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
		width: $contentMaxWidth
</style>
