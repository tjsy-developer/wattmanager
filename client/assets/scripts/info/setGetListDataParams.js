export default (query, getListDataParams) => {
  const getKeyword = query.keyword
  const getColumn = query.column
  const getStatus = query.status
  const getPage = query.page

  if (getKeyword) {
    document.getElementById("searchInput").value = getKeyword
    getListDataParams.keyword = getKeyword
  }
  if (getColumn) getListDataParams.order_by_column = getColumn
  if (getStatus) getListDataParams.order_by_status = getStatus
  if (getPage) getListDataParams.page = Number(getPage)
}
