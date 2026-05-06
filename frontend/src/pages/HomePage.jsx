// Главная страница с описанием продукта, каталогом треков и механикой генерации
import SectionTop from "../components/SectionTop";

export default function HomePage({
  tracks,
  points,
  steps,
  openCreator,
  openCourses,
}) {
  return (
    <>
      <section className="container hero">
        <div className="hero-grid">
          <div className="hero-left glass-card">
            <p className="kicker">ИИ-КУРСЫ НОВОГО ФОРМАТА</p>
            <h1>Генерируйте курсы по ИИ и смежным темам под свой уровень</h1>
            <p className="lead">
              Платформа создаёт курс за несколько минут: темы, модули, практика
              и контроль прогресса. Вы получаете рабочую программу обучения без
              перегруза и хаоса.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-solid"
                onClick={openCreator}
              >
                Сгенерировать курс
              </button>
              <button
                type="button"
                className="btn btn-flat"
                onClick={openCourses}
              >
                Каталог ИИ-курсов
              </button>
            </div>
          </div>

          <div className="hero-right glass-card">
            <p className="panel-title">Пример сгенерированного курса</p>
            <div className="line-item">
              <span>01</span>
              <p>Основы ИИ и работа с современными моделями</p>
            </div>
            <div className="line-item">
              <span>02</span>
              <p>Промптинг, контроль качества и верификация ответов</p>
            </div>
            <div className="line-item">
              <span>03</span>
              <p>Практика: автоматизация задач и мини-проекты</p>
            </div>
            <div className="line-item active">
              <span>04</span>
              <p>Итог: персональный AI-workflow для вашей сферы</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section" id="about">
        <SectionTop label="01" title="Что вы получаете в AI Course Lab" />
        <div className="point-list">
          {points.map((item) => (
            <article key={item} className="glass-card">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section" id="tracks">
        <SectionTop label="02" title="Каталог ИИ-курсов" />
        <div className="track-grid">
          {tracks.map((track) => (
            <article key={track.title} className="track-card glass-card">
              <h3>{track.title}</h3>
              <p className="track-desc">{track.description}</p>
              <div className="track-meta">
                <span>{track.modules}</span>
                <span>{track.format}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section" id="flow">
        <SectionTop label="03" title="Как генерируется ваш ИИ-курс" />
        <div className="flow-grid">
          {steps.map((step, index) => (
            <article key={step.title} className="glass-card">
              <b>{String(index + 1).padStart(2, "0")}</b>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container cta glass-card" id="cta">
        <div>
          <h2>Запустите свой ИИ-курс сегодня</h2>
          <p>Одна заявка и вы получаете структуру обучения под вашу задачу.</p>
        </div>
        <button type="button" className="btn btn-solid" onClick={openCreator}>
          Старт генерации
        </button>
      </section>
    </>
  );
}
