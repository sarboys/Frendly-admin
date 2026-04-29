import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminApiError } from "../api/client";
import {
  createOffer,
  createPartner,
  listOffers,
  listPartners,
  listVenues,
  updatePartner,
} from "../evening/api";
import { OfferForm } from "../evening/components/OfferForm";
import { PartnerForm } from "../evening/components/PartnerForm";
import type { PartnerDto, PartnerInput, PartnerOfferDto, PartnerOfferInput, VenueDto } from "../evening/types";
import { approvePartnerAccount, listPartnerAccounts, rejectPartnerAccount } from "../partner/admin-accounts-api";
import type { PartnerAccount } from "../partner/api";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTopbar } from "../components/Topbar";

export const AdminPartners = () => {
  const [partners, setPartners] = useState<PartnerDto[]>([]);
  const [accounts, setAccounts] = useState<PartnerAccount[]>([]);
  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [offers, setOffers] = useState<PartnerOfferDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPartner, setIsSavingPartner] = useState(false);
  const [isSavingOffer, setIsSavingOffer] = useState(false);
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const [offerError, setOfferError] = useState<string | null>(null);

  const partnerById = useMemo(
    () => new Map(partners.map((partner) => [partner.id, partner])),
    [partners],
  );
  const venueById = useMemo(
    () => new Map(venues.map((venue) => [venue.id, venue])),
    [venues],
  );

  const load = async () => {
    setIsLoading(true);
    setPartnerError(null);
    setOfferError(null);
    try {
      const [accountResponse, partnerResponse, venueResponse, offerResponse] = await Promise.all([
        listPartnerAccounts(),
        listPartners({ limit: 50 }),
        listVenues({ limit: 50 }),
        listOffers({ limit: 50 }),
      ]);
      setAccounts(accountResponse.items);
      setPartners(partnerResponse.items);
      setVenues(venueResponse.items);
      setOffers(offerResponse.items);
    } catch (caught) {
      setPartnerError(errorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const savePartner = async (input: PartnerInput) => {
    setIsSavingPartner(true);
    setPartnerError(null);
    try {
      await createPartner(input);
      await load();
    } catch (caught) {
      setPartnerError(errorMessage(caught));
    } finally {
      setIsSavingPartner(false);
    }
  };

  const saveOffer = async (input: PartnerOfferInput) => {
    setIsSavingOffer(true);
    setOfferError(null);
    try {
      await createOffer(input);
      await load();
    } catch (caught) {
      setOfferError(errorMessage(caught));
    } finally {
      setIsSavingOffer(false);
    }
  };

  const togglePartner = async (partner: PartnerDto) => {
    setPartnerError(null);
    try {
      await updatePartner(partner.id, {
        status: partner.status === "active" ? "inactive" : "active",
      });
      await load();
    } catch (caught) {
      setPartnerError(errorMessage(caught));
    }
  };

  const approveAccount = async (account: PartnerAccount) => {
    setPartnerError(null);
    try {
      await approvePartnerAccount(account.id);
      await load();
    } catch (caught) {
      setPartnerError(errorMessage(caught));
    }
  };

  const rejectAccount = async (account: PartnerAccount) => {
    setPartnerError(null);
    try {
      await rejectPartnerAccount(account.id, "Заявка отклонена командой Frendly");
      await load();
    } catch (caught) {
      setPartnerError(errorMessage(caught));
    }
  };

  return (
    <>
      <AdminTopbar
        title="Партнеры"
        subtitle="Партнеры, площадки и офферы для маршрутов"
      />
      <div className="space-y-5 p-5 lg:p-8">
        <div className="grid gap-5 xl:grid-cols-2">
          <PartnerForm
            onSubmit={savePartner}
            error={partnerError}
            isSaving={isSavingPartner}
          />
          <OfferForm
            partners={partners}
            venues={venues}
            onSubmit={saveOffer}
            error={offerError}
            isSaving={isSavingOffer}
          />
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-[14px] font-semibold">Заявки партнеров</p>
              <p className="text-[12px] text-muted-foreground">Регистрации с partner.frendly.tech.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Обновить
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Организация</TableHead>
                <TableHead>ИНН</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Контакт</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-[13px] text-muted-foreground">
                    Заявок пока нет.
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <p className="text-[13.5px] font-semibold">{account.organizationName}</p>
                      <p className="text-[11.5px] text-muted-foreground">{account.email}</p>
                    </TableCell>
                    <TableCell className="text-[13px]">{account.taxId}</TableCell>
                    <TableCell className="text-[13px]">{account.city}</TableCell>
                    <TableCell className="text-[13px]">{account.contactName} · {account.phone}</TableCell>
                    <TableCell><StatusBadge status={account.status} /></TableCell>
                    <TableCell className="text-right">
                      {account.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => void rejectAccount(account)}>
                            Отклонить
                          </Button>
                          <Button size="sm" onClick={() => void approveAccount(account)}>
                            Подтвердить
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[12px] text-muted-foreground">{account.partnerId ?? "Нет partnerId"}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-[14px] font-semibold">Партнеры</p>
              <p className="text-[12px] text-muted-foreground">Первый список партнеров каталога.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Обновить
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Партнер</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Контакт</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-[13px] text-muted-foreground">
                    Загрузка партнеров...
                  </TableCell>
                </TableRow>
              ) : partners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-[13px] text-muted-foreground">
                    Партнеров пока нет.
                  </TableCell>
                </TableRow>
              ) : (
                partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <p className="text-[13.5px] font-semibold">{partner.name}</p>
                      <p className="text-[11.5px] text-muted-foreground">{partner.notes || partner.id}</p>
                    </TableCell>
                    <TableCell className="text-[13px]">{partner.city}</TableCell>
                    <TableCell className="text-[13px]">{partner.contact || "Нет"}</TableCell>
                    <TableCell>
                      <StatusBadge status={partner.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => void togglePartner(partner)}>
                        {partner.status === "active" ? "Выключить" : "Включить"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <p className="text-[14px] font-semibold">Офферы</p>
            <p className="text-[12px] text-muted-foreground">Офферы грузятся один раз при открытии страницы.</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Оффер</TableHead>
                <TableHead>Партнер</TableHead>
                <TableHead>Место</TableHead>
                <TableHead>Метка</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-[13px] text-muted-foreground">
                    Офферов пока нет.
                  </TableCell>
                </TableRow>
              ) : (
                offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <p className="text-[13.5px] font-semibold">{offer.title}</p>
                      <p className="text-[11.5px] text-muted-foreground">{offer.description}</p>
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {partnerById.get(offer.partnerId)?.name ?? offer.partnerId}
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {venueById.get(offer.venueId)?.name ?? offer.venueId}
                    </TableCell>
                    <TableCell className="text-[13px]">{offer.shortLabel || "Нет"}</TableCell>
                    <TableCell>
                      <StatusBadge status={offer.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

function errorMessage(caught: unknown) {
  if (caught instanceof AdminApiError) {
    return `${caught.code}: ${caught.message}`;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "Не удалось выполнить запрос";
}
