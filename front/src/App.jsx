import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EasterEgg from "./easter-egg/EasterEgg";
import CreatorChatView from "./creator/CreatorChatView";

const tracks = [
  {
    title: "AI Foundations",
    modules: "12 модулей",
    format: "Видео + практика + квизы",
    description: "База по ИИ: модели, промпты, ограничения и реальные сценарии применения.",
  },
  {
    title: "AI for Analytics",
    modules: "14 модулей",
    format: "SQL, Python, кейсы",
    description: "Использование ИИ в анализе данных, отчетности и принятии решений.",
  },
  {
    title: "AI Product Builder",
    modules: "16 модулей",
    format: "Проектный трек",
    description: "От идеи до прототипа AI-продукта с модульной разработкой и тестами.",
  },
  {
    title: "Automation with AI",
    modules: "10 модулей",
    format: "No-code + API",
    description: "Автоматизация рутины и бизнес-процессов через ассистентов и интеграции.",
  },
];

const steps = [
  {
    title: "Заполняете бриф",
    text: "Тема, уровень, цели и время на обучение. На основе этого строится учебная траектория.",
  },
  {
    title: "Получаете ИИ-программу",
    text: "План с модулями, уроками и практикой. Можно менять сложность и фокус прямо в процессе.",
  },
  {
    title: "Учитесь по персональному треку",
    text: "Система обновляет программу по вашим результатам и поддерживает стабильный прогресс.",
  },
];

const points = [
  "Только про обучение и навыки, без обещаний трудоустройства",
  "Структура курсов под ваши задачи и реальный график",
  "Четкая модульная логика: теория, практика, контроль",
];

const coursesCatalog = [
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    category: "Базовый трек",
    description: "Курс о том, как устроены современные AI-модели и как использовать их осознанно.",
    duration: "8 недель",
    lessons: "24 уроков",
    level: "Новичок",
    format: "Видео + практика",
    modules: [
      "Как работают LLM и генеративные модели",
      "Промптинг: базовые паттерны",
      "Проверка фактов и контроль качества ответов",
      "Мини-проект: AI-помощник для учебы",
    ],
  },
  {
    id: "ai-workflows",
    title: "AI for Workflows",
    category: "Автоматизация",
    description: "Настройка AI-процессов для ежедневных задач, документов и коммуникаций.",
    duration: "10 недель",
    lessons: "30 уроков",
    level: "Новичок - Middle",
    format: "Практика + шаблоны",
    modules: [
      "Сценарии автоматизации задач",
      "AI-ассистенты для рабочих процессов",
      "Интеграции через API и no-code",
      "Мини-проект: автоматизированный workflow",
    ],
  },
  {
    id: "ai-product-practice",
    title: "AI Product Practice",
    category: "Продуктовый трек",
    description: "От идеи до прототипа AI-продукта с понятной структурой экспериментов.",
    duration: "12 недель",
    lessons: "36 уроков",
    level: "Middle",
    format: "Кейсы + проект",
    modules: [
      "Формулировка product-value для AI",
      "Сборка MVP и тестирование гипотез",
      "Метрики качества AI-функций",
      "Итоговый проект: AI-feature в продукте",
    ],
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    category: "Специализация",
    description: "Глубокая работа с промптами: структуры, многошаговые цепочки, контроль результата.",
    duration: "6 недель",
    lessons: "18 уроков",
    level: "Новичок - Middle",
    format: "Интенсив",
    modules: [
      "Продвинутые техники промптинга",
      "Цепочки и роли для устойчивых ответов",
      "Промпт-аудит и тестовые наборы",
      "Проект: библиотека промптов под задачи",
    ],
  },
  {
    id: "ai-data-analysis",
    title: "AI Data Analysis",
    category: "Аналитика",
    description: "Использование AI в аналитике данных: от очистки до интерпретации результатов.",
    duration: "9 недель",
    lessons: "28 уроков",
    level: "Middle",
    format: "SQL + Python + AI",
    modules: [
      "AI для подготовки датасетов",
      "Генерация аналитических гипотез",
      "Автоматизация отчетов и визуализаций",
      "Кейс: аналитика продукта с AI",
    ],
  },
  {
    id: "ai-marketing-lab",
    title: "AI Marketing Lab",
    category: "Маркетинг",
    description: "Генерация контента, сегментация и тестирование гипотез в маркетинговых кампаниях.",
    duration: "7 недель",
    lessons: "22 уроков",
    level: "Новичок - Middle",
    format: "Практика + шаблоны",
    modules: [
      "AI-контент и креативные пайплайны",
      "Сегментация и персонализация",
      "A/B тесты с AI-подсказками",
      "Проект: кампания под целевую аудиторию",
    ],
  },
  {
    id: "ai-code-assist",
    title: "AI Code Assist",
    category: "Разработка",
    description: "Как использовать AI в разработке: архитектура, рефакторинг, автотесты и документация.",
    duration: "11 недель",
    lessons: "34 уроков",
    level: "Middle",
    format: "Код + ревью",
    modules: [
      "AI-помощь при проектировании решений",
      "Генерация и проверка тестов",
      "Рефакторинг и код-ревью с AI",
      "Итоговый проект: production-ready модуль",
    ],
  },
  {
    id: "ai-design-systems",
    title: "AI in Design Systems",
    category: "Дизайн",
    description: "Применение AI для UX-исследований, генерации вариантов и поддержки дизайн-систем.",
    duration: "8 недель",
    lessons: "25 уроков",
    level: "Новичок - Middle",
    format: "UX + UI + AI",
    modules: [
      "AI в UX-исследованиях и интервью",
      "Генерация и оценка интерфейсных решений",
      "Поддержка дизайн-систем и контента",
      "Проект: редизайн фичи с AI-поддержкой",
    ],
  },
  {
    id: "ai-ops-monitoring",
    title: "AI Ops Monitoring",
    category: "Операционные процессы",
    description: "Настройка мониторинга AI-систем, контроль качества и эксплуатация в продакшене.",
    duration: "10 недель",
    lessons: "29 уроков",
    level: "Middle - Advanced",
    format: "Практика + кейсы",
    modules: [
      "Наблюдаемость AI-сервисов",
      "Логи, алерты, деградация качества",
      "Политики безопасности и контроль рисков",
      "Итог: roadmap поддержки AI-продукта",
    ],
  },
];

