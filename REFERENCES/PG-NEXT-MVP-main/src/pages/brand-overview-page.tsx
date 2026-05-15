import * as React from "react";
import {
  Download,
  RefreshCw,
  Share2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Check,
  MessageSquare,
  Star,
  ArrowUpRight,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDemoData } from "../context/demo-data-context";
import { useDemoFeedback } from "../context/demo-feedback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog } from "../components/ui/dialog";
import { QuickInsightAction } from "../components/common/quick-insight-action";

type TrendMode = "pg" | "competitor" | "all";

interface IssueQueueItem {
  rank: number;
  brand: string;
  issue: string;
  severity: "HIGH" | "MED" | "LOW";
  volume: number;
  score: number;
  owner: string;
  quote: string;
  trend: "up" | "down";
}

interface FastIssue {
  label: string;
  delta: number;
  mentions: number;
}

const trendData = [
  {
    week: "W1",
    ariel: 4.94,
    tide: 4.91,
    downy: 4.94,
    breeze: 4.95,
    surf: 4.94,
    mighty: 4.89,
    champion: 4.93,
  },
  {
    week: "W2",
    ariel: 4.95,
    tide: 4.9,
    downy: 4.96,
    breeze: 4.96,
    surf: 4.95,
    mighty: 4.91,
    champion: 4.94,
  },
  {
    week: "W3",
    ariel: 4.97,
    tide: 4.93,
    downy: 4.95,
    breeze: 4.98,
    surf: 4.96,
    mighty: 4.92,
    champion: 4.95,
  },
  {
    week: "W4",
    ariel: 4.93,
    tide: 4.92,
    downy: 4.94,
    breeze: 4.97,
    surf: 4.94,
    mighty: 4.9,
    champion: 4.93,
  },
  {
    week: "W5",
    ariel: 4.96,
    tide: 4.94,
    downy: 4.97,
    breeze: 4.96,
    surf: 4.97,
    mighty: 4.93,
    champion: 4.96,
  },
  {
    week: "W6",
    ariel: 4.95,
    tide: 4.93,
    downy: 4.94,
    breeze: 4.96,
    surf: 4.96,
    mighty: 4.91,
    champion: 4.95,
  },
  {
    week: "W7",
    ariel: 4.97,
    tide: 4.92,
    downy: 4.93,
    breeze: 4.97,
    surf: 4.95,
    mighty: 4.92,
    champion: 4.94,
  },
  {
    week: "W8",
    ariel: 4.95,
    tide: 4.93,
    downy: 4.95,
    breeze: 4.97,
    surf: 4.96,
    mighty: 4.93,
    champion: 4.96,
  },
];

const issueQueue: IssueQueueItem[] = [
  {
    rank: 1,
    brand: "Downy",
    issue: "Scent complaints",
    severity: "HIGH",
    volume: 47,
    score: 141,
    owner: "R&D",
    quote: "\"masyadong malakas ang amoy, hindi ko type yung bango\"",
    trend: "up",
  },
  {
    rank: 2,
    brand: "Ariel",
    issue: "Packaging leaks",
    severity: "HIGH",
    volume: 31,
    score: 93,
    owner: "Supply",
    quote: "\"natanggap ko na may leak, butas yung pakete\"",
    trend: "up",
  },
  {
    rank: 3,
    brand: "Tide",
    issue: "Texture/consistency",
    severity: "MED",
    volume: 28,
    score: 56,
    owner: "R&D",
    quote: "\"malapot, hindi natutunaw agad sa tubig\"",
    trend: "up",
  },
  {
    rank: 4,
    brand: "Breeze",
    issue: "Price/value perception",
    severity: "MED",
    volume: 22,
    score: 44,
    owner: "Marketing",
    quote: "\"mahal na ngayon, hindi na sulit\"",
    trend: "down",
  },
  {
    rank: 5,
    brand: "Downy",
    issue: "Stock availability",
    severity: "LOW",
    volume: 18,
    score: 18,
    owner: "Supply",
    quote: "\"wala sa tindahan, out of stock palagi\"",
    trend: "down",
  },
];

const fastIssues: FastIssue[] = [
  { label: "Scent complaint (Downy)", delta: 127, mentions: 238 },
  { label: "Dispenser/pump issues", delta: 89, mentions: 156 },
  { label: "Reorder/out-of-stock", delta: 64, mentions: 98 },
  { label: "Packaging damage", delta: -31, mentions: 72 },
  { label: "Price complaints", delta: -18, mentions: 64 },
];

