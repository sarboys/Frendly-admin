export type RouteReviewDraftStepDto = {
  id: string;
  sortOrder: number;
  externalContentItemId: string | null;
  timeLabel: string;
  endTimeLabel: string | null;
  kind: string;
  title: string;
  venue: string;
  address: string;
  emoji: string;
  distanceLabel: string;
  walkMin: number | null;
  description: string | null;
  vibeTag: string | null;
  ticketPrice: number | null;
  lat: number;
  lng: number;
  sourceUrl: string | null;
  sourceName: string | null;
  sourceTitle: string | null;
};

export type RouteReviewValidationIssueDto = {
  severity: "error" | "warning";
  code: string;
  message: string;
  stepIndex?: number;
  venueId?: string | null;
};

export type RouteReviewDraftDto = {
  id: string;
  batchId: string;
  status: string;
  title: string;
  description: string;
  city: string;
  timezone: string;
  area: string | null;
  vibe: string;
  budget: string;
  durationLabel: string;
  totalPriceFrom: number;
  goal: string;
  mood: string;
  format: string | null;
  recommendedFor: string | null;
  badgeLabel: string | null;
  score: number;
  validationStatus: string;
  validationIssues: RouteReviewValidationIssueDto[];
  reviewedByAdminId: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdTemplateId: string | null;
  publishedAt: string | null;
  rejectedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  steps: RouteReviewDraftStepDto[];
};

export type RouteReviewDraftListDto = {
  items: RouteReviewDraftDto[];
  nextCursor: string | null;
};

export type RouteReviewActionInput = {
  reviewNote?: string | null;
};

export type RouteReviewSourceDto = {
  id: string;
  code: string;
  name: string;
  kind: string;
  status: string;
  lastImportedAt: string | null;
};

export type RouteReviewSourceListDto = {
  items: RouteReviewSourceDto[];
};

export type RouteReviewImportRunDto = {
  id: string;
  sourceId: string;
  sourceCode: string | null;
  city: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  fetchedCount: number;
  normalizedCount: number;
  skippedCount: number;
  errorCode: string | null;
  errorMessage: string | null;
};

export type RouteReviewImportRunListDto = {
  items: RouteReviewImportRunDto[];
};

export type RouteReviewImportRunInput = {
  city: string;
  sources: string[];
  from: string;
  to: string;
};
