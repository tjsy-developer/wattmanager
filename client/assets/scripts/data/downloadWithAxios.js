import axios from "axios"

export default e => {
  const getDataUrl = e.video ? e.video : e.img
  // const fileFolder = e.video ? "recording_videos/" : "pictures/"
  const fileName = getDataUrl.slice(getDataUrl.lastIndexOf("/") + 1)

  axios({
    method: "get",
    url: getDataUrl,
    responseType: "arraybuffer",
    credmential: true
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
    .catch(() => console.log("downloadWithAxios.js error occured"))
}
