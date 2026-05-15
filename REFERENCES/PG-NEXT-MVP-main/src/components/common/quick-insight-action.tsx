import * as React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { useDemoData } from "../../context/demo-data-context";

interface QuickInsightActionProps {
  pageKey: string;
  subject: string;
  contextLines: string[];
  buttonLabel?: "Quick Insight" | "Explain This" | "Summarize" | "What This Means";
  variant?: "button" | "text";
  className?: string;
}

export function QuickInsightAction({
  pageKey,
  subject,
  contextLines,
  buttonLabel = "Quick Insight",
  variant = "button",
  className,
}: QuickInsightActionProps): React.ReactElement {
  const { generateQuickInsight, getInsightsForPage } = useDemoData();
  const [open, setOpen] = React.useState<boolean>(false);
  const [activeInsightId, setActiveInsightId] = React.useState<string | null>(null);

  const pageHistory = getInsightsForPage(pageKey);
  const activeInsight =
    pageHistory.find((entry) => entry.id === activeInsightId) ?? pageHistory[0] ?? null;

  const generate = React.useCallback(() => {
    const response = generateQuickInsight({
      pageKey,
      subject,
      contextLines,
    });
    setActiveInsightId(response.record.id);
  }, [contextLines, generateQuickInsight, pageKey, subject]);

  const onOpen = () => {
    setOpen(true);
    if (pageHistory.length === 0) {
      generate();
    } else {
      setActiveInsightId(pageHistory[0]?.id ?? null);
    }
  };

  return (
    <>
      {variant === "text" ? (
        <button
          type="button"
          className={`inline-flex items-center gap-1 text-sm font-semibold text-[#003DA5] hover:underline ${className ?? ""}`}
          onClick={onOpen}
          data-testid="quick-insight-trigger"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#003DA5]" />
          {buttonLabel}
        </button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={onOpen}
          data-testid="quick-insight-trigger"
          className={className}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#003DA5]" />
          {buttonLabel}
        </Button>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={subject}
        description="Simulated GenAI/NLP summary generated from local telemetry and business context."
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button size="sm" onClick={generate} data-testid="quick-insight-regenerate">
              Regenerate
            </Button>
          </div>
        }
      >
        {activeInsight ? (
          <div className="space-y-4" data-testid="quick-insight-modal">
            <div className="rounded-lg border border-[#C7D9F8] bg-[#E8F0FC] p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="info">Confidence {Math.round(activeInsight.confidence * 100)}%</Badge>
                <p className="text-xs text-slate-500">{activeInsight.generatedAt}</p>
              </div>
              <p className="text-sm text-slate-800">{activeInsight.summary}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Basis
              </p>
              <ul className="space-y-1 text-sm text-slate-700">
                {activeInsight.basis.map((line) => (
                  <li key={line} className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1.5">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            {pageHistory.length > 1 ? (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Last Generated Insight
                </p>
                <div className="space-y-1">
                  {pageHistory.slice(0, 3).map((entry) => (
                    <button
                      type="button"
                      key={entry.id}
                      onClick={() => setActiveInsightId(entry.id)}
                      className="w-full rounded-md border border-[#E2E8F0] bg-white px-2 py-1.5 text-left text-xs text-slate-700 hover:border-[#C7D9F8]"
                    >
                      {entry.generatedAt} • {entry.subject}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
            Generate a quick insight to get an immediate interpretation.
          </div>
        )}
      </Dialog>
    </>
  );
}
