'use strict';
(() => {
  const config = window.PROJECT_SHOWCASE || {};
  const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const mediaBase = local ? './' : (config.mediaBase || './');
  for (const element of document.querySelectorAll('[data-file]')) {
    const url = mediaBase + element.dataset.file;
    if (element.tagName === 'VIDEO') element.src = url;
    else element.href = url;
  }
  for (const link of document.querySelectorAll('.portfolio-link')) {
    if (!local && config.portfolioUrl) link.href = config.portfolioUrl;
  }
  // Keep one soundtrack at a time when a visitor switches between projects.
  const videos = [...document.querySelectorAll('video')];
  for (const video of videos) video.addEventListener('play', () => videos.forEach(other => { if (other !== video) other.pause(); }));

  const docs = {
    game: {title: 'AI × GAME · 期末展演', label: 'PRESENTATION / 演示稿', count: 12, prefix: 'ai-game', file: 'ai-game-presentation.pptx'},
    career: {title: 'Z Career Lab · 说明书 v4', label: 'DOCUMENT / 项目说明书', count: 39, prefix: 'career', file: 'z-career-lab-v4.pdf'},
    campus: {title: '校园情报局 · 产品说明文档', label: 'DOCUMENT / 产品说明文档', count: 19, prefix: 'campus', file: 'campus-intel.pdf'}
  };
  const reader = document.getElementById('reader');
  if (typeof reader.showModal !== 'function') return;
  const image = document.getElementById('reader-image');
  const stage = document.getElementById('reader-stage');
  const select = document.getElementById('reader-select');
  const previous = document.getElementById('reader-prev');
  const next = document.getElementById('reader-next');
  const zoom = document.getElementById('reader-zoom');
  const error = document.getElementById('reader-error');
  let active = null;
  let page = 1;
  let trigger = null;
  function resetZoom() {
    stage.classList.remove('zoomed'); zoom.setAttribute('aria-pressed','false'); zoom.textContent = '放大细节 ＋'; stage.scrollTo(0,0);
  }
  function render() {
    resetZoom(); error.hidden = true; image.hidden = false;
    image.src = `${active.prefix}-${String(page).padStart(2,'0')}.webp`;
    image.alt = `${active.title}，第 ${page} 页，共 ${active.count} 页`;
    select.value = String(page);
    document.getElementById('reader-position').textContent = `${page} / ${active.count}`;
    previous.disabled = page === 1; next.disabled = page === active.count;
    document.getElementById('reader-original').href = active.file + (active.file.endsWith('.pdf') ? `#page=${page}` : '');
    if (page < active.count) { const preload = new Image(); preload.src = `${active.prefix}-${String(page+1).padStart(2,'0')}.webp`; }
  }
  image.addEventListener('error', () => {image.hidden = true; error.hidden = false;});
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-doc]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    active = docs[link.dataset.doc]; if (!active) return;
    event.preventDefault(); trigger = link; page = 1;
    document.getElementById('reader-title').textContent = active.title;
    document.getElementById('reader-meta').textContent = `${active.label} / ${active.count} PAGES`;
    select.replaceChildren();
    for (let n = 1; n <= active.count; n++) {const option = document.createElement('option'); option.value = String(n); option.textContent = `${n} / ${active.count}`; select.append(option);}
    render(); reader.showModal(); reader.scrollTop = 0; document.body.classList.add('reader-open'); document.getElementById('close-reader').focus();
  });
  function step(direction) {const destination = page + direction; if (destination >= 1 && destination <= active.count) {page = destination; render();}}
  previous.addEventListener('click', () => step(-1)); next.addEventListener('click', () => step(1));
  select.addEventListener('change', () => {page = Number(select.value); render();});
  document.getElementById('close-reader').addEventListener('click', () => reader.close());
  reader.addEventListener('click', event => {if (event.target === reader) reader.close();});
  reader.addEventListener('close', () => {document.body.classList.remove('reader-open'); resetZoom(); trigger?.focus({preventScroll:true});});
  reader.addEventListener('keydown', event => {
    if (event.target === select || stage.classList.contains('zoomed')) return;
    if (event.key === 'ArrowLeft') {event.preventDefault(); step(-1);}
    if (event.key === 'ArrowRight') {event.preventDefault(); step(1);}
  });
  zoom.addEventListener('click', () => {const enlarged = stage.classList.toggle('zoomed'); zoom.setAttribute('aria-pressed',String(enlarged)); zoom.textContent = enlarged ? '适应页面 －' : '放大细节 ＋'; stage.scrollTo(0,0);});
})();
