<template>
    <div class="row content-start policy">
        <div class="col-12 row justify-center">
            <div class="topBlank"></div>
            <div class="main">
                <div class="main__header">
                    <span>개인정보 취급방침</span>
                </div>
                <div class="main__normal">
                    <span>(주)와트(이하 "회사"라고 함)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</span>
                    <span>○ 이 개인정보처리방침은 2023년 7월 1부터 적용됩니다.</span>
                </div>
                <div class="main__gray">
                    <div class="gray-row">
                        <span class="gray-row__text" @click="scrollIntoView(1)">제1조 총칙</span>
                        <span class="gray-row__text" @click="scrollIntoView(2)">제2조 개인정보의 처리 목적</span>
                        <span class="gray-row__text" @click="scrollIntoView(3)">제3조 개인정보의 처리 및 보유 기간</span>
                        <span class="gray-row__text" @click="scrollIntoView(4)">제4조 처리하는 개인정보의 항목</span>
                    </div>
                    <div class="gray-row">
                        <span class="gray-row__text" @click="scrollIntoView(5)">제5조 개인정보의 파기절차 및 파기방법</span>
                        <span class="gray-row__text" @click="scrollIntoView(6)">제6조 개인정보의 취급위탁</span>
                        <span class="gray-row__text" @click="scrollIntoView(7)">제7조 개인정보의 안전성 확보조치에 관한 사항</span>
                        <span class="gray-row__text" @click="scrollIntoView(8)">제8조 개인정보 보호에 관한 사항</span>
                    </div>
                    <div class="gray-row">
                        <span class="gray-row__text" @click="scrollIntoView(9)">제9조 개인정보의 기술적/관리적 보호 대책</span>
                        <span class="gray-row__text1" @click="scrollIntoView(10)">제10조 정보주체와 법정대리인의 권리·의무 및 그 행사방법에 관한 사항</span>
                        <span class="gray-row__text1" @click="scrollIntoView(11)">제11조 개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에 관한 사항</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="1">
                        <span>제1조 총칙</span>
                    </div>
                    <div class="content__normal">
                        <span>① 개인정보란 생존하는 개인에 관한 정보로서 당해 정보에 포함되어 있는 성명, 주민등록번호 등의 사항에 의하여 당해 개인을 알아볼 수 있는 부호,문자,음성,음향 및 영상 등의 정보(당해 정보만으로는 특정 개인을 식별할 수 없더라도 다른 정보와 용이하게 결합하여 식별할 수 있는 것을 포함합니다)를 말합니다.</span>
                        <span>② ㈜와트(이하 "회사")는 이용자의 개인정보보호를 매우 중요시하며, 「개인정보보호법」,「정보통신망 이용 촉진 및 정보보호에 관한 법률」 등 개인정보보호 관련 법률 및 하위 법령들을 준수하고 있습니다.</span>
                        <span>③ 회사는 개인정보취급방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다. 회사는 개인정보취급방침을 홈페이지 첫 화면에 공개함으로써 언제나 용이하게 보실 수 있습니다.</span>
                        <span>④ 회사는 개인정보취급방침의 지속적인 개선을 위하여 개정하는데 필요한 절차를 정하고 있으며, 개인정보취급방침을 회사의 필요와 사회적 변화에 맞게 변경할 수 있습니다.</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="2">
                        <span>제2조 개인정보의 처리 목적</span>
                    </div>
                    <div class="content__normal">
                        <span>(주)와트('https://dlenc.watttalk.kr/'이하 'dlenc 와트톡')은(는) 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</span>
                        <div class="content__indent">
                            <span>1. 홈페이지 회원가입 및 관리</span>
                            <div class="content__indent">
                                <span>- 회원제 서비스 제공에 따른 본인 식별·인증 목적으로 개인정보를 처리합니다.</span>
                            </div>
                        </div>
                        <div class="content__indent">
                            <span>2. 재화 또는 서비스 제공</span>
                            <div class="content__indent">
                                <span>- 본인인증을 목적으로 개인정보를 처리합니다.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="3">
                        <span>제3조 개인정보의 처리 및 보유 기간</span>
                    </div>
                    <span>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</span>
                    <span>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</span>
                    <div class="content__indent">
                        <span>● 홈페이지 회원가입 및 관리와 관련한 개인정보는 수집.이용에 관한 동의일로부터 "준영구" 까지 위 이용목적을 위하여 보유.이용됩니다.</span>
                        <span>● 회원탈퇴시 지체없이 등록된 모든 개인정보가 삭제됩니다.</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="4">
                        <span>제4조 처리하는 개인정보의 항목</span>
                    </div>
                    <span>① 회사는 다음의 개인정보 항목을 처리하고 있습니다.</span>
                    <div class="content__indent">
                        <span>● 홈페이지 회원가입 및 관리</span>
                        <div class="content__indent">
                            <span>필수항목 : 이름, 생년월일, 로그인ID, 비밀번호, 휴대전화번호, 이메일, 회사명, 쿠키, 접속 로그</span>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="5">
                        <span>제5조 개인정보의 파기절차 및 파기방법</span>
                    </div>
                    <span>① 회사는 인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</span>
                    <span>② 개인정보 파기의 절차 및 방법은 다음과 같습니다.</span>
                    <div class="content__indent">
                        <span>1. 파기절차</span>
                        <div class="content__indent">
                            <span>회사는 사용자가 회원탈퇴 즉시 사용자의 모든 개인정보를 즉각 파기합니다.</span>
                        </div>
                        <span>2. 파기방법</span>
                        <div class="content__indent">
                            <span>전자적 파일 형태의 정보를 기록을 재생할 수 없는 기술적 방법을 사용합니다</span>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="6">
                        <span>제6조 개인정보의 취급위탁</span>
                    </div>
                    <div class="content__table">
                        <div class="content__grayTr">
                            <span class="content__grayTd1">수탁자</span>
                            <span class="content__grayTd2">위탁업무</span>
                            <span class="content__grayTd3">보유 및 이용기간</span>
                        </div>
                        <div class="content__tr">
                            <span class="content__td1">주식회사 다날</span>
                            <span class="content__td2">본인인증 업무</span>
                            <span class="content__td3">회원탈퇴 또는 위탁계약 종료시</span>
                        </div>
                        <div class="content__tr">
                            <span class="content__td1">아임포트</span>
                            <span class="content__td2">주문 연동 및 전자결제 업무</span>
                            <span class="content__td3">회원탈퇴 또는 위탁계약 종료시</span>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="7">
                        <span>제7조 개인정보의 안전성 확보조치에 관한 사항</span>
                    </div>
                    <span>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</span>
                    <span>개인정보의 암호화</span>
                    <div class="content__indent">
                        <span>이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="8">
                        <span>제8조 개인정보 보호에 관한 사항</span>
                    </div>
                    <span>① 회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만사항 및 문의를 처리하기 위하여 아래와 같이 개인정보 관리 책임자를 지정하고 있습니다.</span>
                    <span>[개인정보 열람청구 접수 및 처리 부서]</span>
                    <div class="content__indent">
                        <span>1. 성명 : 김영준</span>
                        <span>2. 전화번호 : 070/7124/2561</span>
                        <span>3. 전자우편주소(e-mail) : watt@wattsolution.co.kr</span>
                    </div>
                    <span>② 정보주체는 개인정보 보호법 제 35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.</span>
                    <span>[개인정보 열람청구 접수 및 처리 부서]</span>
                    <div class="content__indent">
                        <span>1. 성명 : 김영준</span>
                        <span>2. 전화번호 : 070/7124/2561</span>
                        <span>3. 전자우편주소(e-mail) : watt@wattsolution.co.kr</span>
                    </div>
                    <span>③ 기타 개인정보침해에 대한 신고 또는 상담이 필요하신 경우에는 아래 기관으로 문의하시기 바랍니다.</span>
                    <div class="content__indent">
                        <span>- 개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</span>
                        <span>- 정보보호마크인증위원회 (www.eprivacy.or.kr / 02-580-0534)</span>
                        <span>- 대검찰청 첨단범죄수사과 (www.spo.go.kr / 02-3480-2000)</span>
                        <span>- 경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="9">
                        <span>제9조 개인정보의 기술적/관리적 보호 대책</span>
                    </div>
                    <span>회사는 이용자의 개인정보를 안전하게 관리하기 위하여 최선을 다하며, 개인정보보호법에서 요구하는 수준 이상으로 개인정보를 보호하고 있습니다. 또한 기타 「개인정보보호법」「정보통신망 이용 촉진 및 정보보호에 관한 법률」에 의한 기술적, 관리적 대책을 준수합니다.<br><br></span>
                    <span>① 기술적 대책<br><br></span>
                    <span>회사는 이용자의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안정성 확보를 위하여 다음과 같은 기술적 대책을 강구하고 있습니다.</span>
                    <div class="content__indent">
                        <span>1. 이용자의 개인정보 중 비밀번호 등 중요한 데이터는 암호화되어 저장되며, 개인정보는 이중 방화벽의 안전지대에 안전하게 보관되고 있습니다. 또한 암호화 통신 등을 통하여 네트워크 상에서 개인정보를 안전하게 송수신하고 있습니다.</span>
                        <span>2. 이용자의 개인정보가 유출되는 것을 방지하기 위해, 외부로부터의 침입을 차단하는 장치를 이용하고 있으며, 각 서버마다 침입탐지시스템을 설치하여 24시간 침입을 감시하고 있습니다.</span>
                        <span>3. 개인정보취급자가 개인정보처리시스템에 접속한 기록을 보관ㆍ관리하며, 개인정보의 오ㆍ남용, 분실ㆍ위조ㆍ변조 등을 방지하기 위하여 접속기록 등을 정기적으로 점검하며, 개인정보취급자의 접속기록이 위ㆍ변조 및 도난, 분실되지 않도록 해당 접속기록을 안전하게 보관하고 있습니다.</span>
                        <span>4. 개인정보의 훼손에 대비하여 자료를 수시로 백업하고 있고, 최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가 유출되거나 손상되지 않도록 방지하고 있습니다.</span>
                    </div>
                    <span>② 관리적 대책</span>
                    <div class="content__indent">
                        <span>1. 회사는 개인정보관련 취급 직원은 담당자에 한정시키고 있고 이를 위한 별도의 비밀번호를 부여하여 정기적으로 갱신하고 있으며, 담당자에 대한 수시 교육을 통하여 개인정보취급방침의 준수를 강조하고 있습니다.</span>
                        <span>2. 개인정보 관련 취급자의 업무 인수인계는 보안이 유지된 상태에서 철저하게 이뤄지고 있으며 입사 및 퇴사 후 개인정보 사고에 대한 책임을 명확화하고 있습니다.</span>
                        <span>3. 이용자는 ID와 비밀번호를 타인에게 알려 주어서는 안되며, 홈페이지에 로그인하셔서 이용을 마치신 후에는 반드시 로그아웃해주시기 바랍니다. 이용자 본인의 부주의나 인터넷상의 문제로 개인정보가 유출해 발생하는 문제에 대해 회사는 일체의 책임을 지지 않습니다.</span>
                        <span>4. 그 외 내부 관리자의 실수나 기술관리 상의 사고로 인해 개인정보의 상실, 유출, 변조, 훼손이 유발될 경우 회사는 즉각 이용자에게 사실을 알리고 적절한 대책과 보상을 강구할 것입니다.</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="10">
                        <span>제10조 정보주체와 법정대리인의 권리·의무 및 그 행사방법에 관한 사항</span>
                    </div>
                    <span>① 정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</span>
                    <span>② 제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</span>
                    <span>③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다.이 경우 “개인정보 처리 방법에 관한 고시(제2020-7호)” 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</span>
                    <span>④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.</span>
                    <span>⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</span>
                    <span>⑥ 회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</span>
                </div>
                <div class="content">
                    <div class="content__header" id="11">
                        <span>제11조 개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에 관한 사항</span>
                    </div>
                    <span>① 회사는 이용자의 편의를 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.</span>
                    <span>② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.</span>
                    <div class="content__indent">
                        <span>가. 쿠키의 사용 목적 : 이용자가 공지등 알람창에서 하루 보지 않기를 누를 경우, 이를 파악하고, 보여주지 않기위해 사용됩니다.</span>
                        <span>나. 쿠키의 설치●운영 및 거부 : 웹브라우저 상단의 도구 > 인터넷 옵션 > 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다.</span>
                        <span>다. 쿠키 저장을 거부할 경우 공지등에서 하루 보지 않기 옵션을 선택하더라도, 기능이 활성화 되지 않습니다.</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header">
                        <span>&lt;부칙 &gt;</span>
                    </div>
                    <span>본 약관은 2023년 1월 25일부터 시행됩니다.</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    methods: {
        scrollIntoView(tabSeq) {
            document.getElementById(tabSeq).scrollIntoView({behavior: "smooth"})
        }
    }
}
</script>

