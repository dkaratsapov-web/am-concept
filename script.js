// A&M Concept — небольшая интерактивность лендинга

document.addEventListener('DOMContentLoaded', () => {
  /* --- Затемнение шапки после первого экрана --- */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.72);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Маска телефона (на всех полях phone) --- */
  document.querySelectorAll('input[name="phone"]').forEach((phone) => {
    phone.addEventListener('input', (e) => {
      let d = e.target.value.replace(/\D/g, '');
      if (d.startsWith('8')) d = '7' + d.slice(1);
      if (d.startsWith('7')) d = d.slice(1);
      d = d.slice(0, 10);
      let out = '+7';
      if (d.length) out += ' (' + d.slice(0, 3);
      if (d.length >= 4) out += ') ' + d.slice(3, 6);
      if (d.length >= 7) out += '-' + d.slice(6, 8);
      if (d.length >= 9) out += '-' + d.slice(8, 10);
      e.target.value = out;
    });
  });

  /* --- Отправка форм (заглушка) --- */
  document.querySelectorAll('#club-form, #trial-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const original = btn.textContent;
      btn.textContent = 'Заявка отправлена ✓';
      btn.disabled = true;
      form.reset();
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
    });
  });

  /* --- Звук видео мероприятий --- */
  document.querySelectorAll('.events__sound').forEach((btn) => {
    const video = btn.closest('.events__video').querySelector('video');
    btn.addEventListener('click', () => {
      video.muted = !video.muted;
      btn.textContent = video.muted ? '🔇' : '🔊';
      if (!video.muted) video.play();
    });
  });

  /* --- Анимация печати цитаты (переносы строк зафиксированы заранее) --- */
  const quoteEl = document.querySelector('.quote__text');
  if (quoteEl) {
    const typed = quoteEl.querySelector('.quote__typed');
    const caret = quoteEl.querySelector('.quote__caret');
    const full = quoteEl.dataset.text || '';
    // раскладываем все символы скрытыми — перенос строк фиксирован с самого начала
    const spans = Array.from(full).map((ch) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.visibility = 'hidden';
      typed.appendChild(s);
      return s;
    });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      spans.forEach((s) => { s.style.visibility = 'visible'; });
      if (caret) caret.style.display = 'none';
    } else {
      let started = false;
      const run = () => {
        if (started) return;
        started = true;
        let i = 0;
        const tick = () => {
          if (i < spans.length) {
            spans[i].style.visibility = 'visible';
            if (caret) spans[i].after(caret);
            i++;
            setTimeout(tick, 40);
          } else if (caret) {
            setTimeout(() => { caret.style.display = 'none'; }, 1800);
          }
        };
        tick();
      };
      const qio = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(); qio.disconnect(); } });
      }, { threshold: 0.45 });
      qio.observe(quoteEl);
    }
  }

  /* --- Появление секций при скролле --- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section').forEach((s) => io.observe(s));
});
