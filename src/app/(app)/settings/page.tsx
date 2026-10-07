import { Bell, Database, Lock, Music2, Palette, Shield, UserRound, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell } from "@/components/layout/page-shell";

const settings = [
  { title: "账号", description: "邮箱、密码、Magic Link 和 OAuth 选项。", icon: UserRound },
  { title: "个人资料", description: "名字、头像和个人信息。", icon: UserRound },
  { title: "关系空间", description: "情侣资料、成员和重要日期。", icon: UsersRound },
  { title: "外观", description: "主题、界面密度和自定义鼠标设置。", icon: Palette },
  { title: "提醒", description: "未来的纪念日提醒和轻提醒。", icon: Bell },
  { title: "隐私", description: "可见范围和敏感数据规则。", icon: Shield },
  { title: "数据", description: "导出、备份和保留策略。", icon: Database },
  { title: "音乐", description: "播放器偏好和歌单。", icon: Music2 },
  { title: "安全", description: "登录会话、可信设备和访问检查。", icon: Lock },
];

export default function SettingsPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="设置" title="设置" description="第二阶段只保留界面和结构，为后续真实设置功能预留位置。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settings.map((item) => (
          <Card key={item.title}>
            <CardContent className="flex gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-accent">
                <item.icon className="size-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
