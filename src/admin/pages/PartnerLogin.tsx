import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PartnerApiError, loginPartner } from "../partner/api";

export const PartnerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const response = await loginPartner({ email, password });
      if (response.account.status === "approved" && response.account.partnerId) {
        navigate("/", { replace: true });
      } else if (response.account.status === "rejected") {
        navigate("/rejected", { replace: true });
      } else {
        navigate("/pending", { replace: true });
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-border bg-card p-5 space-y-4">
        <div>
          <p className="font-display text-[20px] font-semibold">Вход партнера</p>
          <p className="text-[12.5px] text-muted-foreground">partner.frendly.tech</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner-email">Email</Label>
          <Input
            id="partner-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner-password">Пароль</Label>
          <Input
            id="partner-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error && <p className="text-[12px] text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Входим..." : "Войти"}
        </Button>
        <p className="text-center text-[12.5px] text-muted-foreground">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-primary">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </main>
  );
};

function errorMessage(caught: unknown) {
  if (caught instanceof PartnerApiError) {
    if (caught.code === "partner_invalid_credentials") {
      return "Неверный email или пароль.";
    }
    return caught.message;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "Не удалось войти.";
}
