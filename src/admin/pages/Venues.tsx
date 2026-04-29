import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminApiError } from "../api/client";
import { createVenue, listPartners, listVenues, updateVenue } from "../evening/api";
import { VenueForm } from "../evening/components/VenueForm";
import type { PartnerDto, VenueDto, VenueInput } from "../evening/types";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTopbar } from "../components/Topbar";

export const AdminVenues = () => {
  const [venues, setVenues] = useState<VenueDto[]>([]);
  const [partners, setPartners] = useState<PartnerDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const partnerById = useMemo(
    () => new Map(partners.map((partner) => [partner.id, partner])),
    [partners],
  );

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [venueResponse, partnerResponse] = await Promise.all([
        listVenues({ limit: 50 }),
        listPartners({ limit: 50 }),
      ]);
      setVenues(venueResponse.items);
      setPartners(partnerResponse.items);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveVenue = async (input: VenueInput) => {
    setIsSaving(true);
    setError(null);
    try {
      await createVenue(input);
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  const changeVenueStatus = async (venue: VenueDto, status: string) => {
    setError(null);
    try {
      await updateVenue(venue.id, { status });
      await load();
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };

  return (
    <>
      <AdminTopbar
        title="Места"
        subtitle="Проверенные площадки для командных маршрутов"
      />
      <div className="space-y-5 p-5 lg:p-8">
        <VenueForm
          partners={partners}
          onSubmit={saveVenue}
          error={error}
          isSaving={isSaving}
        />

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-[14px] font-semibold">Каталог мест</p>
              <p className="text-[12px] text-muted-foreground">
                Первый список, без фоновой загрузки всех страниц.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Обновить
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Место</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Партнер</TableHead>
                <TableHead>Trust</TableHead>
                <TableHead>Модерация</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-[13px] text-muted-foreground">
                    Загрузка мест...
                  </TableCell>
                </TableRow>
              ) : venues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-[13px] text-muted-foreground">
                    Мест пока нет.
                  </TableCell>
                </TableRow>
              ) : (
                venues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell>
                      <p className="text-[13.5px] font-semibold">{venue.name}</p>
                      <p className="text-[11.5px] text-muted-foreground">{venue.address}</p>
                    </TableCell>
                    <TableCell className="text-[13px]">{venue.city}</TableCell>
                    <TableCell className="text-[13px]">{venue.category}</TableCell>
                    <TableCell className="text-[13px]">
                      {venue.partnerId ? partnerById.get(venue.partnerId)?.name ?? venue.partnerId : "Frendly"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={venue.trustLevel} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={venue.moderationStatus} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={venue.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void changeVenueStatus(venue, venue.status === "open" ? "closed" : "open")}
                      >
                        {venue.status === "open" ? "Закрыть" : "Открыть"}
                      </Button>
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
