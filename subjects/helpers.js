function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function choiceQuestion({ prompt, options, answer, explanation, wrongReasons, difficulty, category, relatedConcept }) {
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

export function shortQuestion({ prompt, answer, explanation, difficulty, category, relatedConcept, wrongReasons = [] }) {
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

export function createUnit(data) {
  const unitId = slug(`${data.subject}-${data.grade}-${data.title}`);
  return {
    id: unitId,
    ...data,
    flashcards: (data.flashcards || []).map((card) => ({ ...card, unitId })),
  };
}

export function buildGenericQuestionSet(unitTitle, concepts) {
  const picks = concepts.slice(0, 5);
  const conceptQuestions = picks.map((concept) =>
    choiceQuestion({
      prompt: `${unitTitle}에서 "${concept.term}"에 대한 설명으로 가장 알맞은 것은?`,
      options: [
        concept.simple,
        `${concept.term}와 관계없는 예시이다.`,
        `시험에서는 거의 다루지 않는 주변 개념이다.`,
        `단원 전체와 연결되지 않는 독립 용어이다.`,
      ],
      answer: 0,
      explanation: concept.detailed,
      wrongReasons: [
        "단원 핵심 개념은 서로 연결되어 출제된다.",
        "이 개념은 실제로 시험 자료 해석에 자주 쓰인다.",
        "주변 개념이 아니라 중심 개념으로 다뤄야 한다.",
      ],
      difficulty: "쉬움",
      category: "개념 확인",
      relatedConcept: concept.term,
    })
  );

  const multiple = picks.map((concept) =>
    choiceQuestion({
      prompt: `${unitTitle} 시험에서 ${concept.term}을(를) 적용할 때 가장 먼저 확인할 것은?`,
      options: [
        "문제의 배경 그림 색깔",
        concept.exam,
        "보기 길이가 가장 긴 선지",
        "무조건 공식부터 쓰기",
      ],
      answer: 1,
      explanation: `${concept.term}은(는) 정의만 외우는 것이 아니라 시험식 설명으로 적용해야 한다.`,
      wrongReasons: [
        "그림 색깔은 판단 기준이 아니다.",
        "보기 길이로 정답을 고를 수 없다.",
        "조건 확인 없이 공식부터 쓰면 오답이 나오기 쉽다.",
      ],
      difficulty: "보통",
      category: "객관식",
      relatedConcept: concept.term,
    })
  );

  const shorts = picks.slice(0, 3).map((concept) =>
    shortQuestion({
      prompt: `${concept.term}이(가) 왜 중요한지 한두 문장으로 설명하시오.`,
      answer: concept.exam,
      explanation: `정답은 다양하지만 ${concept.term}의 뜻과 시험 활용 맥락이 함께 들어가야 한다.`,
      difficulty: "어려움",
      category: "서술형",
      relatedConcept: concept.term,
    })
  );

  const advanced = picks.slice(0, 2).map((concept) =>
    shortQuestion({
      prompt: `${unitTitle}의 다른 개념과 ${concept.term}의 관계를 설명하고, 헷갈리기 쉬운 점을 함께 쓰시오.`,
      answer: `${concept.term}의 정의와 다른 개념과의 관계`,
      explanation: `단순 정의가 아니라 관계, 조건, 비교 포인트까지 적어야 만점형 답안이 된다.`,
      difficulty: "만점 도전",
      category: "심화",
      relatedConcept: concept.term,
    })
  );

  return [...conceptQuestions, ...multiple, ...shorts, ...advanced];
}

export function createMiniUnit({
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
}) {
  return createUnit({
    subject,
    grade,
    title,
    field,
    difficulty,
    teaser,
    achievementGoals,
    examImportance,
    coreConcepts: concepts,
    principles: [
      {
        title: "개념이 연결되는 이유",
        body: `${title} 단원은 핵심 개념을 따로 외우기보다 문제 상황 속에서 서로 연결해 이해할 때 성취기준에 맞는 답을 만들 수 있다.`,
      },
      {
        title: "시험에서 보는 방식",
        body: `시험에서는 정의를 묻는 문제뿐 아니라 자료, 사례, 그림, 서술형 답안 속에서 ${title} 개념을 적용하는 문제가 함께 나온다.`,
      },
    ],
    formulas: [],
    keyTerms: concepts.map((concept) => ({ term: concept.term, meaning: concept.simple })),
    mustMemorize: concepts.map((concept) => `${concept.term}: ${concept.exam}`),
    commonMistakes: concepts.map((concept) => `${concept.term}을(를) 다른 비슷한 용어와 섞어 쓰지 않도록 정의와 예시를 함께 묶어 기억한다.`),
    examTips: [
      `${title}에서는 조건을 먼저 읽고 핵심 용어를 문제 속 표현과 연결해야 한다.`,
      "서술형에서는 개념의 뜻만 적지 말고 이유, 과정, 결과를 이어 쓰면 점수를 받기 좋다.",
      "자료형 문제는 제목, 축, 단위, 예시를 먼저 보고 해석한다.",
    ],
    examples: [
      { kind: "실생활 예시", title: `${title}와 생활`, body: `${title} 개념은 일상 사례와 연결할 때 훨씬 오래 기억된다.` },
      { kind: "교과서형 예시", title: `자료 해석`, body: `표나 그림을 보고 ${title} 핵심 개념을 설명하는 유형을 먼저 익히면 응용 문제가 쉬워진다.` },
      { kind: "시험형 예시", title: `서술형 대비`, body: `핵심 용어, 이유, 결과를 한 문단에 넣어 답안을 만드는 연습이 필요하다.` },
    ],
    relatedFigures,
    flashcards: concepts.slice(0, 4).map((concept) => ({
      front: concept.term,
      back: `${concept.simple} / 시험 포인트: ${concept.exam}`,
    })),
    questions: buildGenericQuestionSet(title, concepts),
    summary: {
      tenLines: [
        `${title}의 핵심은 단원 용어를 정확히 구분하는 것이다.`,
        "개념을 사례와 연결해야 시험형 문제가 풀린다.",
        "자료 해석은 조건 읽기부터 시작한다.",
        "비슷한 개념 비교가 자주 나온다.",
        "서술형은 정의와 이유를 함께 적는다.",
        "문제에서 바꿔 말한 표현을 눈여겨본다.",
        "핵심 용어를 한 번에 외우기보다 관계로 묶는다.",
        "실수는 조건 누락과 용어 혼동에서 많이 나온다.",
        "개념 카드로 빠르게 복습하면 좋다.",
        "마지막에는 1분 요약으로 전체 흐름을 다시 본다.",
      ],
      table: [
        { label: "핵심 분야", value: field },
        { label: "핵심 개념 수", value: `${concepts.length}개` },
        { label: "시험 포인트", value: "정의, 비교, 자료 해석" },
      ],
      oneMinute: `${title}는 핵심 용어를 정확히 구분하고, 사례에 적용할 수 있어야 점수가 오른다.`,
      blanks: concepts.slice(0, 4).map((concept) => `${concept.term}: ${concept.exam}`),
    },
  });
}
