import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md text-center">
        <CardContent className="space-y-5 p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">404</p>
          <h1 className="text-3xl font-semibold">这里还没有内容。</h1>
          <p className="text-muted-foreground">你打开的页面还不在这个小世界里。</p>
          <Button asChild>
            <Link href="/dashboard">回到首页</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
