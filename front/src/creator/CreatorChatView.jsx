import { useEffect, useMemo, useRef, useState } from "react";
import "./creator-chat.css";

const intakeQuestions = [
  {
    id: "title",
    prompt: "Привет. Начнем сборку курса. Как назовем курс?",
    placeholder: "Например: AI для аналитиков продукта",
  },
  {
    id: "goal",
    prompt: "Отлично. Какая главная цель обучения для этого курса?",
    placeholder: "Чему должен научиться студент к финалу",
  },
  {
    id: "duration",
    prompt: "Какая длительность вам нужна?",
    placeholder: "Например: 8 недель",
    quickOptions: ["6 недель", "8 недель", "10 недель", "12 недель"],
  },
  {
    id: "format",
    prompt: "В каком формате строим курс?",
    placeholder: "Видео + практика / Интенсив + воркшоп / Проектный трек",
    quickOptions: ["Видео + практика", "Практика + кейсы", "Интенсив + воркшоп", "Проектный трек"],
  },
  {
    id: "level",
    prompt: "Какой уровень аудитории берем?",
    placeholder: "Новичок / Middle / Middle - Advanced",
    quickOptions: ["Новичок", "Новичок - Middle", "Middle", "Middle - Advanced"],
  },
  {
    id: "audience",
    prompt: "Кто целевая аудитория и где они будут применять этот курс?",
    placeholder: "Например: junior-аналитики в продуктовых командах",
  },
  {
    id: "materials",
    prompt:
      "Финальный шаг: укажи, какие материалы учесть. Если нужно, прикрепи их кнопкой + рядом с полем ввода.",
    placeholder: "Какие методички, кейсы или файлы нужно встроить в программу",
  },
];

const generationStages = [
  {
    progress: 16,
    wait: 92,
    status: "Анализирую цель курса и входные ограничения",
    block: {
      title: "Блок 1. Вход в тему и карта навыков",
      description: "Формируем общий контекст, базовые термины и ожидаемые результаты.",
    },
  },
  {
    progress: 30,
    wait: 77,
    status: "Подбираю структуру модулей и распределяю сложность",
    block: {
      title: "Блок 2. Базовые инструменты и практики",
      description: "Отбор ключевых инструментов и сценариев, на которых строится фундамент.",
    },
  },
  {
    progress: 45,
    wait: 63,
    status: "Собираю практические задания и критерии проверки",
    block: {
      title: "Блок 3. Практика на реальных кейсах",
      description: "Постепенный переход от шаблонных задач к самостоятельным кейсам.",
    },
  },
  {
    progress: 61,
    wait: 49,
    status: "Генерирую промежуточные точки контроля прогресса",
    block: {
      title: "Блок 4. Контроль и обратная связь",
      description: "Квиз-проверки, контрольные точки и понятная система оценки.",
    },
  },
  {
    progress: 76,
    wait: 34,
    status: "Учитываю прикрепленные методички и материалы",
    block: {
      title: "Блок 5. Модули на базе ваших материалов",
      description: "Интегрируем ваши методички, кейсы и шаблоны в учебную логику.",
    },
  },
  {
    progress: 90,
    wait: 19,
    status: "Формирую финальный трек и рекомендации по запуску",
    block: {
      title: "Блок 6. Итоговый проект и запуск",
      description: "Собираем выпускной проект и дорожную карту внедрения навыков.",
    },
  },
  {
    progress: 100,
    wait: 0,
    status: "Готово: курс собран, можно просматривать блоки",
    block: {
      title: "Финал. Курс полностью собран",
      description: "Генерация завершена. Можно открыть блоки слева и смотреть детали.",
    },
  },
];

