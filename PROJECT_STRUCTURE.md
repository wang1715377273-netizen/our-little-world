# Our Little World 项目结构

> 本文档记录项目当前的目录与文件组织方式。
>
> `node_modules/`、`.next/`、`.npm-cache/` 和 `.git/` 属于依赖、构建缓存或版本控制内部目录，因此不展开列出。

```text
Our Little World/
├── .env.example
├── .gitignore
├── AGENTS.md
├── README.md
├── PROJECT_STRUCTURE.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
│
├── docs/
│   ├── architecture.md
│   ├── changelog.md
│   ├── database.md
│   ├── routes.md
│   └── ui.md
│
├── public/
│   ├── audio/
│   │   └── README.md
│   ├── icons/
│   │   └── icon.svg
│   ├── images/
│   │   ├── gallery-1.svg
│   │   ├── gallery-2.svg
│   │   └── gallery-3.svg
│   └── manifest.json
│
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── anniversaries/
│   │   │   │   └── page.tsx
│   │   │   ├── cycle/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── emotions/
│   │   │   │   └── page.tsx
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx
│   │   │   ├── games/
│   │   │   │   └── page.tsx
│   │   │   ├── letters/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── moments/
│   │   │   │   └── page.tsx
│   │   │   ├── music/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   │
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── calendar/
│   │   │   └── cycle-calendar.tsx
│   │   ├── common/
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   └── loading-state.tsx
│   │   ├── gallery/
│   │   │   └── gallery-grid.tsx
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   └── page-shell.tsx
│   │   ├── music/
│   │   │   └── persistent-player.tsx
│   │   ├── navigation/
│   │   │   ├── mobile-navigation.tsx
│   │   │   └── sidebar.tsx
│   │   └── ui/
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       └── tooltip.tsx
│   │
│   ├── config/
│   │   └── navigation.ts
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   │   └── dashboard-page.tsx
│   │   ├── mock-data.ts
│   │   └── music/
│   │       └── player-store.ts
│   │
│   ├── hooks/
│   │   └── [预留给共享 React hooks]
│   │
│   ├── lib/
│   │   ├── constants/
│   │   │   └── app.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── utils/
│   │   │   └── cn.ts
│   │   └── validations/
│   │       └── auth.ts
│   │
│   └── types/
│       └── domain.ts
│
└── supabase/
    ├── config.toml
    ├── migrations/
    │   └── 202609270001_initial_schema.sql
    └── seed/
        └── README.md
```

## 目录职责

### `src/app`

Next.js App Router 页面、布局、错误状态、加载状态和全局样式。

- `(auth)`：登录及未来认证相关页面
- `(app)`：进入主应用后的页面和共享应用布局
- `[id]`：动态详情页，例如情书详情

### `src/components`

可复用的展示组件和交互组件。

- `ui`：基础设计系统组件
- `layout`：页面容器和应用壳
- `navigation`：桌面侧边栏和移动导航
- `common`：加载、错误、空状态
- `gallery`、`calendar`、`music`：领域交互组件

### `src/features`

按业务领域组织的页面逻辑、Mock Data 和客户端状态。

当前阶段的 Mock 内容集中在 `mock-data.ts`，没有直接写入页面组件。

### `src/lib`

共享工具、常量、表单验证和 Supabase 客户端。

### `src/types`

跨模块复用的领域类型定义。

### `supabase`

Supabase 本地配置、数据库 migration 和 seed 相关文件。

### `docs`

项目架构、路由、数据库、UI 系统和变更记录。

## 当前未展开目录

以下目录由工具或运行环境生成，不属于业务源代码：

```text
node_modules/   npm 依赖
.next/          Next.js 构建产物
.npm-cache/     本地 npm 缓存
.git/           Git 内部数据
```
