import type { KpiStat } from "../../types/models";
import { HelpTip } from "../help/help-tip";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { StatusChip } from "./status-chip";

export function KpiCard({ stat }: { stat: KpiStat }): React.ReactElement {
  return (
    <Card className="h-full">
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1">
            <CardTitle className="text-xs uppercase tracking-wide text-[var(--muted-fg)]">
              {stat.title}
            </CardTitle>
            <HelpTip
              title={stat.title}
              content="This KPI is simulated from local data and indicates current operational reliability impact."
            />
          </div>
          <StatusChip state={stat.state} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-1">
        <p className="whitespace-nowrap text-[22px] font-bold text-[#1A1A2E]">{stat.value}</p>
        <p className="text-xs text-[#64748B]">{stat.subValue}</p>
      </CardContent>
    </Card>
  );
}