function formatWait(seconds) {
  const safe = Math.max(0, seconds);
  const min = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

function nextId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function CreatorChatView() {
  const [messages, setMessages] = useState(() => [
    {
      id: nextId("msg"),
      role: "assistant",
      text: intakeQuestions[0].prompt,
    },
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [hasGenerationStarted, setHasGenerationStarted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("Жду ответы в чате");
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [generatedBlocks, setGeneratedBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const generationStageRef = useRef(0);

  const requiredQuestionIds = ["title", "goal", "duration", "format", "level", "audience", "materials"];
  const answeredRequiredCount = requiredQuestionIds.filter((id) => (answers[id] || "").trim().length > 0).length;
  const briefingPercent = useMemo(
    () => Math.round((answeredRequiredCount / requiredQuestionIds.length) * 100),
    [answeredRequiredCount]
  );

  const completionPercent = hasGenerationStarted ? Math.max(briefingPercent, generationProgress) : briefingPercent;
  const selectedBlock = generatedBlocks.find((block) => block.id === selectedBlockId) || generatedBlocks[0] || null;
  const currentQuestion = intakeQuestions[stepIndex] || null;
  const isMaterialsStepComplete = Boolean((answers.materials || "").trim()) || uploadedFiles.length > 0;
  const briefingComplete = requiredQuestionIds.every((id) => {
    if (id === "materials") {
      return isMaterialsStepComplete;
    }
    return (answers[id] || "").trim().length > 0;
  });

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isGenerating) {
      return undefined;
    }

    const waitTimer = window.setInterval(() => {
      setWaitSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(waitTimer);
  }, [isGenerating]);

  const pushAssistantMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId("msg"),
        role: "assistant",
        text,
      },
    ]);
  };

  const applyGenerationStage = (stageIndex) => {
    const stage = generationStages[stageIndex];
    if (!stage) {
      return;
    }

    setGenerationProgress(stage.progress);
    setGenerationStatus(stage.status);
    setWaitSeconds(stage.wait);

    setGeneratedBlocks((prev) => {
      if (prev.some((block) => block.stageIndex === stageIndex)) {
        return prev;
      }

      const newBlock = {
        id: nextId("block"),
        stageIndex,
        title: stage.block.title,
        description: stage.block.description,
        readyPercent: stage.progress,
      };
      setSelectedBlockId((current) => current || newBlock.id);
      return [...prev, newBlock];
    });

    pushAssistantMessage(`Готово: ${stage.block.title}. Сейчас ${stage.status.toLowerCase()}.`);

    if (stage.progress >= 100) {
      setIsGenerating(false);
    }
  };

  const beginGeneration = () => {
    if (hasGenerationStarted || isGenerating) {
      return;
    }

    setHasGenerationStarted(true);
    setIsGenerating(true);
    generationStageRef.current = 0;
    setGeneratedBlocks([]);
    setSelectedBlockId(null);
    applyGenerationStage(0);
  };

  useEffect(() => {
    if (!briefingComplete || hasGenerationStarted || isGenerating || isThinking) {
      return undefined;
    }

    pushAssistantMessage("Бриф собран. Запускаю генерацию курса автоматически.");
    const startTimer = window.setTimeout(() => {
      beginGeneration();
    }, 700);

    return () => window.clearTimeout(startTimer);
  }, [briefingComplete, stepIndex, hasGenerationStarted, isGenerating, isThinking]);

  useEffect(() => {
    if (!isGenerating) {
      return undefined;
    }

    const stageTimer = window.setInterval(() => {
      const nextStageIndex = generationStageRef.current + 1;
      if (nextStageIndex >= generationStages.length) {
        window.clearInterval(stageTimer);
        setIsGenerating(false);
        return;
      }

      generationStageRef.current = nextStageIndex;
      applyGenerationStage(nextStageIndex);
    }, 2200);

    return () => window.clearInterval(stageTimer);
  }, [isGenerating]);

  useEffect(() => {
    if (hasGenerationStarted && !isGenerating && generationProgress >= 100) {
      setGenerationStatus("Готово: курс собран. Можно изучать блоки слева.");
    }
  }, [hasGenerationStarted, isGenerating, generationProgress]);

  const submitMessage = () => {
    const text = inputValue.trim();
    if (!text || isThinking || isGenerating) {
      return;
    }

    const targetQuestion = intakeQuestions[stepIndex] || null;

    setMessages((prev) => [
      ...prev,
      {
        id: nextId("msg"),
        role: "user",
        text,
      },
    ]);

    if (targetQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [targetQuestion.id]: text,
      }));
    }

    setInputValue("");

    if (!targetQuestion) {
      return;
    }

    setIsThinking(true);
    window.setTimeout(() => {
      setIsThinking(false);
      const nextStep = stepIndex + 1;
      setStepIndex(nextStep);

      if (nextStep < intakeQuestions.length) {
        pushAssistantMessage(intakeQuestions[nextStep].prompt);
      } else {
        pushAssistantMessage("Принял финальные ответы. Проверяю бриф и запускаю генерацию.");
      }
    }, 460);
  };

  const applyQuickOption = (value) => {
    setInputValue(value);
  };

  const pickFiles = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    const nextFiles = files.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
    }));

    setUploadedFiles((prev) => [...nextFiles, ...prev]);
    setAnswers((prev) => ({
      ...prev,
      materials: prev.materials && prev.materials.trim().length > 0 ? prev.materials : "Файлы прикреплены",
    }));
    event.target.value = "";
  };

  const clearChat = () => {
    setMessages([
      {
        id: nextId("msg"),
        role: "assistant",
        text: intakeQuestions[0].prompt,
      },
    ]);
    setStepIndex(0);
    setAnswers({});
    setInputValue("");
    setUploadedFiles([]);
    setIsThinking(false);
    setHasGenerationStarted(false);
    setIsGenerating(false);
    setGenerationProgress(0);
    setGenerationStatus("Жду ответы в чате");
    setWaitSeconds(0);
    setGeneratedBlocks([]);
    setSelectedBlockId(null);
    generationStageRef.current = 0;
  };

  const checklist = [
    { label: "Название курса", done: Boolean((answers.title || "").trim()) },
    { label: "Цель обучения", done: Boolean((answers.goal || "").trim()) },
    { label: "Длительность", done: Boolean((answers.duration || "").trim()) },
    { label: "Формат", done: Boolean((answers.format || "").trim()) },
    { label: "Уровень", done: Boolean((answers.level || "").trim()) },
    { label: "Целевая аудитория", done: Boolean((answers.audience || "").trim()) },
    { label: "Материалы", done: isMaterialsStepComplete },
  ];

  return (
    <section className="creator-chat-shell">
      {hasGenerationStarted && (
        <article className="creator-chat-topbar">
          <div className="creator-chat-top-main">
            <span>Создание курса</span>
            <h3>ИИ собирает структуру программы</h3>
            <p>{generationStatus}</p>
          </div>

          <div className="creator-chat-top-stats">
            <div>
              <span>Готовность</span>
              <strong>{completionPercent}%</strong>
            </div>
            <div>
              <span>Осталось</span>
              <strong>{formatWait(waitSeconds)}</strong>
            </div>
            <div>
              <span>Блоков собрано</span>
              <strong>{generatedBlocks.length}</strong>
            </div>
          </div>

          <div className="creator-chat-top-track">
            <div style={{ width: `${completionPercent}%` }} />
          </div>
        </article>
      )}

      <div className={`creator-chat-layout ${hasGenerationStarted ? "is-generating" : "is-briefing"}`}>
        {hasGenerationStarted && (
          <aside className="creator-chat-left">
            <div className="glass-card creator-chat-left-card">
              <div className="creator-chat-left-head">
                <h4>Блоки курса</h4>
                <span>{generatedBlocks.length} создано</span>
              </div>

              <ul className="creator-chat-block-list">
                {generatedBlocks.map((block, index) => (
                  <li key={block.id}>
                    <button
                      type="button"
                      className={`creator-chat-block-btn ${block.id === selectedBlock?.id ? "is-active" : ""}`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{block.title}</strong>
                      <small>{block.readyPercent}% готовности</small>
                    </button>
                  </li>
                ))}
              </ul>

              {selectedBlock && (
                <article className="creator-chat-block-preview">
                  <h5>{selectedBlock.title}</h5>
                  <p>{selectedBlock.description}</p>
                </article>
              )}
            </div>
          </aside>
        )}

        <article className="glass-card creator-chat-main">
          <div className="creator-chat-main-head">
            <h4>Чат-конструктор</h4>
            <span>{isGenerating ? "ИИ работает..." : "Диалог активен"}</span>
          </div>

          <div className="creator-chat-messages" ref={messagesContainerRef}>
            {messages.map((message) => (
              <div key={message.id} className={`creator-chat-msg ${message.role === "user" ? "is-user" : "is-assistant"}`}>
                <p>{message.text}</p>
              </div>
            ))}

            {isThinking && (
              <div className="creator-chat-msg is-assistant is-thinking">
                <p>Думаю над следующим уточнением...</p>
              </div>
            )}
          </div>

          {currentQuestion?.quickOptions && !isGenerating && (
            <div className="creator-chat-quick-options">
              {currentQuestion.quickOptions.map((option) => (
                <button key={option} type="button" onClick={() => applyQuickOption(option)}>
                  {option}
                </button>
              ))}
            </div>
          )}

          <div className="creator-chat-composer-wrap">
            <input ref={fileInputRef} type="file" className="knowledge-file-input" multiple onChange={pickFiles} />
            <div className="creator-chat-composer">
              <button
                type="button"
                className="creator-chat-plus"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                title="Загрузить файл"
                aria-label="Загрузить файл"
              >
                +
              </button>

              <textarea
                placeholder={currentQuestion?.placeholder || "Напишите сообщение для ИИ"}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.nativeEvent.isComposing) {
                    return;
                  }

                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage();
                  }
                }}
                disabled={isGenerating}
              />

              <button
                type="button"
                className="btn btn-solid creator-chat-send-btn"
                onClick={submitMessage}
                disabled={isGenerating || !inputValue.trim()}
              >
                Отправить
              </button>
            </div>

            {uploadedFiles.length > 0 && (
              <ul className="knowledge-files-list">
                {uploadedFiles.map((file) => (
                  <li key={file.id}>
                    {file.name} • {file.sizeKb} КБ
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="creator-chat-actions">
            <span>
              Файлов прикреплено: {uploadedFiles.length} • Enter для отправки, Shift + Enter для новой строки
            </span>
            <button type="button" className="btn btn-outline" onClick={clearChat}>
              Очистить чат
            </button>
          </div>
        </article>

        {!hasGenerationStarted && (
          <aside className="glass-card creator-chat-right">
            <h4>Статус создания</h4>
            <ul className="creator-chat-checklist">
              {checklist.map((item) => (
                <li key={item.label} className={item.done ? "is-done" : ""}>
                  <span>{item.done ? "✓" : "•"}</span>
                  <p>{item.label}</p>
                </li>
              ))}
            </ul>

            <div className="creator-chat-runtime">
              <h5>Заполненность брифа</h5>
              <p>{generationStatus}</p>
              <div className="creator-chat-runtime-bar">
                <div style={{ width: `${briefingPercent}%` }} />
              </div>
              <small>{briefingPercent}% заполнено</small>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
