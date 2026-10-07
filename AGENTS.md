# AGENTS.md

任何 AI Coding Agent 修改本项目之前，必须先阅读本文件。

## 架构原则

- App Router 结构保留在 `src/app` 下。
- 使用路由组：`(auth)` 放公开认证页面，`(app)` 放主应用页面。
- UI 组合放在 `src/components`，功能数据和状态放在 `src/features/*`，共享类型放在 `src/types`。
- 不要把数据库查询直接写进展示组件。
- Mock Data 必须集中在 feature 层，不能散落在页面组件里。

## TypeScript 规范

- 必须保持 TypeScript strict mode。
- 避免使用 `any`，优先使用领域类型、泛型或 `unknown` 后再收窄。
- Server-only 代码不能进入 Client Component。

## Component 规范

- 组件应保持小而清晰。
- 优先复用 `src/components/ui` 中的基础组件。
- 页面结构优先使用 `PageShell`、`PageHeader` 和通用状态组件。
- Client Component 必须显式写 `"use client"`。

## Database 与 Supabase 规范

- `couple_id` 是情侣空间最核心的数据隔离边界。
- 永远不要把 `SUPABASE_SERVICE_ROLE_KEY` 暴露给浏览器。
- Supabase 客户端工具集中放在 `src/lib/supabase`。
- 数据库变化必须通过 `supabase/migrations` 中的 migration 记录。
- 私密表必须开启 RLS，并确保用户只能访问自己所属情侣空间的数据。

## 安全规范

- `cycle_records`、`letters`、`photos`、`emotion_notes` 等敏感数据必须限制为情侣空间成员可访问。
- 不要把敏感信息放进 URL。
- 表单进入 server action 或 route handler 前必须用 Zod 验证。

## 响应式规范

- 从移动端优先考虑布局。
- 桌面端使用可折叠悬浮侧边栏。
- 移动端使用底部导航和更多抽屉。
- 固定导航必须考虑 safe area，避免遮挡内容。

## Git 规范

- 不要回滚用户或其他 Agent 的无关修改。
- 修改保持聚焦。
- 架构、路由、数据模型或行为改变时必须同步文档。

## Changelog 规范

每次修改项目都必须更新 `docs/changelog.md`，最新记录放在最上方，旧记录保留。

每条记录必须使用精确到秒的真实时间：

```text
YYYY-MM-DD HH:mm:ss +08:00
```

统一模板：

```md
## YYYY-MM-DD HH:mm:ss +08:00

### 任务

简短说明本次任务目标。

### 修改内容

- `文件路径`
  - 具体修改 1
  - 具体修改 2

### 文件变更

#### 修改

- `xxx`

#### 新增

- `xxx`

#### 删除

- 无

### 实现功能

- 功能 1

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- `npm run lint`：通过
- `npm run build`：通过
- `npm run typecheck`：通过

### 备注

记录需要长期保留的信息。
```
