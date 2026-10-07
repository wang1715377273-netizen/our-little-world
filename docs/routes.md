# Route Map

## 入口

- `/`：服务器端重定向到 `/login`
- `/login`：中文登录页，当前为 Demo 流程
- `/dashboard`：主应用首页

当前基础流程：

```text
/ → /login
/login → /dashboard
```

## Auth

- `/login`：登录入口 UI，预留邮箱密码、Magic Link、OAuth 和密码找回扩展点。当前阶段不实现真实 Supabase Auth。

## Main App

- `/dashboard`：首页 / 我们的空间
- `/moments`：我们的时光
- `/gallery`：相册，包含响应式网格和图片详情弹窗
- `/letters`：情书列表
- `/letters/[id]`：情书详情
- `/cycle`：经期日历 UI
- `/music`：我们的歌和歌单页面
- `/anniversaries`：纪念日
- `/games`：一起玩入口
- `/emotions`：情绪盒
- `/about`：关于我们
- `/settings`：设置

## Future Routes

- `/timeline`
- `/memories`
- `/voice`
- `/travel`
- `/wishes`
- `/future`
- `/games/[gameId]`
