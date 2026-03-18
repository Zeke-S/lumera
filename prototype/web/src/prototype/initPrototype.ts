import {
  ASSETS,
  BRANCHES,
  DEFAULT_STRATEGY,
  DEFAULT_TRUTH_ANCHOR,
  PROJECTS,
  RENDER_JOBS,
  STORYBOARD,
  VERSIONS,
  VIDEO_SOURCES,
  makeLkmpRun,
} from "@/features/core/mock-data";
import { $, htmlEscape } from "@/lib/dom";

const sceneLabels: Record<string, string> = {
  blackboard: "黑板",
  lab: "实验室",
  cosmos: "宇宙",
  rain: "雨夜",
};

let appState = {
  route: "workbench",
  activeProjectId: "p-001",
  activeBranchId: "main",
  intent: "我想看勾股定理的动态证明",
  logicWeight: 0.55,
  narrativeWeight: 0.45,
  scene: "blackboard",
  progress: 18,
  lkmpNodes: [] as ReturnType<typeof makeLkmpRun>,
};

let workbench: any = null;

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function normalizeWeights() {
  const l = clamp01(Number(appState.logicWeight));
  const n = clamp01(Number(appState.narrativeWeight));
  const sum = l + n || 1;
  appState.logicWeight = l / sum;
  appState.narrativeWeight = n / sum;
}

function routeFromHash() {
  const h = (location.hash || "").replace(/^#\/?/, "");
  const r = h.split("?")[0]?.trim();
  return r || "workbench";
}

function setNavActive(route: string) {
  document.querySelectorAll<HTMLAnchorElement>(".navItem").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}

function setHeader(title: string, subtitle: string) {
  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");
  if (pageTitle) pageTitle.textContent = title;
  if (pageSubtitle) pageSubtitle.textContent = subtitle;
}

function openAssets(open: boolean) {
  const drawer = document.getElementById("assetsDrawer") as HTMLElement | null;
  if (!drawer) return;
  drawer.hidden = !open;
}

function renderAssets() {
  const list = document.getElementById("assetList");
  if (!list) return;
  list.innerHTML = "";
  for (const a of ASSETS) {
    const el = document.createElement("div");
    el.className = "assetItem";
    el.innerHTML = `
      <div class="assetName">${a.name}</div>
      <div class="assetMeta">${a.meta}</div>
    `;
    list.appendChild(el);
  }
}

function renderProjectsPage(viewRoot: HTMLElement) {
  setHeader("项目", "项目列表 / 新建项目（原型占位）");
  const rows = PROJECTS.map((p) => {
    const status =
      p.status === "active" ? "ok" : p.status === "draft" ? "run" : "fail";
    return `
      <div class="row">
        <div class="rowMain">
          <div class="rowTitle">${htmlEscape(p.name)}</div>
          <div class="rowDesc">${htmlEscape(p.desc)}</div>
          <div class="rowDesc">${htmlEscape(p.updatedAt)}</div>
        </div>
        <div class="rowRight">
          <span class="status ${status}">${htmlEscape(p.status)}</span>
          <button class="btn btnPrimary" type="button" data-open-project="${htmlEscape(
            p.id,
          )}">打开</button>
        </div>
      </div>
    `;
  }).join("");

  viewRoot.innerHTML = `
    <section class="page">
      <div class="grid2">
        <div class="panel">
          <div class="panelTitle2">我的项目</div>
          <div class="list">${rows}</div>
        </div>
        <div class="panel">
          <div class="panelTitle2">快速创建（占位）</div>
          <div class="list">
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">从意图生成</div>
                <div class="rowDesc">输入一句话 → 自动生成分镜与默认参数。</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button" data-goto="workbench">进入工作台</button></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">从模板创建</div>
                <div class="rowDesc">黑板 / 实验室 / 宇宙 / 雨夜 氛围模板。</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button">选择模板</button></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  viewRoot.querySelectorAll<HTMLElement>("[data-open-project]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = (btn as any).dataset.openProject;
      appState.activeProjectId = id;
      location.hash = "#/workbench";
    });
  });
  viewRoot.querySelectorAll<HTMLElement>("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = (btn as any).dataset.goto;
      location.hash = `#/${r}`;
    });
  });
}

