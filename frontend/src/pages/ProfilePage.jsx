// Личный кабинет с карточками прогресса, навигацией по вкладкам и управлением потоками преподавателя
import SectionTop from "../components/SectionTop";

export default function ProfilePage({
  profileInfo,
  profileTabItems,
  activeProfileTab,
  setActiveProfileTab,
  profileActiveCourse,
  profileActiveCourseProgress,
  profileActiveCourseTotal,
  profileActiveCourseCompleted,
  profileUpcomingTopics,
  completedLessonsCount,
  completedPracticesCount,
  overallProgressPercent,
  totalContentCount,
  coursesData,
  openCourse,
  openBlock,
  teacherGroups,
  activeTeacherGroup,
  setActiveTeacherGroupId,
  activeTeacherCourse,
  teacherGroupName,
  setTeacherGroupName,
  teacherCourseId,
  setTeacherCourseId,
  teacherStudentName,
  setTeacherStudentName,
  createTeacherGroup,
  addStudentToActiveGroup,
  adjustStudentProgress,
  simulateStudyTick,
  teacherLeaderboard,
  aiModels,
  selectedAiModel,
  setSelectedAiModel,
}) {
  return (
    <section className="container section profile-view">
      <SectionTop label="Профиль" title="Личный кабинет" />
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <article className="glass-card profile-user-card">
            <span className="profile-user-avatar">ЕС</span>
            <h3>{profileInfo.name}</h3>
            <p>{profileInfo.role}</p>
          </article>

          <article className="glass-card profile-nav-card">
            <ul className="profile-nav-list">
              {profileTabItems.map((tab) => (
                <li key={tab.id}>
                  <button
                    type="button"
                    className={`profile-tab-btn ${activeProfileTab === tab.id ? "is-active" : ""}`}
                    onClick={() => setActiveProfileTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </article>
        </aside>

        <div className="profile-content">
          {(activeProfileTab === "overview" ||
            activeProfileTab === "active-course") && (
            <article className="glass-card profile-track-card">
              <div className="profile-track-head">
                <div>
                  <span>Активный трек</span>
                  <h3>{profileActiveCourse.title}</h3>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => openCourse(profileActiveCourse.id)}
                >
                  Продолжить
                </button>
              </div>
              <div className="profile-track-progress">
                <div>
                  <p>Общий прогресс</p>
                  <strong>{profileActiveCourseProgress}%</strong>
                </div>
                <div className="block-progress-bar">
                  <div style={{ width: `${profileActiveCourseProgress}%` }} />
                </div>
                <small>
                  Пройдено: {profileActiveCourseCompleted}/
                  {profileActiveCourseTotal}
                </small>
              </div>
            </article>
          )}

          {activeProfileTab === "overview" && (
            <>
              <div className="profile-stats-grid">
                <article className="glass-card profile-stat-card">
                  <span>Завершено</span>
                  <strong>
                    {completedLessonsCount + completedPracticesCount}
                  </strong>
                  <p>элементов из {totalContentCount}</p>
                </article>
                <article className="glass-card profile-stat-card">
                  <span>Темп</span>
                  <strong>{profileInfo.hours}</strong>
                  <p>суммарно в обучении</p>
                </article>
                <article className="glass-card profile-stat-card">
                  <span>Подписка</span>
                  <strong>{profileInfo.plan}</strong>
                  <p>серия: {profileInfo.streak}</p>
                </article>
              </div>
              <div className="profile-info-grid">
                <article className="glass-card profile-info-card">
                  <h3>Ближайшие темы</h3>
                  <ul>
                    {profileUpcomingTopics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </article>
                <article className="glass-card profile-info-card">
                  <h3>Активность</h3>
                  <ul>
                    <li>Завершено уроков: {completedLessonsCount}</li>
                    <li>Выполнено практик: {completedPracticesCount}</li>
                    <li>Общий прогресс: {overallProgressPercent}%</li>
                  </ul>
                </article>
              </div>
            </>
          )}

          {activeProfileTab === "active-course" && (
            <article className="glass-card profile-detail-card">
              <h3>Блоки активного курса</h3>
              <ul className="profile-action-list">
                {profileActiveCourse.blocks.map((block) => (
                  <li key={block.id}>
                    <button
                      type="button"
                      className="profile-course-link"
                      onClick={() => openBlock(block.id)}
                    >
                      {block.title}
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {activeProfileTab === "catalog" && (
            <article className="glass-card profile-detail-card">
              <h3>Каталог курсов</h3>
              <ul className="profile-action-list">
                {coursesData.map((course) => (
                  <li key={course.id}>
                    <button
                      type="button"
                      className="profile-course-link"
                      onClick={() => openCourse(course.id)}
                    >
                      {course.title}
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {activeProfileTab === "access" && (
            <article className="glass-card profile-detail-card">
              <h3>Тариф и доступ</h3>
              <div className="profile-badges">
                <span>Тариф: {profileInfo.plan}</span>
                <span>Прогресс: {overallProgressPercent}%</span>
                <span>В обучении: {profileInfo.hours}</span>
                <span>Серия: {profileInfo.streak}</span>
              </div>
              <button
                type="button"
                className="btn btn-solid profile-manage-btn"
                onClick={() => openCourse(profileActiveCourse.id)}
              >
                Управлять подпиской
              </button>
            </article>
          )}

          {activeProfileTab === "teacher" && (
            <div className="teacher-grid teacher-grid-in-profile">
              <article className="glass-card teacher-create-card">
                <h3>Создать учебный поток</h3>
                <div className="teacher-form-grid">
                  <label className="teacher-field">
                    <span>Название потока</span>
                    <input
                      type="text"
                      placeholder="Например: Data Flow — Июнь"
                      value={teacherGroupName}
                      onChange={(event) =>
                        setTeacherGroupName(event.target.value)
                      }
                    />
                  </label>
                  <label className="teacher-field">
                    <span>Курс</span>
                    <select
                      value={teacherCourseId}
                      onChange={(event) =>
                        setTeacherCourseId(event.target.value)
                      }
                    >
                      {coursesData.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-solid"
                  onClick={createTeacherGroup}
                >
                  Создать поток
                </button>
              </article>

              <article className="glass-card teacher-groups-card">
                <h3>Потоки преподавателя</h3>
                <ul className="teacher-groups-list">
                  {teacherGroups.map((group) => {
                    const groupCourse = coursesData.find(
                      (course) => course.id === group.courseId,
                    );
                    const groupAverageProgress =
                      group.students.length === 0
                        ? 0
                        : Math.round(
                            group.students.reduce(
                              (total, student) => total + student.progress,
                              0,
                            ) / group.students.length,
                          );
                    return (
                      <li key={group.id}>
                        <button
                          type="button"
                          className={`teacher-group-btn ${group.id === activeTeacherGroup?.id ? "is-active" : ""}`}
                          onClick={() => setActiveTeacherGroupId(group.id)}
                        >
                          <strong>{group.name}</strong>
                          <span>{groupCourse?.title || "Курс не выбран"}</span>
                          <span>
                            {group.students.length} учеников • средний прогресс{" "}
                            {groupAverageProgress}%
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </article>

              <article className="glass-card teacher-students-card">
                <div className="teacher-card-head">
                  <div>
                    <h3>Ученики в потоке</h3>
                    <p>
                      {activeTeacherGroup
                        ? activeTeacherGroup.name
                        : "Сначала создайте поток"}
                    </p>
                    <span className="teacher-chip">
                      {activeTeacherCourse?.title}
                    </span>
                    <input
                      type="text"
                      placeholder="Имя ученика"
                      value={teacherStudentName}
                      onChange={(event) =>
                        setTeacherStudentName(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addStudentToActiveGroup();
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={addStudentToActiveGroup}
                  >
                    Добавить
                  </button>
                </div>

                {!activeTeacherGroup ||
                activeTeacherGroup.students.length === 0 ? (
                  <p className="teacher-empty">
                    Пока нет учеников. Добавьте первого студента в поток.
                  </p>
                ) : (
                  <ul className="teacher-students-list">
                    {activeTeacherGroup.students.map((student) => (
                      <li key={student.id} className="teacher-student-item">
                        <div className="teacher-student-row">
                          <strong>{student.name}</strong>
                          <span>{student.progress}%</span>
                        </div>
                        <div className="course-progress-track">
                          <div style={{ width: `${student.progress}%` }} />
                        </div>
                        <div className="teacher-student-actions">
                          <small>Пройдено уроков: {student.lessonsDone}</small>
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                adjustStudentProgress(student.id, -5)
                              }
                            >
                              -5%
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                adjustStudentProgress(student.id, 5)
                              }
                            >
                              +5%
                            </button>
                            <button
                              type="button"
                              onClick={() => simulateStudyTick(student.id)}
                            >
                              Симулировать
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              <article className="glass-card teacher-leaderboard-card">
                <h3>Лидерборд потока</h3>
                {teacherLeaderboard.length === 0 ? (
                  <p className="teacher-empty">
                    Лидерборд появится после добавления учеников.
                  </p>
                ) : (
                  <ol className="teacher-leaderboard-list">
                    {teacherLeaderboard.map((student, index) => (
                      <li key={`lb-${student.id}`}>
                        <span className="teacher-rank">{index + 1}</span>
                        <div className="teacher-rank-main">
                          <strong>{student.name}</strong>
                          <small>Уроков: {student.lessonsDone}</small>
                        </div>
                        <span className="teacher-rank-score">
                          {student.progress}%
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            </div>
          )}

          {activeProfileTab === "settings" && (
            <article className="glass-card profile-detail-card">
              <h3>Модели ИИ</h3>
              <p className="ai-models-description">
                Выберите модель для генерации контента
              </p>
              <div className="ai-models-grid">
                {aiModels.map((model) => (
                  <div
                    key={model.id}
                    className={`ai-model-card ${selectedAiModel === model.id ? "is-selected" : ""}`}
                    onClick={() => setSelectedAiModel(model.id)}
                  >
                    {model.badge && (
                      <span className="ai-model-badge">{model.badge}</span>
                    )}
                    <h4>{model.name}</h4>
                    <p className="ai-model-description">{model.description}</p>
                    <div className="ai-model-pros">
                      {model.pros.map((pro, index) => (
                        <span key={index} className="ai-model-pro">
                          {pro}
                        </span>
                      ))}
                    </div>
                    <div className="ai-model-cons">
                      {model.cons.map((con, index) => (
                        <span key={index} className="ai-model-con">
                          {con}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
