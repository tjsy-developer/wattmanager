<template>
  <video id="videoPlayer" autoplay controls></video>
</template>
<script>
import { MediaPlayer } from "dashjs"
export default {
  mounted() {
    if (window !== undefined) {
      const url =
        "https://powertalktwo.powertalk.kr/Storage/powertalk/powertalktwo/Dashs/Src2/2021_0727_182456_watt12/stream.mpd"
      const player = MediaPlayer().create()
      console.log(url)
      player.initialize(document.querySelector("#videoPlayer"), url, true)
      player.play()
    }
  }
}
</script>
