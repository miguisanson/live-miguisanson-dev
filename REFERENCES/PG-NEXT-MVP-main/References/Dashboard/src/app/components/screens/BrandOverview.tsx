import { Download, Share2, RefreshCw } from "lucide-react";
import { MetricCard } from "../cards/MetricCard";
import { BrandRatingTrendChart } from "../charts/BrandRatingTrendChart";
import { IssuePriorityQueue } from "../sections/IssuePriorityQueue";
import { FastestMovingIssues } from "../sections/FastestMovingIssues";
import { VectorsOfSuperiority } from "../sections/VectorsOfSuperiority";
import { MarketOperationsSignals } from "../sections/MarketOperationsSignals";

export function BrandOverview() {
  return (
    <div className="space-y-6">
      {/* Page Title Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Brand Overview Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Lazada PH · Fabric Care · Last 30 days · 75,618 reviews ingested
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#1A1A2E] hover:bg-[#F4F6FA] transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#1A1A2E] hover:bg-[#F4F6FA] transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#1A1A2E] hover:bg-[#F4F6FA] transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Row 1 - KPI Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="TOTAL REVIEWS INGESTED"
          value="75,618"
          delta="+12.4% vs prior period"
          deltaType="positive"
          subtitle="Across 3 subcategories · Lazada PH"
          accentColor="#003DA5"
          hasSparkline
        />
        <MetricCard
          label="P&G PORTFOLIO AVG RATING"
          value="4.95 ★"
          delta="+0.03 vs prior 4 weeks"
          deltaType="positive"
          subtitle="Ariel · Tide · Downy · Breeze"
          accentColor="#003DA5"
          hasStars
        />
        <MetricCard
          label="ACTIVE ISSUE FLAGS"
          value="14"
          delta="-3 resolved this week"
          deltaType="positive"
          subtitle="Across all P&G brands"
          accentColor="#DA291C"
          badges={[
            { count: 4, label: "Critical", color: "#DA291C" },
            { count: 6, label: "Warning", color: "#F59E0B" },
            { count: 4, label: "Watch", color: "#0057C8" },
          ]}
        />
        <MetricCard
          label="REVIEW VELOCITY"
          value="1,247 reviews / 24h"
          delta="Spike detected on Ariel (+38%)"
          deltaType="warning"
          subtitle="vs 7-day avg: 891/day"
          accentColor="#003DA5"
          hasMiniChart
        />
      </div>

      {/* Row 2 - Brand Rating Trend Chart */}
      <BrandRatingTrendChart />

      {/* Row 3 - Issue Priority Queue + Fastest Moving Issues */}
      <div className="grid grid-cols-[60%_40%] gap-4">
        <IssuePriorityQueue />
        <FastestMovingIssues />
      </div>

      {/* Row 4 - 5 Vectors of Superiority */}
      <VectorsOfSuperiority />

      {/* Row 5 - Market Operations Signals */}
      <MarketOperationsSignals />
    </div>
  );
}
