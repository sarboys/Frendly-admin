import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminApiError, loginAdmin } from "../api/client";

export const AdminLogin = () => {
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
      await loginAdmin({ email, password });
      navigate("/", { replace: true });
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
          <p className="font-display text-[20px] font-semibold">Вход в админку</p>
          <p className="text-[12.5px] text-muted-foreground">admin.frendly.tech</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Пароль</Label>
          <Input
            id="admin-password"
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
      </form>
    </main>
  );
};

function errorMessage(caught: unknown) {
  if (caught instanceof AdminApiError) {
    if (caught.code === "admin_invalid_credentials") {
      return "Неверный email или пароль.";
    }
    if (caught.code === "admin_suspended") {
      return "Аккаунт отключен.";
    }
    return caught.message;
  }
  if (caught instanceof Error) {
    return caught.message;
  }
  return "Не удалось войти.";
}
