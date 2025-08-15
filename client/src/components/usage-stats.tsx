import { useQuery } from "@tanstack/react-query";
import { UsageStats } from "@shared/schema";
import { BarChart3, Zap, AlertCircle } from "lucide-react";

export function UsageStatsDisplay() {
  const { data: stats, isLoading } = useQuery<UsageStats>({
    queryKey: ["/api/usage-stats"],
    refetchInterval: 30000, // 30초마다 갱신
  });

  if (isLoading || !stats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-500">사용량 로딩 중...</span>
        </div>
      </div>
    );
  }

  const percentage = (stats.current / stats.limit) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = percentage >= 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isOverLimit ? (
            <AlertCircle className="w-5 h-5 text-orange-500" />
          ) : (
            <Zap className="w-5 h-5 text-blue-500" />
          )}
          <span className="text-sm font-medium text-slate-700">
            오늘 삼행시 생성
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-semibold ${
            isOverLimit ? 'text-orange-600' : 
            isNearLimit ? 'text-yellow-600' : 
            'text-blue-600'
          }`}>
            {stats.current} / {stats.limit}
          </span>
          {!stats.canUseAI && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              AI 크레딧 소진
            </span>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverLimit ? 'bg-orange-500' : 
              isNearLimit ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        {!stats.canUseAI && (
          <p className="text-xs text-orange-600 mt-2">
            💡 AI 크레딧을 모두 사용했습니다. 규칙 기반 삼행시로 제공됩니다.
          </p>
        )}
        
        {isNearLimit && stats.canUseAI && (
          <p className="text-xs text-yellow-600 mt-2">
            ⚠️ AI 크레딧이 부족합니다. ({stats.remaining}개 남음)
          </p>
        )}
      </div>
    </div>
  );
}