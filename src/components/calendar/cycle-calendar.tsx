"use client";

import { addMonths, format, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

export function CycleCalendar() {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [month]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{format(month, "yyyy年 M月")}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" aria-label="上个月" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" aria-label="下个月" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
            {["一", "二", "三", "四", "五", "六", "日"].map((day) => <div key={day} className="py-2">{day}</div>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {days.map((day) => (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelected(day)}
                className={cn(
                  "aspect-square rounded-md border text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2",
                  !isSameMonth(day, month) && "text-muted-foreground/45",
                  isSameDay(day, selected) && "border-primary bg-accent text-foreground",
                )}
              >
                {format(day, "d")}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PenLine className="size-5 text-primary" /> 当日记录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">已选择日期</p>
          <p className="text-2xl font-semibold">{format(selected, "yyyy年M月d日")}</p>
          <Textarea placeholder="这里以后可以写私密备注。真实保存会在接入 Supabase Auth 和 RLS 后实现。" />
          <Button disabled className="w-full">以后保存记录</Button>
        </CardContent>
      </Card>
    </div>
  );
}
