import { slug } from "./helpers.js";

const TARGET_SUBJECTS = new Set(["math", "science", "english", "society", "history", "korean"]);

function addUnique(items, item, key = (value) => value.title || value.name || value.term) {
  const itemKey = key(item);
  if (!items.some((existing) => key(existing) === itemKey)) items.push(item);
}

function concept(term, simple, detailed, exam) {
  return { term, simple, detailed, exam };
}

function firstConcept(unit, index = 0) {
  return unit.coreConcepts[index % Math.max(unit.coreConcepts.length, 1)] || {
    term: unit.title,
    simple: `${unit.title}의 핵심 개념`,
    detailed: `${unit.title}의 조건, 예시, 반례를 함께 정리한다.`,
    exam: `${unit.title}의 개념을 문제 조건과 연결한다.`,
  };
}

function addSubjectStudyBlocks(unit, subject) {
  const subjectName = subject.name;
  const baseChecklist = [
    `문제 ${unit.questions.length}개를 쉬움-보통-어려움 순서로 풀고, 틀린 문제는 오답노트에서 같은 개념을 다시 확인한다.`,
    `예상 학습 시간 ${unit.recommendedMinutes || 35}분 안에 개념 1회독, 예제 풀이, 오답 복습까지 끝낸다.`,
  ];
  unit.studyChecklist = [...baseChecklist, ...(unit.studyChecklist || [])].slice(0, 8);

  const principleBySubject = {
    math: {
      title: "풀이 순서 원리",
      body: "조건 표시 -> 식 세우기 -> 공식 적용 -> 계산 -> 검산 순서로 풀면 실수 원인을 찾기 쉽다. 식을 바로 계산하기보다 무엇을 구하는 문제인지 먼저 표시한다.",
    },
    science: {
      title: "과학 법칙 적용 원리",
      body: "법칙은 조건이 맞을 때만 쓴다. 실험 조건, 변인 통제, 측정값의 단위를 확인한 뒤 공식이나 법칙을 적용해야 한다.",
    },
    english: {
      title: "문장 구조 분석 원리",
      body: "주어와 동사를 먼저 찾고, 수식어와 절을 괄호로 묶으면 긴 문장도 문법 구조와 뜻을 안정적으로 해석할 수 있다.",
    },
    society: {
      title: "사회 자료 해석 원리",
      body: "제도, 지표, 사례를 볼 때는 원인, 작동 방식, 영향, 한계를 나누어 읽는다. 그래프는 축과 단위부터 확인한다.",
    },
    history: {
      title: "역사 사건 정리 원리",
      body: "사건은 배경 -> 원인 -> 전개 -> 결과 -> 의의 순서로 정리한다. 인물은 활동 시기와 선택, 그 선택이 만든 변화를 함께 본다.",
    },
    korean: {
      title: "국어 지문 분석 원리",
      body: "글의 갈래, 화자나 서술자, 중심 내용, 표현 방법, 주제 의식을 나누어 읽으면 문학과 비문학 문제 모두 흔들리지 않는다.",
    },
  };
  addUnique(unit.principles, principleBySubject[subject.id] || {
    title: `${subjectName} 학습 원리`,
    body: "개념, 예시, 문제 조건, 오답 이유를 한 흐름으로 연결해 복습한다.",
  });

  const formulaBySubject = {
    math: [
      {
        name: "수학 문제 풀이 5단계",
        formula: "조건 -> 식 -> 변형 -> 계산 -> 검산",
        meaning: "문제의 말에서 조건을 표시하고, 알맞은 식을 세운 뒤 공식과 성질을 적용한다. 마지막에는 단위와 범위를 검산한다.",
      },
      {
        name: "대표 항등식",
        formula: "(a+b)^2=a^2+2ab+b^2, a^2-b^2=(a-b)(a+b)",
        meaning: "다항식, 인수분해, 방정식, 함수 단원에서 식 변형의 기본 도구로 반복 사용한다.",
      },
    ],
    science: [
      {
        name: "단위 확인법",
        formula: "값 = 숫자 + 단위",
        meaning: "과학 공식은 단위가 맞아야 의미가 있다. 힘은 N, 에너지는 J, 전류는 A처럼 단위까지 함께 확인한다.",
      },
      {
        name: "변인 통제",
        formula: "조작 변인 1개 / 종속 변인 1개 / 통제 변인 여러 개",
        meaning: "실험 문제는 무엇을 바꾸고 무엇을 측정했는지 먼저 찾으면 원리와 결론을 정확히 고를 수 있다.",
      },
    ],
    english: [
      {
        name: "문장 뼈대",
        formula: "S + V + O/C",
        meaning: "긴 문장도 주어와 동사를 먼저 찾고 목적어, 보어, 수식어를 분리하면 해석과 어법 판단이 쉬워진다.",
      },
      {
        name: "회화 응답 점검",
        formula: "상황 -> 의도 -> 표현 -> 예외",
        meaning: "대화문은 단어 뜻보다 화자의 목적과 다음 말의 자연스러움을 먼저 판단한다.",
      },
    ],
    society: [
      {
        name: "사회 현상 분석틀",
        formula: "원인 -> 과정 -> 영향 -> 해결 방안",
        meaning: "사회 제도와 현상은 원인과 결과를 분리하고, 이해관계자별 영향을 나누어 정리한다.",
      },
    ],
    history: [
      {
        name: "역사 서술형 공식",
        formula: "배경 -> 전개 -> 결과 -> 의의",
        meaning: "연도만 외우지 말고 왜 일어났는지, 누가 무엇을 했는지, 이후 무엇이 달라졌는지를 함께 쓴다.",
      },
    ],
    korean: [
      {
        name: "지문 독해 공식",
        formula: "갈래 -> 구조 -> 표현 -> 주제 -> 근거",
        meaning: "정답은 인상보다 지문 속 근거에서 나온다. 표현 방식과 주제를 연결해 판단한다.",
      },
    ],
  };
  (formulaBySubject[subject.id] || []).forEach((item) => addUnique(unit.formulas, item, (value) => value.name));

  const figureBySubject = {
    math: { name: "데카르트", work: "좌표와 식을 연결해 그래프와 방정식을 함께 해석하는 수학적 사고의 토대를 마련했다." },
    science: { name: "뉴턴", work: "운동 법칙과 만유인력으로 힘, 운동, 에너지 문제를 수식과 실험으로 설명하는 길을 열었다." },
    english: { name: "표현 사용 맥락", work: "영어는 누가 누구에게 어떤 상황에서 말하는지에 따라 문법과 표현 선택이 달라진다." },
    society: { name: "사회 조사자", work: "사회 현상은 자료 수집, 비교, 해석을 통해 원인과 해결 방안을 탐구한다." },
    history: { name: "사료 해석", work: "역사 인물과 사건은 당시 사료, 시대 배경, 이후 변화까지 함께 보아야 균형 있게 이해된다." },
    korean: { name: "작가와 화자", work: "문학 작품은 작가의 시대 배경, 화자나 서술자의 관점, 표현 방식을 연결해 읽는다." },
  };
  if (!unit.relatedFigures) unit.relatedFigures = [];
  if (!unit.relatedFigures.length && figureBySubject[subject.id]) {
    addUnique(unit.relatedFigures, figureBySubject[subject.id], (value) => value.name);
  }

  const exampleBySubject = {
    math: {
      kind: "풀이 예시",
      title: "조건을 식으로 바꾸는 법",
      body: "문장 속 수량 관계에 밑줄을 긋고, 미지수를 정한 뒤 등식이나 부등식으로 바꾼다. 계산 후 원래 조건에 대입해 맞는지 확인한다.",
    },
    science: {
      kind: "실험 예시",
      title: "법칙과 실험 결과 연결",
      body: "실험에서 바꾼 조건과 측정한 결과를 표로 정리한 뒤, 법칙이 예측하는 방향과 실제 결과가 일치하는지 비교한다.",
    },
    english: {
      kind: "회화 예시",
      title: "문법을 실제 말하기로 연결",
      body: "문법 구조를 외운 뒤 같은 구조로 요청, 제안, 이유 설명 문장을 만들어 보면 독해와 회화가 함께 잡힌다.",
    },
    society: {
      kind: "자료 예시",
      title: "그래프와 사례 읽기",
      body: "사회 자료는 제목, 기준 연도, 단위, 증가와 감소 방향을 먼저 확인한 뒤 원인과 영향을 연결한다.",
    },
    history: {
      kind: "연표 예시",
      title: "언제, 누가, 무엇을 했는지 정리",
      body: "사건을 연도순으로 세운 뒤 주도 세력, 요구, 결과, 의의를 한 줄씩 붙이면 서술형 답안의 뼈대가 된다.",
    },
    korean: {
      kind: "지문 예시",
      title: "근거 표시 독해",
      body: "선지를 먼저 고르기보다 지문에서 근거 문장을 찾고, 표현 방식이나 문장 구조가 답을 뒷받침하는지 확인한다.",
    },
  };
  addUnique(unit.examples, exampleBySubject[subject.id] || {
    kind: "활용 예시",
    title: `${subjectName} 단원 활용`,
    body: "핵심 개념을 실제 자료, 문제 조건, 생활 사례와 연결해 적용한다.",
  }, (value) => value.title);
}

