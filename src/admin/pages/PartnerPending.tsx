import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logoutPartner } from "../partner/api";

export const PartnerPending = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await logoutPartner();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-5 space-y-4">
        <div>
          <p className="font-display text-[20px] font-semibold">Заявка на проверке</p>
          <p className="text-[13px] text-muted-foreground mt-2">
            Мы откроем кабинет после подтверждения команды Frendly.
          </p>
        </div>
        <Button variant="outline" onClick={() => void logout()}>
          Выйти
        </Button>
      </div>
    </main>
  );
};
