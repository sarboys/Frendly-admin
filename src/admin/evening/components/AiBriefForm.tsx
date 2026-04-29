import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AiBriefInput } from "../types";

type AiBriefFormProps = {
  defaultCity: string;
  defaultArea: string;
  isSubmitting: boolean;
  onSubmit: (input: AiBriefInput) => void;
};

export const AiBriefForm = ({
  defaultCity,
  defaultArea,
  isSubmitting,
  onSubmit,
}: AiBriefFormProps) => {
  const [titleIdea, setTitleIdea] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [area, setArea] = useState(defaultArea);
  const [audience, setAudience] = useState("свидание");
  const [format, setFormat] = useState("bar gallery");
  const [mood, setMood] = useState("chill");
  const [budget, setBudget] = useState("mid");
  const [durationMinutes, setDurationMinutes] = useState("150");
  const [minSteps, setMinSteps] = useState("2");
  const [maxSteps, setMaxSteps] = useState("4");
  const [requiredVenueIds, setRequiredVenueIds] = useState("");
  const [excludedVenueIds, setExcludedVenueIds] = useState("");
  const [partnerGoal, setPartnerGoal] = useState("");
  const [tone, setTone] = useState("спокойный");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      titleIdea,
      city,
      timezone: "Europe/Moscow",
      area: area || null,
      audience,
      format,
      mood,
      budget,
      durationMinutes: Number(durationMinutes),
      minSteps: Number(minSteps),
      maxSteps: Number(maxSteps),
      requiredVenueIds: parseIds(requiredVenueIds),
      excludedVenueIds: parseIds(excludedVenueIds),
      partnerGoal: partnerGoal || null,
      tone: tone || null,
    });
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold">AI маршрут</p>
          <p className="text-[12px] text-muted-foreground">Brief для генерации командного маршрута.</p>
        </div>
        <Sparkles className="h-5 w-5 text-primary" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Идея названия">
          <Input value={titleIdea} onChange={(event) => setTitleIdea(event.target.value)} required />
        </Field>
        <Field label="Город">
          <Input value={city} onChange={(event) => setCity(event.target.value)} required />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Район">
          <Input value={area} onChange={(event) => setArea(event.target.value)} />
        </Field>
        <Field label="Аудитория">
          <Input value={audience} onChange={(event) => setAudience(event.target.value)} required />
        </Field>
        <Field label="Формат">
          <Input value={format} onChange={(event) => setFormat(event.target.value)} required />
        </Field>
        <Field label="Mood">
          <Input value={mood} onChange={(event) => setMood(event.target.value)} required />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Бюджет">
          <Input value={budget} onChange={(event) => setBudget(event.target.value)} required />
        </Field>
        <Field label="Минут">
          <Input
            type="number"
            min={30}
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
          />
        </Field>
        <Field label="Мин. шагов">
          <Input type="number" min={1} value={minSteps} onChange={(event) => setMinSteps(event.target.value)} />
        </Field>
        <Field label="Макс. шагов">
          <Input type="number" min={1} value={maxSteps} onChange={(event) => setMaxSteps(event.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Обязательные venueId">
          <Textarea value={requiredVenueIds} onChange={(event) => setRequiredVenueIds(event.target.value)} />
        </Field>
        <Field label="Исключить venueId">
          <Textarea value={excludedVenueIds} onChange={(event) => setExcludedVenueIds(event.target.value)} />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Partner goal">
          <Input value={partnerGoal} onChange={(event) => setPartnerGoal(event.target.value)} />
        </Field>
        <Field label="Tone">
          <Input value={tone} onChange={(event) => setTone(event.target.value)} />
        </Field>
      </div>

      <Button type="submit" size="sm" disabled={isSubmitting}>
        Сгенерировать
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

function parseIds(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}