function addEntropyAndThermodynamics(unit) {
  if (!["역학과 에너지", "물질과 에너지"].some((keyword) => unit.title.includes(keyword))) return;

  addUnique(unit.coreConcepts, concept(
    "엔트로피",
    "무질서도 또는 에너지 분산 정도를 나타내는 물리량이다.",
    "엔트로피는 계가 가질 수 있는 미시 상태 수가 많을수록 커진다. 자연 과정에서는 고립계의 전체 엔트로피가 감소하지 않는 방향으로 변화한다.",
    "엔트로피 증가 방향, 열기관 효율, 제2법칙과 연결해 판단한다."
  ), (value) => value.term);
  addUnique(unit.coreConcepts, concept(
    "열역학 제0법칙",
    "두 물체가 각각 같은 물체와 열평형이면 서로도 열평형이라는 법칙이다.",
    "제0법칙은 온도라는 물리량을 정의하게 해 주며, 온도계가 물체의 온도를 잴 수 있는 근거가 된다.",
    "열평형, 온도계 원리, 온도 비교 문제에서 활용한다."
  ), (value) => value.term);

  [
    {
      name: "열역학 제0법칙",
      formula: "A=B 열평형, B=C 열평형 -> A=C 열평형",
      meaning: "온도계가 물체와 열평형을 이루면 물체의 온도를 읽을 수 있다는 근거다.",
    },
    {
      name: "열역학 제1법칙",
      formula: "ΔU = Q - W",
      meaning: "내부 에너지 변화는 계가 받은 열에서 계가 한 일을 뺀 값이다. 부호 약속을 먼저 확인한다.",
    },
    {
      name: "열역학 제2법칙",
      formula: "ΔS_total >= 0",
      meaning: "고립계의 전체 엔트로피는 자연 과정에서 감소하지 않는다. 열은 자발적으로 고온에서 저온으로 이동한다.",
    },
    {
      name: "엔트로피 변화",
      formula: "ΔS = Q_rev / T",
      meaning: "가역 과정에서 온도 T로 열 Q를 주고받을 때 엔트로피 변화를 계산한다. 온도는 K를 사용한다.",
    },
    {
      name: "볼츠만 엔트로피",
      formula: "S = k ln W",
      meaning: "W는 가능한 미시 상태 수, k는 볼츠만 상수다. 미시 상태가 많을수록 엔트로피가 커진다.",
    },
  ].forEach((item) => addUnique(unit.formulas, item, (value) => value.name));

  [
    { name: "카르노", work: "이상적인 열기관의 효율 한계를 제시해 열기관과 제2법칙 이해의 출발점을 만들었다." },
    { name: "클라우지우스", work: "엔트로피 개념을 정식화하고 열역학 제2법칙을 수학적으로 표현했다." },
    { name: "볼츠만", work: "엔트로피를 미시 상태 수와 연결해 통계역학의 핵심 관계 S = k ln W를 제시했다." },
  ].forEach((item) => addUnique(unit.relatedFigures, item, (value) => value.name));

  addUnique(unit.examples, {
    kind: "풀이 예시",
    title: "엔트로피 문제 풀이 순서",
    body: "계와 주변을 먼저 나누고, 열의 이동 방향과 온도 단위를 확인한다. 가역 과정이면 ΔS=Qrev/T를 쓰고, 자연 과정 판단은 전체 엔트로피 변화가 0 이상인지 본다.",
  }, (value) => value.title);

  addThermodynamicsQuestions(unit);
  unit.status = "reviewed";
  unit.questionTarget = Math.max(unit.questionTarget || 0, 20);
}

