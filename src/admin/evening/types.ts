export type ListResponse<T> = {
  items: T[];
};

export type PartnerDto = {
  id: string;
  name: string;
  city: string;
  status: string;
  contact: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VenueDto = {
  id: string;
  ownerType: string;
  partnerId: string | null;
  source: string;
  externalId: string | null;
  moderationStatus: string;
  trustLevel: string;
  city: string;
  timezone: string;
  area: string | null;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  tags: unknown;
  averageCheck: number | null;
  openingHours: unknown | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type PartnerOfferDto = {
  id: string;
  partnerId: string;
  venueId: string;
  title: string;
  description: string;
  terms: string | null;
  shortLabel: string | null;
  validFrom: string | null;
  validTo: string | null;
  daysOfWeek: unknown | null;
  timeWindow: unknown | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type EveningRouteTemplateStepDto = {
  id: string;
  time: string;
  endTime: string | null;
  kind: string;
  title: string;
  venue: string;
  address: string;
  emoji: string;
  distance: string;
  walkMin: number | null;
  perk: string | null;
  perkShort: string | null;
  ticketPrice: number | null;
  ticketCommission: number | null;
  sponsored: boolean;
  premium: boolean;
  partnerId: string | null;
  description: string | null;
  vibeTag: string | null;
  lat: number;
  lng: number;
  hasShareable: boolean;
  venueId: string | null;
  partnerOfferId: string | null;
  offerTitle: string | null;
  offerDescription: string | null;
  offerTerms: string | null;
  offerShortLabel: string | null;
};

export type EveningRouteTemplateDetailDto = {
  id: string;
  routeId: string;
  title: string;
  blurb: string;
  city: string;
  area: string | null;
  badgeLabel: string | null;
  coverUrl: string | null;
  vibe: string;
  budget: string;
  durationLabel: string;
  totalPriceFrom: number;
  totalSavings: number;
  goal: string;
  mood: string;
  format: string | null;
  recommendedFor: string | null;
  steps: EveningRouteTemplateStepDto[];
};

export type AdminEveningRouteTemplateDto = {
  id: string;
  source: string;
  status: string;
  city: string;
  timezone: string;
  area: string | null;
  centerLat: number | null;
  centerLng: number | null;
  radiusMeters: number | null;
  currentRouteId: string | null;
  scheduledPublishAt: string | null;
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  currentRoute: EveningRouteTemplateDetailDto | null;
  revisionCount: number;
};

export type PartnerInput = {
  name: string;
  city: string;
  status?: string;
  contact?: string | null;
  notes?: string | null;
};

export type VenueInput = {
  ownerType?: string;
  partnerId?: string | null;
  source?: string;
  city: string;
  timezone?: string;
  area?: string | null;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  tags?: string[];
  averageCheck?: number | null;
  openingHours?: unknown | null;
  status?: string;
};

export type PartnerOfferInput = {
  partnerId: string;
  venueId: string;
  title: string;
  description: string;
  terms?: string | null;
  shortLabel?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  daysOfWeek?: unknown | null;
  timeWindow?: unknown | null;
  status?: string;
};

export type RouteTemplateInput = {
  city: string;
  timezone?: string;
  area?: string | null;
  centerLat?: number | null;
  centerLng?: number | null;
  radiusMeters?: number | null;
};

export type RouteRevisionStepInput = {
  sortOrder: number;
  timeLabel: string;
  endTimeLabel?: string | null;
  kind: string;
  title: string;
  venueId?: string | null;
  partnerOfferId?: string | null;
  venue?: string | null;
  address?: string | null;
  description?: string | null;
  emoji?: string | null;
  distanceLabel?: string | null;
  walkMin?: number | null;
  lat?: number | null;
  lng?: number | null;
};

export type RouteRevisionInput = {
  title: string;
  vibe: string;
  blurb: string;
  totalPriceFrom: number;
  totalSavings: number;
  durationLabel: string;
  area: string;
  goal: string;
  mood: string;
  budget: string;
  format: string | null;
  recommendedFor: string | null;
  badgeLabel: string | null;
  steps: RouteRevisionStepInput[];
};
