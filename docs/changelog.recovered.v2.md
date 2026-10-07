# Changelog

## 2026-09-30 19:53:21 +08:00

### 任务

修复手机经局域网 IP 访问 dev server 时整页无交互（☰ 与音乐播放器点击均无反应）的问题。

### 排查过程与根因

通过局域网 IP（`http://192.168.1.7:3000`）走真实手机访问路径复现，并对照 localhost 验证：

- 复现结果：手机经局域网 IP 访问时 ☰ 与播放器上一首 / 播放暂停 / 下一首全部无反应，但无控制台报错、无网络失败请求。
- CDP 检测发现 `activeElement` 无 React 事件属性、合成 `click()` 无效、无 `[HMR] connected` 日志、`rootFiber` 为 0，确认 React **从未完成 hydration**，页面是静态 SSR HTML。
- localhost 访问一切正常（HMR 连接成功、React 事件正常挂载），说明此前所有触摸复测因走 localhost 而误判"正常"。
- 根因：Next.js 16 dev 模式下 app 启动会**先等待 HMR websocket 连接成功才执行 hydration**；HMR WS 握手携带 `Origin: http://192.168.1.7:3000`，而 dev server 源白名单默认仅 `localhost` 与自身 hostname，局域网 IP 不在其中，WS 升级被 403 拒绝，导致 hydration 永久挂起。手机只能通过局域网 IP 访问 dev server，因此仅手机端表现为"整页点不动"。

### 修改内容

- `next.config.ts`
  - 新增 `allowedDevOrigins: ["192.168.1.7", "192.168.*.*"]`，将本机局域网地址段加入 dev 源白名单，使 HMR websocket 握手通过、hydration 正常执行。
  - 新增注释说明该配置的作用与根因，避免后续被误删。

### 文件变更

#### 修改

- `next.config.ts`

#### 新增

- 无

#### 删除

- 无

### 实现功能

- 手机经局域网 IP 访问 dev server 时正常完成 hydration，☰ 与音乐播放器恢复交互。

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- 局域网 IP 访问：修复后出现 `[HMR] connected`、汉堡按钮挂载 React 事件属性、hydration 完成。
- 真实触摸事件复测（局域网 IP，390×844）：☰ 可打开 / 重开 Drawer，播放键可切换 暂停 / 播放 状态。
- 桌面 localhost 访问不受影响，原有交互与布局保持正常。

### 备注

- 该问题为 dev 调试环境配置，不影响生产构建；生产部署走正常域名即可。
- 若局域网地址段变化（如路由器重分配 IP），需同步更新 `allowedDevOrigins`。
- 早前 13:59 记录的"焦点管理修复"条目被错误插入在 changelog 中部（非置顶），不符合 AGENTS.md"新记录置顶"规范，后续应移至顶部。

## 2026-09-29 21:04:47 +08:00

### 任务

第十一阶段修复手机端收起状态 Hamburger 与同排音乐播放器控制按钮全部点击无反应的问题（Drawer 遮罩残留吞点击）。

### 排查过程与根因

使用 CDP 真实触摸事件（`Input.dispatchTouchEvent` + `Emulation.setTouchEmulationEnabled`）在 320 / 390 / 430px 视口复现并定位：

- 复现结果：Drawer 关闭后 60ms，`z-[60]` 的 `fixed inset-0` Backdrop 仍在 DOM 中且 `pointer-events: auto`（`rect {0,0,390,844} z=60 opacity≈0.96`）。
- 此时 ☰ 位置（38,38）最顶层元素是 Drawer 内部的 `<p>`，说明 Backdrop / Drawer 在退出动画期间继续覆盖整个视口。
- 立刻再点击 ☰：`dialog` 保持 0，**点击被吞掉**；同一水平线上的播放器上一首 / 播放暂停 / 下一首同样全部失效。
- 根因：`AnimatePresence` + 条件渲染导致 Drawer 关闭后存在约 400ms 的退出动画窗口，Backdrop（`z-60`）高于 AppShell TopBar（`z-50`）且保持可交互，拦截了 TopBar 的全部点击；若退出动画被打断，遮罩还会长期残留，形成"顶部栏永久无响应"。
- Hamburger 采用 `{!open && ...}` 条件挂载，Drawer 开关过程中会被卸载 / 重新挂载，进一步增加 tap 丢失概率。

