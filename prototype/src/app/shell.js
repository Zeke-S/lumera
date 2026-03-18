import { $ } from "../lib/dom.js";

export function getShellRefs() {
  return {
    pageTitle: $("#pageTitle"),
    pageSubtitle: $("#pageSubtitle"),
    viewRoot: $("#viewRoot"),
    toggleAssets: $("#toggleAssets"),
    assetsDrawer: $("#assetsDrawer"),
    closeAssets: $("#closeAssets"),
    assetList: $("#assetList"),
    toggleBranchingMap: $("#toggleBranchingMap"),
  };
}

export function openAssets(shell, open) {
  shell.assetsDrawer.hidden = !open;
}

