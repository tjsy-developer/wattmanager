<template>
    <div class="qrMain">
        <div class="qrMain__header">
            <span>{{ $t("integrationQr")[0] }}</span>
        </div>
        <div class="qrMain__search">
            <div class="searchText">{{ $t("integrationQr")[1] }}</div>
            <input class="searchInput" v-model="chapterName" @keyup.enter="getChapterList()" />
            <button class="searchBtn" @click="getChapterList()">{{ $t("searchBarComp")[4] }}</button>
        </div>
        <div class="qrMain__subHeader">
            <div class="create">
                <span class="createTitle">{{ $t("integrationQr")[2] }}</span>
            </div>
        </div>
        <div class="qrMain__body">
            <div class="qrTable">
                <div class="qrTable__header">
                    <span class="tableHeaderText">{{ $t("integrationQr")[1] }}</span>
                    <span class="tableHeaderText">{{ $t("integrationQr")[3] }}</span>
                    <span class="tableHeaderText">{{ $t("integrationQr")[4] }}</span>
                    <span class="tableHeaderText">{{ $t("integrationQr")[5] }}</span>
                    <span class="tableHeaderText">{{ $t("integrationQr")[6] }}</span>
                </div>
                <div class="qrTable__body" v-for="(content, index) in chapterList" :key="index" style="margin-top: 10px">
                    <span class="tableBodyText">{{ content.chapter_name }}</span>
                    <span class="tableBodyText">{{ content.qr_count }}</span>
                    <div class="tableBodyDiv">
                        <button class="tableBtn" @click="createAndEditUsage(content.chapter_seq)">{{ $t("integrationQr")[4] }}</button>
                    </div>
                    <div class="tableBodyDiv">
                        <button class="tableBtn" @click="createAndEditQr(content.chapter_seq)">{{ $t("integrationQr")[7] }}</button>
                    </div>
                    <div class="tableBodyDiv">
                        <button class="tableBtn" @click="printQr(content.chapter_seq)">{{ $t("integrationQr")[6] }}</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="qrMain__footer">
            <div class="btnWrap">
                <button class="createBtn" @click="createAndEditUsage()">+ {{ $t("integrationQr")[8] }}</button>
            </div>
        </div>
        <!-- <pagination class="col-12" :compData="test"></pagination> -->
    </div>
</template>

<script>
import axiosJson from "@/assets/jsons/axios"
export default {
    layout: "main",
    data() {
        return {
            chapterList:[],
            chapterName: ""
        }
    },
    mounted() {
        this.getChapterList()
    },
    methods: {
        getChapterList() {
            this.chapterList = []
            this.$axios
                .post(process.env.backendURL + axiosJson.qrManagement.searchQR, {
                    jwt: sessionStorage.getItem("jwt"),
                    chapter_name: this.chapterName
                })
                .then((res) => {
                    const data = res.data.data.chapter_list
                    data.forEach((ele, index) => {
                        const fileInfo = {
                            chapter_seq: ele.chapter_seq,
                            chapter_name: ele.chapter_name,
                            qr_count: ele.qr_count
                        }
                        this.chapterList.push(fileInfo)
                    })
                    console.log(this.chapterList)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        createAndEditUsage(seq) {
            window.location.href = "/integrationQr/createAndEditUsage"
            sessionStorage.setItem("chapter_seq", seq)
        },
        createAndEditQr(seq) {
            window.location.href = "/integrationQr/createAndEditQr"
            sessionStorage.setItem("chapter_seq", seq)
        },
        printQr(seq) {
            window.location.href = "/integrationQr/printQr"
            sessionStorage.setItem("chapter_seq", seq)
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