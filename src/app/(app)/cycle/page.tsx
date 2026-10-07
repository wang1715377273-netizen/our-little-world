import { CycleCalendar } from "@/components/calendar/cycle-calendar";
import { PageHeader, PageShell } from "@/components/layout/page-shell";

export default function CyclePage() {
  return (
    <PageShell>
      <PageHeader eyebrow="私密" title="经期日历" description="当前阶段只搭建记录和备注的界面，不提供预测、诊断或任何医学结论。" />
      <CycleCalendar />
    </PageShell>
  );
}
