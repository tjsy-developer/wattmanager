<template>
  <powerQr v-if="state == 'power'"></powerQr>
  <safetyQr v-else-if="state == 'safety'"></safetyQr>
</template>

<script>
// import QRCode from "qrcode"
import powerQr from "@/components/qr/powerQr"
import safetyQr from "@/components/qr/safetyQr"

export default {
  layout: "main",
  data() {
    return {
      state: process.env.qr
    }
  },
  components: {
    powerQr,
    safetyQr
  }
}
</script>
