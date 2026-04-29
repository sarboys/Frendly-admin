import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logoutPartner } from "../partner/api";

export const PartnerRejected = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await logoutPartner();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-5 space-y-4">
        <div>
          <p className="font-display text-[20px] font-semibold">Заявка не подтверждена</p>
          <p className="text-[13px] text-muted-foreground mt-2">
            Доступ в кабинет закрыт. Можно связаться с командой Frendly и уточнить детали.
          </p>
        </div>
        <Button variant="outline" onClick={() => void logout()}>
          Выйти
        </Button>
      </div>
    </main>
  );
};
