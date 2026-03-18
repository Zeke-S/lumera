# Lumera 前端原型（静态交互）

本目录是一个**产品级前端原型**（非某一个具体产品落地），用于模拟实现前端功能与静态效果：三管线融合画布、Omnibar 全能输入框、分枝导航器、时空透视滑块、LKM-P 节点缩影等。

## 如何运行

本项目使用 **Next.js + TypeScript + Tailwind CSS** 技术栈。

### 前置要求

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

### 安装与启动

在 `web/` 目录下安装依赖并启动：

```bash
cd web
npm install
npm run dev
```

然后访问终端输出的本地地址（通常是 `http://localhost:3000`）。

### 常见问题

- **端口被占用**：修改 `web/package.json` 中的端口配置，或杀掉占用进程
- **改完代码没生效**：强制刷新（macOS 常用：`⌘⇧R`）
- **依赖安装失败**：删除 `node_modules` 和 `package-lock.json`，重新运行 `npm install`

## Next.js 架构说明

项目采用 Next.js 14 App Router 架构：

- **入口文件**：`web/src/app/page.tsx`
- **样式入口**：`web/src/app/globals.css`（复用根目录 `styles.css`）
- **技术栈**：Next.js + TypeScript + Tailwind CSS v4 + shadcn/ui
- **架构模式**：Feature-First（功能优先）

### 目录结构

```
web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # 主页
│   │   ├── globals.css   # 全局样式
│   │   └── layout.tsx    # 布局
│   ├── components/       # 公共组件
│   │   └── ui/          # shadcn/ui 组件
│   ├── features/        # 功能模块
│   │   └── core/        # 核心数据与逻辑
│   └── lib/             # 工具函数
├── package.json         # 依赖配置
└── tsconfig.json        # TypeScript 配置
```

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

## 核心文件

- `web/src/app/page.tsx`：主页面组件
- `styles.css`：视觉规范（玻璃拟态、层级、呼吸感动画基础）
- `web/src/features/core/mock-data.ts`：静态数据模型（分枝、LKM-P 节点生成）
- `web/src/app/globals.css`：全局样式 + 设计系统令牌

