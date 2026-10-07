# UI System

## 视觉方向

关键词：romantic、minimal、soft、warm、modern、personal、elegant。

界面应该像一个私人数字日记和情侣空间，而不是后台管理系统或普通粉色模板。

## Design Tokens

Design Tokens 定义在 `src/app/globals.css`：

- 颜色：米白、柔粉、浅紫、暖灰、深色文字
- 圆角：从 small 到 extra large
- 阴影：subtle 和 soft
- 动画：大多数交互控制在 150-300ms

## 导航

桌面端使用悬浮可折叠侧边栏，包含图标收起模式、active 状态、hover 状态、focus 状态和 tooltip。

移动端使用左上角 Hamburger 作为唯一收起入口；打开后显示覆盖层式 Mobile Navigation Drawer。Drawer 固定占据 `50vw` 宽度、覆盖 `100dvh` 高度，从左侧使用 `transform` 滑入 / 滑出，不推动右侧页面。Backdrop 覆盖整个 viewport 并提供轻微透明遮罩和 blur，Drawer 位于 Backdrop 上方。点击 Backdrop、右侧页面或按 Escape 会关闭 Drawer，点击导航后也会自动关闭；打开期间锁定背景页面滚动。

Drawer 与 Backdrop 始终挂载，只由 `open` 状态驱动，不使用条件卸载（避免动画期间或动画被打断后残留的遮罩层）。关闭状态必须立即满足：Backdrop 与 Drawer 的 `pointer-events: none`、`aria-hidden`、`inert`、导航链接 `tabIndex={-1}`，滑出动画结束后再切换 `visibility: hidden`。Hamburger 同样始终挂载，只切换 `aria-expanded`，避免 tap 期间按钮被卸载 / 重新挂载导致丢失 click 事件。Backdrop 在 `z-60`、Drawer 在 `z-70`，均高于 AppShell TopBar 的 `z-50`，因此 Drawer 打开时按设计覆盖 TopBar；关闭后必须立刻让出点击，不得继续拦截 TopBar。

收起状态下 Hamburger 必须保持 44px 正方形点击区域，移动端顶部控件统一使用 `touch-manipulation`，避免移动端 tap 延迟或丢失。

侧边栏由三个稳定区域组成：顶部 OL Logo、主体功能导航、底部关于与设置。桌面端左边缘固定，宽度从 68px 向右展开至 280px；Logo 与每个导航图标使用同一条固定的左侧中心线和 44px 正方形槽，只让右侧标签出现或消失。收起状态下导航项本身也收成 44px 正方形，active 背景不再横向拉伸。展开 / 收起使用约 380ms 的宽度过渡，标签同步进行最大宽度和透明度过渡，展开时略微延迟文字淡入，避免文字瞬间出现；图标槽和 Logo 不参与位移动画。主内容仅在桌面端随宽度调整左侧留白，移动端不受折叠状态影响。收起时只显示 OL Logo 与导航图标；当前不保留情侣关系卡片，OL Logo 区域本身是展开 / 收起按钮，不额外显示箭头按钮。

音乐播放器属于 `(app)` 全局布局，不属于 Sidebar。播放器在 AppShell 中只渲染一个实例：同一个 `fixed` 容器在移动端作为顶部 flex 行（Hamburger + 播放器），在 `lg` 断点切换为右上角独立定位。播放器组件内部使用一个响应式 `section`：移动端为 44px 单行紧凑样式，`lg` 断点恢复桌面端封面 44px、副标题与 `p-3` 面板样式。播放控制按钮固定为 40px 可点区域并使用 `touch-manipulation`。Mobile Drawer 打开时位于播放器和 TopBar 上方；关闭时必须立即释放点击，避免遮罩在滑出动画期间阻断播放器控件的点击。

## 共享布局

大多数页面使用：

- `PageShell`
- `PageHeader`
- `Card`
- `Badge`
- `EmptyState`、`ErrorState`、`LoadingState`

## 可访问性

交互元素需要有可见文字或 aria-label，保留清晰的 focus 状态。移动端固定导航必须考虑 safe-area padding。

## 中文布局说明

中文文案通常比英文更紧凑但信息密度更高。导航、按钮、卡片标题和移动底部导航需要优先使用短标签，例如“时光”“相册”“情书”“更多”，避免底部导航拥挤。
