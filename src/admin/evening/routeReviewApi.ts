import { adminApiRequest } from "../api/client";
import type {
  RouteReviewActionInput,
  RouteReviewContentItemDto,
  RouteReviewContentItemListDto,
  RouteReviewDraftDto,
  RouteReviewDraftListDto,
  RouteReviewGenerationRunInput,
  RouteReviewGenerationRunDto,
  RouteReviewGenerationRunListDto,
  RouteReviewImportRunInput,
  RouteReviewImportRunListDto,
  RouteReviewSourceListDto,
} from "./routeReviewTypes";
import type { AdminEveningRouteTemplateDto } from "./types";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

export function listRouteReviewDrafts(params: QueryParams = {}) {
  return adminApiRequest<RouteReviewDraftListDto>(
    withQuery("/admin/evening/route-review/drafts", params),
  );
}

export function getRouteReviewDraft(draftId: string) {
  return adminApiRequest<RouteReviewDraftDto>(
    `/admin/evening/route-review/drafts/${draftId}`,
  );
}

export function approveRouteReviewDraft(
  draftId: string,
  input: RouteReviewActionInput,
) {
  return adminApiRequest<RouteReviewDraftDto>(
    `/admin/evening/route-review/drafts/${draftId}/approve`,
    json("POST", input),
  );
}

export function rejectRouteReviewDraft(
  draftId: string,
  input: RouteReviewActionInput,
) {
  return adminApiRequest<RouteReviewDraftDto>(
    `/admin/evening/route-review/drafts/${draftId}/reject`,
    json("POST", input),
  );
}

export function convertRouteReviewDraft(draftId: string) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    `/admin/evening/route-review/drafts/${draftId}/convert`,
    json("POST"),
  );
}

export function publishRouteReviewDraft(draftId: string) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    `/admin/evening/route-review/drafts/${draftId}/publish`,
    json("POST"),
  );
}

export function listRouteReviewSources() {
  return adminApiRequest<RouteReviewSourceListDto>(
    "/admin/evening/route-review/sources",
  );
}

export function listRouteReviewImportRuns(params: QueryParams = {}) {
  return adminApiRequest<RouteReviewImportRunListDto>(
    withQuery("/admin/evening/route-review/import-runs", params),
  );
}

export function createRouteReviewImportRun(input: RouteReviewImportRunInput) {
  return adminApiRequest<RouteReviewImportRunListDto>(
    "/admin/evening/route-review/import-runs",
    json("POST", input),
  );
}

export function listRouteReviewContentItems(params: QueryParams = {}) {
  return adminApiRequest<RouteReviewContentItemListDto>(
    withQuery("/admin/evening/route-review/content-items", params),
  );
}

export function moderateRouteReviewContentItem(itemId: string, action: string) {
  return adminApiRequest<RouteReviewContentItemDto>(
    `/admin/evening/route-review/content-items/${itemId}/${action}`,
    json("POST"),
  );
}

export function listRouteReviewGenerationRuns(params: QueryParams = {}) {
  return adminApiRequest<RouteReviewGenerationRunListDto>(
    withQuery("/admin/evening/route-review/generation-runs", params),
  );
}

export function createRouteReviewGenerationRun(input: RouteReviewGenerationRunInput) {
  return adminApiRequest<RouteReviewGenerationRunDto>(
    "/admin/evening/route-review/generation-runs",
    json("POST", input),
  );
}

function json(method: "POST", body?: unknown): RequestInit {
  return {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  };
}

function withQuery(path: string, params: QueryParams) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}
