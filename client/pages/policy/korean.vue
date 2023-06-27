<template>
    <div class="row content-start policy">
        <div class="col-12 row justify-center">
            <div class="topBlank"></div>
            <div class="main">
                <div class="main__header">
                    <span>개인정보 취급방침</span>
                </div>
                <div class="main__normal">
                    <span>(주)와트(이하 "회사"라고 함)는 통신비밀보호법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 정보통신서비스제공자가 준수하여야 할 관련 법령상의 개인정보보호 규정을 준수하며,</span>
                    <span>관련 법령에 의거한 개인정보취급방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다. 와트의 개인정보취급방침은 다음과 같은 내용을 담고 있습니다.</span>
                </div>
                <div class="main__gray">
                    <div class="gray-row">
                        <span class="gray-row__text" @click="scrollIntoView(1)">제1조 총칙</span>
                        <span class="gray-row__text" @click="scrollIntoView(5)">제5조 개인정보의 취급위탁</span>
                        <span class="gray-row__text1" @click="scrollIntoView(9)">제9조 고객의 권리와 의무</span>
                        <span class="gray-row__blank" @click="scrollIntoView(13)">제13조 고지의 의무</span>
                    </div>
                    <div class="gray-row">
                        <span class="gray-row__text" @click="scrollIntoView(2)">제2조 수집하는 개인정보의 항목 및 수집방법</span>
                        <span class="gray-row__text" @click="scrollIntoView(6)">제6조 개인정보의 보유 및 이용기간</span>
                        <span class="gray-row__text1" @click="scrollIntoView(10)">제10조 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항</span>
                        <span class="gray-row__blank"></span>
                    </div>
                    <div class="gray-row">
                        <span class="gray-row__text" @click="scrollIntoView(3)">제3조 개인정보의 항목 및 수집방법</span>
                        <span class="gray-row__text" @click="scrollIntoView(7)">제7조 장기 미사용 고객의 휴면 정책</span>
                        <span class="gray-row__text1" @click="scrollIntoView(11)">제11조 개인정보의 기술적/관리적 보호 대책</span>
                        <span class="gray-row__blank"></span>
                    </div>
                    <div class="gray-row">
                        <span class="gray-row__text" @click="scrollIntoView(4)">제4조 개인정보 공유 및 제공</span>
                        <span class="gray-row__text" @click="scrollIntoView(8)">제8조 개인정보 파기절차 및 방법</span>
                        <span class="gray-row__text1" @click="scrollIntoView(12)">제12조 개인정보관리 책임자 및 담당자의 연락처</span>
                        <span class="gray-row__blank"></span>
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
                        <span>제2조 수집하는 개인정보의 항목 및 수집방법</span>
                    </div>
                    <div class="content__normal">
                        <span>①회사에서 제공하는 서비스를 이용하시고자 할 경우 다음의 정보를 입력해주셔야 합니다.</span>
                        <div class="content__indent">
                            <span>1. 필수항목</span>
                            <div class="content__indent">
                                <span>- 개인회원 : 전자우편(e-mail) 주소, 비밀번호, 닉네임, 전화번호(휴대전화), 생년월일, ci(연계정보), di(중복가입정보)</span>
                                <span>- 개인/법인사업자 : 회사/기관명, 사업자등록번호, 담당자이름, 전자우편(e-mail) 주소, 비밀번호 전화번호(휴대전화), ci(연계정보), di(중복가입정보)</span>
                            </div>
                        </div>
                        <div class="content__indent">
                            <span>2. 선택항목</span>
                            <div class="content__indent">
                                <span>- 신용카드정보, 은행계좌정보, 이동전화정보 등 대금결제에 필요한 정보</span>
                                <span>- 회원가입시 회원이 원하시는 경우에 한하여 추가 정보를 선택, 제공하실 수 있도록 되어있으며, 일부 재화 또는 용역 상품에 대한 주문 및 접수시 회원이 원하는 정확한 주문 내용 파악을 통한 원활한 주문 및 결제, 배송을 위하여 추가적인 정보를 요구하고 있습니다.</span>
                            </div>
                        </div>
                        <div class="content__indent">
                            <span>3. 서비스 이용과정 및 사업</span>
                            <span>처리과정에서 수집될 수 있는 개인정보의 범위</span>
                            <div class="content__indent">
                                <span>- 최근접속일, 접속 IP 정보, 쿠키, 구매로그, 이벤트로그</span>
                            </div>
                        </div>
                        <div class="content__indent">
                            <span>4. 비회원 고객</span>
                            <div class="content__indent">
                                <span>- 회사는 비회원 고객의 주문에도 배송, 대금결제, 주문내역 조회 및 구매확인, 실명여부 확인을 위하여 필요한 개인정보만을 요청하고 있으며, 이 경우 그 정보는 대금결제 및 상품의 배송에 관련된 용도 이외에는 다른 어떠한 용도로도 사용되지 않습니다.</span>
                                <span>- 회사는 비회원의 개인정보도 회원과 동등한 수준으로 보호합니다.</span>
                            </div>
                        </div>
                        <span>② 회사는 다음과 같은 방법으로 개인정보를 수집합니다.</span>
                        <div class="content__indent">
                            <span>- 홈페이지, 서면양식, 팩스, 전화, 상담 게시판, 전자우편 (e-mail), 이벤트 응모, 배송요청</span>
                            <span>- 협력회사로부터의 제공</span>
                            <span>- 로그 분석 프로그램을 통한 생성정보 수집</span>
                        </div>
                        <span>③ 개인정보 수집에 대한 동의</span>
                        <div class="content__indent">
                            <span>- 회사는 이용자께서 회사의 개인정보취급방침 및 이용약관의 내용에 대해「동의한다」버튼 또는 「동의하지 않는다」 버튼을 클릭할 수 있는 절차를 마련하여,「동의한다」버튼을 클릭하면 개인정보 수집에 대해 동의한 것으로 봅니다.</span>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="3">
                        <span>제3조 개인정보의 수집 및 이용목적</span>
                    </div>
                    <span>① 회사는 다음과 같은 목적을 위하여 필요한 최소한의 개인정보를 수집하고 있습니다.</span>
                    <div class="content__indent">
                        <span>1. 아이디, 비밀번호, 이름 생년월일 : 회원제 서비스 이용에 따른 본인 식별 절차에 이용</span>
                        <span>2. 전자우편 (e-mail) 주소 (뉴스레터 수신여부) : 공지사항 전달, 본인 의사 확인, 불만 처리 등 원활한 의사소통 경로의 확보, 새로운 서비스, 신상품이나 이벤트 정보 등 최신 정보의 안내</span>
                        <span>3. 주소, 전화번호 : 쇼핑 물품 배송에 대한 정확한 배송지의 확보</span>
                        <span>4. 그 외 선택항목 : 개인맞춤 서비스를 제공하기 위한 자료</span>
                        <span>5. 회원의 서비스이용에 대한 통계 : 업무와 관련된 통계자료 작성 및 서비스 개발</span>
                        <span>6. 마케팅,광고에의 활용</span>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="4">
                        <span>제4조 개인정보 공유 및 제공</span>
                    </div>
                    <span>① 회사는 고객의 사전 동의가 있거나 법률에서 정하는 경우 외에는 고객의 개인정보를 제3자에게 제공하거나 제3조 개인정보의 수집 및 이용목적에서 고지한 목적 외의 용도로 이용하지 않습니다.</span>
                    <span>② 고객의 편의를 제공하거나 서비스를 증진하기 위하여 다음과 같은 경우에는 고객의 개인정보를 제3자에게 제공하거나 제3자와 공유할 수 있습니다.</span>
                    <span>1. 고객이 사전에 동의한 경우</span>
                    <span>2. 법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</span>
                    <span>3. 개인정보를 제공할 경우에는 사전에 고객에게 개인정보를 제공받는 제3자, 제공하는 개인정보항목명, 개인정보 제공의 목적, 제공하는 개인정보가 언제까지 어떻게 보호·관리되는지, 고객이 종전에 동의한 사항, 고객의 동의하지 않을 권리와 의사표시 방법, 기타 고객의 동의를 얻기 위하여 필요한 사항에 대해 개별적으로 서면, 전자우편(e-mail), 전화 등을 통해 고지하여 동의를 구하는 절차를 거치게 되며, 고객이 동의하지 않는 경우에는 제3자에게 정보를 제공하지 않습니다.</span>
                </div>
                <div class="content">
                    <div class="content__header" id="5">
                        <span>제5조 개인정보의 취급위탁</span>
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
                    <span>① 회사는 개인정보법 제 17조에 따라 거래 당사자간 원활한 의사소통 및 배송, 상담 등 거래이용을 위하여 필요한 최소한의 개인정보만을 입점 셀러 및 배송사 그리고 결제기관에 제공하고 있습니다.</span>
                    <span>② 회사는 위탁계약 체결시 개인정보 보호법 제25조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해 배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</span>
                    <span>③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.</span>
                </div>
                <div class="content">
                    <div class="content__header" id="6">
                        <span>제6조 개인정보의 보유 및 이용기간</span>
                    </div>
                    <span>① 이용자의 개인정보는 다음과 같이 개인정보의 수집목적 또는 제공받은 목적이 달성되면 파기됩니다.</span>
                    <div class="content__indent">
                        <span>1. 회원가입정보 : 회원가입을 탈퇴하거나 회원에 제명된 때</span>
                        <span>2. 대금지급정보 : 대금의 완제일 또는 채권소명시효기간이 만료된 때</span>
                        <span>3. 배송정보 : 재화 또는 용역 등 상품이나 서비스가 인도되거나 제공된 때</span>
                        <span>4. 설문조사, 이벤트 등 일시적 목적을 위하여 수집한 경우 : 당해 설문조사, 이벤트 등이 종료한 때</span>
                    </div>
                    <span>② 단, 위 개인정보 수집목적 달성시 즉시파기 원칙에도 불구하고 다음과 같이 거래관련 권리 의무 관계의 확인 등을 이유로 일정기간 보유하여야 할 필요가 있을 경우에는「전자상거래 등에서의 소비자보호에 관한 법률」, 「국세기본법」등 관련 법령의 규정에 근거하여 일정기간 보유합니다.</span>
                        <div class="content__indent">
                            <span>1. 계약 또는 청약철회 등에 관한 기록 : 5년</span>
                            <span>2. 대금결제 및 재화 등의 공급에 관한 기록 : 5년</span>
                            <span>3. 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년</span>
                            <span>4. 웹사이트 방문기록 : 3개월</span>
                        </div>
                    <span>③ 이용자의 동의를 받아 보유하고 있는 거래정보 등을 이용자께서 열람을 요구하는 경우 회사는 지체없이 열람, 확인할 수 있도록 조치합니다.</span>
                </div>
                <div class="content">
                    <div class="content__header" id="7">
                        <span>제7조 장기 미사용 고객의 휴면 정책</span>
                    </div>
                    <span>1. 와트를 최종 이용 후 1년 동안 이용 기록이 없는 고객(장기미이용회원)의 개인정보는 별도로 분리하여 안전하게 관리하게 되며, 대상자에게는 분리 보관 처리일을 기준으로 하여 최소 30일 이전에 이메일 주소를 통해 안내합니다. 분리 보관된 개인정보는 5년간 보관 후 지체없이 파기합니다. 단,통신비밀보호법, 전자상거래 등에서의 소비자보호에 관한 법률 등의 관계법령의 규정에 의하여 보존할 필요가 있는 경우 규정된 기간 동안 고객의 개인정보를 보관합니다.</span>
                    <span>2. 휴면계정으로 전환을 원하지 않으시는 경우, 휴면계정 전환 전 서비스 내 로그인 하시면 됩니다. 또한, 휴면 계정으로 전환되었더라도 로그인할 경우 이용자의 동의에 따라 휴면계정을 복원하여 정상적인 서비스를 이용할 수 있습니다</span>
                </div>
                <div class="content">
                    <div class="content__header" id="8">
                        <span>제8조 개인정보 파기절차 및 방법</span>
                    </div>
                    <span>① 회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 회사의 개인정보 파기절차 및 방법은 다음과 같습니다.</span>
                    <div class="content__indent">
                        <span>1. 파기절차</span>
                        <div class="content__indent">
                            <span>- 이용자가 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(제6조 개인정보의 보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다. 동 개인정보는 법률에 의한 경우가 아니고서는 보유되는 이외의 다른 목적으로 이용되지 않습니다.</span>
                        </div>
                        <span>2. 파기방법</span>
                        <div class="content__indent">
                            <span>- 종이에 출력된 개인정보 : 분쇄기로 분쇄하거나 소각을 통하여 파기</span>
                            <span>- 전자적 파일 형태로 저장된 개인정보 : 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</span>
                        </div>
                    </div>
                    <span>② 이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.</span>
                </div>
                <div class="content">
                    <div class="content__header" id="9">
                        <span>제9조 고객의 권리와 의무</span>
                    </div>
                    <span>① 고객의 권리</span>
                    <div class="content__indent">
                        <span>1. 이용자는 언제든지 등록되어 있는 본인의 개인정보를 열람하거나 정정하실 수 있습니다. 개인정보 열람 및 정정을 하고자 할 경우에는 홈페이지내 마이페이지를 클릭하여 직접 열람 또는 정정하거나, 개인정보관리책임자에게 서면/전자우편(e-mail)/모사전송 및 전화로 연락주시면 본인확인 절차를 거쳐 지체없이 조치하겠습니다.</span>
                        <span>2. 회사는 이용자로부터 전항의 요구가 있는 경우 법정 기한 내에 그 요구에 응답하고 정정을 완료하기 전까지 당해 개인정보를 이용하지 않습니다. 단, 이 경우 해당 기간 내에 응답할 수 없는 정당한 사유가 있을 때에는 이용자에게 그 사유를 알리고 연기할 수 있으며, 그 사유가 소멸하면 지체없이 응답합니다.</span>
                        <span>3. 이용자는 동의하신 개인정보의 수집, 이용, 제공에 대해 언제든지 철회하실 수 있습니다. 동의철회는 홈페이지내 마이페이지를 클릭하여 직접 삭제하거나 개인정보관리책임자에게 서면/전자우편(e-mail)/모사전송 및 전화로 연락주시면 본인확인 절차를 거쳐 지체없이 개인정보의 삭제 등 필요한 조치를 하겠습니다. 단, 온라인사이트의 경우 탈퇴시 통계자료 작성상 필요한 구매이력을 제외하고 모두 삭제됩니다.</span>
                    </div>
                    <span>② 고객의 의무 <br><br></span>
                    <span>고객은 자신의 개인정보를 보호할 의무가 있으며, 회사의 귀책사유가 없이 ID(이메일 주소), 비밀번호, 접근매체 등의 양도·대여·분실이나 로그인 상태에서 이석 등 고객 본인의 부주의나 관계법령에 의한 보안조치로 차단할 수 없는 방법이나 기술을 사용한 해킹 등 회사가 상당한 주의에도 불구하고 통제할 수 없는 인터넷상의 문제 등으로 개인정보가 유출되어 발생한 문제에 대해 회사는 책임을 지지 않습니다. 고객은 자신의 개인정보를 최신의 상태로 유지해야 하며, 고객의 부정확한 정보 입력으로 발생하는 문제의 책임은 고객 자신에게 있습니다. 타인의 개인정보를 도용한 회원가입 또는 ID등을 도용하여 결제 처리 시 고객 자격 상실과 함께 관계법령에 의거하여 처벌될 수 있습니다. 고객은 아이디, 비밀번호 등에 대해 보안을 유지할 책임이 있으며 제3자에게 이를 양도하거나 대여할 수 없습니다. 고객은 회사의 개인정보보호정책에 따라 보안을 위한 주기적인 활동에 협조할 의무가 있습니다.</span>
                </div>
                <div class="content">
                    <div class="content__header" id="10">
                        <span>제10조 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항</span>
                    </div>
                    <span>① 쿠키</span>
                    <div class="content__indent">
                        <span>1.회사는 이용자에 대한 정보를 저장하고 검색할 수 있는 '쿠키(cookie)'를 사용합니다. 쿠키는 웹사이트가 이용자의 컴퓨터 브라우저로 전송하는 소량의 정보입니다. 이용자께서 웹사이트에 접속을 하면 회사의 컴퓨터는 이용자의 브라우저에 있는 쿠키의 내용을 읽고, 이용자의 추가정보를 이용자의 컴퓨터에서 찾아 접속에 따른 성명 등의 추가 입력 없이 서비스를 제공할 수 있습니다. 쿠키는 이용자의 컴퓨터는 식별하지만 이용자를 개인적으로 식별하지는 않습니다</span>
                        <span>2. 회사는 이용자들에게 특화된 맞춤서비스를 제공하기 위해서 이용자들의 정보를 제공하고 수시로 불러오는 쿠키(cookie)를 통하여 수집된 이용자의 개인정보를 사용합니다. 방문한 서비스 정보, 장바구니 이력, 서비스 접속 시간 및 빈도, 서비스 이용 과정에서 생성된 또는 제공(입력)한 정보등을 분석하여 고객의 취향과 관심에 특화된 서비스(광고 포함)를 제공할 수 있습니다.</span>
                        <span>3. 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저 옵션에서 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수 있습니다.</span>
                        <div class="content__indent">
                            <span>1. Internet Explorer의 경우</span>
                            <div class="content__indent">
                                <span>- [도구]메뉴에서 [인터넷 옵션]을 선택 → [개인정보]를 클릭 → [고급]을 클릭 → 쿠키 허용여부를 선택</span>
                            </div>
                            <span>2. Safari의 경우</span>
                            <div class="content__indent">
                                <span>- MacOS 상단 좌측 메뉴바에서 [Safari]에서 [환경설정]선택 → [환경설정]창에서 [보안]으로 이동하여 쿠키 허용여부 선택</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="content__header" id="11">
                        <span>제11조 개인정보의 기술적/관리적 보호 대책</span>
                    </div>
                    <span>와트는 이용자의 개인정보를 안전하게 관리하기 위하여 최선을 다하며, 개인정보보호법에서 요구하는 수준 이상으로 개인정보를 보호하고 있습니다. 또한 기타 「개인정보보호법」「정보통신망 이용 촉진 및 정보보호에 관한 법률」에 의한 기술적, 관리적 대책을 준수합니다.<br><br></span>
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
                    <div class="content__header" id="12">
                        <span>제12조 개인정보관리 책임자 및 담당자의 연락처</span>
                    </div>
                    <span>① 회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만사항 및 문의를 처리하기 위하여 아래와 같이 개인정보 관리 책임자를 지정하고 있습니다.</span>
                    <span>[개인정보 관리 책임자]</span>
                    <div class="content__indent">
                        <span>1. 성명 : 김영준</span>
                        <span>2. 전화번호 : 070/7124/2561</span>
                        <span>3. 전자우편주소(e-mail) : watt@wattsolution.co.kr</span>
                    </div>
                    <span>② 정보주체는 개인정보 보호법 제 35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 와트는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.</span>
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
                    <div class="content__header" id="13">
                        <span>제13조 고지의 의무</span>
                    </div>
                    <span>현 개인정보취급(처리)방침은 2023년 5월 23일에 개정되었으며 정부의 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일 전부터 홈페이지를 통해 고지할 것입니다.</span>
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
    justify-content: center
    align-items: center
    &__text
        width: 25%
        font-weight: bold
        margin-left: 30px
    &__text1
        width: 35%
        font-weight: bold
        margin-left: 30px
    &__blank
        width: 15%
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
