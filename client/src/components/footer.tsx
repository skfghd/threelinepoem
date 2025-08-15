import { Link } from "wouter";

export function Footer() {
  const links = [
    { text: "사이트 소개", url: "https://kindtoolai.replit.app/about" },
    { text: "면책조항", url: "https://kindtoolai.replit.app/disclaimer" },
    { text: "개인정보처리방침", url: "/privacy-policy" },
    { text: "이용약관", url: "/terms-of-service" },
    { text: "문의하기", url: "/contact" },
  ];

  return (
    <footer className="mt-16 pt-8 pb-6 border-t border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          {links.map((link, index) => (
            <span key={link.url}>
              {link.url.startsWith('http') ? (
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {link.text}
                </a>
              ) : (
                <Link 
                  href={link.url}
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {link.text}
                </Link>
              )}
              {index < links.length - 1 && (
                <span className="ml-4 text-slate-400 dark:text-slate-600">|</span>
              )}
            </span>
          ))}
        </div>
        <div className="text-center mt-4 text-xs text-slate-500 dark:text-slate-500">
          © 2025 KindTool.ai - All rights reserved.
        </div>
      </div>
    </footer>
  );
}