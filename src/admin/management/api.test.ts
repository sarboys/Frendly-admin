import { afterEach, describe, expect, it, vi } from "vitest";
import {
  approveAdminMeetupJoinRequest,
  cancelAdminMeetup,
  createAdminCommunity,
  createAdminMeetup,
  createAdminPoster,
  deleteAdminCommunityNews,
  listAdminUsers,
  moderateAdminAfficheContentItem,
  publishAdminPoster,
  revokeAdminUserSessions,
  suspendAdminUser,
  updateAdminAfficheContentItem,
  updateAdminCommunityMemberRole,
  updateAdminMeetup,
  updateAdminUserProfile,
  withQuery,
} from "./api";

describe("management admin api", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds query strings and skips empty values", async () => {
    const fetchMock = mockFetch({ items: [], nextCursor: null });

    await listAdminUsers({
      q: "Анна",
      city: "",
      status: null,
      verified: false,
      limit: 20,
    });

    expect(withQuery("/admin/users", { q: "Анна", city: "", limit: 20 })).toBe(
      "/admin/users?q=%D0%90%D0%BD%D0%BD%D0%B0&limit=20",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/admin/users?q=%D0%90%D0%BD%D0%BD%D0%B0&verified=false&limit=20",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("sends users mutations with method and body", async () => {
    const fetchMock = mockFetch({});

    await updateAdminUserProfile("user-1", { displayName: "Анна" });
    await suspendAdminUser("user-1", { reason: "spam" });
    await revokeAdminUserSessions("user-1");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/admin/users/user-1/profile",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ displayName: "Анна" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/admin/users/user-1/suspend",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ reason: "spam" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "http://localhost:3000/admin/users/user-1/revoke-sessions",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sends meetups mutations with method and body", async () => {
    const fetchMock = mockFetch({});

    await createAdminMeetup({ title: "Meetup" });
    await updateAdminMeetup("meetup-1", { capacity: 12 });
    await cancelAdminMeetup("meetup-1", { reason: "rain" });
    await approveAdminMeetupJoinRequest("meetup-1", "request-1");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/admin/meetups",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ title: "Meetup" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/admin/meetups/meetup-1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ capacity: 12 }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "http://localhost:3000/admin/meetups/meetup-1/cancel",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ reason: "rain" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      "http://localhost:3000/admin/meetups/meetup-1/join-requests/request-1/approve",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("sends communities mutations with method and body", async () => {
    const fetchMock = mockFetch({});

    await createAdminCommunity({ name: "Books" });
    await updateAdminCommunityMemberRole("community-1", "member-1", { role: "moderator" });
    await deleteAdminCommunityNews("community-1", "news-1");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/admin/communities",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Books" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/admin/communities/community-1/members/member-1/role",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ role: "moderator" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "http://localhost:3000/admin/communities/community-1/news/news-1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("sends affiche mutations with method and body", async () => {
    const fetchMock = mockFetch({});

    await createAdminPoster({ id: "poster-1" });
    await publishAdminPoster("poster-1");
    await updateAdminAfficheContentItem("item-1", { title: "Updated" });
    await moderateAdminAfficheContentItem("item-1", "force-free");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/admin/affiche/posters",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ id: "poster-1" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/admin/affiche/posters/poster-1/publish",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "http://localhost:3000/admin/affiche/content-items/item-1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      "http://localhost:3000/admin/affiche/content-items/item-1/force-free",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

function mockFetch(body: unknown) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}