const aiFundamentalsDemoLessonMarkdown = `
## Как писать промпты для AI-курса

В этом уроке вы поймете, как формулировать задачу для модели, чтобы получать структурированный и проверяемый результат.

### Пример промпта

~~~python
course_topic = "AI для продакт-менеджеров"

prompt = f"""
Роль: методист онлайн-курса
Задача: составить 3 практических задания по теме {course_topic}
Формат ответа: markdown-таблица + краткие пояснения
"""
~~~

### Чеклист качества ответа

| Критерий | Что проверяем | Баллы |
| --- | --- | --- |
| Релевантность | Ответ соответствует теме и целям урока | 0-2 |
| Структура | Есть шаги, примеры и критерии проверки | 0-2 |
| Практичность | Задания можно выполнить за 30-40 минут | 0-2 |

Полезная ссылка: [OpenAI Prompting Guide](https://platform.openai.com/docs/guides/prompt-engineering)
`;

const aiFundamentalsDemoPracticeMarkdown = `
## Практика: mini AI-review

1. Выберите один ответ модели из прошлого урока.
2. Оцените его по чеклисту из трех критериев.
3. Перепишите промпт так, чтобы улучшить результат.

### Что сдать

- Исходный и улучшенный промпт
- Сравнение двух ответов модели
- Краткий вывод (3-5 предложений)
`;

const coursesData = coursesCatalog.map((course) => ({
  ...course,
  blocks: course.modules.map((moduleTitle, index) => ({
    id: `${course.id}-block-${index + 1}`,
    title: moduleTitle,
    duration: `${2 + index} недели`,
    lessons: [
      {
        id: `${course.id}-block-${index + 1}-lesson-1`,
        title: `Урок ${index + 1}.1: Введение в тему блока`,
        duration: "20 минут'",
        summary: "Ключевые понятия, словарь и контекст темы.",
        content: "Разберете основу темы, структуру дальнейшего блока и точки контроля понимания.",
        markdown: course.id === "ai-fundamentals" && index === 0 ? aiFundamentalsDemoLessonMarkdown : "",
      },
      {
        id: `${course.id}-block-${index + 1}-lesson-2`,
        title: `Урок ${index + 1}.2: Основные подходы и инструменты`,
        duration: "28 минут",
        summary: "Инструменты, паттерны и базовые рабочие сценарии.",
        content: "Поймете, какие методы применять и как выбрать оптимальный инструмент под задачу.",
      },
      {
        id: `${course.id}-block-${index + 1}-lesson-3`,
        title: `Урок ${index + 1}.3: Практический разбор кейса`,
        duration: "32 минуты",
        summary: "Реальный кейс: от постановки задачи до результата.",
        content: "Пройдете полный сценарий применения навыка на практическом примере.",
      },
      {
        id: `${course.id}-block-${index + 1}-lesson-4`,
        title: `Урок ${index + 1}.4: Ошибки и чеклист качества`,
        duration: "18 минут",
        summary: "Типичные ошибки и критерии качественного результата.",
        content: "Научитесь быстро проверять себя по чеклисту перед финальной сдачей практики.",
      },
    ],
    practice: [
      {
        id: `${course.id}-block-${index + 1}-practice-1`,
        title: `Практика ${index + 1}.1: мини-задание по теме «${moduleTitle}»`,
        duration: "35 минут",
        brief: "Выполните короткую практику на применение ключевой техники из уроков блока.",
        result: "Краткий отчёт + скриншоты/артефакты решения.",
        markdown: course.id === "ai-fundamentals" && index === 0 ? aiFundamentalsDemoPracticeMarkdown : "",
      },
      {
        id: `${course.id}-block-${index + 1}-practice-2`,
        title: `Практика ${index + 1}.2: самостоятельный кейс с проверкой`,
        duration: "55 минут",
        brief: "Решите кейс целиком: постановка задачи, применение инструмента, проверка качества.",
        result: "Готовый кейс с выводами и чеклистом самопроверки.",
      },
    ],
  })),
}));

