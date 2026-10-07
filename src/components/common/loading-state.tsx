import { Loader2 } from "lucide-react";

export function LoadingState({ label = "正在加载..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8 text-muted-foreground">
      <Loader2 className="mr-3 size-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
