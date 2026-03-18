import { ASSETS } from "../core/mock-data.js";

export function renderAssets(shell) {
  shell.assetList.innerHTML = "";
  for (const a of ASSETS) {
    const el = document.createElement("div");
    el.className = "assetItem";
    el.innerHTML = `
      <div class="assetName">${a.name}</div>
      <div class="assetMeta">${a.meta}</div>
    `;
    shell.assetList.appendChild(el);
  }
}

