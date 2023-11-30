<template>
  <div v-if="compData" class="filterBoxComp">
    <div v-if="compData != 'calendar'" class="row search items-center">
      <input class="col filterBoxSearchInput" :id="'filterBoxSearchInput'+titleBarFilterKey" :placeholder="$t('searchBarComp')[4]" @keyup.enter="searchBtnClick" />
      <button class="col-auto" @click="searchBtnClick">
        <img src="@/assets/images/list_icon_search.png" />
      </button>
    </div>
    <div v-if="compData != 'calendar'" class="filterList">
      <div class="row items-center" v-for="(filter, filterKey) in compData" :key="filterKey">
        <div v-if="filter.group !== 'en_alias'" class="col-auto filterListLine">
          <div v-if="filterKey != compData.length-1" class="filterListLineLeft"></div>
        </div>
        <button v-if="filter.group !== 'en_alias'" class="col row items-center" @click="filterBtnClick(filter)" :title="filter">
          <div class="col-auto checkbox row justify-center items-center">
            <div class="checkboxChicked" v-show="filterIsChecked(filter)"></div>
          </div>
          <span class="col filterText">{{ filter.text }}</span>
        </button>
        <!-- 기업 -->
        <button v-else class="enFilterList col row items-center" v-show='filterViewAuth' @click="filterBtnClick(filter)" :title="filter" style="padding-left: 10px">
          <div class="col-auto checkbox row justify-center items-center">
            <div class="checkboxChicked" v-show="AliasfilterIsChecked(filter, '')"></div>
          </div>
          <span class="col filterText">{{ filter.text }}</span>
        </button>
        <button v-if="filter.group === 'en_alias' || filter.group === 'hq_alias'" class="col-auto arrowBtn" @click="subordinateOpenClose(filter, filterKey, null, $event)" v-show='filterViewAuth' :class="`EN${filter.text}`">
          ▼
        </button>
        <!-- 본부 -->
        <div
          class="div row col-12 hqFilterList"
          :class="[filterViewAuth ? 'close': '']"
          @click="filterBtnClick(hqFilterList)"
          v-for="(hqFilterList, hqFilterListrKey) in compData[filterKey].subGroup"
          :key="hqFilterListrKey"
          :style="{paddingLeft: !filterViewAuth ? '13px' : '' }"
        >
          <button class="col row items-center" :title="filter" style="">
            <div class="col-auto checkbox row justify-center items-center">
              <div class="checkboxChicked" v-show="AliasfilterIsChecked(hqFilterList)"></div>
            </div>
            <span class="col filterText">{{ hqFilterList.text }}</span>
          </button>
          <button class="col-auto arrowBtn" @click.stop="subordinateOpenClose(hqFilterList, hqFilterListrKey, null, $event)" :class="`HQ${hqFilterList.text}`">
            {{ filterViewAuth ? '▼': !filterViewAuth && (hqFilterList.value[1] == loginUserHqseq) ? '▲' : '▼'}}
          </button>
          <!-- 지사 -->
          <div
            class="div row col-12 brFilterList"
            :class="[filterViewAuth ? 'close': !filterViewAuth && (hqFilterList.value[1] == loginUserHqseq) ? '' : 'close']"
            @click.stop="filterBtnClick(brFilterList)"
            v-for="(brFilterList, brFilterListrKey) in compData[filterKey].subGroup[hqFilterListrKey].subGroup"
            :key="brFilterListrKey"
          >
            <button class="col row items-center" :title="filter">
              <div class="col-auto checkbox row justify-center items-center">
                <div class="checkboxChicked" v-show="AliasfilterIsChecked(brFilterList)"></div>
              </div>
              <span class="col filterText">{{ brFilterList.text }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row calendar">
      <div class="col-12 row justify-between yearBtns">
        <button class="col-auto yearArrow" @click="yearArrowBtnClick(1)">◀</button>
        <div class="col row justify-center">
          <button>{{year}}</button>
        </div>
        <button class="col-auto yearArrow" @click="yearArrowBtnClick(2)">▶</button>
      </div>
      <div class="col-3 row monthBtns" v-for="month in 12" :key="month">
        <button
          class="col"
          @click="monthBtnClick(year, month)"
          :style="{ color: dateFilterIsChecked(year, month) ? 'white' : undefined, backgroundColor: dateFilterIsChecked(year, month) ? '#0061D1' : undefined }"
        >
          {{ month }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import getDate from "@/assets/scripts/initialize/date"
import initSessionStorage from "@/assets/scripts/initialize/sessionStorage"

export default {
  props: [
    "compData",
    "selectedFilters",
    "titleBarFilterKey",
    "getFilterListUrl",
    "titleBarFilterAlign"
  ],
  data() {
    return {
      year: getDate().yyyy,
      filterViewAuth: true,
      loginUserHqseq: 0
    }
  },
  computed: {
    filterIsChecked(e) {
      return e => {
        return this.selectedFilters.findIndex(x => x.text === e.text) !== -1
      }
    },
    AliasfilterIsChecked(e) {
      return e => {
        return (
          this.selectedFilters.findIndex(
            x => x.text === e.text && x.value[1] === e.value[1]
          ) !== -1
        )
      }
    },
    dateFilterIsChecked() {
      return (year, month) => {
        const setDate = {
          text: this.$t("filterBoxComp", [year, month]),
          value: [year, month]
        }

        for (let i = 0; i < this.selectedFilters.length; i++) {
          if (
            this.selectedFilters[i].constructor === Object &&
            this.selectedFilters[i].text === setDate.text
          ) {
            return true
          }
        }
        return false
      }
    }
  },
  methods: {
    subordinateOpenClose(obj, type, alias, e) {
      /* 1. ▲, ▼ 버튼 직접 클릭시 object값이 들어온다
          1-1  type === initial  인 경우
            1-1-1 필터조건 x를 클릭한 경우
            1-1-2 필터조건에 소속조건이있고 필터박스가 닫힘 -> 열림 상태로 변경됬을 때 */
      if (obj.constructor === Object) {
        let hqEle = ""
        if (obj.group === "en_alias" || alias === "en_alias") {
          if (type === "initial") {
            hqEle = document
              .getElementsByClassName("EN" + obj.upperText)[0]
              .parentElement.getElementsByClassName("hqFilterList")
          } else {
            hqEle = document
              .getElementsByClassName("EN" + obj.text)[0]
              .parentElement.getElementsByClassName("hqFilterList")
          }
        } else if (alias === "hq_alias") {
          hqEle = document
            .getElementsByClassName("HQ" + obj.upperText)[0]
            .parentElement.getElementsByClassName("brFilterList")
          if (this.filterViewAuth) {
            hqEle = hqEle[0].parentElement.parentElement.getElementsByClassName(
              "hqFilterList"
            )
          }
        } else {
          hqEle = e.target.parentElement.getElementsByClassName("brFilterList")
        }
        //  하위소속(본부)가 열려있는지 체크
        for (let t = 0; t < hqEle.length; t++) {
          const brEle = hqEle[t].childNodes
          if (hqEle[t].classList.contains("close") && type !== "initial") {
            e.target.textContent = "▲"
            hqEle[t].classList.remove("close")
            hqEle[t].classList.add("open")
          } else if (type === "initial") {
            hqEle[t].parentElement.children[1].textContent = "▲"
            hqEle[t].classList.remove("close")
            hqEle[t].classList.add("open")
            if (alias === "hq_alias") {
              hqEle[t].parentElement.classList.remove("close")
              hqEle[t].parentElement.classList.add("open")
            }
          } else {
            e.target.textContent = "▼"
            hqEle[t].classList.add("close")
            hqEle[t].classList.remove("open")
          }

          for (let i = 0; i < brEle.length; i++) {
            if (brEle[i].tagName === "DIV") {
              console.log(status)
              if (obj.group === "en_alias") {
                brEle[i].parentElement.children[1].textContent = "▼"
                brEle[i].classList.add("close")
                brEle[i].classList.remove("open")
              } else if (
                brEle[i].parentElement.children[0].children[1].textContent ===
                  obj.upperText &&
                alias === "hq_alias"
              ) {
                brEle[i].parentElement.children[1].textContent = "▲"
                brEle[i].classList.add("open")
                brEle[i].classList.remove("close")
              }
            }
          }
        }
      } else {
        // 검색할때 처리
        let enEle = ""
        let hqEle = ""
        enEle = document.getElementsByClassName("enFilterList")
        hqEle = document.getElementsByClassName("hqFilterList")

        if (this.filterViewAuth) {
          //  기업이 열려있는지 체크
          for (let s = 0; s < enEle.length; s++) {
            enEle[s].nextElementSibling.textContent = "▼"
          }
        }
        //  본부가 열려있는지 체크
        for (let t = 0; t < hqEle.length; t++) {
          const brEle = hqEle[t].childNodes
          // 초기에는 닫는다
          hqEle[t].classList.add("close")
          hqEle[t].classList.remove("open")

          if (obj === "" && this.filterViewAuth) {
            hqEle[t].children[1].textContent = "▼"
            hqEle[t].classList.add("close")
            hqEle[t].classList.remove("open")
          } else if (obj === "" && !this.filterViewAuth) {
            hqEle[t].children[1].textContent = "▼"
            hqEle[t].classList.remove("close")
            hqEle[t].classList.add("open")
          }
          // 검색어가 본부명과 일치하는 경우
          if (
            obj !== "" &&
            hqEle[t].children[0].children[1].textContent.includes(obj)
          ) {
            hqEle[t].parentElement.children[1].textContent = "▲"
            hqEle[t].classList.remove("close")
            hqEle[t].classList.add("open")
          } else {
            // hqEle[t].parentElement.children[1].textContent = "▼"
            // hqEle[t].classList.remove("open")
            // hqEle[t].classList.add("close")
          }
          // 지사가 열려있는지 체크
          for (let i = 2; i < brEle.length; i++) {
            // 검색어가 지사명과 일치하는 경우
            if (
              obj !== "" &&
              brEle[i].children[0].children[1].textContent.includes(obj)
            ) {
              hqEle[t].parentElement.children[1].textContent = "▲"
              hqEle[t].children[1].textContent = "▲"
              hqEle[t].classList.remove("close")
              hqEle[t].classList.add("open")
              brEle[i].classList.remove("close")
              brEle[i].classList.add("open")
            } else {
              // hqEle[t].parentElement.children[1].textContent = "▼"
              hqEle[t].children[1].textContent = "▼"
              brEle[i].classList.add("close")
              brEle[i].classList.remove("open")
            }
          }
        }
      }
    },
    searchBtnClick() {
      const getFilterBoxSearchInput = document.getElementById(
        "filterBoxSearchInput" + this.titleBarFilterKey
      )

      const getSelectedFiltersOptions = initSessionStorage.get(
        "selectedFiltersOptions"
      )
      getSelectedFiltersOptions.searchKeyword = getFilterBoxSearchInput.value

      if (this.compData !== "calendar" && getFilterBoxSearchInput) {
        const self = this
        const token = sessionStorage.getItem("jwt")
        this.$axios
          .post(process.env.backendURL + this.getFilterListUrl, {
            jwt: token
          })
          .then(function(res) {
            // 추가사항
            const arr = []
            res.data.reduce((acc, cur) => {
              if (cur != null && cur !== "")
                if (
                  // 소속필터
                  // 최종관리자일때는 기업도 검색조건에 포함
                  self.filterViewAuth &&
                  ((cur.constructor === Object &&
                    cur.en_alias.includes(getFilterBoxSearchInput.value)) ||
                    (cur.constructor === Object &&
                      cur.hq_alias.includes(getFilterBoxSearchInput.value)) ||
                    (cur.constructor === Object &&
                      cur.br_alias.includes(getFilterBoxSearchInput.value)))
                ) {
                  self.setting(cur, arr)
                } else if (
                  // 기업관리자,본부관리자,지사,사용자 일때는 본부이하만 검색조건에 포함
                  !self.filterViewAuth &&
                  ((cur.constructor === Object &&
                    cur.hq_alias.includes(getFilterBoxSearchInput.value)) ||
                    (cur.constructor === Object &&
                      cur.br_alias.includes(getFilterBoxSearchInput.value)))
                ) {
                  self.setting(cur, arr)
                  // 소속필터를 제외한 필터
                } else if (
                  cur.constructor !== Object &&
                  cur.includes(getFilterBoxSearchInput.value)
                )
                  arr.push({
                    text: cur,
                    value: cur,
                    group: self.titleBarFilterAlign.column
                  })
            }, [])
            // 부모한테 compData로 받은 데이터를 변경한다
            self.$emit("dataSetting", arr, getSelectedFiltersOptions.column - 1)
            getSelectedFiltersOptions.searchList = arr

            if (getSelectedFiltersOptions.column === 4) {
              // emit후에 dom이 셋팅되고 나서 실행
              setTimeout(() => {
                if (getFilterBoxSearchInput.value === "") {
                  self.filterBoxOpenInitial()
                } else self.subordinateOpenClose(getFilterBoxSearchInput.value)
                // if (getFilterBoxSearchInput.value === "") {
                //   self.filterBoxOpenInitial()
                // }
                // if (getFilterBoxSearchInput.value === "")
                //   self.filterBoxOpenInitial()
              }, 100)
            }
            initSessionStorage.set(
              "selectedFiltersOptions",
              getSelectedFiltersOptions
            )
          })
          .catch(function(error) {
            console.log("filterBox.vue error : ", error)
          })
      }
    },
    setting(cur, arr) {
      // filterList 배열에 현재 추가할 기업 존재여부확인
      const EnPresenceCheck = arr.some(item => item.value[1] === cur.en_seq)

      // 기업이 존재하지 않는다면 넣는다
      if (!EnPresenceCheck) {
        arr.push({
          text: cur.en_alias,
          value: [null, cur.en_seq],
          group: "en_alias",
          subGroup: []
        })
      }
      // 본부청보를 object에 저장
      const hqList = {}
      hqList.upperText = cur.en_alias
      hqList.text = cur.hq_alias
      hqList.value = [cur.en_seq, cur.hq_seq]
      hqList.group = "hq_alias"
      hqList.subGroup = []

      // filterList 객체에서 소속된 기업의 인덱스를 찾는다
      const enIndex = arr.findIndex(obj => obj.value[1] === cur.en_seq)

      // filterList > hqGroup 본부배열에 현재 추가할 본부 존재여부확인
      const HQPresenceCheck = arr[enIndex].subGroup.some(
        item => item.value[0] === cur.en_seq && item.value[1] === cur.hq_seq
      )

      //  true: 이미 해당 본부는 추가되어있는 상태 , false : 지사정보를 본부객체에 푸시한다
      if (!HQPresenceCheck) {
        arr[enIndex].subGroup.push(hqList)
      }

      // filterList 객체에서 소속된 본부의 인덱스를 찾는다
      const hqIndex = arr[enIndex].subGroup.findIndex(
        obj => obj.value[0] === cur.en_seq && obj.value[1] === cur.hq_seq
      )

      // filterList > hqGroup > brGroup 지사배열에 현재 추가할 지사 존재여부확인
      const BrPresenceCheck = arr[enIndex].subGroup[hqIndex].subGroup.some(
        item =>
          item.value[0] === cur.en_seq &&
          item.value[1] === cur.hq_seq &&
          item.value[2] === cur.br_seq
      )
      // 지사청보를 object에 저장
      const brList = {}
      brList.topUpperText = cur.en_alias
      brList.upperText = cur.hq_alias
      brList.text = cur.br_alias
      brList.value = [cur.hq_seq, cur.br_seq]
      brList.group = "br_alias"

      // true: 이미 해당 지사는 추가되어있는 상태 , false : 지사정보를 본부객체에 푸시한다
      if (!BrPresenceCheck) {
        arr[enIndex].subGroup[hqIndex].subGroup.push(brList)
      }
    },
    selectedFiltersPop(e) {
      console.log("selectedFiltersPop", e)
    },
    // 체크박스 버튼 클릭시 보임
    filterBtnClick(obj) {
      let setSelectedFilters = []
      const getSelectedFilters = sessionStorage.getItem("selectedFilters")

      if (getSelectedFilters)
        setSelectedFilters = JSON.parse(getSelectedFilters)

      // 소속필터 -지사클릭, 참여자, 사건분류
      if (obj.group !== "en_alias" && obj.group !== "hq_alias") {
        if (setSelectedFilters.length) {
          if (obj.constructor === Object) {
            let selectedFilterIndex
            // 지사 체크박스 클릭 시
            if (obj.group !== "br_alias") {
              selectedFilterIndex = setSelectedFilters.findIndex(
                x => x.text === obj.text
              )
            } else {
              selectedFilterIndex = setSelectedFilters.findIndex(
                x =>
                  x.text === obj.text &&
                  x.value[0] === obj.value[0] &&
                  x.value[1] === obj.value[1]
              )
            }
            console.log(selectedFilterIndex)
            if (selectedFilterIndex === -1) setSelectedFilters.push(obj)
            else {
              setSelectedFilters.splice(selectedFilterIndex, 1)
            }
          } else if (!setSelectedFilters.includes(obj))
            setSelectedFilters.push(obj)
          else setSelectedFilters.splice(setSelectedFilters.indexOf(obj), 1)
        } else setSelectedFilters.push(obj)
        // 소속필터 - 기업 체크박스 클릭시
      } else if (obj.group === "en_alias") {
        let hqClcikStatus = false
        // 본부가 체크되어있는지 확인
        for (let i = 0; i < obj.subGroup.length; i++) {
          if (i === 0) {
            const selectedFilterIndex = setSelectedFilters.findIndex(
              x => x.value[0] === obj.value[0] && x.value[1] === obj.value[1]
            )
            // 현재소속이 이미 체크되어있는지 확인
            if (selectedFilterIndex === -1) {
              setSelectedFilters.push(obj)
              hqClcikStatus = true
            } else {
              setSelectedFilters.splice(selectedFilterIndex, 1)
              hqClcikStatus = false
            }
          }
          const selectedFilterIndex1 = setSelectedFilters.findIndex(
            x =>
              x.text === obj.subGroup[i].text &&
              x.value[1] === obj.subGroup[i].value[1]
          )
          // 기업을 추가한 상태
          if (hqClcikStatus) {
            if (selectedFilterIndex1 === -1) {
              // 체크 되어있지 않은 소속만 push
              setSelectedFilters.push(obj.subGroup[i])
            }
            // 기업이 list에서 삭제된 상태로 해당되는 본부를 삭제한다
          } else {
            // eslint-disable-next-line no-lonely-if
            if (selectedFilterIndex1 !== -1) {
              setSelectedFilters.splice(selectedFilterIndex1, 1)
            }
          }
          // 지사가 체크되어있는지 확인
          for (let s = 0; s < obj.subGroup[i].subGroup.length; s++) {
            const selectedFilterIndex2 = setSelectedFilters.findIndex(
              x =>
                x.text === obj.subGroup[i].subGroup[s].text &&
                x.value[1] === obj.subGroup[i].subGroup[s].value[1]
            )
            if (hqClcikStatus) {
              if (selectedFilterIndex2 === -1) {
                setSelectedFilters.push(obj.subGroup[i].subGroup[s])
              }
            } else {
              // eslint-disable-next-line no-lonely-if
              if (selectedFilterIndex2 !== -1) {
                setSelectedFilters.splice(selectedFilterIndex2, 1)
              }
            }
          }
        }
        // 본부 체크박스 클릭 시
      } else if (obj.group === "hq_alias") {
        let hqClcikStatus = false
        // 본부 체크박스 여부 확인
        for (let i = 0; i < obj.subGroup.length; i++) {
          if (i === 0) {
            const selectedFilterIndex = setSelectedFilters.findIndex(
              x =>
                x.value[0] === obj.value[0] &&
                x.value[1] === obj.value[1] &&
                x.text === obj.text
            )
            if (selectedFilterIndex === -1) {
              setSelectedFilters.push(obj)
              hqClcikStatus = true
            } else {
              setSelectedFilters.splice(selectedFilterIndex, 1)
              hqClcikStatus = false
            }
          }
          // 지사 체크박스 여부 확인
          const selectedFilterIndex1 = setSelectedFilters.findIndex(
            x =>
              x.text === obj.subGroup[i].text &&
              x.value[1] === obj.subGroup[i].value[1]
          )

          if (hqClcikStatus) {
            if (selectedFilterIndex1 === -1) {
              setSelectedFilters.push(obj.subGroup[i])
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (selectedFilterIndex1 !== -1) {
              setSelectedFilters.splice(selectedFilterIndex1, 1)
            }
          }
        }
      }

      sessionStorage.setItem(
        "selectedFilters",
        JSON.stringify(setSelectedFilters)
      )

      window.location.reload()
    },
    setYear(year) {
      const getSelectedFiltersOptions = initSessionStorage.get(
        "selectedFiltersOptions"
      )
      getSelectedFiltersOptions.year = year
      initSessionStorage.set("selectedFiltersOptions", getSelectedFiltersOptions)
    },
    yearArrowBtnClick(e) {
      if (e === 1) this.year--
      else this.year++

      this.setYear(this.year)
    },
    monthBtnClick(year, month) {
      console.log(year, month)
      const startDate = this.createStartTimeStemp(year, month)
      const finalDate = this.createEndTimeStemp(year, month)
      const setDate = {
        text: this.$t("filterBoxComp", [year, month]),
        value: [startDate, finalDate],
        group: "save_time"
      }

      this.filterBtnClick(setDate)

      this.setYear(year)
    },
    createStartTimeStemp(year, month) {
      // month는 0베이스이다. 그래서 -1을 해줘야한다
      const now = new Date(year, month - 1)
      // // const standard = now.getTime() / 1000 + now.getTimezoneOffset() * 60
      const standard = now.getTime() / 1000
      const returnDate = Math.round(standard)
      return returnDate
    },
    createEndTimeStemp(year, month) {
      // month는 0베이스이다. 그래서 -1을 해줘야하지만, 해당 월의 마지막 시간을 구하는 것이기에 -1을 해주지 않음
      const date = new Date(year, month)
      // date.setDate(new Date(year, month, 0).getDate())
      const standard = date.getTime() / 1000 // 밀리초를 초 형식으로 변환
      return Math.round(standard - 1)
    },
    filterBoxOpenInitial() {
      const getSelectedFiltersOptions = initSessionStorage.get(
        "selectedFiltersOptions"
      )
      const getSelectedFilters = initSessionStorage.get("selectedFilters")
      if (getSelectedFiltersOptions && getSelectedFiltersOptions.column === 4) {
        if (getSelectedFilters && getSelectedFilters.length) {
          for (let i = 0; i < getSelectedFilters.length; i++) {
            // 클릭한 소속을 펼침
            if (
              getSelectedFilters[i].group === "br_alias" ||
              getSelectedFilters[i].group === "hq_alias"
            ) {
              let column = ""
              if (getSelectedFilters[i].group === "br_alias") {
                column = "hq_alias"
              } else {
                column = "en_alias"
              }
              this.subordinateOpenClose("")
              setTimeout(() => {
                // 함수 실행
                this.subordinateOpenClose(
                  getSelectedFilters[i],
                  "initial",
                  column
                )
              }, 100)
            }
          }
        } else {
          this.subordinateOpenClose("")
        }
      }
    }
  },
  mounted() {
    const getSelectedFiltersOptions = initSessionStorage.get(
      "selectedFiltersOptions"
    )

    if (getSelectedFiltersOptions && getSelectedFiltersOptions.year)
      this.year = getSelectedFiltersOptions.year

    const auth = sessionStorage.getItem("auth")
    // 해당 본부를 열기위함
    this.loginUserHqseq = sessionStorage.getItem("hqSeq")
    if (auth < 4) {
      this.filterViewAuth = false
      console.log(document.getElementsByClassName("hqFilterList")[0])
    }
    this.filterBoxOpenInitial()
  }
}
</script>

<style lang="sass" scoped>
.filterBoxComp
  position: absolute
  width: 200px
  top: 25px
  z-index: 1
  color: black
  background: white
  border: 1px solid #AEAEAE
  padding: 10px

.search
  width: 100%
  border: 1px solid #0061D1

.search>input
  font-size: 10px
  padding: 2px 7px

.search>button
  width: 20px
  height: 15px
  >img
    width: 14px
    height: 14px

.filterList
  width: 100%
  max-height: 200px
  font-size: 12px
  margin-top: 10px
  overflow-y: auto

  >button,
  >div
    width: 100%

    >button
      margin-top: 2px

  &::-webkit-scrollbar
    width: 5px
  &::-webkit-scrollbar-track
    background-color: #F2F2F2
    border-radius: 3px
  &::-webkit-scrollbar-thumb
    background-color: #DBDBDB
    outline: 1px solid slategrey
    border-radius: 3px

$filterListLinePos: 3px
.filterListLine
  width: 10px
  border-top: 1px dotted #707070
  border-left: 1px dotted #707070
  margin-left: $filterListLinePos

.filterBoxSearchInput
  outline: none

  >.filterListLineLeft
    position: absolute
    top: -1px
    left: -$filterListLinePos
    width: 1px
    height: 21px
    border-left: 1px dotted #707070

.checkbox
  width: 10px
  height: 10px
  border: 1px solid #707070

.checkboxChicked
  width: 6px
  height: 6px
  background-color: #0061D1

.filterText
  text-align: left
  margin-left: 5px
  +ellipsis

.calendar
  width: 100%

  >.yearBtns
    button
      padding: 5px

    >.yearArrow
      color: #0061D1

  >.monthBtns
    height: 45px

    >button
      font-size: 12px
      border: 1px solid #efefef
      margin: 5px

      &:hover
        color: white
        background-color: #0061D1

.hqListLine:not(:first-child)
  border-left: 1px dotted #707070
  margin-left: 3px

.hqListLine
  &:first-child
    margin-left: 3px
    >.brFilterList
      border-left: 1px dotted #707070

.hqListTopLine
  &:first-child
    position: inherit
    top: 10px
    margin-left: 0px
    border-left: 1px dotted #707070
.hqListTopLine:not(:first-child)
   border-left: none
.hqFilterList
  padding-left: 26px
  // border-left: 1px dotted #707070
.brFilterList
  padding-left: 13px

.arrowBtn
  width: 30px
  margin-top: 0px !important
  padding-bottom: 2px
  font-size: 10px
  border-radius: 5px
  margin-right: 5px

.arrowBtn:hover
  background: #adcfdf
.open
  visibility: visible
.close
  visibility: hidden
  height: 0px
</style>
