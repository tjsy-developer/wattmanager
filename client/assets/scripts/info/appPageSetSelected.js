export default selected => {
  const copySelected = JSON.parse(JSON.stringify(selected))
  copySelected.splice(4, 0, "powertalk")
  return copySelected
}
