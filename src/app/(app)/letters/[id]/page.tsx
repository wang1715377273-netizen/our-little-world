import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { letters } from "@/features/letters/data";

export default async function LetterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const letter = letters.find((item) => item.id === id);
  if (!letter) notFound();
  const paragraphs = letter.body.split(/\n{2,}/).filter(Boolean);

  return (
    <PageShell>
      <PageHeader eyebrow="情书" title={letter.title} description={[letter.authorName, letter.date].filter((value) => Boolean(value)).join(" · ")}>
        <Button asChild variant="outline"><Link href="/letters">返回情书</Link></Button>
      </PageHeader>
      <Card className="mx-auto my-1 w-full max-w-none border-accent/70 p-1.5 lg:max-w-5xl">
        <CardContent className="letter-paper prose prose-neutral max-w-none text-foreground">
          {paragraphs.map((paragraph, index) => (
            <p key={`${letter.id}-${index}`}>{paragraph}</p>
          ))}
          {letter.signature ? <p className="letter-signature text-right text-muted-foreground">{letter.signature}</p> : null}
        </CardContent>
      </Card>
    </PageShell>
  );
}