function addThermodynamicsQuestions(unit) {
  const prompts = [
    {
      concept: "열역학 제0법칙",
      prompt: "열역학 제0법칙이 온도계의 원리가 되는 이유로 가장 알맞은 것은?",
      options: ["각각 같은 물체와 열평형인 두 물체는 서로도 열평형이기 때문이다.", "열은 항상 저온에서 고온으로 이동하기 때문이다.", "엔트로피는 항상 감소하기 때문이다.", "압력이 일정하면 부피가 변하지 않기 때문이다."],
      explanation: "제0법칙은 열평형 관계의 추이성을 말한다. 이 때문에 온도계를 기준 물체로 사용해 다른 물체의 온도를 비교할 수 있다.",
    },
    {
      concept: "열역학 제1법칙",
      prompt: "계가 열 Q를 받고 외부에 일 W를 했을 때 내부 에너지 변화는?",
      options: ["ΔU = Q - W", "ΔU = Q + W", "ΔU = W - Q", "ΔU = Q/W"],
      explanation: "계가 받은 열은 내부 에너지를 증가시키고, 계가 한 일은 내부 에너지를 감소시키므로 ΔU=Q-W로 쓴다.",
    },
    {
      concept: "열역학 제2법칙",
      prompt: "고립계에서 자연 과정이 일어날 때 전체 엔트로피 변화에 대한 설명으로 옳은 것은?",
      options: ["전체 엔트로피는 감소하지 않는다.", "전체 엔트로피는 반드시 감소한다.", "엔트로피는 온도와 무관하다.", "엔트로피가 0이면 모든 과정이 자발적이다."],
      explanation: "자연 과정은 고립계 전체 엔트로피가 증가하거나 일정한 방향으로 진행된다.",
    },
    {
      concept: "엔트로피 변화",
      prompt: "가역 과정에서 온도 T인 열원과 열 Q를 주고받을 때 엔트로피 변화식은?",
      options: ["ΔS = Qrev / T", "ΔS = mcΔT", "ΔS = FΔt", "ΔS = hf"],
      explanation: "가역 과정의 엔트로피 변화는 ΔS=Qrev/T이다. 온도는 섭씨가 아니라 절대온도 K를 사용한다.",
    },
    {
      concept: "볼츠만 엔트로피",
      prompt: "S = k ln W에서 W가 커질 때 엔트로피 S는 어떻게 되는가?",
      options: ["커진다.", "작아진다.", "항상 0이다.", "온도와 상관없이 음수가 된다."],
      explanation: "W는 가능한 미시 상태 수다. 미시 상태 수가 많을수록 ln W가 커져 엔트로피도 커진다.",
    },
  ];
  let cursor = 0;
  while (unit.questions.length < 20) {
    const item = prompts[cursor % prompts.length];
    const id = slug(`thermo-${unit.title}-${unit.questions.length}-${item.concept}`);
    if (!unit.questions.some((question) => question.id === id)) {
      unit.questions.push({
        id,
        type: "객관식",
        category: "수능형 열역학",
        difficulty: cursor % 2 === 0 ? "어려움" : "보통",
        prompt: item.prompt,
        options: item.options,
        answer: 0,
        explanation: item.explanation,
        wrongReasons: [
          "열, 일, 내부 에너지의 부호 약속을 확인하지 않은 선택지다.",
          "제0법칙, 제1법칙, 제2법칙의 역할을 서로 혼동한 선택지다.",
          "온도 단위와 계/주변 구분을 확인하지 않은 선택지다.",
        ],
        relatedConcept: item.concept,
        tags: ["수능형", "열역학", "엔트로피", unit.title],
      });
    }
    cursor += 1;
  }
}

