import shareModal from "@/components/data/shareModal"

export default (modal, _url) => {
  const modalsContainerStyle = document.getElementById("modalsContainer").style
  modalsContainerStyle.display = "block"
  modal.show(
    shareModal,
    { url: _url },
    {
      name: "shareModal",
      width: 500,
      height: 270
    },
    {
      "before-close": () => {
        modalsContainerStyle.display = "none"
      }
    }
  )
}
