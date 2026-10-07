# Our Little World

只属于我们的小世界。

Our Little World 是一个长期维护的情侣私人空间 Web App，不是一次性的纪念日页面。当前阶段已经完成项目基础、响应式应用框架、中文界面、Mock 内容、Supabase 基础结构和项目文档。

## 技术栈

- Next.js App Router、React、TypeScript strict mode
- Tailwind CSS 和 shadcn/ui 风格基础组件
- Lucide React 图标和 Framer Motion 动画
- React Hook Form 和 Zod 表单基础
- Supabase Auth、PostgreSQL、Storage 基础结构
- Zustand 仅用于需要跨页面保留的客户端状态
- date-fns 处理日期
- Vercel 作为部署目标

## 本地开发

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

当前默认入口为：

```text
/ → /login
```

登录页目前是 Demo 流程，点击“进入我们的世界”会进入：

```text
/login → /dashboard
```

## 环境变量

复制 `.env.example` 为 `.env.local`，并填写 Supabase 配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

不要在浏览器端暴露 `SUPABASE_SERVICE_ROLE_KEY`。

## Supabase

初始数据库 migration 位于 `supabase/migrations`。当前设计以 `couple_id` 作为情侣空间的数据隔离字段，并为私密数据表启用了基础 Row Level Security。

## 项目结构

```text
src/
  app/              App Router 路由组与页面
  components/       可复用 UI、布局、导航和功能组件
  config/           导航和应用配置
  features/         按功能组织的数据、页面组合和状态
  hooks/            预留共享 React hooks
  lib/              Supabase、工具、常量和验证
  types/            共享领域类型
supabase/           数据库 migration 和 seed 说明
docs/               架构、路由、数据库、UI 和变更文档
```

完整树状结构见 `PROJECT_STRUCTURE.md`。

## 当前阶段

当前已完成基础阶段，并接入单曲沉浸式音乐播放空间：

- 项目架构
- 工程基础
- 响应式 UI 框架
- 页面骨架
- 中文界面与中文文档
- Mock Data
- Supabase Schema 初版
- `/music` Now Playing 音乐模块
- MP3 音频播放、LRC 歌词解析与实时同步
- 专辑封面背景、响应式歌词区域和底部播放器

真实 Supabase Auth、数据库读写、图片上传、多曲目管理、音乐上传、游戏逻辑和完整业务流程仍留到后续阶段。

## 部署

部署到 Vercel 时，需要在 Vercel 项目设置中填写 Supabase 环境变量。
