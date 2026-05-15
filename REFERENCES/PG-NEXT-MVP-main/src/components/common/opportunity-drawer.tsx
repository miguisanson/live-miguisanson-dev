import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { opportunityCards } from "../../data/mock-data";

interface OpportunityDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function OpportunityDrawer({
  open,
  onClose,
}: OpportunityDrawerProps): React.ReactElement | null {
  if (!open) {
    return null;
  }

  const alignedCount = opportunityCards.filter(
    (item) => item.stage === "Available Next",
  ).length;
  const stretchCount = opportunityCards.length - alignedCount;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-[rgba(15,24,34,0.45)] backdrop-blur-[1px]">
      <aside className="h-full w-full max-w-md border-l border-slate-200 bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Opportunity Mode</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Explore Next-Phase Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              <span>Available Next</span>
              <Badge variant="success">{alignedCount}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-[var(--bg-soft)] p-3 text-sm">
              <span>Future Enhancements</span>
              <Badge variant="info">{stretchCount}</Badge>
            </div>
            <p className="text-xs text-slate-600">
              Guardrail: AI suggests actions. Humans or approved scripts execute
              recovery. No autonomous high-risk changes.
            </p>
            <Link to="/opportunities" onClick={onClose}>
              <Button className="w-full">Open Opportunity Portfolio</Button>
            </Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
