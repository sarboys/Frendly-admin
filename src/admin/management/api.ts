import { adminApiRequest } from "../api/client";
import type {
  AdminAfficheContentItemDto,
  AdminCommunityDetailDto,
  AdminCommunityListItemDto,
  AdminMeetupDetailDto,
  AdminMeetupListItemDto,
  AdminPosterDto,
  AdminUserDetailDto,
  AdminUserListItemDto,
  CursorPageDto,
  QueryParams,
} from "./types";

export function listAdminUsers(params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<AdminUserListItemDto>>(
    withQuery("/admin/users", params),
  );
}

export function getAdminUser(userId: string) {
  return adminApiRequest<AdminUserDetailDto>(`/admin/users/${userId}`);
}

export function updateAdminUserProfile(userId: string, input: Record<string, unknown>) {
  return adminApiRequest<AdminUserDetailDto>(
    `/admin/users/${userId}/profile`,
    json("PATCH", input),
  );
}

export function verifyAdminUser(userId: string) {
  return adminApiRequest<AdminUserDetailDto>(`/admin/users/${userId}/verify`, json("POST"));
}

export function unverifyAdminUser(userId: string) {
  return adminApiRequest<AdminUserDetailDto>(`/admin/users/${userId}/unverify`, json("POST"));
}

export function suspendAdminUser(userId: string, input: { reason?: string } = {}) {
  return adminApiRequest<AdminUserDetailDto>(
    `/admin/users/${userId}/suspend`,
    json("POST", input),
  );
}

export function unsuspendAdminUser(userId: string) {
  return adminApiRequest<AdminUserDetailDto>(`/admin/users/${userId}/unsuspend`, json("POST"));
}

export function revokeAdminUserSessions(userId: string) {
  return adminApiRequest<{ revokedCount: number }>(
    `/admin/users/${userId}/revoke-sessions`,
    json("POST"),
  );
}

export function listAdminUserMeetups(userId: string, params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<Record<string, unknown>>>(
    withQuery(`/admin/users/${userId}/meetups`, params),
  );
}

export function listAdminUserReports(userId: string, params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<Record<string, unknown>>>(
    withQuery(`/admin/users/${userId}/reports`, params),
  );
}

export function listAdminUserAudit(userId: string, params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<Record<string, unknown>>>(
    withQuery(`/admin/users/${userId}/audit`, params),
  );
}

export function listAdminMeetups(params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<AdminMeetupListItemDto>>(
    withQuery("/admin/meetups", params),
  );
}

export function createAdminMeetup(input: Record<string, unknown>) {
  return adminApiRequest<AdminMeetupDetailDto>("/admin/meetups", json("POST", input));
}

export function getAdminMeetup(meetupId: string) {
  return adminApiRequest<AdminMeetupDetailDto>(`/admin/meetups/${meetupId}`);
}

export function updateAdminMeetup(meetupId: string, input: Record<string, unknown>) {
  return adminApiRequest<AdminMeetupDetailDto>(
    `/admin/meetups/${meetupId}`,
    json("PATCH", input),
  );
}

export function cancelAdminMeetup(meetupId: string, input: { reason?: string } = {}) {
  return adminApiRequest<AdminMeetupDetailDto>(
    `/admin/meetups/${meetupId}/cancel`,
    json("POST", input),
  );
}

export function restoreAdminMeetup(meetupId: string) {
  return adminApiRequest<AdminMeetupDetailDto>(`/admin/meetups/${meetupId}/restore`, json("POST"));
}

export function listAdminMeetupParticipants(meetupId: string, params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<Record<string, unknown>>>(
    withQuery(`/admin/meetups/${meetupId}/participants`, params),
  );
}

export function removeAdminMeetupParticipant(meetupId: string, participantId: string) {
  return adminApiRequest<{ ok: boolean }>(
    `/admin/meetups/${meetupId}/participants/${participantId}/remove`,
    json("POST"),
  );
}

export function listAdminMeetupJoinRequests(meetupId: string, params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<Record<string, unknown>>>(
    withQuery(`/admin/meetups/${meetupId}/join-requests`, params),
  );
}

export function approveAdminMeetupJoinRequest(meetupId: string, requestId: string) {
  return adminApiRequest<{ ok: boolean }>(
    `/admin/meetups/${meetupId}/join-requests/${requestId}/approve`,
    json("POST"),
  );
}

export function rejectAdminMeetupJoinRequest(meetupId: string, requestId: string) {
  return adminApiRequest<{ ok: boolean }>(
    `/admin/meetups/${meetupId}/join-requests/${requestId}/reject`,
    json("POST"),
  );
}

export function listAdminCommunities(params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<AdminCommunityListItemDto>>(
    withQuery("/admin/communities", params),
  );
}

export function createAdminCommunity(input: Record<string, unknown>) {
  return adminApiRequest<AdminCommunityDetailDto>("/admin/communities", json("POST", input));
}

export function getAdminCommunity(communityId: string) {
  return adminApiRequest<AdminCommunityDetailDto>(`/admin/communities/${communityId}`);
}

export function updateAdminCommunity(communityId: string, input: Record<string, unknown>) {
  return adminApiRequest<AdminCommunityDetailDto>(
    `/admin/communities/${communityId}`,
    json("PATCH", input),
  );
}

export function archiveAdminCommunity(communityId: string) {
  return adminApiRequest<AdminCommunityDetailDto>(
    `/admin/communities/${communityId}/archive`,
    json("POST"),
  );
}

