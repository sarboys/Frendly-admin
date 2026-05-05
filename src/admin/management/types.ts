export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export type CursorPageDto<T> = {
  items: T[];
  nextCursor: string | null;
};

export type AdminUserListItemDto = {
  id: string;
  displayName: string;
  email: string | null;
  phoneNumber: string | null;
  city: string | null;
  status: string;
  verified: boolean;
  plan: "free" | "plus" | "afterdark";
  hostedMeetupsCount: number;
  joinedMeetupsCount: number;
  reportsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserDetailDto = AdminUserListItemDto & {
  suspendedAt: string | null;
  suspensionReason: string | null;
  profile: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  verification: Record<string, unknown> | null;
  subscription: Record<string, unknown>;
  counts: Record<string, number>;
};

export type AdminMeetupListItemDto = {
  id: string;
  title: string;
  emoji: string;
  city: string | null;
  place: string;
  startsAt: string;
  hostId: string;
  hostName: string;
  partnerId: string | null;
  partnerName: string | null;
  joinMode: string;
  priceMode: string;
  participantsCount: number;
  joinRequestsCount: number;
  capacity: number;
  status: "upcoming" | "live" | "past" | "cancelled";
};

export type AdminMeetupDetailDto = AdminMeetupListItemDto & {
  durationMinutes: number;
  latitude: number | null;
  longitude: number | null;
  vibe: string;
  description: string;
  accessMode: string;
  visibilityMode: string;
  chatId: string | null;
  canceledAt: string | null;
  cancelReason: string | null;
  sourcePoster: Record<string, unknown> | null;
  sourceExternalContentItem: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCommunityListItemDto = {
  id: string;
  name: string;
  avatar: string;
  city: string | null;
  privacy: string;
  ownerId: string;
  ownerName: string;
  partnerId: string | null;
  partnerName?: string | null;
  membersCount: number;
  newsCount: number;
  mediaCount: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCommunityDetailDto = AdminCommunityListItemDto & {
  description: string;
  tags: unknown;
  joinRule: string;
  premiumOnly: boolean;
  mood: string;
  sharedMediaLabel: string;
  chatId: string;
  owner: Record<string, unknown> | null;
  partner: Record<string, unknown> | null;
  socialLinks: Array<Record<string, unknown>>;
};

export type AdminPosterDto = {
  source: "native";
  id: string;
  city: string;
  category: string;
  title: string;
  emoji: string;
  startsAt: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  address: string;
  priceFrom: number;
  ticketUrl: string;
  provider: string;
  tags: string[];
  description: string;
  status: string;
  isFeatured: boolean;
  linkedEventsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminAfficheContentItemDto = {
  source: "imported";
  id: string;
  sourceId: string;
  sourceCode: string | null;
  sourceName: string | null;
  sourceItemId: string;
  contentKind: string;
  city: string;
  title: string;
  shortSummary: string | null;
  category: string;
  tags: string[];
  address: string | null;
  lat: number | null;
  lng: number | null;
  startsAt: string | null;
  endsAt: string | null;
  priceFrom: number | null;
  currency: string | null;
  venueName: string | null;
  imageUrl: string | null;
  actionUrl: string | null;
  actionKind: string | null;
  priceMode: string;
  publicStatus: string;
  moderationStatus: string;
  hasCoords: boolean;
  importedAt: string;
  createdAt: string;
  updatedAt: string;
};