function addPhysicsDepth(unit) {
  const physicsText = `${unit.title} ${unit.field || ""} ${(unit.coreConcepts || []).map((item) => item.term).join(" ")}`;
  const isPhysicsUnit = unit.subject === "science" && unit.grade?.startsWith("high") && (
    physicsText.includes("물리") ||
    physicsText.includes("역학") ||
    physicsText.includes("전자기") ||
    physicsText.includes("양자") ||
    physicsText.includes("힘과 운동") ||
    physicsText.includes("운동량") ||
    physicsText.includes("파동")
  );
  if (!isPhysicsUnit) return;

  [
    concept(
      "등가속도 운동",
      "가속도가 일정한 운동이다.",
      "등가속도 운동에서는 속도가 일정한 비율로 변하고, 변위는 시간의 제곱에 비례하는 항을 포함한다. 그래프에서는 v-t 그래프의 기울기가 가속도, 면적이 변위다.",
      "v-t 그래프 해석, 자유 낙하, 평균 속도와 변위 계산에 연결한다."
    ),
    concept(
      "뉴턴 운동 법칙",
      "힘과 운동 상태 변화의 관계를 설명하는 법칙이다.",
      "제1법칙은 관성, 제2법칙은 F=ma, 제3법칙은 작용 반작용이다. 수능형 문제에서는 힘의 방향, 알짜힘, 가속도, 접촉한 물체 사이의 힘을 구분해야 한다.",
      "힘 분석 그림을 그리고 알짜힘 방향과 가속도 방향을 연결한다."
    ),
    concept(
      "운동량과 충격량",
      "운동량은 p=mv, 충격량은 힘이 작용한 시간 동안 운동량이 변한 양이다.",
      "충돌 문제에서는 계를 정하고 외력이 무시되는지 확인한다. 충격량은 F-t 그래프의 면적이며, 충돌 시간이 길어지면 평균 충격력이 작아진다.",
      "운동량 보존 조건과 충격량-운동량 정리를 구분한다."
    ),
    concept(
      "전자기 유도",
      "자기 선속이 변할 때 유도 기전력이 생기는 현상이다.",
      "코일을 지나는 자기 선속이 변하면 렌츠 법칙에 따라 변화를 방해하는 방향으로 유도 전류가 흐른다. 발전기, 변압기, 전자기 브레이크와 연결된다.",
      "자기장 방향, 코일 면적, 회전, 유도 전류 방향을 함께 판단한다."
    ),
    concept(
      "양자 현상",
      "빛과 물질이 입자성과 파동성을 함께 보이는 현상이다.",
      "광전 효과는 빛의 에너지가 진동수에 비례한다는 증거이며, 드브로이 물질파는 입자도 파동성을 가질 수 있음을 보여 준다.",
      "E=hf, hf=일함수+최대 운동 에너지, λ=h/p를 상황에 맞게 사용한다."
    ),
  ].forEach((item) => addUnique(unit.coreConcepts, item, (value) => value.term));

  [
    { name: "등가속도 속도식", formula: "v = v0 + at", meaning: "처음 속도 v0, 가속도 a, 시간 t가 주어질 때 나중 속도를 구한다." },
    { name: "등가속도 변위식", formula: "s = v0t + 1/2 at²", meaning: "처음 속도와 가속도가 일정할 때 이동 거리를 구한다. 방향 부호를 먼저 정한다." },
    { name: "뉴턴 제2법칙", formula: "ΣF = ma", meaning: "여러 힘의 합인 알짜힘이 질량과 가속도의 곱과 같다. 힘 분석도를 먼저 그린다." },
    { name: "운동량", formula: "p = mv", meaning: "질량과 속도의 곱이다. 방향이 있는 벡터량이므로 충돌 전후 방향을 표시한다." },
    { name: "충격량", formula: "I = FΔt = Δp", meaning: "힘-시간 그래프의 면적이며 운동량 변화량과 같다." },
    { name: "일과 운동 에너지", formula: "W = ΔK, K = 1/2 mv²", meaning: "알짜힘이 한 일은 운동 에너지 변화와 같다." },
    { name: "중력 퍼텐셜 에너지", formula: "U = mgh", meaning: "기준면을 정한 뒤 높이 h를 사용한다. 역학적 에너지 보존과 연결된다." },
    { name: "전기력", formula: "F = k q1 q2 / r²", meaning: "전하 사이 거리의 제곱에 반비례한다. 부호는 힘의 방향 판단에 사용한다." },
    { name: "전기장", formula: "E = F/q", meaning: "단위 양전하가 받는 힘이다. 전기력선 방향은 양전하가 받는 힘의 방향이다." },
    { name: "옴의 법칙", formula: "V = IR", meaning: "전압, 전류, 저항 관계다. 그래프 기울기와 저항을 연결해 해석한다." },
    { name: "파동 속력", formula: "v = fλ", meaning: "파동의 속력은 진동수와 파장의 곱이다." },
    { name: "전자기 유도", formula: "ε = -N ΔΦ/Δt", meaning: "자기 선속 변화율이 클수록 유도 기전력이 커진다. 음의 부호는 렌츠 법칙을 뜻한다." },
    { name: "광자 에너지", formula: "E = hf", meaning: "빛의 에너지는 진동수에 비례한다. 세기와 진동수를 구분한다." },
    { name: "광전 효과", formula: "hf = W0 + Kmax", meaning: "입사 광자의 에너지는 일함수와 방출 전자의 최대 운동 에너지로 나뉜다." },
    { name: "드브로이 물질파", formula: "λ = h/p", meaning: "운동량이 클수록 물질파 파장은 짧아진다." },
  ].forEach((item) => addUnique(unit.formulas, item, (value) => value.name));

  [
    {
      title: "수능형 물리 풀이 순서",
      body: "1단계로 물체와 계를 정하고, 2단계로 힘 또는 에너지 그림을 그린다. 3단계에서 보존 법칙이 성립하는 조건을 확인하고, 4단계에서 그래프의 기울기와 면적 의미를 해석한다.",
    },
    {
      title: "그래프 해석 핵심",
      body: "x-t 그래프의 기울기는 속도, v-t 그래프의 기울기는 가속도, v-t 그래프의 면적은 변위다. F-t 그래프의 면적은 충격량, F-x 그래프의 면적은 일이다.",
    },
    {
      title: "보존 법칙 판단",
      body: "운동량 보존은 외력이 무시될 때, 역학적 에너지 보존은 비보존력이 한 일이 없을 때 쓴다. 조건이 다르면 같은 공식도 오답이 된다.",
    },
  ].forEach((item) => addUnique(unit.principles, item, (value) => value.title));

  [
    { name: "뉴턴", work: "운동 법칙과 만유인력으로 힘과 운동을 수학적으로 연결했다." },
    { name: "줄", work: "일과 열이 에너지로 서로 전환될 수 있음을 보여 에너지 보존 개념 발전에 기여했다." },
    { name: "패러데이", work: "전자기 유도를 발견해 발전기와 변압기의 원리를 설명하는 토대를 만들었다." },
    { name: "맥스웰", work: "전기와 자기 현상을 통합해 전자기파 이론을 세웠다." },
    { name: "플랑크", work: "에너지 양자 개념을 제안해 양자 물리의 출발점을 만들었다." },
    { name: "아인슈타인", work: "광전 효과를 빛의 입자성으로 설명해 양자론 발전에 기여했다." },
  ].forEach((item) => addUnique(unit.relatedFigures, item, (value) => value.name));

  [
    {
      kind: "수능형 예시",
      title: "충돌 문제에서 계 정하기",
      body: "두 물체가 충돌할 때 외력이 작용하지 않는 짧은 시간 구간을 계로 잡으면 운동량 보존을 쓸 수 있다. 그러나 마찰이 한 일이 크면 역학적 에너지는 보존되지 않을 수 있다.",
    },
    {
      kind: "수능형 예시",
      title: "전자기 유도 방향 판단",
      body: "자기 선속이 증가하면 그 증가를 방해하는 방향의 자기장을 만들도록 유도 전류가 흐른다. 먼저 원래 자기장 방향과 선속 변화 방향을 표시해야 한다.",
    },
    {
      kind: "수능형 예시",
      title: "광전 효과에서 세기와 진동수 구분",
      body: "빛의 세기를 키우면 방출 전자 수가 늘 수 있지만 전자의 최대 운동 에너지는 진동수에 의해 결정된다. 문항에서 묻는 값이 수인지 에너지인지 구분한다.",
    },
  ].forEach((item) => addUnique(unit.examples, item, (value) => value.title));

  addSuneungPhysicsQuestions(unit);
  unit.status = "reviewed";
}

