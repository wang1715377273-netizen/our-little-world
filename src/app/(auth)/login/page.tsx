import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { appConfig } from "@/lib/constants/app";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="space-y-5">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-subtle">
            <Sparkles className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{appConfig.relationshipName}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{appConfig.name}</h1>
            <p className="mt-4 max-w-md text-muted-foreground">{appConfig.subtitle}</p>
          </div>
        </section>

        <Card className="bg-card/86 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">欢迎回来</h2>
              <p className="mt-2 text-sm text-muted-foreground">这里是只属于我们两个人的小世界。</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="email">邮箱</label>
                <Input id="email" type="email" autoComplete="email" className="mt-2" placeholder="以后会用于真实登录" disabled />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="password">密码</label>
                <Input id="password" type="password" autoComplete="current-password" className="mt-2" placeholder="当前阶段暂不需要输入" disabled />
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/dashboard">进入我们的世界</Link>
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>真实注册、找回密码和 OAuth 会在后续阶段接入。</span>
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Button variant="outline" disabled><Mail /> Magic Link 预留</Button>
              <Button variant="outline" disabled>OAuth 预留</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