const vectors = [
  {
    key: "Product",
    score: 4.92,
    percent: 92,
    delta: 0.04,
    keyword: "\"works/epekto\"",
    tone: "blue",
  },
  {
    key: "Packaging",
    score: 4.71,
    percent: 84,
    delta: -0.08,
    keyword: "\"butas/leak\"",
    tone: "amber",
  },
  {
    key: "Communication",
    score: 4.65,
    percent: 79,
    delta: 0,
    keyword: "\"label claims\"",
    tone: "blue",
  },
  {
    key: "Retail Exec",
    score: 4.44,
    percent: 71,
    delta: -0.12,
    keyword: "\"out of stock\"",
    tone: "amber",
  },
  {
    key: "Value",
    score: 4.38,
    percent: 67,
    delta: -0.11,
    keyword: "\"mahal/sulit\"",
    tone: "amber",
  },
];

const marketSignals = [
  {
    title: "COMPETITOR PROMO DETECTED",
    subtitle: "Surf - Fabric Enhancer subcategory",
    detail: "Review volume +58% WoW (847 vs 535 avg)",
    hint: "Likely discount campaign or flash sale event",
    border: "border-[#DA291C]",
    bg: "bg-[#FFF5F5]",
    icon: TriangleAlert,
  },
  {
    title: "VALUE PERCEPTION GAP",
    subtitle: "Ariel Laundry - Promo-tagged reviews",
    detail: "Promo reviews avg: 4.71 stars | Non-promo avg: 4.97 stars",
    hint: "Gap: -0.26 pts - investigate messaging",
    border: "border-[#F59E0B]",
    bg: "bg-[#FFFBEB]",
    icon: TriangleAlert,
  },
  {
    title: "REVIEW VELOCITY NORMAL",
    subtitle: "Downy Fabric Enhancer",
    detail: "Current: 824 reviews/month | vs 3-month avg: 801 reviews/month",
    hint: "No unusual spike or drop detected",
    border: "border-[#16A34A]",
    bg: "bg-[#F0FDF4]",
    icon: Check,
  },
];

const sparklineB = [8, 9, 10, 10, 11, 13, 13, 14];

function ringDash(percent: number): number {
  const circumference = 2 * Math.PI * 36;
  return circumference - (percent / 100) * circumference;
}

function severityColor(severity: IssueQueueItem["severity"]): string {
  if (severity === "HIGH") {
    return "border-l-[#DA291C]";
  }
  if (severity === "MED") {
    return "border-l-[#F59E0B]";
  }
  return "border-l-[#4A9EFF]";
}

