import { AdminTopbar } from "../components/Topbar";

export const AdminPartners = () => {
  return (
    <>
      <AdminTopbar
        title="Партнеры"
        subtitle="Партнеры, площадки и офферы для маршрутов"
      />
      <div className="p-5 lg:p-8">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-[14px] font-semibold">Каталог партнеров</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Здесь будет список партнеров и форма создания офферов.
          </p>
        </div>
      </div>
    </>
  );
};
