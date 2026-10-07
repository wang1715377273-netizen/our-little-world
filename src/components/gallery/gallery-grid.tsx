"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import type { GalleryPhoto } from "@/types/domain";

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`预览 ${photo.title}`}
            className="w-full cursor-zoom-in overflow-hidden rounded-lg border bg-card text-left shadow-subtle transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="relative aspect-[4/3] bg-muted">
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              {photo.isFavorite ? <Heart className="absolute right-3 top-3 size-5 fill-primary text-primary" /> : null}
            </div>
            <div className="p-4">
              <p className="font-medium">{photo.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{photo.date}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {photo.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            </div>
          </button>
        ))}
      </div>

      <GalleryLightbox
        photos={photos}
        index={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onIndexChange={setSelectedIndex}
      />
    </>
  );
}