### 修改内容

- `src/components/navigation/mobile-navigation.tsx`
  - 移除 `AnimatePresence` 与条件渲染，Hamburger 改为始终挂载，只切换 `aria-expanded`。
  - 新增 `aria-controls` 指向 Drawer id，点击改为 `setOpen((value) => !value)`。
  - Hamburger 直接使用 `lg:hidden` 并在收起状态保持 44px（`size-11`）点击区域，新增 `touch-manipulation`。
- `src/components/navigation/mobile-navigation-drawer.tsx`
  - 导出 `MOBILE_NAV_DRAWER_ID`，Drawer 与 Backdrop 改为始终挂载、由 `open` 驱动（`initial={false}` + `animate`）。
  - 关闭状态立即生效：`pointer-events: none`、`aria-hidden`、`inert`，导航链接 `tabIndex={-1}`；`visibility` 通过 `transition: visibility 0s linear 400ms` 在滑出动画结束后才切换为 `hidden`。
  - 保留原有 `50vw` / `100dvh` / 左侧 `transform` 滑入滑出、Backdrop 遮罩与 blur、点击 Backdrop 与导航链接关闭。
- `src/components/layout/app-shell.tsx`
  - 合并桌面端与移动端两个 `fixed z-50` 容器为单一容器，移动端作为 flex 行承载 Hamburger + 播放器，`lg` 断点切换为右…20642 chars truncated…/app/(app)/letters/page.tsx`
- `src/app/(app)/letters/[id]/page.tsx`
- `src/app/(app)/cycle/page.tsx`
- `src/components/calendar/cycle-calendar.tsx`
- `src/app/(app)/music/page.tsx`
- `src/app/(app)/anniversaries/page.tsx`
- `src/app/(app)/games/page.tsx`
- `src/app/(app)/emotions/page.tsx`
- `src/app/(app)/about/page.tsx`
- `src/app/(app)/settings/page.tsx`
- `src/components/navigation/sidebar.tsx`
- `src/components/navigation/mobile-navigation.tsx`
- `src/components/music/persistent-player.tsx`
- `src/components/common/loading-state.tsx`
- `src/components/common/error-state.tsx`
- `src/app/loading.tsx`
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/app/(app)/loading.tsx`
- `src/app/(app)/error.tsx`
- `src/components/ui/dialog.tsx`
- `src/lib/constants/app.ts`
- `src/lib/validations/auth.ts`
- `src/app/layout.tsx`
- `README.md`
- `AGENTS.md`
- `PROJECT_STRUCTURE.md`
- `docs/architecture.md`
- `docs/routes.md`
- `docs/database.md`
- `docs/ui.md`
- `public/audio/README.md`
- `supabase/seed/README.md`
- `docs/changelog.md`

#### 新增

- 无

#### 删除

- 无

### 实现功能

- 实现根路径 `/` 服务器端自动进入 `/login`
- 实现登录页作为项目默认入口
- 实现登录页点击“进入我们的世界”进入 `/dashboard`
- 实现主要用户界面中文化
- 实现 Mock Data 中文化
- 实现 Markdown 文档中文化
- 建立精确到秒的 Changelog 记录规范
- 在 Changelog 中同时记录修改内容、文件变更、实现功能、路由变化、数据库变化和验证结果

### 路由变化

```text
/ → /login
/login → /dashboard
```

### 数据库变化

无。

### 验证结果

- `npm run lint`：未能完成
  - 原因：当前工具执行器无法启动本地进程，返回 `helper_unknown_error: setup refresh had errors`
  - 当前状态：已尝试运行，但没有得到 ESLint 结果
