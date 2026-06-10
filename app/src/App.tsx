import { useCallback, useEffect, useState } from "react";
import { Preloader } from "./Preloader";
import { initBehaviors } from "./behaviors";

export default function App() {
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  // блокируем скролл, пока показан прелоадер
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
  }, []);

  const handlePreloaderDone = useCallback(() => {
    setFading(true);
    document.documentElement.style.overflow = "";
    window.setTimeout(() => setRemoved(true), 900);
  }, []);

  // интерактив лендинга — после монтирования секций
  useEffect(() => initBehaviors(), []);

  return (
    <>
      {!removed && (
        <div className={"preloader" + (fading ? " is-hidden" : "")}>
          <Preloader onComplete={handlePreloaderDone} />
        </div>
      )}

      {/* ░░░ Шапка ░░░ */}
      <header className="header" id="top">
        <div className="header__bar">
          <a href="#top" className="logo" aria-label="A&M Concept — женская фитнес студия">
            <img src="images/logo.svg" alt="A&M Concept" width="105" height="60" />
          </a>
          <nav className="nav">
            <a href="#about">О студии</a>
            <a href="#directions">Направления</a>
            <a href="#services">Услуги</a>
            <a href="#promos">Тарифы</a>
            <a href="#promos">Акции</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <a href="#" className="header__cta" id="contact-link" target="_blank" rel="noopener">
            Написать нам
          </a>
        </div>
      </header>

      <main>
        {/* ░░░ Hero ░░░ */}
        <section className="hero" id="hero">
          <div className="hero__frame">
            <div className="hero__media" aria-hidden="true" />
            <div className="hero__scrim" />
            <div className="hero__inner container">
              <p className="hero__eyebrow">Тренировки, питание, массаж — 360° заботы о себе</p>
              <h1 className="hero__title">
                A&amp;M Concept — Фитнес,<br />который чувствует вас
              </h1>
              <div className="hero__links">
                <a href="#promos" className="hero__link">Скачать приложение</a>
                <a href="#promos" className="hero__link">Присоединиться</a>
              </div>
            </div>
          </div>
        </section>

        {/* ░░░ Пробная тренировка ░░░ */}
        <section className="trial" id="trial">
          <div className="container">
            <div className="trial__card">
              <div className="trial__deco" aria-hidden="true" />
              <div className="trial__intro">
                <span className="trial__kicker">Первое занятие</span>
                <h2 className="trial__title">Записаться на пробную тренировку</h2>
              </div>
              <form className="trial__form" id="trial-form" noValidate>
                <div className="trial__fields">
                  <input type="text" name="name" placeholder="Ваше имя" required />
                  <input type="tel" name="phone" placeholder="Телефон" required />
                </div>
                <button type="submit">Записаться</button>
              </form>
            </div>
          </div>
        </section>

        {/* ░░░ Наши мероприятия ░░░ */}
        <section className="section events container" id="events">
          <span className="eyebrow">Наши мероприятия</span>
          <div className="events__grid">
            <figure className="events__video">
              <video
                src="media/event.mp4"
                poster="images/event-poster.jpg"
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
              />
              <button className="events__sound" type="button" aria-label="Включить звук">🔇</button>
            </figure>
            <div className="events__col">
              <h2 className="display events__title">Концептуальный вечер на свежем воздухе!</h2>
              <div className="events__info">
                <span className="events__date">28 июня · 17:00</span>
                <div className="events__lead">
                  <p>Уникальное событие для нашего города! Концептуальный вечер на свежем воздухе прямо на берегу реки — ну что может быть атмосфернее и круче?</p>
                  <p>Мы приглашаем вас посетить наше событие уже 28 июня в&nbsp;17 часов в&nbsp;Ресторане «Причал»!</p>
                  <p className="events__urgent">Успейте, количество мест ограничено!</p>
                </div>
                <div className="events__cta">
                  <span className="events__trigger">Свободных мест 5 из 20</span>
                  <a href="#trial" className="btn-pill events__btn">Забронировать</a>
                  <span className="events__place">Ресторан «Причал»</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ░░░ О студии ░░░ */}
        <section className="section about" id="about">
          <div className="container">
            <span className="eyebrow">О студии</span>
            <div className="about__grid">
              <div className="about__left">
                <h2 className="display">
                  Здесь бережно <br />формируют женскую <span className="dot-word">силу</span>
                </h2>
                <div className="about__text">
                  <p>A&amp;M Concept — клуб женского фитнеса с подходом «здоровье на первом месте». Мы работаем с физиологией женского тела, подбираем нагрузки под цель и цикл, помогаем мягко вернуться в форму и закрепить результат.</p>
                  <p>Стильная раздевалка-душ, массажный кабинет и зона отдыха — чтобы после тренировки было удобно восстановиться, перекусить и забрать ребёнка из уютного уголка ожидания.</p>
                  <p className="about__highlight">А ещё — небольшой магазин с брендированными вещами для тренировок!</p>
                </div>
              </div>
              <figure className="about__media">
                <img src="images/about.jpg" alt="Интерьер студии A&M Concept" loading="lazy" />
              </figure>
            </div>
          </div>
        </section>

        {/* ░░░ Цитата ░░░ */}
        <section className="section quote" id="quote">
          <div className="container">
            <figure className="quote__card">
              <span className="quote__glyph" aria-hidden="true">”</span>
              <blockquote
                className="quote__text"
                data-text="Успех каждой женщины должен вдохновлять другую. Мы сильнее всего, когда поддерживаем друг друга!"
              >
                <span className="quote__typed" />
                <span className="quote__caret" aria-hidden="true" />
              </blockquote>
              <figcaption className="quote__author">
                <span className="quote__avatar" aria-hidden="true">SW</span>
                <span className="quote__meta">
                  <strong>Серена Уильямс</strong>
                  <em>теннисистка · 23 титула Большого шлема</em>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ░░░ Пространство ░░░ */}
        <section className="section space" id="space">
          <div className="container">
            <div className="space__head">
              <h2 className="display">Центр женской <br />поддержки</h2>
              <span className="eyebrow eyebrow--end">Пространство</span>
            </div>
            <ul className="features">
              <li><span className="features__num">01</span>Залы для групповых занятий</li>
              <li><span className="features__num">02</span>Просторная раздевалка и душевые</li>
              <li><span className="features__num">03</span>Массажные кабинеты рядом с залами</li>
              <li><span className="features__num">04</span>Зона отдыха: перекус, чай/кофе, детский уголок</li>
            </ul>
            <a href="#promos" className="link-dot link-dot--lg">Присоединиться к женскому сообществу</a>
          </div>
        </section>

        {/* ░░░ Комьюнити ░░░ */}
        <section className="section community container">
          <p className="statement">
            <strong>Комьюнити A&amp;M Concept —</strong> это прекрасные женщины,
            которые выбирают свободу, самовыражение и заботу о собственном теле
          </p>
        </section>

        {/* ░░░ Направления ░░░ */}
        <section className="section directions container" id="directions">
          <div className="directions__head">
            <span className="eyebrow">Направления</span>
            <h2 className="display">
              Выберите ритм <br />который подходит вашему <span className="dot-word">телу</span>
            </h2>
          </div>
          <div className="grid-cards">
            <article className="dcard">
              <h3>Стретчинг</h3>
              <p>Мягкая гибкость, осанка, подвижность суставов. Снижаем зажимы, учим тело расслабляться и работать правильно.</p>
              <a href="#promos" className="link-dot">Записаться</a>
            </article>
            <article className="dcard">
              <h3>Воздушная гимнастика</h3>
              <p>Кольца / полотна — эстетика движения и сильный кор. Безопасные прогрессии, чувствуете лёгкость и уверенность.</p>
              <a href="#promos" className="link-dot">Записаться</a>
            </article>
            <article className="dcard">
              <h3>Прорельеф</h3>
              <p>Умная работа на рельеф и «подтяжку» без тяжёлых весов: акценты на ягодицы, пресс, руки — с контролем техники.</p>
              <a href="#promos" className="link-dot">Записаться</a>
            </article>
            <article className="dcard">
              <h3>Жиросжигание и интенсив</h3>
              <p>Функциональные связки, кардио и тонус. Для тех, кому нужен заряд, минус сантиметры и бодрость на весь день.</p>
              <a href="#promos" className="link-dot">Записаться</a>
            </article>
            <article className="dcard">
              <h3>Работа с нутрициологом</h3>
              <p>Личные рекомендации без жёстких запретов: питание под ваши цели, цикл и график. Меню, чат-поддержка, замеры.</p>
              <a href="#promos" className="link-dot">Записаться на консультацию</a>
            </article>
            <article className="dcard">
              <h3>Онлайн-тренировки</h3>
              <p>Домашние сессии, когда вы в разъездах или с ребёнком. Программы под уровень, видео-разбор техники.</p>
              <a href="#promos" className="link-dot">Выбрать тренировку</a>
            </article>
          </div>
        </section>

        {/* ░░░ Услуги ░░░ */}
        <section className="section services container" id="services">
          <span className="eyebrow">Услуги</span>
          <h2 className="display">Здоровый результат — <br />это <span className="dot-word">комплекс</span></h2>

          <div className="services__row">
            <div className="services__photo photo" />
            <div className="services__text">
              <h3 className="display display--sm">Наши тренировки про здоровье, красоту движения и&nbsp;уважение к&nbsp;своему телу</h3>
              <p className="muted">
                Сбалансированные программы, в которых нагрузка растёт спокойно, ежедневно,
                с любовью к себе и своему телу — без перегруза и гонки за результатом.
              </p>
            </div>
          </div>

          <div className="services__row services__row--reverse">
            <div className="services__text">
              <h3 className="display display--sm">Массаж, который помогает телу восстанавливаться</h3>
              <p className="muted">
                Миофасциальные техники, лимфодренаж, расслабляющий и спортивный массаж.
                Работаем с отёчностью, зажимами, осанкой и восстановлением после нагрузок.
              </p>
              <a href="#promos" className="link-dot">Записаться на массаж</a>
            </div>
            <div className="services__photo photo photo--massage" />
          </div>
        </section>

        {/* ░░░ Тренеры ░░░ */}
        <section className="section trainers container" id="trainers">
          <div className="trainers__head">
            <span className="eyebrow">Тренеры</span>
            <h2 className="display">Наш тренерский состав — <br />ваши проводники к мягкой <span className="dot-word">силе</span></h2>
          </div>
          <div className="grid-trainers">
            <article className="tcard">
              <div className="tcard__photo photo" />
              <h3>Анастасия</h3>
              <span className="tcard__role">стретчинг, прорельеф</span>
              <p>«Люблю видимый прогресс без перегруза»</p>
            </article>
            <article className="tcard">
              <div className="tcard__photo photo" />
              <h3>Ксения</h3>
              <span className="tcard__role">воздушная гимнастика</span>
              <p>«Красота движения — это про уверенность»</p>
            </article>
            <article className="tcard">
              <div className="tcard__photo photo" />
              <h3>Ольга</h3>
              <span className="tcard__role">жиросжигающие и интенсив</span>
              <p>«Даю темп, который вдохновляет, а не выматывает»</p>
            </article>
            <article className="tcard">
              <div className="tcard__photo photo" />
              <h3>Светлана</h3>
              <span className="tcard__role">массажист</span>
              <p>«Снимаем зажимы — возвращаем свободу движений»</p>
            </article>
          </div>
        </section>

        {/* ░░░ Акции ░░░ */}
        <section className="section promos container" id="promos">
          <div className="promos__head">
            <h2 className="display">С нами не только эффективно, <br />но и <span className="dot-word">выгодно</span></h2>
            <span className="eyebrow eyebrow--end">Акции</span>
          </div>

          <div className="grid-cards grid-cards--3">
            <article className="pcard">
              <div className="pcard__photo photo" />
              <h3>Пробная неделя «Знакомство»</h3>
              <p>2 групповых тренировки + консультация нутрициолога.</p>
              <a href="#card-form" className="link-dot">Воспользоваться предложением</a>
            </article>
            <article className="pcard">
              <div className="pcard__photo photo" />
              <h3>Дуэт-абонемент</h3>
              <p>Приходите с подругой и получайте +1 тренировку в подарок каждой.</p>
              <a href="#card-form" className="link-dot">Воспользоваться предложением</a>
            </article>
            <article className="pcard">
              <div className="pcard__photo photo" />
              <h3>Массаж и тренировка</h3>
              <p>Пакет «Восстановление»: 60-мин массаж + любая групповая — со скидкой.</p>
              <a href="#card-form" className="link-dot">Воспользоваться предложением</a>
            </article>
          </div>

          <div className="featured" id="card-form">
            <div className="featured__left">
              <span className="eyebrow eyebrow--dark">Заявка</span>
              <h3 className="display display--lg display--dark">Станьте одной из 150, кто заберёт карту клуба перед открытием</h3>
              <p className="featured__note">Получите приоритетную запись и шанс выиграть ценные призы на открытии студии.</p>
            </div>
            <form className="featured__form" id="club-form" noValidate>
              <label className="field">
                <span>Имя</span>
                <input type="text" name="name" placeholder="Как к вам обращаться" required />
              </label>
              <label className="field">
                <span>Телефон</span>
                <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required />
              </label>
              <label className="consent">
                <input type="checkbox" name="consent" required />
                <span>Я подтверждаю ознакомление и даю согласие на обработку моих персональных данных в порядке и на условиях, указанных в политике.</span>
              </label>
              <button type="submit" className="btn-pill btn-pill--dark">Получить карту клуба</button>
            </form>
          </div>
        </section>

        {/* ░░░ Контакты ░░░ */}
        <section className="section contacts container" id="contacts">
          <div className="contacts__head">
            <span className="eyebrow">Контакты</span>
            <h2 className="display">Ждём вас в современном <br />женском клубе в центре <span className="dot-word">Твери</span></h2>
          </div>

          <div className="contacts__grid">
            <div className="contacts__col">
              <span className="contacts__label">Адрес</span>
              <p>Тверь, ул. Советская, 13</p>
            </div>
            <div className="contacts__col">
              <span className="contacts__label">Телефон</span>
              <p><a href="tel:+79009009090">8 (900) 900 90 90</a></p>
            </div>
            <div className="contacts__col">
              <span className="contacts__label">Напишите нам</span>
              <div className="socials">
                <a href="#" aria-label="Telegram" className="social" />
                <a href="#" aria-label="WhatsApp" className="social" />
              </div>
              <a href="#card-form" className="link-dot">Консультация</a>
            </div>
          </div>

          <div className="contacts__map" aria-hidden="true" />
        </section>
      </main>

      {/* ░░░ Подвал ░░░ */}
      <footer className="footer">
        <div className="container">
          <nav className="footer__nav">
            <a href="#about">О студии</a>
            <a href="#directions">Направления</a>
            <a href="#services">Услуги</a>
            <a href="#trainers">Тренеры</a>
            <a href="#promos">Акции</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <div className="footer__legal">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Согласие на обработку персональных данных</a>
          </div>
          <div className="footer__wordmark">A<em>&amp;</em>M Concept</div>
        </div>
      </footer>
    </>
  );
}
