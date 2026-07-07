const STATUS_META = {
  outlineOnly: { label: "목차만", tone: "muted", progress: 8 },
  lessonDraft: { label: "개념 작성중", tone: "warm", progress: 28 },
  lessonComplete: { label: "개념 완성", tone: "info", progress: 52 },
  questionsComplete: { label: "문제 완성", tone: "accent", progress: 76 },
  reviewed: { label: "검수 완료", tone: "success", progress: 100 },
};

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeConcept(concept, index, unitTitle) {
  if (typeof concept === "string") {
    return {
      term: concept,
      simple: `${concept}의 뜻과 기본 성질을 설명할 수 있다.`,
      detailed: `${unitTitle}에서 ${concept}는 다른 개념과 연결되는 핵심 축이다. 정의를 외우는 데서 끝내지 말고, 예시와 반례까지 함께 구분해야 시험에서 흔들리지 않는다.`,
      exam: `${concept}의 의미와 쓰임을 문제 상황에 연결해 설명한다.`,
    };
  }

  return {
    term: concept.term || `${unitTitle} 핵심 개념 ${index + 1}`,
    simple: concept.simple || `${concept.term}의 기본 뜻을 이해한다.`,
    detailed:
      concept.detailed ||
      `${concept.term}는 ${unitTitle}에서 반복 출제되는 개념이다. 정의, 조건, 예외, 적용 장면을 한 묶음으로 정리해야 한다.`,
    exam: concept.exam || `${concept.term}의 조건과 적용 상황을 비교해 판단한다.`,
  };
}

function choiceQuestion({ prompt, options, answer, explanation, wrongReasons = [], difficulty, category, relatedConcept }) {
  return {
    id: slug(`${category}-${prompt}`),
    type: "객관식",
    prompt,
    options,
    answer,
    explanation,
    wrongReasons,
    difficulty,
    category,
    relatedConcept,
  };
}

function shortQuestion({ prompt, answer, explanation, difficulty, category, relatedConcept, wrongReasons = [] }) {
  return {
    id: slug(`${category}-${prompt}`),
    type: "서술형",
    prompt,
    answer,
    explanation,
    wrongReasons,
    difficulty,
    category,
    relatedConcept,
  };
}

function oxQuestion({ prompt, answer, explanation, difficulty, category, relatedConcept }) {
  return choiceQuestion({
    prompt,
    options: ["O", "X"],
    answer: answer ? 0 : 1,
    explanation,
    wrongReasons: [
      "핵심 용어 하나만 보고 판단하지 말고, 조건과 예외까지 함께 확인해야 한다.",
      "시험에서는 비슷한 표현으로 바꾸어 물을 수 있으니 문장 전체 의미를 읽어야 한다.",
    ],
    difficulty,
    category,
    relatedConcept,
  });
}

function buildSupplementaryQuestion(unitTitle, concept, variant) {
  switch (variant % 5) {
    case 0:
      return choiceQuestion({
        prompt: `${unitTitle}에서 '${concept.term}'의 뜻으로 가장 알맞은 것은?`,
        options: [
          concept.simple,
          `${concept.term}와 반대되는 뜻을 설명한 문장이다.`,
          `${concept.term}와 직접 관련이 없는 배경 설명이다.`,
          `${concept.term}를 외울 때 주의할 점만 말한 문장이다.`,
        ],
        answer: 0,
        explanation: concept.detailed,
        wrongReasons: [
          "개념의 반대말이나 반례를 정답처럼 고르면 안 된다.",
          "배경 지식과 핵심 정의는 구별해야 한다.",
          "주의점은 중요하지만 개념의 뜻 자체는 아니다.",
        ],
        difficulty: "쉬움",
        category: "개념 확인",
        relatedConcept: concept.term,
      });
    case 1:
      return choiceQuestion({
        prompt: `${concept.term}를 실제 문제에 적용한 설명으로 가장 적절한 것은?`,
        options: [
          "조건을 읽지 않고 공식이나 표현만 바로 대입한다.",
          concept.exam,
          "용어만 적고 이유는 쓰지 않는다.",
          "관련 없는 다른 단원의 성질로 판단한다.",
        ],
        answer: 1,
        explanation: `${concept.term}는 뜻만 외우는 것보다 문제 장면에 연결해서 판단해야 한다.`,
        wrongReasons: [
          "조건을 무시하면 같은 용어라도 답이 달라질 수 있다.",
          "이유 없는 결론은 서술형에서 점수를 잃기 쉽다.",
          "비슷한 단원 개념을 섞으면 오답이 된다.",
        ],
        difficulty: "보통",
        category: "적용",
        relatedConcept: concept.term,
      });
    case 2:
      return oxQuestion({
        prompt: `${concept.term}를 이해할 때 정의와 예시를 함께 묶어 기억하는 것이 도움이 된다.`,
        answer: true,
        explanation: `${concept.term}는 정의만 외우면 문제 응용에서 흔들리기 쉽다. 예시, 비교, 시험 포인트를 함께 정리해야 한다.`,
        difficulty: "쉬움",
        category: "OX",
        relatedConcept: concept.term,
      });
    case 3:
      return shortQuestion({
        prompt: `${concept.term}의 의미를 한 문장으로 쓰고, 이 개념이 왜 중요한지도 함께 설명하시오.`,
        answer: `${concept.simple} ${concept.exam}`,
        explanation: "정의와 중요성을 함께 적으면 서술형 기본 점수를 안정적으로 확보할 수 있다.",
        difficulty: "보통",
        category: "빈칸/서술",
        relatedConcept: concept.term,
      });
    default:
      return shortQuestion({
        prompt: `${unitTitle}에서 '${concept.term}'과 관련하여 학생들이 자주 틀리는 부분을 한 가지 쓰고 바르게 고쳐 설명하시오.`,
        answer: `${concept.term}의 조건과 쓰임을 다른 개념과 구분해 설명한다.`,
        explanation: "헷갈리는 지점을 스스로 말로 정리하면 오답을 줄이는 데 큰 도움이 된다.",
        difficulty: "어려움",
        category: "서술형",
        relatedConcept: concept.term,
      });
  }
}

