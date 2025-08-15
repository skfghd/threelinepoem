import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Inquiry, InsertInquiry, InquiryReply } from "@shared/schema";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Plus, 
  Lock, 
  Eye,
  Calendar,
  User,
  MessageCircle,
  Bug,
  HelpCircle
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<(Inquiry & { replies: InquiryReply[] }) | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [privatePassword, setPrivatePassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    title: "",
    content: "",
    isPrivate: false,
    password: "",
  });

  // 문의 목록 조회
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["/api/inquiries"],
  });

  // 문의 등록
  const createInquiryMutation = useMutation({
    mutationFn: (data: InsertInquiry) => apiRequest("/api/inquiries", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      setFormData({
        name: "",
        email: "",
        category: "",
        title: "",
        content: "",
        isPrivate: false,
        password: "",
      });
      setIsFormOpen(false);
      toast({
        title: "문의가 등록되었습니다",
        description: "빠른 시일 내에 답변드리겠습니다.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "문의 등록에 실패했습니다",
        description: error.message || "다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  // 비밀글 비밀번호 확인
  const verifyPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      apiRequest(`/api/inquiries/${id}/verify`, "POST", { password }),
    onSuccess: (data: any, variables) => {
      if (data.isValid) {
        // 문의 상세 조회
        apiRequest(`/api/inquiries/${variables.id}`)
          .then((inquiry: any) => {
            setSelectedInquiry(inquiry);
            setShowPasswordDialog(false);
            setPrivatePassword("");
          });
      } else {
        toast({
          title: "비밀번호가 올바르지 않습니다",
          description: "다시 확인해주세요.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "오류가 발생했습니다",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.category || !formData.content) {
      toast({
        title: "모든 필수 항목을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    if (formData.isPrivate && !formData.password) {
      toast({
        title: "비밀글을 작성하려면 비밀번호를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    createInquiryMutation.mutate({
      name: formData.name,
      email: formData.email,
      category: formData.category,
      title: formData.title || `[${formData.category}] 문의`,
      content: formData.content,
      isPrivate: formData.isPrivate,
      password: formData.isPrivate ? formData.password : null,
    });
  };

  const handleInquiryClick = async (inquiry: Inquiry) => {
    if (inquiry.isPrivate) {
      setShowPasswordDialog(true);
      setSelectedInquiry({ ...inquiry, replies: [] });
    } else {
      try {
        const fullInquiry: any = await apiRequest(`/api/inquiries/${inquiry.id}`);
        setSelectedInquiry(fullInquiry);
      } catch (error) {
        toast({
          title: "문의를 불러올 수 없습니다",
          description: "다시 시도해주세요.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">문의하기</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  KindToolAI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  재미있고 유용한 아이스브레이킹 도구들을 모은 서비스입니다.
                  삼행시 생성기, 성향 분석 테스트, 속뜻 번역기 등 다양한 콘텐츠를 통해
                  친구, 동료, 팀원과의 대화를 더 부드럽고 즐겁게 만들어드립니다.
                  모든 기능은 개인정보를 수집하지 않는 안전한 일회성 서비스로 설계되어
                  안심하고 사용하실 수 있습니다.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  문의 이메일: skfghd@naver.com
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>문의 유형별 안내</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Bug className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">버그 신고</h4>
                      <p className="text-sm text-muted-foreground">서비스 이용 중 발생한 오류나 문제점을 신고해 주세요.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">이용 문의</h4>
                      <p className="text-sm text-muted-foreground">서비스 사용법이나 기능에 대한 질문을 남겨주세요.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">제안 및 피드백</h4>
                      <p className="text-sm text-muted-foreground">서비스 개선을 위한 제안이나 의견을 공유해 주세요.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>자주 묻는 질문</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Q. 개인정보가 저장되나요?</h4>
                    <p className="text-sm text-muted-foreground">A. 아닙니다. 삼행시 단어나 생성된 삼행시는 서버에 저장되지 않으며, 세션 종료 시 모든 데이터가 삭제됩니다.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Q. 회원가입이 필요한가요?</h4>
                    <p className="text-sm text-muted-foreground">A. 아닙니다. 별도의 회원가입 없이 바로 이용하실 수 있습니다.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Q. 생성된 삼행시를 상업적으로 이용해도 되나요?</h4>
                    <p className="text-sm text-muted-foreground">A. 네. 생성된 삼행시에 대한 권리는 이용자에게 있으므로 자유롭게 이용하실 수 있습니다.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">문의 게시판</h3>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      새 문의
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>새 문의 작성</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dialog-name">이름 *</Label>
                          <Input
                            id="dialog-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                            placeholder="홍길동"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dialog-email">이메일 *</Label>
                          <Input
                            id="dialog-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            placeholder="hong@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dialog-category">문의 유형 *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="문의 유형을 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="기능개선">기능 개선 제안</SelectItem>
                            <SelectItem value="버그신고">버그 신고</SelectItem>
                            <SelectItem value="사용방법">사용 방법 문의</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dialog-title">제목 *</Label>
                        <Input
                          id="dialog-title"
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          required
                          placeholder="문의 제목을 입력해주세요"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dialog-content">내용 *</Label>
                        <Textarea
                          id="dialog-content"
                          value={formData.content}
                          onChange={(e) => handleInputChange("content", e.target.value)}
                          required
                          placeholder="문의하실 내용을 상세히 적어주세요"
                          rows={6}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="dialog-private"
                          checked={formData.isPrivate}
                          onCheckedChange={(checked) => handleInputChange("isPrivate", checked)}
                        />
                        <Label htmlFor="dialog-private" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          비밀글로 작성
                        </Label>
                      </div>

                      {formData.isPrivate && (
                        <div className="space-y-2">
                          <Label htmlFor="dialog-password">비밀번호 *</Label>
                          <Input
                            id="dialog-password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder="비밀글 열람 비밀번호"
                          />
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={createInquiryMutation.isPending}
                      >
                        {createInquiryMutation.isPending ? (
                          "등록 중..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            문의 등록
                          </>
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="max-h-[70vh] overflow-y-auto space-y-3">
                {isLoading ? (
                  <div className="text-center py-8">문의 목록을 불러오는 중...</div>
                ) : (inquiries as Inquiry[]).length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">아직 등록된 문의가 없습니다.</p>
                    </CardContent>
                  </Card>
                ) : (
                  (inquiries as Inquiry[]).map((inquiry: Inquiry) => (
                    <Card 
                      key={inquiry.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleInquiryClick(inquiry)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {inquiry.isPrivate && <Lock className="h-4 w-4 text-orange-500" />}
                              <h4 className="font-medium text-sm truncate">{inquiry.title}</h4>
                              <Badge variant={inquiry.status === "answered" ? "default" : "secondary"} className="text-xs">
                                {inquiry.status === "answered" ? "답변완료" : "대기중"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {inquiry.name}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(inquiry.createdAt)}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {inquiry.category}
                              </Badge>
                            </div>
                          </div>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 비밀글 비밀번호 입력 다이얼로그 */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>비밀글 열람</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                이 글은 비밀글입니다. 비밀번호를 입력해주세요.
              </p>
              <Input
                type="password"
                value={privatePassword}
                onChange={(e) => setPrivatePassword(e.target.value)}
                placeholder="비밀번호"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && selectedInquiry) {
                    verifyPasswordMutation.mutate({
                      id: selectedInquiry.id,
                      password: privatePassword,
                    });
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (selectedInquiry) {
                      verifyPasswordMutation.mutate({
                        id: selectedInquiry.id,
                        password: privatePassword,
                      });
                    }
                  }}
                  disabled={verifyPasswordMutation.isPending || !privatePassword}
                >
                  확인
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setPrivatePassword("");
                  }}
                >
                  취소
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 문의 상세 다이얼로그 */}
        <Dialog open={!!selectedInquiry && !showPasswordDialog} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedInquiry && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedInquiry.isPrivate && <Lock className="h-4 w-4 text-orange-500" />}
                    {selectedInquiry.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedInquiry.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedInquiry.createdAt)}
                    </div>
                    <Badge variant="outline">
                      {selectedInquiry.category}
                    </Badge>
                    <Badge variant={selectedInquiry.status === "answered" ? "default" : "secondary"}>
                      {selectedInquiry.status === "answered" ? "답변완료" : "대기중"}  
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">문의 내용</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedInquiry.content}</p>
                    </div>
                  </div>

                  {selectedInquiry.replies && selectedInquiry.replies.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-4">답변</h4>
                      <div className="space-y-4">
                        {selectedInquiry.replies.map((reply) => (
                          <div 
                            key={reply.id} 
                            className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-l-4 border-blue-500"
                          >
                            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                              <MessageCircle className="h-4 w-4" />
                              <span>관리자</span>
                              <span>•</span>
                              <span>{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
}