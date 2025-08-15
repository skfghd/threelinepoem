import { Button } from "@/components/ui/button";
import { Home, Feather } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();
  const isSpecialPage = location === '/privacy-policy' || location === '/terms-of-service' || location === '/contact';
  
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Feather className="text-white text-sm" />
            </div>
            <span className="font-bold text-slate-800 text-lg">삼행시 생성기</span>
          </Link>
          
          {/* 홈 버튼 */}
          <Button
            asChild
            variant="outline"
            className="flex items-center space-x-2 hover:bg-primary hover:text-white transition-colors"
          >
            <a href="https://kindtool.ai/" target="_blank" rel="noopener noreferrer">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{isSpecialPage ? 'kindtoolai' : '홈으로'}</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}