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

  /* --- Маска телефона --- */
  const phone = document.querySelector('input[name="phone"]');
  if (phone) {
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
  }

  /* --- Отправка формы (заглушка) --- */
  const form = document.getElementById('club-form');
  if (form) {
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
