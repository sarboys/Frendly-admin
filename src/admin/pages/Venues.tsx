import { AdminTopbar } from "../components/Topbar";

export const AdminVenues = () => {
  return (
    <>
      <AdminTopbar
        title="Места"
        subtitle="Проверенные площадки для командных маршрутов"
      />
      <div className="p-5 lg:p-8">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-[14px] font-semibold">Каталог мест</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Здесь будет список площадок, статусы модерации и форма создания.
          </p>
        </div>
      </div>
    </>
  );
};
