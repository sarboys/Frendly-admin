import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "../../components/StatusBadge";
import { RouteReviewStepList } from "./RouteReviewStepList";
import type { RouteReviewDraftDto } from "../routeReviewTypes";

type Props = {
  draft: RouteReviewDraftDto;
  isBusy: boolean;
  onApprove: (draft: RouteReviewDraftDto, note: string) => void;
  onReject: (draft: RouteReviewDraftDto, note: string) => void;
  onConvert: (draft: RouteReviewDraftDto) => void;
  onPublish: (draft: RouteReviewDraftDto) => void;
};

export const RouteReviewDraftCard = ({
  draft,
  isBusy,
  onApprove,
  onReject,
  onConvert,
  onPublish,
}: Props) => {
  const [note, setNote] = useState(draft.reviewNote ?? "");
  const canApprove = draft.status === "needs_review" && draft.validationStatus !== "invalid";
  const canReject = draft.status === "needs_review" || draft.status === "approved";
  const canConvert = draft.status === "approved";
  const canPublish = draft.status === "converted";

  return (
    <article className="rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[16px] font-semibold">{draft.title}</h2>
            <StatusBadge status={draft.status} />
            <StatusBadge status={draft.validationStatus} />
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">{draft.description}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
            <span>{draft.city}</span>
            <span>{draft.area ?? "без района"}</span>
            <span>{draft.mood}</span>
            <span>{draft.budget}</span>
            <span>score {draft.score}</span>
            <span>{draft.durationLabel}</span>
            <span>от {draft.totalPriceFrom} ₽</span>
          </div>
        </div>
        {draft.createdTemplateId ? (
          <Button asChild variant="outline" size="sm">
            <Link to={`/evening-routes/${draft.createdTemplateId}`}>Open template</Link>
          </Button>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        {draft.validationIssues.length > 0 ? (
          <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-[12px] text-muted-foreground">
            {draft.validationIssues.map((issue) => (
              <p key={`${issue.code}-${issue.stepIndex ?? "route"}`}>
                {issue.severity}: {issue.code}, {issue.message}
              </p>
            ))}
          </div>
        ) : null}

        <RouteReviewStepList steps={draft.steps} />

        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Review note"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={!canApprove || isBusy}
              onClick={() => onApprove(draft, note)}
            >
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={!canReject || isBusy}
              onClick={() => {
                if (window.confirm("Reject this generated route draft?")) {
                  onReject(draft, note);
                }
              }}
            >
              Reject
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!canConvert || isBusy}
              onClick={() => onConvert(draft)}
            >
              Convert
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!canPublish || isBusy}
              onClick={() => onPublish(draft)}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
