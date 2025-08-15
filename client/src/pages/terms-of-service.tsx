import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsOfService() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">이용약관</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>제1조 (목적)</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              이 약관은 삼행시 생성기(이하 "서비스")가 제공하는 한국어 삼행시 생성 서비스의 이용과 관련하여 
              서비스 제공자와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제2조 (정의)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">1. "서비스"란</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
                  사용자가 입력한 한국어 단어를 기반으로 삼행시를 자동 생성하는 웹 애플리케이션 서비스를 말합니다.
                </p>
              </div>
              <div>
                <p className="font-semibold">2. "이용자"란</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
                  본 약관에 따라 서비스를 이용하는 모든 개인 또는 법인을 말합니다.
                </p>
              </div>
              <div>
                <p className="font-semibold">3. "콘텐츠"란</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
                  서비스를 통해 생성되는 삼행시 및 관련 텍스트를 말합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제3조 (약관의 효력 및 변경)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>① 약관의 효력</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
              본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
            </p>
            
            <p><strong>② 약관의 변경</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
              서비스 제공자는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 
              변경된 약관은 변경사유 및 적용일자를 명시하여 현행약관과 함께 서비스 초기화면에 
              그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제4조 (서비스의 제공)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>① 서비스 내용</strong></p>
            <ul className="list-disc ml-8 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>한국어 단어 입력을 통한 삼행시 자동 생성</li>
              <li>다양한 분위기(재미있는, 따뜻한, 창의적인, 시적인) 선택 기능</li>
              <li>생성된 삼행시 복사 및 공유 기능</li>
            </ul>
            
            <p><strong>② 서비스 특징</strong></p>
            <ul className="list-disc ml-8 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>회원가입이나 로그인 없이 익명으로 이용 가능</li>
              <li>개인정보 수집 및 저장하지 않음</li>
              <li>일회성 사용을 목적으로 설계된 서비스</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제5조 (이용자의 의무)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
            <ul className="list-disc ml-6 text-sm space-y-1">
              <li>타인의 개인정보를 무단으로 수집, 저장, 공개하는 행위</li>
              <li>외설적이거나 폭력적인 내용, 기타 공서양속에 반하는 내용을 입력하는 행위</li>
              <li>타인의 명예를 훼손하거나 모욕하는 내용을 입력하는 행위</li>
              <li>저작권, 상표권 등 타인의 지적재산권을 침해하는 행위</li>
              <li>서비스의 안정적인 운영을 방해할 수 있는 행위</li>
              <li>법령에 위반되는 내용을 입력하는 행위</li>
              <li>자동화된 수단을 통해 서비스를 남용하는 행위</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제6조 (저작권 및 지적재산권)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>① 서비스 저작권</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
              서비스 자체에 대한 저작권 및 지적재산권은 서비스 제공자에게 귀속됩니다.
            </p>
            
            <p><strong>② 생성 콘텐츠</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
              서비스를 통해 생성된 삼행시에 대한 권리는 이용자에게 귀속되며, 
              이용자는 생성된 콘텐츠를 자유롭게 이용할 수 있습니다.
            </p>
            
            <p><strong>③ 면책사항</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
              서비스 제공자는 이용자가 생성한 콘텐츠에 대한 저작권 침해 등의 문제에 대해 책임지지 않습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제7조 (서비스 제공의 중단)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>서비스 제공자는 다음의 경우 서비스 제공을 중단할 수 있습니다:</p>
            <ul className="list-disc ml-6 text-sm space-y-1">
              <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
              <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
              <li>국가비상사태, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 서비스 이용에 지장이 있는 경우</li>
              <li>기타 중대한 사유로 인하여 서비스 제공자가 서비스 제공을 지속하는 것이 부적당하다고 인정하는 경우</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제8조 (면책조항)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>① 서비스 제공자의 면책</strong></p>
            <ul className="list-disc ml-6 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>서비스는 무료로 제공되며, 서비스 제공자는 서비스와 관련하여 이용자에게 어떠한 손해가 발생하더라도 책임을 지지 않습니다.</li>
              <li>서비스 제공자는 이용자가 생성한 콘텐츠의 내용, 정확성, 적법성에 대해 책임지지 않습니다.</li>
              <li>서비스 제공자는 이용자 간 또는 이용자와 제3자 간의 분쟁에 개입하지 않으며, 이에 대한 책임을 지지 않습니다.</li>
            </ul>
            
            <p><strong>② 생성 콘텐츠</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
              서비스를 통해 생성되는 삼행시는 알고리즘에 의해 자동 생성되는 것으로, 
              그 내용에 대한 책임은 이용자에게 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제9조 (분쟁해결)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>① 준거법</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
              본 약관 및 서비스 이용과 관련된 분쟁에는 대한민국 법을 적용합니다.
            </p>
            
            <p><strong>② 관할법원</strong></p>
            <p className="text-sm text-gray-600 dark:text-gray-300 ml-4">
              본 약관 및 서비스 이용과 관련하여 발생한 분쟁에 대해서는 민사소송법에 따른 관할법원에 소를 제기할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>부칙</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm font-medium">시행일자: 2025년 1월 1일</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                본 약관은 시행일자부터 적용됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      <Footer />
    </>
  );
}