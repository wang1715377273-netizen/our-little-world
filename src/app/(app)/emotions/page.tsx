"use client";

import { useState } from "react";
import { Smile } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { emotions } from "@/features/mock-data";
import type { EmotionItem } from "@/types/domain";

export default function EmotionsPage() {
  const [selected, setSelected] = useState<EmotionItem | null>(null);

  return (
    <PageShell>
      <PageHeader eyebrow="心情" title="情绪盒" description="先放下不同情绪的入口，未来可以保存文字、图片、音频和只给彼此看的安慰。" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {emotions.map((emotion) => (
          <button key={emotion.id} type="button" onClick={() => setSelected(emotion)} className="text-left focus-visible:outline-2 focus-visible:outline-offset-2">
            <Card className="h-full transition-transform hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <Smile className="size-6 text-primary" />
                  <Badge variant="secondary">{emotion.tone}</Badge>
                </div>
                <h2 className="mt-6 text-xl font-semibold">{emotion.label}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{emotion.note}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected ? (
            <DialogHeader>
              <DialogTitle>{selected.label}</DialogTitle>
              <DialogDescription>{selected.note}</DialogDescription>
            </DialogHeader>
          ) : null}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