function renderRenderPage(viewRoot: HTMLElement) {
  setHeader("渲染中心", "任务队列 / 状态 / 日志（原型）");
  const items = RENDER_JOBS.map((j) => {
    const status =
      j.status === "success" ? "ok" : j.status === "running" ? "run" : "fail";
    return `
      <div class="row">
        <div class="rowMain">
          <div class="rowTitle">${htmlEscape(j.title)}</div>
          <div class="rowDesc">项目：${htmlEscape(
            j.projectId,
          )} · 更新：${htmlEscape(j.updatedAt)}</div>
          <div class="rowDesc">进度：${htmlEscape(j.progress)}% · ETA：${htmlEscape(
            j.eta,
          )}</div>
        </div>
        <div class="rowRight">
          <span class="status ${status}">${htmlEscape(j.status)}</span>
          <button class="btn btnGhost" type="button">查看日志</button>
        </div>
      </div>
    `;
  }).join("");

  viewRoot.innerHTML = `
    <section class="page">
      <div class="panel">
        <div class="panelTitle2">渲染任务</div>
        <div class="list">${items}</div>
      </div>
    </section>
  `;
}

function renderBranchesPage(viewRoot: HTMLElement) {
  setHeader("版本/分枝", "版本对比 / 分枝跳转（原型）");
  const items = VERSIONS.filter(
    (v) => v.projectId === appState.activeProjectId,
  ).map((v) => {
    return `
      <div class="row">
        <div class="rowMain">
          <div class="rowTitle">${htmlEscape(v.name)}</div>
          <div class="rowDesc">分枝：${htmlEscape(
            v.branchId,
          )} · 创建：${htmlEscape(v.createdAt)}</div>
          <div class="rowDesc">${htmlEscape(v.note)}</div>
        </div>
        <div class="rowRight">
          <button class="btn btnPrimary" type="button" data-switch-branch="${htmlEscape(
            v.branchId,
          )}">在工作台打开</button>
        </div>
      </div>
    `;
  }).join("");

  viewRoot.innerHTML = `
    <section class="page">
      <div class="grid2">
        <div class="panel">
          <div class="panelTitle2">版本列表</div>
          <div class="list">${items || "<div class='smallMuted'>暂无版本</div>"}</div>
        </div>
        <div class="panel">
          <div class="panelTitle2">对比预览（占位）</div>
          <div class="smallMuted">这里可展示 A/B 版本的分镜差异、参数差异与 LKM-P 节点对齐。</div>
          <div class="list" style="margin-top:12px">
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">Diff: Logic Weight</div>
                <div class="rowDesc">0.55 → 0.70（示例）</div>
              </div>
              <div class="rowRight"><span class="status run">changed</span></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">Diff: Branch</div>
                <div class="rowDesc">main → wrong-cut（示例）</div>
              </div>
              <div class="rowRight"><span class="status fail">risk</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  viewRoot.querySelectorAll<HTMLElement>("[data-switch-branch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = (btn as any).dataset.switchBranch;
      appState.activeBranchId = id;
      location.hash = "#/workbench";
    });
  });
}

function renderExportPage(viewRoot: HTMLElement) {
  setHeader("导出/发布", "导出 mp4 / 工程包 / 分享（原型）");
  viewRoot.innerHTML = `
    <section class="page">
      <div class="grid2">
        <div class="panel">
          <div class="panelTitle2">导出</div>
          <div class="list">
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">导出 MP4</div>
                <div class="rowDesc">分辨率、码率、字幕烧录（占位）。</div>
              </div>
              <div class="rowRight"><button class="btn btnPrimary" type="button">开始导出</button></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">导出工程包</div>
                <div class="rowDesc">包含分镜、素材引用、LKM-P 节点与参数快照。</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button">下载</button></div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panelTitle2">发布</div>
          <div class="list">
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">生成分享链接</div>
                <div class="rowDesc">可设置权限与有效期（占位）。</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button">生成</button></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">封面与标题</div>
                <div class="rowDesc">选择封面帧/上传封面（占位）。</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button">编辑</button></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderMePage(viewRoot: HTMLElement) {
  setHeader("个人中心", "账号信息 / 偏好 / 用量（原型占位）");
  viewRoot.innerHTML = `
    <section class="page">
      <div class="grid2">
        <div class="panel">
          <div class="panelTitle2">账号</div>
          <div class="list">
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">用户名</div>
                <div class="rowDesc">insun（示例）</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button">修改</button></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">邮箱</div>
                <div class="rowDesc">insun@example.com（示例）</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button">绑定</button></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">默认项目</div>
                <div class="rowDesc">${htmlEscape(appState.activeProjectId)}（当前）</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button" data-goto="projects">去选择</button></div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panelTitle2">用量与偏好</div>
          <div class="list">
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">今日渲染任务</div>
                <div class="rowDesc">${htmlEscape(String(RENDER_JOBS.length))}（示例）</div>
              </div>
              <div class="rowRight"><span class="status run">usage</span></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">默认场景</div>
                <div class="rowDesc">${htmlEscape(sceneLabels[appState.scene] || appState.scene)}（示例）</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button" data-goto="settings">去设置</button></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">退出登录</div>
                <div class="rowDesc">原型占位：不做真实鉴权。</div>
              </div>
              <div class="rowRight"><button class="btn btnPrimary" type="button">退出</button></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  viewRoot.querySelectorAll<HTMLElement>("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = (btn as any).dataset.goto;
      location.hash = `#/${r}`;
    });
  });
}

