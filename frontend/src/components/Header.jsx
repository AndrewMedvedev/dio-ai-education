// Шапка приложения и навигация по маршрутам
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Header({ theme, toggleTheme, openHomeSection }) {
  const location = useLocation();
  const isCoursePath =
    location.pathname.startsWith("/course") || location.pathname === "/courses";

  return (
    <header className="container header">
      <Link to="/" className="logo logo-button">
        <span className="logo-main">AI Course Lab</span>
        <span className="logo-sub">education platform</span>
      </Link>

      <nav className="nav">
        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `nav-link ${isCoursePath ? "is-active" : ""}`
          }
        >
          Курсы
        </NavLink>
        <NavLink
          to="/creator"
          className={({ isActive }) =>
            `nav-link ${isActive ? "is-active" : ""}`
          }
        >
          Создание курса
        </NavLink>
        <NavLink
          to="/subscriptions"
          className={({ isActive }) =>
            `nav-link ${isActive ? "is-active" : ""}`
          }
        >
          Подписки
        </NavLink>
        <button
          type="button"
          className="nav-link"
          onClick={() => openHomeSection("flow")}
        >
          Механика
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => openHomeSection("about")}
        >
          Преимущества
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => openHomeSection("cta")}
        >
          Старт
        </button>
      </nav>

      <div className="header-actions">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `profile-chip glass-card ${isActive ? "is-active" : ""}`
          }
        >
          <span className="profile-avatar">ЕС</span>
          <span className="profile-label">Профиль</span>
        </NavLink>
        <button
          type="button"
          className="theme-toggle glass-card"
          onClick={toggleTheme}
          aria-label={
            theme === "dark"
              ? "Переключить на светлую тему"
              : "Переключить на темную тему"
          }
          title={
            theme === "dark"
              ? "Переключить на светлую тему"
              : "Переключить на темную тему"
          }
        >
          <span className="theme-toggle-label">Тема</span>
          <span className="theme-toggle-value">
            {theme === "dark" ? "Темная" : "Светлая"}
          </span>
        </button>
      </div>
    </header>
  );
}
