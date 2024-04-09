<template>
  <div class="row justify-center items-center index">
  </div>
</template>

<script>
export default {
    mounted() {
        const logInId = sessionStorage.getItem("id")
        sessionStorage.clear()
        sessionStorage.setItem("languageCode", "ko")
        sessionStorage.setItem("logoutId", logInId + "jwt")
        if (process.env.useEnterprise == "dlenc") {
          sessionStorage.setItem("managerLogOut", true)
        }
        location.href = "/"
    }
}
</script>

<style lang="sass" scoped>
.row.justify-center.items-center.index
.index
  width: 100%
  // min-width: 1260px
  height: 100%
  background-image: radial-gradient(closest-side at 50% 50%, #2A2A2AF2 0%, #000000E8 100%), url("../../assets/images/login_background.png")
  background-repeat: no-repeat
  background-size: cover
  background-position: center
  @media screen and (min-width: 1023px)
    overflow-y: auto
</style>