import type { RouteReviewDraftStepDto } from "../routeReviewTypes";

type Props = {
  steps: RouteReviewDraftStepDto[];
};

export const RouteReviewStepList = ({ steps }: Props) => (
  <div className="divide-y divide-border rounded-md border border-border">
    {steps.map((step) => (
      <div key={step.id} className="grid gap-2 px-3 py-2 md:grid-cols-[90px_minmax(0,1fr)_120px]">
        <div className="text-[12px] text-muted-foreground">
          <span className="font-medium text-foreground">{step.timeLabel}</span>
          {step.endTimeLabel ? <span> до {step.endTimeLabel}</span> : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold">
            {step.emoji} {step.title}
          </p>
          <p className="truncate text-[12px] text-muted-foreground">
            {step.venue}, {step.address}
          </p>
          {step.description ? (
            <p className="mt-1 text-[12px] text-muted-foreground">{step.description}</p>
          ) : null}
          {step.sourceUrl ? (
            <a
              className="mt-1 inline-flex text-[12px] font-medium text-primary"
              href={step.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {step.sourceName ?? "source"}
            </a>
          ) : null}
        </div>
        <div className="text-[12px] text-muted-foreground md:text-right">
          <p>{step.distanceLabel || "нет дистанции"}</p>
          <p>{step.walkMin == null ? "walk n/a" : `${step.walkMin} мин`}</p>
        </div>
      </div>
    ))}
  </div>
);
