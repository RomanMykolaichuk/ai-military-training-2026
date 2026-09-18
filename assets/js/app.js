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
      ? '<span class="tag ready">MVP готове</span>'
      : '<span class="tag">каркас заняття</span>';
  }

  function renderHome() {
    const root = $("#app");
    if (!root) return;
    const completed = getCompleted();
    const ready = allLessons.filter(l => l.status === "ready").length;
    const lessonsHtml = course.topics.map(topic => `
      <section class="topic">
        <header class="topic-head">
          <div><h3>${esc(topic.title)}</h3><p>${topic.lessons.length} занять · навчальний контент формується за затвердженою програмою</p></div>
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
                <span class="open-label">${lesson.status === "ready" ? "Відкрити заняття →" : "Відкрити каркас →"}</span>
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
            <a class="btn primary" href="lesson.html?id=t2-l1">Відкрити еталонне заняття</a>
            <a class="btn secondary" href="schedule.html">Розклад курсу</a>
          </div>
        </section>

        <section class="stats" aria-label="Структура курсу">
          <div class="stat"><strong>2</strong><span>навчальні теми</span></div>
          <div class="stat"><strong>18</strong><span>годин теоретичної теми</span></div>
          <div class="stat"><strong>30</strong><span>годин практичної теми</span></div>
          <div class="stat"><strong>${ready}/${allLessons.length}</strong><span>занять у повному інтерактивному форматі</span></div>
        </section>

        <section class="notice">
          <strong>MVP: спочатку еталон, потім масштабування</strong>
          <p>Повністю реалізоване заняття 2/1 «Основи роботи з LLM». Решта сторінок уже мають єдиний каркас, мету, результати та запланований інтерактив — далі наповнюємо їх послідовно.</p>
        </section>

        <section class="section" id="topics">
          <div class="section-head">
            <div><h2>Матеріали занять</h2><p class="section-lead">Кожне заняття відкривається окремою сторінкою. Прогрес зберігається локально у браузері без облікового запису та без backend.</p></div>
          </div>
          ${lessonsHtml}
        </section>

        <section class="section">
          <div class="topic">
            <header class="topic-head">
              <div><h3>${esc(course.final.title)}</h3><p>${esc(course.final.description)}</p></div>
              <span class="hours">${course.final.hours} год</span>
            </header>
          </div>
        </section>
      </main>${footer()}`;
  }

  function blockHtml(block) {
    if (block.type === "concept") {
      return `<section class="content-block"><h2>${esc(block.title)}</h2><p>${esc(block.body)}</p>
        <div class="flow">${block.flow.map((x,i) => `${i ? '<span class="flow-arrow">→</span>' : ''}<span class="flow-item">${esc(x)}</span>`).join("")}</div></section>`;
    }
    if (block.type === "compare") {
      return `<section class="content-block"><h2>${esc(block.title)}</h2>
        <div class="compare">
          <div class="example bad"><div class="example-label">Слабкий запит</div>${esc(block.bad)}</div>
          <div class="example good"><div class="example-label">Структурований запит</div>${esc(block.good)}</div>
        </div><p>${esc(block.note)}</p></section>`;
    }
    if (block.type === "builder") {
      return `<section class="content-block" id="prompt-builder"><h2>${esc(block.title)}</h2><p>${esc(block.description)}</p>
        <div class="builder-grid">${block.fields.map(([id,label,ph],i) => `<div class="field ${i === block.fields.length-1 ? "full":""}"><label for="pb-${esc(id)}">${esc(label)}</label><textarea id="pb-${esc(id)}" data-prompt-field="${esc(id)}" placeholder="${esc(ph)}"></textarea></div>`).join("")}</div>
        <div class="builder-actions"><button class="btn olive" type="button" id="buildPrompt">Сформувати prompt</button><button class="btn ghost" type="button" id="copyPrompt">Копіювати</button><button class="btn ghost" type="button" id="clearPrompt">Очистити</button></div>
        <div class="output" id="promptOutput" aria-live="polite">Заповніть поля і натисніть «Сформувати prompt».</div></section>`;
    }
    if (block.type === "exercise") {
      return `<section class="content-block"><h2>${esc(block.title)}</h2><p>${esc(block.body)}</p><ol class="step-list">${block.steps.map(s => `<li><span>${esc(s)}</span></li>`).join("")}</ol></section>`;
    }
    if (block.type === "check") {
      return `<section class="content-block"><h2>${esc(block.title)}</h2><div class="quiz">${block.questions.map((item,i) => `
        <div class="quiz-item" data-answer="${item.a ? "true":"false"}" data-explain="${esc(item.explain)}">
          <div class="quiz-q">${i+1}. ${esc(item.q)}</div>
          <div class="quiz-actions"><button class="btn ghost quiz-btn" data-value="true" type="button">Так</button><button class="btn ghost quiz-btn" data-value="false" type="button">Ні</button></div>
          <div class="quiz-result"></div>
        </div>`).join("")}</div></section>`;
    }
    return "";
  }

  function bindPromptBuilder() {
    const build = $("#buildPrompt");
    if (!build) return;
    const fields = () => Object.fromEntries($$("[data-prompt-field]").map(el => [el.dataset.promptField, el.value.trim()]));
    const output = $("#promptOutput");
    build.addEventListener("click", () => {
      const v = fields();
      const lines = [
        ["РОЛЬ", v.role], ["КОНТЕКСТ", v.context], ["ЗАВДАННЯ", v.task],
        ["ОБМЕЖЕННЯ", v.constraints], ["ФОРМАТ РЕЗУЛЬТАТУ", v.format]
      ].filter(([,value]) => value).map(([k,value]) => `${k}: ${value}`);
      output.textContent = lines.length ? lines.join("\n\n") : "Додайте хоча б один елемент запиту.";
    });
    $("#clearPrompt")?.addEventListener("click", () => {
      $$("[data-prompt-field]").forEach(el => el.value = "");
      output.textContent = "Заповніть поля і натисніть «Сформувати prompt».";
    });
    $("#copyPrompt")?.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(output.textContent); $("#copyPrompt").textContent = "Скопійовано"; setTimeout(() => $("#copyPrompt").textContent = "Копіювати", 1200); }
      catch { $("#copyPrompt").textContent = "Виділіть текст вручну"; }
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
      btn.textContent = done ? "✓ Позначено як завершене" : "Позначити заняття завершеним";
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
    const id = new URLSearchParams(location.search).get("id") || "t2-l1";
    const lesson = allLessons.find(l => l.id === id);
    if (!lesson) {
      root.innerHTML = `${nav()}<main class="shell"><section class="lesson-hero"><a class="back" href="index.html">← До курсу</a><div class="placeholder"><strong>Заняття не знайдено</strong>Перевірте посилання або поверніться на головну.</div></section></main>${footer()}`;
      return;
    }
    const content = lessonContent[id];
    root.innerHTML = `${nav()}<main class="shell">
      <section class="lesson-hero">
        <a class="back" href="index.html#topics">← До всіх занять</a>
        <div class="eyebrow" style="color:var(--accent)">${esc(lesson.topicTitle)}</div>
        <h1 class="lesson-title">${esc(lesson.no)} · ${esc(lesson.title)}</h1>
        <p class="lesson-lead">${content ? esc(content.lead) : "Сторінка заняття підготовлена в єдиному шаблоні. Детальний інтерактивний матеріал буде наповнюватися на наступній ітерації."}</p>
        <div class="lesson-info"><span class="tag">${esc(lesson.type)}</span><span class="tag">${lesson.hours} год за програмою</span>${statusTag(lesson.status)}</div>
      </section>

      <section class="outcomes">
        <div class="panel"><h3>Результат заняття</h3><ul class="outcome-list">${lesson.outcomes.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="panel"><h3>Центральний інтерактив</h3><p>${esc(lesson.interaction)}</p><div class="progressbar"><span id="lessonProgress"></span></div></div>
      </section>

      <div class="lesson-content">
        ${content ? content.sections.map(blockHtml).join("") : `<section class="placeholder"><strong>Каркас готовий</strong>Для цього заняття вже визначені результати та тип інтерактиву. Наступний крок — наповнення прикладами, інфографікою та практичними вправами.</section>`}
        ${content ? `<section class="content-block takeaways"><h2>Ключові висновки</h2><ul>${content.takeaways.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>` : ""}
      </div>

      <div class="complete-row">
        <a class="btn ghost" href="index.html#topics">← Повернутися до курсу</a>
        <button class="btn olive" id="completeLesson" type="button">Позначити заняття завершеним</button>
      </div>
    </main>${footer()}`;

    bindPromptBuilder(); bindQuiz(); bindCompletion(id);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    if (page === "lesson") renderLesson(); else renderHome();
  });
})();