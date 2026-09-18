# Web learning platform — specification v1

## 1. Purpose

Static interactive learning platform for the professional development course
**“Використання елементів технологій штучного інтелекту у військовій сфері (базовий рівень)”**.

The platform supplements instructor-led training. It is not an LMS and does not require accounts, a database, or a backend.

Deployment target: **GitHub Pages** from the public repository root.

## 2. Source programme

The platform follows the approved course plan:
- total: 54 hours;
- organisational activities: 2 hours;
- Topic 1: 18 hours;
- Topic 2: 30 hours;
- final assessment: 4 hours.

The site must preserve the terminology and sequence of the approved programme when naming topics and lessons.

## 3. Design principles

1. One lesson = one clear page.
2. Explain visually before adding long text.
3. Every 3–7 minutes the learner should do something: compare, select, edit, build, reveal, or check.
4. Examples should be professionally relevant but use only non-sensitive / synthetic data.
5. AI output is treated as a draft requiring human verification.
6. The core site must work without external APIs.
7. No mandatory login, tracking, cookies, or learner database.
8. All paths must be relative so the project works under a GitHub Pages project subpath.
9. Mobile-first responsive design.
10. Print/PDF should remain usable for instructors.

## 4. Information architecture

### Home
- course identity;
- dates and total hours;
- Topic 1 and Topic 2;
- lesson cards;
- progress markers stored only in localStorage;
- link to the interactive schedule;
- link to the final assessment block.

### Lesson page
Fixed reusable sequence:
1. Orientation and expected outcomes.
2. Why it matters / professional context.
3. Visual mental model.
4. Demonstration or comparison.
5. Interactive exercise.
6. Individual / pair / group task.
7. Quick self-check.
8. Key takeaways.
9. Mark lesson complete.

### Schedule
The existing interactive schedule is preserved as `schedule.html`.

## 5. Course map

### Topic 1 — 18 h
1. 1/1 — Феномен штучного інтелекту та його імплементація у сучасних збройних конфліктах.
2. 1/2 — Принципи функціонування та екосистеми штучного інтелекту.
3. 1/3 — Огляд ключових напрямів застосування ШІ у військовій сфері.
4. 1/4 — Кейс-стаді: приклад розроблення інформаційно-аналітичної системи на основі ШІ.
5. 1/5 — Перспективні напрями розвитку технологій ШІ у військовій сфері.

### Topic 2 — 30 h
1. 2/1 — Основи роботи з LLM.
2. 2/2 — Використання LLM для автоматизації підготовки службових документів.
3. 2/3 — Застосування LLM як інструменту мозкового штурму та аналізу проблем.
4. 2/4 — Адаптація та підготовка інформаційних матеріалів за допомогою LLM.
5. 2/5 — Основи роботи з дифузійними моделями та генерації зображень.
6. 2/6 — Використання генеративного ШІ для створення елементів інфографіки та схем.
7. 2/7 — Нормативно-правові, етичні та безпекові аспекти використання технологій ШІ.
8. 2/8 — Розроблення методичних матеріалів з використанням технологій ШІ.

### Final assessment — 4 h
- final control;
- defence of the group project.

## 6. Planned central interaction for each lesson

| Lesson | Central interaction |
|---|---|
| 1/1 | AI → ML → DL → GenAI concept map |
| 1/2 | Data → model → output interactive flow |
| 1/3 | ISR / C2 / logistics / autonomous systems map |
| 1/4 | AI project lifecycle constructor |
| 1/5 | Technology radar |
| 2/1 | Prompt Builder + weak/structured prompt comparison |
| 2/2 | Before/after document transformation |
| 2/3 | SWOT / alternatives builder |
| 2/4 | Audience and tone transformer |
| 2/5 | Visual Prompt Builder |
| 2/6 | Infographic planner |
| 2/7 | OPSEC / ethics / legal risk checker |
| 2/8 | Lesson / methodological material builder |

## 7. MVP scope

The first implementation provides:
- new course home page;
- navigation for all 13 lessons;
- reusable data-driven lesson engine;
- preserved schedule page;
- complete interactive prototype for lesson 2/1;
- local progress;
- Prompt Builder;
- quick quiz;
- responsive UI;
- GitHub Pages-compatible static structure.

The remaining lesson pages intentionally use the same shell and will be populated iteratively.

## 8. Repository structure

```text
/
├── index.html
├── lesson.html
├── schedule.html
├── .nojekyll
├── assets/
│   ├── css/
│   │   └── site.css
│   └── js/
│       └── app.js
├── data/
│   └── course-data.js
├── docs/
│   └── PLATFORM_SPEC.md
├── materials/
├── resources/
├── templates/
└── scripts/
```

## 9. Technical constraints

- HTML5 + CSS + vanilla JavaScript;
- no React / Angular / build pipeline for v1;
- no runtime dependencies;
- no backend;
- no mandatory external fonts;
- no API keys in repository;
- relative URLs only;
- progressive enhancement where possible;
- localStorage only for non-sensitive learner progress.

## 10. AI integrations — later phase

Optional future adapters may support:
- ChatGPT through copy/paste workflows;
- Gemini through copy/paste workflows;
- Groq API;
- local Ollama.

The static lesson must remain usable when all AI integrations are unavailable.

## 11. Safety and data handling

The platform itself must not request operational, classified, restricted, personal, or otherwise sensitive data.

All demonstration scenarios should be:
- synthetic;
- de-identified;
- publicly releasable;
- explicitly framed as educational.

When a learner is asked to use a public AI service, the lesson must show a visible reminder not to paste sensitive information.

## 12. Development sequence

1. Validate home + lesson 2/1 physically on desktop and mobile.
2. Refine reusable lesson components.
3. Fill Topic 1.
4. Fill Topic 2 lessons 2/2–2/8.
5. Add final project workspace/checklist.
6. Add infographics and visual assets.
7. Optional AI adapters.
8. Accessibility and performance pass.
9. Final GitHub Pages release.

## 13. Acceptance criteria for v1

- root page opens without console errors;
- all lesson cards resolve to valid pages;
- schedule remains available;
- lesson 2/1 Prompt Builder works;
- quiz feedback works;
- progress persists after page refresh;
- no network request is required for core functionality;
- layout is usable at 360 px width;
- print view does not lose core textual content.
