import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { games } from "@/features/mock-data";

const statusLabels = {
  planned: "规划中",
  ready: "可开始",
  draft: "草稿",
} as const;

export default function GamesPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="互动" title="一起玩" description="这里先作为游戏入口，未来可以扩展成记忆翻翻看、默契问答、猜猜哪一天等独立模块。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {games.map((game) => (
          <Card key={game.id} className="overflow-hidden">
            <div className="h-28 bg-[linear-gradient(135deg,var(--color-blush),var(--color-lavender))]" />
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{game.title}</h2>
                <Badge variant="outline">{statusLabels[game.status]}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{game.description}</p>
              <Button className="mt-5 w-full" disabled>
                <Play />
                以后开始
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
