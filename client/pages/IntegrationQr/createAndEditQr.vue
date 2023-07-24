<template>
    <div class="mainWrap">
        <div class="mainWrap__header">
            <span>안전 QR</span>
        </div>
        <div class="content">
            <div class="content__header">
                <span>QR 등록 / 수정</span>
            </div>
            <div class="divisionLine"></div>
            <div class="usageName">
                <span>사용처:</span>
                <input class="usageInput" placeholder="test" disabled />
            </div>
            <div class="divisionLine"></div>
            <div class="content__main">
                <div class="subject">
                    <span>값 등록</span>
                </div>
                <div class="qrTable">
                    <div class="qrTable__header">
                        <div class="checkboxWrap">
                            <input type="checkbox" v-model="checkAll" />
                        </div>
                        <div class="qrkeyTxt">
                            <span>pac-팩이름</span>
                        </div>
                    </div>
                    <div class="qrTable__body">
                        <div class="qrInputForm">
                            <div class="checkboxWrap">
                                <input type="checkbox" v-model="checkEach" />
                            </div>
                            <div class="inputWrap">
                                <input />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="divisionLine"></div>
            <div class="content__footer">
                <div class="btnWrap">
                    <button class="saveBtn">저장</button>
                    <button class="cancleBtn" @click="cancleBtnClick()">취소</button>
                </div>
                <button class="addBtn">추가</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    layout: "main",
    data() {
        return {
            checkAll: false,
            checkEach: false,
            qrValue: []
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
                this.checkEach = true
            } else {
                this.checkEach = false
            }
        }
    },
    methods: {
        cancleBtnClick() {
            window.location.href = document.referrer
        },
        addRow() {
            
            // qrValue.push()
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
        .btnWrap {
            width: 210px;
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
    &__header {
        width: 100%;
        height: 47px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #4173AC 0% 0% no-repeat padding-box;
        color: white;
        .checkboxWrap {
            width: 120px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .qrkeyTxt {
            width: calc(100% - 120px);
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    &__body {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        .qrInputForm {
            width: 100%;
            height: 68px;
            margin-top: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            background:  #FFFFFF 0% 0% no-repeat padding-box;
            .checkboxWrap {
                width: 120px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .inputWrap {
                width: calc(100% - 120px);
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                input {
                    width: 90%;
                    height: 85%;
                    min-width: 360px;
                    border: 1px solid #D9D9D9;
                }
            }
        }
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