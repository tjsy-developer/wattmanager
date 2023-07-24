<template>
    <div class="mainWrap">
        <div class="mainWrap__header">
            <span>안전 QR</span>
        </div>
        <div class="content">
            <div class="content__header">
                <span>사용처 신규 등록 / 키수정</span>
            </div>
            <div class="divisionLine"></div>
            <div class="usageName">
                <span>사용처:</span>
                <input class="usageInput" placeholder="사용처명을 입력해주세요" v-model="usageName" />
            </div>
            <div class="divisionLine" style="margin-bottom: 5px"></div>
            <div class="qrkey">
                <div class="qrkey__header">
                    <span>QR Key 등록</span>
                </div>
                <div class="qrkey__body">
                    <div class="keyInput" v-for="(qrKeyInfo, index) in qrKeyData" :key="index">
                        <div class="inputWrap">
                            <span>키값</span>
                            <input v-model="qrKeyInfo.value" />
                        </div>
                        <div class="inputWrap">
                            <span>데이터 타입</span>
                            <select class="selectBox" v-model="qrKeyInfo.type">
                                <option value="" disabled selected>선택해 주세요.</option>
                                <option value="string">String</option>
                                <option value="string">Int</option>
                                <option value="string">Boolean</option>
                                <option value="string">File</option>
                            </select>
                        </div>
                        <div class="inputWrap">
                            <span>키 설명</span>
                            <input v-model="qrKeyInfo.description" @change="changeSelectOption()" />
                        </div>
                        <button class="deleteBtn" @click="deleteRow(index)">
                            <span>삭제</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="divisionLine"></div>
            <div class="qrName">
                <span>QR 제목 키 지정</span>
                <select class="qrName__input" v-model="selectQrName">
                    <option value="" disabled selected>선택해주세요</option>
                    <option v-for="(text, key) in qrTitle" :key="key" :value="text">{{ text }}</option>
                </select>
            </div>
            <div class="divisionLine"></div>
            <div class="content__footer">
                <div class="btnWrap">
                    <button class="saveBtn">저장</button>
                    <button class="cancleBtn" @click="cancleBtnClick()">취소</button>
                </div>
                <button class="addBtn" @click="addRow()">추가</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        layout: "main",
        data() {
            return {
                usageName: "",
                selectQrName: "",
                qrKeyData: [],
                qrTitle: []
            }
        },
        mounted() {
            if (this.qrKeyData.length < 1) {
                this.addRow()
            }
        },
        methods: {
            cancleBtnClick() {
                window.location.href = document.referrer
            },
            addRow() {
                let qrData = {}
                qrData = {
                    value: "",
                    type: "",
                    description: ""
                }
                this.qrKeyData.push(qrData)
            },
            deleteRow(index) {
                this.qrKeyData.splice(index, 1)
                this.changeSelectOption()
                if (this.qrKeyData.length == 0) {
                    this.addRow()
                }
            },
            changeSelectOption() {
                this.qrTitle= []
                this.qrKeyData.forEach((ele, index) => {
                    if (ele.description != "") {
                        this.qrTitle.push(ele.description)
                    }
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
            width: 210px;
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
.addBtn {
    width: 46px;
    height: 100%;
    background: #1DBFA4 0% 0% no-repeat padding-box;
    border-radius: 2px;
    color: white;
}
</style>