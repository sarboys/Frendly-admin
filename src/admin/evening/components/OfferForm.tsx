import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PartnerDto, PartnerOfferInput, VenueDto } from "../types";

type OfferFormProps = {
  partners: PartnerDto[];
  venues: VenueDto[];
  onSubmit: (input: PartnerOfferInput) => Promise<void>;
  error?: string | null;
  isSaving?: boolean;
};

export const OfferForm = ({ partners, venues, onSubmit, error, isSaving }: OfferFormProps) => {
  const [partnerId, setPartnerId] = useState("");
  const [venueId, setVenueId] = useState("");
  const [title, setTitle] = useState("");
  const [shortLabel, setShortLabel] = useState("");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [status, setStatus] = useState("active");

  const visibleVenues = useMemo(
    () => venues.filter((venue) => !partnerId || venue.partnerId === partnerId),
    [partnerId, venues],
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit({
      partnerId,
      venueId,
      title,
      shortLabel: shortLabel || null,
      description,
      terms: terms || null,
      validFrom: validFrom || null,
      validTo: validTo || null,
      status,
    });
    setTitle("");
    setShortLabel("");
    setDescription("");
    setTerms("");
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div>
        <p className="text-[14px] font-semibold">Новый оффер</p>
        <p className="text-[12px] text-muted-foreground">Оффер привязан к партнеру и месту.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Партнер">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={partnerId}
            onChange={(event) => {
              setPartnerId(event.target.value);
              setVenueId("");
            }}
            required
          >
            <option value="">Выбери партнера</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Место">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={venueId}
            onChange={(event) => setVenueId(event.target.value)}
            required
          >
            <option value="">Выбери место</option>
            {visibleVenues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Статус">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="draft">draft</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Название">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </Field>
        <Field label="Короткая метка">
          <Input value={shortLabel} onChange={(event) => setShortLabel(event.target.value)} />
        </Field>
      </div>
      <Field label="Описание">
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} required />
      </Field>
      <Field label="Условия">
        <Textarea value={terms} onChange={(event) => setTerms(event.target.value)} />
      </Field>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="validFrom">
          <Input type="datetime-local" value={validFrom} onChange={(event) => setValidFrom(event.target.value)} />
        </Field>
        <Field label="validTo">
          <Input type="datetime-local" value={validTo} onChange={(event) => setValidTo(event.target.value)} />
        </Field>
      </div>
      {error && <p className="text-[12px] text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={isSaving}>
        Сохранить оффер
      </Button>
    </form>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
    <span>{label}</span>
    {children}
  </label>
);
