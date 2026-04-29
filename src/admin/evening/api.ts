import { adminApiRequest } from "../api/client";
import type {
  AiBriefDto,
  AiBriefInput,
  AiDraftDto,
  AiGenerateResponseDto,
  AdminEveningRouteTemplateDto,
  ListResponse,
  PartnerDto,
  PartnerInput,
  PartnerOfferDto,
  PartnerOfferInput,
  RouteRevisionInput,
  RouteTemplateInput,
  VenueDto,
  VenueInput,
} from "./types";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

export function listPartners(params: QueryParams = {}) {
  return adminApiRequest<ListResponse<PartnerDto>>(
    withQuery("/admin/evening/partners", params),
  );
}

export function createPartner(input: PartnerInput) {
  return adminApiRequest<PartnerDto>("/admin/evening/partners", json("POST", input));
}

export function updatePartner(partnerId: string, input: Partial<PartnerInput>) {
  return adminApiRequest<PartnerDto>(
    `/admin/evening/partners/${partnerId}`,
    json("PATCH", input),
  );
}

export function listVenues(params: QueryParams = {}) {
  return adminApiRequest<ListResponse<VenueDto>>(
    withQuery("/admin/evening/venues", params),
  );
}

export function createVenue(input: VenueInput) {
  return adminApiRequest<VenueDto>("/admin/evening/venues", json("POST", input));
}

export function updateVenue(venueId: string, input: Partial<VenueInput>) {
  return adminApiRequest<VenueDto>(
    `/admin/evening/venues/${venueId}`,
    json("PATCH", input),
  );
}

export function listOffers(params: QueryParams = {}) {
  return adminApiRequest<ListResponse<PartnerOfferDto>>(
    withQuery("/admin/evening/offers", params),
  );
}

export function createOffer(input: PartnerOfferInput) {
  return adminApiRequest<PartnerOfferDto>(
    "/admin/evening/offers",
    json("POST", input),
  );
}

export function updateOffer(
  offerId: string,
  input: Partial<PartnerOfferInput>,
) {
  return adminApiRequest<PartnerOfferDto>(
    `/admin/evening/offers/${offerId}`,
    json("PATCH", input),
  );
}

export function listRouteTemplates(params: QueryParams = {}) {
  return adminApiRequest<ListResponse<AdminEveningRouteTemplateDto>>(
    withQuery("/admin/evening/route-templates", params),
  );
}

export function getRouteTemplate(templateId: string) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    `/admin/evening/route-templates/${templateId}`,
  );
}

export function createRouteTemplate(input: RouteTemplateInput) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    "/admin/evening/route-templates",
    json("POST", input),
  );
}

export function updateRouteTemplate(
  templateId: string,
  input: Partial<RouteTemplateInput>,
) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    `/admin/evening/route-templates/${templateId}`,
    json("PATCH", input),
  );
}

export function saveRouteRevision(
  templateId: string,
  input: RouteRevisionInput,
) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    `/admin/evening/route-templates/${templateId}/revisions`,
    json("POST", input),
  );
}

export function publishRouteTemplate(templateId: string) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    `/admin/evening/route-templates/${templateId}/publish`,
    json("POST"),
  );
}

export function archiveRouteTemplate(templateId: string) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    `/admin/evening/route-templates/${templateId}/archive`,
    json("POST"),
  );
}

export function createAiBrief(input: AiBriefInput) {
  return adminApiRequest<AiBriefDto>("/admin/evening/ai/briefs", json("POST", input));
}

export function generateAiDrafts(briefId: string) {
  return adminApiRequest<AiGenerateResponseDto>(
    `/admin/evening/ai/briefs/${briefId}/generate`,
    json("POST"),
  );
}

export function listAiDrafts(briefId: string) {
  return adminApiRequest<ListResponse<AiDraftDto>>(
    `/admin/evening/ai/briefs/${briefId}/drafts`,
  );
}

export function convertAiDraft(draftId: string) {
  return adminApiRequest<AdminEveningRouteTemplateDto>(
    `/admin/evening/ai/drafts/${draftId}/convert`,
    json("POST"),
  );
}

function json(method: "POST" | "PATCH", body?: unknown): RequestInit {
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