- `npm run build`：未能完成
  - 原因：当前工具执行器无法启动本地进程，返回 `helper_unknown_error: setup refresh had errors`
  - 当前状态：已尝试运行，但没有得到 Next.js build 结果
- `npm run typecheck`：未能完成
  - 原因：当前工具执行器无法启动本地进程，返回 `helper_unknown_error: setup refresh had errors`
  - 当前状态：已尝试运行，但没有得到 TypeScript 检查结果
- 备用 Node 执行工具：未能完成
  - 原因：同样遇到 `windows sandbox failed: helper_unknown_error: setup refresh had errors`

### 备注

- 当前仍使用 Mock Auth，没有接入真实 Supabase Auth。
- 当前没有新增或修改数据库 migration。
- 后续阶段应在本地执行器恢复后重新运行 `npm run lint`、`npm run typecheck` 和 `npm run build`。
- 第三阶段建议实现真实认证、受保护路由和 Supabase Session 处理。

## 2026-09-27

### Added

- Initialized the Next.js App Router project foundation for Our Little World.
- Added strict TypeScript, Tailwind CSS, ESLint, shadcn/ui-style primitives, Framer Motion, Lucide React, Zod, React Hook Form, Zustand, date-fns, and Supabase client dependencies.
- Created the desktop floating sidebar, mobile bottom navigation, more drawer, app shell, and persistent mock music player.
- Created Phase 2 page skeletons for login, dashboard, moments, gallery, letters, cycle, music, anniversaries, games, emotions, about, and settings.
- Centralized mock data in `src/features/mock-data.ts`.
- Added Supabase initial schema and RLS migration with `couple_id` as the privacy boundary.
- Added PWA manifest and placeholder icon.
- Added README, architecture, routes, database, UI, changelog, and AGENTS documentation.

### Changed

- Set npm package name to `our-little-world` because the workspace folder name contains spaces and capital letters.
- Updated ESLint to use the Next 16 flat config exports directly.

### Fixed

- Avoided using inline mock data in page components by moving mock content to a feature-level data file.
- Fixed lint configuration compatibility with ESLint 9 and Next 16.

### Technical Notes

- Modified files establish the long-term architecture, route layout, design system, mock UI, Supabase schema, and AI maintenance rules.
- The current implementation intentionally does not connect real Supabase Auth, database queries, storage uploads, or game logic.
- Verified with `npm run typecheck`, `npm run lint`, and `npm run build`.
- Next recommended phase is Phase 3 authentication architecture and guarded route behavior.

## 2026-09-28

### Added

- Added `PROJECT_STRUCTURE.md` at the project root.

### Changed

- Documented the current source tree, route groups, reusable component folders, feature folders, Supabase files, and root configuration files.

### Fixed

- Clarified which generated directories are intentionally excluded from the structure map.

### Technical Notes

- The structure document is descriptive only and does not change runtime behavior.
- Future folder or file changes should be reflected in `PROJECT_STRUCTURE.md`.

## 2026-10-05 16:01:11 +08:00

### 任务

创建 Weather 天气模块基础架构。

### 修改内容

- `src/app/weather/page.tsx`
  - 新增 Weather 路由入口。
- `src/components/weather/`
  - 新增 common、desktop、mobile 组件目录及占位组件。
- `src/features/weather/`
  - 新增 types 和 store 目录。
  - 新增基础天气类型和 Zustand store 占位。

### 文件变更

#### 修改

- `docs/changelog.md`

#### 新增

- `src/app/weather/page.tsx`
- `src/components/weather/common/WeatherBackground.tsx`
- `src/components/weather/common/WeatherCard.tsx`
- `src/components/weather/common/WeatherIcon.tsx`
- `src/components/weather/desktop/WeatherDesktop.tsx`
- `src/components/weather/mobile/WeatherMobile.tsx`
- `src/features/weather/types/weather.ts`
- `src/features/weather/store/weatherStore.ts`

#### 删除

- 无。

### 实现功能

- 建立 Weather 页面、组件、类型和状态管理的基础边界。
- 暂不接入天气 API、导航、真实 UI 或数据请求。

