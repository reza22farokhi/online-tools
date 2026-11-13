export type Theme = 'light' | 'dark';
export type Lang = 'fa' | 'en';

const THEME_KEY = 'pot.theme';
const LANG_KEY = 'pot.lang';
const FAV_KEY = 'pot.favorites';
const RECENT_KEY = 'pot.recent';
const RECENT_MAX = 6;

export function getStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch { return null; }
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function setTheme(theme: Theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
  applyTheme(theme);
}

export function toggleTheme() {
  const cur = (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
  setTheme(cur === 'light' ? 'dark' : 'light');
}

export function getStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === 'fa' || v === 'en' ? v : null;
  } catch { return null; }
}

export function applyLang(lang: Lang, dicts?: Record<Lang, Record<string, string>>) {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  if (!dicts) return;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (key && dicts[lang][key]) el.textContent = dicts[lang][key];
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (key && dicts[lang][key]) el.placeholder = dicts[lang][key];
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach(el => {
    const key = el.dataset.i18nAriaLabel;
    if (key && dicts[lang][key]) el.setAttribute('aria-label', dicts[lang][key]);
  });
}

export function setLang(lang: Lang, dicts?: Record<Lang, Record<string, string>>) {
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  applyLang(lang, dicts);
}

export function toggleLang(dicts?: Record<Lang, Record<string, string>>) {
  const cur = (document.documentElement.getAttribute('lang') as Lang) || 'fa';
  setLang(cur === 'fa' ? 'en' : 'fa', dicts);
}

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch { return []; }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  const set = new Set(getFavorites());
  if (set.has(slug)) set.delete(slug);
  else set.add(slug);
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...set])); } catch {}
  return set.has(slug);
}

export function getRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch { return []; }
}

export function pushRecent(slug: string) {
  const list = getRecent().filter(s => s !== slug);
  list.unshift(slug);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX))); } catch {}
}

export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = await navigator.clipboard.writeText(textToCopy).then(() => true).catch(() => false);
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}

let toastContainer: HTMLElement | null = null;
function ensureToastContainer(): HTMLElement {
  if (toastContainer && document.body.contains(toastContainer)) return toastContainer;
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.setAttribute('role', 'status');
  toastContainer.setAttribute('aria-live', 'polite');
  toastContainer.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toastContainer);
  return toastContainer;
}

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 2500) {
  if (!message) return;
  const container = ensureToastContainer();
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));
  setTimeout(() => {
    el.classList.remove('visible');
    setTimeout(() => el.remove(), 250);
  }, duration);
}

export function initFavoriteButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>(".fav-btn").forEach(btn => {
    const slug = btn.dataset.favSlug;
    if (!slug) return;
    const fav = isFavorite(slug);
    btn.classList.toggle("favorited", fav);
    btn.setAttribute("aria-pressed", fav ? "true" : "false");
    const label = fav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها";
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  });
}

let __favDelegationSetup = false;
export function setupFavoriteDelegation(): void {
  if (__favDelegationSetup) return;
  __favDelegationSetup = true;
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const btn = target.closest(".fav-btn") as HTMLButtonElement | null;
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const slug = btn.dataset.favSlug;
    if (!slug) return;
    toggleFavorite(slug);
    initFavoriteButtons(document);
    populateHomeSections();
  });
}

export function populateHomeSections(): void {
  if (typeof document === "undefined") return;
  const populate = (sectionId: string, gridId: string, slugs: string[]): void => {
    const section = document.getElementById(sectionId);
    const grid = document.getElementById(gridId);
    if (!section || !grid) return;
    grid.textContent = "";
    let count = 0;
    for (const slug of slugs) {
      const link = document.querySelector<HTMLElement>(`#all-tools-grid [data-slug="${slug}"]`);
      if (link) {
        const wrapper = link.closest(".tool-card-wrap");
        if (wrapper) {
          const clone = wrapper.cloneNode(true) as HTMLElement;
          grid.appendChild(clone);
          count++;
        }
      }
    }
    section.hidden = count === 0;
    if (count > 0) initFavoriteButtons(grid);
  };
  populate("favorites-section", "favorites-grid", getFavorites());
  populate("recent-section", "recent-grid", getRecent());
}

export function initUI(dicts?: Record<Lang, Record<string, string>>) {
  setupFavoriteDelegation();
  initFavoriteButtons();
  const storedLang = getStoredLang();
  if (storedLang) applyLang(storedLang, dicts);
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => toggleTheme());
  });
  document.querySelectorAll<HTMLButtonElement>('[data-lang-toggle]').forEach(btn => {
    btn.addEventListener('click', () => toggleLang(dicts));
  });
}
