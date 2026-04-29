import { adminApiRequest } from "../api/client";
import type { PartnerAccount } from "./api";

export type PartnerAccountListResponse = {
  items: PartnerAccount[];
};

export function listPartnerAccounts() {
  return adminApiRequest<PartnerAccountListResponse>("/admin/partner-accounts");
}

export function approvePartnerAccount(accountId: string) {
  return adminApiRequest<{ account: PartnerAccount }>(
    `/admin/partner-accounts/${accountId}/approve`,
    { method: "POST" },
  );
}

export function rejectPartnerAccount(accountId: string, reviewNote?: string) {
  return adminApiRequest<{ account: PartnerAccount }>(
    `/admin/partner-accounts/${accountId}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ reviewNote }),
    },
  );
}
