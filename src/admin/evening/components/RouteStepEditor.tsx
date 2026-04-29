import type { PartnerOfferDto, RouteRevisionStepInput, VenueDto } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type RouteStepEditorProps = {
  step: RouteRevisionStepInput;
  index: number;
  venues: VenueDto[];
  offers: PartnerOfferDto[];
  onChange: (step: RouteRevisionStepInput) => void;
  onRemove: () => void;
};

export const RouteStepEditor = ({
  step,
  index,
  venues,
  offers,
  onChange,
  onRemove,
}: RouteStepEditorProps) => {
  const selectedVenue = venues.find((venue) => venue.id === step.venueId) ?? null;
  const venueOffers = offers.filter((offer) => offer.venueId === step.venueId);
  const selectedOffer = offers.find((offer) => offer.id === step.partnerOfferId) ?? null;

  const patch = (changes: Partial<RouteRevisionStepInput>) => {
    onChange({ ...step, ...changes });
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13.5px] font-semibold">Шаг {index + 1}</p>
          <p className="text-[12px] text-muted-foreground">
            Место и оффер сохраняются snapshot в новой версии.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          Удалить
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Порядок">
          <Input
            value={step.sortOrder}
            onChange={(event) => patch({ sortOrder: Number(event.target.value) })}
          />
        </Field>
        <Field label="Начало">
          <Input
            value={step.timeLabel}
            onChange={(event) => patch({ timeLabel: event.target.value })}
            required
          />
        </Field>
        <Field label="Конец">
          <Input
            value={step.endTimeLabel ?? ""}
            onChange={(event) => patch({ endTimeLabel: event.target.value || null })}
          />
        </Field>
        <Field label="Тип">
          <Input
            value={step.kind}
            onChange={(event) => patch({ kind: event.target.value })}
            required
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Заголовок">
          <Input
            value={step.title}
            onChange={(event) => patch({ title: event.target.value })}
            required
          />
        </Field>
        <Field label="Место">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={step.venueId ?? ""}
            onChange={(event) =>
              patch({
                venueId: event.target.value || null,
                partnerOfferId: null,
              })
            }
          >
            <option value="">Без места</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name} · {venue.city}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Оффер">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={step.partnerOfferId ?? ""}
            onChange={(event) => patch({ partnerOfferId: event.target.value || null })}
            disabled={!step.venueId}
          >
            <option value="">Без оффера</option>
            {venueOffers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.title} · {offer.status}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Дистанция">
          <Input
            value={step.distanceLabel ?? ""}
            onChange={(event) => patch({ distanceLabel: event.target.value || null })}
          />
        </Field>
      </div>

      <Field label="Описание">
        <Textarea
          value={step.description ?? ""}
          onChange={(event) => patch({ description: event.target.value || null })}
        />
      </Field>

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Эмодзи">
          <Input
            value={step.emoji ?? ""}
            onChange={(event) => patch({ emoji: event.target.value || null })}
          />
        </Field>
        <Field label="Пешком, мин">
          <Input
            value={step.walkMin ?? ""}
            onChange={(event) =>
              patch({ walkMin: event.target.value ? Number(event.target.value) : null })
            }
          />
        </Field>
        <div className="text-[12px] text-muted-foreground">
          {selectedVenue && !selectedVenue.openingHours && (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
              У места нет openingHours.
            </p>
          )}
          {selectedOffer?.status && selectedOffer.status !== "active" && (
            <p className="mt-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-destructive">
              Оффер не active.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="space-y-1 text-[12px] font-medium text-muted-foreground">
    <span>{label}</span>
    {children}
  </label>
);
