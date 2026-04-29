import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AdminLayout } from "../AdminLayout";
import { getPartnerMe, getPartnerTokens, type PartnerAccount } from "./api";

type GateState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "ready"; account: PartnerAccount }
  | { kind: "pending"; account: PartnerAccount }
  | { kind: "rejected"; account: PartnerAccount }
  | { kind: "suspended" };

export const PartnerAuthGate = () => {
  const [state, setState] = useState<GateState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    const tokens = getPartnerTokens();
    if (!tokens) {
      setState({ kind: "missing" });
      return;
    }

    getPartnerMe()
      .then(({ account }) => {
        if (cancelled) return;
        if (account.status === "approved" && account.partnerId) {
          setState({ kind: "ready", account });
          return;
        }
        if (account.status === "rejected") {
          setState({ kind: "rejected", account });
          return;
        }
        if (account.status === "suspended") {
          setState({ kind: "suspended" });
          return;
        }
        setState({ kind: "pending", account });
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

  if (state.kind === "pending") {
    return <Navigate to="/pending" replace />;
  }

  if (state.kind === "rejected") {
    return <Navigate to="/rejected" replace />;
  }

  if (state.kind === "suspended") {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout />;
};
