const root = document.querySelector<HTMLElement>('[data-article-archive]');

if (root) {
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-category-filter]')];
  const rows = [...root.querySelectorAll<HTMLElement>('[data-article-item]')];
  const form = root.querySelector<HTMLFormElement>('.archive-search')!;
  const input = root.querySelector<HTMLInputElement>('#article-search')!;
  const count = root.querySelector<HTMLElement>('.archive-result-count')!;
  const empty = root.querySelector<HTMLElement>('.archive-empty')!;
  const emptyTitle = empty.querySelector('h2')!;
  const emptyDescription = empty.querySelector('p')!;
  const clear = root.querySelector<HTMLAnchorElement>('[data-clear-filter]')!;
  const route = new Map(links.map(link => [link.dataset.categoryFilter!, new URL(link.href)]));
  const names = new Map(links.map(link => [link.dataset.categoryFilter!, link.dataset.categoryName!]));
  const normalize = (text: string) => text.normalize('NFKC').toLocaleLowerCase().trim();
  const searchable = rows.map(row => ({ row, title: normalize(row.dataset.title || ''), category: row.dataset.category }));
  let category = 'all';
  let updateTimer: ReturnType<typeof setTimeout> | undefined;

  function render() {
    const query = normalize(input.value);
    let matches = 0;
    searchable.forEach(({ row, title, category: rowCategory }) => {
      row.hidden = (category !== 'all' && category !== rowCategory) || !title.includes(query);
      if (!row.hidden) matches++;
    });
    links.forEach(link => {
      const selected = link.dataset.categoryFilter === category;
      link.classList.toggle('selected', selected);
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    count.textContent = `${category === 'all' ? '' : names.get(category) + ' · '}${query ? '找到 ' : ''}${matches} 篇文章`;
    empty.hidden = matches > 0;
    emptyTitle.textContent = query ? '没有找到相关文章。' : category === 'all' ? '第一篇文章正在路上。' : '这个模块还没有文章。';
    emptyDescription.textContent = query ? '换一个标题关键词，或查看全部文章。' : '下一次探索，会在这里留下记录。';
    const title = `${category === 'all' ? '全部文章' : names.get(category) + ' · 文章'} · LIANG SHANG BLOG`;
    document.title = title;
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.href = new URL(route.get(category)!.pathname, canonical.href).href;
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical.href);
    }
  }
  function writeLocation(push = false) {
    clearTimeout(updateTimer);
    const next = new URL(route.get(category)!);
    if (input.value.trim()) next.searchParams.set('q', input.value.trim());
    if (next.href !== location.href) history[push ? 'pushState' : 'replaceState']({}, '', next);
  }
  function restore() {
    clearTimeout(updateTimer);
    category = [...route].find(([, target]) => target.pathname === location.pathname)?.[0] || 'all';
    input.value = new URL(location.href).searchParams.get('q')?.slice(0, 200) || '';
    render();
  }
  function plainClick(event: MouseEvent) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }
  links.forEach(link => link.addEventListener('click', event => {
    if (!plainClick(event)) return;
    event.preventDefault();
    category = link.dataset.categoryFilter!;
    render(); writeLocation(true);
    // Keep the overview in place. On mobile, bring results into view only when
    // the reader explicitly selects a large module card above the fold.
    if (link.classList.contains('category-item') && matchMedia('(max-width: 767px)').matches) {
      root.querySelector('#article-results')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }
  }));
  clear.addEventListener('click', event => {
    if (!plainClick(event)) return;
    event.preventDefault(); category = 'all'; input.value = ''; render(); writeLocation(true);
    root.querySelector<HTMLAnchorElement>('.category-tabs [data-category-filter="all"]')?.focus({ preventScroll: true });
  });
  input.addEventListener('input', () => {
    render(); clearTimeout(updateTimer); updateTimer = setTimeout(() => writeLocation(), 250);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') { input.value = ''; render(); writeLocation(); }
  });
  form.addEventListener('submit', event => { event.preventDefault(); render(); writeLocation(); });
  document.addEventListener('keydown', event => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (event.key === '/' && !event.isComposing && !event.metaKey && !event.ctrlKey && !event.altKey && !target?.closest('input,textarea,select,[contenteditable]')) {
      event.preventDefault(); input.focus();
    }
  });
  addEventListener('popstate', restore);
  addEventListener('pageshow', event => { if (event.persisted) restore(); });
  form.hidden = false;
  restore();
}