function renderSettingsPage(viewRoot: HTMLElement) {
  setHeader("设置", "网关 / 模型 / 预设（原型占位）");
  viewRoot.innerHTML = `
    <section class="page">
      <div class="grid2">
        <div class="panel">
          <div class="panelTitle2">网关配置</div>
          <div class="list">
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">API 网关</div>
                <div class="rowDesc">连接外部大模型（Sora/Veo）与云渲染集群。</div>
              </div>
              <div class="rowRight"><span class="status run">connected</span></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">MCP 网关</div>
                <div class="rowDesc">连接本地专业数据库、3D 资产库。</div>
              </div>
              <div class="rowRight"><span class="status ok">ready</span></div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panelTitle2">默认预设</div>
          <div class="list">
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">逻辑/叙事权重</div>
                <div class="rowDesc">Logic=0.55，Narrative=0.45（示例）。</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button">修改</button></div>
            </div>
            <div class="row">
              <div class="rowMain">
                <div class="rowTitle">动效风格</div>
                <div class="rowDesc">路径生长、弹簧反馈、呼吸感节奏（示例）。</div>
              </div>
              <div class="rowRight"><button class="btn btnGhost" type="button">管理</button></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function workbenchTemplate() {
  return `
    <div class="stage" aria-label="工作台画布">
      <div class="layer layerNarrative" aria-label="叙事层">
        <video id="bgVideo" class="bgVideo" autoplay muted loop playsinline preload="metadata"></video>
        <div class="bgFallback" aria-hidden="true"></div>
        <div class="vignette" aria-hidden="true"></div>
      </div>

      <div class="layer layerLogic" aria-label="逻辑层">
        <div class="logicHud">
          <div class="pill">
            <span class="pillLabel">事实锚点</span>
            <span id="truthAnchor" class="pillValue">\\(${DEFAULT_TRUTH_ANCHOR}\\)</span>
          </div>
          <div class="pill">
            <span class="pillLabel">认知策略</span>
            <span id="cognitiveStrategy" class="pillValue">${DEFAULT_STRATEGY}</span>
          </div>
          <div class="pill">
            <span class="pillLabel">Agent 状态</span>
            <span id="agentState" class="pillValue">就绪</span>
          </div>
        </div>

        <svg id="logicSvg" class="logicSvg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-label="矢量逻辑覆盖">
          <defs>
            <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#7CFFCB" stop-opacity="0.9" />
              <stop offset="1" stop-color="#7CB6FF" stop-opacity="0.9" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.7 0" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g id="logicStrokes" filter="url(#softGlow)"></g>
          <g id="logicLabels"></g>
        </svg>

        <div id="overlayCards" class="overlayCards" aria-label="数据卡片层"></div>
      </div>

      <div class="layer layerSpatial" aria-label="空间层">
        <div class="hotspotFrame">
          <button class="hotspot" type="button" data-hotspot="jack" style="left: 18%; top: 52%">千斤顶热区</button>
          <button class="hotspot" type="button" data-hotspot="mrna" style="left: 72%; top: 38%">mRNA 热区</button>
        </div>
      </div>

      <aside id="branchingMap" class="branchingMap" aria-label="分枝导航器" hidden>
        <div class="panelHeader">
          <div class="panelTitle">分枝导航器</div>
          <button id="closeBranchingMap" class="btn btnGhost" type="button">关闭</button>
        </div>
        <div class="panelBody">
          <div class="panelHint">展示当前场景的所有知识路径；模拟“错误操作会跳到哪里”。</div>
          <div id="branchList" class="branchList" role="list"></div>
        </div>
      </aside>

      <section class="omnibarDock" aria-label="Omnibar 区域">
        <div class="omnibar">
          <div class="omnibarLeft">
            <div class="kbd">⌘K</div>
            <input id="omnibarInput" class="omnibarInput" placeholder="输入意图：例如「我想看勾股定理的动态证明」" autocomplete="off" />
          </div>
          <div class="omnibarRight">
            <button id="runIntent" class="btn btnPrimary" type="button">运行</button>
          </div>
        </div>

        <div class="dockRow">
          <div class="dockCard">
            <div class="dockTitle">Storyboard（分镜）</div>
            <div id="storyboardList" class="logicTreePreview"></div>
          </div>
          <div class="dockCard">
            <div class="dockTitle">参数 & LKM-P 缩影</div>
            <div class="paramGrid">
              <label class="paramItem">
                <span class="paramLabel">Logic Weight</span>
                <input id="paramLogic" class="paramInput" type="number" min="0" max="1" step="0.05" value="0.55" />
              </label>
              <label class="paramItem">
                <span class="paramLabel">Narrative Weight</span>
                <input id="paramNarrative" class="paramInput" type="number" min="0" max="1" step="0.05" value="0.45" />
              </label>
              <label class="paramItem">
                <span class="paramLabel">Scene</span>
                <select id="paramScene" class="paramSelect">
                  <option value="blackboard">黑板</option>
                  <option value="lab">实验室</option>
                  <option value="cosmos">宇宙</option>
                  <option value="rain">雨夜</option>
                </select>
              </label>
            </div>
            <div style="margin-top:10px">
              <div class="dockTitle" style="font-weight:650">逻辑树缩影（LKM-P 节点）</div>
              <div id="logicTreePreview" class="logicTreePreview" aria-live="polite"></div>
            </div>
          </div>
        </div>

        <div class="perspective">
          <div class="perspectiveLeft">
            <div class="perspectiveTitle">时间线（时空透视）</div>
            <div class="perspectiveHint">滑动：推进时间进度；同时改变逻辑/叙事占比的视觉呈现（原型模拟）。</div>
          </div>
          <div class="perspectiveRight">
            <input id="perspectiveSlider" type="range" min="0" max="100" value="18" />
            <div class="perspectiveLegend">
              <span>0%</span>
              <span id="perspectiveReadout" class="readout">18%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function initWorkbench(viewRoot: HTMLElement) {
  workbench = {
    bgVideo: $("#bgVideo", viewRoot),
    bgFallback: $(".bgFallback", viewRoot),
    truthAnchor: $("#truthAnchor", viewRoot),
    cognitiveStrategy: $("#cognitiveStrategy", viewRoot),
    agentState: $("#agentState", viewRoot),
    logicSvg: $("#logicSvg", viewRoot),
    logicStrokes: $("#logicStrokes", viewRoot),
    logicLabels: $("#logicLabels", viewRoot),
    overlayCards: $("#overlayCards", viewRoot),
    omnibarInput: $("#omnibarInput", viewRoot),
    runIntent: $("#runIntent", viewRoot),
    paramLogic: $("#paramLogic", viewRoot),
    paramNarrative: $("#paramNarrative", viewRoot),
    paramScene: $("#paramScene", viewRoot),
    storyboardList: $("#storyboardList", viewRoot),
    logicTreePreview: $("#logicTreePreview", viewRoot),
    perspectiveSlider: $("#perspectiveSlider", viewRoot),
    perspectiveReadout: $("#perspectiveReadout", viewRoot),
    branchingMap: $("#branchingMap", viewRoot),
    branchList: $("#branchList", viewRoot),
    closeBranchingMap: $("#closeBranchingMap", viewRoot),
  };

  workbench.omnibarInput!.value = appState.intent;
  workbench.paramLogic!.value = appState.logicWeight.toFixed(2);
  workbench.paramNarrative!.value = appState.narrativeWeight.toFixed(2);
  workbench.paramScene!.value = appState.scene;
  workbench.perspectiveSlider!.value = String(appState.progress);
  workbench.perspectiveReadout!.textContent = `${appState.progress}%`;
  workbench.truthAnchor!.textContent = `\\(${DEFAULT_TRUTH_ANCHOR}\\)`;
  workbench.cognitiveStrategy!.textContent = DEFAULT_STRATEGY;

  renderStoryboard();
  renderBranches();
  wireWorkbenchEvents(viewRoot);
  runIntent();
}

function setAgentState(text: string) {
  if (workbench?.agentState) workbench.agentState.textContent = text;
}

function applyVideoScene(sceneKey: string) {
  if (!workbench) return;
  const list = VIDEO_SOURCES[sceneKey] || [];
  const src = list[0];
  if (!src) return;

  workbench.bgVideo!.src = src;
  workbench.bgVideo!.load();
  const onCanPlay = () => {
    workbench.bgFallback!.style.opacity = "0";
    workbench.bgVideo!.removeEventListener("canplay", onCanPlay);
  };
  const onError = () => {
    workbench.bgFallback!.style.opacity = "1";
    workbench.bgVideo!.removeEventListener("error", onError);
  };
  workbench.bgVideo!.addEventListener("canplay", onCanPlay);
  workbench.bgVideo!.addEventListener("error", onError);
}

function clearSvg() {
  if (!workbench) return;
  workbench.logicStrokes!.innerHTML = "";
  workbench.logicLabels!.innerHTML = "";
}

function drawStroke(
  pathD: string,
  { width = 3, dash = false, opacity = 0.9 } = {},
) {
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", pathD);
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", "url(#strokeGrad)");
  p.setAttribute("stroke-width", String(width));
  p.setAttribute("stroke-linecap", "round");
  p.setAttribute("stroke-linejoin", "round");
  p.setAttribute("opacity", String(opacity));
  if (dash) p.setAttribute("stroke-dasharray", "8 10");
  workbench.logicStrokes!.appendChild(p);

  const len = p.getTotalLength();
  p.style.strokeDasharray = `${len} ${len}`;
  p.style.strokeDashoffset = String(len);
  p.getBoundingClientRect();
  p.style.transition = "stroke-dashoffset 680ms cubic-bezier(.2,.9,.2,1)";
  requestAnimationFrame(() => {
    p.style.strokeDashoffset = "0";
  });
  return p;
}

function addLabel(x: number, y: number, text: string, { tone = "muted" } = {}) {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", String(x));
  t.setAttribute("y", String(y));
  t.setAttribute("font-size", "14");
  t.setAttribute(
    "font-family",
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  );
  t.setAttribute("opacity", "0.92");
  t.setAttribute(
    "fill",
    tone === "accent" ? "rgba(124,255,203,.92)" : "rgba(233,237,246,.66)",
  );
  t.textContent = text;
  workbench.logicLabels!.appendChild(t);
  return t;
}

function renderOverlayCards() {
  if (!workbench) return;
  workbench.overlayCards!.innerHTML = "";
  const cards = [
    {
      title: "LKM-P 协议片段",
      badge: `t=${String(appState.progress).padStart(2, "0")}%`,
      body: "记录时间点变量状态：变量变更驱动 SVG 生长与跨模态联动（原型模拟）。",
      tags: ["logic", "protocol"],
      x: "16px",
      y: "96px",
    },
    {
      title: "跨模态联动",
      badge: "a^2",
      body: "点击公式中的 a^2 → 对应直角边闪烁（原型用高亮与卡片提示替代）。",
      tags: ["logic", "interaction"],
      x: "calc(100% - 16px - 280px)",
      y: "132px",
    },
    {
      title: "分枝提示",
      badge: appState.activeBranchId,
      body: "分枝导航器展示“错误操作会跳到哪里”。切换分枝改变覆盖层密度与语气。",
      tags: ["narrative", "branch"],
      x: "calc(100% - 16px - 280px)",
      y: "320px",
    },
  ];
  for (const c of cards) {
    const el = document.createElement("div");
    el.className = "card";
    el.style.left = c.x;
    el.style.top = c.y;
    const tags = c.tags
      .map((t) => {
        const cls =
          t === "logic" ? "tag logic" : t === "warn" ? "tag warn" : "tag";
        return `<span class="${cls}">${t}</span>`;
      })
      .join("");
    el.innerHTML = `
      <div class="cardTitle"><span>${c.title}</span><span class="badge">${c.badge}</span></div>
      <div class="cardBody">${c.body}</div>
      <div class="cardFoot">${tags}</div>
    `;
    workbench.overlayCards!.appendChild(el);
  }
}

function renderLogicOverlay() {
  if (!workbench) return;
  clearSvg();

  const density = 0.45 + appState.logicWeight * 0.85;
  const mood = 0.25 + appState.narrativeWeight * 0.75;
  const baseOpacity = Math.min(1, 0.35 + density * 0.75);
  const dash = appState.activeBranchId === "wrong-cut";

  drawStroke("M 320 160 L 680 160 L 680 520 L 320 520 Z", {
    width: 3.2,
    opacity: baseOpacity,
  });
  drawStroke("M 320 520 L 680 160", {
    width: 2.6,
    dash,
    opacity: baseOpacity * 0.9,
  });

  if (appState.activeBranchId === "deep-proof") {
    drawStroke("M 240 220 C 360 120, 520 120, 760 220", {
      width: 2.4,
      dash: true,
      opacity: baseOpacity * 0.8,
    });
    addLabel(260, 214, "Derivation: area → algebra", { tone: "accent" });
    addLabel(260, 238, "semantic alignment (LKM-P)", { tone: "muted" });
  } else if (appState.activeBranchId === "atmosphere") {
    drawStroke("M 200 440 C 380 380, 620 380, 800 440", {
      width: 2.2,
      dash: true,
      opacity: 0.35 + mood * 0.3,
    });
    addLabel(230, 430, "breathing motion", { tone: "muted" });
  } else if (appState.activeBranchId === "wrong-cut") {
    drawStroke("M 420 210 L 610 210 L 610 330 L 420 330 Z", {
      width: 2.2,
      dash: true,
      opacity: baseOpacity * 0.75,
    });
    addLabel(430, 240, "conflict detected", { tone: "accent" });
    addLabel(430, 268, "jump to correction branch", { tone: "muted" });
  } else {
    addLabel(350, 150, "a^2 + b^2 = c^2", { tone: "accent" });
    addLabel(350, 175, "area growth proof", { tone: "muted" });
  }

  const progressK = appState.progress / 100;
  const glow = 0.25 + progressK * 0.55;
  workbench.logicSvg!.style.opacity = String(0.55 + glow * appState.logicWeight);
  workbench.bgVideo!.style.opacity = String(0.72 + 0.22 * appState.narrativeWeight);
  renderOverlayCards();
}

function renderLogicTreePreview() {
  if (!workbench) return;
  workbench.logicTreePreview!.innerHTML = "";
  for (const node of appState.lkmpNodes.slice(0, 6)) {
    const item = document.createElement("div");
    item.className = "treeNode";
    item.innerHTML = `
      <div class="treeIcon"></div>
      <div class="treeMain">
        <div class="treeTitle">${htmlEscape(node.title)}</div>
        <div class="treeMeta">${htmlEscape(node.meta)}</div>
        <div class="treeDesc">${htmlEscape(node.desc)}</div>
      </div>
    `;
    workbench.logicTreePreview!.appendChild(item);
  }
}

function renderStoryboard() {
  if (!workbench) return;
  workbench.storyboardList!.innerHTML = "";
  for (const s of STORYBOARD) {
    const item = document.createElement("div");
    item.className = "treeNode";
    item.innerHTML = `
      <div class="treeIcon" style="background: rgba(124,182,255,.82); box-shadow: 0 0 0 4px rgba(124,182,255,.10)"></div>
      <div class="treeMain">
        <div class="treeTitle">${htmlEscape(s.title)} · <span style="opacity:.72">${s.durationSec}s</span></div>
        <div class="treeDesc">${htmlEscape(s.desc)}</div>
        <div class="treeMeta">${htmlEscape((s.tags || []).join(" · "))}</div>
      </div>
    `;
    workbench.storyboardList!.appendChild(item);
  }
}

function renderBranches() {
  if (!workbench) return;
  workbench.branchList!.innerHTML = "";
  for (const b of BRANCHES) {
    const el = document.createElement("div");
    el.className = "branchItem";
    el.setAttribute("role", "listitem");
    (el as any).dataset.branchId = b.id;
    el.innerHTML = `
      <div class="branchDot"></div>
      <div class="branchMeta">
        <div class="branchTitle">${htmlEscape(b.title)}${
          b.id === appState.activeBranchId ? "（当前）" : ""
        }</div>
        <div class="branchDesc">${htmlEscape(b.desc)}</div>
        <div class="branchRoute">${htmlEscape(b.route)}</div>
      </div>
    `;
    el.addEventListener("click", () => {
      appState.activeBranchId = b.id;
      setAgentState(`分枝切换：${b.title}`);
      renderBranches();
      renderLogicOverlay();
    });
    workbench.branchList!.appendChild(el);
  }
}

function openBranchingMap(open: boolean) {
  if (!workbench) return;
  workbench.branchingMap!.hidden = !open;
}

function getParamsFromUI() {
  if (!workbench) return;
  appState.logicWeight = Number(workbench.paramLogic!.value);
  appState.narrativeWeight = Number(workbench.paramNarrative!.value);
  appState.scene = workbench.paramScene!.value;
  normalizeWeights();
  workbench.paramLogic!.value = appState.logicWeight.toFixed(2);
  workbench.paramNarrative!.value = appState.narrativeWeight.toFixed(2);
}

function runIntent() {
  if (!workbench) return;
  getParamsFromUI();
  appState.intent = workbench.omnibarInput!.value.trim();
  const sceneLabel = sceneLabels[appState.scene] || appState.scene;

  setAgentState("解析意图中…");
  workbench.truthAnchor!.textContent = `\\(${DEFAULT_TRUTH_ANCHOR}\\)`;
  workbench.cognitiveStrategy!.textContent = DEFAULT_STRATEGY;

  appState.lkmpNodes = makeLkmpRun(appState.intent, {
    logicWeight: appState.logicWeight,
    narrativeWeight: appState.narrativeWeight,
    sceneLabel,
  });
  renderLogicTreePreview();

  setTimeout(() => setAgentState("生成分镜中…"), 260);
  setTimeout(() => setAgentState("组装互动分枝…"), 560);
  setTimeout(() => setAgentState("就绪"), 980);

  applyVideoScene(appState.scene);
  renderLogicOverlay();
}

function wireWorkbenchEvents(viewRoot: HTMLElement) {
  if (!workbench) return;
  workbench.runIntent!.addEventListener("click", runIntent);
  workbench.omnibarInput!.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") runIntent();
  });
  workbench.paramLogic!.addEventListener("change", () => {
    getParamsFromUI();
    renderLogicOverlay();
  });
  workbench.paramNarrative!.addEventListener("change", () => {
    getParamsFromUI();
    renderLogicOverlay();
  });
  workbench.paramScene!.addEventListener("change", () => {
    getParamsFromUI();
    applyVideoScene(appState.scene);
  });
  workbench.perspectiveSlider!.addEventListener("input", () => {
    appState.progress = Number(workbench.perspectiveSlider!.value);
    workbench.perspectiveReadout!.textContent = `${appState.progress}%`;
    renderLogicOverlay();
  });
  workbench.closeBranchingMap!.addEventListener("click", () =>
    openBranchingMap(false),
  );

  const toggleBranchingMap = document.getElementById("toggleBranchingMap");
  if (toggleBranchingMap) toggleBranchingMap.onclick = () => openBranchingMap(true);

  // 空间热区占位交互
  viewRoot.querySelectorAll<HTMLButtonElement>(".hotspot").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.hotspot;
      const label = id === "jack" ? "千斤顶" : id === "mrna" ? "mRNA 分子" : id;
      setAgentState(`热区交互：${label}（空间层占位）`);
      appState.progress = Math.min(100, appState.progress + 6);
      workbench.perspectiveSlider!.value = String(appState.progress);
      workbench.perspectiveReadout!.textContent = `${appState.progress}%`;
      renderLogicOverlay();
    });
  });

  // ⌘K 聚焦 Omnibar
  window.onkeydown = (e: KeyboardEvent) => {
    const isCmdK =
      (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
    if (!isCmdK) return;
    e.preventDefault();
    workbench.omnibarInput!.focus();
  };
}