export function BrandOverviewPage(): React.ReactElement {
  const { moduleImpact } = useDemoData();
  const { notify } = useDemoFeedback();
  const [trendMode, setTrendMode] = React.useState<TrendMode>("all");
  const [selectedIssue, setSelectedIssue] = React.useState<IssueQueueItem | null>(null);
  const [assistantOpen, setAssistantOpen] = React.useState<boolean>(false);
  const [assistantReply, setAssistantReply] = React.useState<string>(
    "Ask for trend, issue, or vector insights to generate a quick executive brief.",
  );

  const moduleState = moduleImpact.find((item) => item.module === "Brand Overview");

  return (
    <section className="space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight text-[#1A1A2E] md:text-[42px]">
            Brand Overview Dashboard
          </h1>
          <p className="mt-1 text-base text-[#64748B] md:text-lg">
            Lazada PH · Fabric Care · Last 30 days · 75,618 reviews ingested
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => notify("Export started", "Brand overview export package prepared.")}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => notify("Share link copied", "Secure demo share link copied to clipboard.")}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            onClick={() => notify("Refreshed", "Brand overview metrics refreshed from local dataset.")}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {moduleState?.state !== "healthy" ? (
        <div className="rounded-lg border border-[#F1C08E] bg-[#FFF6EC] p-3 text-sm text-[#9A3412]">
          Reliability notice: {moduleState?.issue}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1 bg-[#003DA5]" />
          <CardContent className="space-y-3 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Total Reviews Ingested
            </p>
            <p className="text-4xl font-bold leading-none text-[#1A1A2E]">75,618</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-[#16A34A]">
              <TrendingUp className="h-4 w-4" />
              +12.4% vs prior period
            </p>
            <div className="h-12">
              <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <polyline
                  points="0,35 12,32 25,28 37,30 50,25 62,20 75,18 87,15 100,10"
                  fill="none"
                  stroke="#003DA5"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="text-sm text-[#64748B]">Across 3 subcategories · Lazada PH</p>
            <QuickInsightAction
              variant="text"
              pageKey="brand-overview"
              buttonLabel="What This Means"
              subject="Total reviews and demand momentum"
              contextLines={[
                "Review ingestion is up 12.4% versus prior period.",
                "Velocity spike is concentrated in Ariel-linked terms.",
                "Monitor whether growth ties to promo-driven sentiment or sustained adoption.",
              ]}
            />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1 bg-[#003DA5]" />
          <CardContent className="space-y-3 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              P&G Portfolio Avg Rating
            </p>
            <p className="flex items-center gap-2 text-4xl font-bold leading-none text-[#1A1A2E]">
              4.95 <Star className="h-10 w-10 fill-[#1A1A2E] text-[#1A1A2E]" />
            </p>
            <p className="flex items-center gap-1 text-sm font-semibold text-[#16A34A]">
              <TrendingUp className="h-4 w-4" />
              +0.03 vs prior 4 weeks
            </p>
            <div className="flex items-center gap-1 text-[#F59E0B]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={`rating-star-${index}`} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
              ))}
            </div>
            <p className="text-sm text-[#64748B]">Ariel · Tide · Downy · Breeze</p>
            <QuickInsightAction
              variant="text"
              pageKey="brand-overview"
              buttonLabel="What This Means"
              subject="Portfolio rating health"
              contextLines={[
                "Average rating remains at 4.95 with positive weekly drift.",
                "Positive movement is strongest in Ariel and Downy segments.",
                "Protect rating gains by prioritizing packaging and scent complaint mitigation.",
              ]}
            />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1 bg-[#DA291C]" />
          <CardContent className="space-y-3 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Active Issue Flags
            </p>
            <p className="text-4xl font-bold leading-none text-[#1A1A2E]">14</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-[#16A34A]">
              <TrendingUp className="h-4 w-4" />
              -3 resolved this week
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="danger" className="text-xs">
                4 Critical
              </Badge>
              <Badge variant="warning" className="text-xs">
                6 Warning
              </Badge>
              <Badge variant="info" className="text-xs">
                4 Watch
              </Badge>
            </div>
            <p className="text-sm text-[#64748B]">Across all P&G brands</p>
            <QuickInsightAction
              variant="text"
              pageKey="brand-overview"
              buttonLabel="What This Means"
              subject="Issue queue severity summary"
              contextLines={[
                "Critical queue reduced by three this week, but 14 total flags remain active.",
                "Top issues are concentrated in scent complaints and packaging leaks.",
                "Urgency score should continue to drive owner assignment and review brief generation.",
              ]}
            />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1 bg-[#003DA5]" />
          <CardContent className="space-y-3 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Review Velocity
            </p>
            <p className="text-4xl font-bold leading-none text-[#1A1A2E]">1,247 reviews / 24h</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-[#F59E0B]">
              <ArrowUpRight className="h-4 w-4" />
              Spike detected on Ariel (+38%)
            </p>
            <div className="flex h-10 items-end gap-1">
              {sparklineB.map((value, idx) => (
                <div
                  key={value}
                  className="flex-1 rounded-t bg-[#003DA5]"
                  style={{ height: `${value * 5}%`, opacity: idx === sparklineB.length - 1 ? 1 : 0.45 }}
                />
              ))}
            </div>
            <p className="text-sm text-[#64748B]">vs 7-day avg: 891/day</p>
            <QuickInsightAction
              variant="text"
              pageKey="brand-overview"
              buttonLabel="What This Means"
              subject="Review velocity surge interpretation"
              contextLines={[
                "24h review velocity is above seven-day average by over 40%.",
                "Spike concentration around Ariel suggests campaign or issue-driven conversation burst.",
                "Use issue queue drilldown to separate positive intent from risk signals.",
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl font-bold leading-tight text-[#1A1A2E] md:text-3xl">
                Brand Rating Trend - 4-Week Rolling Average
              </CardTitle>
              <CardDescription className="mt-1 text-base text-[#64748B]">
                P&G vs Competitor Brands · Fabric Care
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={trendMode === "pg" ? "default" : "secondary"} onClick={() => setTrendMode("pg")}>
                P&G Only
              </Button>
              <Button
                variant={trendMode === "competitor" ? "default" : "secondary"}
                onClick={() => setTrendMode("competitor")}
              >
                Competitors Only
              </Button>
              <Button
                variant={trendMode === "all" ? "default" : "secondary"}
                onClick={() => setTrendMode("all")}
              >
                All Brands
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[390px] min-h-[24rem]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 8, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                <XAxis dataKey="week" stroke="#64748B" />
                <YAxis stroke="#64748B" domain={[4.85, 5]} ticks={[4.85, 4.89, 4.93, 5]} width={34} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={34} />
                {trendMode !== "competitor" ? (
                  <>
                    <Line type="monotone" dataKey="ariel" name="Ariel" stroke="#003DA5" strokeWidth={2.6} dot={false} />
                    <Line type="monotone" dataKey="tide" name="Tide" stroke="#0057C8" strokeWidth={2.2} dot={false} />
                    <Line type="monotone" dataKey="downy" name="Downy" stroke="#4A9EFF" strokeWidth={2.2} dot={false} />
                    <Line type="monotone" dataKey="breeze" name="Breeze" stroke="#7FBFFF" strokeWidth={2.2} dot={false} />
                  </>
                ) : null}
                {trendMode !== "pg" ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="surf"
                      name="Surf"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="6 5"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="mighty"
                      name="Mighty Clean"
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="6 5"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="champion"
                      name="Champion"
                      stroke="#CBD5E1"
                      strokeWidth={2}
                      strokeDasharray="6 5"
                      dot={false}
                    />
                  </>
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#1A1A2E]">
            <span className="font-semibold uppercase tracking-wider text-[#64748B]">P&G brands:</span>
            <span>Ariel</span>
            <span>Tide</span>
            <span>Downy</span>
            <span>Breeze</span>
            <span className="ml-2 font-semibold uppercase tracking-wider text-[#64748B]">Competitors:</span>
            <span>Surf</span>
            <span>Mighty Clean</span>
            <span>Champion</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold leading-tight text-[#1A1A2E] md:text-3xl">
              Issue Priority Queue
            </CardTitle>
            <CardDescription className="text-base text-[#64748B]">
              Ranked by Urgency Score = Severity x Volume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issueQueue.map((item) => (
              <div
                key={item.rank}
                className={`relative rounded-xl border border-[#E2E8F0] border-l-4 bg-white p-4 ${severityColor(item.severity)}`}
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-lg font-bold text-[#64748B]">#{item.rank}</span>
                  <span className="text-xl">{item.severity === "HIGH" ? "🔴" : item.severity === "MED" ? "🟡" : "🔵"}</span>
                  <span className="text-lg font-semibold text-[#1A1A2E]">{item.brand}</span>
                  <span className="text-lg text-[#64748B]">-</span>
                  <span className="text-lg text-[#1A1A2E]">{item.issue}</span>
                </div>
                <p className="text-sm text-[#64748B]">
                  Severity:{" "}
                  <span className={item.severity === "HIGH" ? "font-semibold text-[#DA291C]" : "font-semibold text-[#F59E0B]"}>
                    {item.severity}
                  </span>{" "}
                  <span className="ml-3">Vol: {item.volume}</span>
                  <span className="ml-3">Score: {item.score}</span>
                  <span className="ml-3">Owner: {item.owner}</span>
                </p>
                <p className="my-2 text-base text-[#536883]">{item.quote}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => setSelectedIssue(item)}>
                    View Reviews
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedIssue(item);
                      notify("Brief generated", `Draft brief prepared for ${item.brand} - ${item.issue}.`);
                    }}
                  >
                    Generate Brief
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold leading-tight text-[#1A1A2E] md:text-3xl">
              Fastest-Moving Issues
            </CardTitle>
            <CardDescription className="text-base text-[#64748B]">
              New themes gaining volume this week vs last
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {fastIssues.map((item) => {
              const positive = item.delta > 0;
              const width = Math.max(20, Math.min(100, Math.abs(item.delta)));
              return (
                <div key={item.label}>
                  <p className="mb-1 flex items-center gap-2 text-lg font-semibold text-[#1A1A2E]">
                    {positive ? <TrendingUp className="h-4 w-4 text-[#DA291C]" /> : <TrendingDown className="h-4 w-4 text-[#16A34A]" />}
                    {item.label}
                  </p>
                  <div className="h-10 rounded-lg bg-[#F2F4F8]">
                    <div
                      className={`h-full rounded-lg ${positive ? "bg-[#DA291C]" : "bg-[#16A34A]"}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <p className={positive ? "font-semibold text-[#DA291C]" : "font-semibold text-[#16A34A]"}>
                      {item.delta > 0 ? `+${item.delta}% WoW` : `${item.delta}% WoW`}
                    </p>
                    <p className="text-[#64748B]">[{item.mentions} mentions]</p>
                  </div>
                  {!positive ? <p className="text-xs text-[#16A34A]">(improving)</p> : null}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold leading-tight text-[#1A1A2E] md:text-3xl">
            5 Vectors of Superiority Scores - P&G Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {vectors.map((vector) => (
            <div
              key={vector.key}
              className={`rounded-xl border border-t-4 p-4 ${
                vector.tone === "blue" ? "border-[#003DA5]" : "border-[#F59E0B]"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-[#1A1A2E]">{vector.key}</p>
              <p className="mt-2 flex items-center gap-1 text-2xl font-bold leading-none text-[#1A1A2E]">
                <Star className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]" />
                {vector.score.toFixed(2)}/5
              </p>
              <div className="my-3 grid place-items-center">
                <svg width="92" height="92" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="36" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    fill="none"
                    stroke={vector.tone === "blue" ? "#003DA5" : "#F59E0B"}
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={ringDash(vector.percent)}
                    transform="rotate(-90 48 48)"
                  />
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="fill-[#1A1A2E] text-sm font-semibold"
                  >
                    {vector.percent}%
                  </text>
                </svg>
              </div>
              <p
                className={`text-base font-semibold ${
                  vector.delta > 0 ? "text-[#16A34A]" : vector.delta < 0 ? "text-[#DA291C]" : "text-[#64748B]"
                }`}
              >
                {vector.delta > 0 ? "+" : ""}
                {vector.delta === 0 ? "Stable" : vector.delta.toFixed(2)}
              </p>
              <p className="text-xs text-[#64748B]">vs prior month</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-[#64748B]">Top keyword:</p>
              <p className="text-lg font-semibold text-[#1A1A2E]">{vector.keyword}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold leading-tight text-[#1A1A2E] md:text-3xl">
            Market Operations Signals
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-3">
          {marketSignals.map((signal) => (
            <div key={signal.title} className={`rounded-xl border-2 p-4 ${signal.border} ${signal.bg}`}>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#1A1A2E]">
                <signal.icon className="h-5 w-5" />
                {signal.title}
              </p>
              <p className="text-lg font-semibold text-[#1A1A2E]">{signal.subtitle}</p>
              <p className="mt-2 text-sm text-[#536883]">{signal.detail}</p>
              <p className="mt-1 text-sm text-[#64748B]">{signal.hint}</p>
              <QuickInsightAction
                variant="text"
                pageKey="brand-overview"
                buttonLabel="What This Means"
                subject={signal.title}
                contextLines={[signal.subtitle, signal.detail, signal.hint]}
                className="mt-3"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-6 left-4 z-30 inline-flex items-center gap-3 rounded-full bg-[#003DA5] px-6 py-3 text-lg font-semibold text-white shadow-xl lg:left-[96px]"
      >
        <MessageSquare className="h-5 w-5" />
        AI Assistant
      </button>

      <Dialog
        open={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        title={selectedIssue ? `${selectedIssue.brand} - ${selectedIssue.issue}` : "Issue detail"}
        description="Issue detail, sample review context, and owner routing for the selected queue item."
      >
        {selectedIssue ? (
          <div className="space-y-3">
            <p className="text-sm text-[#1A1A2E]">Sample review quote: {selectedIssue.quote}</p>
            <p className="text-sm text-[#536883]">
              Severity {selectedIssue.severity} | Vol {selectedIssue.volume} | Urgency score {selectedIssue.score}
            </p>
            <div className="rounded-md border border-[#D7E1EF] bg-[#F6F9FF] p-3 text-sm text-[#334866]">
              Recommended next step: generate a short owner brief and route to {selectedIssue.owner} for same-day review.
            </div>
          </div>
        ) : null}
      </Dialog>

      <Dialog
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        title="AI Assistant (Simulated)"
        description="Ask for quick summaries from current brand, issue, and trend context."
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setAssistantReply(
                  "Top risk: scent complaint acceleration in Downy. Recommend immediate product and messaging review.",
                )
              }
            >
              Summarize top risk
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setAssistantReply(
                  "Trend outlook: P&G ratings remain strong overall, with short-term pressure from packaging and value perception.",
                )
              }
            >
              Trend outlook
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                setAssistantReply(
                  "Action brief drafted: prioritize issue #1 and #2 with R&D + Supply owners, then monitor fast-moving issue deltas for 48 hours.",
                )
              }
            >
              Draft action brief
            </Button>
          </div>
          <div className="rounded-md border border-[#D7E1EF] bg-[#F6F9FF] p-3 text-sm text-[#334866]">
            {assistantReply}
          </div>
        </div>
      </Dialog>
    </section>
  );
}
