# Lumera 前端原型（静态交互）

本目录是一个**产品级前端原型**（非某一个具体产品落地），用于模拟实现前端功能与静态效果：三管线融合画布、Omnibar 全能输入框、分枝导航器、时空透视滑块、LKM-P 节点缩影等。

## 如何运行

本仓库现在有两套运行方式：

- **Next 版（推荐）**：`web/`（Next.js + Tailwind v4，逐步引入 shadcn/ui）
- **静态版（legacy）**：仓库根目录（`index.html + styles.css + src/`），无需 Node/npm

### 运行 Next 版（推荐）

前置要求：
- Node.js **20.9+**
- npm（或 pnpm / yarn）

macOS 安装 Node（任选其一）：

```bash
# 方式 1：Homebrew
brew install node@20

# 方式 2：Volta（更适合多项目切换 Node 版本）
curl https://get.volta.sh | bash
volta install node@20
```

在 `web/` 下安装依赖并启动：

```bash
cd web
npm install
npm run dev
```

然后访问终端输出的本地地址（通常是 `http://localhost:3000`）。

### 运行静态版（legacy）

静态版不依赖 Node/npm，推荐用静态服务器方式运行（可避免浏览器对本地文件的限制）。

- **方式 A：静态服务器（推荐）**

```bash
python3 -m http.server 5173
```

- 访问：`http://localhost:5173/`

- **方式 B：直接打开（次选）**
  - 双击 `index.html`
  - 注意：部分浏览器会限制 `file://` 下的视频/模块加载；如果出现背景视频不显示或页面空白，请改用方式 A。

入口说明（静态版）：
- 页面入口：`index.html`
- 脚本入口：`src/app/init.js`

### 常见问题

- **端口被占用**：把 `5173` 换成其它端口，例如 `8000`
- **改完代码没生效**：强制刷新（macOS 常用：`⌘⇧R`），或清理浏览器缓存
- **背景视频加载失败**：原型会自动回退到渐变背景（不影响主要交互）

## 标准化改写（Feature-First，零构建）

为了在**不引入 Node 构建链**的前提下提升可维护性，项目已新增 `src/` 目录，将原先集中在 `app.js/data.js` 的逻辑拆分为“按功能域组织”的模块结构。

- **当前入口**：`index.html` → `src/app/init.js`
- **旧版实现**：根目录旧的 `app.js` / `data.js` 已移除（已由 `src/` 下模块化实现替代）

## Next 版（web/）

`web/` 是 Next.js 版原型入口，当前策略是：
- **先保证视觉一致**：`web/src/app/globals.css` 直接复用根目录的 `styles.css`
- **再迁移交互**：把原本的 DOM 逻辑逐步改成 React 组件 +（可选）shadcn/ui

目录约定（核心）：

```text
src/
├── app/                 # 应用入口、路由、壳层引用
├── features/            # 按业务域拆分（Feature-First）
│   ├── core/            # 全局 mock 数据与领域常量
│   ├── assets/          # 资产库渲染等
│   └── projects/        # 项目页等
└── lib/                 # 通用工具（dom/store 等）
```

## 交互说明

- **Omnibar**：输入意图后点击“运行”或回车，会模拟 7 步业务流并生成 LKM-P 节点缩影
- **参数**：修改 `Logic Weight / Narrative Weight / Scene` 会实时影响覆盖层密度与氛围（视觉模拟）
- **分枝导航器**：点“分枝导航”打开面板，切换分枝以模拟“错误操作导致跳转”
- **空间热区**：点击“千斤顶热区 / mRNA 热区”触发跨层反馈（状态提示 + 进度推进）
- **快捷键**：`⌘K` 聚焦 Omnibar 输入框

## 文件结构

- `index.html`：单页原型布局（Canvas 三层 + Omnibar + 面板 + 模态）
- `styles.css`：视觉规范（玻璃拟态、层级、呼吸感动画基础）
- `src/app/init.js`：当前应用入口（路由、页面组装、工作台交互）
- `src/features/core/mock-data.js`：静态数据模型（分枝、LKM-P 节点生成）