function ensureQuestionCount(questions, concepts, unitTitle, targetCount) {
  const normalized = [...questions];
  if (!targetCount || normalized.length >= targetCount || !concepts.length) return normalized;

  let cursor = 0;
  while (normalized.length < targetCount) {
    const concept = concepts[cursor % concepts.length];
    const question = buildSupplementaryQuestion(unitTitle, concept, cursor);
    question.id = slug(`${question.id}-${normalized.length + 1}`);
    normalized.push(question);
    cursor += 1;
  }
  return normalized;
}

function buildSummary(data, concepts) {
  if (data.summary) return data.summary;
  return {
    tenLines: [
      `${data.title}의 핵심 용어를 먼저 정확히 구분한다.`,
      "정의만 암기하지 말고 예시와 반례를 함께 정리한다.",
      "개념 사이의 관계를 화살표처럼 연결하며 읽는다.",
      "표, 그림, 자료가 나오면 조건을 먼저 표시한다.",
      "서술형은 이유와 결과를 함께 써야 점수가 올라간다.",
      "자주 헷갈리는 용어는 비교표로 정리해 둔다.",
      "대표 문제를 풀 때는 풀이 순서를 말로 설명해 본다.",
      "틀린 문제는 왜 틀렸는지 개념 이름으로 적어 둔다.",
      "시험 전에는 한 줄 요약과 빈칸 정리로 빠르게 훑는다.",
      "마지막에는 중요한 공식, 원리, 키워드를 다시 확인한다.",
    ],
    table: [
      { label: "단원 분야", value: data.field },
      { label: "핵심 개념 수", value: `${concepts.length}개` },
      { label: "학습 상태", value: STATUS_META[data.status || "lessonDraft"]?.label || "작성중" },
    ],
    oneMinute: `${data.title}에서는 핵심 용어의 뜻, 관계, 대표 예시를 한 묶음으로 기억하는 것이 가장 중요하다.`,
    blanks: concepts.slice(0, 5).map((concept) => `${concept.term}: ${concept.exam}`),
  };
}

function createBaseUnit(data) {
  const status = data.status || "lessonDraft";
  const unitId = slug(`${data.subject}-${data.grade}-${data.title}`);
  const coreConcepts = (data.coreConcepts || data.concepts || []).map((concept, index) =>
    normalizeConcept(concept, index, data.title)
  );
  const keyTerms = (data.keyTerms || coreConcepts.map((concept) => ({ term: concept.term, meaning: concept.simple })));
  const flashcards = (data.flashcards || coreConcepts.slice(0, 6).map((concept) => ({
    front: concept.term,
    back: `${concept.simple} / 시험 포인트: ${concept.exam}`,
  }))).map((card) => ({ ...card, unitId }));
  const targetCount = data.questionTarget || (status === "reviewed" ? 20 : status === "questionsComplete" ? 16 : 8);
  const questions = ensureQuestionCount(data.questions || [], coreConcepts, data.title, targetCount);

  return {
    id: unitId,
    subject: data.subject,
    grade: data.grade,
    title: data.title,
    field: data.field,
    difficulty: data.difficulty,
    teaser: data.teaser,
    achievementGoals: data.achievementGoals || [],
    examImportance: data.examImportance || "",
    status,
    statusLabel: STATUS_META[status]?.label || "작성중",
    statusProgress: STATUS_META[status]?.progress || 0,
    statusTone: STATUS_META[status]?.tone || "muted",
    recommendedMinutes: data.recommendedMinutes || 35,
    coverageNote: data.coverageNote || "",
    coreConcepts,
    principles: data.principles || [],
    formulas: data.formulas || [],
    keyTerms,
    mustMemorize: data.mustMemorize || coreConcepts.map((concept) => `${concept.term}: ${concept.exam}`),
    commonMistakes: data.commonMistakes || coreConcepts.slice(0, 4).map((concept) => `${concept.term}의 뜻과 조건을 다른 개념과 섞지 않도록 주의한다.`),
    examTips: data.examTips || [
      "정의, 조건, 예외를 한 세트로 묶어 기억한다.",
      "자료형 문제에서는 숫자나 단서에 표시를 하며 읽는다.",
      "서술형은 결론만 쓰지 말고 이유를 함께 적는다.",
    ],
    examples: data.examples || [],
    relatedFigures: data.relatedFigures || [],
    flashcards,
    questions,
    summary: buildSummary({ ...data, status }, coreConcepts),
    comparisonTable: data.comparisonTable || [],
    studyChecklist: data.studyChecklist || [],
    conversation: data.conversation || [],
  };
}

