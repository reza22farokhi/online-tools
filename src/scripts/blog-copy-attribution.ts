document.addEventListener('copy', (event: ClipboardEvent) => {
  const selectedText = window.getSelection()?.toString();
  if (!selectedText || !event.clipboardData) return;

  event.preventDefault();
  const sourceUrl = window.location.href.split('#')[0];
  const sourceLabel = document.documentElement.lang === 'en' ? 'Source:' : 'منبع:';
  const attributedText = selectedText + '\n\n' + sourceLabel + ' ' + sourceUrl;
  event.clipboardData.setData('text/plain', attributedText);
});
