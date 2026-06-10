// Интерактив лендинга (порт script.js). Запускается из useEffect после монтирования.
// Возвращает функцию очистки.
export function initBehaviors(): () => void {
  const cleanups: Array<() => void> = [];

  /* --- Затемнение шапки после первого экрана --- */
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > window.innerHeight * 0.72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
  }

  /* --- Маска телефона --- */
  document.querySelectorAll<HTMLInputElement>('input[name="phone"]').forEach((phone) => {
    const handler = (e: Event) => {
      const t = e.target as HTMLInputElement;
      let d = t.value.replace(/\D/g, "");
      if (d.startsWith("8")) d = "7" + d.slice(1);
      if (d.startsWith("7")) d = d.slice(1);
      d = d.slice(0, 10);
      let out = "+7";
      if (d.length) out += " (" + d.slice(0, 3);
      if (d.length >= 4) out += ") " + d.slice(3, 6);
      if (d.length >= 7) out += "-" + d.slice(6, 8);
      if (d.length >= 9) out += "-" + d.slice(8, 10);
      t.value = out;
    };
    phone.addEventListener("input", handler);
    cleanups.push(() => phone.removeEventListener("input", handler));
  });

  /* --- Отправка форм (заглушка) --- */
  document.querySelectorAll<HTMLFormElement>("#club-form, #trial-form").forEach((form) => {
    const handler = (e: Event) => {
      e.preventDefault();
      const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = "Заявка отправлена ✓";
      btn.disabled = true;
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 3000);
    };
    form.addEventListener("submit", handler);
    cleanups.push(() => form.removeEventListener("submit", handler));
  });

  /* --- Звук видео мероприятий --- */
  document.querySelectorAll<HTMLButtonElement>(".events__sound").forEach((btn) => {
    const video = btn.closest(".events__video")?.querySelector("video") as HTMLVideoElement | null;
    if (!video) return;
    const handler = () => {
      video.muted = !video.muted;
      btn.textContent = video.muted ? "🔇" : "🔊";
      if (!video.muted) void video.play();
    };
    btn.addEventListener("click", handler);
    cleanups.push(() => btn.removeEventListener("click", handler));
  });

  /* --- Анимация печати цитаты (переносы строк зафиксированы заранее) --- */
  const quoteEl = document.querySelector<HTMLElement>(".quote__text");
  if (quoteEl) {
    const typed = quoteEl.querySelector<HTMLElement>(".quote__typed");
    const caret = quoteEl.querySelector<HTMLElement>(".quote__caret");
    const full = quoteEl.dataset.text || "";
    if (typed) {
      typed.innerHTML = "";
      const spans = Array.from(full).map((ch) => {
        const s = document.createElement("span");
        s.textContent = ch;
        s.style.visibility = "hidden";
        typed.appendChild(s);
        return s;
      });
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        spans.forEach((s) => (s.style.visibility = "visible"));
        if (caret) caret.style.display = "none";
      } else {
        let started = false;
        let timer = 0;
        const run = () => {
          if (started) return;
          started = true;
          let i = 0;
          const tick = () => {
            if (i < spans.length) {
              spans[i].style.visibility = "visible";
              if (caret) spans[i].after(caret);
              i++;
              timer = window.setTimeout(tick, 40);
            } else if (caret) {
              timer = window.setTimeout(() => (caret.style.display = "none"), 1800);
            }
          };
          tick();
        };
        const qio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                run();
                qio.disconnect();
              }
            });
          },
          { threshold: 0.45 }
        );
        qio.observe(quoteEl);
        cleanups.push(() => {
          qio.disconnect();
          clearTimeout(timer);
        });
      }
    }
  }

  /* --- Появление секций при скролле --- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".section").forEach((s) => io.observe(s));
  cleanups.push(() => io.disconnect());

  return () => cleanups.forEach((fn) => fn());
}