function createUnit(data) {
  return createBaseUnit(data);
}

function createMiniUnit({
  subject,
  grade,
  title,
  field,
  difficulty,
  teaser,
  achievementGoals,
  examImportance,
  concepts,
  relatedFigures = [],
  status = "lessonDraft",
  coverageNote = "",
}) {
  return createBaseUnit({
    subject,
    grade,
    title,
    field,
    difficulty,
    teaser,
    achievementGoals,
    examImportance,
    concepts,
    relatedFigures,
    status,
    coverageNote,
    principles: [
      {
        title: "개념을 묶어 보는 이유",
        body: `${title}에서는 용어를 따로 외우는 것보다, 서로 어떤 관계인지 연결해서 이해해야 시험 문제를 정확하게 풀 수 있다.`,
      },
      {
        title: "시험에서 자주 묻는 방식",
        body: `정의 확인, 비교 판단, 자료 해석, 짧은 서술형이 ${title}에서 반복적으로 등장한다.`,
      },
    ],
    examples: [
      {
        kind: "생활 예시",
        title: `${title}와 연결되는 장면`,
        body: `${title}의 개념을 실제 상황과 연결해서 떠올리면 오래 기억되고 응용 문제에서도 흔들리지 않는다.`,
      },
      {
        kind: "시험 예시",
        title: "대표 문제 장면",
        body: `단어만 묻기보다 표, 그림, 문장 자료 속에서 ${title} 개념을 찾아 설명하게 하는 문제가 자주 나온다.`,
      },
    ],
  });
}

function createDetailedUnit(data) {
  return createBaseUnit({
    ...data,
    status: data.status || "reviewed",
    questionTarget: data.questionTarget || 20,
    studyChecklist:
      data.studyChecklist ||
      [
        "핵심 개념을 내 말로 한 번 설명했다.",
        "헷갈리는 비교 항목을 표로 구분했다.",
        "대표 문제를 스스로 다시 풀어 봤다.",
        "오답 이유를 개념 이름으로 적었다.",
      ],
  });
}

function createOutlineUnit({
  subject,
  grade,
  title,
  field,
  teaser,
  concepts,
  difficulty = "목차",
  coverageNote = "세부 개념과 심화 문제를 순차적으로 보강 중입니다.",
}) {
  return createMiniUnit({
    subject,
    grade,
    title,
    field,
    difficulty,
    teaser,
    achievementGoals: [
      `${title} 단원의 학습 흐름을 파악한다.`,
      "핵심 용어를 먼저 익혀 다음 상세 개념 학습에 대비한다.",
      "대표 문제 유형과 평가 포인트를 미리 확인한다.",
    ],
    examImportance: `${title}는 전체 교육과정에서 다음 단원과 연결되는 기초 축이다.`,
    concepts,
    status: "outlineOnly",
    coverageNote,
  });
}

function createOutlineUnits(subject, grade, entries) {
  return entries.map((entry) =>
    createOutlineUnit({
      subject,
      grade,
      title: entry.title,
      field: entry.field,
      teaser: entry.teaser,
      concepts: entry.concepts,
      difficulty: entry.difficulty,
      coverageNote: entry.coverageNote,
    })
  );
}

function upgradeUnit(unit, extras = {}) {
  const merged = createBaseUnit({
    ...unit,
    ...extras,
    questions: extras.questions || unit.questions,
    coreConcepts: extras.coreConcepts || unit.coreConcepts,
    keyTerms: extras.keyTerms || unit.keyTerms,
    flashcards: extras.flashcards || unit.flashcards,
  });
  Object.keys(unit).forEach((key) => delete unit[key]);
  Object.assign(unit, merged);
  return unit;
}

export {
  STATUS_META,
  choiceQuestion,
  shortQuestion,
  createUnit,
  createMiniUnit,
  createDetailedUnit,
  createOutlineUnit,
  createOutlineUnits,
  upgradeUnit,
  slug,
};