### 路由变化

- 新增 `/weather`。

### 数据库变化

无。

### 验证结果

- `npm run typecheck`：待执行
- `npm run lint`：待执行

### 备注

本次仅创建基础结构和空占位组件，未修改已有模块。
## 2026-10-05 18:19:19 +08:00

### 任务

实现 `/weather` PC 端高保真天气页面。

### 修改内容

- `src/components/weather/common/WeatherBackground.tsx`
  - 新增全屏渐变天气背景和局部网格层。
- `src/components/weather/common/WeatherCard.tsx`
  - 新增天气页面玻璃拟态卡片容器。
- `src/components/weather/common/WeatherIcon.tsx`
  - 新增天气图标映射组件。
- `src/components/weather/desktop/`
  - 新增天气 Hero、逐小时预报、未来 7 天、温度趋势、天气详情和情侣天气卡片。
- `src/components/weather/desktop/WeatherDesktop.tsx`
  - 组合 PC Weather 页面完整结构。

### 文件变更

#### 修改

- `src/components/weather/common/WeatherBackground.tsx`
- `src/components/weather/common/WeatherCard.tsx`
- `src/components/weather/common/WeatherIcon.tsx`
- `src/components/weather/desktop/WeatherDesktop.tsx`
- `docs/changelog.md`

#### 新增

- `src/components/weather/desktop/WeatherHero.tsx`
- `src/components/weather/desktop/HourlyForecast.tsx`
- `src/components/weather/desktop/DailyForecast.tsx`
- `src/components/weather/desktop/TemperatureChart.tsx`
- `src/components/weather/desktop/WeatherDetailGrid.tsx`
- `src/components/weather/desktop/RomanticWeatherCard.tsx`

#### 删除

- 无。

### 实现功能

- 使用烟台 Mock 天气数据：23°、晴朗、最高 25°、最低 16°。
- 完成全屏天气背景、玻璃拟态卡片、逐小时预报、未来 7 天预报、温度趋势图、详情网格和情侣氛围卡片。
- 仅显示 Desktop Weather；Mobile Weather 仍保持占位组件。
- 未接入 API、数据库或第三方依赖。

### 路由变化

- 完成 `/weather` 页面展示。

### 数据库变化

无。

### 验证结果

- `npm run typecheck`：通过
- `npm run lint`：通过
- `npm run build`：通过

### 备注

未修改其他页面、Mobile Weather、导航、Audio 或现有业务模块。
## 2026-10-05 18:28:26 +08:00

### 任务

将 Weather 页面接入现有应用导航。

### 修改内容

- `src/config/navigation.ts`
  - 使用现有 Lucide 图标系统新增「天气」导航项。
  - 将「天气」放在「我们的时光」之后、「相册」之前。
- `src/app/(app)/weather/page.tsx`
  - 将 Weather 页面入口归入现有 App Router 应用布局，保留 `/weather` 路由。
- `src/app/weather/page.tsx`
  - 删除重复的路由入口，避免同一路由存在两套页面。

### 文件变更

#### 修改

- `src/config/navigation.ts`
- `docs/changelog.md`

#### 新增

- `src/app/(app)/weather/page.tsx`

#### 删除

- `src/app/weather/page.tsx`

### 实现功能

- Desktop Sidebar 和 Mobile Drawer 均从统一导航配置显示「天气」。
- 复用现有 WeatherDesktop / WeatherMobile，不接入 API、定位、数据库或真实天气数据。
- Sidebar 的主导航继续使用 `flex-1 min-h-0 overflow-y-auto`，底部辅助导航保持独立可见。

### 路由变化

- `/weather` 入口归入 `(app)` 路由组，URL 不变。

### 数据库变化

无。

### 验证结果

- `npm run lint`：待执行
- `npm run build`：待执行

### 备注

未进入 Weather Phase 3，未修改其他页面或 Mobile Weather UI。
## 2026-10-05 18:42:46 +08:00

### 任务

