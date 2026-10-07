import { differenceInCalendarDays, parseISO } from "date-fns";
import { CalendarHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { anniversaries } from "@/features/mock-data";

const repeatLabels = {
  none: "不重复",
  yearly: "每年",
} as const;

const typeLabels = {
  met: "相识",
  together: "在一起",
  birthday: "生日",
  milestone: "里程碑",
  custom: "自定义",
} as const;

export default function AnniversariesPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="日期" title="纪念日" description="重要日子会记录日期、类型、重复规则，并为未来数据库接入保留字段。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {anniversaries.map((item) => {
          const daysPassed = differenceInCalendarDays(new Date(), parseISO(item.date));
          return (
            <Card key={item.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <CalendarHeart className="size-6 text-primary" />
                  <Badge variant="secondary">{repeatLabels[item.repeat]}</Badge>
                </div>
                <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-muted-foreground">类型</p>
                    <p className="mt-1 font-medium">{typeLabels[item.type]}</p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-muted-foreground">日期</p>
                    <p className="mt-1 font-medium">{item.date}</p>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-muted-foreground">已经过去</p>
                    <p className="mt-1 font-medium">{Math.max(0, daysPassed)} 天</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
