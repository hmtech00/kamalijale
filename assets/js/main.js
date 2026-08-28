// Kamal Ijale — shared front-end behavior (no framework, no build step)

document.addEventListener('DOMContentLoaded', () => {
  // Sticky header: solid background once the user scrolls past the hero
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-solid', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.textContent = isOpen ? '✕' : '☰';
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.textContent = '☰';
      })
    );
  }

  // Portfolio filter (portfolio.html only — no-op elsewhere)
  const filterBar = document.querySelector('.filter-bar');
  const cards = document.querySelectorAll('[data-category]');
  if (filterBar && cards.length) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filterBar.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  }

  // Contact form -> Formspree (fetch, no page reload)
  // NOTE: replace YOUR_FORM_ID with the real Formspree endpoint before launch.
  const form = document.querySelector('.contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const action = form.getAttribute('action') || '';
      if (action.includes('YOUR_FORM_ID')) {
        status.textContent = 'Form not connected yet — set up Formspree in assets/js/main.js.';
        return;
      }
      status.textContent = 'Sending...';
      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        if (res.ok) {
          status.textContent = 'Message sent — thank you! We\'ll be in touch soon.';
          form.reset();
        } else {
          status.textContent = 'Could not send right now. Please try again or reach out by phone/email.';
        }
      } catch (err) {
        status.textContent = 'Connection error. Please try again or reach out by phone/email.';
      }
    });
  }
});
