import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataToolbar } from "../components/DataToolbar";
import { StatusBadge } from "../components/StatusBadge";
import { AdminTopbar } from "../components/Topbar";
import { adminPageText, downloadCsv, formatDate } from "../management/format";
import { listAdminUsers } from "../management/api";

const statusOptions = ["active", "suspended"];
const verifiedOptions = [
  { label: "Все", value: "" },
  { label: "Вериф.", value: "true" },
  { label: "Без вериф.", value: "false" },
];
const planOptions = ["free", "plus", "afterdark"];

export const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = {
    q: searchParams.get("q") ?? "",
    city: searchParams.get("city") ?? "",
    status: searchParams.get("status") ?? "",
    verified: searchParams.get("verified") ?? "",
    plan: searchParams.get("plan") ?? "",
  };
  const query = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => listAdminUsers(filters),
  });
  const users = query.data?.items ?? [];

  const setFilter = (key: keyof typeof filters, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <>
      <AdminTopbar title="Пользователи" subtitle={`Всего загружено: ${users.length}`} />
      <div className="p-5 lg:p-8">
        <DataToolbar
          searchPlaceholder="Имя, email, телефон…"
          searchValue={filters.q}
          onSearchChange={(value) => setFilter("q", value)}
          onExportClick={() => downloadCsv("admin-users.csv", users as unknown as Array<Record<string, unknown>>)}
        />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <FilterInput label="Город" value={filters.city} onChange={(value) => setFilter("city", value)} />
          <FilterSelect label="Статус" value={filters.status} onChange={(value) => setFilter("status", value)} options={statusOptions} />
          <FilterSelect label="План" value={filters.plan} onChange={(value) => setFilter("plan", value)} options={planOptions} />
          <select
            aria-label="Верификация"
            value={filters.verified}
            onChange={(event) => setFilter("verified", event.target.value)}
            className="h-9 rounded-md border border-input bg-card px-3 text-[13px]"
          >
            {verifiedOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Пользователь</TableHead>
                <TableHead>Город</TableHead>
                <TableHead>План</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Встречи</TableHead>
                <TableHead className="text-right">Жалобы</TableHead>
                <TableHead>Регистрация</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading && <StateRow text={adminPageText.loading} />}
              {query.isError && <StateRow text={adminPageText.error} />}
              {!query.isLoading && !query.isError && users.length === 0 && <StateRow text={adminPageText.empty} />}
              {users.map((user) => (
                <TableRow key={user.id} className="cursor-pointer" onClick={() => navigate(`/users/${user.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary/30 flex items-center justify-center text-[11px] font-semibold">
                        {initials(user.displayName)}
                      </div>
                      <div className="leading-tight">
                        <p className="text-[13.5px] font-semibold flex items-center gap-1">
                          {user.displayName}
                          {user.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                        </p>
                        <p className="text-[11.5px] text-muted-foreground">{user.email ?? user.phoneNumber ?? user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[13px]">{user.city ?? "—"}</TableCell>
                  <TableCell><StatusBadge status={user.plan} /></TableCell>
                  <TableCell><StatusBadge status={user.status} /></TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">
                    {user.hostedMeetupsCount + user.joinedMeetupsCount}
                  </TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums">
                    <span className={user.reportsCount > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                      {user.reportsCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-[12.5px] text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

function FilterInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={label}
      className="h-9 w-[160px] rounded-md border border-input bg-card px-3 text-[13px]"
    />
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 rounded-md border border-input bg-card px-3 text-[13px]"
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

function StateRow({ text }: { text: string }) {
  return (
    <TableRow>
      <TableCell colSpan={8} className="text-center text-[13px] text-muted-foreground py-8">
        {text}
      </TableCell>
    </TableRow>
  );
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
