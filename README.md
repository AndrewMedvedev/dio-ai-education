# 🎓 Образовательный AI агент

[![Python](https://img.shields.io/badge/Python-3.13%2B-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136.0%2B-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-1.0%2B-1C3C3C?logo=langchain)](https://langchain.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Beta-orange)]()
[![LLM](https://img.shields.io/badge/AI-LLM%20%7C%20RAG-purple)]()

*Генерация учебных курсов, индивидуальные задания, тестирование и AI-чат с теорией — всё в одном агенте.*

## 📖 О проекте

AI агент способен:

- автоматически создавать структурированные учебные курсы по любой теме;
- проводить **полноценное обучение**: объяснять теорию, выдавать задания и тестировать знания;
- генерировать **индивидуальные практические задания** с учётом уровня студента;
- поддерживать **диалоговый AI-чат**, который отвечает на вопросы по теории курса и разбирает ошибки.

Проект создан для перподавателей, репетиторов и учащихся, желающих получать персонализированное обучение 24/7.

---

## ✨ Основные возможности

 - 🎓 **Автономная генерация курсов** - загрузите тему, описание,   методические материалы, зкоманда агентов проведёт глубокое исследование предметной области, после чего сформирует учеьный материал.
 - 🧩 **Индивидуальные задания** - генерация уникальных задач для каждого студента, учитывая его текущий уровень, проверка решения и обратная связь.
 - 📝 **Тестирование** – создание тестов с автоматической оценкой и разбором ошибок.
 - 💬 **AI-чат с теорией** – задайте вопрос по материалу курса, агент ответит, используя базу знаний и контекст обучения.
 - 📊 **Прогресс-трекинг** – отслеживание успеваемости и адаптация программы под пробелы студента.
 - 🌐 **Телеграм бот** - простой и понятный интерфейс с применением технологии Telegram Web App (только для бета версии)

 ---

 ## 🎥 Демонстрация

 ### Основное меню курса

 ![Меню курса](assets\screenshots\course_menu.png)
 ### Меню модуля курса

 ![Меню модуля](assets\screenshots\module_menu.png)

 ### Проверка практического задания

 ![Проверка задания](assets\screenshots\practice_submission.png)

 ### Профиль студента

 ![Профиль студента](assets\screenshots\student_profile.png)

 ### Доска лидеров курса

![Доска лидеров](assets\screenshots\leaderboard.png) 

### Теоретический материал

![Теория](assets\screenshots\theory.png)

### Чат с ИИ помощником

![Чат с ИИ](assets\gifs\mini-app-inzeneriia-po-2026-04-23-17-39-12_urvaiv7q.gif)

*Агент сочетает большие языковые модели (LLM) с Retrieval-Augmented Generation (RAG), а также Deep Research для точных ответов на основе материалов курса.*

---

## 🛠 Технологический стек

| Компонент       | Технологии                          |
|-----------------|-------------------------------------|
| Язык            | Python 3.13+                        |
| AI-ядро         | OpenAI API / DeepSeek               |
| RAG | LangChain / ChromaDB |
| Backend         | FastAPI / SQLAlchemy / Aiogram                    |
| Frontend        | Telegram Web App / JS / Tailwind     |
| База данных     | PostgreSQL / ChromaDB                 |
| Деплой          | Docker, Docker Compose               |

---


## ⚙️ Установка проекта

```bash
git clone https://github.com/Andr171p/education-ai.git
```

Добавление .env по шаблону .env.example

```
cd education-ai
nano .env
```

Запуск проекта

```bash
docker-compose up -d
```
