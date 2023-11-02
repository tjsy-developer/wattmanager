<template>
  <div class="root">
    <loginForm @child="moveChangedDomain()"></loginForm>
  </div>
</template>
<script>
import axiosJson from "@/assets/jsons/axios"
import loginForm from "@/components/mainIndex/form"
import transModal from "@/components/info/transModal"

import cookieSetting from "@/assets/scripts/data/cookie"
export default {
  data() {
    return {
      changedDomain: "",
			modalParameter: {},
			test: false,
      checked: ""
    }
  },
  methods: {
    showModal() {
      const modalsContainerStyle = document.getElementById("modalsContainer")
        .style
        modalsContainerStyle.display = "block"

      this.$modal.show(
        transModal,
        { changedDomain: this.changeDomain },
        {
          name: "transModal",
          clickToClose: false,
          width: innerWidth <= 618 ? "90%" : 618,
          height: innerHeight <= 550 ? "90%" : 550,
          pivotX: 0.5,
          pivotY: 0.5
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none"
          }
        }
      )
    },
    domainCheck() {
      const href = window.location.href
      const res = href.indexOf("powertalk")
      if (res !== -1) {
        this.showModal()
      }
    },
    changeDomain(adress) {
      if (adress !== undefined) {
        this.changedDomain = adress
      }
    },
    moveChangedDomain() {
      alert(this.$t("moveToChangedDomain"))
      setTimeout(() => {
        location.href = this.changedDomain
      }, 500)
    },
  },
  mounted() {
    this.domainCheck()
  },
  components: {
    loginForm,
    transModal
  }
}
</script>
<style lang="sass">
.root
	width: 100%
	height: 100%
.alert-modal
	width: 530px
	height: 550px
</style>
