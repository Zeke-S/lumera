import { ROUTES } from "./routes.js";

export function routeFromHash() {
  const h = (location.hash || "").replace(/^#\/?/, "");
  const r = h.split("?")[0].trim();
  return r || "workbench";
}

export function setNavActive(route) {
  document.querySelectorAll(".navItem").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
}

export function ensureHashRoute() {
  if (!location.hash) location.hash = "#/workbench";
}

export function applyHeader(shell, route) {
  const meta = ROUTES[route] || ROUTES.workbench;
  shell.pageTitle.textContent = meta.title;
  shell.pageSubtitle.textContent = meta.subtitle;
}

