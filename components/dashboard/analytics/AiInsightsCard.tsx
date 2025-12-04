import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { BarChart2, Lightbulb, Loader2, Wand2 } from "lucide-react";

export const AIInsightsCard: React.FC<{
  onGenerate: () => void;
  isLoading: boolean;
  insights: { summary: string; actionableInsights: string[] } | null;
}> = ({ onGenerate, isLoading, insights }) => (
  <DashboardCard title="">
    <div className="p-4 sm:p-6">
      {/* Header Section: Stacks on mobile, row on desktop */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 shrink-0 rounded-lg bg-purple-500/10">
            <Wand2 className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Sales Insights</h3>
            <p className="text-xs text-gray-400">AI-powered analysis of your sales data</p>
          </div>
        </div>
        
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 size={16} />}
          {isLoading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-purple-400 mb-3" />
          <p className="text-sm text-gray-400">AI is analyzing your sales data...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !insights && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center border-2 border-dashed border-gray-700 rounded-lg px-4">
          <Lightbulb className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mb-3" />
          <p className="text-sm text-gray-400 max-w-md">
            Click &quot;Generate Insights&quot; to get AI-powered recommendations based on your performance.
          </p>
        </div>
      )}

      {/* Results State */}
      {!isLoading && insights && (
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-800">
            <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
              <BarChart2 size={16} />
              Summary
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {insights.summary || "No summary generated."}
            </p>
          </div>

          {/* Actionable Insights Box */}
          {insights.actionableInsights?.length > 0 && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-gray-800">
              <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Lightbulb size={16} />
                Actionable Recommendations
              </h4>
              <ul className="space-y-3 sm:space-y-2">
                {insights.actionableInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-purple-400 mt-0.5 shrink-0">•</span>
                    <span className="leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  </DashboardCard>
);