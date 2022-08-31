import initLocalStorage from "@/assets/scripts/initialize/localStorage"

export default getListDataParams => {
  const getSelectedFilters = initLocalStorage.get("selectedFilters")
  if (getSelectedFilters) {
    for (let i = 0; i < getSelectedFilters.length; i++) {
      if (getSelectedFilters[i].group === "joined_members")
        getListDataParams.joined_members.push(getSelectedFilters[i].value)
      else if (getSelectedFilters[i].group === "category")
        getListDataParams.category.push(getSelectedFilters[i].value)
      else if (getSelectedFilters[i].group === "br_alias")
        getListDataParams.hq_alias.push(getSelectedFilters[i].value)
      else if (getSelectedFilters[i].group === "save_time")
        getListDataParams.save_time.push(getSelectedFilters[i].value)
    }
  }
}
