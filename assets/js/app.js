(() => {
  const course = window.COURSE;
  const lessonContent = window.LESSON_CONTENT || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (v = "") => String(v).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[ch]));
  const allLessons = course.topics.flatMap(t => t.lessons.map(l => ({...l, topicId:t.id, topicTitle:t.title})));
  const progressKey = "ai-military-training-2026:completed";
  const getCompleted = () => {
    try { return new Set(JSON.parse(localStorage.getItem(progressKey) || "[]")); }
    catch { return new Set(); }
  };
  const saveCompleted = set => localStorage.setItem(progressKey, JSON.stringify([...set]));

  function nav() {
    return `<header class="topbar"><div class="shell nav">
      <a class="brand" href="index.html"><span class="brand-mark">AI</span><span>ПК ШІ ВС</span></a>
      <nav class="nav-links" aria-label="Основна навігація">
        <a class="nav-link hide-mobile" href="index.html#topics">Заняття</a>
        <a class="nav-link" href="schedule.html">Розклад</a>
      </nav>
    </div></header>`;
  }

  function footer() {
    return `<footer class="shell footer">Навчальна платформа · ${esc(course.meta.title)} · GitHub Pages</footer>`;
  }

  function statusTag(status) {
    return status === "ready"
      ? '<span class="tag ready">інтерактивне заняття</span>'
      : '<span class="tag">у розробці</span>';
  }

  function renderHome() {
    const root = $("#app");
    if (!root) return;
    const completed = getCompleted();
    const ready = allLessons.filter(l => l.status === "ready").length;
    const lessonsHtml = course.topics.map(topic => `
      <section class="topic">
        <header class="topic-head">
          <div><h3>${esc(topic.title)}</h3><p>${topic.lessons.length} занять · інтерактивний навчальний контент за структурою затвердженої програми</p></div>
          <span class="hours">${topic.hours} год</span>
        </header>
        <div class="lesson-grid">
          ${topic.lessons.map(lesson => `
            <a class="lesson-card" href="lesson.html?id=${encodeURIComponent(lesson.id)}">
              <div class="lesson-meta">
                <span class="tag">${esc(lesson.no)}</span>
                <span class="tag">${esc(lesson.type)}</span>
                <span class="tag">${lesson.hours} год</span>
                ${statusTag(lesson.status)}
              </div>
              <h4>${esc(lesson.title)}</h4>
              <p>${esc(lesson.interaction)}</p>
              <div class="lesson-bottom">
                <span class="open-label">Відкрити заняття →</span>
                <span class="progress-dot ${completed.has(lesson.id) ? "done" : ""}" title="Прогрес"></span>
              </div>
            </a>`).join("")}
        </div>
      </section>`).join("");

    root.innerHTML = `${nav()}
      <main class="shell">
        <section class="hero">
          <div class="eyebrow">Курс підвищення кваліфікації · ${esc(course.meta.level)}</div>
          <h1>ШІ у військовій сфері</h1>
          <p>${esc(course.meta.description)}</p>
          <div class="chips">
            <span class="chip">${course.meta.hours} годин</span>
            <span class="chip">${allLessons.length} навчальних занять</span>
            <span class="chip">${esc(course.meta.dates)}</span>
            <span class="chip">GitHub Pages</span>
          </div>
          <div class="hero-actions">
            <a class="btn primary" href="lesson.html?id=t1-l1">Розпочати курс</a>
            <a class="btn secondary" href="schedule.html">Розклад курсу</a>
          </div>
        </section>

        <section class="stats" aria-label="Структура курсу">
          <div class="stat"><strong>2</strong><span>навчальні теми</span></div>
          <div class="stat"><strong>18</strong><span>годин теоретичної теми</span></div>
          <div class="stat"><strong>30</strong><span>годин практичної теми</span></div>
          <div class="stat"><strong>${ready}/${allLessons.length}</strong><span>занять з інтерактивним контентом</span></div>
        </section>

        <section class="notice">
          <strong>Повний контент курсу доступний</strong>
          <p>Усі 13 занять мають пояснення, візуальні моделі, професійно орієнтовані навчальні приклади та інтерактивні вправи. Core-платформа працює без зовнішніх API; введені у конструктори дані залишаються у браузері.</p>
        </section>

        <section class="section" id="topics">
          <div class="section-head">
            <div><h2>Матеріали занять</h2><p class="section-lead">Проходьте послідовно або відкривайте потрібне заняття. Позначка завершення зберігається локально у цьому браузері.</p></div>
          </div>
          ${lessonsHtml}
        </section>

        <section class="section">
          <div class="topic">
            <header class="topic-head">
              <div><h3>${esc(course.final.title)}</h3><p>${esc(course.final.description)} Підготовка до захисту виконується під час заняття 2/8.</p></div>
              <span class="hours">${course.final.hours} год</span>
            </header>
          </div>
        </section>
      </main>${footer()}`;
  }

  function conceptBlock(block) {
    return `<section class="content-block"><h2>${esc(block.title)}</h2><p>${esc(block.body)}</p>
      <div class="flow">${block.flow.map((x,i) => `${i ? '<span class="flow-arrow">→</span>' : ''}<span class="flow-item">${esc(x)}</span>`).join("")}</div></section>`;
  }

  function cardsBlock(block) {
    return `<section class="content-block"><h2>${esc(block.title)}</h2>${block.intro ? `<p>${esc(block.intro)}</p>` : ""}
      <div class="info-cards">${block.items.map((item,i) => `<article class="info-card"><span class="info-num">${String(i+1).padStart(2,"0")}</span><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join("")}</div></section>`;
  }

  function timelineBlock(block) {
    return `<section class="content-block"><h2>${esc(block.title)}</h2><div class="timeline">
      ${block.items.map((item,i) => `<article class="timeline-item"><div class="timeline-dot">${i+1}</div><div><h3>${esc(item.label)}</h3><p>${esc(item.body)}</p></div></article>`).join("")}
    </div></section>`;
  }

  function matrixBlock(block) {
    return `<section class="content-block"><h2>${esc(block.title)}</h2><div class="table-wrap"><table class="learning-table">
      <thead><tr>${block.columns.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${block.rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div></section>`;
  }

  function compareBlock(block) {
    return `<section class="content-block"><h2>${esc(block.title)}</h2>
      <div class="compare">
        <div class="example bad"><div class="example-label">${esc(block.badLabel || "Слабкий варіант")}</div>${esc(block.bad)}</div>
        <div class="example good"><div class="example-label">${esc(block.goodLabel || "Кращий варіант")}</div>${esc(block.good)}</div>
      </div>${block.note ? `<p>${esc(block.note)}</p>` : ""}</section>`;
  }

  function generatorBlock(block, index) {
    return `<section class="content-block generator-block" data-generator="${index}"><h2>${esc(block.title)}</h2><p>${esc(block.description)}</p>
      <div class="builder-grid">${block.fields.map(([id,label,ph],i) => `<div class="field ${i === block.fields.length-1 && block.fields.length % 2 ? "full":""}"><label for="g-${index}-${esc(id)}">${esc(label)}</label><textarea id="g-${index}-${esc(id)}" data-generator-field="${esc(id)}" data-label="${esc(label)}" placeholder="${esc(ph)}"></textarea></div>`).join("")}</div>
      <div class="builder-actions"><button class="btn olive generate-btn" type="button">${esc(block.button || "Сформувати")}</button><button class="btn ghost copy-generator-btn" type="button">Копіювати</button><button class="btn ghost clear-generator-btn" type="button">Очистити</button></div>
      <div class="output generator-output" aria-live="polite">Заповніть поля та натисніть кнопку формування.</div></section>`;
  }

  function scenarioBlock(block, index) {
    return `<section class="content-block scenario-block" data-scenario="${index}"><h2>${esc(block.title)}</h2>
      <div class="scenario-box"><div class="scenario-label">Ситуація</div><p>${esc(block.situation)}</p></div>
      <h3 class="scenario-question">${esc(block.question)}</h3>
      <div class="choice-grid">${block.choices.map((choice,i) => `<button type="button" class="choice-btn" data-choice="${i}" data-correct="${choice.correct ? "true":"false"}" data-feedback="${esc(choice.feedback)}">${esc(choice.label)}</button>`).join("")}</div>
      <div class="scenario-feedback" aria-live="polite"></div></section>`;
  }

  function radarBlock(block) {
    return `<section class="content-block"><h2>${esc(block.title)}</h2>
      <div class="radar">
        <div class="radar-center">${esc(block.center || "Фокус")}</div>
        ${block.rings.map((ring,i) => `<div class="radar-ring radar-ring-${i+1}"><strong>${esc(ring.label)}</strong><div class="radar-items">${ring.items.map(x => `<span>${esc(x)}</span>`).join("")}</div></div>`).join("")}
      </div></section>`;
  }

  function riskBlock(block) {
    return `<section class="content-block risk-block"><h2>${esc(block.title)}</h2><p>${esc(block.description)}</p>
      <div class="risk-grid">
        <label>Дані<select id="riskData"><option value="public">Відкриті / навчальні</option><option value="restricted">Обмежені локальними правилами</option><option value="sensitive">Чутливі / невідомий статус</option></select></label>
        <label>Середовище<select id="riskEnv"><option value="approved">Дозволене організацією</option><option value="public">Публічний зовнішній сервіс</option><option value="local">Локальне контрольоване середовище</option></select></label>
        <label>Перевірка людиною<select id="riskHuman"><option value="yes">Є до використання результату</option><option value="no">Не передбачена</option></select></label>
      </div>
      <button class="btn olive" id="riskCheckBtn" type="button">Оцінити навчальний сценарій</button>
      <div class="risk-result" id="riskResult">Оберіть умови та запустіть перевірку.</div>
    </section>`;
  }

  function exerciseBlock(block) {
    return `<section class="content-block"><h2>${esc(block.title)}</h2><p>${esc(block.body)}</p><ol class="step-list">${block.steps.map(s => `<li><span>${esc(s)}</span></li>`).join("")}</ol></section>`;
  }

  function checkBlock(block) {
    return `<section class="content-block"><h2>${esc(block.title)}</h2><div class="quiz">${block.questions.map((item,i) => `
      <div class="quiz-item" data-answer="${item.a ? "true":"false"}" data-explain="${esc(item.explain)}">
        <div class="quiz-q">${i+1}. ${esc(item.q)}</div>
        <div class="quiz-actions"><button class="btn ghost quiz-btn" data-value="true" type="button">Так</button><button class="btn ghost quiz-btn" data-value="false" type="button">Ні</button></div>
        <div class="quiz-result"></div>
      </div>`).join("")}</div></section>`;
  }

  function blockHtml(block, index) {
    if (block.type === "concept") return conceptBlock(block);
    if (block.type === "cards") return cardsBlock(block);
    if (block.type === "timeline") return timelineBlock(block);
    if (block.type === "matrix") return matrixBlock(block);
    if (block.type === "compare") return compareBlock(block);
    if (block.type === "generator" || block.type === "builder") return generatorBlock(block, index);
    if (block.type === "scenario") return scenarioBlock(block, index);
    if (block.type === "radar") return radarBlock(block);
    if (block.type === "risk") return riskBlock(block);
    if (block.type === "exercise") return exerciseBlock(block);
    if (block.type === "check") return checkBlock(block);
    return "";
  }

  function bindGenerators() {
    $$(".generator-block").forEach(block => {
      const output = $(".generator-output", block);
      const build = $(".generate-btn", block);
      const copy = $(".copy-generator-btn", block);
      const clear = $(".clear-generator-btn", block);
      build.addEventListener("click", () => {
        const values = $$("[data-generator-field]", block)
          .map(el => ({label:el.dataset.label, value:el.value.trim()}))
          .filter(x => x.value);
        output.textContent = values.length
          ? values.map(x => `${x.label.toUpperCase()}: ${x.value}`).join("\n\n") +
            "\n\nПЕРЕВІРКА: не додавай невідомих фактів; познач невизначеність; результат має перевірити людина."
          : "Додайте хоча б один елемент.";
      });
      clear.addEventListener("click", () => {
        $$("[data-generator-field]", block).forEach(el => el.value = "");
        output.textContent = "Заповніть поля та натисніть кнопку формування.";
      });
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(output.textContent);
          const old = copy.textContent; copy.textContent = "Скопійовано";
          setTimeout(() => copy.textContent = old, 1200);
        } catch {
          copy.textContent = "Виділіть текст вручну";
        }
      });
    });
  }

  function bindScenarios() {
    $$(".scenario-block").forEach(block => {
      const feedback = $(".scenario-feedback", block);
      $$(".choice-btn", block).forEach(btn => btn.addEventListener("click", () => {
        $$(".choice-btn", block).forEach(b => b.classList.remove("selected","correct","wrong"));
        btn.classList.add("selected", btn.dataset.correct === "true" ? "correct" : "wrong");
        feedback.textContent = (btn.dataset.correct === "true" ? "✓ " : "→ ") + btn.dataset.feedback;
        feedback.className = "scenario-feedback " + (btn.dataset.correct === "true" ? "ok" : "warn");
      }));
    });
  }

  function bindRiskChecker() {
    const btn = $("#riskCheckBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const data = $("#riskData").value;
      const env = $("#riskEnv").value;
      const human = $("#riskHuman").value;
      const result = $("#riskResult");
      let level = "Низький / керований навчальний ризик";
      let message = "Сценарій виглядає придатним для навчальної роботи за умови дотримання локальних правил і перевірки результату.";
      let cls = "low";
      if (data === "sensitive" || (data === "restricted" && env === "public")) {
        level = "Стоп: спочатку перевірте правила поводження з даними";
        message = "Не передавайте такі дані зовнішньому сервісу без чіткого дозволу. Використайте синтетичні дані або дозволене контрольоване середовище.";
        cls = "high";
      } else if (human === "no" || (env === "public" && data !== "public")) {
        level = "Підвищений ризик";
        message = "Додайте людську перевірку до використання результату та уточніть, чи дозволене обране середовище для цих даних.";
        cls = "medium";
      } else if (env === "public") {
        level = "Потрібна стандартна обережність";
        message = "Для відкритих навчальних даних сценарій може бути прийнятним, але не вводьте персональні, службові або інші обмежені дані та перевіряйте результат.";
        cls = "medium";
      }
      result.className = "risk-result " + cls;
      result.innerHTML = `<strong>${esc(level)}</strong><span>${esc(message)}</span><small>Це навчальна підказка, а не заміна офіційних політик чи юридичного висновку.</small>`;
    });
  }

  function bindQuiz() {
    $$(".quiz-btn").forEach(btn => btn.addEventListener("click", () => {
      const item = btn.closest(".quiz-item");
      const correct = item.dataset.answer === btn.dataset.value;
      const result = $(".quiz-result", item);
      result.textContent = (correct ? "✓ Правильно. " : "✕ Спробуйте ще раз. ") + item.dataset.explain;
      result.style.color = correct ? "var(--accent)" : "var(--danger)";
    }));
  }

  function bindCompletion(id) {
    const btn = $("#completeLesson");
    const bar = $("#lessonProgress");
    if (!btn) return;
    const completed = getCompleted();
    const refresh = () => {
      const done = completed.has(id);
      btn.textContent = done ? "✓ Заняття завершене" : "Позначити заняття завершеним";
      bar.style.width = done ? "100%" : "35%";
    };
    btn.addEventListener("click", () => {
      completed.has(id) ? completed.delete(id) : completed.add(id);
      saveCompleted(completed); refresh();
    });
    refresh();
  }

  function renderLesson() {
    const root = $("#app");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id") || "t1-l1";
    const lesson = allLessons.find(l => l.id === id);
    if (!lesson) {
      root.innerHTML = `${nav()}<main class="shell"><section class="lesson-hero"><a class="back" href="index.html">← До курсу</a><div class="placeholder"><strong>Заняття не знайдено</strong>Перевірте посилання або поверніться на головну.</div></section></main>${footer()}`;
      return;
    }
    const content = lessonContent[id];
    const index = allLessons.findIndex(l => l.id === id);
    const prev = index > 0 ? allLessons[index-1] : null;
    const next = index < allLessons.length - 1 ? allLessons[index+1] : null;

    root.innerHTML = `${nav()}<main class="shell">
      <section class="lesson-hero">
        <a class="back" href="index.html#topics">← До всіх занять</a>
        <div class="eyebrow" style="color:var(--accent)">${esc(content?.kicker || lesson.topicTitle)}</div>
        <h1 class="lesson-title">${esc(lesson.no)} · ${esc(lesson.title)}</h1>
        <p class="lesson-lead">${esc(content?.lead || "")}</p>
        <div class="lesson-info"><span class="tag">${esc(lesson.type)}</span><span class="tag">${esc(content?.duration || lesson.hours + " год за програмою")}</span>${statusTag(lesson.status)}</div>
      </section>

      <section class="outcomes">
        <div class="panel"><h3>Після заняття ви зможете</h3><ul class="outcome-list">${lesson.outcomes.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="panel"><h3>Центральний інтерактив</h3><p>${esc(lesson.interaction)}</p><div class="progressbar"><span id="lessonProgress"></span></div><p class="micro-note">Прогрес зберігається лише у цьому браузері.</p></div>
      </section>

      <div class="lesson-content">
        ${content ? content.sections.map((block,i) => blockHtml(block,i)).join("") : '<section class="placeholder"><strong>Матеріал відсутній</strong></section>'}
        ${content ? `<section class="content-block takeaways"><h2>Ключові висновки</h2><ul>${content.takeaways.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>` : ""}
      </div>

      <div class="complete-row">
        <div class="lesson-nav">
          ${prev ? `<a class="btn ghost" href="lesson.html?id=${encodeURIComponent(prev.id)}">← ${esc(prev.no)}</a>` : '<a class="btn ghost" href="index.html#topics">← До курсу</a>'}
          ${next ? `<a class="btn ghost" href="lesson.html?id=${encodeURIComponent(next.id)}">${esc(next.no)} →</a>` : '<a class="btn ghost" href="index.html#topics">До курсу →</a>'}
        </div>
        <button class="btn olive" id="completeLesson" type="button">Позначити заняття завершеним</button>
      </div>
    </main>${footer()}`;

    bindGenerators();
    bindScenarios();
    bindRiskChecker();
    bindQuiz();
    bindCompletion(id);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    if (page === "lesson") renderLesson(); else renderHome();
  });
})();