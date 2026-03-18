export const VIDEO_SOURCES = {
  // 尽量使用浏览器可直接播放的公开测试视频；若加载失败，会自动回退到渐变背景
  rain: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"],
  lab: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"],
  cosmos: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"],
  blackboard: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"],
};

export const DEFAULT_TRUTH_ANCHOR = "a^2 + b^2 = c^2";
export const DEFAULT_STRATEGY = "面积切割生长法";

export const BRANCHES = [
  {
    id: "main",
    title: "主线：面积生长证明",
    desc: "公式出现 → 面积切割 → 数值对齐 → 可点击跳转。",
    route: "Scene A → Shot 1/2/3",
    tags: ["logic", "narrative"],
  },
  {
    id: "wrong-cut",
    title: "分枝：错误切割（纠错）",
    desc: "用户点击了错误区域 → 系统突出冲突 → 回到正确切割法。",
    route: "Scene A → Shot 2' → Shot 2",
    tags: ["warn", "logic"],
  },
  {
    id: "deep-proof",
    title: "分枝：逻辑加深（推导）",
    desc: "进入更抽象的证明路径：从几何转代数，强调语义对齐。",
    route: "Scene B → Derivation",
    tags: ["logic"],
  },
  {
    id: "atmosphere",
    title: "分枝：叙事氛围（沉浸）",
    desc: "降低逻辑密度，提升氛围与景深，突出“呼吸感”。",
    route: "Scene C → Mood",
    tags: ["narrative"],
  },
];

export const PROJECTS = [
  {
    id: "p-001",
    name: "勾股定理：面积生长证明",
    desc: "从意图到分镜：公式出现、面积生长、数值对齐；含纠错分枝与逻辑加深。",
    updatedAt: "2026-03-17 17:30",
    status: "active",
  },
  {
    id: "p-002",
    name: "mRNA 分子：空间热区讲解",
    desc: "空间层热区驱动叙事；逻辑覆盖用于标注与变量对齐。",
    updatedAt: "2026-03-16 21:05",
    status: "draft",
  },
  {
    id: "p-003",
    name: "千斤顶：力学推导 + 交互演示",
    desc: "强调语义对齐：每个 UI 跳动都可由物理/数学逻辑支撑（LKM-P）。",
    updatedAt: "2026-03-14 10:22",
    status: "archived",
  },
];

export const ASSETS = [
  { id: "a-01", name: "blackboard-grid.png", meta: "image · 1920×1080" },
  { id: "a-02", name: "chalk-font.otf", meta: "font · 1.2MB" },
  { id: "a-03", name: "ambient-rain.wav", meta: "audio · 44.1kHz" },
  { id: "a-04", name: "mrna.glb", meta: "3d · glTF" },
  { id: "a-05", name: "jack.glb", meta: "3d · glTF" },
  { id: "a-06", name: "broll-lab.mp4", meta: "video · 10s" },
];

export const STORYBOARD = [
  {
    id: "s-01",
    title: "Shot 1：公式出现",
    desc: "字符飞入、变形、高亮；锚定真理底座。",
    durationSec: 4,
    tags: ["logic", "intro"],
  },
  {
    id: "s-02",
    title: "Shot 2：面积生长",
    desc: "SVG 路径生长：从线段“推”成面；可点击触发分枝。",
    durationSec: 6,
    tags: ["logic", "growth"],
  },
  {
    id: "s-03",
    title: "Shot 3：数值对齐",
    desc: "变量与图形语义对齐；跨模态联动提示（点击 a^2）。",
    durationSec: 5,
    tags: ["logic", "align"],
  },
];

export const RENDER_JOBS = [
  {
    id: "j-9812",
    projectId: "p-001",
    title: "Remotion 渲染：主线 v1",
    status: "running",
    progress: 62,
    eta: "00:41",
    updatedAt: "2026-03-17 17:28",
  },
  {
    id: "j-9788",
    projectId: "p-001",
    title: "导出：纠错分枝片段",
    status: "failed",
    progress: 12,
    eta: "--:--",
    updatedAt: "2026-03-17 16:52",
  },
  {
    id: "j-9741",
    projectId: "p-002",
    title: "预览渲染：空间热区版本",
    status: "success",
    progress: 100,
    eta: "00:00",
    updatedAt: "2026-03-16 21:03",
  },
];

export const VERSIONS = [
  {
    id: "v-main-1",
    projectId: "p-001",
    name: "主线 v1",
    branchId: "main",
    note: "默认路径，逻辑/叙事均衡。",
    createdAt: "2026-03-17 16:20",
  },
  {
    id: "v-wrong-1",
    projectId: "p-001",
    name: "纠错分枝 v1",
    branchId: "wrong-cut",
    note: "错误操作触发冲突提示并回归正解。",
    createdAt: "2026-03-17 16:34",
  },
  {
    id: "v-deep-1",
    projectId: "p-001",
    name: "逻辑加深 v1",
    branchId: "deep-proof",
    note: "从几何转代数的更抽象推导。",
    createdAt: "2026-03-17 16:48",
  },
];

export function makeLkmpRun(intent, params) {
  const now = Date.now();
  const base = [
    {
      id: `n-${now}-intent`,
      title: "意图识别",
      meta: "Skill: Intent Parser",
      desc: `识别用户意图：${intent || "（空）"}`,
    },
    {
      id: `n-${now}-truth`,
      title: "事实锚点",
      meta: "Skill: Truth Retrieval",
      desc: `锁定真理底座：${DEFAULT_TRUTH_ANCHOR}`,
    },
    {
      id: `n-${now}-strategy`,
      title: "认知策略",
      meta: "Skill: Cognitive Compiler",
      desc: `采用策略：${DEFAULT_STRATEGY}（Logic=${params.logicWeight.toFixed(
        2,
      )}, Narrative=${params.narrativeWeight.toFixed(2)}）`,
    },
    {
      id: `n-${now}-scene`,
      title: "场景描述",
      meta: "Skill: Scene Composer",
      desc: `环境：${params.sceneLabel}；前景/景深按权重动态分配（原型模拟）。`,
    },
    {
      id: `n-${now}-storyboard`,
      title: "分镜描述",
      meta: "Skill: Video Architect",
      desc: "拆解为：公式出现、面积生长、数值对齐三个逻辑分镜。",
    },
    {
      id: `n-${now}-render`,
      title: "分镜生成",
      meta: "Render: Remotion (Mock)",
      desc: "模拟云端渲染：生成可点击的互动视频块（本原型用 SVG/卡片替代）。",
    },
    {
      id: `n-${now}-assemble`,
      title: "分镜组装",
      meta: "Assembler: Interactive Timeline",
      desc: "生成可跳转的互动成品，并同步分枝导航器。",
    },
  ];

  return base;
}

