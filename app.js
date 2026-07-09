import { subjects, subjectMap, gradeLabels } from "./subjects/index.js";

const storageKeys = {
  progress: "manjeom-progress-v2",
  wrong: "manjeom-wrong-v2",
  studiedToday: "manjeom-today-v2",
  favorites: "manjeom-favorites-v2",
  solvedToday: "manjeom-solved-today-v2",
};

const state = {
  route: "home",
  subjectId: null,
  gradeId: null,
  unitId: null,
  unitTab: "overview",
  query: "",
  conceptFilter: "all",
  practiceFilter: "all",
  searchResults: [],
  answers: {},
  checked: {},
  quizSession: {},
  exam: {
    subjectId: "all",
    gradeId: "all",
    unitIds: [],
    active: false,
    startedAt: null,
    durationSec: 900,
    remainingSec: 900,
    questionIds: [],
    answers: {},
    checked: false,
    result: null,
  },
  flippedCards: new Set(),
  progress: load(storageKeys.progress, {}),
  wrongNotes: load(storageKeys.wrong, []),
  studiedToday: load(storageKeys.studiedToday, {}),
  favorites: load(storageKeys.favorites, []),
  solvedToday: load(storageKeys.solvedToday, {}),
  wrongFilter: "all",
};

const app = document.getElementById("app");
let examTimer = null;

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function allUnits() {
  return subjects.flatMap((subject) =>
    subject.grades.flatMap((grade) =>
      grade.units.map((unit) => ({
        ...unit,
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        subjectIcon: subject.icon,
        gradeId: grade.id,
        gradeName: grade.name,
      }))
    )
  );
}

function getSubject(subjectId) {
  return subjectMap[subjectId] || null;
}

function getGrade(subjectId, gradeId) {
  return getSubject(subjectId)?.grades.find((grade) => grade.id === gradeId) || null;
}

function getUnit(subjectId, gradeId, unitId) {
  return getGrade(subjectId, gradeId)?.units.find((unit) => unit.id === unitId) || null;
}

function totalProgressPercent() {
  const units = allUnits();
  if (!units.length) return 0;
  const total = units.reduce((sum, unit) => sum + (state.progress[unit.id] || 0), 0);
  return Math.round(total / units.length);
}

function unitProgress(unitId) {
  return state.progress[unitId] || 0;
}

function todaySolvedCount() {
  return state.solvedToday[todayKey()] || 0;
}

function recordSolvedQuestion(count = 1) {
  const key = todayKey();
  state.solvedToday[key] = (state.solvedToday[key] || 0) + count;
  save(storageKeys.solvedToday, state.solvedToday);
}

function isFavorite(unitId) {
  return state.favorites.includes(unitId);
}

function toggleFavorite(unitId) {
  state.favorites = isFavorite(unitId)
    ? state.favorites.filter((id) => id !== unitId)
    : [unitId, ...state.favorites];
  save(storageKeys.favorites, state.favorites);
}

function importanceLabel(unit) {
  if (unit.status === "reviewed" || unit.questions.length >= 20) return "매우 중요";
  if (unit.questions.length >= 12 || unit.status === "lessonDraft") return "중요";
  return "기초";
}

function completionLabel(unit) {
  if (unitProgress(unit.id) >= 100) return "완료";
  if (unitProgress(unit.id) >= 40) return "진행 중";
  return "시작 전";
}

function nextUnitForSubject(subject) {
  const units = subject.grades.flatMap((grade) =>
    grade.units.map((unit) => ({ ...unit, gradeId: grade.id }))
  );
  return units.find((unit) => unitProgress(unit.id) < 100) || units[0];
}

function statusLabel(unit) {
  return unit.statusLabel || "개념 작성중";
}

function statusClass(unit) {
  return `status-${unit.statusTone || unit.status || "draft"}`;
}

function completionRatio(unit) {
  const conceptReady = unit.coreConcepts?.length >= 4;
  const questionReady = unit.questions?.length >= 20;
  const reviewed = unit.status === "reviewed";
  return Math.round(([conceptReady, questionReady, reviewed].filter(Boolean).length / 3) * 100);
}

function coverageRows() {
  return allUnits().map((unit) => ({
    ...unit,
    ratio: completionRatio(unit),
  }));
}

function quizFor(unit) {
  const key = unit.id;
  const questionIds = unit.questions.map((question) => question.id);
  const current = state.quizSession[key];
  if (!current || current.questionIds.join("|") !== questionIds.join("|")) {
    state.quizSession[key] = {
      index: 0,
      questionIds,
      correct: 0,
      submitted: 0,
      finished: false,
    };
  }
  return state.quizSession[key];
}

function currentLocationTrail() {
  if (state.route === "unit") {
    const subject = getSubject(state.subjectId);
    const grade = getGrade(state.subjectId, state.gradeId);
    const unit = getUnit(state.subjectId, state.gradeId, state.unitId);
    return [subject?.name, grade?.name, unit?.title].filter(Boolean);
  }
  if (state.route === "subject") {
    const subject = getSubject(state.subjectId);
    const grade = getGrade(state.subjectId, state.gradeId);
    return [subject?.name, grade?.name].filter(Boolean);
  }
  const labels = {
    home: "홈",
    subjects: "과목 선택",
    grades: "학년 선택",
    concepts: "개념 카드",
    practice: "문제 풀기",
    wrong: "오답노트",
    exam: "실전 시험",
    tracker: "학습 진도",
    coverage: "커버리지",
  };
  return [labels[state.route] || "홈"];
}

function markStudied(unit) {
  const key = todayKey();
  const today = state.studiedToday[key] || [];
  if (!today.includes(unit.id)) {
    state.studiedToday[key] = [unit.id, ...today].slice(0, 12);
    save(storageKeys.studiedToday, state.studiedToday);
  }
}

function setProgress(unitId, value) {
  state.progress[unitId] = Math.max(state.progress[unitId] || 0, Math.min(100, value));
  save(storageKeys.progress, state.progress);
}

