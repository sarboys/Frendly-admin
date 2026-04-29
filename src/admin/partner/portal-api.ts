import { partnerApiRequest } from "./api";
import type {
  PartnerCommunity,
  PartnerFeaturedRequest,
  PartnerListResponse,
  PartnerMeetup,
  PartnerPoster,
} from "./types";

export function listPartnerMeetups() {
  return partnerApiRequest<PartnerListResponse<PartnerMeetup>>("/partner/portal/meetups");
}

export function createPartnerMeetup(input: Record<string, unknown>) {
  return partnerApiRequest<PartnerMeetup>("/partner/portal/meetups", json("POST", input));
}

export function getPartnerMeetup(meetupId: string) {
  return partnerApiRequest<PartnerMeetup>(`/partner/portal/meetups/${meetupId}`);
}

export function updatePartnerMeetup(meetupId: string, input: Record<string, unknown>) {
  return partnerApiRequest<PartnerMeetup>(
    `/partner/portal/meetups/${meetupId}`,
    json("PATCH", input),
  );
}

export function cancelPartnerMeetup(meetupId: string) {
  return partnerApiRequest<{ ok: true }>(
    `/partner/portal/meetups/${meetupId}/cancel`,
    json("POST"),
  );
}

export function listPartnerCommunities() {
  return partnerApiRequest<PartnerListResponse<PartnerCommunity>>("/partner/portal/communities");
}

export function createPartnerCommunity(input: Record<string, unknown>) {
  return partnerApiRequest<PartnerCommunity>("/partner/portal/communities", json("POST", input));
}

export function getPartnerCommunity(communityId: string) {
  return partnerApiRequest<PartnerCommunity>(`/partner/portal/communities/${communityId}`);
}

export function updatePartnerCommunity(communityId: string, input: Record<string, unknown>) {
  return partnerApiRequest<PartnerCommunity>(
    `/partner/portal/communities/${communityId}`,
    json("PATCH", input),
  );
}

export function archivePartnerCommunity(communityId: string) {
  return partnerApiRequest<{ ok: true }>(
    `/partner/portal/communities/${communityId}/archive`,
    json("POST"),
  );
}

export function listPartnerPosters() {
  return partnerApiRequest<PartnerListResponse<PartnerPoster>>("/partner/portal/posters");
}

export function createPartnerPoster(input: Record<string, unknown>) {
  return partnerApiRequest<PartnerPoster>("/partner/portal/posters", json("POST", input));
}

export function updatePartnerPoster(posterId: string, input: Record<string, unknown>) {
  return partnerApiRequest<PartnerPoster>(
    `/partner/portal/posters/${posterId}`,
    json("PATCH", input),
  );
}

export function submitPartnerPoster(posterId: string) {
  return partnerApiRequest<PartnerPoster>(
    `/partner/portal/posters/${posterId}/submit`,
    json("POST"),
  );
}

export function archivePartnerPoster(posterId: string) {
  return partnerApiRequest<PartnerPoster>(
    `/partner/portal/posters/${posterId}/archive`,
    json("POST"),
  );
}

export function listPartnerFeaturedRequests() {
  return partnerApiRequest<PartnerListResponse<PartnerFeaturedRequest>>(
    "/partner/portal/featured-requests",
  );
}

export function createPartnerFeaturedRequest(input: Record<string, unknown>) {
  return partnerApiRequest<PartnerFeaturedRequest>(
    "/partner/portal/featured-requests",
    json("POST", input),
  );
}

export function submitPartnerFeaturedRequest(requestId: string) {
  return partnerApiRequest<PartnerFeaturedRequest>(
    `/partner/portal/featured-requests/${requestId}/submit`,
    json("POST"),
  );
}

export function archivePartnerFeaturedRequest(requestId: string) {
  return partnerApiRequest<PartnerFeaturedRequest>(
    `/partner/portal/featured-requests/${requestId}/archive`,
    json("POST"),
  );
}

function json(method: "POST" | "PATCH", body?: unknown): RequestInit {
  return {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  };
}
