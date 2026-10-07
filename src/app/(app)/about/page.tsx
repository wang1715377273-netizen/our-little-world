import { appConfig } from "@/lib/constants/app";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="关于" title="关于我们" description="记录这个私人空间的故事、创建时间、重要日期、版本和致谢。" />
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["网站故事", "一个长期维护的情侣私人空间，用来保存时光、情书、照片、音乐和未来的小互动。"],
          ["创建时间", appConfig.createdAt],
          ["版本", appConfig.version],
          ["致谢", "使用 Next.js、Supabase 基础结构、Tailwind CSS、shadcn/ui 风格组件、Lucide 和 Framer Motion 搭建。"],
        ].map(([title, body]) => (
          <Card key={title}>
            <CardContent className="p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
