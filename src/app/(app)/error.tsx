"use client";

import { ErrorState } from "@/components/common/error-state";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState title="这个空间暂时没有加载成功" actionLabel="再试一次" onAction={reset} />;
}
