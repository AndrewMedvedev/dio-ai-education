// Страница деталей выбранного курса с описанием, блоками и лидербордом
import SectionTop from "../components/SectionTop";

export default function CoursePage({
  selectedCourse,
  selectedCourseLeaderboard,
  completedLessons,
  completedPractices,
  openCourses,
  openBlock,
}) {
  return (
    <section className="container section course-details-view">
      <SectionTop label="Курс" title={selectedCourse.title} />
      <button
        type="button"
        className="btn btn-outline back-btn"
        onClick={openCourses}
        aria-label="Назад к каталогу"
        title="Назад к каталогу"
      >
        &lt;
      </button>
      <div className="course-details-grid">
        <article className="glass-card course-details-main">
          <p className="course-category">{selectedCourse.category}</p>
          <p className="course-details-text">{selectedCourse.description}</p>
          <div className="course-stats-grid">
            <div>
              <span>Длительность</span>
              <strong>{selectedCourse.duration}</strong>
            </div>
            <div>
              <span>Объем</span>
              <strong>{selectedCourse.lessons}</strong>
            </div>
            <div>
              <span>Уровень</span>
              <strong>{selectedCourse.level}</strong>
            </div>
            <div>
              <span>Формат</span>
              <strong>{selectedCourse.format}</strong>
            </div>
          </div>
        </article>

        <article className="glass-card course-details-modules">
          <h3>Блоки курса</h3>
          <ul className="course-blocks-list">
            {selectedCourse.blocks.map((block, index) => {
              const doneLessons = block.lessons.filter(
                (lesson) => completedLessons[lesson.id],
              ).length;
              const donePractices = block.practice.filter(
                (practice) => completedPractices[practice.id],
              ).length;
              const doneItems = doneLessons + donePractices;
              const totalItems = block.lessons.length + block.practice.length;
              return (
                <li key={block.id}>
                  <button
                    type="button"
                    className="course-block-item"
                    onClick={() => openBlock(block.id)}
                  >
                    <span className="course-block-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="course-block-title">{block.title}</span>
                    <span className="course-block-meta">
                      {block.duration} • {block.lessons.length} урока •{" "}
                      {block.practice.length} практики
                    </span>
                    <span className="course-block-progress">
                      Пройдено: {doneItems}/{totalItems}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="glass-card course-leaderboard-card">
          <div className="course-leaderboard-head">
            <h3>Лидерборд курса</h3>
          </div>
          <ol className="course-leaderboard-list">
            {selectedCourseLeaderboard.map((student, index) => (
              <li key={student.id}>
                <span className="course-leaderboard-rank">{index + 1}</span>
                <div className="course-leaderboard-main">
                  <strong>{student.name}</strong>
                  <small>{student.pace}</small>
                </div>
                <span className="course-leaderboard-score">
                  {student.progress}%
                </span>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
