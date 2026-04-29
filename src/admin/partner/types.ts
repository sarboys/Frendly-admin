export type PartnerListResponse<T> = {
  items: T[];
  nextCursor: string | null;
};

export type PartnerMeetup = {
  id: string;
  partnerId: string;
  title: string;
  emoji: string;
  startsAt: string;
  time: string;
  place: string;
  description: string;
  capacity: number;
  joinMode: string;
  priceMode: string;
  priceAmountFrom: number | null;
  priceAmountTo: number | null;
  participantsCount: number;
  joinRequestsCount: number;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PartnerCommunity = {
  id: string;
  partnerId: string;
  name: string;
  avatar: string;
  description: string;
  privacy: string;
  tags: string[];
  mood: string;
  membersCount: number;
  newsCount: number;
  mediaCount: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PartnerPoster = {
  id: string;
  partnerId: string;
  category: string;
  title: string;
  emoji: string;
  startsAt: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  priceFrom: number;
  ticketUrl: string;
  provider: string;
  tags: string[];
  description: string;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PartnerFeaturedRequest = {
  id: string;
  partnerId: string;
  targetType: "event" | "community" | "poster";
  targetId: string;
  city: string;
  placement: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  status: string;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
};