<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"

.policy
    width: 100%
    min-width: $contentMaxWidth
    min-height: $contentHeight
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: center
    &:hover
        cursor: default
.fullWidth
    width: 100%
    height: $headerHeight
    display: flex
    justify-content: center
    align-items: center
    background: #ffffff
.topBlank
    width: 100%
    height: 150px

.titleBar
    margin-bottom: 36px

    >span
        width: $contentMaxWidth

.main
    width: $contentMaxWidth
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    &__header
        width: 100%
        font-size: 1.5em
        font-weight: bold
        margin-bottom: 30px
    &__normal
        width: 100%
        font-size: 1em
        margin-bottom: 20px
        display: flex
        flex-direction: column
        justify-content: center
        align-items: flex-start
    &__gray
        width: 100%
        background-color: #EFF0F1
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        margin-bottom: 40px
.gray-row
    width: 100%
    height: 60px
    display: flex
    justify-content: flex-start
    align-items: center
    &__text
        display: flex
        justify-content: flex-start
        align-items: center
        width: 25%
        height: 60px
        font-weight: bold
        margin-left: 30px
    &__text1
        display: flex
        justify-content: flex-start
        align-items: center
        width: 37.5%
        height: 60px
        font-weight: bold
    span
        &:hover
            cursor: pointer
.content
    width: 90%
    display: flex
    flex-direction: column
    justify-content: center
    align-items: flex-start
    margin-bottom: 40px
    &__header
        font-weight: bold
        margin-bottom: 10px
    &__normal
        display: flex
        flex-direction: column
        justify-content: center
        align-items: flex-start
    &__indent
        margin-left: 12px
        display: flex
        flex-direction: column
        justify-content: center
        align-items: flex-start
    &__table
        width: 640px
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        outline: 1px solid black
        margin-bottom: 20px
    &__grayTr
        width: 640px
        height: 40px
        display: flex
        justify-content: center
        align-items: center
        background-color: #EFF0F1
    &__grayTd1
        width: 150px
        text-align: center
    &__grayTd2
        width: 300px
        text-align: center
    &__grayTd3
        width: 190px
        text-align: center
    &__tr
        width: 640px
        height: 40px
        display: flex
        justify-content: center
        align-items: center
    &__td1
        width: 150px
        text-align: left
        margin-left: 10px
    &__td2
        width: 300px
        text-align: left
        margin-left: 10px
    &__td3
        width: 190px
        text-align: left
</style>