function ensureRoute(route) {
  state.route = route;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchToUnit(subjectId, gradeId, unitId, tab = "overview") {
  state.subjectId = subjectId;
  state.gradeId = gradeId;
  state.unitId = unitId;
  state.unitTab = tab;
  state.route = "unit";
  state.answers = {};
  state.checked = {};
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openSubject(subjectId) {
  const subject = getSubject(subjectId);
  state.subjectId = subjectId;
  state.gradeId = subject?.grades[0]?.id || null;
  state.unitId = null;
  state.route = "subject";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function recordWrongNote(unit, question, userAnswer) {
  const entry = {
    id: `${unit.id}-${question.id}`,
    unitId: unit.id,
    unitTitle: unit.title,
    subjectId: unit.subjectId,
    subjectName: unit.subjectName,
    gradeId: unit.gradeId,
    gradeName: unit.gradeName,
    prompt: question.prompt,
    type: question.type,
    difficulty: question.difficulty,
    relatedConcept: question.relatedConcept,
    correctAnswer: question.options ? question.options[question.answer] : question.answer,
    explanation: question.explanation,
    memo: state.wrongNotes.find((item) => item.id === `${unit.id}-${question.id}`)?.memo || "",
    userAnswer: question.options ? question.options[userAnswer] ?? "미선택" : userAnswer,
    createdAt: state.wrongNotes.find((item) => item.id === `${unit.id}-${question.id}`)?.createdAt || new Date().toISOString(),
    reviewed: state.wrongNotes.find((item) => item.id === `${unit.id}-${question.id}`)?.reviewed || false,
  };
  state.wrongNotes = [entry, ...state.wrongNotes.filter((item) => item.id !== entry.id)];
  save(storageKeys.wrong, state.wrongNotes);
}

function searchContent(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return allUnits().filter((unit) => {
    const haystack = [
      unit.subjectName,
      unit.gradeName,
      unit.title,
      unit.field,
      unit.difficulty,
      ...unit.achievementGoals,
      ...unit.coreConcepts.flatMap((item) => [item.term, item.simple, item.detailed, item.exam]),
      ...unit.principles.flatMap((item) => [item.title, item.body]),
      ...unit.examples.flatMap((item) => [item.title, item.body]),
      ...unit.relatedFigures.flatMap((item) => [item.name, item.work]),
      ...unit.flashcards.flatMap((item) => [item.front, item.back]),
      ...unit.keyTerms.map((item) => `${item.term} ${item.meaning}`),
      ...unit.mustMemorize,
      ...unit.examTips,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

function render() {
  if (state.exam.active) syncExamTimer();
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopbar()}
      <main class="page-shell">
        ${renderMain()}
      </main>
    </div>
  `;
}

function renderTopbar() {
  const trail = currentLocationTrail();
  return `
    <header class="topbar">
      <div class="topbar-inner">
        <button class="brand" data-route="home">만점왕</button>
        <nav class="topnav">
          <button data-route="home">홈</button>
          <button data-route="subjects">과목별 학습</button>
          <button data-route="grades">학년별 학습</button>
          <button data-route="concepts">만점 개념 정리</button>
          <button data-route="practice">문제 풀기</button>
          <button data-route="wrong">오답노트</button>
          <button data-route="exam">시험 대비 모드</button>
          <button data-route="tracker">학습 진도표</button>
          <button data-route="coverage">커버리지</button>
        </nav>
        <label class="searchbox">
          <span>⌕</span>
          <input id="global-search" value="${escapeHtml(state.query)}" placeholder="열평형, 정비례, 지동설처럼 검색해 보세요" />
        </label>
      </div>
      <div class="location-bar">
        <span>현재 위치</span>
        <strong>${trail.join(" › ")}</strong>
      </div>
    </header>
  `;
}

function renderMain() {
  if (state.query.trim()) return renderSearchPage();
  switch (state.route) {
    case "subjects":
      return renderSubjectsPage();
    case "grades":
      return renderGradesPage();
    case "subject":
      return renderSubjectDetailPage();
    case "unit":
      return renderUnitPage();
    case "concepts":
      return renderConceptHub();
    case "practice":
      return renderPracticeHub();
    case "wrong":
      return renderWrongNotes();
    case "exam":
      return renderExamMode();
    case "tracker":
      return renderTracker();
    case "coverage":
      return renderCoveragePage();
    default:
      return renderHome();
  }
}

function renderHome() {
  const todayUnits = (state.studiedToday[todayKey()] || [])
    .map((id) => allUnits().find((unit) => unit.id === id))
    .filter(Boolean);
  const recommendations = allUnits()
    .sort((a, b) => (unitProgress(a.id) || 0) - (unitProgress(b.id) || 0))
    .slice(0, 4);
  const nextUnit = recommendations[0];
  const primaryActions = [
    { icon: "📘", title: "개념 공부", copy: "과목과 학년을 골라 핵심 개념부터 정리", route: "subjects", cta: "과목 선택" },
    { icon: "✏️", title: "문제 풀기", copy: "단원별 문제를 풀고 바로 채점", route: "practice", cta: "문제 시작" },
    { icon: "🧠", title: "오답 노트", copy: "틀린 문제와 약한 개념을 다시 복습", route: "wrong", cta: "오답 복습" },
    { icon: "⏱️", title: "실전 시험", copy: "제한 시간 안에 랜덤 문제로 점검", route: "exam", cta: "시험 보기" },
  ];
  return `
    <section class="hero">
      <div class="hero-copy">
        <span class="badge badge-sand">과목 → 학년 → 단원 → 개념 → 문제 → 오답 복습</span>
        <h1>만점왕 학습 대시보드</h1>
        <p>앱을 켜자마자 오늘 무엇을 공부할지 고르고, 개념 학습부터 실전 시험까지 끊기지 않게 이어가도록 정리했습니다.</p>
        <div class="hero-actions">
          <button class="primary-btn" data-open-unit="${nextUnit.subjectId}|${nextUnit.gradeId}|${nextUnit.id}">이어서 공부하기</button>
          <button class="ghost-btn" data-route="coverage">교육과정 커버리지</button>
        </div>
        <div class="hero-stats">
          <div class="stat-card"><strong>${subjects.length}과목</strong><span>학습 과목</span></div>
          <div class="stat-card"><strong>${allUnits().length}단원</strong><span>샘플 및 확장형 데이터</span></div>
          <div class="stat-card"><strong>${allUnits().filter((unit) => unit.status === "reviewed").length}개</strong><span>검수 완료 상세 단원</span></div>
          <div class="stat-card"><strong>${todaySolvedCount()}문제</strong><span>오늘 푼 문제</span></div>
          <div class="stat-card"><strong>${totalProgressPercent()}%</strong><span>전체 진행률</span></div>
        </div>
      </div>
      <aside class="hero-panel">
        <div class="panel-head">
          <h3>오늘의 학습 목표</h3>
          <span class="badge badge-soft">${todayUnits.length}단원 학습</span>
        </div>
        <p class="empty-copy">1개 단원 개념 정리 → 5문제 풀이 → 오답 1개 복습을 목표로 잡아 보세요.</p>
        <div class="recommend-stack">
          ${recommendations.map((unit) => `
            <button class="mini-unit" data-open-unit="${unit.subjectId}|${unit.gradeId}|${unit.id}">
              <span class="mini-unit-subject" style="--subject-color:${unit.subjectColor}">${unit.subjectIcon} ${unit.subjectName}</span>
              <strong>${unit.title}</strong>
              <small>${unit.gradeName} · 진행률 ${unitProgress(unit.id)}% · ${unit.questions.length}문항</small>
            </button>
          `).join("")}
        </div>
      </aside>
    </section>

    <section class="section">
      <div class="study-action-grid">
        ${primaryActions.map((action) => `
          <button class="study-action-card" data-route="${action.route}">
            <span class="action-icon">${action.icon}</span>
            <strong>${action.title}</strong>
            <p>${action.copy}</p>
            <span class="action-cta">${action.cta}</span>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="learning-flow">
      ${["과목 선택", "학년 선택", "단원 선택", "개념 학습", "문제 풀이", "오답 복습"].map((step, index) => `
        <div class="flow-step">
          <span>${index + 1}</span>
          <strong>${step}</strong>
        </div>
      `).join("")}
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">과목 선택</span>
          <h2>한눈에 들어오는 과목별 학습 입구</h2>
        </div>
        <p>귀여운 아이콘과 과목색으로 빠르게 이동하고, 진행률과 핵심 단원 수를 함께 볼 수 있습니다.</p>
      </div>
      <div class="subject-grid">
        ${subjects.map(renderSubjectCard).join("")}
      </div>
    </section>

    <section class="dashboard-grid">
      <article class="panel-card">
        <div class="panel-head">
          <h3>오늘 공부한 단원</h3>
          <span class="badge badge-soft">${todayUnits.length}개</span>
        </div>
        ${todayUnits.length ? `
          <div class="list-stack">
            ${todayUnits.map((unit) => `
              <button class="list-chip" data-open-unit="${unit.subjectId}|${unit.gradeId}|${unit.id}">
                ${unit.subjectIcon} ${unit.title}
              </button>
            `).join("")}
          </div>
        ` : `<p class="empty-copy">아직 오늘 학습한 단원이 없습니다. 단원 상세에 들어가면 오늘 학습 기록이 쌓입니다.</p>`}
      </article>
      <article class="panel-card">
        <div class="panel-head">
          <h3>약한 개념 추적</h3>
          <span class="badge badge-soft">${state.wrongNotes.length}문제</span>
        </div>
        ${state.wrongNotes.length ? `
          <div class="list-stack">
            ${state.wrongNotes.slice(0, 4).map((note) => `
              <button class="list-chip warn-chip" data-open-unit="${note.subjectId}|${note.gradeId}|${note.unitId}">
                ${note.subjectName} · ${note.unitTitle}
              </button>
            `).join("")}
          </div>
        ` : `<p class="empty-copy">틀린 문제가 생기면 이곳에 자동으로 모입니다.</p>`}
      </article>
      <article class="panel-card">
        <div class="panel-head">
          <h3>시험 직전 훑기</h3>
          <span class="badge badge-soft">핵심 모드</span>
        </div>
        <div class="tip-list">
          <p>핵심 용어 카드로 어려운 개념을 빠르게 뒤집어 보세요.</p>
          <p>단원마다 10줄 요약과 1분 요약이 따로 준비되어 있습니다.</p>
          <p>시험 대비 모드에서는 단원을 골라 랜덤 문제를 바로 풀 수 있습니다.</p>
        </div>
      </article>
    </section>
  `;
}

function renderSubjectCard(subject) {
  const unitCount = subject.grades.reduce((sum, grade) => sum + grade.units.length, 0);
  const allSubjectUnits = subject.grades.flatMap((grade) => grade.units);
  const conceptCount = allSubjectUnits.reduce((sum, unit) => sum + unit.coreConcepts.length, 0);
  const completed = allSubjectUnits.filter((unit) => unitProgress(unit.id) >= 100).length;
  const remaining = Math.max(unitCount - completed, 0);
  const nextUnit = nextUnitForSubject(subject);
  const progress = Math.round(
    allSubjectUnits.reduce((sum, unit) => sum + unitProgress(unit.id), 0) / Math.max(allSubjectUnits.length, 1)
  );
  return `
    <button class="subject-card" style="--subject-color:${subject.color}" data-open-subject="${subject.id}">
      <div class="subject-card-top">
        <span class="subject-icon">${subject.icon}</span>
        <span class="badge">${subjectStageLabels(subject).join(" · ")}</span>
      </div>
      <h3>${subject.name}</h3>
      <p>${subject.description}</p>
      <div class="subject-meta">
        <span>${unitCount}개 단원</span>
        <span>남은 단원 ${remaining}개</span>
        <span>${conceptCount}개 핵심 개념</span>
      </div>
      <div class="progress-row">
        <div class="progress-bar"><span style="width:${progress}%"></span></div>
        <strong>${progress}%</strong>
      </div>
      <div class="card-next-action">
        <span>이어서 공부하기</span>
        <strong>${nextUnit?.title || "단원 선택"}</strong>
      </div>
    </button>
  `;
}

function subjectStageLabels(subject) {
  const labels = [];
  if (subject.grades.some((grade) => grade.id.startsWith("elementary"))) labels.push("초등");
  if (subject.grades.some((grade) => grade.id.startsWith("middle"))) labels.push("중등");
  if (subject.grades.some((grade) => grade.id.startsWith("high"))) labels.push("고등");
  return labels;
}

function renderSubjectsPage() {
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">과목별 학습</span>
          <h2>과목별로 들어가 학년과 단원을 고르는 구조</h2>
        </div>
        <p>모든 과목은 같은 데이터 구조를 공유해서 나중에 단원을 계속 추가하기 쉽게 설계했습니다.</p>
      </div>
      <div class="subject-grid">
        ${subjects.map(renderSubjectCard).join("")}
      </div>
    </section>
  `;
}

function renderGradesPage() {
  const groups = [
    { key: "elementary3", title: "초등학교 3학년", items: unitsByGrade("elementary3") },
    { key: "elementary4", title: "초등학교 4학년", items: unitsByGrade("elementary4") },
    { key: "elementary5", title: "초등학교 5학년", items: unitsByGrade("elementary5") },
    { key: "elementary6", title: "초등학교 6학년", items: unitsByGrade("elementary6") },
    { key: "middle1", title: "중학교 1학년", items: unitsByGrade("middle1") },
    { key: "middle2", title: "중학교 2학년", items: unitsByGrade("middle2") },
    { key: "middle3", title: "중학교 3학년", items: unitsByGrade("middle3") },
    { key: "highCommon", title: "고등 공통/기초", items: unitsByGrade("highCommon") },
  ];
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">학년별 학습</span>
          <h2>학년을 기준으로 필요한 과목 단원을 모아 보기</h2>
        </div>
      </div>
      <div class="grade-panels">
        ${groups.map((group) => `
          <article class="panel-card">
            <div class="panel-head">
              <h3>${group.title}</h3>
              <span class="badge badge-soft">${group.items.length}개 단원</span>
            </div>
            <div class="list-stack">
              ${group.items.length ? group.items.map((unit) => `
                <button class="grade-unit-row" data-open-unit="${unit.subjectId}|${unit.gradeId}|${unit.id}">
                  <span class="grade-unit-tag" style="background:${unit.subjectColor}">${unit.subjectIcon}</span>
                  <span>
                    <strong>${unit.title}</strong>
                    <small>${unit.subjectName} · ${unit.field}</small>
                  </span>
                </button>
              `).join("") : `<p class="empty-copy">이 구간은 다음 확장 단원을 준비하기 좋은 자리입니다.</p>`}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function unitsByGrade(gradeId) {
  return allUnits().filter((unit) => unit.gradeId === gradeId);
}

function renderSubjectDetailPage() {
  const subject = getSubject(state.subjectId) || subjects[0];
  const activeGrade = getGrade(subject.id, state.gradeId) || subject.grades[0];
  return `
    <section class="subject-hero" style="--subject-color:${subject.color}">
      <div>
        <span class="eyebrow">${subject.icon} ${subject.name}</span>
        <h1>${subject.name} 학습 로드맵</h1>
        <p>${subject.description}</p>
      </div>
      <div class="subject-hero-meta">
        <span>${subject.grades.length}개 학년 구간</span>
        <span>${subject.grades.reduce((sum, grade) => sum + grade.units.length, 0)}개 단원</span>
      </div>
    </section>
    <section class="section">
      <div class="grade-tabs">
        ${subject.grades.map((grade) => `
          <button class="${grade.id === activeGrade.id ? "active" : ""}" data-select-grade="${grade.id}">
            ${grade.name}
          </button>
        `).join("")}
      </div>
      <div class="unit-grid">
        ${activeGrade.units.map((unit) => renderUnitCard(subject, activeGrade, unit)).join("")}
      </div>
    </section>
  `;
}

function renderUnitCard(subject, grade, unit) {
  const progress = unitProgress(unit.id);
  const favorite = isFavorite(unit.id);
  return `
    <button class="unit-card" style="--subject-color:${subject.color}" data-open-unit="${subject.id}|${grade.id}|${unit.id}">
      <div class="unit-card-top">
        <span class="badge">${unit.field}</span>
        <span class="badge badge-soft">${unit.difficulty}</span>
      </div>
      <div class="unit-card-top">
        <span class="status-badge ${statusClass(unit)}">${statusLabel(unit)}</span>
        <span class="favorite-dot ${favorite ? "active" : ""}">${favorite ? "★" : "☆"}</span>
      </div>
      <h3>${unit.title}</h3>
      <p>${unit.teaser}</p>
      <div class="unit-signal-grid">
        <span><strong>중요도</strong>${importanceLabel(unit)}</span>
        <span><strong>난이도</strong>${unit.difficulty}</span>
        <span><strong>문제</strong>${unit.questions.length}개</span>
        <span><strong>시간</strong>${unit.recommendedMinutes || 35}분</span>
        <span><strong>상태</strong>${completionLabel(unit)}</span>
      </div>
      <div class="unit-stats">
        <span>핵심 개념 ${unit.coreConcepts.length}개</span>
        <span>문제 ${unit.questions.length}개</span>
        <span>완성도 ${completionRatio(unit)}%</span>
      </div>
      <div class="progress-row">
        <div class="progress-bar"><span style="width:${progress}%"></span></div>
        <strong>${progress}%</strong>
      </div>
    </button>
  `;
}

function renderUnitPage() {
  const unit = getUnit(state.subjectId, state.gradeId, state.unitId);
  const subject = getSubject(state.subjectId);
  const grade = getGrade(state.subjectId, state.gradeId);
  if (!unit || !subject || !grade) return renderHome();
  const fullUnit = {
    ...unit,
    subjectId: subject.id,
    subjectName: subject.name,
    subjectColor: subject.color,
    subjectIcon: subject.icon,
    gradeId: grade.id,
    gradeName: grade.name,
  };
  markStudied(fullUnit);
  setProgress(fullUnit.id, Math.max(unitProgress(fullUnit.id), 18));
  return `
    <section class="unit-header" style="--subject-color:${subject.color}">
      <div class="breadcrumb">
        <button data-route="subjects">과목별 학습</button>
        <span>/</span>
        <button data-open-subject="${subject.id}">${subject.name}</button>
        <span>/</span>
        <span>${grade.name}</span>
        <span>/</span>
        <strong>${unit.title}</strong>
      </div>
      <div class="unit-header-grid">
        <div>
          <span class="eyebrow">${subject.icon} ${subject.name} · ${grade.name}</span>
          <h1>${unit.title}</h1>
          <p>${unit.teaser}</p>
        </div>
        <aside class="unit-header-side">
          <div class="badge-row">
            <span class="badge">${unit.field}</span>
            <span class="badge badge-soft">${unit.difficulty}</span>
            <span class="status-badge ${statusClass(unit)}">${statusLabel(unit)}</span>
          </div>
          <div class="support-metric">
            <strong>${completionRatio(unit)}%</strong>
            <span>자료 완성도 · ${unit.questions.length}문항</span>
          </div>
          ${unit.coverageNote ? `<p class="coverage-note">${unit.coverageNote}</p>` : ""}
          <button class="ghost-btn wide-btn" data-toggle-favorite="${unit.id}">${isFavorite(unit.id) ? "★ 즐겨찾기 해제" : "☆ 즐겨찾기 추가"}</button>
          <button class="primary-btn wide-btn" data-complete-unit="${unit.id}">학습 완료 체크</button>
          <button class="ghost-btn wide-btn" data-open-summary="${subject.id}|${grade.id}|${unit.id}">요약 화면 보기</button>
        </aside>
      </div>
      <nav class="unit-tabs">
        <button class="${state.unitTab === "overview" ? "active" : ""}" data-unit-tab="overview">개념 학습</button>
        <button class="${state.unitTab === "quiz" ? "active" : ""}" data-unit-tab="quiz">문제 풀기</button>
        <button class="${state.unitTab === "summary" ? "active" : ""}" data-unit-tab="summary">시험 직전 요약</button>
      </nav>
    </section>
    ${state.unitTab === "quiz" ? renderUnitQuiz(fullUnit) : state.unitTab === "summary" ? renderUnitSummary(fullUnit) : renderUnitOverview(fullUnit)}
  `;
}

function renderUnitOverview(unit) {
  return `
    <section class="content-layout">
      <div class="content-main">
        <article class="study-map-card">
          <div>
            <span class="eyebrow">한눈 요약</span>
            <h2>${unit.title} 공부 순서</h2>
          </div>
          <div class="study-map-grid">
            <span>핵심 개념 ${unit.coreConcepts.length}개</span>
            <span>공식/원리 ${unit.formulas.length + unit.principles.length}개</span>
            <span>시험 포인트 ${unit.examTips.length}개</span>
            <span>문제 ${unit.questions.length}개</span>
          </div>
          <ol class="quick-summary-list">
            ${unit.summary.tenLines.slice(0, 5).map((line) => `<li>${line}</li>`).join("")}
          </ol>
        </article>

        <article class="info-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">① 이 단원에서 배우는 것</span>
              <h2>성취기준을 학생 눈높이로 바꾼 학습 목표</h2>
            </div>
          </div>
          <ul class="bullet-list">
            ${unit.achievementGoals.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <div class="goal-box">
            <strong>시험에서 왜 중요한가?</strong>
            <p>${unit.examImportance}</p>
          </div>
        </article>

        <article class="info-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">② 핵심 개념 정리</span>
              <h2>쉬운 설명에서 시험식 설명까지</h2>
            </div>
          </div>
          <div class="concept-stack">
            ${unit.coreConcepts.map((concept) => `
              <section class="concept-card" id="concept-${slug(concept.term)}">
                <div class="concept-card-head">
                  <h3>${concept.term}</h3>
                  <span class="badge badge-soft">시험 핵심</span>
                </div>
                <div class="concept-detail-grid">
                  <p><strong>뜻</strong><span>${concept.simple}</span></p>
                  <p><strong>쉽게 이해</strong><span>${concept.detailed}</span></p>
                  <p><strong>시험 포인트</strong><span>${concept.exam}</span></p>
                  <p><strong>암기 팁</strong><span>${concept.term}를 예시, 반례, 문제 조건과 함께 묶어 기억하세요.</span></p>
                </div>
              </section>
            `).join("")}
          </div>
          <div class="term-grid">
            ${unit.keyTerms.map((term) => `
              <article class="term-card">
                <strong>${term.term}</strong>
                <p>${term.meaning}</p>
              </article>
            `).join("")}
          </div>
        </article>

        <article class="info-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">③ 원리와 이유</span>
              <h2>왜 그런지까지 이어서 이해하기</h2>
            </div>
          </div>
          <div class="principle-grid">
            ${unit.principles.map((item) => `
              <article class="principle-card">
                <h3>${item.title}</h3>
                <p>${item.body}</p>
              </article>
            `).join("")}
          </div>
          ${unit.formulas.length ? `
            <div class="formula-box">
              <h3>공식 · 법칙 · 이론</h3>
              ${unit.formulas.map((item) => `
                <div class="formula-row">
                  <strong>${item.name || item.title}</strong>
                  ${item.formula ? `<code>${item.formula}</code>` : ""}
                  <p>${item.meaning || item.body}</p>
                </div>
              `).join("")}
            </div>
          ` : ""}
        </article>

        <article class="info-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">④ 반드시 외워야 할 것</span>
              <h2>암기 포인트와 헷갈리는 비교</h2>
            </div>
          </div>
          <div class="two-col">
            <div>
              <h3>핵심 암기</h3>
              <ul class="bullet-list">
                ${unit.mustMemorize.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
            <div>
              <h3>헷갈리는 개념 비교</h3>
              <ul class="bullet-list">
                ${unit.commonMistakes.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
          </div>
        </article>

        <article class="info-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">⑤ 예시와 적용</span>
              <h2>실생활, 교과서형, 시험형 예시</h2>
            </div>
          </div>
          <div class="example-grid">
            ${unit.examples.map((item) => `
              <article class="example-card">
                <span class="badge badge-soft">${item.kind}</span>
                <h3>${item.title}</h3>
                <p>${item.body}</p>
              </article>
            `).join("")}
          </div>
        </article>

        ${unit.comparisonTable?.length ? `
          <article class="info-card">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">비교표</span>
                <h2>헷갈리는 개념을 한눈에 구분하기</h2>
              </div>
            </div>
            <div class="compare-table">
              ${unit.comparisonTable.map((row) => `
                <div class="compare-row">
                  <strong>${row.label}</strong>
                  <span>${row.value}</span>
                </div>
              `).join("")}
            </div>
          </article>
        ` : ""}

        ${unit.conversation?.length ? `
          <article class="info-card">
            <div class="section-head compact">
              <div>
                <span class="eyebrow">영어 회화 칸</span>
                <h2>문법을 실제 말하기 표현으로 이어 보기</h2>
              </div>
            </div>
            <div class="example-grid">
              ${unit.conversation.map((item) => `
                <article class="example-card">
                  <span class="badge badge-soft">${item.situation}</span>
                  <h3>${item.expression}</h3>
                  <p><strong>뜻:</strong> ${item.meaning}</p>
                  <p><strong>활용:</strong> ${item.tip}</p>
                </article>
              `).join("")}
            </div>
          </article>
        ` : ""}

        <article class="info-card">
          <div class="section-head compact">
            <div>
              <span class="eyebrow">⑥ 만점 포인트</span>
              <h2>시험에 자주 나오는 함정과 답안 전략</h2>
            </div>
          </div>
          <ul class="bullet-list">
            ${unit.examTips.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      </div>

      <aside class="content-side">
        <article class="side-card study-helper">
          <h3>학습 보조</h3>
          <div class="helper-row">
            <span>완성 상태</span>
            <strong>${statusLabel(unit)}</strong>
          </div>
          <div class="helper-row">
            <span>예상 학습</span>
            <strong>${unit.recommendedMinutes || 35}분</strong>
          </div>
          <div class="helper-row">
            <span>문제 수</span>
            <strong>${unit.questions.length}개</strong>
          </div>
          <button class="primary-btn wide-btn" data-unit-tab="quiz">문제 바로 풀기</button>
          <button class="ghost-btn wide-btn" data-route="wrong">오답노트 보기</button>
        </article>
        ${unit.studyChecklist?.length ? `
          <article class="side-card">
            <h3>만점 체크리스트</h3>
            <ul class="bullet-list">
              ${unit.studyChecklist.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        ` : ""}
        <article class="side-card">
          <h3>관련 인물</h3>
          <div class="side-list">
            ${unit.relatedFigures.length ? unit.relatedFigures.map((figure) => `
              <div class="figure-row">
                <strong>${figure.name}</strong>
                <p>${figure.work}</p>
              </div>
            `).join("") : `<p class="empty-copy">이 단원은 특정 인물보다 개념 연결이 중심입니다.</p>`}
          </div>
        </article>
        <article class="side-card">
          <h3>개념 카드</h3>
          <div class="flash-grid">
            ${unit.flashcards.map((card) => renderFlashCard(card)).join("")}
          </div>
        </article>
      </aside>
    </section>
  `;
}

function renderFlashCard(card) {
  const key = `${card.unitId}:${card.front}`;
  const flipped = state.flippedCards.has(key);
  return `
    <button class="flash-card ${flipped ? "flipped" : ""}" data-flip-card="${key}">
      <span class="flash-label">${flipped ? "뒷면" : "앞면"}</span>
      <strong>${flipped ? card.back : card.front}</strong>
    </button>
  `;
}

function renderUnitQuiz(unit) {
  setProgress(unit.id, Math.max(unitProgress(unit.id), 32));
  const session = quizFor(unit);
  const currentQuestion = unit.questions[session.index];
  const total = unit.questions.length;
  if (!currentQuestion || session.finished) {
    const score = Math.round((session.correct / Math.max(session.submitted, 1)) * 100);
    return `
      <section class="section quiz-section">
        <article class="result-card quiz-result-card">
          <div class="panel-head">
            <div>
              <span class="eyebrow">문제 풀이 완료</span>
              <h2>${unit.title} 결과</h2>
            </div>
            <span class="badge">${score}%</span>
          </div>
          <p>정답 ${session.correct}개 / 제출 ${session.submitted}개 / 전체 ${total}문제</p>
          <p>틀린 문제는 자동으로 오답노트에 저장되었습니다. 다시 풀 때는 개념 카드와 해설을 먼저 확인해 보세요.</p>
          <div class="quiz-actions">
            <button class="primary-btn" data-restart-quiz="${unit.id}">처음부터 다시 풀기</button>
            <button class="ghost-btn" data-route="wrong">오답노트 보기</button>
          </div>
        </article>
      </section>
    `;
  }
  return `
    <section class="section quiz-section">
      <div class="section-head">
        <div>
          <span class="eyebrow">⑦ 문제 풀기</span>
          <h2>선택 · 제출 · 해설 · 다음 문제 흐름</h2>
        </div>
        <p>${session.index + 1}/${total}문제 · 제출하면 정답과 해설이 바로 나오고, 오답은 오답노트에 저장됩니다.</p>
      </div>
      <div class="quiz-status-grid">
        <span><strong>현재 문제</strong>${session.index + 1}번</span>
        <span><strong>남은 문제</strong>${Math.max(total - session.index - 1, 0)}개</span>
        <span><strong>난이도</strong>${currentQuestion.difficulty}</span>
        <span><strong>유형</strong>${currentQuestion.type || currentQuestion.category}</span>
      </div>
      <div class="progress-row quiz-progress">
        <div class="progress-bar"><span style="width:${Math.round(((session.index + 1) / total) * 100)}%"></span></div>
        <strong>${Math.round(((session.index + 1) / total) * 100)}%</strong>
      </div>
      ${renderQuestion(unit, currentQuestion, session.index, session)}
    </section>
  `;
}

function renderQuestion(unit, question, index, session = null) {
  const answer = state.answers[question.id];
  const checked = state.checked[question.id];
  const correct = checked ? isCorrect(question, answer) : false;
  const canGoNext = checked && session && index < unit.questions.length - 1;
  return `
    <article class="quiz-card">
      <div class="quiz-meta">
        <span class="badge">${question.category}</span>
        <span class="badge badge-soft">${question.difficulty}</span>
        <span class="badge badge-soft">문제 ${index + 1}</span>
      </div>
      <h3>${question.prompt}</h3>
      ${question.options ? `
        <div class="option-list">
          ${question.options.map((option, optionIndex) => `
            <button class="option-btn ${answer === optionIndex ? "selected" : ""}" data-answer="${question.id}|${optionIndex}">
              ${option}
            </button>
          `).join("")}
        </div>
      ` : `
        <textarea class="answer-input" data-text-answer="${question.id}" placeholder="답을 직접 적어 보세요">${escapeHtml(answer || "")}</textarea>
      `}
      <div class="quiz-actions">
        <button class="primary-btn" data-check-question="${unit.subjectId}|${unit.gradeId}|${unit.id}|${question.id}">정답 확인</button>
        ${canGoNext ? `<button class="primary-btn" data-next-question="${unit.id}">다음 문제</button>` : ""}
        ${checked && session && index >= unit.questions.length - 1 ? `<button class="primary-btn" data-finish-quiz="${unit.id}">결과 보기</button>` : ""}
        <button class="ghost-btn" data-jump-concept="${slug(question.relatedConcept)}">관련 개념 보기</button>
      </div>
      ${checked ? `
        <div class="feedback-box ${correct ? "is-correct" : "is-wrong"}">
          <strong>${correct ? "✓ 정답입니다." : "오답입니다. 오답노트에 저장됐습니다."}</strong>
          <p><strong>내 답:</strong> ${question.options ? question.options[answer] ?? "미선택" : escapeHtml(answer || "미입력")}</p>
          <p><strong>정답:</strong> ${question.options ? question.options[question.answer] : question.answer}</p>
          <p><strong>해설:</strong> ${question.explanation}</p>
          ${question.wrongReasons?.length ? `
            <div class="wrong-reason-box">
              <strong>다른 선택지가 왜 틀렸는지</strong>
              <ul class="bullet-list">
                ${question.wrongReasons.map((reason) => `<li>${reason}</li>`).join("")}
              </ul>
            </div>
          ` : ""}
          <div class="quiz-actions">
            <button class="ghost-btn" data-retry-question="${question.id}">이 문제 다시 풀기</button>
            <button class="ghost-btn" data-jump-concept="${slug(question.relatedConcept)}">관련 개념 복습</button>
          </div>
        </div>
      ` : ""}
    </article>
  `;
}

function renderUnitSummary(unit) {
  setProgress(unit.id, Math.max(unitProgress(unit.id), 64));
  return `
    <section class="summary-page print-page">
      <div class="summary-head">
        <div>
          <span class="eyebrow">⑧ 단원 마지막 요약</span>
          <h2>${unit.title} 시험 직전 요약본</h2>
        </div>
        <button class="ghost-btn" data-print-summary>인쇄/캡처용 열기</button>
      </div>
      <article class="summary-card">
        <h3>10줄 요약</h3>
        <ol class="number-list">
          ${unit.summary.tenLines.map((line) => `<li>${line}</li>`).join("")}
        </ol>
      </article>
      <article class="summary-card">
        <h3>표 요약</h3>
        <div class="summary-table">
          ${unit.summary.table.map((row) => `
            <div class="summary-table-row">
              <strong>${row.label}</strong>
              <span>${row.value}</span>
            </div>
          `).join("")}
        </div>
      </article>
      <article class="summary-card">
        <h3>시험 직전 1분 요약</h3>
        <p>${unit.summary.oneMinute}</p>
      </article>
      <article class="summary-card">
        <h3>빈칸 암기 체크</h3>
        <ul class="bullet-list">
          ${unit.summary.blanks.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    </section>
  `;
}

function renderConceptHub() {
  const filteredSubjects = state.conceptFilter === "all"
    ? subjects
    : subjects.filter((subject) => subject.id === state.conceptFilter);
  const cards = filteredSubjects.flatMap((subject) =>
    subject.grades.flatMap((grade) =>
      grade.units.slice(0, 2).flatMap((unit) =>
        unit.flashcards.slice(0, 4).map((card) => ({
          ...card,
          unitTitle: unit.title,
          subjectName: subject.name,
          subjectColor: subject.color,
        }))
      )
    )
  );
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">만점 개념 정리</span>
          <h2>어려운 개념을 카드처럼 뒤집어 빠르게 복습</h2>
        </div>
        <select id="concept-filter" class="filter-select">
          <option value="all">전체 과목</option>
          ${subjects.map((subject) => `<option value="${subject.id}" ${state.conceptFilter === subject.id ? "selected" : ""}>${subject.name}</option>`).join("")}
        </select>
      </div>
      <div class="concept-hub-grid">
        ${cards.map((card) => renderFlashCard(card)).join("")}
      </div>
    </section>
  `;
}

function renderPracticeHub() {
  const filtered = state.practiceFilter === "all"
    ? allUnits()
    : allUnits().filter((unit) => unit.subjectId === state.practiceFilter);
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">문제 풀기</span>
          <h2>단원별로 들어가 바로 문제를 푸는 입구</h2>
        </div>
        <select id="practice-filter" class="filter-select">
          <option value="all">전체 과목</option>
          ${subjects.map((subject) => `<option value="${subject.id}" ${state.practiceFilter === subject.id ? "selected" : ""}>${subject.name}</option>`).join("")}
        </select>
      </div>
      <div class="practice-grid">
        ${filtered.map((unit) => `
          <button class="practice-card" data-open-unit="${unit.subjectId}|${unit.gradeId}|${unit.id}">
            <span class="badge" style="background:${unit.subjectColor}">${unit.subjectIcon} ${unit.subjectName}</span>
            <h3>${unit.title}</h3>
            <p>${unit.gradeName} · ${unit.field} · ${unit.questions.length}문제</p>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function wrongNoteAnalysis(notes) {
  const bySubject = notes.reduce((map, note) => {
    map[note.subjectName] = (map[note.subjectName] || 0) + 1;
    return map;
  }, {});
  const byConcept = notes.reduce((map, note) => {
    const key = note.relatedConcept || note.unitTitle;
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});
  return {
    bySubject: Object.entries(bySubject).sort((a, b) => b[1] - a[1]),
    byConcept: Object.entries(byConcept).sort((a, b) => b[1] - a[1]).slice(0, 5),
    reviewed: notes.filter((note) => note.reviewed).length,
  };
}

function renderWrongNotes() {
  const filteredNotes = state.wrongFilter === "all"
    ? state.wrongNotes
    : state.wrongNotes.filter((note) => note.subjectId === state.wrongFilter);
  const analysis = wrongNoteAnalysis(filteredNotes);
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">오답노트</span>
          <h2>약점 분석과 다시 풀기 중심 복습</h2>
        </div>
        <select id="wrong-filter" class="filter-select">
          <option value="all">전체 과목</option>
          ${subjects.map((subject) => `<option value="${subject.id}" ${state.wrongFilter === subject.id ? "selected" : ""}>${subject.name}</option>`).join("")}
        </select>
      </div>
      <div class="wrong-analysis-grid">
        <article class="panel-card">
          <strong>${filteredNotes.length}</strong>
          <span>복습할 오답</span>
        </article>
        <article class="panel-card">
          <strong>${analysis.reviewed}</strong>
          <span>복습 완료</span>
        </article>
        <article class="panel-card">
          <strong>${analysis.bySubject[0]?.[0] || "아직 없음"}</strong>
          <span>가장 약한 과목</span>
        </article>
        <article class="panel-card">
          <strong>${analysis.byConcept[0]?.[0] || "아직 없음"}</strong>
          <span>가장 약한 개념</span>
        </article>
      </div>
      ${analysis.byConcept.length ? `
        <article class="panel-card weakness-card">
          <div class="panel-head">
            <h3>약점 TOP ${analysis.byConcept.length}</h3>
            <span class="badge badge-soft">많이 틀린 개념부터 복습</span>
          </div>
          <div class="weakness-list">
            ${analysis.byConcept.map(([concept, count]) => `
              <span><strong>${concept}</strong>${count}회</span>
            `).join("")}
          </div>
        </article>
      ` : ""}
      <div class="wrong-note-stack">
        ${filteredNotes.length ? filteredNotes.map((note) => `
          <article class="wrong-note-card ${note.reviewed ? "is-reviewed" : ""}">
            <div class="panel-head">
              <div>
                <span class="badge">${note.subjectName}</span>
                <span class="badge badge-soft">${note.gradeName}</span>
                <span class="badge badge-soft">${note.createdAt ? new Date(note.createdAt).toLocaleDateString("ko-KR") : "날짜 없음"}</span>
              </div>
              <div class="quiz-actions">
                <button class="primary-btn" data-open-unit-quiz="${note.subjectId}|${note.gradeId}|${note.unitId}">다시 풀기</button>
                <button class="ghost-btn" data-open-unit="${note.subjectId}|${note.gradeId}|${note.unitId}">관련 개념</button>
              </div>
            </div>
            <h3>${note.unitTitle}</h3>
            <p>${note.prompt}</p>
            <p><strong>내 답:</strong> ${note.userAnswer ?? "미입력"}</p>
            <p><strong>정답:</strong> ${note.correctAnswer}</p>
            <p><strong>해설:</strong> ${note.explanation}</p>
            <label class="memo-label">
              <span>틀린 이유 메모</span>
              <textarea data-note-memo="${note.id}" placeholder="예: 열과 온도를 헷갈림, 부호 처리 실수">${escapeHtml(note.memo || "")}</textarea>
            </label>
            <div class="quiz-actions">
              <button class="ghost-btn" data-review-note="${note.id}">${note.reviewed ? "복습 완료 해제" : "복습 완료"}</button>
              <button class="ghost-btn danger-btn" data-delete-note="${note.id}">삭제</button>
            </div>
          </article>
        `).join("") : `<div class="empty-panel">아직 저장된 오답이 없습니다. 문제를 풀다가 틀리면 이곳에 자동으로 저장됩니다.</div>`}
      </div>
    </section>
  `;
}

function renderExamMode() {
  const unitPool = allUnits().filter((unit) => {
    if (state.exam.subjectId !== "all" && unit.subjectId !== state.exam.subjectId) return false;
    if (state.exam.gradeId !== "all" && unit.gradeId !== state.exam.gradeId) return false;
    return true;
  });
  const selectedUnits = state.exam.unitIds.length
    ? unitPool.filter((unit) => state.exam.unitIds.includes(unit.id))
    : unitPool.slice(0, 4);
  const questionPool = selectedUnits.flatMap((unit) =>
    unit.questions.slice(0, 4).map((question) => ({ ...question, sourceUnit: unit }))
  );
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">시험 대비 모드</span>
          <h2>단원을 골라 랜덤 문제로 점검하기</h2>
        </div>
      </div>
      <article class="exam-config">
        <div class="exam-filters">
          <select id="exam-subject" class="filter-select">
            <option value="all">전체 과목</option>
            ${subjects.map((subject) => `<option value="${subject.id}" ${state.exam.subjectId === subject.id ? "selected" : ""}>${subject.name}</option>`).join("")}
          </select>
          <select id="exam-grade" class="filter-select">
            <option value="all">전체 학년</option>
            ${["elementary3", "elementary4", "elementary5", "elementary6", "middle1", "middle2", "middle3", "highCommon"].map((gradeId) => `
              <option value="${gradeId}" ${state.exam.gradeId === gradeId ? "selected" : ""}>${gradeLabels[gradeId]}</option>
            `).join("")}
          </select>
          <select id="exam-duration" class="filter-select">
            ${[
              [600, "10분"],
              [900, "15분"],
              [1200, "20분"],
            ].map(([sec, label]) => `<option value="${sec}" ${state.exam.durationSec === sec ? "selected" : ""}>${label}</option>`).join("")}
          </select>
          <button class="primary-btn" data-start-exam>랜덤 시험 시작</button>
        </div>
        <p class="empty-copy">현재 범위에서는 ${selectedUnits.length}개 단원, ${questionPool.length}개 문제가 시험 후보로 들어갑니다.</p>
      </article>
      ${state.exam.active ? renderExamSession() : ""}
      ${state.exam.result ? renderExamResult() : ""}
    </section>
  `;
}

function renderExamSession() {
  const questions = state.exam.questionIds
    .map((item) => findQuestionByCompositeId(item))
    .filter(Boolean);
  return `
    <article class="exam-session">
      <div class="exam-session-head">
        <div>
          <h3>실전 점검 진행 중</h3>
          <p>${questions.length}문제 · 남은 시간 ${formatTime(state.exam.remainingSec)}</p>
        </div>
        <button class="ghost-btn" data-submit-exam>채점하기</button>
      </div>
      <div class="quiz-stack">
        ${questions.map((entry, index) => renderExamQuestion(entry, index)).join("")}
      </div>
    </article>
  `;
}

function renderExamQuestion(entry, index) {
  const key = entry.compositeId;
  const answer = state.exam.answers[key];
  return `
    <article class="quiz-card">
      <div class="quiz-meta">
        <span class="badge">${entry.unit.subjectName}</span>
        <span class="badge badge-soft">${entry.question.difficulty}</span>
        <span class="badge badge-soft">문제 ${index + 1}</span>
      </div>
      <h3>${entry.question.prompt}</h3>
      ${entry.question.options ? `
        <div class="option-list">
          ${entry.question.options.map((option, optionIndex) => `
            <button class="option-btn ${answer === optionIndex ? "selected" : ""}" data-exam-answer="${key}|${optionIndex}">
              ${option}
            </button>
          `).join("")}
        </div>
      ` : `
        <textarea class="answer-input" data-exam-text="${key}" placeholder="답을 입력하세요">${escapeHtml(answer || "")}</textarea>
      `}
    </article>
  `;
}

function renderExamResult() {
  return `
    <article class="result-card">
      <div class="panel-head">
        <h3>시험 결과</h3>
        <span class="badge">${state.exam.result.score}%</span>
      </div>
      <p>정답 ${state.exam.result.correctCount}개 / 전체 ${state.exam.result.totalCount}개</p>
      <p><strong>약한 개념 추천:</strong> ${state.exam.result.weakConcepts.join(", ") || "없음"}</p>
    </article>
  `;
}

function renderTracker() {
  const bySubject = subjects.map((subject) => {
    const units = subject.grades.flatMap((grade) => grade.units);
    const avg = Math.round(units.reduce((sum, unit) => sum + unitProgress(unit.id), 0) / Math.max(units.length, 1));
    return { subject, avg, count: units.filter((unit) => unitProgress(unit.id) >= 100).length, total: units.length };
  });
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">학습 진도표</span>
          <h2>과목별 진행 상황과 오늘 학습 흐름</h2>
        </div>
      </div>
      <div class="tracker-grid">
        ${bySubject.map(({ subject, avg, count, total }) => `
          <article class="panel-card">
            <div class="panel-head">
              <h3>${subject.icon} ${subject.name}</h3>
              <span class="badge badge-soft">${count}/${total} 완료</span>
            </div>
            <div class="progress-row big-progress">
              <div class="progress-bar"><span style="width:${avg}%; background:${subject.color}"></span></div>
              <strong>${avg}%</strong>
            </div>
          </article>
        `).join("")}
      </div>
      <article class="panel-card">
        <div class="panel-head">
          <h3>오늘 학습한 단원</h3>
          <span class="badge badge-soft">${(state.studiedToday[todayKey()] || []).length}개</span>
        </div>
        <div class="list-stack">
          ${(state.studiedToday[todayKey()] || []).map((id) => {
            const unit = allUnits().find((item) => item.id === id);
            return unit ? `<button class="list-chip" data-open-unit="${unit.subjectId}|${unit.gradeId}|${unit.id}">${unit.subjectName} · ${unit.title}</button>` : "";
          }).join("") || `<p class="empty-copy">오늘 아직 기록된 학습이 없습니다.</p>`}
        </div>
      </article>
    </section>
  `;
}

function renderCoveragePage() {
  const rows = coverageRows();
  const statusCounts = rows.reduce((map, unit) => {
    const key = unit.status || "lessonDraft";
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});
  const reviewed = rows.filter((unit) => unit.status === "reviewed").length;
  const outlineOnly = rows.filter((unit) => unit.status === "outlineOnly");
  const bySubject = subjects.map((subject) => {
    const units = rows.filter((unit) => unit.subjectId === subject.id);
    const complete = units.filter((unit) => unit.status === "reviewed").length;
    return { subject, units, complete };
  });

  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">교육과정 커버리지</span>
          <h2>전체 목차와 완성 상태를 솔직하게 확인하기</h2>
        </div>
        <p>검수 완료 단원만 완성으로 표시하고, 목차만 있는 단원은 보강 예정으로 분리했습니다.</p>
      </div>

      <div class="coverage-summary">
        <article class="panel-card">
          <strong>${subjects.length}</strong>
          <span>과목</span>
        </article>
        <article class="panel-card">
          <strong>${rows.length}</strong>
          <span>전체 단원 목차</span>
        </article>
        <article class="panel-card">
          <strong>${reviewed}</strong>
          <span>검수 완료 상세 단원</span>
        </article>
        <article class="panel-card">
          <strong>${outlineOnly.length}</strong>
          <span>보강 예정 단원</span>
        </article>
      </div>

      <article class="panel-card">
        <div class="panel-head">
          <h3>상태별 현황</h3>
          <span class="badge badge-soft">outlineOnly · lessonDraft · reviewed</span>
        </div>
        <div class="status-strip">
          ${Object.entries(statusCounts).map(([status, count]) => `
            <span class="status-badge status-${status}">${status} ${count}개</span>
          `).join("")}
        </div>
      </article>

      <div class="coverage-grid">
        ${bySubject.map(({ subject, units, complete }) => `
          <article class="coverage-card" style="--subject-color:${subject.color}">
            <div class="panel-head">
              <h3>${subject.icon} ${subject.name}</h3>
              <span class="badge badge-soft">${complete}/${units.length} 검수 완료</span>
            </div>
            <div class="progress-row">
              <div class="progress-bar"><span style="width:${Math.round((complete / Math.max(units.length, 1)) * 100)}%; background:${subject.color}"></span></div>
              <strong>${Math.round((complete / Math.max(units.length, 1)) * 100)}%</strong>
            </div>
            <div class="coverage-unit-list">
              ${units.slice(0, 10).map((unit) => `
                <button class="coverage-unit" data-open-unit="${unit.subjectId}|${unit.gradeId}|${unit.id}">
                  <span class="status-badge ${statusClass(unit)}">${statusLabel(unit)}</span>
                  <strong>${unit.title}</strong>
                  <small>${unit.gradeName} · ${unit.questions.length}문항 · 완성도 ${unit.ratio}%</small>
                </button>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </div>

      <article class="panel-card">
        <div class="panel-head">
          <h3>보강이 필요한 단원</h3>
          <span class="badge badge-soft">${outlineOnly.length}개</span>
        </div>
        <div class="missing-grid">
          ${outlineOnly.slice(0, 48).map((unit) => `
            <button class="list-chip missing-chip" data-open-unit="${unit.subjectId}|${unit.gradeId}|${unit.id}">
              ${unit.subjectIcon} ${unit.subjectName} · ${unit.gradeName} · ${unit.title}
            </button>
          `).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderSearchPage() {
  state.searchResults = searchContent(state.query);
  return `
    <section class="section">
      <div class="section-head">
        <div>
          <span class="eyebrow">검색 결과</span>
          <h2>“${escapeHtml(state.query)}”와(과) 관련된 단원</h2>
        </div>
      </div>
      <div class="practice-grid">
        ${state.searchResults.length ? state.searchResults.map((unit) => `
          <button class="practice-card" data-open-unit="${unit.subjectId}|${unit.gradeId}|${unit.id}">
            <span class="badge" style="background:${unit.subjectColor}">${unit.subjectIcon} ${unit.subjectName}</span>
            <h3>${unit.title}</h3>
            <p>${unit.gradeName} · ${unit.field}</p>
          </button>
        `).join("") : `<div class="empty-panel">검색 결과가 없습니다. 과목명, 단원명, 개념명으로 다시 검색해 보세요.</div>`}
      </div>
    </section>
  `;
}

function isCorrect(question, answer) {
  if (question.options) return Number(answer) === question.answer;
  const normalizedAnswer = String(answer || "").replace(/\s+/g, "").toLowerCase();
  const normalizedKey = String(question.answer).replace(/\s+/g, "").toLowerCase();
  return normalizedAnswer.includes(normalizedKey);
}

function findQuestionByCompositeId(compositeId) {
  const [unitId, questionId] = compositeId.split("::");
  const unit = allUnits().find((item) => item.id === unitId);
  if (!unit) return null;
  const question = unit.questions.find((item) => item.id === questionId);
  if (!question) return null;
  return { compositeId, unit, question };
}

function startExam() {
  const pool = allUnits().filter((unit) => {
    if (state.exam.subjectId !== "all" && unit.subjectId !== state.exam.subjectId) return false;
    if (state.exam.gradeId !== "all" && unit.gradeId !== state.exam.gradeId) return false;
    return true;
  });
  const shuffledQuestions = pool
    .flatMap((unit) => unit.questions.slice(0, 4).map((question) => `${unit.id}::${question.id}`))
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  state.exam.active = true;
  state.exam.startedAt = Date.now();
  state.exam.remainingSec = state.exam.durationSec;
  state.exam.questionIds = shuffledQuestions;
  state.exam.answers = {};
  state.exam.checked = false;
  state.exam.result = null;
  syncExamTimer();
  render();
}

function syncExamTimer() {
  if (!state.exam.active) return;
  if (examTimer) clearInterval(examTimer);
  examTimer = setInterval(() => {
    state.exam.remainingSec -= 1;
    const timerNode = document.querySelector(".exam-session-head p");
    if (timerNode) timerNode.textContent = `${state.exam.questionIds.length}문제 · 남은 시간 ${formatTime(state.exam.remainingSec)}`;
    if (state.exam.remainingSec <= 0) submitExam();
  }, 1000);
}

function submitExam() {
  if (examTimer) clearInterval(examTimer);
  const entries = state.exam.questionIds.map((id) => findQuestionByCompositeId(id)).filter(Boolean);
  let correctCount = 0;
  const weak = [];
  entries.forEach((entry) => {
    const userAnswer = state.exam.answers[entry.compositeId];
    const correct = isCorrect(entry.question, userAnswer);
    if (correct) {
      correctCount += 1;
    } else {
      weak.push(entry.question.relatedConcept);
      recordWrongNote(entry.unit, entry.question, userAnswer);
    }
  });
  state.exam.active = false;
  state.exam.result = {
    totalCount: entries.length,
    correctCount,
    score: Math.round((correctCount / Math.max(entries.length, 1)) * 100),
    weakConcepts: [...new Set(weak)].slice(0, 5),
  };
  recordSolvedQuestion(entries.length);
  save(storageKeys.wrong, state.wrongNotes);
  render();
}

function formatTime(sec) {
  const safe = Math.max(sec, 0);
  const minutes = String(Math.floor(safe / 60)).padStart(2, "0");
  const seconds = String(safe % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target.id === "global-search") {
    state.query = target.value;
    render();
    const input = document.getElementById("global-search");
    if (input) input.focus();
  }
  if (target.matches("[data-text-answer]")) {
    state.answers[target.dataset.textAnswer] = target.value;
  }
  if (target.matches("[data-note-memo]")) {
    const note = state.wrongNotes.find((item) => item.id === target.dataset.noteMemo);
    if (note) {
      note.memo = target.value;
      save(storageKeys.wrong, state.wrongNotes);
    }
  }
  if (target.matches("[data-exam-text]")) {
    state.exam.answers[target.dataset.examText] = target.value;
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.id === "concept-filter") {
    state.conceptFilter = target.value;
    render();
  }
  if (target.id === "practice-filter") {
    state.practiceFilter = target.value;
    render();
  }
  if (target.id === "wrong-filter") {
    state.wrongFilter = target.value;
    render();
  }
  if (target.id === "exam-subject") {
    state.exam.subjectId = target.value;
    render();
  }
  if (target.id === "exam-grade") {
    state.exam.gradeId = target.value;
    render();
  }
  if (target.id === "exam-duration") {
    state.exam.durationSec = Number(target.value);
    state.exam.remainingSec = Number(target.value);
  }
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.route) {
    state.query = "";
    ensureRoute(button.dataset.route);
    return;
  }

  if (button.dataset.openSubject) {
    state.query = "";
    openSubject(button.dataset.openSubject);
    return;
  }

  if (button.dataset.selectGrade) {
    state.gradeId = button.dataset.selectGrade;
    render();
    return;
  }

  if (button.dataset.openUnit) {
    state.query = "";
    const [subjectId, gradeId, unitId] = button.dataset.openUnit.split("|");
    switchToUnit(subjectId, gradeId, unitId);
    return;
  }

  if (button.dataset.unitTab) {
    state.unitTab = button.dataset.unitTab;
    render();
    return;
  }

  if (button.dataset.flipCard) {
    const key = button.dataset.flipCard;
    if (state.flippedCards.has(key)) state.flippedCards.delete(key);
    else state.flippedCards.add(key);
    render();
    return;
  }

  if (button.dataset.answer) {
    const [questionId, value] = button.dataset.answer.split("|");
    state.answers[questionId] = Number(value);
    render();
    return;
  }

  if (button.dataset.checkQuestion) {
    const [subjectId, gradeId, unitId, questionId] = button.dataset.checkQuestion.split("|");
    const unit = getUnit(subjectId, gradeId, unitId);
    const subject = getSubject(subjectId);
    const grade = getGrade(subjectId, gradeId);
    if (!unit || !subject || !grade) return;
    const fullUnit = { ...unit, subjectId, subjectName: subject.name, gradeId, gradeName: grade.name, subjectColor: subject.color, subjectIcon: subject.icon };
    const question = unit.questions.find((item) => item.id === questionId);
    if (!question) return;
    const wasChecked = Boolean(state.checked[questionId]);
    state.checked[questionId] = true;
    const correct = isCorrect(question, state.answers[questionId]);
    if (!correct) recordWrongNote(fullUnit, question, state.answers[questionId]);
    else setProgress(unitId, Math.min(100, Math.max(unitProgress(unitId), 70)));
    const session = state.quizSession[unitId];
    if (session && !wasChecked) {
      session.submitted += 1;
      if (correct) session.correct += 1;
      recordSolvedQuestion();
    }
    const checkedCount = Object.keys(state.checked).length;
    if (checkedCount >= unit.questions.length) setProgress(unitId, 100);
    render();
    return;
  }

  if (button.dataset.nextQuestion) {
    const session = state.quizSession[button.dataset.nextQuestion];
    if (session) session.index = Math.min(session.index + 1, session.questionIds.length - 1);
    render();
    return;
  }

  if (button.dataset.retryQuestion) {
    const questionId = button.dataset.retryQuestion;
    const unit = getUnit(state.subjectId, state.gradeId, state.unitId);
    const question = unit?.questions.find((item) => item.id === questionId);
    const session = state.quizSession[state.unitId];
    if (question && session && state.checked[questionId]) {
      session.submitted = Math.max(0, session.submitted - 1);
      if (isCorrect(question, state.answers[questionId])) session.correct = Math.max(0, session.correct - 1);
    }
    delete state.answers[questionId];
    delete state.checked[questionId];
    render();
    return;
  }

  if (button.dataset.openUnitQuiz) {
    state.query = "";
    const [subjectId, gradeId, unitId] = button.dataset.openUnitQuiz.split("|");
    switchToUnit(subjectId, gradeId, unitId, "quiz");
    return;
  }

  if (button.dataset.reviewNote) {
    const note = state.wrongNotes.find((item) => item.id === button.dataset.reviewNote);
    if (note) {
      note.reviewed = !note.reviewed;
      save(storageKeys.wrong, state.wrongNotes);
    }
    render();
    return;
  }

  if (button.dataset.deleteNote) {
    state.wrongNotes = state.wrongNotes.filter((item) => item.id !== button.dataset.deleteNote);
    save(storageKeys.wrong, state.wrongNotes);
    render();
    return;
  }

  if (button.dataset.finishQuiz) {
    const session = state.quizSession[button.dataset.finishQuiz];
    if (session) session.finished = true;
    setProgress(button.dataset.finishQuiz, Math.max(unitProgress(button.dataset.finishQuiz), 88));
    render();
    return;
  }

  if (button.dataset.restartQuiz) {
    const unitId = button.dataset.restartQuiz;
    const questionIds = state.quizSession[unitId]?.questionIds || [];
    questionIds.forEach((id) => {
      delete state.answers[id];
      delete state.checked[id];
    });
    delete state.quizSession[unitId];
    render();
    return;
  }

  if (button.dataset.toggleFavorite) {
    toggleFavorite(button.dataset.toggleFavorite);
    render();
    return;
  }

  if (button.dataset.jumpConcept) {
    state.unitTab = "overview";
    render();
    setTimeout(() => {
      document.getElementById(`concept-${button.dataset.jumpConcept}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    return;
  }

  if (button.dataset.completeUnit) {
    setProgress(button.dataset.completeUnit, 100);
    render();
    return;
  }

  if (button.dataset.openSummary) {
    const [subjectId, gradeId, unitId] = button.dataset.openSummary.split("|");
    switchToUnit(subjectId, gradeId, unitId, "summary");
    return;
  }

  if (button.dataset.printSummary !== undefined) {
    window.print();
    return;
  }

  if (button.dataset.startExam !== undefined) {
    startExam();
    return;
  }

  if (button.dataset.submitExam !== undefined) {
    submitExam();
    return;
  }

  if (button.dataset.examAnswer) {
    const [key, value] = button.dataset.examAnswer.split("|");
    state.exam.answers[key] = Number(value);
    render();
  }
});

render();
