import type { AiValidationIssueDto } from "../types";

type AiValidationPanelProps = {
  issues: AiValidationIssueDto[];
};

export const AiValidationPanel = ({ issues }: AiValidationPanelProps) => {
  if (issues.length === 0) {
    return <p className="text-[12px] text-muted-foreground">Проверка без замечаний.</p>;
  }

  return (
    <div className="space-y-1.5">
      {issues.map((issue, index) => (
        <div
          key={`${issue.code}-${index}`}
          className={
            issue.severity === "error"
              ? "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] text-destructive"
              : "rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-700"
          }
        >
          <span className="font-semibold">{issue.code}</span>
          <span className="ml-2">{issue.message}</span>
          {issue.stepIndex !== undefined && (
            <span className="ml-2 text-muted-foreground">Шаг {issue.stepIndex + 1}</span>
          )}
        </div>
      ))}
    </div>
  );
};
