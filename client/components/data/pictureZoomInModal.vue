<template>
	<div class="column pictureZoomIn items-center">
		<img class="col" :src="imgSrc" />
		<div class="topMenu row items-center">
			<button @click="fullscreenBtnClick">
				<img src="@/assets/images/player_icon_fullscreen.png" />
			</button>
			<button @click="cancelBtnClick">
				<img src="@/assets/images/player_icon_cancel.png" />
			</button>
		</div>
		<div class="title">
			<span>{{title}}</span>
		</div>
		<div id="maximize" v-show="isMaximize">
			<img :src="imgSrc" />
			<div class="row justify-between items-start">
				<span class="col">{{title}}</span>
				<button class="col-auto" @click="cancelBtnClick">
					<img src="@/assets/images/player_icon_cancel.png" />
				</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  props: ["title", "imgSrc"],
  data() {
    return {
      isMaximize: false
    }
  },
  methods: {
    fullscreenBtnClick(e) {
      this.isMaximize = true

      const maximize = document.getElementById("maximize").style
      maximize.width = window.innerWidth + "px"
      maximize.height = window.innerHeight + "px"
      maximize.top =
        -(
          window.innerHeight -
          e.target.parentNode.parentNode.parentNode.clientHeight
        ) /
          2 +
        "px"
    },
    cancelBtnClick() {
      this.$modal.hide("pictureZoomInModal")
    }
  }
}
</script>

<style lang="sass" scoped>
.pictureZoomIn
	width: 100%
	height: 100%
	background: white

	>.title
		position: absolute
		width: 100%
		background: transparent linear-gradient(0deg, #00000000 0%, #000000CC 100%) 0% 0% no-repeat padding-box;

		>span
			color: white
			font-size: 11px
			padding: 20px 27px

	>img
		width: 100%
		height: 100%

.topMenu
	position: absolute
	top: -30px
	right: 0

	>button
		&:last-child
			width: 14px
			margin-left: 12px
			>img
				width: 100%
				height: 100%

#maximize
	position: absolute
	background: white

	>img
		width: 100%
		height: 100%
		object-fit: contain

	>div
		position: absolute
		width: 100%
		padding: 25px 15px 25px 35px
		background: transparent linear-gradient(0deg, #00000000 0%, #000000CC 100%) 0% 0% no-repeat padding-box;

		>span
			font-size: 16px
			padding-right: 15px
			color: white

		>button
			>img
				width: 14px
</style>