function addSuneungPhysicsQuestions(unit) {
  const concepts = ["등가속도 운동", "뉴턴 운동 법칙", "운동량과 충격량", "일과 에너지", "전자기 유도", "양자 현상", "엔트로피"];
  const prompts = [
    {
      concept: "등가속도 운동",
      prompt: "v-t 그래프에서 직선의 기울기와 그래프 아래 면적이 각각 의미하는 것은?",
      options: ["가속도와 변위", "속도와 가속도", "변위와 힘", "운동량과 충격량"],
      explanation: "v-t 그래프의 기울기는 가속도, 그래프 아래 면적은 변위다. 그래프 해석 문제의 기본 출발점이다.",
    },
    {
      concept: "뉴턴 운동 법칙",
      prompt: "물체에 작용하는 여러 힘을 분석할 때 수능형 풀이의 첫 단계로 가장 적절한 것은?",
      options: ["물체를 분리하고 힘의 방향을 모두 표시한다.", "질량과 속도만 곱한다.", "에너지 보존을 무조건 적용한다.", "마찰력 방향을 임의로 정한다."],
      explanation: "뉴턴 법칙 문제는 힘 분석도가 먼저다. 알짜힘 방향과 가속도 방향을 연결해야 한다.",
    },
    {
      concept: "운동량과 충격량",
      prompt: "두 물체의 충돌에서 운동량 보존을 사용할 수 있는 조건은?",
      options: ["충돌 동안 계에 작용하는 외력이 무시될 때", "마찰이 항상 클 때", "운동 에너지가 반드시 보존될 때", "두 물체의 질량이 같을 때만"],
      explanation: "운동량 보존은 외력이 무시될 때 성립한다. 탄성 충돌이 아니면 운동 에너지는 보존되지 않을 수 있다.",
    },
    {
      concept: "일과 에너지",
      prompt: "F-x 그래프에서 그래프 아래 면적이 나타내는 물리량은?",
      options: ["일", "충격량", "전력", "전기장"],
      explanation: "힘-위치 그래프의 면적은 힘이 한 일이다. 일은 운동 에너지 변화와 연결된다.",
    },
    {
      concept: "전자기 유도",
      prompt: "렌츠 법칙에 따라 유도 전류의 방향을 판단할 때 핵심은?",
      options: ["자기 선속의 변화를 방해하는 방향을 찾는다.", "전류는 항상 시계 방향이라고 외운다.", "자기장이 있으면 무조건 전류가 흐른다.", "코일 감은 수는 영향이 없다."],
      explanation: "유도 전류는 자기 선속 변화 자체를 방해하는 방향으로 흐른다. 자기장 존재보다 선속 변화가 핵심이다.",
    },
    {
      concept: "양자 현상",
      prompt: "광전 효과에서 방출 전자의 최대 운동 에너지를 증가시키는 직접 요인은?",
      options: ["빛의 진동수 증가", "빛의 세기만 증가", "금속판 면적 증가", "관찰 시간 증가"],
      explanation: "광전 효과에서 전자의 최대 운동 에너지는 hf-W0로 결정된다. 세기는 방출 전자 수와 더 직접적으로 관련된다.",
    },
    {
      concept: "엔트로피",
      prompt: "고립계에서 자연적으로 일어나는 변화의 방향을 엔트로피로 바르게 설명한 것은?",
      options: ["전체 엔트로피가 감소하지 않는 방향으로 진행된다.", "엔트로피는 항상 0이 된다.", "뜨거운 물체가 차가운 물체에서 열을 받는다.", "미시 상태 수가 많아질수록 엔트로피는 작아진다."],
      explanation: "열역학 제2법칙에 따르면 고립계의 전체 엔트로피는 자연 과정에서 감소하지 않는다.",
    },
  ];

  let cursor = 0;
  while (unit.questions.length < 20) {
    const item = prompts[cursor % prompts.length];
    const id = slug(`suneung-physics-${unit.title}-${unit.questions.length}-${item.concept}`);
    if (!unit.questions.some((question) => question.id === id)) {
      unit.questions.push({
        id,
        type: "객관식",
        category: "수능형 물리",
        difficulty: cursor % 3 === 0 ? "어려움" : "보통",
        prompt: item.prompt,
        options: item.options,
        answer: 0,
        explanation: item.explanation,
        wrongReasons: [
          "공식 이름만 보고 조건을 확인하지 않은 선택지다.",
          "그래프의 기울기와 면적 의미를 바꾸어 해석한 선택지다.",
          "보존 법칙의 성립 조건을 확인하지 않은 선택지다.",
        ],
        relatedConcept: concepts.includes(item.concept) ? item.concept : firstConcept(unit).term,
        tags: ["수능형", "물리학", unit.title],
      });
    }
    cursor += 1;
  }
}