重构 Weather 数据层，接入 Hook、Zustand Store 和 Provider。

### 修改内容

- `src/features/weather/types/weather.ts`
  - 新增 `WeatherData`、`CurrentWeather`、`HourlyWeather`、`DailyWeather`、`WeatherDetail` 等领域类型。
- `src/features/weather/api/mockWeather.ts`
  - 新增完整烟台 Mock Weather 数据生成函数 `getMockWeather()`。
- `src/features/weather/store/weatherStore.ts`
  - 使用 Zustand 保存天气数据。
  - 新增 `WeatherProvider` 作为数据初始化边界。
- `src/features/weather/hooks/useWeather.ts`
  - 提供 UI 读取天气数据的统一 Hook。
- `src/app/(app)/weather/page.tsx`
  - 使用 `WeatherProvider` 包裹 Weather 页面。
- `src/components/weather/desktop/`
  - 将天气展示组件改为通过 props 接收 Hook 提供的数据。

### 文件变更

#### 修改

- `src/features/weather/types/weather.ts`
- `src/features/weather/store/weatherStore.ts`
- `src/app/(app)/weather/page.tsx`
- `src/components/weather/common/WeatherIcon.tsx`
- `src/components/weather/desktop/WeatherDesktop.tsx`
- `src/components/weather/desktop/WeatherHero.tsx`
- `src/components/weather/desktop/HourlyForecast.tsx`
- `src/components/weather/desktop/DailyForecast.tsx`
- `src/components/weather/desktop/TemperatureChart.tsx`
- `src/components/weather/desktop/WeatherDetailGrid.tsx`
- `src/components/weather/desktop/RomanticWeatherCard.tsx`
- `docs/changelog.md`

#### 新增

- `src/features/weather/api/mockWeather.ts`
- `src/features/weather/hooks/useWeather.ts`

#### 删除

- 无。

### 实现功能

- 数据流统一为：UI Components → `useWeather` → Zustand Store → `WeatherProvider` → Mock API。
- Weather UI 视觉和布局保持不变，仅替换数据来源。
- 未接入真实天气 API、定位或数据库。

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- `npm run typecheck`：通过
- `npm run lint`：通过
- `npm run build`：通过

### 备注

后续接入真实 API 时，只需替换 `features/weather/api/` 的数据来源，并保留 `WeatherData` 作为 UI 合约。
## 2026-10-04 11:05:55 +08:00

### 任务

微调 Mobile Music 唱针的垂直位置与显示尺寸。

### 修改内容

- `src/app/globals.css`
  - 调整 Mobile 唱针的响应式 `top`，使唱针轴进一步上移。
  - 调整 Mobile 唱针响应式宽度，使图片整体适度放大并保持比例。
  - 保持顶部圆轴对应的 `transform-origin: 32.4% 10.2%`。

### 文件变更

#### 修改

- `src/app/globals.css`
- `docs/changelog.md`

#### 新增

- 无。

#### 删除

- 无。

### 实现功能

- 唱针仍以 Mobile 播放器水平中心为定位基准。
- 播放/暂停动画、唱片、歌词和页面布局未修改。

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- `npm run typecheck`：通过
- `npm run lint`：通过

### 备注

本次仅调整 Mobile 唱针垂直位置和尺寸。

## 2026-10-04 10:47:10 +08:00

### 任务

将 Mobile Music 唱针替换为根目录现有图片资源，并修正唱针轴定位。

### 修改内容

- `src/components/music/music-experience.tsx`
  - 使用根目录 `唱针​.png` 作为唯一 Mobile 唱针图片。
  - 保留现有 `isPlaying` 驱动的抬起/落下状态。
- `src/app/globals.css`
  - 移除旧 CSS 绘制的轴、杆和唱头结构。
  - 将唱针 wrapper 以 Mobile Music 可视区域 `left: 50%` 定位。
  - 通过 wrapper 与图片偏移处理 PNG 透明画布，并以顶部圆轴为旋转中心。

### 文件变更

#### 修改

