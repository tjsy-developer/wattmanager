<template>
  <!-- video(muted controls)#video -->
</template>

<script>
// import axiosJson from "@/assets/jsons/axios"

/*
export default {
  data() {
    return {
      videoBlob: []
    }
  },
  methods: {
    fetchAB(url, cb) {
      console.log(url)
      const xhr = new XMLHttpRequest()
      xhr.open("get", url)
      xhr.responseType = "arraybuffer"
      xhr.onload = function() {
        console.log("%%%%")
        console.log(xhr.response)
        cb(xhr.response)
      }
      xhr.send()
    }
  },
  mounted() {
    console.log("@@")

    const self = this
    const video = document.querySelector("video")
    const mimeCodec =
      'video/mp4; codecs="avc1.42e01e, mp4a.40.2"; profiles="isom,iso2,avc1,mp41"'

    if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
      console.log("!!!!!")
      const mediaSource = new MediaSource()
      console.log("mediaSource : ")
      console.log(mediaSource)
      // console.log(mediaSource.readyState); // closed
      video.src = URL.createObjectURL(mediaSource)

      mediaSource.addEventListener("sourceopen", function() {
        // const assetURL = require("@/assets/aaaa.mp4")
        const assetURL = require("@/assets/cccc.mp4")
        // const assetURL =
        //   "https://powertalktwo.powertalk.kr/storage/powertalk/powertalktwo/Videos/frag_bunny.mp4"
        const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

        console.log("mediaSource : ")
        console.log(mediaSource)

        console.log("sourceBuffer : ")
        console.log(sourceBuffer)
        self.fetchAB(assetURL, function(buf) {
          console.log("####")
          console.log(buf)
          sourceBuffer.addEventListener("updateend", function(_) {
            mediaSource.endOfStream()
            video.play()
            console.log(mediaSource.readyState) // ended
          })
          sourceBuffer.appendBuffer(buf)
        })
      })
    } else {
      console.error("Unsupported MIME type or codec: ", mimeCodec)
    }
  },
  beforeDestroy() {
    // for (let i = 0; i < self.videoBlob.length; i++) {
    //   URL.revokeObjectURL(self.videoBlob[i])
    // }
  }
}
*/
</script>
