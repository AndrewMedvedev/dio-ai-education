// Страница отдельного урока с навигацией и практикой по блоку
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SectionTop from "../components/SectionTop";

export default function LessonPage({
  selectedCourse,
  selectedBlock,
  selectedLesson,
  completedLessons,
  toggleLessonComplete,
  openBlock,
  openPrevLesson,
  openNextLesson,
  openPractice,
  isLessonPracticeOpen,
  setIsLessonPracticeOpen,
  hasPrevLesson,
  hasNextLesson,
}) {
  return (
    <section className="container section lesson-view">
      <SectionTop label="Урок" title={selectedLesson.title} />
      <button
        type="button"
        className="btn btn-outline back-btn"
        onClick={openBlock}
        aria-label="Назад к блоку"
        title="Назад к блоку"
      >
        &lt;
      </button>
      <div className="lesson-view-grid">
        <article className="glass-card lesson-main-card">
          <p className="course-category">{selectedCourse.title}</p>
          <p className="lesson-summary">{selectedLesson.summary}</p>
          {selectedLesson.markdown ? (
            <div className="lesson-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedLesson.markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="lesson-content">{selectedLesson.content}</p>
          )}
          <div className="lesson-controls">
            <span className="lesson-time">{selectedLesson.duration}</span>
            <button
              type="button"
              className={`btn mark-complete-btn ${completedLessons[selectedLesson.id] ? "btn-outline" : "btn-solid"}`}
              onClick={() => toggleLessonComplete(selectedLesson.id)}
            >
              {completedLessons[selectedLesson.id]
                ? "Снять отметку"
                : "Отметить пройдено"}
            </button>
          </div>
          <div className="lesson-nav-controls">
            <button
              type="button"
              className="btn btn-outline lesson-nav-btn"
              onClick={openPrevLesson}
              disabled={!hasPrevLesson}
            >
              Предыдущий урок
            </button>
            <button
              type="button"
              className="btn btn-solid lesson-nav-btn"
              onClick={openNextLesson}
              disabled={!hasNextLesson}
            >
              Следующий урок
            </button>
          </div>

          <div className="lesson-practice-inline">
            <button
              type="button"
              className={`lesson-practice-toggle ${isLessonPracticeOpen ? "is-open" : ""}`}
              onClick={() => setIsLessonPracticeOpen((prev) => !prev)}
            >
              <span>Практика по этому блоку</span>
              <span>
                {isLessonPracticeOpen
                  ? "Свернуть"
                  : `${selectedBlock.practice.length} задания`}
              </span>
            </button>

            {isLessonPracticeOpen && (
              <div className="lesson-practice-dropdown">
                <ul className="lesson-practice-list">
                  {selectedBlock.practice.map((task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        className="lesson-practice-link"
                        onClick={() => openPractice(task.id)}
                      >
                        <span>{task.title}</span>
                        <span>
                          {completedPractices[task.id]
                            ? "Выполнено"
                            : "Открыть"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
