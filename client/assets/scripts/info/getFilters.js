export default (setList, filtersJson) => {
  for (let i = 0; i < setList.length; i++) {
    filtersJson[i].text = setList[i]
  }
  return filtersJson
}
