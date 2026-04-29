import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  AdminEveningRouteTemplateDto,
  PartnerOfferDto,
  RouteRevisionInput,
  RouteRevisionStepInput,
  VenueDto,
} from "../types";
import { RouteStepEditor } from "./RouteStepEditor";

type RouteEditorProps = {
  template: AdminEveningRouteTemplateDto;
  venues: VenueDto[];
  offers: PartnerOfferDto[];
  onSave: (input: RouteRevisionInput) => Promise<void>;
  error?: string | null;
  isSaving?: boolean;
};

const emptyStep = (sortOrder: number): RouteRevisionStepInput => ({
  sortOrder,
  timeLabel: "",
  endTimeLabel: null,
  kind: "bar",
  title: "",
  venueId: null,
  partnerOfferId: null,
  description: null,
  emoji: "✨",
  distanceLabel: "",
  walkMin: null,
});

export const RouteEditor = ({
  template,
  venues,
  offers,
  onSave,
  error,
  isSaving,
}: RouteEditorProps) => {
  const route = template.currentRoute;
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [vibe, setVibe] = useState("");
  const [budget, setBudget] = useState("mid");
  const [durationLabel, setDurationLabel] = useState("");
  const [totalPriceFrom, setTotalPriceFrom] = useState("0");
  const [totalSavings, setTotalSavings] = useState("0");
  const [area, setArea] = useState(template.area ?? "");
  const [goal, setGoal] = useState("date");
  const [mood, setMood] = useState("chill");
  const [format, setFormat] = useState("mixed");
  const [recommendedFor, setRecommendedFor] = useState("");
  const [badgeLabel, setBadgeLabel] = useState("Маршрут от команды Frendly");
  const [steps, setSteps] = useState<RouteRevisionStepInput[]>([emptyStep(1)]);

  useEffect(() => {
    setTitle(route?.title ?? "");
    setBlurb(route?.blurb ?? "");
    setVibe(route?.vibe ?? "");
    setBudget(route?.budget ?? "mid");
    setDurationLabel(route?.durationLabel ?? "");
    setTotalPriceFrom(String(route?.totalPriceFrom ?? 0));
    setTotalSavings(String(route?.totalSavings ?? 0));
    setArea(route?.area ?? template.area ?? "");
    setGoal(route?.goal ?? "date");
    setMood(route?.mood ?? "chill");
    setFormat(route?.format ?? "mixed");
    setRecommendedFor(route?.recommendedFor ?? "");
    setBadgeLabel(route?.badgeLabel ?? "Маршрут от команды Frendly");
    setSteps(
      route?.steps?.length
        ? route.steps.map((step, index) => ({
            sortOrder: index + 1,
            timeLabel: step.time,
            endTimeLabel: step.endTime,
            kind: step.kind,
            title: step.title,
            venueId: step.venueId,
            partnerOfferId: step.partnerOfferId,
            venue: step.venue,
            address: step.address,
            description: step.description,
            emoji: step.emoji,
            distanceLabel: step.distance,
            walkMin: step.walkMin,
            lat: step.lat,
            lng: step.lng,
          }))
        : [emptyStep(1)],
    );
  }, [route, template.area]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSave({
      title,
      blurb,
      vibe,
      budget,
      durationLabel,
      totalPriceFrom: Number(totalPriceFrom),
      totalSavings: Number(totalSavings),
      area,
      goal,
      mood,
      format,
      recommendedFor: recommendedFor || null,
      badgeLabel: badgeLabel || null,
      steps: steps.map((step, index) => ({ ...step, sortOrder: index + 1 })),
    });
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div>
        <p className="text-[14px] font-semibold">Редактор маршрута</p>
        <p className="text-[12px] text-muted-foreground">
          Сохранение создает новую версию. Старые встречи остаются на старом routeId.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Название">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </Field>
        <Field label="Vibe">
          <Input value={vibe} onChange={(event) => setVibe(event.target.value)} required />
        </Field>
      </div>
      <Field label="Blurb">
        <Textarea value={blurb} onChange={(event) => setBlurb(event.target.value)} required />
      </Field>
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Бюджет">
          <Input value={budget} onChange={(event) => setBudget(event.target.value)} required />
        </Field>
        <Field label="Длительность">
          <Input value={durationLabel} onChange={(event) => setDurationLabel(event.target.value)} required />
        </Field>
        <Field label="Цена от">
          <Input value={totalPriceFrom} onChange={(event) => setTotalPriceFrom(event.target.value)} required />
        </Field>
        <Field label="Экономия">
          <Input value={totalSavings} onChange={(event) => setTotalSavings(event.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        <Field label="Район">
          <Input value={area} onChange={(event) => setArea(event.target.value)} required />
        </Field>
        <Field label="Goal">
          <Input value={goal} onChange={(event) => setGoal(event.target.value)} required />
        </Field>
        <Field label="Mood">
          <Input value={mood} onChange={(event) => setMood(event.target.value)} required />
        </Field>
        <Field label="Format">
          <Input value={format} onChange={(event) => setFormat(event.target.value)} required />
        </Field>
        <Field label="Badge">
          <Input value={badgeLabel} onChange={(event) => setBadgeLabel(event.target.value)} />
        </Field>
      </div>
      <Field label="Recommended for">
        <Textarea value={recommendedFor} onChange={(event) => setRecommendedFor(event.target.value)} />
      </Field>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[13.5px] font-semibold">Шаги</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSteps((current) => [...current, emptyStep(current.length + 1)])}
          >
            Добавить шаг
          </Button>
        </div>
        {steps.map((step, index) => (
          <RouteStepEditor
            key={index}
            step={step}
            index={index}
            venues={venues}
            offers={offers}
            onChange={(next) =>
              setSteps((current) =>
                current.map((item, itemIndex) => (itemIndex === index ? next : item)),
              )
            }
            onRemove={() =>
              setSteps((current) => current.filter((_, itemIndex) => itemIndex !== index))
            }
          />
        ))}
      </div>

      {error && <p className="text-[12px] text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={isSaving}>
        Сохранить новую версию
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
