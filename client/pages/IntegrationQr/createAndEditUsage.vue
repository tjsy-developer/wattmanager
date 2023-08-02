<template>
    <div class="mainWrap">
        <div class="mainWrap__header">
            <span>{{ $t("createAneEditUsage")[0] }}</span>
        </div>
        <div class="content">
            <div class="content__header">
                <span>{{ $t("createAneEditUsage")[1] }}</span>
            </div>
            <div class="divisionLine"></div>
            <div class="usageName">
                <span>{{ $t("createAneEditUsage")[2] }}</span>
                <input class="usageInput" :placeholder="$t('createAneEditUsage')[3]" v-model="usageName" />
            </div>
            <div class="divisionLine" style="margin-bottom: 5px"></div>
            <div class="qrkey">
                <div class="qrkey__header">
                    <span>{{ $t("createAneEditUsage")[4] }}</span>
                </div>
                <div class="qrkey__body">
                    <div class="keyInput" v-for="(qrKeyInfo, index) in qrKeyData" :key="index">
                        <div class="inputWrap">
                            <span>{{ $t("createAneEditUsage")[5] }}</span>
                            <input v-model="qrKeyInfo.key_value" />
                        </div>
                        <div class="inputWrap">
                            <span>{{ $t("createAneEditUsage")[6] }}</span>
                            <select class="selectBox" v-model="qrKeyInfo.key_type">
                                <option value="" disabled selected>{{ $t("createAneEditUsage")[7] }}</option>
                                <option value="String">String</option>
                                <option value="Int">Int</option>
                                <option value="Boolean">Boolean</option>
                                <!-- <option value="File">File</option> -->
                            </select>
                        </div>
                        <div class="inputWrap">
                            <span>{{ $t("createAneEditUsage")[8] }}</span>
                            <input v-model="qrKeyInfo.key_description" @change="changeSelectOption()" />
                        </div>
                        <button class="deleteRowBtn" @click="deleteRow(index)">
                            <img src="@/assets/images/ic_trash_red.svg" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="divisionLine"></div>
            <div class="qrName">
                <span>{{ $t("createAneEditUsage")[9] }}</span>
                <select class="qrName__input" v-model="selectQrName">
                    <option value="" disabled selected>{{ $t("createAneEditUsage")[7] }}</option>
                    <option v-for="(text, index) in qrTitle" :key="index" :value="text">{{ text }}</option>
                </select>
            </div>
            <div class="divisionLine"></div>
            <div class="content__footer">
                <div class="btnWrap">
                    <button class="saveBtn" @click="saveUsage()">{{ $t("createAneEditUsage")[10] }}</button>
                    <button class="cancleBtn" @click="cancleBtnClick()">{{ $t("createAneEditUsage")[11] }}</button>
                    <button class="deleteBtn" @click="deleteUsage()">{{ $t("createAneEditUsage")[12] }}</button>
                </div>
                <button class="addBtn" @click="addRow()">{{ $t("createAneEditUsage")[13] }}</button>
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
            usageName: "",
            selectQrName: "",
            qrKeyData: [],
            qrTitle: [],
            chapter_seq: "",
            keyType: "",
            usageCrud: "create"
        }
    },
    mounted() {
        this.chapter_seq = Number(localStorage.getItem("chapter_seq"))
        localStorage.removeItem("chapter_seq")
        this.getusageInfo()
    },
    methods: {
        getusageInfo() {
            this.$axios
                .post(process.env.backendURL + axiosJson.qrManagement.chapterInfo, {
                    jwt: localStorage.getItem("jwt"),
                    chapter_seq: this.chapter_seq
                })
                .then((res) => {
                    const data= res.data.data.chapter_list
                    console.log(data)
                    this.usageCrud = "update"
                    this.usageName = data.chapter_name
                    this.selectQrName = data.qr_title
                    data.key_list.forEach((ele) => {
                        const fileInfo = {
                            crud: "update",
                            key_seq: ele.key_seq,
                            key_value: ele.key_value,
                            key_type: ele.key_type,
                            key_description: ele.key_description
                        }
                        this.qrKeyData.push(fileInfo)
                        this.changeSelectOption()
                    })
                    if (this.qrKeyData.length < 1) {
                        this.addRow()
                    }
                })
                .catch((err) => {
                    console.log("chapterInfo load err => ", err)
                    if (this.qrKeyData.length < 1) {
                        this.addRow()
                    }
                })
        },
        saveUsage() {
            const keyParams =  new Array()
            let checkNull = false
            this.qrKeyData.forEach((ele) => {
                if (!ele.key_value || !ele.key_type || !ele.key_description) {
                    checkNull = true
                }
                const paramsInfo = {
                    crud: ele.crud,
                    key_seq: ele.key_seq,
                    key_value: ele.key_value,
                    key_type: ele.key_type,
                    key_description: ele.key_description
                }
                console.log(ele.crud)
                keyParams.push(paramsInfo)
            })
            if (checkNull) {
                return alert(this.$t("qrMessage")[7])
            }
            this.$axios
                .post(process.env.backendURL + axiosJson.qrManagement.chapterSave, {
                    jwt: localStorage.getItem("jwt"),
                    crud: this.usageCrud,
                    chapter_seq: this.chapter_seq,
                    chapter_name: this.usageName,
                    qr_title: this.selectQrName,
                    key_list: keyParams
                })
                .then((res) => {
                    if (res.data.resultCode == 1000) {
                        alert(this.$t("qrMessage")[0])
                        this.cancleBtnClick()
                    }
                })
                .catch((err) => {
                    console.log("chapterSave fail =>", err)
                    alert(this.$t("qrMessage")[1])
                })
        },
        addRow() {
            let qrData = {}
            qrData = {
                crud: "create",
                key_value: "",
                key_type: "",
                key_description: "",
                key_seq: ""
            }
            this.qrKeyData.push(qrData)
        },
        deleteRow(index) {
            const result = confirm(this.$t("qrMessage")[2])
            if (result != true) return
            if (this.qrKeyData[index].key_crud != "create") {
                const keySeq = this.qrKeyData[index].key_seq
                this.$axios
                .post(process.env.backendURL + axiosJson.qrManagement.qrKeyDelete, {
                    jwt: localStorage.getItem("jwt"),
                    key_seq: keySeq
                })
                .then((res) => {
                    if (res.data.resultCode == 1000) {
                        alert(this.$t("qrMessage")[3])
                        this.qrKeyData.splice(index, 1)
                        this.changeSelectOption()
                        if (this.qrKeyData.length == 0) {
                            this.addRow()
                        }
                    }
                })
                .catch((err) => {
                    alert(this.$t("qrMessage")[4])
                    console.log("qrKeyDelete Fail => ", err)
                })
            } else {
                this.qrKeyData.splice(index, 1)
                this.changeSelectOption()
                if (this.qrKeyData.length == 0) {
                    this.addRow()
                }
                alert(this.$t("qrMessage")[3])
            }
        },
        deleteUsage() {
            const result = confirm(this.$t("qrMessage")[2])
            if (result != true) return
            this.$axios
                .post(process.env.backendURL + axiosJson.qrManagement.chapterSave, {
                    jwt: localStorage.getItem("jwt"),
                    crud: "delete",
                    chapter_seq: this.chapter_seq
                })
                .then((res) => {
                    console.log(res)
                    alert(this.$t("qrMessage")[3])
                    window.location.href = document.referrer
                })
                .catch((err) => {
                    console.log("delete Usage Fail => ", err)
                    alert(this.$t("qrMessage")[4])
                })
        },
        changeSelectOption() {
            this.qrTitle= []
            this.qrKeyData.forEach((ele, index) => {
                if (ele.key_description != "") {
                    this.qrTitle.push(ele.key_description)
                }
            })
        },
        cancleBtnClick() {
            window.location.href = document.referrer
        },
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
    &__footer {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
        .btnWrap {
            width: 350px;
            height: 100%;
            font: normal normal bold 14px/18px NanumSquare;
        }
    }
}
.divisionLine {
    width: 100%;
    height: 0px;
    border: 1px solid #D9D9D9;
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
        text-align: left;
    }
}
.qrkey {
    font: normal normal normal 14px/16px NanumSquare;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &__header {
        width: 100px;
        height: 63px;
        display: flex;
        align-items: center;
        margin-left: 20px
    }
    &__body {
        width: calc(100% - 100px);
        min-height: 63px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .keyInput {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 5px;
        }
        .inputWrap {
            width: calc(100% / 3 - 30px);
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                margin-right: 14px
            }
            input {
                width: 180px;
                height: 38px;
                background: white;
                outline: 1px solid #D9D9D9;
                text-align: center
            }
            .selectBox {
                width: 180px;
                height: 38px;
                background: white;
                outline: 1px solid #D9D9D9;
                text-align: center
            }
        }
        .deleteBtn {
            width: 30px;
            height: 30px;
        }
    }
}
.qrName {
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
    &__input {
        width: calc(100% - 100px);
        height: 38px;
        background: white;
        outline: 1px solid #D9D9D9;
        text-align: center;
    }
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
.deleteBtn {
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

.deleteRowBtn {
    width: 30px;
    height: 30px;
    img {
        width: 20px;
        height: 20px;
    }
}
</style>