function addCoordinatePlaneDepth(unit) {
  if (!unit.title.includes("좌표평면")) return;

  [
    concept(
      "좌표평면",
      "가로축 x축과 세로축 y축이 만나는 평면이다.",
      "좌표평면은 위치를 순서쌍 (x, y)로 나타내기 위한 도구다. x좌표는 좌우 이동, y좌표는 위아래 이동을 뜻하며, 원점에서 출발해 x방향을 먼저 보고 y방향을 나중에 본다.",
      "점의 위치, 사분면, 그래프 해석 문제에서 x좌표와 y좌표의 뜻을 바꾸지 않아야 한다."
    ),
    concept(
      "사분면",
      "x축과 y축이 평면을 네 부분으로 나눈 영역이다.",
      "제1사분면은 x>0, y>0이고, 제2사분면은 x<0, y>0, 제3사분면은 x<0, y<0, 제4사분면은 x>0, y<0이다. 축 위의 점은 어느 사분면에도 속하지 않는다.",
      "부호 조건만 보고 어느 사분면인지 판단하는 문제가 자주 나온다."
    ),
    concept(
      "그래프 해석",
      "표나 식의 규칙을 좌표평면 위의 점과 선으로 나타내어 읽는 것이다.",
      "그래프는 단순한 그림이 아니라 두 양의 관계를 시각화한 자료다. 증가, 감소, 일정, 기울기, 원점을 지나는지 등을 확인하면 정비례와 반비례 같은 관계를 판단할 수 있다.",
      "그래프가 지나가는 점, 축과 만나는 위치, 변화 방향을 근거로 관계식을 판단한다."
    ),
  ].forEach((item) => addUnique(unit.coreConcepts, item, (value) => value.term));

  [
    {
      name: "순서쌍 읽기",
      formula: "(x, y) = (가로 위치, 세로 위치)",
      meaning: "좌표는 x를 먼저 읽고 y를 나중에 읽는다. (2, -3)은 오른쪽 2, 아래 3으로 이동한 점이다.",
    },
    {
      name: "두 점을 지나는 직선의 기울기",
      formula: "기울기 = y의 증가량 / x의 증가량",
      meaning: "중학교에서는 변화량의 의미를 읽고, 고등학교에서는 직선의 방정식과 연결한다.",
    },
    {
      name: "정비례 그래프",
      formula: "y = ax",
      meaning: "원점을 지나고 x가 1 증가할 때 y가 a만큼 변하는 직선이다. a가 양수면 오른쪽 위로, 음수면 오른쪽 아래로 향한다.",
    },
  ].forEach((item) => addUnique(unit.formulas, item, (value) => value.name));

  addUnique(unit.examples, {
    kind: "풀이 예시",
    title: "점 A(-2, 3)을 좌표평면에 표시하기",
    body: "원점에서 왼쪽으로 2칸 이동한 뒤 위로 3칸 이동한다. x좌표가 음수, y좌표가 양수이므로 제2사분면의 점이다.",
  }, (value) => value.title);
  addUnique(unit.examples, {
    kind: "자료 활용",
    title: "시간-거리 그래프 읽기",
    body: "가로축을 시간, 세로축을 거리로 두면 그래프가 가파를수록 같은 시간 동안 더 많이 이동했다는 뜻이다. 수평선은 거리가 변하지 않으므로 멈춘 상태다.",
  }, (value) => value.title);

  unit.status = "reviewed";
}

