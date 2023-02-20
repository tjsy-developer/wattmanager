<template>
  <div class="row content-center forgotPasswordModal">
    <step1 v-if="!compData.canNextStep" class="col-12" :compData="compData"></step1>
    <step2 v-else class="col-12" :compData="compData"></step2>
  </div>
</template>

<script>
import step1 from "@/components/forgotPasswordModal/step1"
import step2 from "@/components/forgotPasswordModal/step2"

export default {
  components: {
    step1,
    step2
  },
  data() {
    return {
      compData: {
        canNextStep: false,
        inputId: undefined,
        id: undefined
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.forgotPasswordModal
	width: 100%
	height: 100%
  
</style>
