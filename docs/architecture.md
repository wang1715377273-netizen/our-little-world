# Architecture Plan

## 阶段范围

当前项目仍处在基础阶段，只处理架构、工程基础、响应式 UI、中文化和 Demo 入口流程。

- Phase 0：架构决策、路由图、组件图、数据库初步设计
- Phase 1：Next.js 基础、TypeScript strict、Tailwind CSS、依赖基线、Supabase 目录
- Phase 2：应用壳、响应式导航、设计系统、Mock Data 驱动的页面骨架

真实认证、真实数据库读写、媒体上传、复杂游戏、通知和健康预测都不在当前阶段实现。

## 应用结构

项目使用 Next.js App Router 和 route groups：

- `src/app/(auth)`：公开认证页面
- `src/app/(app)`：主应用页面和应用布局
- `src/app/api`：预留 Route Handlers

当前根路径 `/` 使用服务器端 `redirect("/login")`，默认进入登录页。`/login` 目前只提供 Demo 入口，点击“进入我们的世界”后进入 `/dashboard`。

全局应用壳提供桌面悬浮侧边栏和移动端底部导航。功能页面从 `src/features/mock-data.ts` 消费集中 Mock Data，后续替换为 Supabase 数据访问时不需要重写页面结构。

## 数据边界

核心隐私边界是 `couple_id`。长期内容属于情侣空间，而不是直接绑定到单个用户。用户通过 `couple_members` 加入情侣空间。

## UI 架构

基础组件位于 `src/components/ui`。布局组件位于 `src/components/layout`，导航组件位于 `src/components/navigation`，功能组件位于 `src/components/gallery`、`src/components/calendar` 等目录。

## 状态管理

Zustand 目前只用于常驻音乐播放器，因为它需要在路由切换时保留状态。其他页面优先使用局部状态，避免滥用全局状态。

## 安全说明

Service Role Key 不进入浏览器端代码。第一版 migration 中的 RLS 策略会将私密数据限制在所属情侣空间成员内。
