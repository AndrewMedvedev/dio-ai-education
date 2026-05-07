// Страница выбранного блока курса с уроками и практикой
import SectionTop from "../components/SectionTop";

export default function BlockPage({
  selectedCourse,
  selectedBlock,
  completedLessons,
  completedPractices,
  openCourse,
  openLesson,
  openPractice,
}) {
  const completedLessonsInBlock = selectedBlock.lessons.filter(
    (lesson) => completedLessons[lesson.id],
  ).length;
  const completedPracticesInBlock = selectedBlock.practice.filter(
    (practice) => completedPractices[practice.id],
  ).length;
  const totalItemsInBlock =
    selectedBlock.lessons.length + selectedBlock.practice.length;
  const completedInBlock = completedLessonsInBlock + completedPracticesInBlock;
  const blockProgressPercent = Math.round(
    (completedInBlock / totalItemsInBlock) * 100,
  );

  return (
    <section className="container section block-view">
      <SectionTop label="Блок" title={selectedBlock.title} />
      <button
        type="button"
        className="btn btn-outline back-btn"
        onClick={openCourse}
        aria-label="Назад к курсу"
        title="Назад к курсу"
      >
        &lt;
      </button>
      <div className="block-view-grid">
        <article className="glass-card block-main-card">
          <p className="course-category">{selectedCourse.title}</p>
          <p className="course-details-text">
            Детальный блок курса с уроками и практикой. Используйте этот экран
            как тестовые данные для сценариев проваливания в контент.
          </p>
          <div className="block-progress-wrap">
            <div className="block-progress-head">
              <span>Прогресс блока</span>
              <strong>
                {completedInBlock}/{totalItemsInBlock} • {blockProgressPercent}%
              </strong>
            </div>
            <div className="block-progress-bar">
              <div style={{ width: `${blockProgressPercent}%` }} />
            </div>
          </div>
          <div className="course-stats-grid">
            <div>
              <span>Длительность блока</span>
              <strong>{selectedBlock.duration}</strong>
            </div>
            <div>
              <span>Уроков</span>
              <strong>{selectedBlock.lessons.length}</strong>
            </div>
            <div>
              <span>Практик</span>
              <strong>{selectedBlock.practice.length}</strong>
            </div>
            <div>
              <span>Тип</span>
              <strong>Теория + практика</strong>
            </div>
          </div>
        </article>

        <article className="glass-card block-lessons-card">
          <h3>Уроки блока</h3>
          <ul className="lessons-progress-list">
            {selectedBlock.lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  className="lesson-progress-item"
                  onClick={() => openLesson(lesson.id)}
                >
                  <span className="lesson-progress-title">{lesson.title}</span>
                  <span className="lesson-progress-meta">
                    {lesson.duration}
                  </span>
                  <span
                    className={`lesson-status ${completedLessons[lesson.id] ? "is-done" : "is-pending"}`}
                  >
                    {completedLessons[lesson.id] ? "Пройдено" : "Не пройден"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="glass-card block-practice-card">
          <h3>Практика и задания</h3>
          <ul className="practice-progress-list">
            {selectedBlock.practice.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  className="practice-progress-item"
                  onClick={() => openPractice(task.id)}
                >
                  <span className="practice-progress-title">{task.title}</span>
                  <span className="practice-progress-meta">
                    {task.duration}
                  </span>
                  <span
                    className={`practice-status ${completedPractices[task.id] ? "is-done" : "is-pending"}`}
                  >
                    {completedPractices[task.id] ? "Выполнено" : "Не выполнено"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
