// Страница практического задания курса с подробностями и отметкой выполнения
import SectionTop from "../components/SectionTop";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PracticePage({
  selectedCourse,
  selectedPractice,
  completedPractices,
  togglePracticeComplete,
  openBlock,
}) {
  return (
    <section className="container section practice-view">
      <SectionTop label="Практика" title={selectedPractice.title} />
      <button
        type="button"
        className="btn btn-outline back-btn"
        onClick={openBlock}
        aria-label="Назад к блоку"
        title="Назад к блоку"
      >
        &lt;
      </button>
      <div className="practice-view-grid">
        <article className="glass-card practice-main-card">
          <p className="course-category">{selectedCourse.title}</p>
          <p className="lesson-summary">{selectedPractice.brief}</p>
          {selectedPractice.markdown ? (
            <div className="practice-markdown lesson-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedPractice.markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="lesson-content">
              Результат: {selectedPractice.result}
            </p>
          )}
          <div className="lesson-controls">
            <span className="lesson-time">{selectedPractice.duration}</span>
            <button
              type="button"
              className={`btn mark-complete-btn ${completedPractices[selectedPractice.id] ? "btn-outline" : "btn-solid"}`}
              onClick={() => togglePracticeComplete(selectedPractice.id)}
            >
              {completedPractices[selectedPractice.id]
                ? "Снять выполнение"
                : "Отметить выполнено"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
