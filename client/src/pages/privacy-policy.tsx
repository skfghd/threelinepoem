import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. 개인정보의 처리목적</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>삼행시 생성기(이하 '서비스')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            
            <div className="ml-4">
              <h4 className="font-semibold mb-2">가. 서비스 제공</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">한국어 삼행시 생성 서비스 제공, 서비스 이용 기록 관리</p>
              
              <h4 className="font-semibold mb-2">나. 서비스 개선</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">서비스 품질 향상을 위한 통계 분석 및 개선</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. 개인정보의 처리 및 보유기간</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">본 서비스는 <strong>개인정보를 수집하지 않는</strong> 익명 서비스입니다.</p>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>사용자가 입력한 단어 및 생성된 삼행시는 서버에 저장되지 않습니다</li>
              <li>세션이 종료되면 모든 데이터가 완전히 삭제됩니다</li>
              <li>IP 주소, 쿠키 등 개인을 식별할 수 있는 정보를 수집하지 않습니다</li>
              <li>로그인, 회원가입 기능이 없어 개인정보 보유 기간이 존재하지 않습니다</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. 개인정보의 제3자 제공</CardTitle>
          </CardHeader>
          <CardContent>
            <p>본 서비스는 개인정보를 수집하지 않으므로 제3자에게 개인정보를 제공하지 않습니다.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. 개인정보처리 위탁</CardTitle>
          </CardHeader>
          <CardContent>
            <p>본 서비스는 개인정보를 수집하지 않으므로 개인정보처리를 위탁하지 않습니다.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. 정보주체의 권리·의무 및 행사방법</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">본 서비스는 개인정보를 수집하지 않는 익명 서비스이므로 다음과 같습니다:</p>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>개인정보 열람, 정정·삭제, 처리정지 요구 대상이 되는 개인정보가 없습니다</li>
              <li>사용자가 입력한 모든 정보는 세션 종료와 함께 자동으로 삭제됩니다</li>
              <li>개인정보보호 관련 문의사항이 있으시면 연락처로 문의해 주시기 바랍니다</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. 개인정보의 안전성 확보조치</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">본 서비스는 개인정보보호법 제29조에 따라 다음과 같은 기술적·관리적 및 물리적 조치를 취하고 있습니다:</p>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li><strong>기술적 조치:</strong> HTTPS 암호화 통신, 서버 보안 설정</li>
              <li><strong>관리적 조치:</strong> 개인정보 미수집 정책 준수</li>
              <li><strong>물리적 조치:</strong> 별도의 개인정보 저장소 없음</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. 쿠키(Cookie) 사용</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">본 서비스는 사용자 편의를 위해 최소한의 쿠키를 사용할 수 있습니다:</p>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li><strong>필수 쿠키:</strong> 다크모드 설정 등 UI 상태 저장</li>
              <li><strong>개인정보 미포함:</strong> 모든 쿠키는 개인을 식별할 수 없는 정보만 포함</li>
              <li><strong>브라우저 설정:</strong> 브라우저 설정을 통해 쿠키 수집을 거부할 수 있습니다</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. 문의처</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">
                본 서비스는 개인정보를 수집하지 않는 익명 서비스이므로 별도의 개인정보보호책임자를 두지 않습니다.
              </p>
              <p className="text-sm">
                서비스 이용 관련 문의사항이 있으시면 하단의 문의하기 페이지를 통해 연락해 주시기 바랍니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. 개인정보 처리방침 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm font-medium">시행일자: 2025년 1월 1일</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      <Footer />
    </>
  );
}