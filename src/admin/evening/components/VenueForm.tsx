import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PartnerDto, VenueInput } from "../types";

type VenueFormProps = {
  partners: PartnerDto[];
  onSubmit: (input: VenueInput) => Promise<void>;
  error?: string | null;
  isSaving?: boolean;
};

export const VenueForm = ({ partners, onSubmit, error, isSaving }: VenueFormProps) => {
  const [ownerType, setOwnerType] = useState("frendly");
  const [partnerId, setPartnerId] = useState("");
  const [city, setCity] = useState("Москва");
  const [timezone, setTimezone] = useState("Europe/Moscow");
  const [area, setArea] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("55.7558");
  const [lng, setLng] = useState("37.6173");
  const [category, setCategory] = useState("bar");
  const [tags, setTags] = useState("date, quiet");
  const [averageCheck, setAverageCheck] = useState("1800");
  const [openingHours, setOpeningHours] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);

    let openingHoursJson: unknown | null = null;
    if (openingHours.trim()) {
      try {
        openingHoursJson = JSON.parse(openingHours);
      } catch {
        setLocalError("openingHours должен быть валидным JSON");
        return;
      }
    }

    await onSubmit({
      ownerType,
      partnerId: partnerId || null,
      city,
      timezone,
      area: area || null,
      name,
      address,
      lat: Number(lat),
      lng: Number(lng),
      category,
      tags: tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      averageCheck: averageCheck ? Number(averageCheck) : null,
      openingHours: openingHoursJson,
    });
    setName("");
    setAddress("");
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div>
        <p className="text-[14px] font-semibold">Новое место</p>
        <p className="text-[12px] text-muted-foreground">Frendly места сразу уходят в approved.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Владелец">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={ownerType}
            onChange={(event) => setOwnerType(event.target.value)}
          >
            <option value="frendly">frendly</option>
            <option value="partner">partner</option>
          </select>
        </Field>
        <Field label="Партнер">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={partnerId}
            onChange={(event) => setPartnerId(event.target.value)}
          >
            <option value="">Без партнера</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Город">
          <Input value={city} onChange={(event) => setCity(event.target.value)} required />
        </Field>
        <Field label="Таймзона">
          <Input value={timezone} onChange={(event) => setTimezone(event.target.value)} required />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Название">
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </Field>
        <Field label="Адрес">
          <Input value={address} onChange={(event) => setAddress(event.target.value)} required />
        </Field>
        <Field label="Район">
          <Input value={area} onChange={(event) => setArea(event.target.value)} />
        </Field>
        <Field label="Категория">
          <Input value={category} onChange={(event) => setCategory(event.target.value)} required />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Lat">
          <Input value={lat} onChange={(event) => setLat(event.target.value)} required />
        </Field>
        <Field label="Lng">
          <Input value={lng} onChange={(event) => setLng(event.target.value)} required />
        </Field>
        <Field label="Средний чек">
          <Input value={averageCheck} onChange={(event) => setAverageCheck(event.target.value)} />
        </Field>
        <Field label="Теги через запятую">
          <Input value={tags} onChange={(event) => setTags(event.target.value)} />
        </Field>
      </div>
      <Field label="openingHours JSON">
        <Textarea
          value={openingHours}
          onChange={(event) => setOpeningHours(event.target.value)}
          placeholder='{"mon":[["12:00","23:00"]]}'
        />
      </Field>
      {(localError || error) && (
        <p className="text-[12px] text-destructive">{localError || error}</p>
      )}
      <Button type="submit" size="sm" disabled={isSaving}>
        Сохранить место
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
