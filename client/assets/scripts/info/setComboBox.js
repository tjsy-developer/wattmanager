export default (list, selected, selectCompDataList) => {
  for (let i = 1; i < list.length - 1; i++) {
    console.log(list[i].edit)
    if (list[i].edit === "select") {
      list[i].selectCompData = selectCompDataList.shift()
      if (selected)
        list[i].selectCompData.selectedText =
          selected[i - 1] === 0 ? "0" : selected[i - 1]
    }
    if (list[i].edit === "explanation") {
      list[i].detail = selectCompDataList.shift()
    }
  }
  return list
}
