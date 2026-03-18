export const $ = <T extends Element = Element>(
  sel: string,
  root: ParentNode = document,
) => root.querySelector(sel) as T | null;

export function htmlEscape(s: unknown) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]!);
}

