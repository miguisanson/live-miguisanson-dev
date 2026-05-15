import { HelpTip } from "../help/help-tip";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
  helpText?: string;
}

export function PageHeader({
  title,
  subtitle,
  right,
  helpText,
}: PageHeaderProps): React.ReactElement {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[30px] font-bold tracking-tight text-[#1A1A2E]">{title}</h1>
          {helpText ? <HelpTip title={title} content={helpText} /> : null}
        </div>
        <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>
      </div>
      {right ? <div className="flex flex-wrap items-center gap-2">{right}</div> : null}
    </div>
  );
}
