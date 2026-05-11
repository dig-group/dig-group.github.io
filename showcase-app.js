(() => {
  const data = window.DIG_DATA || { members: [], publications: [], activities: [], researchAreas: [] };
  const state = {
    memberFilter: 'all',
    memberQuery: '',
    memberLimit: 12,
    publicationYear: 'all',
    publicationLimit: 8,
    activityYear: 'all',
    modalImages: [],
    modalIndex: 0,
    modalCaption: ''
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const previewSrc = (src = '') => /\.(jpe?g|png|gif)$/i.test(src) ? src.replace(/\.(jpe?g|png|gif)$/i, '.webp') : src;
  const toParagraphs = (value = '') => {
    const text = String(value).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const paras = text.split(/\n{2,}/).filter(p => p.trim());
    return paras.map(p => `<p>${escapeHtml(p.trim())}</p>`).join('');
  };
  const compact = (value = '', length = 148) => {
    const text = String(value).replace(/\s+/g, ' ').trim();
    return text.slice(0, length) + (text.length > length ? '…' : '');
  };

  document.addEventListener('DOMContentLoaded', () => {
    $('[data-current-year]').textContent = new Date().getFullYear();
    initNavigation();
    initTeamPhotoModal();
    renderStats();
    renderResearchAreas();
    initMemberControls();
    renderMembers();
    initPublicationControls();
    renderPublications();
    initActivityControls();
    renderActivities();
    initModal();
    initScrollReveal();
    initCounters();
    initHeroCanvas();
  });

  function initNavigation() {
    const header = $('[data-header]');
    const nav = $('[data-nav]');
    const toggle = $('[data-nav-toggle]');
    const links = $$('a[href^="#"]', nav);

    const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));

    const sections = links.map((link) => $(link.getAttribute('href'))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  function initTeamPhotoModal() {
    const photo = $('.team-photo img');
    if (!photo) return;
    photo.closest('.team-photo').setAttribute('role', 'button');
    photo.closest('.team-photo').setAttribute('tabindex', '0');
    photo.closest('.team-photo').setAttribute('aria-label', '放大查看 DIG Group 2025 团队合照');
    const open = () => openModal([photo.dataset.original || photo.src], 0, 'DIG Group, 2025');
    photo.closest('.team-photo').addEventListener('click', open);
    photo.closest('.team-photo').addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  }

  function renderStats() {
    const root = $('[data-stats]');
    const Supervisor = data.members.filter((m) => m.category === 'Supervisor').length;
    const students = data.members.length - Supervisor;
    const stats = [
      ['Supervisor', Supervisor],
      ['Students', students],
      ['Publications', data.publications.length],
      ['Research Areas', data.researchAreas.length]
    ];
    root.innerHTML = stats.map(([label, value]) => `
      <article class="stat-card reveal">
        <strong data-counter="${value}">0</strong>
        <span>${label}</span>
      </article>
    `).join('');
  }

  function renderResearchAreas() {
    const root = $('[data-research-grid]');
    root.innerHTML = data.researchAreas.map((area, areaIdx) => `
      <article class="research-card reveal" data-tilt data-area-index="${areaIdx}">
        <p class="eyebrow">${escapeHtml(area.eyebrow)}</p>
        <h3>${escapeHtml(area.title)}</h3>
        <div class="research-card-img-wrap" role="button" tabindex="0" data-research-img="${areaIdx}" aria-label="Enlarge ${escapeHtml(area.title)} image">
          <img src="${escapeHtml(previewSrc(area.image))}" alt="${escapeHtml(area.title)}" loading="lazy">
        </div>
        <p>${escapeHtml(area.description)}</p>
        <div class="tags">${area.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
      </article>
    `).join('');

    // clickable research images → modal
    $$('[data-research-img]', root).forEach((wrap) => {
      const idx = Number(wrap.dataset.researchImg);
      const open = () => openModal([data.researchAreas[idx].image], 0, data.researchAreas[idx].title);
      wrap.addEventListener('click', open);
      wrap.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    // 3-D tilt on card (but not on the image-wrap)
    $$('[data-tilt]', root).forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const imgWrap = event.target.closest('[data-research-img]');
        if (imgWrap) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  function initMemberControls() {
    const filters = $('[data-member-filters]');
    const labels = [
      ['all', 'All'],
      ['Supervisor', 'Supervisor'],
      ['phd', 'PhD'],
      ['master2025', 'Master 2025'],
      ['master2024', 'Master 2024'],
      ['master2023', 'Master 2023']
    ];
    filters.innerHTML = labels.map(([value, label]) => `<button type="button" data-filter="${value}">${label}</button>`).join('');
    filters.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;
      state.memberFilter = button.dataset.filter;
      state.memberLimit = 12;
      renderMembers();
    });
    $('[data-member-search]').addEventListener('input', (event) => {
      state.memberQuery = event.target.value.trim().toLowerCase();
      state.memberLimit = 12;
      renderMembers();
    });
    $('[data-member-more]').addEventListener('click', () => {
      state.memberLimit += 12;
      renderMembers();
    });
  }

  function getFilteredMembers() {
    return data.members.filter((member) => {
      const matchesFilter = state.memberFilter === 'all' || member.category === state.memberFilter;
      const haystack = `${member.name} ${member.role} ${member.description}`.toLowerCase();
      return matchesFilter && haystack.includes(state.memberQuery);
    });
  }

  function renderMembers() {
    const members = getFilteredMembers();
    const visible = members.slice(0, state.memberLimit);
    $('[data-member-grid]').innerHTML = visible.map((member) => `
      <a class="member-card reveal" href="${escapeHtml(member.url || '#team')}" ${member.url && member.url.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}>
        <div class="member-card-img">
          <img src="${escapeHtml(previewSrc(member.img))}" alt="${escapeHtml(member.name)}" loading="lazy" onerror="this.src='image/ouc-dig.webp'">
        </div>
        <div>
          <h3>${escapeHtml(member.name)}</h3>
          <p>${escapeHtml(member.description || '')}</p>
          <small>${escapeHtml(member.role || '')}</small>
        </div>
      </a>
    `).join('');
    $$('[data-member-filters] button').forEach((button) => button.classList.toggle('is-active', button.dataset.filter === state.memberFilter));
    $('[data-member-more]').hidden = members.length <= state.memberLimit;
    initScrollReveal();
  }

  function initPublicationControls() {
    const years = ['all', ...new Set(data.publications.map((pub) => pub.year).filter(Boolean).sort((a, b) => b - a))];
    const root = $('[data-publication-years]');
    root.innerHTML = years.map((year) => `<button type="button" data-year="${year}">${year === 'all' ? 'All Years' : year}</button>`).join('');
    root.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-year]');
      if (!button) return;
      state.publicationYear = button.dataset.year;
      state.publicationLimit = 8;
      renderPublications();
    });
    $('[data-publication-more]').addEventListener('click', () => {
      state.publicationLimit += 8;
      renderPublications();
    });
  }

  function renderPublications() {
    const publications = data.publications
      .filter((pub) => state.publicationYear === 'all' || String(pub.year) === String(state.publicationYear))
      .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    $('[data-publication-list]').innerHTML = publications.slice(0, state.publicationLimit).map((pub) => {
      const authors = pub.authors.map((author) => author.isGroupMember ? `<span class="author-group">${escapeHtml(author.name)}</span>` : escapeHtml(author.name)).join(', ');
      const links = (pub.links || []).map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.type)}</a>`).join('');
      return `
        <article class="publication-card reveal">
          <div class="publication-year">${escapeHtml(pub.year)}</div>
          <div>
            <h3>${escapeHtml(pub.title)}</h3>
            <p>${authors}</p>
            <p><em>${escapeHtml(pub.venue)}</em></p>
            <div class="pub-links">${links}</div>
          </div>
        </article>
      `;
    }).join('');
    $$('[data-publication-years] button').forEach((button) => button.classList.toggle('is-active', button.dataset.year === String(state.publicationYear)));
    $('[data-publication-more]').hidden = publications.length <= state.publicationLimit;
    initScrollReveal();
  }

  function initActivityControls() {
    const years = ['all', ...new Set(data.activities.map((activity) => activity.year).filter(Boolean).sort((a, b) => b - a))];
    const root = $('[data-activity-years]');
    root.innerHTML = years.map((year) => `<button type="button" data-year="${year}">${year === 'all' ? 'All Years' : year}</button>`).join('');
    root.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-year]');
      if (!button) return;
      state.activityYear = button.dataset.year;
      renderActivities();
    });
  }

  function renderActivities() {
    const activities = data.activities
      .filter((activity) => state.activityYear === 'all' || String(activity.year) === String(state.activityYear))
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    $('[data-activity-grid]').innerHTML = activities.map((activity, index) => `
      <article class="activity-card reveal" data-activity-index="${index}">
        <div class="activity-img-wrap" role="button" tabindex="0" data-activity-gallery="${index}" aria-label="View ${escapeHtml(activity.title)} gallery">
          <img src="${escapeHtml(previewSrc(activity.images?.[0] || 'image/ouc-dig.png'))}" alt="${escapeHtml(activity.title)}" loading="lazy">
        </div>
        <div>
          <span class="activity-meta">${escapeHtml(activity.date || activity.year)} · ${activity.images?.length || 0} photos</span>
          <h3>${escapeHtml(activity.title)}</h3>
          <div class="activity-desc" data-desc="${index}">${toParagraphs(activity.description || '')}</div>
          <span class="activity-readmore" role="button" tabindex="0" data-readmore="${index}">展开全文 ›</span>
        </div>
      </article>
    `).join('');

    // image gallery open
    $$('[data-activity-gallery]').forEach((wrap) => {
      const idx = Number(wrap.dataset.activityGallery);
      const act = activities[idx];
      const open = () => openModal(act.images || [], 0, act.title);
      wrap.addEventListener('click', open);
      wrap.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    // read more
    $$('[data-readmore]').forEach((btn) => {
      const idx = Number(btn.dataset.readmore);
      const desc = $(`[data-desc="${idx}"]`);
      const isExpanded = () => desc.classList.contains('is-expanded');
      const toggle = () => {
        desc.classList.toggle('is-expanded');
        btn.textContent = isExpanded() ? '收起' : '展开全文 ›';
      };
      btn.addEventListener('click', toggle);
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      // auto-collapse if text is short
      if (!desc.scrollHeight || desc.scrollHeight <= desc.clientHeight + 2) {
        btn.style.display = 'none';
      }
    });

    $$('[data-activity-years] button').forEach((button) => button.classList.toggle('is-active', button.dataset.year === String(state.activityYear)));
    initScrollReveal();
  }

  function initModal() {
    $('[data-modal-close]').addEventListener('click', closeModal);
    $('[data-modal]').addEventListener('click', (event) => {
      if (event.target.matches('[data-modal]')) closeModal();
    });
    $('[data-modal-prev]').addEventListener('click', () => shiftModal(-1));
    $('[data-modal-next]').addEventListener('click', () => shiftModal(1));
    document.addEventListener('keydown', (event) => {
      if ($('[data-modal]').hidden) return;
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowLeft') shiftModal(-1);
      if (event.key === 'ArrowRight') shiftModal(1);
    });
  }

  function openModal(images, index, caption) {
    if (!images.length) return;
    state.modalImages = images;
    state.modalIndex = index;
    state.modalCaption = caption;
    $('[data-modal]').hidden = false;
    document.body.style.overflow = 'hidden';
    updateModal();
  }

  function closeModal() {
    $('[data-modal]').hidden = true;
    document.body.style.overflow = '';
  }

  function shiftModal(direction) {
    state.modalIndex = (state.modalIndex + direction + state.modalImages.length) % state.modalImages.length;
    updateModal();
  }

  function updateModal() {
    $('[data-modal-image]').src = state.modalImages[state.modalIndex];
    $('[data-modal-image]').alt = state.modalCaption;
    $('[data-modal-caption]').textContent = `${state.modalCaption} · ${state.modalIndex + 1}/${state.modalImages.length}`;
  }

  let revealObserver;
  function initScrollReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    $$('.reveal:not(.is-visible)').forEach((element) => revealObserver.observe(element));
  }

  function initCounters() {
    const counters = $$('[data-counter]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.counter || 0);
        const start = performance.now();
        const duration = 1100;
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(element);
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => observer.observe(counter));
  }

  function initHeroCanvas() {
    const canvas = $('[data-hero-canvas]');
    const context = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let points = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(36, Math.min(86, Math.floor(width / 18)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(115, 234, 255, 0.8)';
      context.strokeStyle = 'rgba(115, 234, 255, 0.14)';
      points.forEach((point, index) => {
        if (!reduceMotion) {
          point.x += point.vx;
          point.y += point.vy;
          if (point.x < 0 || point.x > width) point.vx *= -1;
          if (point.y < 0 || point.y > height) point.vy *= -1;
        }
        context.beginPath();
        context.arc(point.x, point.y, 1.4, 0, Math.PI * 2);
        context.fill();
        for (let j = index + 1; j < points.length; j += 1) {
          const other = points[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 140) {
            context.globalAlpha = 1 - distance / 140;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
            context.globalAlpha = 1;
          }
        }
      });
      if (!reduceMotion) requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
  }
})();
