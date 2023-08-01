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
                        <div class="checkboxWrapBlue">
                            <input type="checkbox" v-model="checkAll" />
                        </div>
                        <div class="keyTxtWrap">
                            <div class="col keyTxt"  v-for="(content, key) in keyList">
                                <span>{{ content.key_txt }}</span>
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
                            <div class="checkboxWrap">
                                <input type="checkbox" v-model="content.checked_yn" />
                            </div>
                            <div class="qrInput">
                                <div class="col inputWrap" v-for="(qrContent, index) in content.qr_data" :key="index">
                                    <input v-if="keyList[index].key_type == 'Boolean'" type="checkbox" v-model="dataList[key].qr_data[index]" style="outline: none; width: 30px; height: 30px;" />
                                    <input v-else :value="qrContent" @change="changeInput(key, index, $event)" />
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
                    <button class="deleteAllBtn" @click="deleteQR()">삭제</button>
                </div>
                <button class="addBtn" @click="addRow(5)">{{ $t("createAndEditQr")[6] }}</button>
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
        }
    },
    computed: {
        watchCheckAll() {
            return this.checkAll
        }
    },
    watch: {
        watchCheckAll() {
            if (this.checkAll == true) {
                this.dataList.forEach((ele) => {
                    ele.checked_yn = true
                })
            } else {
                this.dataList.forEach((ele) => {
                    ele.checked_yn = false
                })
            }
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
                        keyData.forEach((ele) => {
                            let keyTxt = ele.key_value + "-" + ele.key_description + " (" + ele.key_type + ")"
                            const keyInfo = {
                                key_seq: ele.key_seq,
                                key_value: ele.key_value,
                                key_type: ele.key_type,
                                key_description: ele.key_description,
                                key_txt: keyTxt,
                            }
                            this.keyList.push(keyInfo)
                        })
                        if (qrData != null) {
                            qrData.forEach((ele, index) => {
                                let checkYN
                                if (ele.checked_yn == 0) {
                                    checkYN = false
                                } else {
                                    checkYN = true
                                }
                                const qrData = JSON.parse(ele.qr_data)
                                const qrValue = []
                                this.keyList.forEach((element, i) => {
                                    qrValue.push(qrData[element.key_seq])
                                })
                                const qrInfo = {
                                    crud: "update",
                                    data_seq: ele.data_seq,
                                    checked_yn: checkYN,
                                    qr_data: qrValue
                                }
                                this.dataList.push(qrInfo)
                            })
                        } else {
                            const qrValue = []
                            this.keyList.forEach((ele) => {
                                qrValue.push("")
                            })
                            const dataInit = {
                                crud: "create",
                                checked_yn: false,
                                qr_data: qrValue
                            }
                            this.dataList.push(dataInit)
                        }   
                    } else {
                        alert(this.$t("qrMessage")[5])
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
            if (event.target.value) {
                if (this.keyList[qrIndex].key_type == "Int") {
                    if (!Number(event.target.value)) {
                        alert(this.$t("qrMessage")[6])
                        event.target.value = ""
                    }
                    else {
                        this.dataList[titleIndex].qr_data[qrIndex] = event.target.value
                    }
                } else {
                    this.dataList[titleIndex].qr_data[qrIndex] = event.target.value
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
                ele.qr_data.forEach((element, index) => {
                    const keySeq = String(this.keyList[index].key_seq)
                    let inputForm
                    if (this.keyList[index].key_type == "Boolean") {
                        if (element == undefined || element == "") {
                            element = false
                        }
                    } else {
                        if (element == undefined || element == "") {
                            return checkNull = true
                        }
                    }
                    inputForm = JSON.stringify(keySeq) + ":" + JSON.stringify(element)
                    qrInput.push(inputForm)
                })
                if (ele.checked_yn == true) {
                    ele.checked_yn = 1
                } else {
                    ele.checked_yn = 0
                }
                const qrInfo = {
                    crud: ele.crud,
                    data_seq: ele.data_seq,
                    checked_yn: ele.checked_yn,
                    chapter_seq: this.chapter_seq,
                    qr_data: `{${qrInput.join(',')}}`

                }
                qrParams.push(qrInfo)
            })
            if (checkNull) {
                return alert(this.$t("qrMessage")[7])
            }
            this.$axios
                .post(this.backendURL + axiosJson.qrManagement.qrSave, {
                    jwt: this.jwt,
                    data_list: qrParams
                })
                .then((res) => {
                    alert(this.$t("qrMessage")[0])
                    console.log(res)
                })
                .catch((err) => {
                    console.log("qrSave error => ", err)
                })
        },
        addRow(count) {
            for (let iLoop = 0; iLoop < count; ++iLoop) {
                const qrSetting = []
                this.keyList.forEach((ele) => {
                    qrSetting.push("")
                })
                const dataParams = {
                    crud: "create",
                    data_seq: "",
                    checked_yn: false,
                    chapter_seq: this.chapter_seq,
                    qr_data: qrSetting
                }
                this.dataList.push(dataParams)
            }
        },
        deletRow(seq, crud, index) {
            const result = confirm(this.$t("qrMessage")[2])
            if (result != true) return
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
        deleteQR() {
            const result = confirm(this.$t("qrMessage")[2])
            if (result != true) return
            console.log(this.chapter_seq)
            this.$axios
                .post(this.backendURL + axiosJson.qrManagement.qrAllDataDelete, {
                    jwt: this.jwt,
                    chapter_seq: this.chapter_seq
                })
                .then((res) => {
                    console.log(res)
                    this.cancleBtnClick()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
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
    width: calc(100% - 170px);
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
        width: calc(100% - 170px);
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
.addBtn {
    width: 46px;
    height: 100%;
    background: #1DBFA4 0% 0% no-repeat padding-box;
    border-radius: 2px;
    color: white;
}
</style>