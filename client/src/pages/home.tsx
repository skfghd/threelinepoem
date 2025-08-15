import { useState } from "react";
import { Moon, Feather, PenTool, Scroll, Star, Clock, Palette, Redo, Copy, Check, Info, MessageCircleQuestion, Edit, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoemGenerator } from "@/components/poem-generator";
import { PoemDisplay } from "@/components/poem-display";
import { Header } from "@/components/header";
import { UsageStatsDisplay } from "@/components/usage-stats";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PoemResponse } from "@shared/schema";

export default function Home() {
  const [generatedPoem, setGeneratedPoem] = useState<PoemResponse | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // No need to fetch recent poems for one-time use

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handlePoemGenerated = (poem: PoemResponse) => {
    setGeneratedPoem(poem);
  };

  const examplePoems = [
    {
      word: "행복",
      mood: "재미있게",
      lines: ["행운이 가득한 하루를 시작하며", "복숭아처럼 달콤한 미소로 살아가자"],
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-100",
      badgeColor: "text-purple-600 bg-purple-100",
      circleColor: "bg-purple-500"
    },
    {
      word: "사랑",
      mood: "따뜻하게", 
      lines: ["사계절 내내 변하지 않는", "랑랑한 마음으로 전하는 진심"],
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-100",
      badgeColor: "text-green-600 bg-green-100",
      circleColor: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-2xl mb-6 shadow-lg">
            <PenTool className="text-white text-2xl" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">재미있는 삼행시를 만들어보세요!</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            이름이나 단어를 입력하면 <strong>AI가 창의적이고 유머러스한 삼행시</strong>를 자동으로 생성해드립니다. 
            모임이나 회식 자리에서 분위기를 띄워보세요! 🎉
          </p>

        </div>

        {/* Usage Stats */}
        <UsageStatsDisplay />

        {/* Poem Generator */}
        <PoemGenerator onPoemGenerated={handlePoemGenerated} />

        {/* Generated Poem Display */}
        {generatedPoem && (
          <PoemDisplay poem={generatedPoem} onRegenerate={() => setGeneratedPoem(null)} />
        )}

        {/* Example Poems */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            <Star className="text-amber-500 mr-3 inline" />
            예시 작품들
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {examplePoems.map((poem, index) => (
              <div key={index} className={`bg-gradient-to-br ${poem.color} rounded-xl p-6 border ${poem.borderColor}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-700 text-lg">"{poem.word}" 삼행시</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${poem.badgeColor}`}>
                    {poem.mood}
                  </span>
                </div>
                <div className="space-y-2">
                  {poem.word.split('').map((char, charIndex) => (
                    <div key={charIndex} className="flex items-start space-x-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 ${poem.circleColor} text-white rounded-full text-xs font-bold`}>
                        {char}
                      </span>
                      <p className="text-slate-700 leading-relaxed flex-1">
                        {poem.lines[charIndex]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-slate-600 leading-relaxed">
              <Info className="text-primary mr-2 inline w-4 h-4" />
              선택한 분위기에 따라 미리 준비된 템플릿으로 삼행시를 자동 생성합니다.
            </p>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="gradient-primary rounded-2xl p-8 mt-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">
            <MessageCircleQuestion className="mr-3 inline" />
            사용법이 궁금하세요?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Edit className="text-2xl" />
              </div>
              <h4 className="font-bold text-lg mb-2">1. 단어 입력</h4>
              <p className="text-white/90 leading-relaxed">한글 2-5글자의 단어나 이름을 입력해주세요</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Palette className="text-2xl" />
              </div>
              <h4 className="font-bold text-lg mb-2">2. 분위기 선택</h4>
              <p className="text-white/90 leading-relaxed">재미있게, 따뜻하게 등 원하는 분위기를 선택하세요</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <WandSparkles className="text-2xl" />
              </div>
              <h4 className="font-bold text-lg mb-2">3. 생성 완료</h4>
              <p className="text-white/90 leading-relaxed">창의적인 삼행시가 자동으로 생성됩니다</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Feather className="text-white text-sm" />
              </div>
              <span className="font-bold text-slate-800">삼행시 생성기</span>
            </div>
            <p className="text-slate-600 mb-4">재미있는 한글 삼행시로 분위기를 띄워보세요! 🎉</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">개인정보처리방침</Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">이용약관</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">문의하기</Link>
            </div>
            <p className="text-xs text-slate-400 mt-4">© 2025 KindTool.ai - All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
