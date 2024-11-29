<template>
    <div class="mainWrap">
        <div class="mainWrap__header">
            <span>{{ $t("printQR")[0] }}</span>
        </div>
        <div class="content">
            <div class="content__header">
                <span>{{ $t("printQR")[1] }}</span>
                <button class="goBackBtn" @click="goBackBtnClick()">{{ $t("printQR")[2] }}</button>
            </div>
            <div class="divisionLine"></div>
            <div class="content__btnWrap">
                <div class="printBtns">
                    <button v-if="selectedList.length == 0" class="printQr" @click="printQR(0)">{{ $t("printQR")[4] }}</button>
                    <button v-else class="printQr" @click="printQR(1)">{{ $t("printQR")[5] }}</button>
                </div>
                <div class="adjustQR">
                    <span>{{ $t("printQR")[6] }}</span>
                    <div class="widthWrap">
                        <span>W:</span>
                        <input v-model="qrWidth" name="W" @keyup="QRresizeBtnClick($event)" />
                    </div>
                    <div class="heightWrap">
                        <span> X H:</span>
                        <input v-model="qrHeight" name="H" @keyup="QRresizeBtnClick($event)" />
                        <span>(cm)</span>
                    </div>
                </div>
            </div>
            <div class="divisionLine"></div>
            <div class="col-12 justify-center QRWraps" v-if="isCreated">
                <div v-for="(content, key) in qrCodeImg" :key="key" class="col-12 QRWrap" style="display: grid; justify-items: center;">
                    <img class="safetyQR" :src="content.imgUrl" id="image" :style="{width:Width+'px',height:Height+'px', zindex:'1px'}" style="margin-bottom: 2px;" />
                    <span :style="{fontSize: fontSize}" style="text-align: center;">{{ content.name }}</span>
                    <input type="checkbox" v-model="content.checkYN" @change="changeState()" />
                </div>
            </div>
            <div class="printWrap">
                <!-- 전체 qr 출력을 위한 코드. -->
                <div class="col-12 justify-center printAll" id="printAll" v-if="isCreated">
                    <div  v-for="(content, key) in qrCodeImg" :key="key" class="col-12 PrintQRWrap" style="display: inline-block; padding: 24px 24px 24px 24px;">
                        <img class="safetyQR" :src="content.imgUrl" id="image" :style="{width:Width+'px',height:Height+'px', zindex:'1px'}" style="display: block; margin-bottom: 2px;" />
                        <span :style="{fontSize: fontSize}" style="display: block; text-align: center;">{{ content.name }}</span>
                    </div>
                </div>
                <!-- 선택 qr 출력을 위한 코드. 화면상 보여지지 않음 -->
                <div class="col-12 justify-center printSelected" id="printSelected" v-if="isCreated">
                    <div  v-for="(content, key) in selectedList" :key="key" class="col-12 PrintQRWrap" style="display: inline-block; padding: 24px 24px 24px 24px;">
                        <img class="safetyQR" :src="content.imgUrl" id="image" :style="{width:Width+'px',height:Height+'px', zindex:'1px'}" style="display: block; margin-bottom: 2px;" />
                        <span :style="{fontSize: fontSize}" style="display: block; text-align: center;">{{ content.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axiosJson from "@/assets/jsons/axios";
import printJS from "print-js";
import QRCode from "qrcode";
import { axiosRequest } from "@/plugins/axiosRequest";
export default {
    layout: "main",
    data() {
        return {
            qrCodeImg: [],
            qrWidth: 4,
            qrHeight: 4,
            Width: 151,
            Height: 151,
            isCreated: false,
            qrTitleSeq: "",
            qrList: [],
            checkNull: false,
            fontSize: "18px",
            test: false,
            checkSelected: false,
            selectedList: []
        }
    },
    mounted() {
        this.chapter_seq = sessionStorage.getItem("chapter_seq")
        this.backendURL = process.env.backendURL
        this.jwt = sessionStorage.getItem("jwt"),
        this.getKeyData()
    },
    methods: {
        async getKeyData() {
            const params = {
                data: {
                    jwt: this.jwt,
                    chapter_seq: this.chapter_seq
                },
                api: this.backendURL + axiosJson.qrManagement.chapterInfo
            }
            await axiosRequest('post', params)
                .then((res) => {
                    const data = res.data.data
                    const qrTitle = data.chapter_list.qr_title
                    data.chapter_list.key_list.forEach((ele) => {
                        if (ele.key_description == qrTitle)
                        {
                            // qr 제목 지정
                            this.qrTitleSeq = ele.key_seq
                        }
                    })
                    this.getQrData()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        async getQrData() {
            const params = {
                data: {
                    jwt: this.jwt,
                    chapter_seq: this.chapter_seq
                },
                api: this.backendURL + axiosJson.qrManagement.qrList
            }
            await axiosRequest('post', params)
                .then((res) => {
                    console.log(res)
                    const data = res.data.data.qr_list
                    // qr data가 존재하지 않는 경우
                    if (data.data_list == undefined){
                        this.checkNull = true
                        return this.operateDialog(this.$t("printQR")[7], "error")
                    }
                    const keyList = []
                    data.key_list.forEach((ele) => {
                        const keyInfo = {
                            key_seq: ele.key_seq,
                            key_value: ele.key_value
                        }
                        // 키 리스 지정
                        keyList.push(keyInfo)
                    })
                    // console.log(data.data_list)
                    data.data_list.forEach((ele) => {
                        const qrData = JSON.parse(ele.qr_data)
                        const qrDetailList = []
                        keyList.forEach((element) => {
                            // qr data = "키값":"qrdata"
                            const qrDetail = JSON.stringify(element.key_value) + ":" + JSON.stringify(qrData[element.key_seq])
                            qrDetailList.push(qrDetail)
                        })
                        const qrInfo = {
                            checked_yn: ele.checked_yn,
                            qr_title: qrData[this.qrTitleSeq],
                            qr_value: `{${qrDetailList.join(',')}}`
                        }
                        this.qrList.push(qrInfo)
                    })
                    console.log(this.qrList)
                    this.createQR()
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        goBackBtnClick() {
            window.location.href = document.referrer
        },
        // 전체 qr 만드는 곳
        createQR() {
            let enterQRInfo
            if (this.checkNull) this.operateDialog(this.$t("printQR")[7], "error")
            this.qrList.forEach((ele) => {
                enterQRInfo = ele.qr_value

                /* QR option */
                const opts = {
                    errorCorrectionLevel: "H",
                    type: "image/png",
                    quality: 0.3,
                    margin: 1,
                    color: {
                    dark: "#000000",
                    light: "#ffffff"
                    }
                }

                QRCode.create(enterQRInfo, opts)
                const imgUrl = QRCode.toDataURL(enterQRInfo, opts)

                /* prototype promise */
                imgUrl.then(value => {
                    const arr = {}
                    arr.name = ele.qr_title
                    arr.imgUrl = value
                    arr.checkYN = false
                    this.qrCodeImg.push(arr)
                })
            })
            if (enterQRInfo == undefined) {
                this.operateDialog(this.$t("printQR")[8], "error")
            } else {
                this.isCreated = true
            }
        },
        changeState() {
            // 선택 qr 지정 부분
            this.selectedList = []
            this.qrCodeImg.forEach((ele) => {
                if (ele.checkYN == true) {
                    let params = {
                        name: ele.name,
                        imgUrl: ele.imgUrl
                    }
                    this.selectedList.push(params)
                }
            })
        },
        printQR(type) {
            // window.print()
            let params

            // 전체 qr 출력
            if (type == 0) {
                params = {
                    printable: "printAll",
                    type: "html",
                    css: "",
                    scanStyles: false,
                }
            } else {
                // 선택 qr 출력
                params = {
                    printable: "printSelected",
                    type: "html",
                    css: "",
                    scanStyles: false,
                }
            }
            console.log(params)
            printJS(params)
        },
        QRresizeBtnClick(event) {
            const changeProperty = event.target.name

            // a4사이즈 기준으로 최댓값 지정
            if (event.target.value > 21) {
                this.operateDialog(this.$t("QRMaxValue"), "error")
                event.target.value = 21
            }

            if (changeProperty === "W") {
                this.qrWidth = event.target.value
                this.Width = this.conversion(event.target.value)
                this.Height = this.conversion(this.qrHeight)
                this.fontSize = event.target.value * 4 + "px"
            } else {
                this.qrHeight = event.target.value
                this.Width = this.conversion(this.qrWidth)
                this.Height = this.conversion(event.target.value)
            }
        },
        /* cm --> px 변환 */
        conversion(value) {
            const conversionVal = value * 37.795275590551
            return conversionVal
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
    margin-bottom: 20px;
    &__header {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: black;
        font: normal normal bold 22px/26px NanumSquare
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
}
.QRWrap {
    display: grid;
    padding: 24px 24px 0px 24px;
    >img{
        margin-bottom: 2px;
    }
    >span{
        text-align: center;
        font-size: 18px;
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
.printWrap {
    width: 100%;
    display: none;
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