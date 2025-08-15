import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Calendar,
  User,
  MessageCircle,
  Reply,
  Settings,
  BarChart3,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Inquiry, InquiryReply, InsertInquiryReply, UsageStats } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<(Inquiry & { replies: InquiryReply[] }) | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyData, setReplyData] = useState({
    adminName: "관리자",
    content: "",
  });

  // 문의 목록 조회
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["/api/inquiries"],
  });

  // 일일 사용량 통계 조회
  const { data: usageStats } = useQuery<UsageStats>({
    queryKey: ["/api/usage-stats"],
    refetchInterval: 30000, // 30초마다 갱신
  });

  // 답변 등록
  const createReplyMutation = useMutation({
    mutationFn: ({ inquiryId, data }: { inquiryId: number; data: InsertInquiryReply }) =>
      apiRequest(`/api/inquiries/${inquiryId}/reply`, "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      setIsReplyDialogOpen(false);
      setReplyData({
        adminName: "관리자",
        content: "",
      });
      toast({
        title: "답변이 등록되었습니다",
        description: "문의자에게 답변이 전달되었습니다.",
      });
      // 현재 선택된 문의 새로고침
      if (selectedInquiry) {
        apiRequest(`/api/inquiries/${selectedInquiry.id}`)
          .then((inquiry: any) => setSelectedInquiry(inquiry));
      }
    },
    onError: () => {
      toast({
        title: "답변 등록 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleInquiryClick = async (inquiry: Inquiry) => {
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
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    createReplyMutation.mutate({
      inquiryId: selectedInquiry.id,
      data: replyData,
    });
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Settings className="h-8 w-8" />
            관리자 페이지
          </h1>
          <p className="text-muted-foreground">
            문의사항을 확인하고 답변을 작성할 수 있습니다.
          </p>
        </div>

        {/* 일일 사용량 통계 */}
        {usageStats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 text-blue-600" />
                일일 AI 사용량 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="text-blue-600 mr-2" />
                    <span className="text-sm text-blue-600 font-medium">현재 사용량</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {usageStats.current}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm text-green-600 font-medium">일일 한도</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mt-1">
                    {usageStats.limit}
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm text-orange-600 font-medium">남은 크레딧</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-700 mt-1">
                    {usageStats.remaining}
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm text-purple-600 font-medium">사용률</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700 mt-1">
                    {Math.round((usageStats.current / usageStats.limit) * 100)}%
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>AI 사용량 진행률</span>
                  <span>{usageStats.current} / {usageStats.limit}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      usageStats.current >= usageStats.limit ? 'bg-red-500' : 
                      usageStats.current >= usageStats.limit * 0.8 ? 'bg-orange-500' : 
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((usageStats.current / usageStats.limit) * 100, 100)}%` }}
                  />
                </div>
                {!usageStats.canUseAI && (
                  <p className="text-red-600 text-sm mt-2 font-medium">
                    ⚠️ AI 크레딧이 모두 소진되었습니다. 새벽 5시에 자동 리셋됩니다.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 문의 목록 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">문의 목록</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">문의 목록을 불러오는 중...</div>
              ) : (inquiries as Inquiry[]).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">등록된 문의가 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                (inquiries as Inquiry[]).map((inquiry: Inquiry) => (
                  <Card 
                    key={inquiry.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedInquiry?.id === inquiry.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleInquiryClick(inquiry)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-sm">{inquiry.title}</h3>
                            <Badge variant={inquiry.status === "answered" ? "default" : "destructive"}>
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
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* 문의 상세 및 답변 */}
          <div>
            {selectedInquiry ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">문의 상세</h2>
                  {selectedInquiry.status === "pending" && (
                    <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Reply className="h-4 w-4 mr-2" />
                          답변하기
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>답변 작성</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleReplySubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="adminName">관리자명</Label>
                            <Input
                              id="adminName"
                              value={replyData.adminName}
                              onChange={(e) => setReplyData(prev => ({ ...prev, adminName: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="content">답변 내용</Label>
                            <Textarea
                              id="content"
                              value={replyData.content}
                              onChange={(e) => setReplyData(prev => ({ ...prev, content: e.target.value }))}
                              required
                              rows={6}
                              placeholder="문의에 대한 답변을 작성해주세요..."
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={createReplyMutation.isPending}
                          >
                            {createReplyMutation.isPending ? (
                              "답변 등록 중..."
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                답변 등록
                              </>
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedInquiry.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {selectedInquiry.name} ({selectedInquiry.email})
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedInquiry.createdAt)}
                      </div>
                      <Badge variant="outline">
                        {selectedInquiry.category}
                      </Badge>
                      <Badge variant={selectedInquiry.status === "answered" ? "default" : "destructive"}>
                        {selectedInquiry.status === "answered" ? "답변완료" : "대기중"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg mb-4">
                      {selectedInquiry.content}
                    </div>

                    {/* 답변 목록 */}
                    {selectedInquiry.replies && selectedInquiry.replies.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          답변 ({selectedInquiry.replies.length})
                        </h4>
                        {selectedInquiry.replies.map((reply) => (
                          <div key={reply.id} className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              {reply.adminName}
                              <Calendar className="h-3 w-3" />
                              {formatDate(reply.createdAt)}
                            </div>
                            <div className="whitespace-pre-wrap">
                              {reply.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    왼쪽에서 문의를 선택해주세요
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}