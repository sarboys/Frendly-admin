import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AiDraftDto } from "../types";
import { AiValidationPanel } from "./AiValidationPanel";

type AiDraftListProps = {
  drafts: AiDraftDto[];
  status: string;
  isLoading: boolean;
  convertingDraftId: string | null;
  onConvert: (draft: AiDraftDto) => void;
};

export const AiDraftList = ({
  drafts,
  status,
  isLoading,
  convertingDraftId,
  onConvert,
}: AiDraftListProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold">AI drafts</p>
          <p className="text-[12px] text-muted-foreground">Статус запуска: {status}</p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Генерация...
          </div>
        )}
      </div>

      {drafts.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted-foreground">Черновиков пока нет.</p>
      ) : (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {drafts.map((draft) => {
            const hasErrors = draft.validationStatus === "invalid";
            return (
              <article key={draft.id} className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold">{draft.title}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">{draft.description}</p>
                  </div>
                  <div className="rounded-md border border-border px-2 py-1 text-[12px] font-semibold tabular-nums">
                    {draft.score}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span>{draft.durationLabel}</span>
                  <span>{draft.budget}</span>
                  <span>{draft.totalPriceFrom} ₽</span>
                  <span>{draft.steps.length} шага</span>
                </div>
                <div className="mt-3 space-y-2">
                  {draft.steps.map((step) => (
                    <div key={step.id} className="rounded-md bg-muted px-3 py-2 text-[12px]">
                      <span className="font-semibold">{step.timeLabel}</span>
                      <span className="ml-2">{step.title}</span>
                      <span className="ml-2 text-muted-foreground">{step.venueId}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <AiValidationPanel issues={draft.validationIssues} />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="mt-3"
                  disabled={hasErrors || convertingDraftId === draft.id}
                  onClick={() => onConvert(draft)}
                >
                  Выбрать draft
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
