import Link from "next/link";
import { MailOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { letters } from "@/features/letters/data";

export default function LettersPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="信件" title="情书" description="写给彼此的话，会在这里被好好保存。" />
      <div className="grid gap-4 md:grid-cols-2">
        {letters.map((letter) => (
          <Link key={letter.id} href={`/letters/${letter.id}`} className="focus-visible:outline-2 focus-visible:outline-offset-2">
            <Card className="h-full transition-transform hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <MailOpen className="size-6 text-primary" />
                  <Badge variant={letter.isRead ? "outline" : "default"}>{letter.isRead ? "已读" : "未读"}</Badge>
                </div>
                <h2 className="mt-6 text-xl font-semibold">{letter.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{letter.excerpt}</p>
                <p className="mt-6 text-sm text-muted-foreground">{[letter.authorName, letter.date].filter((value) => Boolean(value)).join(" · ")}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
