import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useState } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  delta: string;
  deltaType: "positive" | "negative" | "warning";
  subtitle: string;
  accentColor: string;
  hasSparkline?: boolean;
  hasStars?: boolean;
  badges?: { count: number; label: string; color: string }[];
  hasMiniChart?: boolean;
}

export function MetricCard({
  label,
  value,
  delta,
  deltaType,
  subtitle,
  accentColor,
  hasSparkline,
  hasStars,
  badges,
  hasMiniChart,
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:border-[#C7D9F8] transition-all relative">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: accentColor }}></div>

      {/* Label */}
      <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-3">{label}</div>

      {/* Value */}
      <div className="text-[28px] font-bold text-[#1A1A2E] mb-2">{value}</div>

      {/* Delta */}
      <div className="flex items-center gap-1 mb-3">
        {deltaType === "positive" ? (
          <TrendingUp className="w-4 h-4 text-[#16A34A]" />
        ) : deltaType === "negative" ? (
          <TrendingDown className="w-4 h-4 text-[#DA291C]" />
        ) : (
          <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
        )}
        <span
          className={`text-[13px] font-semibold ${
            deltaType === "positive"
              ? "text-[#16A34A]"
              : deltaType === "negative"
              ? "text-[#DA291C]"
              : "text-[#F59E0B]"
          }`}
        >
          {delta}
        </span>
      </div>

      {/* Sparkline, Stars, Badges, or Mini Chart */}
      {hasSparkline && (
        <div className="h-12 mb-3">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <polyline
              points="0,35 12,32 25,28 37,30 50,25 62,20 75,18 87,15 100,10"
              fill="none"
              stroke="#003DA5"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}

      {hasStars && (
        <div className="flex gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="relative w-4 h-4">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {badges && (
        <div className="flex gap-2 mb-3">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
              style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
            >
              <span>{badge.count}</span>
              <span className="text-[10px]">{badge.label}</span>
            </div>
          ))}
        </div>
      )}

      {hasMiniChart && (
        <div className="h-12 mb-3 flex items-end gap-1">
          {[28, 32, 30, 35, 38, 42, 65].map((height, idx) => (
            <div
              key={idx}
              className="flex-1 bg-[#003DA5] rounded-t"
              style={{ height: `${height}%`, opacity: idx === 6 ? 1 : 0.5 }}
            ></div>
          ))}
        </div>
      )}

      {/* Subtitle */}
      <div className="text-[13px] text-[#64748B] mb-3">{subtitle}</div>

      {/* What this means link */}
      <div className="relative">
        <button
          className="text-xs text-[#003DA5] font-medium hover:underline flex items-center gap-1"
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <span className="text-base">◎</span>
          What this means →
        </button>
        {showTooltip && (
          <div className="mt-2 p-3 bg-[#E8F0FC] rounded-lg text-xs text-[#1A1A2E] italic relative">
            <button
              className="absolute top-1 right-1 text-[#64748B] hover:text-[#1A1A2E]"
              onClick={() => setShowTooltip(false)}
            >
              ✕
            </button>
            <p>
              This metric indicates strong engagement with P&G products on Lazada. The positive trend suggests effective
              marketing and customer satisfaction. Monitor for any sudden drops that might indicate issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
