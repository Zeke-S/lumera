"use client";

import { useEffect } from "react";
import { initPrototype } from "@/prototype/initPrototype";
import { Button } from "@/components/ui/button";

export default function PrototypeApp() {
  useEffect(() => {
    return initPrototype();
  }, []);

  return (
    <div id="app" className="app">
      <div className="shell" aria-label="平台壳层">
        <aside className="sidebar" aria-label="侧边导航">
          <div className="sidebarBrand">
            <div className="logo" aria-hidden="true" />
            <div className="brandText">
              <div className="brandTitle">曜境 Lumera</div>
              <div className="brandSubtitle">视频生成平台 · 原型</div>
            </div>
          </div>

          <nav className="nav" aria-label="主导航">
            <a className="navItem" href="#/projects" data-route="projects">
              项目
            </a>
            <a className="navItem" href="#/workbench" data-route="workbench">
              工作台
            </a>
            <a className="navItem" href="#/render" data-route="render">
              渲染中心
            </a>
            <a className="navItem" href="#/branches" data-route="branches">
              版本/分枝
            </a>
            <a className="navItem" href="#/export" data-route="export">
              导出/发布
            </a>
            <a className="navItem" href="#/me" data-route="me">
              个人中心
            </a>
            <a className="navItem" href="#/settings" data-route="settings">
              设置
            </a>
          </nav>

          <div className="sidebarFoot">
            <div className="smallMuted">快捷键：⌘K 聚焦 Omnibar</div>
          </div>
        </aside>

        <section className="main" aria-label="主内容区">
          <header className="topbar" aria-label="顶部栏">
            <div className="topbarLeft">
              <div id="pageTitle" className="pageTitle">
                工作台
              </div>
              <div id="pageSubtitle" className="pageSubtitle">
                从意图到分镜，再到渲染与发布
              </div>
            </div>
            <div className="topbarRight">
              {/* 临时：保留 legacy className，逐步迁移到 shadcn/tailwind */}
              <Button
                id="toggleAssets"
                type="button"
                variant="ghost"
                className="btn btnGhost"
              >
                资产库
              </Button>
              <Button
                id="toggleBranchingMap"
                type="button"
                variant="ghost"
                className="btn btnGhost"
              >
                分枝导航
              </Button>
            </div>
          </header>

          <main id="viewRoot" className="viewRoot" aria-label="视图根" />
        </section>

        <aside
          id="assetsDrawer"
          className="assetsDrawer"
          aria-label="资产库抽屉"
          hidden
        >
          <div className="panelHeader">
            <div className="panelTitle">资产库</div>
            <button id="closeAssets" className="btn btnGhost" type="button">
              关闭
            </button>
          </div>
          <div className="panelBody">
            <div className="panelHint">
              图片 / 视频 / 音频 / 字体 / 3D 资产（原型占位）。
            </div>
            <div id="assetList" className="assetList" />
          </div>
        </aside>
      </div>
    </div>
  );
}

