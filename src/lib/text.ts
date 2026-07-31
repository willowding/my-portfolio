/**
 * Inline markup renderer — escapes HTML first, then replaces:
 *   **x**   → <strong>
 *   [[x]]   → <span class="role-pill">
 *   [x](y)  → <a class="inline-link" href="y">x</a>
 */
export function renderInline(text: string): string {
  if (!text) return '';
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[\[(.+?)\]\]/g, '<span class="role-pill">$1</span>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
      if (href.startsWith('#')) {
        return `<a class="inline-link" href="${href}">${label}</a>`;
      }
      return `<a class="inline-link" href="${href}" target="_blank" rel="noopener">${label}</a>`;
    });
}

/** Render [[x]] markup for role labels (just pass to renderInline). */
export function renderRole(role: string): string {
  return renderInline(role);
}