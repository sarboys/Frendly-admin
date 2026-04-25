import { AdminTopbar } from "../components/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const AdminSettings = () => {
  return (
    <>
      <AdminTopbar title="Настройки" subtitle="Конфигурация платформы и админов" />
      <div className="p-5 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <Section title="Платформа">
          <Field label="Название продукта" defaultValue="Frendly" />
          <Field label="Поддержка email" defaultValue="hi@frendly.app" />
          <Field label="Telegram канал" defaultValue="@frendly_app" />
        </Section>

        <Section title="Тарифы">
          <Field label="Frendly+ цена / мес" defaultValue="599" suffix="₽" />
          <Field label="After Dark цена / мес" defaultValue="1290" suffix="₽" />
          <Field label="Бесплатный триал, дней" defaultValue="7" />
        </Section>

        <Section title="Модерация">
          <Toggle label="Авто-модерация чатов" desc="Фильтр оскорблений и спама" defaultOn />
          <Toggle label="Требовать верификацию для дейтинга" desc="Селфи + документ" defaultOn />
          <Toggle label="Скрыть After Dark до 18+" desc="Подтверждение возраста" defaultOn />
        </Section>

        <Section title="Уведомления админам">
          <Toggle label="Email при новой жалобе" defaultOn />
          <Toggle label="Push при отказе платежа" defaultOn />
          <Toggle label="Daily-дайджест" defaultOn={false} />
        </Section>

        <Section title="Команда" full>
          <div className="space-y-2">
            {[
              { name: "Алексей Шумов", role: "Owner", email: "alex@frendly.app" },
              { name: "Маша Селезнёва", role: "Moderator", email: "masha@frendly.app" },
              { name: "Кирилл Дрон", role: "Support", email: "kir@frendly.app" },
            ].map((m) => (
              <div key={m.email} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div className="w-9 h-9 rounded-full bg-secondary/30 flex items-center justify-center text-[11px] font-semibold">
                  {m.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold">{m.name}</p>
                  <p className="text-[11.5px] text-muted-foreground">{m.email}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  {m.role}
                </span>
              </div>
            ))}
            <Button variant="outline" className="w-full">+ Пригласить в команду</Button>
          </div>
        </Section>
      </div>
    </>
  );
};

const Section = ({
  title,
  children,
  full,
}: {
  title: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={`rounded-lg border border-border bg-card p-5 ${full ? "lg:col-span-2" : ""}`}>
    <h2 className="font-display font-semibold text-[16px] mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({
  label,
  defaultValue,
  suffix,
}: {
  label: string;
  defaultValue: string;
  suffix?: string;
}) => (
  <div className="space-y-1.5">
    <Label className="text-[12.5px]">{label}</Label>
    <div className="flex items-center gap-2">
      <Input defaultValue={defaultValue} className="h-9" />
      {suffix && <span className="text-[13px] text-muted-foreground">{suffix}</span>}
    </div>
  </div>
);

const Toggle = ({
  label,
  desc,
  defaultOn = false,
}: {
  label: string;
  desc?: string;
  defaultOn?: boolean;
}) => (
  <div className="flex items-start justify-between gap-3 py-1">
    <div className="flex-1 min-w-0">
      <p className="text-[13.5px] font-semibold">{label}</p>
      {desc && <p className="text-[11.5px] text-muted-foreground">{desc}</p>}
    </div>
    <Switch defaultChecked={defaultOn} />
  </div>
);
