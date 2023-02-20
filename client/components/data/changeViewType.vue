<template>
  <div class="row justify-center changeViewType">
    <button class="col galleryIcon" @click="viewTypeToggle(1)">
      <img v-show="$route.query.viewType == 'gallery'" src="@/assets/images/bt_layout_gallery_a.png" />
      <img v-show="$route.query.viewType != 'gallery'" src="@/assets/images/bt_layout_gallery.png" />
    </button>
    <button class="col listIcon" @click="viewTypeToggle(2)">
      <img v-show="$route.query.viewType == 'list'" src="@/assets/images/bt_layout_list_a.png" />
      <img v-show="$route.query.viewType != 'list'" src="@/assets/images/bt_layout_list.png" />
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    viewTypeToggleFunc(_page, _viewType) {
      const getKeyword = this.$route.query.keyword
      const getColumn = this.$route.query.column
      const getStatus = this.$route.query.status
      const getSeq = this.$route.query.seq

      const setQuery = {}
      if (getKeyword) setQuery.keyword = getKeyword
      if (getColumn) setQuery.column = getColumn
      if (getStatus) setQuery.status = getStatus
      setQuery.page = _page
      setQuery.viewType = _viewType
      if (getSeq) setQuery.seq = getSeq

      this.$router
        .replace({
          name: this.$route.name,
          query: setQuery
        })
        .catch(error => {
          if (error.name !== "NavigationDuplicated") {
            throw error
          }
        })
    },
    viewTypeToggle(type) {
      switch (type) {
        case 1:
          this.viewTypeToggleFunc(1, "gallery")
          break
        case 2:
          this.viewTypeToggleFunc(1, "list")
          break
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.galleryIcon
	margin-right: 12px

.listIcon
	margin-right: 10px
</style>
