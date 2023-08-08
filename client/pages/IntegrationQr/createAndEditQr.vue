<template>
    <div class="mainWrap">
        <div class="mainWrap__header">
            <span>{{ $t("createAndEditQr")[0] }}</span>
        </div>
        <div class="content">
            <div class="content__header">
                <span>{{ $t("createAndEditQr")[1] }}</span>
            </div>
            <div class="divisionLine"></div>
            <div class="usageName">
                <span>{{ $t("createAndEditQr")[2] }}</span>
                <input class="usageInput" v-model="chapterName" disabled />
            </div>
            <div class="divisionLine"></div>
            <div class="content__main">
                <div class="subject">
                    <span>{{ $t("createAndEditQr")[3] }}</span>
                </div>
                <div class="qrTable">
                    <div class="qrTable__header">
                        <div class="deleteRowBtnWrapBlue"> </div>
                        <div class="keyTxtWrap">
                            <div class="col keyTxt"  v-for="(content, key) in keyList">
                                <span>{{ content.key_value }}<br>({{ content.key_description }})</span>
                            </div>
                        </div>
                    </div>
                    <div class="qrTable__body">
                        <div class="qrInputForm" v-for="(content, key) in dataList" :key="key" >
                            <div class="deleteRowBtnWrap">
                                <button class="deleteRowBtn" @click="deletRow(content.data_seq, content.crud, key)">
                                    <img src="@/assets/images/ic_trash_red.svg" />
                                </button>
                            </div>
                            <div class="qrInput">
                                <div class="col inputWrap" v-for="(qrContent, index) in content.qr_data" :key="index">
                                    <input :value="qrContent" @change="changeInput(key, index, $event)" :placeholder="keyList[index].key_type" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="divisionLine"></div>
            <div class="content__footer">
                <div class="btnWrap">
                    <button class="saveBtn" @click="saveQrData()">{{ $t("createAndEditQr")[4] }}</button>
                    <button class="cancleBtn" @click="cancleBtnClick()">{{ $t("createAndEditQr")[5] }}</button>
                    <!-- <button class="deleteAllBtn" @click="deleteQR()">삭제</button> -->
                </div>
                <div class="addBtnWrap">
                    <div class="excelBtnWrap" @mouseenter="excelExplane = !excelExplane" @mouseleave="excelExplane = !excelExplane">
                        <button class="excelBtn" @click="excelPaste()">{{ $t("excelPaste")[0] }}</button>
                        <div v-if="excelExplane" class="excelTxt">
                            <span>{{ $t("excelPaste")[1] }}<br>{{ $t("excelPaste")[2] }}</span>
                        </div>
                    </div>
                    <button class="addBtn" @click="addRow(5)">{{ $t("createAndEditQr")[6] }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axiosJson from "@/assets/jsons/axios"
export default {
    layout: "main",
    data() {
        return {
            checkAll: false,
            checkEach: false,
            keyList: [],
            dataList: [],
            chapter_seq: "",
            backendURL: "",
            chapterName: "",
            typeList: [],
            excelExplane: false
        }
    },
    mounted() {
        this.chapter_seq = localStorage.getItem("chapter_seq")
        this.backendURL = process.env.backendURL
        this.jwt = localStorage.getItem("jwt"),
        this.getData()
    },
    methods: {
        getData() {
            this.$axios
                .post(this.backendURL + axiosJson.qrManagement.qrList, {
                    jwt: this.jwt,
                    chapter_seq: this.chapter_seq
                })
                .then((res) => {
                    const data = res.data.data.qr_list
                    console.log(data)
                    this.chapterName = data.chapter_name
                    const keyData = data.key_list
                    const qrData = data.data_list
                    if (keyData != null) {
                        // 키 셋팅
                        keyData.forEach((ele) => {
                            const keyInfo = {
                                key_seq: ele.key_seq,
                                key_value: ele.key_value,
                                key_type: ele.key_type,
                                key_description: ele.key_description,
                            }
                            this.typeList.push(ele.key_type)
                            this.keyList.push(keyInfo)
                        })
                        if (qrData != null) {
                            // QR 값 등록 가져오는 부분
                            qrData.forEach((ele, index) => {
                                const qrData = JSON.parse(ele.qr_data)
                                const qrValue = []
                                this.keyList.forEach((element, i) => {
                                    // key_seq에 맞춰 data를 넣는다. (행을 일치시키기 위함)
                                    qrValue.push(qrData[element.key_seq])
                                })
                                const qrInfo = {
                                    crud: "update",
                                    data_seq: ele.data_seq,
                                    checked_yn: 1,
                                    qr_data: qrValue
                                }
                                this.dataList.push(qrInfo)
                            })
                        } else {
                            // qrData가 없는 경우 빈칸 1개 자동 생성
                            const qrValue = []
                            this.keyList.forEach((ele) => {
                                qrValue.push("")
                            })
                            const dataInit = {
                                crud: "create",
                                checked_yn: 1,
                                qr_data: qrValue
                            }
                            this.dataList.push(dataInit)
                        }   
                    } else {
                        this.operateDialog(this.$t("qrMessage")[5], "error")
                        this.cancleBtnClick()
                    }
                })
                .catch((err) => {
                    console.log("qrList fail => ", err)
                })
        },
        cancleBtnClick() {
            window.location.href = document.referrer
        },
        changeInput(titleIndex, qrIndex, event) {
            // input type 확인 및 일치 여부 확인
            if (event.target.value) {
                if (this.keyList[qrIndex].key_type == "Int") {
                    if (!Number(event.target.value)) {
                        this.operateDialog(this.$t("qrMessage"), "error")
                        event.target.value = ""
                    }
                    else {
                        this.dataList[titleIndex].qr_data[qrIndex] = event.target.value
                    }
                } else {
                    this.dataList[titleIndex].qr_data[qrIndex] = event.target.value
                }
                if (this.keyList[qrIndex].key_type == "Boolean") {
                    if (event.target.value == "true" || event.target.value == "false") {
                        this.dataList[titleIndex].qr_data[qrIndex] = event.target.value
                    } else {
                        this.operateDialog(this.$t("qrMessage")[8], "error")
                        event.target.value = ""
                    }
                }
            } else {
                this.dataList[titleIndex].qr_data[qrIndex] = ""
            }
        },
        saveQrData() {
            const qrParams = []
            let checkNull = false
            this.dataList.forEach((ele, tIndex) => {
                const qrInput = []
                const test = JSON.stringify(ele.qr_data)
                // 모두 공백인지 확인
                const checkAllNull = test.split('""').join("").split(",").join("").split("[]").join("")
                // 모두 공백인 경우 pass
                if (checkAllNull == "") return
                ele.qr_data.forEach((element, index) => {
                    const keySeq = String(this.keyList[index].key_seq)
                    let inputForm
                    // 타입 확인
                    if (this.keyList[index].key_type == "Boolean") {
                        if (element == undefined || element == "") {
                            element = false
                        }
                    } else {
                        if (element == undefined || element == "") {
                            return checkNull = true
                        }
                    }
                    // Json 문자열로 만들어서 넣어준다
                    inputForm = JSON.stringify(keySeq) + ":" + JSON.stringify(element)
                    qrInput.push(inputForm)
                })
                const qrInfo = {
                    crud: ele.crud,
                    data_seq: ele.data_seq,
                    checked_yn: 1,
                    chapter_seq: this.chapter_seq,
                    qr_data: `{${qrInput.join(',')}}`

                }
                qrParams.push(qrInfo)
            })
            if (checkNull) {
                return this.operateDialog(this.$t("qrMessage")[7], "error")
            }
            this.$axios
                .post(this.backendURL + axiosJson.qrManagement.qrSave, {
                    jwt: this.jwt,
                    data_list: qrParams
                })
                .then((res) => {
                    this.operateDialog(this.$t("qrMessage")[0], "confirm")
                    setTimeout(() => {
                        this.cancleBtnClick()
                    }, 1500)
                })
                .catch((err) => {
                    console.log("qrSave error => ", err)
                })
        },
        addRow(count) {
            // 행 추가
            for (let iLoop = 0; iLoop < count; ++iLoop) {
                const qrSetting = []
                // keyList 갯수 만큼 data 빈값 추가
                this.keyList.forEach((ele) => {
                    qrSetting.push("")
                })
                const dataParams = {
                    crud: "create",
                    data_seq: "",
                    checked_yn: 1,
                    chapter_seq: this.chapter_seq,
                    qr_data: qrSetting
                }
                this.dataList.push(dataParams)
            }
        },
        deletRow(seq, crud, index) {
            if (crud == "create") {
                this.dataList.splice(index, 1)
            } else {
                this.$axios
                .post(this.backendURL + axiosJson.qrManagement.qrDataDelete, {
                    jwt: this.jwt,
                    data_seq: seq
                })
                .then((res) => {
                    console.log(res)
                    this.dataList.splice(index, 1)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
            if (this.dataList.length == 0) {
                this.addRow()
            }
        },
        excelPaste() {
            // clipboard의 text를 읽어온다.
            navigator.clipboard.readText()
                .then((data) => {
                    // 엑셀 복사 시 열 분리가 \n 으로 되어있다.
                    const splitData = data.split("\n")
                    const lineData = []
                    const pasteData = []
                    const nullIndex = []
                    let formCheck = true
                    // 빈칸 확인 및 빈칸이 있으면 저장
                    this.dataList.forEach((data, dataIndex) => {
                        const JsonData = JSON.stringify(data.qr_data)
                        const checkAllNull = JsonData.split('""').join("").split(",").join("").split("[]").join("")
                        if (checkAllNull == "" && data.crud == "create") return nullIndex.push(dataIndex)
                    })
                    // 빈칸 제거
                    this.dataList.splice(nullIndex[0], nullIndex.length)
                    // 엑셀에서 행 구분이 \t 와 \r로 이루어져있어 분리 해준다
                    // 엑셀에서 "," 가 사용 가능하기에 분리된 것을 join할 때는 \., 이라는 특수문자로 해준다
                    splitData.forEach((ele) => {
                        lineData.push(ele.split("\t").join("\.,").split("\r")[0])
                    })
                    lineData.forEach((ele, eIndex) => {
                        // 1인 경우는 아무것도 없는 경우이다.
                        // 분리를 하면 자동으로 빈 배열 하나가 생성된다.
                        if (lineData.length == 1) return formCheck = false
                        // 빈 배열 전까지 반복
                        if (eIndex < lineData.length -1) {
                            const qrDataList = []
                            const splitEle = ele.split("\.,")
                            // 두개의 길이가 일치 하지 않으면, 형식이 잘못 된 것이다.
                            if (splitEle.length != this.keyList.length) return formCheck = false
                            splitEle.forEach((element, index) => {
                                if (this.checkType(index, element)) {
                                    // 분리하면 공백 값이 하나 생긴다.
                                    if (index < ele.length - 1) {
                                        if (element == "") return formCheck = false
                                        // qrDataList에 한개의 열에대한 행 값 하나하나를 넣어준다.
                                        qrDataList.push(element)
                                    }
                                } else {
                                    formCheck = false
                                }
                            })
                            // pasteData에 열들을 넣어준다
                            if (qrDataList.length > 0) {
                                pasteData.push(qrDataList)
                            }
                        }
                    })
                    if (formCheck == false) {
                        return this.operateDialog(this.$t("qrMessage")[9], "error")
                    } else {
                        pasteData.forEach((ele) => {
                            const dataParams = {
                                crud: "create",
                                data_seq: "",
                                checked_yn: 1,
                                chapter_seq: this.chapter_seq,
                                qr_data: ele
                            }
                            this.dataList.push(dataParams)
                        })
                        // 빈 칸들을 제거한 만큼 더해준다
                        this.addRow(nullIndex.length)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        checkType(index, pasteInput) {
            if (this.typeList[index] == "Int") {
                if (!Number(pasteInput)) {
                    return false
                } else {
                    return true
                }
            } else if (this.typeList[index] == "Boolean") {
                if (pasteInput != "true" || pasteInput !="TRUE" || pasteInput != "false" || pasteInput != "FALSE") {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        }
        // 요청에의해 전체 qr 제거기능 제거
        // deleteQR() {
        //     const result = confirm(this.$t("qrMessage")[2])
        //     if (result != true) return
        //     console.log(this.chapter_seq)
        //     this.$axios
        //         .post(this.backendURL + axiosJson.qrManagement.qrAllDataDelete, {
        //             jwt: this.jwt,
        //             chapter_seq: this.chapter_seq
        //         })
        //         .then((res) => {
        //             console.log(res)
        //             this.cancleBtnClick()
        //         })
        //         .catch((err) => {
        //             console.log(err)
        //         })
        // }
    }
}
</script>

<style lang="scss" scoped>
.mainWrap {
    width: 100%;
	min-width: 1260px;
	min-height: calc(100% - 84px);
	background-color: #EFF0F1;
    display: flex;
    flex-direction: column;
    align-items: center;
    &__header {
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent linear-gradient(180deg, #0061D1 0%, #23A3DC 100%) 0% 0% no-repeat padding-box;
        width: 100%;
        font-size: 24px;
        font-weight: 800;
        color: white;
        span {
            width: 1260px;
	        padding: 29px 0 23px;
        }
    }
}
.divisionLine {
    width: 100%;
    height: 0px;
    border: 1px solid #D9D9D9;
}
.content {
    width: 1260px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &__header {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 22px;
        color: black;
        font: normal normal bold 22px/26px NanumSquare;
    }
    &__main {
        font: normal normal normal 14px/16px NanumSquare;
        width: 100%;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .subject {
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span {
                width: 100px;
                margin-left: 20px;
            }
        }
    }
    &__footer {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
        margin-bottom: 20px;
        .btnWrap {
            width: 350px;
            height: 100%;
            font: normal normal bold 14px/18px NanumSquare;
        }
    }
}
.usageName {
    width: 100%;
    height: 63px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font: normal normal normal 14px/16px NanumSquare;
    color: black;
    span {
        width: 100px;
        margin-left: 20px;
    }
    .usageInput {
        width: calc(100% - 100px);
        height: 38px;
        background: white;
        outline: 1px solid #D9D9D9;
    }
}
.qrTable {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-x: auto;
    &__header {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #4173AC 0% 0% no-repeat padding-box;
        color: white;
        margin-bottom: 5px;
    }
    &__body {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        margin-bottom: 8px;
    }
}
.checkboxWrapBlue {
    width: 120px !important;
    height: 47px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #4173AC 0% 0% no-repeat padding-box;
}
.keyTxtWrap {
    width: calc(100% - 50px);
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .keyTxt{
        min-width: 150px;
        height: 100%;
        background: #4173AC 0% 0% no-repeat padding-box;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
}

.qrInputForm {
    width: 100%;
    height: 68px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
    background: #ffffff 0% 0% no-repeat padding-box;
    .checkboxWrap {
        width: 120px !important;
        height: 68px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff 0% 0% no-repeat padding-box;
    }
    .qrInput {
        width: calc(100% - 50px);
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .inputWrap {
            min-width: 150px;
            height: 68px;
            display: flex;
            background: #ffffff 0% 0% no-repeat padding-box;
            justify-content: center;
            align-items: center;
            input {
                width: 95%;
                height: 80%;
            }
        }
    }
}
.deleteRowBtnWrapBlue {
    width: 50px !important;
    height: 100%;
}
.deleteRowBtnWrap {
    width: 50px !important;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
}
.saveBtn {
    width: 98px;
    height: 100%;
    background: #008BCF 0% 0% no-repeat padding-box;
    border-radius: 2px;
    color: white;
}
.cancleBtn {
    width: 98px;
    height: 100%;
    background: #9F9F9F 0% 0% no-repeat padding-box;
    border-radius: 2px;
    color: white;
    margin-left: 4px;
}
.deleteAllBtn {
    width: 98px;
    height: 100%;
    background: red 0% 0% no-repeat padding-box;
    border-radius: 2px;
    color: white;
    margin-left: 4px;
}
.addBtnWrap {
    width: auto;
    height: 100%;
}
.addBtn {
    width: 46px;
    height: 100%;
    background: #008BCF 0% 0% no-repeat padding-box;
    border-radius: 2px;
    color: white;
}
.excelBtnWrap {
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 4px;
    .excelBtn {
        width: 100%;
        height: 100%;
        background: #206e44 0% 0% no-repeat padding-box;
        border-radius: 2px;
        color: white;
        padding: 0px 4px 0px 4px;
        // text-align: center;
    }
    .excelTxt {
        width: 250px;
        padding: 5px;
        position: absolute;
        z-index: 1;
        top: 44px;
        background-color: white;
        border-radius: 9px;
        span {
            margin-left: 4px;
        }
    }
}
</style>