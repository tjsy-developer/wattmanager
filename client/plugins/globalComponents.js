import Vue from "vue"

import selectComp from "@/components/tags/selectComp"
import mainHeader from "@/components/main/header"
import mainFooter from "@/components/main/footer"
import infoForm from "@/components/info/form"
import infoSearchBar from "@/components/info/searchBar"
import infoList from "@/components/info/list"
import infoCreateAndEdit from "@/components/info/createAndEdit"
import dataList from "@/components/data/list"
import dataSearchBar from "@/components/data/searchBar"
import dataVideoPlay from "@/components/data/videoPlay"
import infiniteScroll from "@/components/infiniteScroll"
import pagination from "@/components/pagination"
import loadingBar from "@/components/loadingModal/loading"
import selectLoadingBar from "@/components/loadingModal/selectLoading"

Vue.component("selectComp", selectComp)
Vue.component("mainHeader", mainHeader)
Vue.component("mainFooter", mainFooter)
Vue.component("infoForm", infoForm)
Vue.component("infoSearchBar", infoSearchBar)
Vue.component("infoList", infoList)
Vue.component("infoCreateAndEdit", infoCreateAndEdit)
Vue.component("dataList", dataList)
Vue.component("dataSearchBar", dataSearchBar)
Vue.component("dataVideoPlay", dataVideoPlay)
Vue.component("infiniteScroll", infiniteScroll)
Vue.component("pagination", pagination)
Vue.component("loadingBar", loadingBar)
Vue.component("selectLoadingBar", selectLoadingBar)
