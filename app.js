(() => {
  const sections = [...document.querySelectorAll('main > section')];
  const nav = [...document.querySelectorAll('[data-section]')];
  const workPanels = [...document.querySelectorAll('[data-work-panel]')];
  const workNav = [...document.querySelectorAll('[data-work-section]')];
  const aliases = {legacy: 'research', pubs: 'publications', media: 'talks'};
  const worksSection = document.getElementById('works');
  const workNavigation = document.querySelector('.works-navigation');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function markWork(id) {
    workNav.forEach(a => {
      if (a.dataset.workSection === id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }
  function activate({scroll = false} = {}) {
    const requested = location.hash.slice(1);
    if (requested === 'main' || requested === 'top') {
      // Skip/top links retain the current section; a direct visit still starts at About.
      if (nav.some(a => a.getAttribute('aria-current') === 'page')) return;
    }
    const id = requested.startsWith('ai-section-') ? 'for-ai' : requested.startsWith('work-') ? 'works' : requested.startsWith('research-') ? 'research' : aliases[requested] || requested || 'about';
    const workId = id === 'research' || id === 'publications' ? id : 'production';
    const sectionId = id === 'research' || id === 'publications' || id === 'production' ? 'works' : id;
    const selected = sections.find(s => s.id === sectionId) || sections[0];
    sections.forEach(s => s.hidden = s !== selected);
    nav.forEach(a => {
      if (a.dataset.section === selected.id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    markWork(workId);
    // All Works categories remain visible; reveal Works before moving to an anchor.
    const deepLink = requested.startsWith('ai-section-') || requested.startsWith('work-') || requested.startsWith('research-');
    const target = deepLink ? document.getElementById(requested) : workPanels.find(p => p.id === id);
    if (target || scroll) (target || document.querySelector('#main')).scrollIntoView({block: 'start', behavior: scroll && !reducedMotion.matches ? 'smooth' : 'instant'});
  }
  window.addEventListener('hashchange', () => activate());
  window.addEventListener('popstate', () => activate());
  const sectionLinks = [...nav, ...workNav, ...document.querySelectorAll('[data-section-link]')];
  sectionLinks.forEach(a => a.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button != null && event.button !== 0)) return;
    event.preventDefault();
    if (location.hash !== a.hash) history.pushState(null, '', a.hash);
    activate({scroll: true});
  }));
  activate();
  // Follow the reading position without adding history entries during scrolling.
  let scrollFrame = null;
  function trackReading() {
    scrollFrame = null;
    if (worksSection.hidden) return;
    const threshold = workNavigation.getBoundingClientRect().height + 28;
    let current = workPanels[0];
    for (const panel of workPanels) {
      if (panel.getBoundingClientRect().top <= threshold) current = panel;
    }
    markWork(current.id);
  }
  function queueTracking() {
    if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(trackReading);
  }
  window.addEventListener('scroll', queueTracking, {passive: true});
  window.addEventListener('resize', queueTracking);
  document.querySelector('.filters').hidden = false;
  const input = document.querySelector('#search');
  const year = document.querySelector('#year');
  const cards = [...document.querySelectorAll('.work')];
  function filter() {
    const query = input.value.trim().toLocaleLowerCase().normalize('NFKC');
    const words = query.split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      card.hidden = !(words.every(w => card.dataset.search.normalize('NFKC').includes(w)) && (year.value === 'all' || card.dataset.year === year.value));
      if (!card.hidden) count++;
    });
    document.querySelector('#result-count').textContent = `${count} / ${cards.length}件`;
    document.querySelector('#no-results').hidden = count > 0;
  }
  input.addEventListener('input', filter);
  year.addEventListener('change', filter);
  document.querySelectorAll('img').forEach(img => {
    const fallback = () => {
      const text = document.createElement('span');
      text.className = 'image-error';
      text.textContent = `${img.alt} — 作品紹介を見る ↗`;
      img.replaceWith(text);
    };
    img.addEventListener('error', fallback, {once: true});
    if (img.complete && img.naturalWidth === 0) fallback();
  });
})();