function addGeometryDepth(unit) {
  if (!["도형", "삼각", "사각", "원", "기하"].some((keyword) => unit.title.includes(keyword) || unit.field?.includes(keyword))) return;

  [
    {
      name: "삼각형의 내각의 합",
      formula: "세 내각의 합 = 180°",
      meaning: "평행선을 이용해 증명할 수 있으며, 각도 추론 문제의 출발점이다.",
    },
    {
      name: "다각형의 내각의 합",
      formula: "(n - 2) x 180°",
      meaning: "n각형을 한 꼭짓점에서 삼각형 n-2개로 나누어 생각한다.",
    },
    {
      name: "원의 둘레와 넓이",
      formula: "둘레 = 2πr, 넓이 = πr²",
      meaning: "r은 반지름이다. 지름을 반지름으로 바꾸는 실수가 자주 나온다.",
    },
  ].forEach((item) => addUnique(unit.formulas, item, (value) => value.name));
  addUnique(unit.examples, {
    kind: "도형 활용",
    title: "보조선을 긋는 이유",
    body: "복잡한 도형은 삼각형, 평행선, 원의 반지름처럼 이미 아는 기본 도형으로 쪼개야 한다. 보조선은 숨은 같은 길이와 같은 각을 드러내는 도구다.",
  }, (value) => value.title);
}

function addHistoryTimelineDepth(unit) {
  if (!["history", "society"].includes(unit.subject)) return;
  if (!["일제", "한국사", "근대", "민주", "세계 대전", "냉전", "대한민국"].some((keyword) => unit.title.includes(keyword) || unit.teaser?.includes(keyword))) return;

  addUnique(unit.examples, {
    kind: "연표 활용",
    title: "근현대사 흐름 예시",
    body: "1876 강화도 조약 -> 1894 동학 농민 운동과 갑오개혁 -> 1905 을사늑약 -> 1910 국권 피탈 -> 1919 3·1 운동 -> 1945 광복 -> 1948 대한민국 정부 수립 순서로 원인과 결과를 연결한다.",
  }, (value) => value.title);
  [
    { name: "전봉준", work: "1894년 동학 농민 운동을 이끈 인물로, 반봉건과 반외세 요구를 농민 운동으로 드러냈다." },
    { name: "안중근", work: "1909년 이토 히로부미를 저격하고 동양 평화론을 주장한 독립운동가다." },
    { name: "김구", work: "대한민국 임시 정부에서 활동하며 독립운동과 해방 후 통일 정부 수립을 위해 노력했다." },
  ].forEach((item) => addUnique(unit.relatedFigures, item, (value) => value.name));
  addUnique(unit.formulas, {
    name: "사건 분석 공식",
    formula: "시대 배경 -> 주도 세력 -> 전개 -> 결과 -> 역사적 의의",
    meaning: "연표 암기에서 멈추지 않고 누가 무엇을 했고 왜 중요한지까지 써야 서술형 점수를 얻는다.",
  }, (value) => value.name);
}

function addReferenceLinks(unit, subject) {
  const query = encodeURIComponent(`${unit.grade || ""} ${subject.name} ${unit.title} 개념 문제`);
  const links = [
    { label: "NCIC 교육과정 원문", url: "https://ncic.re.kr/inv/org/list.do", note: "2022 개정 교육과정과 성취기준 확인" },
    { label: "네이버 자료 검색", url: `https://search.naver.com/search.naver?query=${query}`, note: "단원명, 개념명, 인물명으로 보충 자료 검색" },
    { label: "구글 자료 검색", url: `https://www.google.com/search?q=${query}`, note: "공식, 도형, 사료, 실험 자료를 교차 확인" },
  ];
  if (subject.id === "science" || subject.id === "math") {
    links.push({ label: "사이언스올 학습 자료", url: "https://www.scienceall.com/main", note: "과학·수학 개념, 실험, 인물 자료 확인" });
  }
  if (subject.id === "english") {
    links.push({ label: "EBSi 영어 학습", url: "https://www.ebsi.co.kr/", note: "독해, 어법, 듣기 학습 자료 확인" });
  }
  unit.referenceLinks = links;
}