export function restoreAdminCommunity(communityId: string) {
  return adminApiRequest<AdminCommunityDetailDto>(
    `/admin/communities/${communityId}/restore`,
    json("POST"),
  );
}

export function listAdminCommunityMembers(communityId: string, params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<Record<string, unknown>>>(
    withQuery(`/admin/communities/${communityId}/members`, params),
  );
}

export function removeAdminCommunityMember(communityId: string, memberId: string) {
  return adminApiRequest<{ ok: boolean }>(
    `/admin/communities/${communityId}/members/${memberId}/remove`,
    json("POST"),
  );
}

export function updateAdminCommunityMemberRole(
  communityId: string,
  memberId: string,
  input: { role: string },
) {
  return adminApiRequest<Record<string, unknown>>(
    `/admin/communities/${communityId}/members/${memberId}/role`,
    json("PATCH", input),
  );
}

export function listAdminCommunityNews(communityId: string, params: QueryParams = {}) {
  return adminApiRequest<{ items: Array<Record<string, unknown>> }>(
    withQuery(`/admin/communities/${communityId}/news`, params),
  );
}

export function createAdminCommunityNews(communityId: string, input: Record<string, unknown>) {
  return adminApiRequest<Record<string, unknown>>(
    `/admin/communities/${communityId}/news`,
    json("POST", input),
  );
}

export function updateAdminCommunityNews(communityId: string, newsId: string, input: Record<string, unknown>) {
  return adminApiRequest<{ ok: boolean }>(
    `/admin/communities/${communityId}/news/${newsId}`,
    json("PATCH", input),
  );
}

export function deleteAdminCommunityNews(communityId: string, newsId: string) {
  return adminApiRequest<{ ok: boolean }>(
    `/admin/communities/${communityId}/news/${newsId}`,
    json("DELETE"),
  );
}

export function listAdminCommunityMedia(communityId: string, params: QueryParams = {}) {
  return adminApiRequest<{ items: Array<Record<string, unknown>> }>(
    withQuery(`/admin/communities/${communityId}/media`, params),
  );
}

export function createAdminCommunityMedia(communityId: string, input: Record<string, unknown>) {
  return adminApiRequest<Record<string, unknown>>(
    `/admin/communities/${communityId}/media`,
    json("POST", input),
  );
}

export function updateAdminCommunityMedia(communityId: string, mediaId: string, input: Record<string, unknown>) {
  return adminApiRequest<{ ok: boolean }>(
    `/admin/communities/${communityId}/media/${mediaId}`,
    json("PATCH", input),
  );
}

export function deleteAdminCommunityMedia(communityId: string, mediaId: string) {
  return adminApiRequest<{ ok: boolean }>(
    `/admin/communities/${communityId}/media/${mediaId}`,
    json("DELETE"),
  );
}

export function listAdminPosters(params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<AdminPosterDto>>(
    withQuery("/admin/affiche/posters", params),
  );
}

export function createAdminPoster(input: Record<string, unknown>) {
  return adminApiRequest<AdminPosterDto>("/admin/affiche/posters", json("POST", input));
}

export function getAdminPoster(posterId: string) {
  return adminApiRequest<AdminPosterDto>(`/admin/affiche/posters/${posterId}`);
}

export function updateAdminPoster(posterId: string, input: Record<string, unknown>) {
  return adminApiRequest<AdminPosterDto>(
    `/admin/affiche/posters/${posterId}`,
    json("PATCH", input),
  );
}

export function publishAdminPoster(posterId: string) {
  return posterAction(posterId, "publish");
}

export function hideAdminPoster(posterId: string) {
  return posterAction(posterId, "hide");
}

export function rejectAdminPoster(posterId: string) {
  return posterAction(posterId, "reject");
}

export function archiveAdminPoster(posterId: string) {
  return posterAction(posterId, "archive");
}

export function featureAdminPoster(posterId: string) {
  return posterAction(posterId, "feature");
}

export function unfeatureAdminPoster(posterId: string) {
  return posterAction(posterId, "unfeature");
}

export function listAdminAfficheContentItems(params: QueryParams = {}) {
  return adminApiRequest<CursorPageDto<AdminAfficheContentItemDto>>(
    withQuery("/admin/affiche/content-items", params),
  );
}

export function getAdminAfficheContentItem(itemId: string) {
  return adminApiRequest<AdminAfficheContentItemDto>(
    `/admin/affiche/content-items/${itemId}`,
  );
}

export function updateAdminAfficheContentItem(itemId: string, input: Record<string, unknown>) {
  return adminApiRequest<AdminAfficheContentItemDto>(
    `/admin/affiche/content-items/${itemId}`,
    json("PATCH", input),
  );
}

export function moderateAdminAfficheContentItem(itemId: string, action: string) {
  return adminApiRequest<AdminAfficheContentItemDto>(
    `/admin/affiche/content-items/${itemId}/${action}`,
    json("POST"),
  );
}

export function withQuery(path: string, params: QueryParams = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

function posterAction(posterId: string, action: string) {
  return adminApiRequest<AdminPosterDto>(
    `/admin/affiche/posters/${posterId}/${action}`,
    json("POST"),
  );
}

function json(method: "POST" | "PATCH" | "DELETE", body?: unknown): RequestInit {
  return {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  };
}
