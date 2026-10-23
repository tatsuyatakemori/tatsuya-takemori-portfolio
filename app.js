(() => {
  const sections = [...document.querySelectorAll('main > section')];
  const nav = [...document.querySelectorAll('[data-section]')];
  const aliases = {legacy: 'research', pubs: 'publications', media: 'talks'};
  function activate() {
    const requested = location.hash.slice(1);
    const id = requested.startsWith('work-') ? 'works' : aliases[requested] || requested || 'works';
    if (id === 'main') return;
    const selected = sections.find(s => s.id === id) || sections[0];
    sections.forEach(s => s.hidden = s !== selected);
    nav.forEach(a => {
      if (a.dataset.section === selected.id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', activate);
  window.addEventListener('popstate', activate);
  nav.forEach(a => a.addEventListener('click', event => {
    event.preventDefault();
    if (location.hash !== a.hash) history.pushState(null, '', a.hash);
    activate();
    document.querySelector('#main').scrollIntoView({block: 'start'});
  }));
  activate();
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
