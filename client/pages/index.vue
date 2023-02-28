<template>
  <div class="root">
    <loginForm @child="moveChangedDomain()"></loginForm>
    <inspectionAlertModal v-if="test" class="alert-modal" :propsData="modalParameter" name="inspectionAlertModal" :clickToClose="false" @closeCheck="closeCheck"></inspectionAlertModal>
  </div>
</template>
<script>
import axiosJson from "@/assets/jsons/axios"
import loginForm from "@/components/mainIndex/form"
import transModal from "@/components/info/transModal"
import inspectionAlertModal from "@/components/mainIndex/inspectionAlertModal"
import domain from "@/assets/jsons/domain/domain"
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
    showInspectionAlert() {
      console.log("###################################################")
      let inspectionList = []
      this.$axios
        .post(domain.domain.backend1 + axiosJson.overhaul.overhaul_list, {})
        .then((res) => {
          if(res.data.length == 0) {
            return
          }
          // console.log(res)
          // console.log(res, "!!!!!!!!!!!!!!!!!!")
          inspectionList[0] = res.data[0]
          if (inspectionList[0].overhaul_flag == 1) {
            this.modalParameter = {
                inspectionDate: inspectionList[0].overhaul_date,
                inspectionPhoneNum: inspectionList[0].overhaul_phone,
                overhaulNumber: inspectionList[0].overhaul_number
            }
            const checkOverhaulNum = cookieSetting.getCookie("overhaulNum")
            const checkCloseForDay = cookieSetting.getCookie("closeForDay")
            // cookie에 저장된 overhaul_number와 가져온 overhaul_number가 동일한 경우
            if (checkOverhaulNum == inspectionList[0].overhaul_number) {
              if (checkCloseForDay == "ture") {
                console.log("오늘하루열지않기")
								this.test = false
              } else {
                // cookie에 저장된 overhaul_number와 가져온 overhaul_number가 동일하지만
                // 오늘하루 열지않기를 누르지 않은 경우
								this.test = true
              }
            } else {
              // cookie에 저장된 overhaul_number와 가져온 overhaul_number가 다른경우
								this.test = true
                cookieSetting.delCookie("overhaulNum")
                cookieSetting.delCookie("closeForDay")
            }
          } else {
            // overhaul_flag 값이 1이 아닌 경우
						this.test = false
          }   
        })
    },
		closeCheck(closeClick) {
      console.log(closeClick, "!!!!!!!!!!!!!")
      if (closeClick == "true") {
        this.test = false
      }
      console.log(this.test, "@@@@@@@@@@@@@@@@@@")
      return this.test
    }
  },
  mounted() {
    this.domainCheck()
		this.$nextTick(
    	this.showInspectionAlert()
		) 
  },
  components: {
    loginForm,
    transModal,
		inspectionAlertModal
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
