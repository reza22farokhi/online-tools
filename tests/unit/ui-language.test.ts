import { beforeEach, describe, expect, it } from 'vitest';
import { applyLang, initUI, setLang } from '../../src/lib/ui';

const dicts = {
  fa: {
    'nav.home': 'خانه',
    'accessibility.skip': 'پرش به محتوا'
  },
  en: {
    'nav.home': 'Home',
    'accessibility.skip': 'Skip to content'
  }
};

describe('language switching', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title data-lang-fa="عنوان فارسی" data-lang-en="English title">عنوان فارسی</title><meta name="description" data-lang-fa="توضیح فارسی" data-lang-en="English description" content="توضیح فارسی"></head><body><a id="home" data-i18n="nav.home">خانه</a><span id="tool" data-lang-fa="ابزار" data-lang-en="Tool">ابزار</span><input id="search" data-i18n-placeholder="nav.home" placeholder="خانه"><textarea id="localized-placeholder" data-lang-placeholder-fa="متن فارسی" data-lang-placeholder-en="English text" placeholder="متن فارسی"></textarea><button id="skip" data-i18n-aria-label="accessibility.skip" aria-label="پرش به محتوا"></button><aside id="notice" data-lang-only="en" hidden></aside><div id="tool-text">پاک کردن</div><div id="tool-dynamic"></div><input id="tool-placeholder" placeholder="متن خود را وارد کنید..." /></body>';
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('updates text, direction, title, metadata, placeholders and language-only notices', () => {
    applyLang('en', dicts);

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.getElementById('home')?.textContent).toBe('Home');
    expect(document.getElementById('tool')?.textContent).toBe('Tool');
    expect((document.getElementById('search') as HTMLInputElement).placeholder).toBe('Home');
    expect((document.getElementById('localized-placeholder') as HTMLTextAreaElement).placeholder).toBe('English text');
    expect(document.getElementById('skip')?.getAttribute('aria-label')).toBe('Skip to content');
    expect(document.title).toBe('English title');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('English description');
    expect((document.getElementById('notice') as HTMLElement).hidden).toBe(false);
  });

  it('restores Persian text and right-to-left direction', () => {
    applyLang('en', dicts);
    applyLang('fa', dicts);

    expect(document.documentElement.lang).toBe('fa');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.getElementById('home')?.textContent).toBe('خانه');
    expect(document.getElementById('tool')?.textContent).toBe('ابزار');
    expect(document.title).toBe('عنوان فارسی');
    expect((document.getElementById('localized-placeholder') as HTMLTextAreaElement).placeholder).toBe('متن فارسی');
    expect((document.getElementById('notice') as HTMLElement).hidden).toBe(true);
  });

  it('translates shared tool controls, placeholders, and dynamically generated status messages', async () => {
    applyLang('en', dicts);

    expect(document.getElementById('tool-text')?.textContent).toBe('Clear');
    expect((document.getElementById('tool-placeholder') as HTMLInputElement).placeholder).toBe('Enter your text...');

    const dynamic = document.getElementById('tool-dynamic');
    if (dynamic) dynamic.textContent = 'خطا: نامشخص';
    await new Promise<void>(resolve => queueMicrotask(resolve));
    expect(dynamic?.textContent).toBe('Error: Unknown');

    applyLang('fa', dicts);
    expect(document.getElementById('tool-text')?.textContent).toBe('پاک کردن');
    expect((document.getElementById('tool-placeholder') as HTMLInputElement).placeholder).toBe('متن خود را وارد کنید...');
  });

  it('persists the language and updates the URL query parameter', () => {
    setLang('en', dicts);

    expect(localStorage.getItem('pot.lang')).toBe('en');
    expect(new URL(window.location.href).searchParams.get('lang')).toBe('en');
  });

  it('prefers a valid URL language over a previously stored language', () => {
    localStorage.setItem('pot.lang', 'fa');
    window.history.replaceState({}, '', '/?lang=en');

    initUI(dicts);

    expect(document.documentElement.lang).toBe('en');
    expect(document.getElementById('home')?.textContent).toBe('Home');
    expect(localStorage.getItem('pot.lang')).toBe('en');
  });
});