const profileInfo = {
  name: "Екатерина Смирнова",
  role: "Студент AI Course Lab",
  plan: "Pro",
  progress: "41%",
  hours: "86 ч",
  streak: "12 дней",
};

const subscriptionPlans = [
  {
    id: "start",
    title: "Start",
    description: "Для знакомства с платформой и базового обучения по ИИ.",
    monthPrice: 0,
    yearPrice: 0,
    badge: "Бесплатно",
    features: [
      "Доступ к 2 курсам из каталога",
      "До 5 генераций учебного плана в месяц",
      "Базовые практики и трекинг прогресса",
    ],
  },
  {
    id: "plus",
    title: "Plus",
    description: "Оптимальный тариф для стабильного обучения и практики.",
    monthPrice: 2490,
    yearPrice: 1990,
    badge: "Популярно",
    features: [
      "Полный каталог курсов и модулей",
      "Безлимит генераций персональных треков",
      "Приоритетные обновления контента",
      "Расширенная аналитика прогресса",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    description: "Для интенсивного темпа, глубоких кейсов и портфолио-проектов.",
    monthPrice: 4990,
    yearPrice: 4190,
    badge: "Для роста",
    features: [
      "Все возможности Plus",
      "Продвинутые практики и разборы кейсов",
      "Индивидуальные AI-шаблоны под задачи",
      "Ранний доступ к новым трекам",
    ],
  },
];

const profileTabItems = [
  { id: "overview", label: "Профиль" },
  { id: "active-course", label: "Активный курс" },
  { id: "catalog", label: "Каталог курсов" },
  { id: "access", label: "Тариф и доступ" },
  { id: "teacher", label: "Преподаватель" },
];

const courseMaterialLibrary = [
  {
    id: "kb-prompts",
    title: "Библиотека промптов для обучения",
    type: "Шаблоны",
    volume: "42 шаблона",
    tags: ["prompt", "методика", "практика"],
  },
  {
    id: "kb-cases",
    title: "Кейсы внедрения ИИ в бизнес-процессы",
    type: "Кейсы",
    volume: "18 кейсов",
    tags: ["кейсы", "автоматизация", "бизнес"],
  },
  {
    id: "kb-analytics",
    title: "Набор датасетов для AI-анализов",
    type: "Данные",
    volume: "12 датасетов",
    tags: ["данные", "аналитика", "python"],
  },
  {
    id: "kb-checklists",
    title: "Чеклисты проверки качества AI-ответов",
    type: "Методички",
    volume: "27 чеклистов",
    tags: ["qa", "валидация", "качество"],
  },
  {
    id: "kb-ui",
    title: "UI-паттерны для AI-функций в продукте",
    type: "Дизайн",
    volume: "33 паттерна",
    tags: ["ux", "ui", "product"],
  },
  {
    id: "kb-scripts",
    title: "Скрипты автоматизации учебных задач",
    type: "Скрипты",
    volume: "24 скрипта",
    tags: ["automation", "python", "workflow"],
  },
];

const defaultCourseLeaderboard = [
  { id: "lb-1", name: "Анна Петрова", progress: 78, pace: "7 уроков/нед" },
  { id: "lb-2", name: "Игорь Левин", progress: 66, pace: "6 уроков/нед" },
  { id: "lb-3", name: "София Ким", progress: 59, pace: "5 уроков/нед" },
  { id: "lb-4", name: "Никита Орлов", progress: 47, pace: "4 урока/нед" },
  { id: "lb-5", name: "Мария Руднева", progress: 38, pace: "3 урока/нед" },
];

const courseLeaderboardMocks = {
  "ai-fundamentals": [
    { id: "f-1", name: "Алина Сафина", progress: 84, pace: "8 уроков/нед" },
    { id: "f-2", name: "Максим Воронов", progress: 71, pace: "6 уроков/нед" },
    { id: "f-3", name: "Дина Закирова", progress: 63, pace: "5 уроков/нед" },
    { id: "f-4", name: "Кирилл Миронов", progress: 52, pace: "4 урока/нед" },
  ],
  "ai-data-analysis": [
    { id: "d-1", name: "Егор Платонов", progress: 88, pace: "9 уроков/нед" },
    { id: "d-2", name: "Лилия Жданова", progress: 73, pace: "6 уроков/нед" },
    { id: "d-3", name: "Олег Маркин", progress: 67, pace: "5 уроков/нед" },
    { id: "d-4", name: "Полина Кравец", progress: 54, pace: "4 урока/нед" },
  ],
  "ai-code-assist": [
    { id: "c-1", name: "Тимур Белый", progress: 81, pace: "8 уроков/нед" },
    { id: "c-2", name: "Виктория Лосева", progress: 69, pace: "6 уроков/нед" },
    { id: "c-3", name: "Артем Ларионов", progress: 60, pace: "5 уроков/нед" },
    { id: "c-4", name: "Елена Гордеева", progress: 46, pace: "4 урока/нед" },
  ],
};

const creatorLevelOptions = ["Новичок", "Новичок - Middle", "Middle", "Middle - Advanced"];
const creatorDurationOptions = ["6 недель", "8 недель", "10 недель", "12 недель"];
const creatorFormatOptions = ["Видео + практика", "Практика + кейсы", "Интенсив + воркшоп", "Проектный трек"];

function CreatorDropdown({ label, value, options, isOpen, onToggle, onSelect, menuDirection = "down" }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onToggle]);

  return (
    <div className="creator-field creator-dropdown" ref={dropdownRef}>
      <span>{label}</span>
      <button
        type="button"
        className={`creator-select-btn ${isOpen ? "is-open" : ""}`}
        onClick={() => onToggle(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{value}</span>
        <span className="creator-select-caret" aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          className={`creator-select-menu ${menuDirection === "up" ? "is-up" : ""}`}
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`creator-select-option ${option === value ? "is-active" : ""}`}
              onClick={() => {
                onSelect(option);
                onToggle(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("light");
  const [activeView, setActiveView] = useState("home");
  const [selectedCourseId, setSelectedCourseId] = useState(coursesData[0].id);
  const [selectedBlockId, setSelectedBlockId] = useState(coursesData[0].blocks[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState(coursesData[0].blocks[0].lessons[0].id);
  const [selectedPracticeId, setSelectedPracticeId] = useState(coursesData[0].blocks[0].practice[0].id);
  const [isLessonPracticeOpen, setIsLessonPracticeOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState("month");
  const [selectedPlanId, setSelectedPlanId] = useState("plus");
  const [activeProfileTab, setActiveProfileTab] = useState("overview");
  const [draftCourseTitle, setDraftCourseTitle] = useState("");
  const [draftCourseGoal, setDraftCourseGoal] = useState("");
  const [draftCourseLevel, setDraftCourseLevel] = useState("Новичок");
  const [draftCourseDuration, setDraftCourseDuration] = useState("8 недель");
  const [draftCourseFormat, setDraftCourseFormat] = useState("Видео + практика");
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
        { id: "student-1", name: "Анна Петрова", progress: 62, lessonsDone: 15 },
        { id: "student-2", name: "Игорь Левин", progress: 48, lessonsDone: 11 },
        { id: "student-3", name: "София Ким", progress: 39, lessonsDone: 9 },
      ],
    },
  ]);
  const [activeTeacherGroupId, setActiveTeacherGroupId] = useState("group-demo-1");
  const [teacherGroupName, setTeacherGroupName] = useState("Новый поток");
  const [teacherCourseId, setTeacherCourseId] = useState(coursesData[0].id);
  const [teacherStudentName, setTeacherStudentName] = useState("");
  const knowledgeFileInputRef = useRef(null);
  const creatorFormCardRef = useRef(null);
  const [creatorFormCardHeight, setCreatorFormCardHeight] = useState(0);
  const [isWideCreatorLayout, setIsWideCreatorLayout] = useState(() => window.innerWidth > 1100);

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

  const selectedCourse = coursesData.find((course) => course.id === selectedCourseId) || coursesData[0];
  const selectedBlock =
    selectedCourse.blocks.find((block) => block.id === selectedBlockId) || selectedCourse.blocks[0];
  const selectedLesson =
    selectedBlock.lessons.find((lesson) => lesson.id === selectedLessonId) || selectedBlock.lessons[0];
  const selectedPractice =
    selectedBlock.practice.find((practice) => practice.id === selectedPracticeId) || selectedBlock.practice[0];
  const lessonSequence = selectedCourse.blocks.flatMap((block) =>
    block.lessons.map((lesson) => ({
      blockId: block.id,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    }))
  );
  const currentLessonIndex = lessonSequence.findIndex((item) => item.lessonId === selectedLesson.id);
  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson = currentLessonIndex >= 0 && currentLessonIndex < lessonSequence.length - 1;

  const completedLessonsInBlock = selectedBlock.lessons.filter((lesson) => completedLessons[lesson.id]).length;
  const completedPracticesInBlock = selectedBlock.practice.filter((practice) => completedPractices[practice.id]).length;
  const totalItemsInBlock = selectedBlock.lessons.length + selectedBlock.practice.length;
  const completedInBlock = completedLessonsInBlock + completedPracticesInBlock;
  const blockProgressPercent = Math.round((completedInBlock / totalItemsInBlock) * 100);
  const totalLessonsCount = coursesData.reduce(
    (total, course) => total + course.blocks.reduce((sum, block) => sum + block.lessons.length, 0),
    0
  );
  const totalPracticesCount = coursesData.reduce(
    (total, course) => total + course.blocks.reduce((sum, block) => sum + block.practice.length, 0),
    0
  );
  const completedLessonsCount = Object.values(completedLessons).filter(Boolean).length;
  const completedPracticesCount = Object.values(completedPractices).filter(Boolean).length;
  const overallProgressPercent = Math.round(
    ((completedLessonsCount + completedPracticesCount) / (totalLessonsCount + totalPracticesCount)) * 100
  );
  const profileActiveCourse = selectedCourse || coursesData[0];
  const profileActiveCourseTotal = profileActiveCourse.blocks.reduce(
    (total, block) => total + block.lessons.length + block.practice.length,
    0
  );
  const profileActiveCourseCompleted = profileActiveCourse.blocks.reduce(
    (total, block) =>
      total +
      block.lessons.filter((lesson) => completedLessons[lesson.id]).length +
      block.practice.filter((practice) => completedPractices[practice.id]).length,
    0
  );
  const profileActiveCourseProgress = Math.round(
    (profileActiveCourseCompleted / Math.max(1, profileActiveCourseTotal)) * 100
  );
  const selectedCourseLeaderboard = (courseLeaderboardMocks[selectedCourse.id] || defaultCourseLeaderboard)
    .slice()
    .sort((a, b) => b.progress - a.progress);
  const profileUpcomingTopics = profileActiveCourse.blocks.slice(0, 3).map((block) => block.title);
  const filteredLibraryItems = courseMaterialLibrary.filter((item) => {
    const search = librarySearch.trim().toLowerCase();
    if (!search) {
      return true;
    }
    const haystack = `${item.title} ${item.type} ${item.tags.join(" ")}`.toLowerCase();
    return haystack.includes(search);
  });
  const attachedLibraryItems = courseMaterialLibrary.filter((item) => attachedMaterialIds.includes(item.id));
  const canGenerateDraft = draftCourseTitle.trim().length > 2;
  const activeTeacherGroup = teacherGroups.find((group) => group.id === activeTeacherGroupId) || teacherGroups[0] || null;
  const activeTeacherCourse =
    coursesData.find((course) => course.id === (activeTeacherGroup?.courseId || teacherCourseId)) || coursesData[0];
  const teacherLeaderboard = activeTeacherGroup
    ? [...activeTeacherGroup.students].sort(
        (a, b) => b.progress - a.progress || b.lessonsDone - a.lessonsDone || a.name.localeCompare(b.name)
      )
    : [];

  const openHome = () => {
    setActiveView("home");
  };

  const openCourses = () => {
    setActiveView("courses");
  };

  const openCreator = () => {
    setActiveView("creator");
  };

  const openSubscriptions = () => {
    setActiveView("subscriptions");
  };

  const selectPlan = (planId) => {
    setSelectedPlanId(planId);
  };

  const openCourse = (courseId) => {
    const nextCourse = coursesData.find((course) => course.id === courseId) || coursesData[0];
    setSelectedCourseId(nextCourse.id);
    setSelectedBlockId(nextCourse.blocks[0].id);
    setSelectedLessonId(nextCourse.blocks[0].lessons[0].id);
    setSelectedPracticeId(nextCourse.blocks[0].practice[0].id);
    setIsLessonPracticeOpen(false);
    setActiveView("course");
  };

  const openBlock = (blockId) => {
    const nextBlock = selectedCourse.blocks.find((block) => block.id === blockId) || selectedCourse.blocks[0];
    setSelectedBlockId(nextBlock.id);
    setSelectedLessonId(nextBlock.lessons[0].id);
    setSelectedPracticeId(nextBlock.practice[0].id);
    setIsLessonPracticeOpen(false);
    setActiveView("block");
  };

  const openLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setIsLessonPracticeOpen(false);
    setActiveView("lesson");
  };

  const openLessonBySequenceIndex = (index) => {
    const target = lessonSequence[index];
    if (!target) {
      return;
    }

    setSelectedBlockId(target.blockId);
    setSelectedLessonId(target.lessonId);
    setIsLessonPracticeOpen(false);
    setActiveView("lesson");
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
    setActiveView("practice");
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

  const openProfile = () => {
    setActiveView("profile");
    setActiveProfileTab("overview");
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
        group.id === activeTeacherGroup.id ? { ...group, students: [...group.students, nextStudent] } : group
      )
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

            const nextProgress = Math.max(0, Math.min(100, student.progress + delta));
            const nextLessonsDone = Math.max(0, student.lessonsDone + (delta > 0 ? 1 : delta < 0 ? -1 : 0));
            return { ...student, progress: nextProgress, lessonsDone: nextLessonsDone };
          }),
        };
      })
    );
  };

  const simulateStudyTick = (studentId) => {
    const delta = Math.floor(Math.random() * 8) + 3;
    adjustStudentProgress(studentId, delta);
  };

  const toggleMaterialAttach = (materialId) => {
    setAttachedMaterialIds((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId]
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
      draftCourseGoal.trim() || "Системно освоить тему и закрепить навыки на практических сценариях.";
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

  const openHomeSection = (id) => {
    setActiveView("home");
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
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
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
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

      <header className="container header">
        <button type="button" className="logo logo-button" onClick={openHome}>
          <span className="logo-main">AI Course Lab</span>
          <span className="logo-sub">education platform</span>
        </button>

        <nav className="nav">
          <button
            type="button"
            className={`nav-link ${activeView === "courses" || activeView === "course" || activeView === "block" || activeView === "lesson" || activeView === "practice" ? "is-active" : ""}`}
            onClick={openCourses}
          >
            Курс
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === "creator" ? "is-active" : ""}`}
            onClick={openCreator}
          >
            Создание курса
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === "subscriptions" ? "is-active" : ""}`}
            onClick={openSubscriptions}
          >
            Подписки
          </button>
          <button type="button" className="nav-link" onClick={() => openHomeSection("flow")}>
            Механика
          </button>
          <button type="button" className="nav-link" onClick={() => openHomeSection("about")}>
            Преимущества
          </button>
          <button type="button" className="nav-link" onClick={() => openHomeSection("cta")}>
            Старт
          </button>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className={`profile-chip glass-card ${activeView === "profile" ? "is-active" : ""}`}
            onClick={openProfile}
          >
            <span className="profile-avatar">ЕС</span>
            <span className="profile-label">Профиль</span>
          </button>
          <button
            type="button"
            className="theme-toggle glass-card"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Переключить на светлую тему" : "Переключить на темную тему"}
            title={theme === "dark" ? "Переключить на светлую тему" : "Переключить на темную тему"}
          >
            <span className="theme-toggle-label">Тема</span>
            <span className="theme-toggle-value">{theme === "dark" ? "Темная" : "Светлая"}</span>
          </button>
        </div>
      </header>

      <main>
        {activeView === "home" && (
          <>
            <section className="container hero">
              <div className="hero-grid">
                <div className="hero-left glass-card">
                  <p className="kicker">ИИ-КУРСЫ НОВОГО ФОРМАТА</p>
                  <h1>Генерируйте курсы по ИИ и смежным темам под свой уровень</h1>
                  <p className="lead">
                    Платформа создаёт курс за несколько минут: темы, модули, практика и контроль
                    прогресса. Вы получаете рабочую программу обучения без перегруза и хаоса.
                  </p>
                  <div className="hero-actions">
                    <button type="button" className="btn btn-solid" onClick={openCreator}>
                      Сгенерировать курс
                    </button>
                    <button type="button" className="btn btn-flat" onClick={openCourses}>
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
              <div className="section-top">
                <span>01</span>
                <h2>Что вы получаете в AI Course Lab</h2>
              </div>
              <div className="point-list">
                {points.map((item) => (
                  <article key={item} className="glass-card">
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="container section" id="tracks">
              <div className="section-top">
                <span>02</span>
                <h2>Каталог ИИ-курсов</h2>
              </div>

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
              <div className="section-top">
                <span>03</span>
                <h2>Как генерируется ваш ИИ-курс</h2>
              </div>

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
        )}

        {activeView === "courses" && (
          <section className="container section courses-tab" id="courses-tab">
            <div className="section-top">
              <span>Курс</span>
              <h2>Каталог программ обучения</h2>
            </div>
            <div className="courses-catalog-grid">
              {coursesData.map((course) => {
                const courseTotalItems = course.blocks.reduce(
                  (total, block) => total + block.lessons.length + block.practice.length,
                  0
                );
                const courseCompletedItems = course.blocks.reduce(
                  (total, block) =>
                    total +
                    block.lessons.filter((lesson) => completedLessons[lesson.id]).length +
                    block.practice.filter((practice) => completedPractices[practice.id]).length,
                  0
                );
                const courseProgress = Math.round((courseCompletedItems / Math.max(1, courseTotalItems)) * 100);

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
        )}

        {activeView === "creator" && (
          <section className="container section creator-view" id="creator-tab">
            <div className="section-top">
              <span>Создание</span>

              <h2>Создание курса</h2>
            </div>

            <CreatorChatView />
          </section>
        )}

        {activeView === "subscriptions" && (
          <section className="container section subscriptions-view" id="subscriptions-tab">
            <div className="section-top">
              <span>Тарифы</span>
              
              <h2>Выберите подписку</h2>
            </div>

            <div className="billing-switch glass-card">
              <button
                type="button"
                className={`billing-option ${billingPeriod === "month" ? "is-active" : ""}`}
                onClick={() => setBillingPeriod("month")}
              >
                Помесячно
              </button>
              <button
                type="button"
                className={`billing-option ${billingPeriod === "year" ? "is-active" : ""}`}
                onClick={() => setBillingPeriod("year")}
              >
                За год
                <span>-20%</span>
              </button>
            </div>

            <div className="subscription-grid">
              {subscriptionPlans.map((plan) => {
                const price = billingPeriod === "month" ? plan.monthPrice : plan.yearPrice;
                const periodLabel = billingPeriod === "month" ? "мес" : "мес при оплате за год";
                const isSelected = selectedPlanId === plan.id;

                return (
                  <article key={plan.id} className={`subscription-card glass-card ${isSelected ? "is-selected" : ""}`}>
                    <div className="subscription-top">
                      <span className="subscription-badge">{plan.badge}</span>
                      <h3>{plan.title}</h3>
                    </div>
                    <p className="subscription-description">{plan.description}</p>
                    <p className="subscription-price">
                      {price === 0 ? "0 ₽" : `${price.toLocaleString("ru-RU")} ₽`}
                      <span> / {periodLabel}</span>
                    </p>
                    <ul className="subscription-features">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`btn mark-complete-btn ${isSelected ? "btn-outline" : "btn-solid"}`}
                      onClick={() => selectPlan(plan.id)}
                    >
                      {isSelected ? "Выбрано" : "Выбрать подписку"}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeView === "course" && (
          <section className="container section course-details-view">
            <div className="section-top">
              <span>Курс</span>
              <h2>{selectedCourse.title}</h2>
            </div>
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
                    const doneLessons = block.lessons.filter((lesson) => completedLessons[lesson.id]).length;
                    const donePractices = block.practice.filter((practice) => completedPractices[practice.id]).length;
                    const doneItems = doneLessons + donePractices;
                    const totalItems = block.lessons.length + block.practice.length;
                    return (
                      <li key={block.id}>
                        <button
                          type="button"
                          className="course-block-item"
                          onClick={() => openBlock(block.id)}
                        >
                          <span className="course-block-index">{String(index + 1).padStart(2, "0")}</span>
                          <span className="course-block-title">{block.title}</span>
                          <span className="course-block-meta">
                            {block.duration} • {block.lessons.length} урока • {block.practice.length} практики
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
                      <span className="course-leaderboard-score">{student.progress}%</span>
                    </li>
                  ))}
                </ol>
              </article>
            </div>
          </section>
        )}

        {activeView === "block" && (
          <section className="container section block-view">
            <div className="section-top">
              <span>Блок</span>
              <h2>{selectedBlock.title}</h2>
            </div>
            <button
              type="button"
              className="btn btn-outline back-btn"
              onClick={() => setActiveView("course")}
              aria-label="Назад к курсу"
              title="Назад к курсу"
            >
              &lt;
            </button>
            <div className="block-view-grid">
              <article className="glass-card block-main-card">
                <p className="course-category">{selectedCourse.title}</p>
                <p className="course-details-text">
                  Детальный блок курса с уроками и практикой. Используйте этот экран как тестовые
                  данные для сценариев проваливания в контент.
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
                        <span className="lesson-progress-meta">{lesson.duration}</span>
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
                        <span className="practice-progress-meta">{task.duration}</span>
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
        )}

        {activeView === "lesson" && (
          <section className="container section lesson-view">
            <div className="section-top">
              <span>Урок</span>
              <h2>{selectedLesson.title}</h2>
            </div>
            <button
              type="button"
              className="btn btn-outline back-btn"
              onClick={() => setActiveView("block")}
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedLesson.markdown}</ReactMarkdown>
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
                    {completedLessons[selectedLesson.id] ? "Снять отметку" : "Отметить пройдено"}
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
                    <span>{isLessonPracticeOpen ? "Свернуть" : `${selectedBlock.practice.length} задания`}</span>
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
                              <span>{completedPractices[task.id] ? "Выполнено" : "Открыть"}</span>
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
        )}

        {activeView === "practice" && (
          <section className="container section practice-view">
            <div className="section-top">
              <span>Практика</span>
              <h2>{selectedPractice.title}</h2>
            </div>
            <button
              type="button"
              className="btn btn-outline back-btn"
              onClick={() => setActiveView("block")}
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedPractice.markdown}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="lesson-content">Результат: {selectedPractice.result}</p>
                )}
                <div className="lesson-controls">
                  <span className="lesson-time">{selectedPractice.duration}</span>
                  <button
                    type="button"
                    className={`btn mark-complete-btn ${completedPractices[selectedPractice.id] ? "btn-outline" : "btn-solid"}`}
                    onClick={() => togglePracticeComplete(selectedPractice.id)}
                  >
                    {completedPractices[selectedPractice.id] ? "Снять выполнение" : "Отметить выполнено"}
                  </button>
                </div>
                              </article>
            </div>
          </section>
        )}

        {activeView === "profile" && (
          <section className="container section profile-view">
            <div className="section-top">
              <span>Профиль</span>
              <h2>Личный кабинет</h2>
            </div>
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
                {(activeProfileTab === "overview" || activeProfileTab === "active-course") && (
                  <article className="glass-card profile-track-card">
                    <div className="profile-track-head">
                      <div>
                        <span>Активный трек</span>
                        <h3>{profileActiveCourse.title}</h3>
                      </div>
                      <button type="button" className="btn btn-outline" onClick={() => openCourse(profileActiveCourse.id)}>
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
                        Пройдено: {profileActiveCourseCompleted}/{profileActiveCourseTotal}
                      </small>
                    </div>
                  </article>
                )}

                {activeProfileTab === "overview" && (
                  <>
                    <div className="profile-stats-grid">
                      <article className="glass-card profile-stat-card">
                        <span>Завершено</span>
                        <strong>{completedLessonsCount + completedPracticesCount}</strong>
                        <p>элементов из {totalLessonsCount + totalPracticesCount}</p>
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
                          <button type="button" className="profile-course-link" onClick={() => openBlock(block.id)}>
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
                          <button type="button" className="profile-course-link" onClick={() => openCourse(course.id)}>
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
                    <button type="button" className="btn btn-solid profile-manage-btn" onClick={openSubscriptions}>
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
                            onChange={(event) => setTeacherGroupName(event.target.value)}
                          />
                        </label>
                        <label className="teacher-field">
                          <span>Курс</span>
                          <select
                            value={teacherCourseId}
                            onChange={(event) => setTeacherCourseId(event.target.value)}
                          >
                            {coursesData.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <button type="button" className="btn btn-solid" onClick={createTeacherGroup}>
                        Создать поток
                      </button>
                    </article>

                    <article className="glass-card teacher-groups-card">
                      <h3>Потоки преподавателя</h3>
                      <ul className="teacher-groups-list">
                        {teacherGroups.map((group) => {
                          const groupCourse = coursesData.find((course) => course.id === group.courseId);
                          const groupAverageProgress =
                            group.students.length === 0
                              ? 0
                              : Math.round(
                                  group.students.reduce((total, student) => total + student.progress, 0) /
                                    group.students.length
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
                                  {group.students.length} учеников • средний прогресс {groupAverageProgress}%
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
                          <p>{activeTeacherGroup ? activeTeacherGroup.name : "Сначала создайте поток"}</p>
                        </div>
                        <span className="teacher-chip">{activeTeacherCourse?.title}</span>
                      </div>

                      <div className="teacher-add-student">
                        <input
                          type="text"
                          placeholder="Имя ученика"
                          value={teacherStudentName}
                          onChange={(event) => setTeacherStudentName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              addStudentToActiveGroup();
                            }
                          }}
                        />
                        <button type="button" className="btn btn-outline" onClick={addStudentToActiveGroup}>
                          Добавить
                        </button>
                      </div>

                      {!activeTeacherGroup || activeTeacherGroup.students.length === 0 ? (
                        <p className="teacher-empty">Пока нет учеников. Добавьте первого студента в поток.</p>
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
                                  <button type="button" onClick={() => adjustStudentProgress(student.id, -5)}>
                                    -5%
                                  </button>
                                  <button type="button" onClick={() => adjustStudentProgress(student.id, 5)}>
                                    +5%
                                  </button>
                                  <button type="button" onClick={() => simulateStudyTick(student.id)}>
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
                        <p className="teacher-empty">Лидерборд появится после добавления учеников.</p>
                      ) : (
                        <ol className="teacher-leaderboard-list">
                          {teacherLeaderboard.map((student, index) => (
                            <li key={`lb-${student.id}`}>
                              <span className="teacher-rank">{index + 1}</span>
                              <div className="teacher-rank-main">
                                <strong>{student.name}</strong>
                                <small>Уроков: {student.lessonsDone}</small>
                              </div>
                              <span className="teacher-rank-score">{student.progress}%</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </article>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="container footer">
        <p>© 2026 AI Course Lab</p>
        <div>
          <a href="#">Политика</a>
          <a href="#">Контакты</a>
          <a href="#">Тарифы</a>
        </div>
      </footer>
    </div>
  );
}




