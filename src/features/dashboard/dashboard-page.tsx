import Image from "next/image";
import { CalendarHeart, Camera, Mail, Music2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { letters } from "@/features/letters/data";
import { anniversaries, coupleProfile, dashboardStats, moments, photos, songs } from "@/features/mock-data";

export function DashboardPage() {
  const latestPhoto = photos[0];
  const latestLetter = letters[0];
  const latestMoment = moments[moments.length - 1];
  const currentSong = songs[0];

  return (
    <PageShell>
      <PageHeader
        eyebrow="我们的空间"
        title="欢迎回来"
        description="这里会慢慢收下我们的时光、相册、情书、音乐、纪念日，还有以后一起完成的小互动。"
      />

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="overflow-hidden border-primary/20 bg-card/82">
          <CardContent className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm text-muted-foreground">{dashboardStats.today}</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                在一起 {dashboardStats.daysTogether} 天
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                相识 {dashboardStats.daysKnown} 天。今天也是我们一起搭建这个小世界的一部分。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>我们之间</Badge>
                <Badge variant="secondary">纪念日计数</Badge>
              </div>
            </div>
            <div className="flex items-center justify-start sm:justify-end">
              <div className="flex -space-x-4">
                <div className="flex size-20 items-center justify-center rounded-full border-4 border-card bg-blush text-2xl font-semibold">
                  {coupleProfile.initialsA}
                </div>
                <div className="flex size-20 items-center justify-center rounded-full border-4 border-card bg-lavender text-2xl font-semibold">
                  {coupleProfile.initialsB}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarHeart className="size-5 text-primary" />
              下一个重要日子
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboardStats.nextAnniversary.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{dashboardStats.nextAnniversary.description}</p>
            <p className="mt-5 text-sm">
              还有 <span className="text-3xl font-semibold">{dashboardStats.nextAnniversary.daysUntil}</span> 天
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Camera className="size-4" /> 最近照片</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
              <Image src={latestPhoto.src} alt={latestPhoto.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
            </div>
            <p className="mt-3 font-medium">{latestPhoto.title}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Mail className="size-4" /> 最近一封情书</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{latestLetter.title}</p>
            <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">{latestLetter.excerpt}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Music2 className="size-4" /> 正在播放</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{currentSong.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{currentSong.artist}</p>
            <p className="mt-4 text-sm text-muted-foreground">{currentSong.lyricExcerpt}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="size-4" /> 今日一句话</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{latestMoment.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{dashboardStats.quote}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {anniversaries.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-5">
              <Badge variant="outline">{item.type}</Badge>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </PageShell>
  );
}
