import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PartnerApiError, registerPartner } from "../partner/api";

const initialForm = {
  organizationName: "",
  taxId: "",
  city: "",
  contactName: "",
  phone: "",
  email: "",
  password: "",
};

export const PartnerRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const update = (key: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      await registerPartner(form);
      navigate("/pending", { replace: true });
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <form onSubmit={submit} className="w-full max-w-xl rounded-lg border border-border bg-card p-5 space-y-4">
        <div>
          <p className="font-display text-[20px] font-semibold">Регистрация партнера</p>
          <p className="text-[12.5px] text-muted-foreground">Заявку проверит команда Frendly.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Название организации" value={form.organizationName} onChange={(value) => update("organizationName", value)} />
          <Field label="ИНН" value={form.taxId} onChange={(value) => update("taxId", value)} />
          <Field label="Город" value={form.city} onChange={(value) => update("city", value)} />
          <Field label="Контактное лицо" value={form.contactName} onChange={(value) => update("contactName", value)} />
          <Field label="Телефон" value={form.phone} onChange={(value) => update("phone", value)} />
          <Field label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} />
          <Field label="Пароль" type="password" value={form.password} onChange={(value) => update("password", value)} />
        </div>
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Отправляем..." : "Отправить заявку"}
        </Button>
        <p className="text-center text-[12.5px] text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-primary">
            Войти
          </Link>
        </p>
      </form>
    </main>
  );
};

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = `partner-${label}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}

function errorMessage(caught: unknown) {
  if (caught instanceof PartnerApiError) {
    if (caught.code === "partner_invalid_tax_id") {
      return "ИНН должен состоять из 10 или 12 цифр.";
    }
    if (caught.code === "partner_email_exists") {
      return "Этот email уже зарегистрирован.";
    }
    return caught.message;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "Не удалось отправить заявку.";
}
