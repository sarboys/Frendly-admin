import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PartnerInput } from "../types";

type PartnerFormProps = {
  onSubmit: (input: PartnerInput) => Promise<void>;
  error?: string | null;
  isSaving?: boolean;
};

export const PartnerForm = ({ onSubmit, error, isSaving }: PartnerFormProps) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("Москва");
  const [status, setStatus] = useState("active");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit({
      name,
      city,
      status,
      contact: contact || null,
      notes: notes || null,
    });
    setName("");
    setContact("");
    setNotes("");
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div>
        <p className="text-[14px] font-semibold">Новый партнер</p>
        <p className="text-[12px] text-muted-foreground">Организация для мест и офферов.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Название">
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </Field>
        <Field label="Город">
          <Input value={city} onChange={(event) => setCity(event.target.value)} required />
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
        <Field label="Контакт">
          <Input value={contact} onChange={(event) => setContact(event.target.value)} />
        </Field>
        <Field label="Заметки">
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Field>
      </div>
      {error && <p className="text-[12px] text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={isSaving}>
        Сохранить партнера
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
