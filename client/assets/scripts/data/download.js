export default (e, self) => {
  if (e.isDownloading) return alert(self.$t("the file is being downloaded"))

  const getDataUrl = e.video ? e.videoName : e.originalBlob || e.imgName
  const fileDownloadName = e.video ? e.videoName : e.imgName

  const link = document.createElement("a")
  const fileName = fileDownloadName.split("/")

  link.style.display = "none"
  link.href = getDataUrl
  link.download = fileName[fileName.length - 1]

  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
    window.URL.revokeObjectURL(getDataUrl)
  })
}
