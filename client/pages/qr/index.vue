<template lang="pug">
		powerQr(v-if="state == 'power'")
		safetyQr(v-else-if="state == 'safety'")
</template>

<script>
// import QRCode from "qrcode"
import powerQr from "@/components/qr/powerQr"
import safetyQr from "@/components/qr/safetyQr"
import domain from "@/assets/jsons/domain/domain"
export default {
  layout: "main",
  data() {
    return {
      state: domain.qr
    }
  },
  components: {
    powerQr,
    safetyQr
  }
}
</script>
