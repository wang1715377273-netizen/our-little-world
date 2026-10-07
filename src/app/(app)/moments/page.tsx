import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { moments } from "@/features/mock-data";

export default function MomentsPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="时间线" title="我们的时光" description="这里会记录初见、纪念日、照片、地点、心情，以及未来还会发生的很多小事。" />
      <div className="relative space-y-5 before:absolute before:left-4 before:top-2 before:h-full before:w-px before:bg-border sm:before:left-6">
        {moments.map((moment) => (
          <article key={moment.id} className="relative pl-12 sm:pl-16">
            <div className="absolute left-0 top-5 flex size-8 items-center justify-center rounded-full border bg-card text-primary sm:size-12">
              <span className="size-2 rounded-full bg-primary" />
            </div>
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{moment.date}</p>
                    <h2 className="mt-1 text-xl font-semibold">{moment.title}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moment.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">{moment.content}</p>
                {moment.location ? (
                  <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {moment.location}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
