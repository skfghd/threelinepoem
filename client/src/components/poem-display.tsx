import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PoemResponse } from "@shared/schema";
import { Scroll, Copy, Check, Clock, Palette, Redo, Bot, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface PoemDisplayProps {
  poem: PoemResponse;
  onRegenerate: () => void;
}

export function PoemDisplay({ poem, onRegenerate }: PoemDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const poemText = poem.inputWord.split('').map((char, index) => 
      `${char}: ${poem.lines[index]}`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(poemText);
      setIsCopied(true);
      toast({
        title: "복사 완료!",
        description: "삼행시가 클립보드에 복사되었습니다."
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "복사 실패",
        description: "클립보드 복사 중 오류가 발생했습니다."
      });
    }
  };

  const getMoodLabel = (mood: string) => {
    const labels = {
      funny: "재미있게",
      warm: "따뜻하게", 
      creative: "창의적으로",
      poetic: "시적으로"
    };
    return labels[mood as keyof typeof labels] || mood;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          {poem.usedAI ? (
            <Bot className="text-primary mr-3" />
          ) : (
            <FileText className="text-orange-500 mr-3" />
          )}
          {poem.usedAI ? "AI가 생성한 삼행시" : "규칙 기반 삼행시"}
        </h3>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isCopied ? "복사됨!" : "복사하기"}
          </span>
        </Button>
      </div>

      {/* Fallback Message */}
      {!poem.usedAI && poem.fallbackMessage && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-orange-800 text-sm font-medium">
            {poem.fallbackMessage}
          </p>
        </div>
      )}

      <div className={`${
        poem.usedAI 
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-primary" 
          : "bg-gradient-to-br from-orange-50 to-amber-50 border-l-4 border-orange-400"
      } rounded-xl p-6`}>
        <div className="space-y-3">
          {poem.inputWord.split('').map((char, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold">
                {char}
              </span>
              <p className="text-lg text-slate-800 leading-relaxed flex-1">
                {poem.lines[index]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatDistanceToNow(new Date(poem.createdAt), { 
              addSuffix: true, 
              locale: ko 
            })}
          </span>
          <span className="flex items-center">
            <Palette className="w-4 h-4 mr-1" />
            {getMoodLabel(poem.mood)}
          </span>
        </div>
        <Button
          onClick={onRegenerate}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-primary hover:text-purple-600 transition-colors"
        >
          <Redo className="w-4 h-4" />
          <span className="text-sm font-medium">다시 생성</span>
        </Button>
      </div>
    </div>
  );
}
