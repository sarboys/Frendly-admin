import { AdminTopbar } from "../components/Topbar";
import { StatCard } from "../components/StatCard";
import { analytics } from "../data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const AdminAnalytics = () => {
  return (
    <>
      <AdminTopbar title="Аналитика" subtitle="Метрики продукта, воронки и аудитория" />
      <div className="p-5 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="DAU" value={analytics.dau.value.toLocaleString("ru")} delta={analytics.dau.delta} series={analytics.dau.series} hint="Активных за сутки" />
          <StatCard label="MAU" value={analytics.mau.value.toLocaleString("ru")} delta={analytics.mau.delta} series={analytics.mau.series} hint="Активных за месяц" />
          <StatCard label="Ретеншн D7" value={`${analytics.retention.value}%`} delta={analytics.retention.delta} series={analytics.retention.series} hint="Возврат на 7 день" />
          <StatCard label="Ср. сессия" value={`${analytics.sessionAvg.value} мин`} delta={analytics.sessionAvg.delta} series={analytics.sessionAvg.series} />
        </div>

        <Tabs defaultValue="funnel" className="w-full">
          <TabsList>
            <TabsTrigger value="funnel">Воронка</TabsTrigger>
            <TabsTrigger value="geo">География</TabsTrigger>
            <TabsTrigger value="sources">Источники</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-[15px] mb-4">Воронка регистрации</h3>
              <div className="space-y-3">
                {analytics.funnel.map((s) => (
                  <div key={s.step}>
                    <div className="flex items-center justify-between text-[13px] mb-1.5">
                      <span className="font-medium">{s.step}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {s.value.toLocaleString("ru")} · <span className="text-foreground font-semibold">{s.pct}%</span>
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geo" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-[15px] mb-4">Города</h3>
              <div className="space-y-3">
                {analytics.geo.map((c) => (
                  <div key={c.city} className="grid grid-cols-[120px_1fr_auto] items-center gap-3 text-[13px]">
                    <span className="font-medium">{c.city}</span>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${c.share * 2}%`, maxWidth: "100%" }} />
                    </div>
                    <span className="text-muted-foreground tabular-nums">{c.users.toLocaleString("ru")} · {c.share}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-[15px] mb-4">Источники трафика</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {analytics.sources.map((s) => (
                  <div key={s.source} className="rounded-lg border border-border p-4">
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold">{s.source}</p>
                    <p className="font-display text-[22px] font-semibold mt-1">{s.pct}%</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{s.users.toLocaleString("ru")} юзеров</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