function renderWorkbenchPage(viewRoot: HTMLElement) {
  setHeader("工作台", "输入意图 → 生成分镜 → 调参 → 提交渲染 → 预览/分枝 → 导出");
  viewRoot.innerHTML = workbenchTemplate();
  initWorkbench(viewRoot);
}

function renderRoute(route: string, viewRoot: HTMLElement) {
  workbench = null;
  appState.route = route;
  setNavActive(route);

  if (route === "projects") return renderProjectsPage(viewRoot);
  if (route === "render") return renderRenderPage(viewRoot);
  if (route === "branches") return renderBranchesPage(viewRoot);
  if (route === "export") return renderExportPage(viewRoot);
  if (route === "me") return renderMePage(viewRoot);
  if (route === "settings") return renderSettingsPage(viewRoot);
  return renderWorkbenchPage(viewRoot);
}

function onRouteChange(viewRoot: HTMLElement) {
  const route = routeFromHash();
  renderRoute(route, viewRoot);
}

export function initPrototype() {
  const viewRoot = document.getElementById("viewRoot") as HTMLElement | null;
  if (!viewRoot) return () => {};

  renderAssets();

  const toggleAssets = document.getElementById("toggleAssets");
  const closeAssets = document.getElementById("closeAssets");
  if (toggleAssets) toggleAssets.addEventListener("click", () => openAssets(true));
  if (closeAssets) closeAssets.addEventListener("click", () => openAssets(false));

  const handler = () => onRouteChange(viewRoot);
  window.addEventListener("hashchange", handler);
  if (!location.hash) location.hash = "#/workbench";
  handler();

  return () => {
    window.removeEventListener("hashchange", handler);
  };
}