- `src/components/music/music-experience.tsx`
- `src/app/globals.css`
- `docs/changelog.md`

#### 新增

- 无。

#### 删除

- 无。

### 实现功能

- 仅显示一个图片唱针。
- 播放/暂停继续驱动唱针落下与抬起。
- 唱片、歌词、Audio 和 LRC 系统未修改。

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- `npm run typecheck`：通过
- `npm run lint`：通过
- `npm run build`：通过
- 浏览器中完成 Mobile Music 唱针布局几何测量。

### 备注

唱针资源当时仍为根目录 `唱针​.png`；后续资源迁移记录未在本批 session 中找到完整独立完成摘要。

## 2026-10-02 18:30:17 +08:00

### 任务

重构 `/music` 的 Mobile Music 播放器布局与交互边界。

### 修改内容

- `src/app/globals.css`
  - Mobile Music 使用 `100vh`、`100svh`、`100dvh` 回退链并限制溢出。
  - 中间视觉区和歌词视口使用 `flex: 1`、`min-height: 0`、`overflow: hidden`。
  - 收紧底部歌曲信息、进度、时间和控制按钮之间的间距。
  - 增加播放模式中央提示动画。
- `src/components/music/music-experience.tsx`
  - Mobile 结构固定为顶部标题、中间唱片/歌词、底部控制区。
  - 歌词模式只替换中间区域，歌曲信息和底部控制保持位置。
  - 增加 Mobile 页面滚动锁定与重复点击提示重置。
  - 沿用原有 Audio controller、player store 和 LRC 同步逻辑。
- `src/components/layout/app-shell.tsx`
  - 仅为 `/music` Mobile 取消会造成顶部/底部空白的通用间距。

### 文件变更

#### 修改

- `src/app/globals.css`
- `src/components/music/music-experience.tsx`
- `src/components/layout/app-shell.tsx`
- `docs/changelog.md`

#### 新增

- 无。

#### 删除

- 无。

### 实现功能

- Mobile Music 固定在可用视口内，歌词在中间视口内部移动。
- 播放模式提示约 1.4 秒后卸载，快速重复点击复用同一提示。
- 唱针轴与唱片中心使用 Mobile 视觉区域水平中心定位。

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- `npm run typecheck`：通过
- `npm run lint`：通过
- `npm run build`：通过
- 已进行 `/music` 的 Desktop 与 Mobile 浏览器检查；真实 Android 设备测试未执行。

### 备注

Audio controller、LRC parser 和歌曲数据未重构。

## 2026-10-01 20:33:30 +08:00

### 任务

将 `/music` 重构为沉浸式情侣音乐播放器。

### 修改内容

- `src/components/music/music-experience.tsx`
  - 实现桌面双栏与移动端沉浸式播放器界面。
  - 接入播放/暂停、上一首、下一首、进度拖动和音量控制。
- `src/features/music/audio-controller.ts`
  - 接入音频时间与播放控制链路。
- `src/utils/lrcParser.ts`
  - 接入 LRC 解析及与 `audio.currentTime` 的同步。
- `src/data/musicData.ts`
  - 提供《慢慢喜欢你》封面、MP3 和 LRC 资源数据。
- `src/app/(app)/music/page.tsx`
  - 接入新的 Music 页面组件。
- `src/components/layout/app-shell.tsx`
  - 处理 `/music` 页面专用布局边界。
- `src/app/globals.css`
  - 提供音乐页面视觉、歌词滚动和响应式样式。

### 文件变更

#### 修改

- `src/components/music/music-experience.tsx`
- `src/features/music/audio-controller.ts`
- `src/utils/lrcParser.ts`
- `src/data/musicData.ts`
- `src/app/(app)/music/page.tsx`
- `src/components/layout/app-shell.tsx`
- `src/app/globals.css`
- `README.md`
- `docs/changelog.md`

#### 新增

- `public/music/manman-xihuan-ni.jpg`
- `public/music/manman-xihuan-ni.lrc`

#### 删除

- 无。

### 实现功能

