<template>
    <div class="modal-codec">
        <div class="modal-codec_content" v-if="codecStep == 0">
            <p> {{ $t("codecChange")[0] }} </p>
            <div>
                <input type="text" class="file-name" name="" id="">
                <input type="file" id="files" refs="file" accept=".mp4" @change="changeSelectFile">
                <label for="files" class="buttons buttons--grey" > {{ $t("codecChange")[1] }}</label>
            </div>
            <button class="buttons buttons--green" @click="videoEncoding">{{ $t("codecChange")[2] }}</button>
        </div>
        <div class="modal-codec_content" v-else-if="codecStep == 1">
            <p>{{ $t("codecChange")[3] }}</p>
            <p>{{ $t("codecChange")[4] }}</p>
            <img src="@/assets/images/animation.gif" alt="">
        </div>
        <div class="modal-codec_content" v-else-if="codecStep == 2">
            <p>{{ $t("codecChange")[5] }}</p>
            <button class="buttons buttons--green" @click="closeTab">{{ $t("codecChange")[6] }}</button>
        </div>
    </div>
</template>
<script>
import domain from "@/assets/jsons/domain/domain"
const baseUrl = domain.powermemo
export default {
    props: ["modalStep"],
    data() {
        return {
            file: undefined,
            codecStep: 0,
            encodingURL: baseUrl + "/PowerMemo/Encoding/"
        }
    },
    methods: {
        changeSelectFile(e) {
            console.log(e)
            if (e.target.files[0]) {
                e.target.previousSibling.previousElementSibling.value = e.target.files[0].name
                this.file = e.target.files[0]
            }
        },
        videoEncoding() {
            const formData = new FormData()
            // 로그인한 사용자의 토큰 정보를 formData에 넣는다
            formData.append("jwt", localStorage.getItem("jwt"))
            // 파워매니저에서 업로드 했다라고 구분
            formData.append("upload_file", this.file)
            // 메모 저장 위치
            formData.append("save_folder", domain.powermemoSavefolder)
            // FormData의 값 확인
            // for (const pair of formData.entries()) {
            //     console.log(pair[0], ", ", pair[1])
            // }
            
            this.codecStep = 1
            this.$axios
			.post(domain.domain.backend1 + "fileupload/video_encoding", formData, {
				headers: {
					"Content-Type": "multipart/form-data; charset=UTF-8;",
					"jwt": localStorage.getItem("jwt")
				}
			})
            .then((res)=> {
                console.log(res)
                if(res.data.RESULT == "1000") {
                    this.codecStep = 2
                    this.download(this.encodingURL, res.data.FILE_NAME)
                } else {
                    alert("video Codec Encoding error", res.data.RESULT)
                }
            })
            .catch((err)=> {
                console.log(err)
                alert("video Codec Encoding error")
            })
        },
        // 코덱 변경 완료시 파일 자동 다운로드
        download(fileLocation, fileName) {
            const getDataUrl = fileLocation + fileName
            const link = document.createElement("a")

            link.style.display = "none"
            link.href = getDataUrl
            link.download = fileName

            document.body.appendChild(link)
            link.click()
            setTimeout(() => {
                document.body.removeChild(link)
                window.URL.revokeObjectURL(getDataUrl)
            })
        },
        cancleBtnClick() {
            this.$modal.hide("codecCheckModal")
        },
        // 코덱 변경하기 버튼 클릭 시
        codecConversion() {
            window.open("/popup/codec-conversion", "", "width= 400, height= 320, status=no, toolbar=no, scrollbars=no;")
        },
        closeTab() {
            window.close()
        }
    },
    mounted() {
        console.log(this.modalStep)
    }
}
</script>
<style scoped lang="sass">
input::file-selector-button, #files
    display: none

.modal-codec
    font-size: 15px
    width: inherit
    height: inherit
    &_content
        background-color: #eff0f1
        width: inherit
        height: inherit
        display: flex
        justify-content: center
        align-items: center
        flex-direction: column
        font-weight: bold
        > p:first-child
            margin-top: 20px
        >img
            width: 40px
            margin-top: 10px
    &_link
        text-decoration: underline
        color: #0000ffd9
        margin-bottom: 15px

.file-name
    padding: 5px
    border-radius: 3px
    margin-right: 6px
    width: 45vw
    font-size: 14px
    max-width: 240px

.buttons
    border-radius: 6px
    color: white
    &--green
        background-color: #1dbfa4
        padding: 5px 15px
        margin-top: 30px
        &:hover
            background-color: #26a69a
    &--grey
        background-color: #9e9e9e
        padding: 5px 12px
        font-size: 13px
        &:hover
            background: #707070

</style>