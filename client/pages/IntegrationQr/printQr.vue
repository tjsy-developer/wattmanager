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
                    <button class="createSelect" @click="createQR()">선택 QR 생성</button>
                    <button class="createAll">전체 QR 생성</button>
                    <button v-if="isCreated" class="printQr" @click="printQR()">QR 출력</button>
                </div>
                <div class="adjustQR">
                    <span>QR 크기</span>
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
            <div class="col-12 justify-center QRWraps">
                <div v-if="isCreated" v-for="(content, key) in qrCodeImg" :key="key" class="QRWrap">
                    <img clas="safetyQR" :src="content.imgUrl" id="image" :style="{width:Width+'px',height:Height+'px', zindex:'1px'}" />
                    <span>{{ content.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import QRCode from "qrcode"
export default {
    layout: "main",
    data() {
        return {
            qrCodeImg: [],
            qrWidth: 4,
            qrHeight: 4,
            Width: 151,
            Height: 151,
            isCreated: false
        }
    },
    methods: {
        goBackBtnClick() {
            window.location.href = document.referrer
        },
        // createQR(enterQRInfo, enterQRName) {
        //     /* QR option */
        //     const opts = {
        //         errorCorrectionLevel: "H",
        //         type: "image/png",
        //         quality: 0.3,
        //         margin: 1,
        //         color: {
        //         dark: "#000000",
        //         light: "#ffffff"
        //         }
        //     }

        //     QRCode.create(enterQRInfo, opts)
        //     const imgUrl = QRCode.toDataURL(enterQRInfo, opts)

        //     /* prototype promise */
        //     imgUrl.then(value => {
        //         const arr = {}
        //         arr.name = enterQRName
        //         arr.imgUrl = value
        //         this.qrCodeImg.push(arr)
        //     })
        // this.isCreated = true
        // },
        createQR() {
            const enterQRInfo = '{"name":"test", "value":"tes1"}'
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
                arr.name = "testtest"
                arr.imgUrl = value
                this.qrCodeImg.push(arr)
            })
            console.log(this.qrCodeImg, "====")
            this.isCreated = true
        },
        printQR() {
            const qrPrint = document.getElementsByClassName("QRWraps")[0]
                .innerHTML
            console.log(qrPrint)
            const win = window.open()
            win.document.open()
            win.document.write(
                "<html><head><title></title><style>" +
                "div:nth-child(0){" +
                "width: 100%;" +
                "}" +
                ".QRWrap {" +
                "display: inline-block;" +
                "padding: 10px 10px 10px;" +
                "}" +
                ".QRWrap>img {" +
                "display: block;" +
                "}" +
                ".QRWrap>span {" +
                "display: block;" +
                "text-align: center;" +
                "}" +
                "</style></haed><div>"
            )
            win.document.write(qrPrint)
            // win.document.write('body, td {font-falmily: Verdana; font-size: 10pt;}');
            win.document.write("</div><body>")
            win.document.write("</body></html>")
            win.document.close()
            win.print()
        },
        QRresizeBtnClick(event) {
            const changeProperty = event.target.name
            console.log(changeProperty, "1111")

            // a4사이즈 기준으로 최댓값 지정
            if (event.target.value > 21) {
                alert(this.$t("QRMaxValue"))
                event.target.value = 21
            }

            if (changeProperty === "W") {
                this.qrWidth = event.target.value
                this.Width = this.conversion(event.target.value)
                this.Height = this.conversion(this.qrHeight)
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
        display: grid;
        flex-direction: row;
        padding: 24px 24px 0px 24px;
        >img{
            margin-bottom: 2px;}
        >span{
            text-align: center;
            font-size: 18px;}
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