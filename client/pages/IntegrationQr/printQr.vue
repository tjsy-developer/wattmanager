<template>
    <div class="mainWrap">
        <div class="mainWrap__header">
            <span>안전 QR</span>
        </div>
        <div class="content">
            <div class="content__header">
                <span>QR 출력</span>
                <button class="goBackBtn" @click="goBackBtnClick()">뒤로가기</button>
            </div>
            <div class="divisionLine"></div>
            <div class="content__btnWrap">
                <div class="printBtns">
                    <button class="printSelect">선택 QR 인쇄</button>
                    <button class="printAll">전체 QR 인쇄</button>
                </div>
                <div class="adjustQR">
                    <span>QR 크기</span>
                    <div class="widthWrap">
                        <span>W:</span>
                        <input />
                    </div>
                    <div class="heightWrap">
                        <span> X H:</span>
                        <input />
                        <span>(cm)</span>
                    </div>
                    <button class="adjustBtn">적용</button>
                </div>
            </div>
            <div class="divisionLine"></div>
            <div class="QRWrap"></div>
        </div>
    </div>
</template>

<script>
export default {
    layout: "main",
    methods: {
        goBackBtnClick() {
            window.location.href = document.referrer
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
        justify-content: space-between;
        align-items: center;
        font-size: 22px;
        color: black;
        font: normal normal bold 22px/26px NanumSquare;
    }
    &__btnWrap {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 7px;
        margin-bottom: 7px;
    }
    .QRWrap {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
}
.goBackBtn {
    font-size: 14px;
    padding: 7px;
    background: #008BCF 0% 0% no-repeat padding-box;
    color: white;
}
.printBtns {
    button{
        margin-right: 8px;
        padding: 7px;
        background: #008BCF 0% 0% no-repeat padding-box;
        color: white;
    }
}
.adjustQR {
    display: flex;
    justify-content: center;
    align-items: center;
    .widthWrap {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 18px;
        margin-right: 8px;
        span {
            font-weight: bold;
        }
        input {
            margin-left: 7px;
            width: 48px;
            height: 38px;
            outline: none;
            background: white;
            text-align: center;
        }
    }
    .heightWrap {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 8px;
        margin-right: 16px;
        span {
            font-weight: bold;
        }
        input {
            margin-left: 7px;
            margin-right: 6px;
            width: 48px;
            height: 38px;
            outline: none;
            background: white;
            text-align: center;
        }
    }
    .adjustBtn {
        width: 60px;
        height: 38px;
        background: #008BCF 0% 0% no-repeat padding-box;
        color: white;
    }
}
</style>