function buildCuratedQuestion(unit, subject, seq) {
  const current = firstConcept(unit, seq);
  const difficulty = ["쉬움", "보통", "어려움", "보통"][seq % 4];
  const id = slug(`curated-200-${subject.id}-${unit.grade}-${unit.title}-${seq}-${current.term}`);

  const builders = {
    math: () => ({
      prompt: `${unit.title}에서 '${current.term}' 문제를 풀 때 가장 먼저 해야 할 일은?`,
      options: [
        "문제 조건과 구하려는 값을 표시하고 알맞은 식을 세운다.",
        "보기의 숫자를 아무 공식에 바로 대입한다.",
        "그래프나 표가 있어도 읽지 않고 계산부터 한다.",
        "검산 없이 나온 값을 바로 답으로 쓴다.",
      ],
      explanation: `${current.term} 문제는 조건을 식으로 바꾸는 단계가 핵심이다. 조건 표시, 식 세우기, 공식 적용, 검산 순서가 안정적이다.`,
    }),
    science: () => ({
      prompt: `${unit.title}에서 '${current.term}'을 실험이나 법칙 문제에 적용하는 방법으로 가장 적절한 것은?`,
      options: [
        "변인, 단위, 조건을 확인한 뒤 법칙이나 공식을 적용한다.",
        "법칙 이름만 외우면 모든 상황에 그대로 적용한다.",
        "측정 단위가 달라도 숫자만 같으면 같은 값으로 본다.",
        "실험 조건과 결과를 분리하지 않고 결론만 외운다.",
      ],
      explanation: `${current.term}은 조건과 단위가 맞을 때 정확히 적용된다. 실험 문제에서는 조작 변인과 종속 변인을 먼저 확인해야 한다.`,
    }),
    english: () => ({
      prompt: `${unit.title}에서 '${current.term}'을 문장이나 회화에 적용할 때 가장 중요한 점은?`,
      options: [
        "문장 구조와 상황을 함께 보고 뜻과 쓰임을 판단한다.",
        "단어 뜻 하나만 보고 문장 전체 의미를 결정한다.",
        "시제와 주어가 달라도 같은 표현으로 처리한다.",
        "회화문에서는 앞뒤 대화 흐름을 보지 않는다.",
      ],
      explanation: `${current.term}은 형태, 뜻, 상황이 함께 맞아야 한다. 특히 회화에서는 화자의 의도와 다음 응답의 자연스러움이 중요하다.`,
    }),
    society: () => ({
      prompt: `${unit.title}에서 '${current.term}' 자료를 해석하는 방법으로 가장 알맞은 것은?`,
      options: [
        "원인, 과정, 영향, 해결 방안을 나누어 자료와 연결한다.",
        "그래프의 제목과 단위를 보지 않고 수치만 비교한다.",
        "사회 현상은 한 가지 원인으로만 설명한다.",
        "제도의 장점만 보고 한계는 제외한다.",
      ],
      explanation: `${current.term}은 자료의 기준과 맥락을 함께 봐야 한다. 사회 문제는 원인과 영향이 여러 층으로 연결된다.`,
    }),
    history: () => ({
      prompt: `${unit.title}에서 '${current.term}'을 서술형으로 정리하는 순서로 가장 적절한 것은?`,
      options: [
        "배경, 원인, 전개, 결과, 의의를 차례로 정리한다.",
        "연도 하나만 외우고 인물과 결과는 생략한다.",
        "결과를 먼저 쓰고 원인은 쓰지 않는다.",
        "누가 무엇을 했는지보다 느낌을 중심으로 쓴다.",
      ],
      explanation: `${current.term}은 언제, 누가, 왜, 무엇을 했고 그 결과 무엇이 달라졌는지를 연결해야 시험 답안이 완성된다.`,
    }),
    korean: () => ({
      prompt: `${unit.title}에서 '${current.term}' 문제를 풀 때 가장 먼저 확인할 것은?`,
      options: [
        "지문 속 근거와 표현 방식을 찾아 선지와 비교한다.",
        "제목만 보고 주제를 단정한다.",
        "화자와 서술자를 구분하지 않는다.",
        "문법 문제에서 예외 조건을 확인하지 않는다.",
      ],
      explanation: `${current.term}은 지문 근거와 연결해 판단해야 한다. 문학은 표현과 주제, 문법은 조건과 예외를 함께 본다.`,
    }),
  };

  const built = (builders[subject.id] || builders.korean)();
  return {
    id,
    type: "객관식",
    category: "만점 예제 200",
    difficulty,
    prompt: built.prompt,
    options: built.options,
    answer: 0,
    explanation: built.explanation,
    wrongReasons: [
      "조건과 맥락을 확인하지 않고 단어만 보고 고른 선택지다.",
      "문제에서 묻는 핵심 개념이 아니라 주변 설명에 끌린 선택지다.",
      "검산, 근거 확인, 원인-결과 연결 중 하나가 빠져 생기는 오답이다.",
    ],
    relatedConcept: current.term,
    tags: ["200제 예제", subject.name, unit.title, current.term],
  };
}

function addCuratedQuestionSet(subjects, target = 200) {
  const units = subjects
    .filter((subject) => TARGET_SUBJECTS.has(subject.id))
    .flatMap((subject) =>
      subject.grades.flatMap((grade) =>
        grade.units.map((unit) => ({ subject, grade, unit }))
      )
    )
    .sort((a, b) => {
      const aHigh = a.grade.id.startsWith("high") ? 0 : 1;
      const bHigh = b.grade.id.startsWith("high") ? 0 : 1;
      return aHigh - bHigh;
    });

  let added = 0;
  let cursor = 0;
  while (added < target && units.length) {
    const { subject, unit } = units[cursor % units.length];
    const question = buildCuratedQuestion(unit, subject, added);
    if (!unit.questions.some((item) => item.id === question.id)) {
      unit.questions.push(question);
      added += 1;
    }
    cursor += 1;
  }
  return added;
}

function finalizePlans(subjects, curatedCount) {
  subjects.forEach((subject) => {
    subject.grades.forEach((grade) => {
      grade.units.forEach((unit) => {
        const easy = unit.questions.filter((question) => question.difficulty === "쉬움").length;
        const normal = unit.questions.filter((question) => question.difficulty === "보통").length;
        const hard = unit.questions.filter((question) => question.difficulty === "어려움").length;
        const count = unit.questions.length;
        unit.recommendedMinutes = count >= 20 ? 65 : count >= 16 ? 55 : count >= 12 ? 45 : 40;
        unit.problemPlan = {
          count,
          minutes: unit.recommendedMinutes,
          easy,
          normal,
          hard,
          review: "틀린 문제는 오답노트에 자동 저장하고, 관련 개념 카드 -> 같은 단원 다시 풀기 순서로 복습한다.",
        };
        unit.examTips = [
          `이 단원은 ${count}문항, ${unit.recommendedMinutes}분 학습 기준으로 개념-문제-오답 복습을 한 번에 끝내도록 구성했다.`,
          ...(unit.examTips || []),
        ].slice(0, 8);
      });
    });
  });

  subjects.enrichmentMeta = {
    curatedQuestionCount: curatedCount,
    label: "만점 예제 200제",
  };
}

export function enrichSubjects(subjects) {
  subjects.forEach((subject) => {
    subject.grades.forEach((grade) => {
      grade.units.forEach((unit) => {
        addPhysicsDepth(unit);
        addEntropyAndThermodynamics(unit);
        addCoordinatePlaneDepth(unit);
        addGeometryDepth(unit);
        addHistoryTimelineDepth(unit);
        addSubjectStudyBlocks(unit, subject);
        addReferenceLinks(unit, subject);
      });
    });
  });

  const curatedCount = addCuratedQuestionSet(subjects, 200);
  finalizePlans(subjects, curatedCount);
  return subjects;
}
