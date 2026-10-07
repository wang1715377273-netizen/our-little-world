"use client";

import { ErrorState } from "@/components/common/error-state";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState title="这里暂时有点不对" actionLabel="再试一次" onAction={reset} />;
}
