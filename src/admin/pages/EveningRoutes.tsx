import { AdminTopbar } from "../components/Topbar";

export const AdminEveningRoutes = () => {
  return (
    <>
      <AdminTopbar
        title="Маршруты"
        subtitle="Командные маршруты Frendly и версии для будущих встреч"
      />
      <div className="p-5 lg:p-8">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-[14px] font-semibold">Route Studio</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Здесь будет список маршрутов, статусы публикации и быстрый переход в редактор.
          </p>
        </div>
      </div>
    </>
  );
};
