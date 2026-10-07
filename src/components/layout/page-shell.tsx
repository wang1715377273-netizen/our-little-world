import { cn } from "@/lib/utils/cn";

export function PageShell({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-base text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </header>
  );
}
