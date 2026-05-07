// Страница каталога курсов с карточками и прогрессом пользователя
import SectionTop from "../components/SectionTop";

export default function CoursesPage({
  coursesData,
  completedLessons,
  completedPractices,
  openCourse,
}) {
  return (
    <section className="container section courses-tab" id="courses-tab">
      <SectionTop label="Курс" title="Каталог программ обучения" />
      <div className="courses-catalog-grid">
        {coursesData.map((course) => {
          const courseTotalItems = course.blocks.reduce(
            (total, block) =>
              total + block.lessons.length + block.practice.length,
            0,
          );
          const courseCompletedItems = course.blocks.reduce(
            (total, block) =>
              total +
              block.lessons.filter((lesson) => completedLessons[lesson.id])
                .length +
              block.practice.filter(
                (practice) => completedPractices[practice.id],
              ).length,
            0,
          );
          const courseProgress = Math.round(
            (courseCompletedItems / Math.max(1, courseTotalItems)) * 100,
          );

          return (
            <article
              key={course.id}
              className="course-tab-card glass-card is-clickable"
              role="button"
              tabIndex={0}
              onClick={() => openCourse(course.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openCourse(course.id);
                }
              }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta-inline">
                <span>{course.duration}</span>
                <span>{course.level}</span>
                <span>{course.blocks.length} блока</span>
              </div>

              <div className="course-progress-cta" aria-hidden="true">
                <div className="course-progress-track">
                  <div style={{ width: `${courseProgress}%` }} />
                </div>
                <span className="course-progress-value">{courseProgress}%</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
