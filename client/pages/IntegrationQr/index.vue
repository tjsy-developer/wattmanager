<template>
    <div class="qrMain">
        <div class="qrMain__header">
            <span>QR 관리</span>
        </div>
        <div class="qrMain__search">
            <div class="searchText">사용처</div>
            <input class="searchInput" />
            <img v-if="inputVal!=undefined" class="searchDeleteBtn" src="@/assets/images/bt_input_delete.png" @click="deleteBtn" :alt="$t('searchBarComp')[7]" />
            <button class="searchBtn" @click="searchBtnClick">{{ $t("searchBarComp")[4] }}</button>
        </div>
        <div class="qrMain__subHeader">
            <div class="create">
                <span class="createTitle">QR 목록</span>
            </div>
        </div>
        <div class="qrMain__body">
            <div class="qrTable">
                <div class="qrTable__header">
                    <span class="tableHeaderText">사용처</span>
                    <span class="tableHeaderText">QR 등록 갯수</span>
                    <span class="tableHeaderText">키 수정</span>
                    <span class="tableHeaderText">QR 등록</span>
                    <span class="tableHeaderText">QR 출력</span>
                </div>
                <!-- v-for 돌려야함 -->
                <div class="qrTable__body" style="margin-top: 10px">
                    <span class="tableBodyText">LG전자 테네시</span>
                    <span class="tableBodyText">48</span>
                    <div class="tableBodyDiv">
                        <button class="tableBtn" @click="createAndEditUsage()">키 수정</button>
                    </div>
                    <div class="tableBodyDiv">
                        <button class="tableBtn" @click="createAndEditQr()">QR 등록/수정</button>
                    </div>
                    <div class="tableBodyDiv">
                        <button class="tableBtn" @click="printQr()">QR 출력</button>
                    </div>
                </div>
                <div class="qrTable__body">
                    <span class="tableBodyText">LG전자 테네시1</span>
                    <span class="tableBodyText">48</span>
                    <div class="tableBodyDiv">
                        <button class="tableBtn">키 수정</button>
                    </div>
                    <div class="tableBodyDiv">
                        <button class="tableBtn">QR 등록/수정</button>
                    </div>
                    <div class="tableBodyDiv">
                        <button class="tableBtn">QR 출력</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="qrMain__footer">
            <div class="btnWrap">
                <button class="createBtn" @click="createAndEditUsage()">+ 사용처 신규 등록</button>
            </div>
        </div>
        <!-- <pagination class="col-12" :compData="test"></pagination> -->
    </div>
</template>

<script>
export default {
    layout: "main",
    data() {
        return {
        }
    },
    methods: {
        createAndEditUsage() {
            window.location.href = "/integrationQr/createAndEditUsage"
        },
        createAndEditQr() {
            window.location.href = "/integrationQr/createAndEditQr"
        },
        printQr() {
            window.location.href = "/integrationQr/printQr"
        }
    }
}
</script>

<style lang="scss" scoped>
.qrMain {
    width: 100%;
	min-width: 1260px;
	min-height: calc(100% - 84px);
	background-color: #EFF0F1;
    &__header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        font-size: 24px;
        font-weight: 800;
        color: black;
        span {
            width: 1260px;
	        padding: 29px 0 23px;
        }

    }
    &__subHeader {
        width: 100%;
        height: 88px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        .create {
            width: 1260px;
            height: 44px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .createTitle {
            height: 41px;
            font-size: 22px;
            font-weight: 800;
        }
    }
    &__body{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__search{
        width: 100%;
        padding: 25px 0;
	    background: transparent linear-gradient(180deg, #0061D1 0%, #23A3DC 100%) 0% 0% no-repeat padding-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__footer {
        width: 100%;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        .btnWrap {
            width: 1260px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            
        .createBtn {
            padding: 7px;
            font-size: 14px;
            font-weight: bold;
            color: white;
            background: #1DBFA4 0% 0% no-repeat padding-box;
            margin-left: 16px;
            border-radius: 2px;
        }
        }
    }
}
.qrTable {
    width: 1260px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &__header {
        width: 100%;
        height: 55px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        background: #4173AC;
        padding: 16px 0 13px;
        margin-top: 10px;
        color: white;
        .tableHeaderText {
            width: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    &__body {
        width: 100%;
        height: 55px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        padding: 16px 0 13px;
        margin-top: 10px;
        background: white;
	    padding: 25px 0;
        margin-top: 4px;
        .tableBodyText {
            width: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tableBodyDiv {
            width: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tableBtn {
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            background: #4173AC;
            border-radius: 4px;
            padding: 7px
        }
    }
}
.searchText {
    font-size: 18px;
	font-weight: bold;
	color: white;
    min-width: 50px;
}
.searchInput {
    width: 1073px;
    padding: 10px;
	background: white;
	height: 38px;
	margin-left: 25px;
	border-radius: 2px;
	outline: none;
	font-size: 15px;
	font-weight: 600;
}
.searchDeleteBtn {
    position: absolute;
	right: 125px;
	cursor: pointer;
    &:hover{
        border-radius: 5px;
		border: 1px solid grey;
    }
}
.searchBtn {
    width: 98px !important;
	height: 38px;
	font-size: 14px;
	font-weight: bold;
	color: white;
	background: #1DBFA4 0% 0% no-repeat padding-box;
	margin-left: 16px;
	border-radius: 2px;
}
</style>