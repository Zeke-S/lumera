import { PROJECTS } from "../core/mock-data.js";
import { htmlEscape } from "../../lib/dom.js";

export function renderProjectsPage({ shell, appState }) {
  const rows = PROJECTS.map((p) => {
    const status = p.status === "active" ? "ok" : p.status === "draft" ? "run" : "fail";
    return `
      <div class="row">
        <div class="rowMain">
          <div class="rowTitle">${htmlEscape(p.name)}</div>
          <div class="rowDesc">${htmlEscape(p.desc)}</div>
          <div class="rowDesc">${htmlEscape(p.updatedAt)}</div>
        </div>
        <div class="rowRight">
          <span class="status ${status}">${htmlEscape(p.status)}</span>
          <button class="btn btnPrimary" type="button" data-open-project="${htmlEscape(p.id)}">打开</button>
        </div>
      </div>
    `;
  }).join("");

  shell.viewRoot.innerHTML = `
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

  shell.viewRoot.querySelectorAll("[data-open-project]").forEach((btn) => {
    btn.addEventListener("click", () => {
      appState.activeProjectId = btn.dataset.openProject;
      location.hash = "#/workbench";
    });
  });
  shell.viewRoot.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      location.hash = `#/${btn.dataset.goto}`;
    });
  });
}

