import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { photos } from "@/features/mock-data";

export default function GalleryPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="照片" title="相册" description="收藏只属于我们的真实瞬间，点击照片即可放大查看。" />
      <GalleryGrid photos={photos} />
    </PageShell>
  );
}
