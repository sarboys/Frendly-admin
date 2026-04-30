import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { getAdminMe, type AdminUser } from "./api/client";

type GateState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "ready"; admin: AdminUser };

export const AdminAuthGate = () => {
  const [state, setState] = useState<GateState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    getAdminMe()
      .then(({ admin }) => {
        if (!cancelled) {
          setState({ kind: "ready", admin });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ kind: "missing" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return <div className="min-h-screen bg-background p-8 text-[13px] text-muted-foreground">Загрузка...</div>;
  }

  if (state.kind === "missing") {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout />;
};
