import { useParams } from "react-router-dom";
import { AdminTopbar } from "../components/Topbar";

export const AdminEveningRouteDetail = () => {
  const { templateId } = useParams();

  return (
    <>
      <AdminTopbar
        title="Редактор маршрута"
        subtitle={templateId ? `Шаблон ${templateId}` : "Новый шаблон маршрута"}
      />
      <div className="p-5 lg:p-8">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-[14px] font-semibold">Черновик маршрута</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Редактор версии появится здесь. Сохранение будет создавать новую версию.
          </p>
        </div>
      </div>
    </>
  );
};
