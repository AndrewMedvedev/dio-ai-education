import { useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import BlockPage from "./pages/BlockPage";
import LessonPage from "./pages/LessonPage";
import PracticePage from "./pages/PracticePage";
import CreatorPage from "./pages/CreatorPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import ProfilePage from "./pages/ProfilePage";
import EasterEgg from "./components/EasterEgg";
import {
  courseLeaderboardMocks,
  courseMaterialLibrary,
  coursesData,
  defaultCourseLeaderboard,
  profileInfo,
  profileTabItems,
  subscriptionPlans,
  points,
  steps,
  tracks,
  aiModels,
} from "./utils/data";

function getRouteState(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const defaultCourse = coursesData[0];
  let selectedCourse = defaultCourse;
  let selectedBlock = defaultCourse.blocks[0];
  let selectedLesson = selectedBlock.lessons[0];
  let selectedPractice = selectedBlock.practice[0];

  if (segments[0] === "course") {
    const courseId = segments[1];
    const course = coursesData.find((item) => item.id === courseId);
    if (course) {
      selectedCourse = course;
      selectedBlock = course.blocks[0];
      selectedLesson = selectedBlock.lessons[0];
      selectedPractice = selectedBlock.practice[0];

      if (segments[2] === "block" && segments[3]) {
        const block = course.blocks.find((item) => item.id === segments[3]);
        if (block) {
          selectedBlock = block;
          selectedLesson = block.lessons[0];
          selectedPractice = block.practice[0];
        }
      }

      if (segments[2] === "lesson" && segments[3]) {
        const lessonId = segments[3];
        const block = course.blocks.find((item) =>
          item.lessons.some((lesson) => lesson.id === lessonId),
        );
        if (block) {
          selectedBlock = block;
          selectedLesson =
            block.lessons.find((lesson) => lesson.id === lessonId) ||
            block.lessons[0];
          selectedPractice = block.practice[0];
        }
      }

      if (segments[2] === "practice" && segments[3]) {
        const practiceId = segments[3];
        const block = course.blocks.find((item) =>
          item.practice.some((practice) => practice.id === practiceId),
        );
        if (block) {
          selectedBlock = block;
          selectedPractice =
            block.practice.find((practice) => practice.id === practiceId) ||
            block.practice[0];
          selectedLesson = block.lessons[0];
        }
      }
    }
  }

  return {
    courseId: selectedCourse.id,
    blockId: selectedBlock.id,
    lessonId: selectedLesson.id,
    practiceId: selectedPractice.id,
  };
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRouteState = useMemo(
    () => getRouteState(window.location.pathname),
    [],
  );

  const [theme, setTheme] = useState("light");
  const [selectedCourseId, setSelectedCourseId] = useState(
    initialRouteState.courseId,
  );
  const [selectedBlockId, setSelectedBlockId] = useState(
    initialRouteState.blockId,
  );
  const [selectedLessonId, setSelectedLessonId] = useState(
    initialRouteState.lessonId,
  );
  const [selectedPracticeId, setSelectedPracticeId] = useState(
    initialRouteState.practiceId,
  );
  const [isLessonPracticeOpen, setIsLessonPracticeOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState("month");
  const [selectedPlanId, setSelectedPlanId] = useState("plus");
  const [activeProfileTab, setActiveProfileTab] = useState("overview");
  const [selectedAiModel, setSelectedAiModel] = useState("gpt-4-turbo");
  const [draftCourseTitle, setDraftCourseTitle] = useState("");
  const [draftCourseGoal, setDraftCourseGoal] = useState("");
  const [draftCourseLevel, setDraftCourseLevel] = useState("Новичок");
  const [draftCourseDuration, setDraftCourseDuration] = useState("8 недель");
  const [draftCourseFormat, setDraftCourseFormat] =
    useState("Видео + практика");
  const [openCreatorSelect, setOpenCreatorSelect] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [attachedMaterialIds, setAttachedMaterialIds] = useState([]);
  const [uploadedKnowledgeFiles, setUploadedKnowledgeFiles] = useState([]);
  const [generatedCourseDraft, setGeneratedCourseDraft] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const [completedPractices, setCompletedPractices] = useState({});
  const [teacherGroups, setTeacherGroups] = useState(() => [
    {
      id: "group-demo-1",
      name: "Поток: Python май",
      courseId: coursesData[0].id,
      students: [
        {
          id: "student-1",
          name: "Анна Петрова",
          progress: 62,
          lessonsDone: 15,
        },
        { id: "student-2", name: "Игорь Левин", progress: 48, lessonsDone: 11 },
        { id: "student-3", name: "София Ким", progress: 39, lessonsDone: 9 },
      ],
    },
  ]);
  const [activeTeacherGroupId, setActiveTeacherGroupId] =
    useState("group-demo-1");
  const [teacherGroupName, setTeacherGroupName] = useState("Новый поток");
  const [teacherCourseId, setTeacherCourseId] = useState(coursesData[0].id);
  const [teacherStudentName, setTeacherStudentName] = useState("");
  const knowledgeFileInputRef = useRef(null);
  const creatorFormCardRef = useRef(null);
  const [creatorFormCardHeight, setCreatorFormCardHeight] = useState(0);
  const [isWideCreatorLayout, setIsWideCreatorLayout] = useState(
    () => window.innerWidth > 1100,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsWideCreatorLayout(window.innerWidth > 1100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!creatorFormCardRef.current) {
      return;
    }

    const updateHeight = () => {
      setCreatorFormCardHeight(creatorFormCardRef.current?.offsetHeight || 0);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(creatorFormCardRef.current);

    return () => observer.disconnect();
  }, [draftCourseTitle, draftCourseGoal, openCreatorSelect]);

  useEffect(() => {
    if (!location.pathname.startsWith("/course")) {
      return;
    }

    const routeState = getRouteState(location.pathname);
    setSelectedCourseId(routeState.courseId);
    setSelectedBlockId(routeState.blockId);
    setSelectedLessonId(routeState.lessonId);
    setSelectedPracticeId(routeState.practiceId);
  }, [location.pathname]);

  const selectedCourse =
    coursesData.find((course) => course.id === selectedCourseId) ||
    coursesData[0];
  const selectedBlock =
    selectedCourse.blocks.find((block) => block.id === selectedBlockId) ||
    selectedCourse.blocks[0];
  const selectedLesson =
    selectedBlock.lessons.find((lesson) => lesson.id === selectedLessonId) ||
    selectedBlock.lessons[0];
  const selectedPractice =
    selectedBlock.practice.find(
      (practice) => practice.id === selectedPracticeId,
    ) || selectedBlock.practice[0];
  const lessonSequence = selectedCourse.blocks.flatMap((block) =>
    block.lessons.map((lesson) => ({
      blockId: block.id,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    })),
  );
  const currentLessonIndex = lessonSequence.findIndex(
    (item) => item.lessonId === selectedLesson.id,
  );
  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < lessonSequence.length - 1;

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
  const totalLessonsCount = coursesData.reduce(
    (total, course) =>
      total +
      course.blocks.reduce((sum, block) => sum + block.lessons.length, 0),
    0,
  );
  const totalPracticesCount = coursesData.reduce(
    (total, course) =>
      total +
      course.blocks.reduce((sum, block) => sum + block.practice.length, 0),
    0,
  );
  const completedLessonsCount =
    Object.values(completedLessons).filter(Boolean).length;
  const completedPracticesCount =
    Object.values(completedPractices).filter(Boolean).length;
  const overallProgressPercent = Math.round(
    ((completedLessonsCount + completedPracticesCount) /
      (totalLessonsCount + totalPracticesCount)) *
      100,
  );
  const profileActiveCourse = selectedCourse || coursesData[0];
  const profileActiveCourseTotal = profileActiveCourse.blocks.reduce(
    (total, block) => total + block.lessons.length + block.practice.length,
    0,
  );
  const profileActiveCourseCompleted = profileActiveCourse.blocks.reduce(
    (total, block) =>
      total +
      block.lessons.filter((lesson) => completedLessons[lesson.id]).length +
      block.practice.filter((practice) => completedPractices[practice.id])
        .length,
    0,
  );
  const profileActiveCourseProgress = Math.round(
    (profileActiveCourseCompleted / Math.max(1, profileActiveCourseTotal)) *
      100,
  );
  const selectedCourseLeaderboard = (
    courseLeaderboardMocks[selectedCourse.id] || defaultCourseLeaderboard
  )
    .slice()
    .sort((a, b) => b.progress - a.progress);
  const profileUpcomingTopics = profileActiveCourse.blocks
    .slice(0, 3)
    .map((block) => block.title);
  const filteredLibraryItems = courseMaterialLibrary.filter((item) => {
    const search = librarySearch.trim().toLowerCase();
    if (!search) {
      return true;
    }
    const haystack =
      `${item.title} ${item.type} ${item.tags.join(" ")}`.toLowerCase();
    return haystack.includes(search);
  });
  const attachedLibraryItems = courseMaterialLibrary.filter((item) =>
    attachedMaterialIds.includes(item.id),
  );
  const canGenerateDraft = draftCourseTitle.trim().length > 2;
  const activeTeacherGroup =
    teacherGroups.find((group) => group.id === activeTeacherGroupId) ||
    teacherGroups[0] ||
    null;
  const activeTeacherCourse =
    coursesData.find(
      (course) =>
        course.id === (activeTeacherGroup?.courseId || teacherCourseId),
    ) || coursesData[0];
  const teacherLeaderboard = activeTeacherGroup
    ? [...activeTeacherGroup.students].sort(
        (a, b) =>
          b.progress - a.progress ||
          b.lessonsDone - a.lessonsDone ||
          a.name.localeCompare(b.name),
      )
    : [];

  const openHomeSection = (id) => {
    navigate("/");
    requestAnimationFrame(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openCourses = () => {
    navigate("/courses");
  };

  const openCreator = () => {
    navigate("/creator");
  };

  const openSubscriptions = () => {
    navigate("/subscriptions");
  };

  const openCourse = (courseId) => {
    const nextCourse =
      coursesData.find((course) => course.id === courseId) || coursesData[0];
    setSelectedCourseId(nextCourse.id);
    setSelectedBlockId(nextCourse.blocks[0].id);
    setSelectedLessonId(nextCourse.blocks[0].lessons[0].id);
    setSelectedPracticeId(nextCourse.blocks[0].practice[0].id);
    setIsLessonPracticeOpen(false);
    navigate(`/course/${nextCourse.id}`);
  };

  const openBlock = (blockId) => {
    const nextBlock =
      selectedCourse.blocks.find((block) => block.id === blockId) ||
      selectedCourse.blocks[0];
    setSelectedBlockId(nextBlock.id);
    setSelectedLessonId(nextBlock.lessons[0].id);
    setSelectedPracticeId(nextBlock.practice[0].id);
    setIsLessonPracticeOpen(false);
    navigate(`/course/${selectedCourse.id}/block/${nextBlock.id}`);
  };

  const openLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setIsLessonPracticeOpen(false);
    navigate(`/course/${selectedCourse.id}/lesson/${lessonId}`);
  };

  const openLessonBySequenceIndex = (index) => {
    const target = lessonSequence[index];
    if (!target) {
      return;
    }

    setSelectedBlockId(target.blockId);
    setSelectedLessonId(target.lessonId);
    setIsLessonPracticeOpen(false);
    navigate(`/course/${selectedCourse.id}/lesson/${target.lessonId}`);
  };

  const openPrevLesson = () => {
    if (!hasPrevLesson) {
      return;
    }
    openLessonBySequenceIndex(currentLessonIndex - 1);
  };

  const openNextLesson = () => {
    if (!hasNextLesson) {
      return;
    }
    openLessonBySequenceIndex(currentLessonIndex + 1);
  };

  const openPractice = (practiceId) => {
    setSelectedPracticeId(practiceId);
    navigate(`/course/${selectedCourse.id}/practice/${practiceId}`);
  };

  const toggleLessonComplete = (lessonId) => {
    setCompletedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  const togglePracticeComplete = (practiceId) => {
    setCompletedPractices((prev) => ({
      ...prev,
      [practiceId]: !prev[practiceId],
    }));
  };

  const createTeacherGroup = () => {
    const nextName = teacherGroupName.trim();
    if (nextName.length < 2) {
      return;
    }

    const nextGroupId = `group-${Date.now()}`;
    setTeacherGroups((prev) => [
      ...prev,
      {
        id: nextGroupId,
        name: nextName,
        courseId: teacherCourseId,
        students: [],
      },
    ]);
    setActiveTeacherGroupId(nextGroupId);
    setTeacherGroupName("");
  };

  const addStudentToActiveGroup = () => {
    const nextName = teacherStudentName.trim();
    if (!activeTeacherGroup || nextName.length < 2) {
      return;
    }

    const nextStudent = {
      id: `student-${Date.now()}`,
      name: nextName,
      progress: 0,
      lessonsDone: 0,
    };

    setTeacherGroups((prev) =>
      prev.map((group) =>
        group.id === activeTeacherGroup.id
          ? { ...group, students: [...group.students, nextStudent] }
          : group,
      ),
    );
    setTeacherStudentName("");
  };

  const adjustStudentProgress = (studentId, delta) => {
    if (!activeTeacherGroup) {
      return;
    }

    setTeacherGroups((prev) =>
      prev.map((group) => {
        if (group.id !== activeTeacherGroup.id) {
          return group;
        }

        return {
          ...group,
          students: group.students.map((student) => {
            if (student.id !== studentId) {
              return student;
            }

            const nextProgress = Math.max(
              0,
              Math.min(100, student.progress + delta),
            );
            const nextLessonsDone = Math.max(
              0,
              student.lessonsDone + (delta > 0 ? 1 : delta < 0 ? -1 : 0),
            );
            return {
              ...student,
              progress: nextProgress,
              lessonsDone: nextLessonsDone,
            };
          }),
        };
      }),
    );
  };

  const simulateStudyTick = (studentId) => {
    const delta = Math.floor(Math.random() * 8) + 3;
    adjustStudentProgress(studentId, delta);
  };

  const toggleMaterialAttach = (materialId) => {
    setAttachedMaterialIds((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId],
    );
  };

  const handleKnowledgeFilesPick = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    const nextFiles = files.map((file, index) => ({
      id: `uploaded-file-${Date.now()}-${index}`,
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
    }));

    setUploadedKnowledgeFiles((prev) => [...nextFiles, ...prev]);
    event.target.value = "";
  };

  const generateCourseDraft = () => {
    if (!canGenerateDraft) {
      return;
    }

    const courseTitle = draftCourseTitle.trim();
    const mainGoal =
      draftCourseGoal.trim() ||
      "Системно освоить тему и закрепить навыки на практических сценариях.";
    const baseModules = [
      `Введение: ${courseTitle} и карта навыков`,
      "Инструменты и базовые техники работы",
      "Практика на реальных кейсах",
      "Контроль качества и итоги",
    ];
    const dbModules = attachedLibraryItems
      .slice(0, 3)
      .map((item, index) => `Блок из базы ${index + 1}: ${item.title}`);
    const modules = [...baseModules, ...dbModules];

    setGeneratedCourseDraft({
      title: courseTitle,
      goal: mainGoal,
      level: draftCourseLevel,
      duration: draftCourseDuration,
      format: draftCourseFormat,
      modules,
      attached: attachedLibraryItems,
    });
  };

  return (
    <div className="page" data-theme={theme}>
      <EasterEgg />
      <div className="aim-grid" aria-hidden="true">
        <div className="aim-grid-plane" />
      </div>
      <svg
        className="liquid-filter-defs"
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.008"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="77"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <Header
        theme={theme}
        toggleTheme={() =>
          setTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
        openHomeSection={openHomeSection}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                tracks={tracks}
                points={points}
                steps={steps}
                openCreator={openCreator}
                openCourses={openCourses}
              />
            }
          />
          <Route
            path="/courses"
            element={
              <CoursesPage
                coursesData={coursesData}
                completedLessons={completedLessons}
                completedPractices={completedPractices}
                openCourse={openCourse}
              />
            }
          />
          <Route
            path="/course/:courseId"
            element={
              <CoursePage
                selectedCourse={selectedCourse}
                selectedCourseLeaderboard={selectedCourseLeaderboard}
                completedLessons={completedLessons}
                completedPractices={completedPractices}
                openCourses={openCourses}
                openBlock={openBlock}
              />
            }
          />
          <Route
            path="/course/:courseId/block/:blockId"
            element={
              <BlockPage
                selectedCourse={selectedCourse}
                selectedBlock={selectedBlock}
                completedLessons={completedLessons}
                completedPractices={completedPractices}
                openCourse={() => navigate(`/course/${selectedCourse.id}`)}
                openLesson={openLesson}
                openPractice={openPractice}
              />
            }
          />
          <Route
            path="/course/:courseId/lesson/:lessonId"
            element={
              <LessonPage
                selectedCourse={selectedCourse}
                selectedBlock={selectedBlock}
                selectedLesson={selectedLesson}
                completedLessons={completedLessons}
                toggleLessonComplete={toggleLessonComplete}
                openBlock={() =>
                  navigate(
                    `/course/${selectedCourse.id}/block/${selectedBlock.id}`,
                  )
                }
                openPrevLesson={openPrevLesson}
                openNextLesson={openNextLesson}
                openPractice={openPractice}
                isLessonPracticeOpen={isLessonPracticeOpen}
                setIsLessonPracticeOpen={setIsLessonPracticeOpen}
                hasPrevLesson={hasPrevLesson}
                hasNextLesson={hasNextLesson}
              />
            }
          />
          <Route
            path="/course/:courseId/practice/:practiceId"
            element={
              <PracticePage
                selectedCourse={selectedCourse}
                selectedPractice={selectedPractice}
                completedPractices={completedPractices}
                togglePracticeComplete={togglePracticeComplete}
                openBlock={() =>
                  navigate(
                    `/course/${selectedCourse.id}/block/${selectedBlock.id}`,
                  )
                }
              />
            }
          />
          <Route path="/creator" element={<CreatorPage />} />
          <Route
            path="/subscriptions"
            element={
              <SubscriptionsPage
                billingPeriod={billingPeriod}
                setBillingPeriod={setBillingPeriod}
                subscriptionPlans={subscriptionPlans}
                selectedPlanId={selectedPlanId}
                selectPlan={setSelectedPlanId}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                profileInfo={profileInfo}
                profileTabItems={profileTabItems}
                activeProfileTab={activeProfileTab}
                setActiveProfileTab={setActiveProfileTab}
                profileActiveCourse={profileActiveCourse}
                profileActiveCourseProgress={profileActiveCourseProgress}
                profileActiveCourseTotal={profileActiveCourseTotal}
                profileActiveCourseCompleted={profileActiveCourseCompleted}
                profileUpcomingTopics={profileUpcomingTopics}
                completedLessonsCount={completedLessonsCount}
                completedPracticesCount={completedPracticesCount}
                overallProgressPercent={overallProgressPercent}
                totalContentCount={totalLessonsCount + totalPracticesCount}
                coursesData={coursesData}
                openCourse={openCourse}
                openBlock={openBlock}
                teacherGroups={teacherGroups}
                activeTeacherGroup={activeTeacherGroup}
                setActiveTeacherGroupId={setActiveTeacherGroupId}
                activeTeacherCourse={activeTeacherCourse}
                teacherGroupName={teacherGroupName}
                setTeacherGroupName={setTeacherGroupName}
                teacherCourseId={teacherCourseId}
                setTeacherCourseId={setTeacherCourseId}
                teacherStudentName={teacherStudentName}
                setTeacherStudentName={setTeacherStudentName}
                createTeacherGroup={createTeacherGroup}
                addStudentToActiveGroup={addStudentToActiveGroup}
                adjustStudentProgress={adjustStudentProgress}
                simulateStudyTick={simulateStudyTick}
                teacherLeaderboard={teacherLeaderboard}
                aiModels={aiModels}
                selectedAiModel={selectedAiModel}
                setSelectedAiModel={setSelectedAiModel}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
