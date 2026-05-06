// Страница тарифов и выбора подписки
import SectionTop from "../components/SectionTop";

export default function SubscriptionsPage({
  billingPeriod,
  setBillingPeriod,
  subscriptionPlans,
  selectedPlanId,
  selectPlan,
}) {
  return (
    <section
      className="container section subscriptions-view"
      id="subscriptions-tab"
    >
      <SectionTop label="Тарифы" title="Выберите подписку" />

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
          const price =
            billingPeriod === "month" ? plan.monthPrice : plan.yearPrice;
          const periodLabel =
            billingPeriod === "month" ? "мес" : "мес при оплате за год";
          const isSelected = selectedPlanId === plan.id;

          return (
            <article
              key={plan.id}
              className={`subscription-card glass-card ${isSelected ? "is-selected" : ""}`}
            >
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
  );
}
