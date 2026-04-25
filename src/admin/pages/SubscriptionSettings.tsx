import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AdminTopbar } from "../components/Topbar";
import { StatCard } from "../components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "../components/StatusBadge";
import { ArrowLeft, Crown, Gift, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const promos = [
  { code: "SPRING25", discount: 25, plan: "plus", uses: 142, limit: 500, expires: "01 июн" },
  { code: "DARKVIP", discount: 50, plan: "afterdark", uses: 12, limit: 50, expires: "15 мая" },
  { code: "WELCOME", discount: 100, plan: "plus", uses: 488, limit: 1000, expires: "Бессрочно" },
];

export const AdminSubscriptionSettings = () => {
  const navigate = useNavigate();
  const action = (msg: string) => toast({ title: msg });
  const [trialEnabled, setTrialEnabled] = useState(true);

  return (
    <>
      <AdminTopbar title="Настройки подписок" subtitle="Планы, цены, триалы и промокоды" />
      <div className="p-5 lg:p-8 space-y-6">
        <button
          onClick={() => navigate("/subscriptions")}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> К подпискам
        </button>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="MRR" value="184k ₽" delta={5.2} series={[120, 132, 140, 150, 162, 175, 184]} />
          <StatCard label="Конверсия в платный" value="7.4%" delta={0.6} series={[5.8, 6.1, 6.4, 6.7, 6.9, 7.1, 7.4]} />
          <StatCard label="Trial → Paid" value="38%" delta={2.1} series={[30, 31, 33, 35, 36, 37, 38]} />
          <StatCard label="Churn" value="2.1%" delta={-0.3} series={[3, 3, 2.8, 2.5, 2.4, 2.2, 2.1]} />
        </div>

        <Tabs defaultValue="plans">
          <TabsList>
            <TabsTrigger value="plans">Планы</TabsTrigger>
            <TabsTrigger value="trial">Триалы</TabsTrigger>
            <TabsTrigger value="promos">Промокоды</TabsTrigger>
            <TabsTrigger value="gifts">Подарки</TabsTrigger>
            <TabsTrigger value="billing">Биллинг</TabsTrigger>
          </TabsList>

          {/* Plans */}
          <TabsContent value="plans" className="mt-4 space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Plus */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-[17px] font-semibold">Frendly+</h3>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Месяц, ₽</Label>
                    <Input defaultValue="599" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Год, ₽</Label>
                    <Input defaultValue="4990" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Месяц USD</Label>
                    <Input defaultValue="6.99" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Год USD</Label>
                    <Input defaultValue="59.99" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px]">Фичи (по строкам)</Label>
                  <Textarea rows={4} defaultValue={"Безлимит свайпов\nПриоритет в встречах\nСкрытие профиля\nПолучай супер-лайки"} />
                </div>
              </div>

              {/* After Dark */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h3 className="font-display text-[17px] font-semibold">After Dark</h3>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Месяц, ₽</Label>
                    <Input defaultValue="1290" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Год, ₽</Label>
                    <Input defaultValue="9990" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Месяц USD</Label>
                    <Input defaultValue="14.99" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px]">Год USD</Label>
                    <Input defaultValue="119.99" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px]">Фичи</Label>
                  <Textarea rows={4} defaultValue={"18+ контент\nЭксклюзивные ивенты\nАнонимный режим\nПриватные комнаты"} />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => action("Цены сохранены")}>Сохранить тарифы</Button>
            </div>
          </TabsContent>

          {/* Trial */}
          <TabsContent value="trial" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Триал включён</p>
                  <p className="text-[12px] text-muted-foreground">Разрешить новым пользователям бесплатный период</p>
                </div>
                <Switch checked={trialEnabled} onCheckedChange={setTrialEnabled} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Длительность Frendly+, дней</Label>
                  <Input type="number" defaultValue="7" disabled={!trialEnabled} />
                </div>
                <div className="space-y-2">
                  <Label>Длительность After Dark, дней</Label>
                  <Input type="number" defaultValue="3" disabled={!trialEnabled} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Требовать карту</p>
                  <p className="text-[12px] text-muted-foreground">Привязка карты при активации триала</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Автоматическое продление</p>
                  <p className="text-[12px] text-muted-foreground">После триала списание происходит автоматически</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => action("Триал обновлён")}>Сохранить</Button>
              </div>
            </div>
          </TabsContent>

          {/* Promos */}
          <TabsContent value="promos" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button className="gap-2" onClick={() => action("Промокод создан")}>
                <Plus className="w-4 h-4" /> Новый промокод
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Код</TableHead>
                    <TableHead>Скидка</TableHead>
                    <TableHead>План</TableHead>
                    <TableHead>Использовано</TableHead>
                    <TableHead>Действует до</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promos.map((p) => (
                    <TableRow key={p.code}>
                      <TableCell className="font-mono text-[13px] font-semibold">{p.code}</TableCell>
                      <TableCell className="text-[13px] tabular-nums">{p.discount}%</TableCell>
                      <TableCell><StatusBadge status={p.plan} /></TableCell>
                      <TableCell className="text-[13px] tabular-nums">{p.uses}/{p.limit}</TableCell>
                      <TableCell className="text-[12.5px] text-muted-foreground">{p.expires}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => action("Промокод удалён")}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Gifts */}
          <TabsContent value="gifts" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6 space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-5 h-5 text-primary" />
                <p className="text-[14px] font-semibold">Подарить подписку</p>
              </div>
              <p className="text-[12px] text-muted-foreground">Бесплатная выдача без оплаты — для амбассадоров и компенсаций.</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Кому (handle)</Label>
                  <Input placeholder="@username" />
                </div>
                <div className="space-y-2">
                  <Label>План</Label>
                  <Input defaultValue="Frendly+" />
                </div>
                <div className="space-y-2">
                  <Label>Длительность, мес</Label>
                  <Input type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label>Причина</Label>
                  <Input placeholder="Compensation / VIP / Test" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Сообщение пользователю</Label>
                <Textarea rows={2} placeholder="Спасибо, что вы с нами!" />
              </div>
              <div className="flex justify-end">
                <Button className="gap-2" onClick={() => action("Подписка отправлена в подарок")}>
                  <Gift className="w-4 h-4" /> Подарить
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6 space-y-5 max-w-2xl">
              <div className="space-y-2">
                <Label>Платёжный провайдер</Label>
                <Input defaultValue="Stripe + ЮKassa" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Валюта по умолчанию</Label>
                  <Input defaultValue="RUB" />
                </div>
                <div className="space-y-2">
                  <Label>НДС, %</Label>
                  <Input defaultValue="20" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Авто-возврат при споре</p>
                  <p className="text-[12px] text-muted-foreground">Возвращать оплату автоматически при chargeback</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">Чеки по email</p>
                  <p className="text-[12px] text-muted-foreground">Отправлять PDF-чек после каждой оплаты</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => action("Биллинг обновлён")}>Сохранить</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