- Desktop 显示封面/歌曲信息与实时歌词双栏布局。
- Mobile 支持封面、歌曲信息、歌词和底部播放器。
- LRC 根据音频当前时间高亮并居中滚动。
- `/music` 页面隐藏顶部紧凑播放器，避免重复显示。

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- `npm run typecheck`：通过
- `npm run lint`：通过
- `npm run build`：通过
- 封面、LRC、MP3 请求正常。
- Desktop 1440px、Mobile 390px 检查通过。
- 本地 Chrome 播放/暂停与歌词同步测试通过。
- 未进行真实 Android Chrome / Edge 设备测试。

### 备注

未修改 Sidebar、Mobile Navigation、Gallery、Letters、数据库和路由。

## 2026-10-01 10:14:17 +08:00

### 任务

为 Gallery 添加两张真实照片并实现图片预览交互。

### 修改内容

- `src/features/mock-data.ts`
  - 追加两张真实照片数据并保留原有照片顺序。
- `src/components/gallery/gallery-grid.tsx`
  - 按索引管理当前预览照片并接入 Lightbox。
- `src/components/gallery/gallery-lightbox.tsx`
  - 新增全屏图片预览、缩放、下载、上一张/下一张和键盘操作。
- `src/app/(app)/gallery/page.tsx`
  - 更新相册页说明文案。
- `public/images/gallery/`
  - 新增两张规范化命名的 JPG 资源。

### 文件变更

#### 修改

- `src/features/mock-data.ts`
- `src/components/gallery/gallery-grid.tsx`
- `src/app/(app)/gallery/page.tsx`
- `docs/changelog.md`

#### 新增

- `src/components/gallery/gallery-lightbox.tsx`
- `public/images/gallery/our-memory-001.jpg`
- `public/images/gallery/our-memory-002.jpg`

#### 删除

- 无。

### 实现功能

- 支持横向和竖向图片在预览中完整显示。
- 支持鼠标滚轮、手机双指缩放、下载、循环切换和 Escape 关闭。
- 使用 `100dvh`、safe-area padding 和 44px 触控按钮适配移动端。

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- `npm run lint`：通过；存在 3 个 `.workbuddy/diag/*.mjs` 既有 warning，与本次无关。
- `npm run typecheck`：通过
- `npm run build`：通过
- 两张图片 HTTP 返回 `200`，`Content-Type: image/jpeg`；Range 请求返回 `206`。
- 真实 PC / Android Chrome / Edge 交互测试未执行。

### 备注

未引入新的图片库或依赖。

## 2026-09-30 20:52:35 +08:00

### 任务

添加《慢慢喜欢你 - 莫文蔚》真实音乐并接入现有播放器。

### 修改内容

- `public/audio/manman-xihuan-ni.mp3`
  - 将根目录 MP3 移动并规范化为英文文件名。
- `src/features/mock-data.ts`
  - 追加 `song-003`，保留原有歌曲、ID 和顺序。
  - 设置 `audioUrl: "/audio/manman-xihuan-ni.mp3"`。
- `src/components/music/persistent-player.tsx`
  - 增加隐藏的原生 `HTMLAudioElement`。
  - 将歌曲状态映射到音频加载、播放、暂停与结束后的 `next()`。
  - 无音频资源的旧示例曲目切换时同步暂停状态。

### 文件变更

#### 修改

- `src/features/mock-data.ts`
- `src/components/music/persistent-player.tsx`
- `docs/changelog.md`

#### 新增

- `public/audio/manman-xihuan-ni.mp3`

#### 删除

- 无。

### 实现功能

- 新歌曲能够在现有播放器中播放、暂停、切换，并同步歌曲名称和歌手。

### 路由变化

无。

### 数据库变化

无。

### 验证结果

- Session 中明确记录了音乐资源、播放器接入和保留原有歌曲的完成结果。
- 该 session 片段未保留完整的最终 typecheck/lint/build 输出。

### 备注

该记录的日期早于本阶段重点区间，但它是 10 月音乐页面重构的直接前置链路。
