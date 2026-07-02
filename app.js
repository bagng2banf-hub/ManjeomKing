const subjectStyles = {
  science: { name: "과학", icon: "⚗", color: "#18864b" },
  math: { name: "수학", icon: "∑", color: "#1d65d8" },
  society: { name: "사회", icon: "지도", color: "#d76b1f" },
  english: { name: "영어", icon: "Aa", color: "#7b45c4" },
  history: { name: "역사", icon: "史", color: "#8a5a2b" },
};

const curriculum = {
  science: {
    elementary: [
      unit("초등 공통", "식물과 동물의 한살이", ["한살이", "관찰", "서식지"], scienceLifeDetail("식물과 동물의 한살이")),
      unit("초등 공통", "물질의 성질", ["물질", "성질", "분류"], scienceMatterDetail("물질의 성질")),
    ],
    middle1: [
      unit("중1", "생물의 구성과 다양성", ["세포", "기관계", "분류"], scienceLifeDetail("생물의 구성과 다양성")),
      unit("중1", "온도와 열", ["온도", "열평형", "비열"], scienceHeatDetail()),
      unit("중1", "물질의 상태 변화", ["융해", "기화", "상태 변화"], scienceMatterDetail("물질의 상태 변화")),
      unit("중1", "힘의 작용", ["힘", "중력", "마찰력"], scienceForceDetail()),
      unit("중1", "기체의 성질", ["압력", "보일 법칙", "샤를 법칙"], scienceGasDetail()),
      unit("중1", "태양계", ["행성", "공전", "자전"], scienceSolarDetail()),
    ],
    middle2: [
      unit("중2", "물질의 구성", ["원소", "원자", "분자"], scienceMatterDetail("물질의 구성")),
      unit("중2", "전기와 자기", ["전류", "전압", "자기장"], scienceElectricDetail()),
      unit("중2", "동물과 에너지", ["소화", "순환", "호흡"], scienceLifeDetail("동물과 에너지")),
    ],
    middle3: [
      unit("중3", "화학 반응의 규칙", ["질량 보존", "일정 성분비", "반응식"], scienceChemistryDetail()),
      unit("중3", "운동과 에너지", ["속력", "일", "역학적 에너지"], scienceForceDetail("운동과 에너지")),
      unit("중3", "유전과 진화", ["DNA", "유전", "자연 선택"], scienceLifeDetail("유전과 진화")),
    ],
    high: [
      unit("고등 공통", "통합과학: 물질과 규칙성", ["원소", "스펙트럼", "주기율"], scienceChemistryDetail("통합과학: 물질과 규칙성")),
      unit("고등 공통", "통합과학: 시스템과 상호작용", ["중력", "생태계", "피드백"], scienceForceDetail("통합과학: 시스템과 상호작용")),
    ],
  },
  math: {
    elementary: [
      unit("초등 공통", "분수와 소수", ["약분", "통분", "소수"], mathNumberDetail("분수와 소수")),
      unit("초등 공통", "도형의 기초", ["각", "평행", "대칭"], mathGeometryDetail("도형의 기초")),
    ],
    middle1: [
      unit("중1", "정수와 유리수", ["부호", "절댓값", "사칙연산"], mathNumberDetail("정수와 유리수")),
      unit("중1", "문자와 식", ["문자식", "계수", "동류항"], mathExpressionDetail()),
      unit("중1", "일차방정식", ["등식", "이항", "해"], mathEquationDetail()),
      unit("중1", "좌표평면과 그래프", ["좌표", "순서쌍", "그래프"], mathGraphDetail()),
      unit("중1", "기본 도형", ["점", "선", "각"], mathGeometryDetail("기본 도형")),
      unit("중1", "평면도형과 입체도형", ["다각형", "다면체", "부피"], mathSolidDetail()),
    ],
    middle2: [
      unit("중2", "식의 계산", ["지수법칙", "다항식", "전개"], mathExpressionDetail("식의 계산")),
      unit("중2", "연립일차방정식", ["연립", "대입법", "가감법"], mathEquationDetail("연립일차방정식")),
      unit("중2", "일차함수", ["기울기", "절편", "그래프"], mathGraphDetail("일차함수")),
    ],
    middle3: [
      unit("중3", "제곱근과 실수", ["제곱근", "무리수", "실수"], mathNumberDetail("제곱근과 실수")),
      unit("중3", "이차방정식", ["인수분해", "근", "판별"], mathEquationDetail("이차방정식")),
      unit("중3", "이차함수", ["포물선", "축", "꼭짓점"], mathGraphDetail("이차함수")),
    ],
    high: [
      unit("고등 공통", "공통수학: 다항식과 방정식", ["나머지정리", "인수정리", "방정식"], mathExpressionDetail("공통수학: 다항식과 방정식")),
      unit("고등 공통", "공통수학: 함수", ["함수", "합성", "역함수"], mathGraphDetail("공통수학: 함수")),
    ],
  },
  society: {
    elementary: [
      unit("초등 공통", "우리 고장의 모습", ["지도", "생활권", "지역"], societyDetail("우리 고장의 모습")),
      unit("초등 공통", "경제생활과 선택", ["희소성", "생산", "소비"], societyEconomyDetail()),
    ],
    middle1: [
      unit("중1", "내가 사는 세계", ["위치", "지도", "위도와 경도"], societyDetail("내가 사는 세계")),
      unit("중1", "다양한 기후 지역", ["기후", "생활양식", "자연환경"], societyClimateDetail()),
      unit("중1", "정치 생활과 민주주의", ["민주주의", "시민", "권리"], societyPoliticsDetail()),
    ],
    middle2: [
      unit("중2", "시장 경제와 가격", ["수요", "공급", "가격"], societyEconomyDetail("시장 경제와 가격")),
      unit("중2", "인권과 헌법", ["기본권", "헌법", "국가기관"], societyPoliticsDetail("인권과 헌법")),
    ],
    middle3: [
      unit("중3", "세계화와 지역 변화", ["세계화", "다국적 기업", "문화"], societyDetail("세계화와 지역 변화")),
      unit("중3", "국제 사회와 평화", ["국제기구", "외교", "평화"], societyPoliticsDetail("국제 사회와 평화")),
    ],
    high: [
      unit("고등 공통", "통합사회: 인간, 사회, 환경", ["행복", "정의", "지속가능성"], societyDetail("통합사회: 인간, 사회, 환경")),
      unit("고등 공통", "통합사회: 시장과 정의", ["시장", "복지", "불평등"], societyEconomyDetail("통합사회: 시장과 정의")),
    ],
  },
  english: {
    elementary: [
      unit("초등 공통", "be동사", ["am", "are", "is"], englishBeDetail()),
      unit("초등 공통", "일반동사", ["do", "does", "동사원형"], englishVerbDetail()),
    ],
    middle1: [
      unit("중1", "be동사", ["am", "are", "is"], englishBeDetail()),
      unit("중1", "일반동사", ["현재형", "3인칭 단수", "부정문"], englishVerbDetail()),
      unit("중1", "의문사", ["who", "what", "where"], englishWhDetail()),
      unit("중1", "시제", ["현재", "과거", "미래"], englishTenseDetail()),
      unit("중1", "조동사", ["can", "must", "should"], englishModalDetail()),
    ],
    middle2: [
      unit("중2", "to부정사", ["명사적", "형용사적", "부사적"], englishToDetail()),
      unit("중2", "동명사", ["-ing", "목적어", "주어"], englishGerundDetail()),
      unit("중2", "비교급과 최상급", ["as 원급 as", "-er", "the -est"], englishCompareDetail()),
    ],
    middle3: [
      unit("중3", "현재완료", ["have p.p.", "경험", "계속"], englishPerfectDetail()),
      unit("중3", "관계대명사", ["who", "which", "that"], englishRelativeDetail()),
    ],
    high: [
      unit("고등 공통", "문장 구조와 독해", ["5형식", "수식어", "주제문"], englishStructureDetail()),
      unit("고등 공통", "분사와 관계사", ["현재분사", "과거분사", "관계사절"], englishRelativeDetail("분사와 관계사")),
    ],
  },
  history: {
    elementary: [
      unit("초등 공통", "선사 시대와 고조선", ["구석기", "신석기", "고조선"], historyAncientDetail()),
      unit("초등 공통", "삼국과 가야", ["고구려", "백제", "신라"], historyThreeKingdomsDetail()),
    ],
    middle1: [
      unit("중1", "문명의 발생과 고대 세계", ["문명", "국가", "제국"], worldHistoryDetail()),
      unit("중1", "삼국의 성립과 발전", ["중앙집권", "불교", "율령"], historyThreeKingdomsDetail()),
    ],
    middle2: [
      unit("중2", "고려의 성립과 변화", ["호족", "문벌", "무신"], historyGoryeoDetail()),
      unit("중2", "조선의 건국과 통치 체제", ["성리학", "왕권", "의정부"], historyJoseonDetail()),
    ],
    middle3: [
      unit("중3", "개항과 근대 국가 수립 운동", ["개항", "갑오개혁", "독립협회"], historyModernDetail()),
      unit("중3", "일제 강점기와 독립운동", ["3.1 운동", "임시정부", "광복"], historyIndependenceDetail()),
    ],
    high: [
      unit("고등 공통", "한국사: 전근대 한국사의 이해", ["고대", "고려", "조선"], historyJoseonDetail("전근대 한국사의 이해")),
      unit("고등 공통", "한국사: 근현대사의 전개", ["개항", "분단", "민주화"], historyModernDetail("근현대사의 전개")),
    ],
  },
};

const state = {
  subject: null,
  grade: null,
  unitId: null,
  tab: "concept",
  query: "",
  answers: {},
  checked: {},
  openSections: new Set(["핵심 개념", "개념 총정리", "공식 / 법칙 / 원리", "시험 포인트"]),
  favorites: load("perfectNoteFavorites", []),
  wrongNotes: load("perfectNoteWrongNotes", []),
  progress: load("perfectNoteProgress", {}),
};

const gradeLabels = {
  elementary: "초등학교",
  middle1: "중학교 1학년",
  middle2: "중학교 2학년",
  middle3: "중학교 3학년",
  high: "고등학교 공통",
};

const app = document.getElementById("app");

function unit(grade, title, keywords, detail) {
  const id = `${grade}-${title}`.replace(/\s+/g, "-");
  return { id, grade, title, keywords, ...detail };
}

function baseDetail(title, subject, sections, people = [], questions = null) {
  return {
    overview: sections.core[0],
    sections,
    people,
    questions: questions || makeQuestions(title, subject),
  };
}

function scienceHeatDetail() {
  return baseDetail("온도와 열", "science", {
    core: [
      "온도는 물체의 차갑고 뜨거운 정도를 수치로 나타낸 값이고, 열은 온도가 다른 두 물체 사이에서 이동하는 에너지이다. 시험에서는 온도와 열을 같은 말처럼 쓰면 안 된다.",
      "열은 항상 높은 온도의 물체에서 낮은 온도의 물체로 이동하며, 두 물체의 온도가 같아지는 상태를 열평형이라고 한다.",
      "비열은 어떤 물질 1 g의 온도를 1 ℃ 올리는 데 필요한 열량이다. 비열이 클수록 같은 열을 받아도 온도가 천천히 오른다.",
    ],
    summary: [
      "온도계는 열평형을 이용한다. 온도계와 물체가 접촉하면 열이 이동하고, 두 물체의 온도가 같아졌을 때 온도계의 눈금이 물체의 온도를 나타낸다.",
      "열의 이동 방법은 전도, 대류, 복사로 나뉜다. 전도는 입자 사이의 충돌로 열이 전달되는 현상이고, 대류는 액체나 기체가 직접 이동하며 열을 옮기는 현상이다. 복사는 물질을 통하지 않고도 열이 이동하는 방식이다.",
      "일상 예시는 시험에 자주 나온다. 금속 숟가락이 뜨거워지는 것은 전도, 냄비 속 물이 순환하는 것은 대류, 햇빛으로 몸이 따뜻해지는 것은 복사이다.",
    ],
    rules: [
      "열량 Q는 물질의 질량, 비열, 온도 변화에 비례한다. 중학교에서는 식 Q = cmΔt의 의미를 이해하는 수준에서 다룬다.",
      "상태 변화 중에는 열을 흡수하거나 방출해도 온도가 일정하게 유지될 수 있다. 이때 들어가거나 나오는 열을 숨은열이라고 부른다.",
      "실험에서는 같은 시간 동안 가열했을 때 온도 변화가 작은 물질이 비열이 큰 물질이라는 점을 해석해야 한다.",
    ],
    exam: [
      "온도는 상태를 나타내는 값, 열은 이동하는 에너지라는 구분을 반드시 외운다.",
      "전도, 대류, 복사의 사례를 그림으로 구분하는 문제가 자주 나온다.",
      "비열이 큰 물질은 천천히 데워지고 천천히 식는다. 바닷가의 낮과 밤 기온 차 설명과 연결된다.",
      "서술형은 열평형과 열의 이동 방향을 근거로 설명하게 출제된다.",
    ],
  }, [
    { name: "줄", role: "열과 일이 서로 전환될 수 있음을 보이며 에너지 보존 개념 발달에 기여했다." },
    { name: "셀시우스", role: "섭씨온도 체계와 관련된 과학자로, 물의 어는점과 끓는점을 기준으로 온도를 나타내는 방식과 연결된다." },
  ], [
    mc("온도가 다른 두 물체가 접촉했을 때 열의 이동 방향은?", ["낮은 온도에서 높은 온도로", "높은 온도에서 낮은 온도로", "질량이 작은 쪽에서 큰 쪽으로", "항상 양쪽으로 같은 양만 이동"], 1, "쉬움", "열은 온도 차 때문에 이동하며 높은 온도에서 낮은 온도로 이동한다."),
    blank("어떤 물질 1 g의 온도를 1 ℃ 올리는 데 필요한 열량을 무엇이라고 하는가?", "비열", "보통", "비열이 클수록 같은 열량을 받아도 온도 변화가 작다."),
    ox("복사는 물질이 없는 진공에서도 일어날 수 있다.", true, "보통", "태양의 열이 우주 공간을 지나 지구에 도달하는 것이 복사의 예이다."),
    short("금속 숟가락을 뜨거운 국에 넣으면 손잡이까지 뜨거워지는 까닭을 쓰시오.", "전도", "어려움", "금속 내부 입자의 운동이 이웃한 입자로 전달되며 열이 이동하는 전도 현상이다."),
  ]);
}

function scienceLifeDetail(title) {
  return baseDetail(title, "science", {
    core: [
      "생물은 세포로 이루어져 있으며, 세포는 생명 활동이 일어나는 가장 작은 단위이다.",
      "다세포 생물은 세포, 조직, 기관, 기관계, 개체의 단계로 구성된다. 단계가 올라갈수록 여러 구조가 협력해 더 복잡한 기능을 수행한다.",
      "생물 다양성은 생물의 종류, 유전적 차이, 생태계의 다양성을 포함하며 생태계 안정성과 연결된다.",
    ],
    summary: [
      "동물세포와 식물세포는 공통적으로 핵, 세포막, 세포질을 가진다. 식물세포는 세포벽, 엽록체, 큰 액포가 뚜렷하다는 점이 자주 비교된다.",
      "생물 분류는 공통점과 차이점을 기준으로 생물을 체계적으로 묶는 과정이다. 분류 기준은 관찰 가능한 특징에서 시작하지만, 현대에는 DNA와 진화적 관계도 중요하게 활용된다.",
      "생물 다양성이 클수록 환경 변화에 견딜 가능성이 커진다. 한 종이 사라지면 먹이 사슬과 서식지 관계가 무너져 다른 생물에게도 영향을 줄 수 있다.",
    ],
    rules: [
      "세포 관찰 실험에서는 현미경 배율, 프레파라트 제작, 염색약의 역할이 중요하다.",
      "식물세포의 엽록체는 광합성이 일어나는 장소이고, 세포벽은 세포의 형태를 유지하는 데 도움을 준다.",
      "분류 단계는 보통 종, 속, 과, 목, 강, 문, 계의 순서로 넓어진다.",
    ],
    exam: [
      "세포벽과 세포막을 혼동하지 않는다. 세포막은 동물세포와 식물세포 모두에 있다.",
      "기관과 기관계의 예시를 구분한다. 위는 기관, 소화계는 기관계이다.",
      "생물 다양성 보전의 이유를 생태계 안정성, 자원 가치, 윤리적 가치와 연결해 설명한다.",
      "현미경 상은 실제 물체와 상하좌우가 반대라는 점이 실험 문제로 자주 나온다.",
    ],
  }, [
    { name: "린네", role: "생물을 체계적으로 분류하고 학명을 사용하는 분류 체계를 발전시킨 과학자이다." },
    { name: "다윈", role: "자연 선택을 통해 생물이 환경에 적응하고 진화한다는 이론을 제시했다." },
  ]);
}

function scienceMatterDetail(title) {
  return baseDetail(title, "science", {
    core: [
      "물질은 고체, 액체, 기체 상태로 존재할 수 있고, 상태는 입자의 배열과 운동으로 설명한다.",
      "상태 변화는 물질의 종류가 바뀌는 것이 아니라 입자 사이 거리와 운동 정도가 달라지는 현상이다.",
      "상태 변화가 일어나는 동안에는 열을 흡수하거나 방출하지만 온도가 일정하게 유지되는 구간이 나타날 수 있다.",
    ],
    summary: [
      "고체는 입자 배열이 규칙적이고 입자 사이 거리가 가까워 모양과 부피가 일정하다. 액체는 부피는 일정하지만 담는 그릇에 따라 모양이 변한다. 기체는 모양과 부피가 모두 일정하지 않다.",
      "융해는 고체가 액체로, 응고는 액체가 고체로 변하는 현상이다. 기화는 액체가 기체로, 액화는 기체가 액체로 변하는 현상이다. 승화는 고체와 기체 사이의 직접 변화이다.",
      "상태 변화 그래프에서는 수평 구간을 해석하는 문제가 중요하다. 수평 구간은 온도 변화가 없지만 상태 변화에 열이 쓰이고 있다는 뜻이다.",
    ],
    rules: [
      "흡열 변화: 융해, 기화, 승화 중 고체에서 기체 방향.",
      "발열 변화: 응고, 액화, 승화 중 기체에서 고체 방향.",
      "끓음은 액체 내부와 표면에서 동시에 기화가 일어나는 현상이고, 증발은 표면에서만 일어난다.",
    ],
    exam: [
      "상태 변화와 화학 변화의 차이를 설명할 수 있어야 한다.",
      "기화와 액화의 생활 예시를 연결한다. 빨래가 마르는 것은 기화, 컵 표면 물방울은 액화이다.",
      "그래프에서 온도가 일정한 구간을 상태 변화 구간으로 읽는다.",
      "입자 모형 그림에서 입자 사이 거리와 운동 정도를 비교한다.",
    ],
  });
}

function scienceForceDetail(title = "힘의 작용") {
  return baseDetail(title, "science", {
    core: [
      "힘은 물체의 모양이나 운동 상태를 변화시키는 원인이다.",
      "힘의 세 가지 요소는 크기, 방향, 작용점이다. 화살표로 힘을 나타낼 때 길이는 크기, 방향은 힘의 방향, 시작점은 작용점을 뜻한다.",
      "중력, 탄성력, 마찰력, 자기력, 전기력처럼 접촉하거나 멀리 떨어져 있어도 작용하는 힘이 있다.",
    ],
    summary: [
      "물체에 힘이 작용하면 정지한 물체가 움직이거나, 움직이는 물체의 빠르기와 방향이 변하거나, 물체의 모양이 변할 수 있다.",
      "마찰력은 물체의 운동을 방해하는 방향으로 작용한다. 마찰력은 불편하기만 한 것이 아니라 걷기, 자동차 제동, 글씨 쓰기처럼 필요한 경우도 많다.",
      "탄성력은 변형된 물체가 원래 모양으로 돌아가려는 힘이다. 용수철 실험에서는 늘어난 길이가 힘의 크기와 비례하는지 그래프로 확인한다.",
    ],
    rules: [
      "힘의 단위는 N(뉴턴)이다.",
      "두 힘이 한 직선 위에서 반대 방향으로 작용하면 합력은 큰 힘에서 작은 힘을 뺀 크기이고, 방향은 큰 힘의 방향이다.",
      "평형 상태에서는 물체에 작용하는 힘의 합력이 0이다.",
    ],
    exam: [
      "힘의 방향과 물체의 운동 방향이 항상 같은 것은 아니다.",
      "마찰력의 방향은 물체가 움직이거나 움직이려는 방향의 반대이다.",
      "힘을 화살표로 나타내는 문제에서 작용점을 빠뜨리지 않는다.",
      "서술형은 힘이 물체의 운동 상태를 어떻게 바꾸는지 구체적으로 쓰게 나온다.",
    ],
  }, [{ name: "뉴턴", role: "운동 법칙과 만유인력 법칙을 정리해 힘과 운동을 설명하는 기초를 세웠다." }]);
}

function scienceGasDetail() {
  return baseDetail("기체의 성질", "science", {
    core: [
      "기체는 입자 사이 거리가 멀고 자유롭게 움직이기 때문에 담는 용기의 모양과 부피를 모두 채운다.",
      "기체의 압력은 기체 입자가 용기 벽에 충돌하면서 생긴다.",
      "온도, 압력, 부피의 관계를 입자 운동으로 설명하는 것이 핵심이다.",
    ],
    summary: [
      "온도가 높아지면 기체 입자의 운동이 활발해져 같은 부피에서는 압력이 커질 수 있다. 압력이 일정하면 부피가 커진다.",
      "보일 법칙은 온도가 일정할 때 기체의 압력과 부피가 반비례한다는 법칙이다.",
      "샤를 법칙은 압력이 일정할 때 기체의 부피가 절대온도에 비례한다는 법칙이다.",
    ],
    rules: [
      "보일 법칙: P가 커지면 V가 작아진다.",
      "샤를 법칙: 온도가 올라가면 기체 부피가 커진다.",
      "그래프 문제에서는 조건이 온도 일정인지 압력 일정인지 먼저 확인한다.",
    ],
    exam: [
      "기체 압력의 원인을 입자 충돌로 설명한다.",
      "찌그러진 탁구공을 뜨거운 물에 넣으면 펴지는 현상은 온도 상승과 부피 증가로 설명한다.",
      "보일 법칙과 샤를 법칙의 조건을 혼동하지 않는다.",
    ],
  }, [{ name: "보일", role: "온도가 일정할 때 기체의 압력과 부피 사이의 반비례 관계를 정리했다." }, { name: "샤를", role: "압력이 일정할 때 기체 부피와 온도의 관계를 설명하는 법칙과 관련된다." }]);
}

function scienceSolarDetail() {
  return baseDetail("태양계", "science", {
    core: [
      "태양계는 태양과 태양의 중력 영향을 받는 행성, 위성, 소행성, 혜성 등으로 이루어진다.",
      "행성은 태양 주위를 공전하고, 스스로 도는 운동을 자전이라고 한다.",
      "지구형 행성과 목성형 행성의 특징 비교가 핵심이다.",
    ],
    summary: [
      "수성, 금성, 지구, 화성은 지구형 행성으로 크기가 비교적 작고 밀도가 크며 단단한 표면을 가진다.",
      "목성, 토성, 천왕성, 해왕성은 목성형 행성으로 크기가 크고 밀도가 작으며 고리나 많은 위성을 가진 경우가 많다.",
      "태양계 천체의 운동은 중력으로 설명한다. 계절, 달의 위상, 일식과 월식 같은 현상도 천체의 위치 관계와 연결된다.",
    ],
    rules: [
      "공전은 한 천체가 다른 천체 주위를 도는 운동이다.",
      "자전축이 기울어진 채 공전하기 때문에 지구에는 계절 변화가 생긴다.",
      "관측 자료 문제에서는 밝기, 위치 변화, 위상 변화를 함께 해석한다.",
    ],
    exam: [
      "행성 순서를 수금지화목토천해로 정확히 외운다.",
      "지구형과 목성형 행성의 밀도, 크기, 표면 상태를 비교한다.",
      "일식은 달이 태양을 가릴 때, 월식은 지구 그림자에 달이 들어갈 때이다.",
    ],
  }, [{ name: "갈릴레이", role: "망원경 관측으로 목성의 위성, 금성의 위상 변화 등을 확인해 태양 중심설 확산에 영향을 주었다." }, { name: "케플러", role: "행성 운동 법칙을 정리해 행성의 공전 운동을 수학적으로 설명했다." }]);
}

function scienceElectricDetail() { return scienceForceDetail("전기와 자기"); }
function scienceChemistryDetail(title = "화학 반응의 규칙") { return scienceMatterDetail(title); }

function mathNumberDetail(title) {
  return baseDetail(title, "math", {
    core: [
      "수의 범위가 넓어질수록 계산 규칙을 정확히 적용하는 능력이 중요해진다.",
      "정수는 양의 정수, 0, 음의 정수로 이루어지고 유리수는 분수 꼴로 나타낼 수 있는 수이다.",
      "부호가 있는 수의 덧셈과 뺄셈은 수직선에서 방향과 거리를 생각하면 이해하기 쉽다.",
    ],
    summary: [
      "절댓값은 수직선에서 0까지의 거리이므로 항상 0 이상이다. +3과 -3의 절댓값은 모두 3이다.",
      "부호가 같은 수의 덧셈은 절댓값을 더하고 공통 부호를 붙인다. 부호가 다른 수의 덧셈은 절댓값의 차를 구하고 절댓값이 큰 수의 부호를 붙인다.",
      "곱셈과 나눗셈에서는 음수의 개수로 부호를 판단한다. 음수가 짝수 개이면 양수, 홀수 개이면 음수이다.",
    ],
    rules: [
      "a - b는 a + (-b)로 바꿔 계산한다.",
      "분수 계산은 통분, 약분, 역수의 개념을 함께 사용한다.",
      "계산 순서는 괄호, 거듭제곱, 곱셈과 나눗셈, 덧셈과 뺄셈 순서이다.",
    ],
    exam: [
      "절댓값이 같아도 수가 같은 것은 아니다. +5와 -5는 절댓값만 같다.",
      "뺄셈을 덧셈으로 바꾸는 순간 뒤 수의 부호가 바뀐다.",
      "분수와 소수가 섞인 계산은 한 가지 형태로 통일하면 실수가 줄어든다.",
    ],
  });
}

function mathExpressionDetail(title = "문자와 식") {
  return baseDetail(title, "math", {
    core: [
      "문자식은 수 대신 문자를 사용해 수량 관계를 일반적으로 나타낸 식이다.",
      "계수는 문자에 곱해진 수, 상수항은 문자 없이 수만 있는 항이다.",
      "동류항은 문자 부분이 같은 항이며, 동류항끼리만 더하거나 뺄 수 있다.",
    ],
    summary: [
      "문자식에서는 곱셈 기호를 생략하고 숫자를 문자 앞에 쓴다. 3×a는 3a로 나타낸다.",
      "분배법칙은 괄호를 풀 때 핵심이다. a(b+c)=ab+ac이고, 반대로 공통인수를 묶어 식을 간단히 할 수 있다.",
      "식의 값은 문자에 주어진 수를 대입해 계산한다. 음수를 대입할 때는 괄호를 사용해야 부호 실수를 줄일 수 있다.",
    ],
    rules: [
      "동류항 정리: 3x + 2x = 5x, 3x + 2y는 더 이상 합칠 수 없다.",
      "문자식 표현: 1a는 a, a×a는 a²로 쓴다.",
      "대입 계산에서는 연산 순서와 부호를 먼저 확인한다.",
    ],
    exam: [
      "문자 부분이 완전히 같아야 동류항이다. x와 x²은 동류항이 아니다.",
      "문장제는 무엇을 문자로 둘지 정한 뒤 단위를 맞춘다.",
      "괄호 앞의 음수는 괄호 안 모든 항의 부호를 바꾼다.",
    ],
  });
}

function mathEquationDetail(title = "일차방정식") {
  return baseDetail(title, "math", {
    core: [
      "방정식은 미지수를 포함한 등식이고, 방정식을 참이 되게 하는 미지수의 값을 해라고 한다.",
      "일차방정식은 미지수의 차수가 1인 방정식이다.",
      "등식의 성질을 이용해 양변에 같은 수를 더하거나 빼고, 같은 0이 아닌 수를 곱하거나 나누어도 등식은 성립한다.",
    ],
    summary: [
      "일차방정식 풀이는 괄호 풀기, 분모 없애기, 미지수항과 상수항 정리, 양변 나누기의 흐름으로 진행한다.",
      "이항은 항을 등호의 반대쪽으로 옮기는 것이며, 옮길 때 부호가 바뀐다. 사실은 양변에 같은 수를 더하거나 빼는 등식의 성질을 간단히 표현한 말이다.",
      "활용 문제는 문제의 조건을 식으로 세우는 단계가 가장 중요하다. 거리, 속력, 시간이나 농도, 나이, 개수 문제는 표를 그리면 관계가 잘 보인다.",
    ],
    rules: [
      "ax + b = c의 꼴은 ax = c - b, x = (c - b) / a로 풀 수 있다.",
      "분모가 있으면 양변에 분모의 최소공배수를 곱해 분수를 없앤다.",
      "해를 구한 뒤 원래 식에 대입해 검산한다.",
    ],
    exam: [
      "이항할 때 부호가 바뀌는 실수가 가장 많다.",
      "분모를 없앨 때 모든 항에 곱해야 한다.",
      "활용 문제의 답은 미지수의 값만 쓰지 말고 단위와 문제에서 묻는 대상을 확인한다.",
    ],
  }, [], [
    mc("일차방정식 2x - 3 = 7의 해는?", ["2", "3", "5", "10"], 2, "쉬움", "2x=10이므로 x=5이다."),
    blank("등호의 한쪽 항을 다른 쪽으로 옮길 때 부호가 바뀌는 과정을 무엇이라고 하는가?", "이항", "쉬움", "이항은 등식의 성질을 이용한 정리 과정이다."),
    ox("방정식의 해를 구한 뒤 원래 식에 대입해 확인할 수 있다.", true, "보통", "검산은 계산 실수를 찾는 좋은 방법이다."),
    short("3(x-2)=12를 푸는 과정을 설명하고 해를 구하시오.", "x=6", "보통", "괄호를 풀면 3x-6=12, 3x=18, x=6이다."),
  ]);
}

function mathGraphDetail(title = "좌표평면과 그래프") {
  return baseDetail(title, "math", {
    core: [
      "좌표평면은 가로의 x축과 세로의 y축으로 위치를 나타내는 평면이다.",
      "순서쌍 (x, y)는 x좌표를 먼저, y좌표를 나중에 쓴다.",
      "그래프는 두 양 사이의 관계를 한눈에 보여 주는 도구이다.",
    ],
    summary: [
      "원점은 x축과 y축이 만나는 점이고 좌표는 (0, 0)이다. x좌표가 양수이면 오른쪽, 음수이면 왼쪽으로 이동한다. y좌표가 양수이면 위쪽, 음수이면 아래쪽으로 이동한다.",
      "일차함수의 그래프는 직선이다. 기울기는 x가 1 증가할 때 y가 얼마나 변하는지를 나타내고, y절편은 그래프가 y축과 만나는 점의 y좌표이다.",
      "표, 식, 그래프는 같은 관계를 서로 다른 방식으로 나타낸 것이다. 시험에서는 이 셋을 변환하는 문제가 자주 나온다.",
    ],
    rules: [
      "순서쌍은 반드시 x, y 순서로 읽는다.",
      "y = ax + b에서 a는 기울기, b는 y절편이다.",
      "그래프가 오른쪽 위로 올라가면 기울기가 양수, 오른쪽 아래로 내려가면 기울기가 음수이다.",
    ],
    exam: [
      "좌표의 순서를 바꾸면 완전히 다른 점이 된다.",
      "그래프 해석 문제는 축 이름과 단위를 먼저 확인한다.",
      "기울기와 y절편의 의미를 문장으로 설명하는 서술형이 자주 나온다.",
    ],
  });
}

function mathGeometryDetail(title) { return mathGraphDetail(title); }
function mathSolidDetail() { return mathGraphDetail("평면도형과 입체도형"); }

function englishBeDetail() {
  return baseDetail("be동사", "english", {
    core: [
      "be동사는 주어의 상태, 신분, 위치를 나타낼 때 쓰며 am, are, is의 형태가 있다.",
      "주어가 I이면 am, you/we/they와 복수명사이면 are, he/she/it과 단수명사이면 is를 쓴다.",
      "부정문은 be동사 뒤에 not을 붙이고, 의문문은 be동사를 주어 앞으로 보낸다.",
    ],
    summary: [
      "be동사는 '이다', '있다', '상태이다' 정도로 해석된다. I am a student.는 '나는 학생이다', She is happy.는 '그녀는 행복하다'이다.",
      "현재형의 축약형은 I'm, you're, he's, she's, it's, we're, they're처럼 쓴다. 부정 축약은 isn't, aren't가 자주 쓰인다.",
      "의문문에서는 Are you ready?처럼 be동사가 맨 앞으로 온다. 대답은 Yes, I am. / No, I'm not.처럼 주어와 be동사를 맞춘다.",
    ],
    rules: [
      "I am, You are, He/She/It is를 먼저 암기한다.",
      "be동사 뒤에는 명사, 형용사, 장소 표현이 올 수 있다.",
      "일반동사 문장과 달리 do/does를 쓰지 않는다.",
    ],
    exam: [
      "be동사 문장에 do not을 섞어 쓰지 않는다.",
      "주어가 복수인지 단수인지 먼저 확인한다.",
      "There is/are 구문은 뒤에 오는 명사의 수에 맞춘다.",
    ],
  }, [], [
    mc("다음 중 빈칸에 알맞은 말은? She ___ my friend.", ["am", "are", "is", "be"], 2, "쉬움", "She는 3인칭 단수이므로 is를 쓴다."),
    blank("be동사의 부정문은 be동사 뒤에 ______을 붙인다.", "not", "쉬움", "am not, is not, are not의 형태가 된다."),
    ox("Are you a student?는 올바른 be동사 의문문이다.", true, "쉬움", "be동사를 주어 앞에 두면 의문문이 된다."),
    short("They are happy.를 부정문으로 바꾸시오.", "They are not happy.", "보통", "be동사 are 뒤에 not을 붙인다."),
  ]);
}

function englishVerbDetail() {
  return baseDetail("일반동사", "english", {
    core: [
      "일반동사는 동작이나 상태를 나타내는 동사이며, be동사를 제외한 대부분의 동사가 여기에 속한다.",
      "현재시제에서 주어가 3인칭 단수이면 동사에 -s 또는 -es를 붙인다.",
      "부정문과 의문문은 do/does를 사용하고, does를 쓰면 뒤 동사는 원형이 된다.",
    ],
    summary: [
      "I play soccer.는 일반동사 play가 쓰인 문장이다. He plays soccer.처럼 he, she, it, 단수명사 주어에서는 동사에 -s가 붙는다.",
      "부정문은 I do not play, He does not play처럼 만든다. does not 뒤에 plays가 아니라 play가 온다는 점이 매우 중요하다.",
      "의문문은 Do you like music? Does she like music?처럼 do/does가 문장 앞에 온다.",
    ],
    rules: [
      "3인칭 단수 현재: 동사 + s/es.",
      "does 사용 뒤에는 반드시 동사원형.",
      "빈도부사 usually, often, always는 일반동사 앞, be동사 뒤에 오는 경향이 있다.",
    ],
    exam: [
      "He doesn't likes처럼 does와 -s를 동시에 쓰는 실수를 피한다.",
      "주어가 복수이면 동사에 -s를 붙이지 않는다.",
      "의문문 답은 Yes, 주어 do/does. No, 주어 don't/doesn't.로 맞춘다.",
    ],
  });
}

function englishToDetail() {
  return baseDetail("to부정사", "english", {
    core: [
      "to부정사는 to + 동사원형의 형태로 명사, 형용사, 부사처럼 쓰인다.",
      "명사적 용법은 주어, 목적어, 보어 역할을 하며 '~하는 것'으로 해석한다.",
      "형용사적 용법은 앞의 명사를 꾸며 '~할, ~하는'으로 해석하고, 부사적 용법은 목적, 감정의 원인, 결과 등을 나타낸다.",
    ],
    summary: [
      "I want to learn English.에서 to learn은 want의 목적어 역할을 하며 '영어를 배우는 것'이라는 뜻이다.",
      "I need something to drink.에서 to drink는 something을 꾸며 '마실 어떤 것'이라는 뜻을 만든다.",
      "I study hard to pass the exam.에서 to pass는 공부하는 목적을 나타내며 '~하기 위해'로 해석한다.",
    ],
    rules: [
      "to 뒤에는 반드시 동사원형이 온다.",
      "want, hope, decide, plan 뒤에는 to부정사가 자주 온다.",
      "too ... to, enough to 같은 표현은 시험 단골이다.",
    ],
    exam: [
      "to부정사의 역할을 문장 성분으로 판단한다.",
      "to 뒤에 동명사나 과거형을 쓰지 않는다.",
      "목적을 나타내는 부사적 용법은 in order to로 바꿔 쓸 수 있다.",
    ],
  });
}

function englishGerundDetail() { return englishToDetail(); }
function englishWhDetail() { return englishStructureDetail("의문사"); }
function englishTenseDetail() { return englishStructureDetail("시제"); }
function englishModalDetail() { return englishStructureDetail("조동사"); }
function englishCompareDetail() { return englishStructureDetail("비교급과 최상급"); }
function englishPerfectDetail() { return englishStructureDetail("현재완료"); }
function englishRelativeDetail(title = "관계대명사") { return englishStructureDetail(title); }
function englishStructureDetail(title = "문장 구조와 독해") {
  return baseDetail(title, "english", {
    core: [
      `${title} 단원은 문장의 뼈대를 찾고 의미를 정확히 해석하는 힘을 기르는 단원이다.`,
      "영어 문장은 주어와 동사를 중심으로 읽고, 수식어는 무엇을 꾸미는지 확인한다.",
      "문법은 암기만 하는 것이 아니라 해석과 영작에서 어떻게 쓰이는지 연결해야 한다.",
    ],
    summary: [
      "문장을 읽을 때 먼저 주어와 동사를 찾으면 긴 문장도 구조가 보인다. 전치사구, 관계사절, 분사구는 문장을 길게 만들지만 핵심 뼈대는 따로 있다.",
      "문법 표현은 뜻, 형태, 쓰임을 함께 공부해야 한다. 예를 들어 조동사는 조동사 + 동사원형의 형태를 가지며 가능, 의무, 충고, 추측 같은 의미를 만든다.",
      "독해 문제에서는 연결어와 대명사 지시 대상을 확인하면 글의 흐름과 주제를 파악하기 쉽다.",
    ],
    rules: [
      "문법 공식은 형태, 뜻, 예문 순서로 정리한다.",
      "예외 표현은 따로 외우되 왜 예외처럼 보이는지 문장 구조로 확인한다.",
      "서술형은 어순, 수일치, 시제, 동사 형태를 마지막에 점검한다.",
    ],
    exam: [
      "빈칸 앞뒤의 품사와 문장 성분을 먼저 본다.",
      "해석이 자연스러워도 동사 형태가 틀리면 오답이다.",
      "대명사가 가리키는 말을 묻는 문제는 바로 앞 문장만 보지 말고 문맥을 확인한다.",
    ],
  });
}

function societyDetail(title) {
  return baseDetail(title, "society", {
    core: [
      "사회 단원은 사람들이 살아가는 공간, 제도, 문화, 경제 활동이 서로 영향을 주고받는 과정을 이해하는 것이 핵심이다.",
      "지도와 통계 자료는 단순 암기가 아니라 위치, 변화, 원인과 결과를 읽는 도구이다.",
      "지역의 특징은 자연환경과 인문환경이 함께 작용해 만들어진다.",
    ],
    summary: [
      "위치는 절대적 위치와 상대적 위치로 나누어 설명할 수 있다. 절대적 위치는 위도와 경도처럼 기준이 분명한 위치이고, 상대적 위치는 주변 지역과의 관계 속에서 파악하는 위치이다.",
      "사람들의 생활 모습은 기후, 지형, 자원 같은 자연환경의 영향을 받지만 교통, 기술, 정책 같은 인문환경에 의해 달라지기도 한다.",
      "사회 문제를 공부할 때는 원인, 이해관계자, 해결 방안, 한계의 순서로 정리하면 서술형 답안을 쓰기 좋다.",
    ],
    rules: [
      "지도 문제는 제목, 범례, 축척, 방위를 먼저 확인한다.",
      "통계 그래프는 가장 큰 값과 작은 값, 변화 방향, 예외 지역을 표시한다.",
      "원인과 결과를 단정하지 말고 여러 요인이 함께 작용한다고 설명한다.",
    ],
    exam: [
      "위도와 경도, 축척과 방위의 개념을 정확히 구분한다.",
      "기후와 생활양식의 관계를 사례로 설명한다.",
      "자료 해석형 문제는 자료에 근거한 표현을 사용해야 한다.",
    ],
  });
}

function societyEconomyDetail(title = "경제생활과 선택") {
  return baseDetail(title, "society", {
    core: [
      "경제는 한정된 자원으로 무엇을 생산하고 어떻게 나누며 소비할지 선택하는 활동이다.",
      "희소성 때문에 모든 선택에는 포기한 것의 가치인 기회비용이 생긴다.",
      "시장에서는 수요와 공급이 상호작용하여 가격이 형성된다.",
    ],
    summary: [
      "수요는 소비자가 어떤 상품을 사려는 욕구와 능력이고, 공급은 생산자가 상품을 팔려는 욕구와 능력이다.",
      "가격이 오르면 일반적으로 수요량은 줄고 공급량은 늘어난다. 가격이 내리면 수요량은 늘고 공급량은 줄어드는 경향이 있다.",
      "시장은 효율적인 자원 배분을 돕지만 불평등, 외부 효과, 공공재 부족 같은 문제가 생길 수 있어 정부의 역할이 필요하다.",
    ],
    rules: [
      "기회비용은 실제 지출 비용만이 아니라 포기한 대안의 가치까지 포함한다.",
      "균형 가격은 수요량과 공급량이 같아지는 지점이다.",
      "경제 그래프는 축 이름과 곡선 이동의 원인을 함께 확인한다.",
    ],
    exam: [
      "수요 변화와 수요량 변화를 구분한다.",
      "가격 변화는 그래프 위 점의 이동, 소득이나 선호 변화는 곡선 자체의 이동으로 본다.",
      "시장 실패 사례와 정부 개입 방안을 연결해 외운다.",
    ],
  });
}

function societyClimateDetail() { return societyDetail("다양한 기후 지역"); }
function societyPoliticsDetail(title = "정치 생활과 민주주의") {
  return baseDetail(title, "society", {
    core: [
      "민주주의는 국민이 주권을 가지고 정치 과정에 참여하는 제도와 원리이다.",
      "헌법은 국가의 기본 질서와 국민의 기본권, 국가기관의 구성을 정한 최고 규범이다.",
      "권력 분립은 국가 권력이 한곳에 집중되는 것을 막기 위한 장치이다.",
    ],
    summary: [
      "민주 정치는 선거, 정당, 시민 참여, 여론 형성을 통해 이루어진다. 선거는 대표를 뽑는 절차이지만, 민주주의는 선거 이후의 감시와 참여까지 포함한다.",
      "기본권은 인간답게 살기 위해 필요한 권리이며 자유권, 평등권, 사회권, 참정권, 청구권 등으로 나눌 수 있다.",
      "국회는 법률을 만들고, 정부는 법률을 집행하며, 법원은 분쟁을 해결하고 법을 적용한다. 서로 견제와 균형을 이룬다.",
    ],
    rules: [
      "국민 주권, 권력 분립, 법치주의, 기본권 보장을 함께 정리한다.",
      "권리와 의무는 대립만 하는 것이 아니라 공동체 유지 속에서 함께 작동한다.",
      "정치 참여 방법은 선거, 청원, 시민단체, 공청회, 온라인 참여 등으로 다양하다.",
    ],
    exam: [
      "기본권 종류와 사례를 연결한다.",
      "국가기관의 역할을 섞어 쓰지 않는다.",
      "민주주의의 의의를 개인의 자유와 공동체 문제 해결 측면에서 서술한다.",
    ],
  });
}

function historyAncientDetail() { return historyThreeKingdomsDetail("선사 시대와 고조선"); }
function historyThreeKingdomsDetail(title = "삼국의 성립과 발전") {
  return baseDetail(title, "history", {
    core: [
      "삼국은 왕권 강화, 율령 반포, 불교 수용, 영토 확장을 통해 중앙집권 국가로 성장했다.",
      "고구려, 백제, 신라는 서로 경쟁하면서도 중국, 일본 등 주변 세계와 교류했다.",
      "각 나라의 전성기 왕과 영토 확장 방향을 지도와 함께 정리하는 것이 중요하다.",
    ],
    summary: [
      "고구려는 광개토 대왕과 장수왕 때 만주와 한반도 북부를 중심으로 크게 성장했다. 장수왕의 평양 천도는 남진 정책과 연결된다.",
      "백제는 근초고왕 때 전성기를 맞아 마한 지역을 장악하고 중국, 왜와 활발히 교류했다.",
      "신라는 진흥왕 때 한강 유역을 차지하며 삼국 통일의 발판을 마련했다. 한강 유역은 교통과 경제, 대외 교류에서 중요했다.",
    ],
    rules: [
      "중앙집권 국가의 지표: 왕위 세습, 율령, 불교, 관등제, 영토 확장.",
      "전성기 순서와 왕 이름을 함께 외운다.",
      "불교 수용은 왕권 강화와 사상 통합에 기여했다.",
    ],
    exam: [
      "고구려 장수왕의 남진 정책과 백제의 수도 이동을 연결한다.",
      "신라 진흥왕의 한강 유역 확보 의미를 설명한다.",
      "삼국의 문화유산을 나라별로 구분한다.",
    ],
  }, [
    { name: "광개토 대왕", role: "고구려의 영토를 크게 넓히고 동북아시아에서 고구려의 위상을 높였다." },
    { name: "진흥왕", role: "신라의 영토를 확장하고 한강 유역을 확보해 삼국 통일의 기반을 마련했다." },
  ]);
}

function historyGoryeoDetail() { return historyJoseonDetail("고려의 성립과 변화"); }
function historyJoseonDetail(title = "조선의 건국과 통치 체제") {
  return baseDetail(title, "history", {
    core: [
      "조선은 성리학을 통치 이념으로 삼아 중앙집권적 관료 국가를 세웠다.",
      "왕권과 신권의 균형, 과거제, 의정부와 6조, 3사의 역할이 통치 체제 이해의 핵심이다.",
      "조선 전기 제도 정비는 국가 운영의 기준을 마련했다는 의의가 있다.",
    ],
    summary: [
      "조선 건국 세력은 고려 말 권문세족의 문제를 비판하고 신진 사대부를 중심으로 새 왕조를 세웠다.",
      "태종은 왕권 강화와 제도 정비에 힘썼고, 세종은 집현전 설치, 훈민정음 창제, 과학 기술 발전을 이끌었다.",
      "경국대전은 조선의 통치 제도를 법전으로 정리한 것으로, 조선 전기 국가 체제가 완성되어 가는 과정을 보여 준다.",
    ],
    rules: [
      "의정부는 국정을 총괄하고, 6조는 행정을 나누어 담당한다.",
      "3사는 사헌부, 사간원, 홍문관으로 권력 견제와 언론 기능을 맡았다.",
      "성리학은 정치, 사회 질서와 교육 제도에 큰 영향을 주었다.",
    ],
    exam: [
      "훈민정음 창제의 목적과 의의를 백성의 문자 생활과 연결한다.",
      "왕권 강화 정책과 신권 견제 장치를 구분한다.",
      "조선의 통치 기구 역할을 표로 정리하면 실수가 줄어든다.",
    ],
  }, [{ name: "세종", role: "훈민정음 창제, 과학 기술 진흥, 유교 정치 발전을 이끈 조선의 대표적인 왕이다." }]);
}

function historyModernDetail(title = "개항과 근대 국가 수립 운동") {
  return baseDetail(title, "history", {
    core: [
      "개항 이후 조선은 외세의 압력과 내부 개혁 요구 속에서 근대 국가로 나아가려 했다.",
      "개화 정책, 위정척사 운동, 동학 농민 운동, 갑오개혁은 서로 다른 입장과 시대적 배경 속에서 나타났다.",
      "근대사는 사건의 원인, 전개, 결과, 한계를 연결해 이해해야 한다.",
    ],
    summary: [
      "강화도 조약 이후 조선은 불평등 조약 체제에 편입되었다. 이후 개화 정책이 추진되었지만 외세의 침투와 내부 갈등이 커졌다.",
      "동학 농민 운동은 반봉건과 반외세의 성격을 지녔다. 농민군의 요구는 갑오개혁에 일부 반영되었지만 외세 개입 속에서 좌절되었다.",
      "독립협회와 대한제국의 개혁은 자주 독립과 근대적 제도 마련을 목표로 했으나 국제 정세와 국내 권력 구조의 한계에 부딪혔다.",
    ],
    rules: [
      "사건은 원인, 주도 세력, 주장, 결과를 표로 정리한다.",
      "반봉건은 신분제와 탐관오리 문제 비판, 반외세는 외국 침략과 경제 침탈 반대를 뜻한다.",
      "근대 개혁의 의의와 한계를 함께 써야 좋은 서술형 답안이 된다.",
    ],
    exam: [
      "강화도 조약이 불평등 조약인 이유를 조항과 연결한다.",
      "동학 농민 운동의 성격을 반봉건, 반외세로 설명한다.",
      "갑오개혁의 내용과 한계를 구분한다.",
    ],
  }, [{ name: "전봉준", role: "동학 농민 운동의 대표 지도자로 농민군을 이끌며 폐정 개혁을 요구했다." }, { name: "서재필", role: "독립신문 창간과 독립협회 활동을 통해 자주 독립과 민권 의식 확산에 기여했다." }]);
}

function historyIndependenceDetail() { return historyModernDetail("일제 강점기와 독립운동"); }
function worldHistoryDetail() { return historyThreeKingdomsDetail("문명의 발생과 고대 세계"); }

function makeQuestions(title, subject) {
  const bySubject = {
    science: [
      mc(`${title}에서 개념을 설명할 때 가장 중요한 태도는?`, ["용어만 암기한다", "원인과 결과를 연결한다", "그림은 보지 않는다", "예시는 외우지 않는다"], 1, "쉬움", "과학은 현상의 원리와 원인, 결과를 연결해야 한다."),
      blank(`${title} 학습에서 실험 결과를 해석할 때 먼저 확인해야 하는 것은 실험의 ______이다.`, "조건", "보통", "비교 실험은 조건 통제가 핵심이다."),
      ox(`${title}에서는 용어의 뜻과 사례를 함께 익히면 문제 해결에 도움이 된다.`, true, "쉬움", "개념과 사례를 연결하면 낯선 자료 문제도 풀 수 있다."),
      short(`${title} 단원의 핵심 개념 하나를 골라 일상생활 사례와 연결해 설명하시오.`, "핵심 개념", "어려움", "정답은 다양하지만 개념, 사례, 연결 이유가 모두 들어가야 한다."),
    ],
    math: [
      mc(`${title} 문제를 풀 때 가장 먼저 해야 할 일은?`, ["답부터 찍기", "조건과 구하는 값을 확인하기", "계산을 생략하기", "단위를 무시하기"], 1, "쉬움", "조건과 목표를 확인해야 알맞은 식을 세울 수 있다."),
      blank(`수학 풀이에서 결과가 맞는지 원래 조건에 다시 넣어 확인하는 과정을 ______이라고 한다.`, "검산", "쉬움", "검산은 계산 실수를 줄인다."),
      ox(`공식은 뜻을 몰라도 모양만 외우면 모든 문제를 풀 수 있다.`, false, "보통", "공식의 조건과 의미를 알아야 변형 문제를 풀 수 있다."),
      short(`${title}에서 자주 쓰는 풀이 전략 한 가지를 쓰고 이유를 설명하시오.`, "조건 정리", "어려움", "조건을 표나 식으로 정리하면 관계가 분명해진다."),
    ],
    society: [
      mc(`${title} 자료형 문제에서 가장 먼저 확인할 것은?`, ["글씨체", "제목과 범례", "문항 번호", "선지 길이"], 1, "쉬움", "제목과 범례가 자료의 의미를 알려 준다."),
      blank(`사회 현상은 하나의 원인보다 여러 요인이 함께 작용하는 경우가 많으므로 원인과 ______를 연결해야 한다.`, "결과", "보통", "원인, 과정, 결과의 흐름이 중요하다."),
      ox(`${title}에서는 사례와 개념을 연결해 설명하는 서술형이 나올 수 있다.`, true, "보통", "사회는 개념을 실제 사례에 적용하는 문제가 많다."),
      short(`${title}의 개념 하나를 골라 우리 생활과 어떤 관련이 있는지 설명하시오.`, "생활 관련", "어려움", "개념, 사례, 영향이 들어가면 좋은 답안이다."),
    ],
    english: [
      mc(`${title} 문법 문제에서 먼저 확인할 것은?`, ["문장 구조", "글자 수", "문제 위치", "종이 색"], 0, "쉬움", "주어, 동사, 목적어 등 구조를 봐야 알맞은 형태를 고를 수 있다."),
      blank(`영어 서술형에서는 뜻뿐 아니라 어순, 시제, 동사의 ______를 확인해야 한다.`, "형태", "보통", "동사 형태 오류가 서술형 감점의 흔한 원인이다."),
      ox(`${title} 표현은 예문 속에서 익히면 쓰임을 이해하기 쉽다.`, true, "쉬움", "문법은 실제 문장과 함께 익혀야 오래 기억된다."),
      short(`${title}를 사용한 예문 하나를 쓰고 우리말 뜻을 적으시오.`, "예문", "어려움", "정확한 형태와 자연스러운 뜻이 중요하다."),
    ],
    history: [
      mc(`${title} 사건을 정리할 때 가장 적절한 순서는?`, ["결과만 외우기", "원인-과정-결과-의의", "인물 이름만 암기", "연도만 보기"], 1, "쉬움", "역사는 사건의 흐름과 의미를 함께 이해해야 한다."),
      blank(`역사 서술형에서는 사건의 원인, 과정, 결과와 함께 ______를 쓰면 답안이 좋아진다.`, "의의", "보통", "의의는 그 사건이 역사적으로 갖는 의미이다."),
      ox(`${title}에서는 인물의 활동을 시대적 배경과 연결해 이해해야 한다.`, true, "보통", "인물의 선택은 당시 사회 상황과 연결된다."),
      short(`${title}에서 중요한 사건 하나를 골라 원인과 결과를 설명하시오.`, "원인과 결과", "어려움", "사건명, 배경, 전개, 결과가 들어가야 한다."),
    ],
  };
  return bySubject[subject];
}

function mc(prompt, options, answer, difficulty, explanation) {
  return { id: cryptoId(prompt), type: "객관식", prompt, options, answer, difficulty, explanation };
}

function blank(prompt, answer, difficulty, explanation) {
  return { id: cryptoId(prompt), type: "빈칸", prompt, answer, difficulty, explanation };
}

function ox(prompt, answer, difficulty, explanation) {
  return { id: cryptoId(prompt), type: "OX", prompt, options: ["O", "X"], answer: answer ? 0 : 1, difficulty, explanation };
}

function short(prompt, answer, difficulty, explanation) {
  return { id: cryptoId(prompt), type: "서술형", prompt, answer, difficulty, explanation };
}

function cryptoId(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return `q-${hash}`;
}

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

function allUnits() {
  return Object.entries(curriculum).flatMap(([subject, grades]) =>
    Object.entries(grades).flatMap(([grade, units]) => units.map((item) => ({ ...item, subject, grade })))
  );
}

function currentSubject() {
  return subjectStyles[state.subject] || subjectStyles.science;
}

function currentUnit() {
  return allUnits().find((item) => item.subject === state.subject && item.grade === state.grade && item.id === state.unitId);
}

function setRoute(next) {
  Object.assign(state, next);
  state.answers = {};
  state.checked = {};
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function markProgress(unitId) {
  state.progress[unitId] = Math.max(state.progress[unitId] || 0, 1);
  save("perfectNoteProgress", state.progress);
}

function bumpProgress(unitId, amount) {
  state.progress[unitId] = Math.min(100, Math.max(state.progress[unitId] || 0, amount));
  save("perfectNoteProgress", state.progress);
}

function progressPercent() {
  const units = allUnits();
  if (!units.length) return 0;
  const total = units.reduce((sum, item) => sum + (state.progress[item.id] || 0), 0);
  return Math.round(total / units.length);
}

function render() {
  const style = currentSubject();
  app.innerHTML = `
    <div class="app-shell" style="--accent:${style.color}; --progress:${progressPercent()}">
      ${renderTopbar()}
      <main class="container">
        ${renderPage()}
      </main>
      <footer class="footer">만점 개념노트 · 예시 데이터 기반 학습 웹사이트 · 단원 데이터는 app.js에서 계속 확장할 수 있습니다.</footer>
    </div>
  `;
  bindEvents();
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="topbar-inner">
        <button class="brand" data-home>만점 개념노트</button>
        <label class="search-wrap">
          <span class="search-icon">⌕</span>
          <input data-search value="${escapeHtml(state.query)}" placeholder="단원명, 개념명, 과학자, 역사 인물, 공식 검색" />
        </label>
        <div class="top-actions">
          <button class="ghost-btn" data-wrong>오답노트 ${state.wrongNotes.length}</button>
          <button class="ghost-btn" data-favorites>즐겨찾기 ${state.favorites.length}</button>
        </div>
      </div>
    </header>
  `;
}

function renderPage() {
  if (state.query.trim()) return renderSearch();
  if (state.unitId) return renderUnitDetail();
  if (state.subject && state.grade) return renderUnits();
  if (state.subject) return renderGrades();
  if (state.view === "wrong") return renderWrongNote();
  if (state.view === "favorites") return renderFavorites();
  return renderHome();
}

function renderHome() {
  const totalUnits = allUnits().length;
  return `
    <section class="hero">
      <div class="hero-main">
        <span class="eyebrow">교육과정 흐름에 맞춘 개념 정리</span>
        <h1>만점 개념노트</h1>
        <p class="lead">학년별·단원별로 개념을 정리하고 문제로 복습하는 학습 사이트입니다. 과학, 수학, 사회, 영어, 역사를 한곳에서 차분하게 공부하세요.</p>
        <div class="hero-metrics">
          <div class="metric"><strong>5</strong><span>과목</span></div>
          <div class="metric"><strong>${totalUnits}</strong><span>예시 단원</span></div>
          <div class="metric"><strong>${progressPercent()}%</strong><span>전체 진행률</span></div>
        </div>
      </div>
      <aside class="study-panel">
        <h3>오늘의 학습 상태</h3>
        <div class="progress-ring" data-label="${progressPercent()}%"></div>
        <p class="muted">단원을 열람하고 문제를 확인하면 진행률이 올라갑니다. 틀린 문제는 자동으로 오답노트에 저장됩니다.</p>
      </aside>
    </section>
    <div class="section-head">
      <div>
        <h2>과목 선택</h2>
        <p>과목마다 색을 다르게 구분해 빠르게 이동할 수 있습니다.</p>
      </div>
    </div>
    <section class="grid">
      ${Object.entries(subjectStyles).map(([key, item]) => `
        <button class="card click-card subject-card" data-subject="${key}" style="--accent:${item.color}">
          <div class="card-icon">${item.icon}</div>
          <h3>${item.name}</h3>
          <p>${item.name}의 핵심 개념, 시험 포인트, 유형별 문제를 학년별로 정리했습니다.</p>
        </button>
      `).join("")}
    </section>
  `;
}

function renderGrades() {
  const subject = currentSubject();
  return `
    ${breadcrumb([{ label: "홈", action: "home" }, { label: subject.name }])}
    <div class="section-head">
      <div>
        <h2>${subject.name} 학년 선택</h2>
        <p>초등학교, 중학교 1~3학년, 고등학교 공통과목 중심으로 구성했습니다.</p>
      </div>
    </div>
    <section class="grid three">
      ${Object.entries(gradeLabels).map(([key, label]) => {
        const count = curriculum[state.subject][key]?.length || 0;
        return `
          <button class="card click-card" data-grade="${key}">
            <div class="card-icon">${key.includes("middle") ? "중" : key === "high" ? "고" : "초"}</div>
            <h3>${label}</h3>
            <p>${count}개 단원 · 교육과정 흐름에 맞춘 개념과 문제</p>
          </button>
        `;
      }).join("")}
    </section>
  `;
}

function renderUnits() {
  const subject = currentSubject();
  const units = curriculum[state.subject][state.grade] || [];
  return `
    ${breadcrumb([{ label: "홈", action: "home" }, { label: subject.name, action: "subject" }, { label: gradeLabels[state.grade] }])}
    <div class="section-head">
      <div>
        <h2>${subject.name} · ${gradeLabels[state.grade]}</h2>
        <p>단원 카드를 눌러 개념 총정리와 문제 풀이로 이동하세요.</p>
      </div>
      <button class="ghost-btn" data-back-subject>학년 다시 선택</button>
    </div>
    <section class="grid units">
      ${units.map((item) => renderUnitCard(item, state.subject, state.grade)).join("")}
    </section>
  `;
}

function renderUnitCard(item, subject, grade) {
  const fav = state.favorites.includes(item.id);
  const progress = state.progress[item.id] || 0;
  return `
    <button class="card click-card unit-card" data-unit="${item.id}" data-unit-subject="${subject}" data-unit-grade="${grade}">
      <div class="question-top">
        <span class="pill">${item.grade}</span>
        <span class="pill">${item.questions.length}문제</span>
        <span class="pill ${fav ? "favorite" : ""}">${fav ? "★ 즐겨찾기" : "☆ 저장 가능"}</span>
      </div>
      <h3>${item.title}</h3>
      <p class="unit-meta">${item.overview}</p>
      <div class="tag-row">${item.keywords.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <div class="bar" aria-label="진행률"><span style="--w:${progress}%"></span></div>
    </button>
  `;
}

function renderUnitDetail() {
  const item = currentUnit();
  if (!item) return renderHome();
  markProgress(item.id);
  const subject = subjectStyles[item.subject];
  const favorite = state.favorites.includes(item.id);
  return `
    ${breadcrumb([{ label: "홈", action: "home" }, { label: subject.name, action: "subject" }, { label: gradeLabels[item.grade], action: "grade" }, { label: item.title }])}
    <section class="card" style="--accent:${subject.color}">
      <div class="section-head">
        <div>
          <span class="eyebrow">${subject.name} · ${gradeLabels[item.grade]}</span>
          <h1>${item.title}</h1>
          <p class="lead">${item.overview}</p>
        </div>
        <button class="icon-btn" title="즐겨찾기" data-toggle-favorite="${item.id}">${favorite ? "★" : "☆"}</button>
      </div>
      <div class="tag-row">${item.keywords.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    </section>
    <nav class="tabs">
      ${[
        ["concept", "개념 보기"],
        ["quiz", "문제 풀기"],
        ["wrong", "이 단원 오답"],
      ].map(([key, label]) => `<button class="tab ${state.tab === key ? "active" : ""}" data-tab="${key}">${label}</button>`).join("")}
    </nav>
    ${state.tab === "quiz" ? renderQuiz(item) : state.tab === "wrong" ? renderWrongNote(item.id) : renderConcept(item)}
  `;
}

function renderConcept(item) {
  const sections = [
    ["핵심 개념", item.sections.core],
    ["개념 총정리", item.sections.summary],
    ["공식 / 법칙 / 원리", item.sections.rules],
    ["인물 / 과학자 / 역사 인물", item.people.length ? item.people.map((p) => `<strong>${p.name}</strong>: ${p.role}`) : ["이 단원에서 따로 암기할 인물은 많지 않습니다. 대신 핵심 용어와 사례를 정확히 연결하세요."]],
    ["시험 포인트", item.sections.exam],
  ];
  return `
    <div class="detail-layout">
      <section class="accordion">
        ${sections.map(([title, lines]) => renderAccordion(title, lines)).join("")}
      </section>
      <aside class="side-stack">
        <div class="card">
          <h3>학습 진행률</h3>
          <div class="bar"><span style="--w:${state.progress[item.id] || 0}%"></span></div>
          <p class="muted">${state.progress[item.id] || 0}% 완료 · 개념을 읽고 문제를 확인하면 올라갑니다.</p>
        </div>
        <div class="card">
          <h3>빠른 복습</h3>
          <div class="quick-list">
            ${item.keywords.map((key) => `<button data-search-key="${key}">${key} 검색하기</button>`).join("")}
          </div>
        </div>
      </aside>
    </div>
  `;
}

function renderAccordion(title, lines) {
  const open = state.openSections.has(title);
  return `
    <article class="accordion-item">
      <button class="accordion-title" data-accordion="${title}">
        <span>${title}</span><span>${open ? "접기" : "펼치기"}</span>
      </button>
      ${open ? `<div class="accordion-body"><ul>${lines.map((line) => `<li>${line}</li>`).join("")}</ul></div>` : ""}
    </article>
  `;
}

function renderQuiz(item) {
  bumpProgress(item.id, Math.max(state.progress[item.id] || 0, 35));
  return `
    <div class="detail-layout">
      <section>
        ${item.questions.map((q, index) => renderQuestion(item, q, index)).join("")}
      </section>
      <aside class="side-stack">
        <div class="card">
          <h3>문제 풀이 안내</h3>
          <p class="muted">객관식, 빈칸, OX, 서술형을 모두 풀어 보세요. 틀린 문제는 오답노트에 저장됩니다.</p>
        </div>
        <div class="card">
          <h3>난이도</h3>
          <div class="tag-row"><span class="tag">쉬움</span><span class="tag">보통</span><span class="tag">어려움</span></div>
        </div>
      </aside>
    </div>
  `;
}

function renderQuestion(item, q, index) {
  const answer = state.answers[q.id];
  const checked = state.checked[q.id];
  return `
    <article class="card question-card">
      <div class="question-top">
        <span class="pill">문제 ${index + 1}</span>
        <span class="pill">${q.type}</span>
        <span class="pill">${q.difficulty}</span>
      </div>
      <h3>${q.prompt}</h3>
      ${q.options ? `
        <div class="options">
          ${q.options.map((option, optionIndex) => `<button class="option ${answer === optionIndex ? "selected" : ""}" data-answer="${q.id}" data-value="${optionIndex}">${option}</button>`).join("")}
        </div>
      ` : `<textarea class="blank-answer" data-text-answer="${q.id}" placeholder="답을 입력하세요">${escapeHtml(answer || "")}</textarea>`}
      <div>
        <button class="primary-btn" data-check="${q.id}" data-unit-id="${item.id}">정답 확인</button>
      </div>
      ${checked ? renderAnswerBox(q, answer) : ""}
    </article>
  `;
}

function renderAnswerBox(q, answer) {
  const correct = isCorrect(q, answer);
  const answerText = q.options ? q.options[q.answer] : q.answer;
  return `
    <div class="answer-box ${correct ? "correct" : "wrong"}">
      <strong>${correct ? "정답입니다." : "다시 확인해 보세요."}</strong>
      <p>정답: ${answerText}</p>
      <p>해설: ${q.explanation}</p>
    </div>
  `;
}

function isCorrect(q, answer) {
  if (q.options) return Number(answer) === q.answer;
  return String(answer || "").replace(/\s+/g, "").toLowerCase().includes(String(q.answer).replace(/\s+/g, "").toLowerCase());
}

function renderSearch() {
  const query = state.query.trim().toLowerCase();
  const results = allUnits().filter((item) => {
    const haystack = [
      subjectStyles[item.subject].name,
      gradeLabels[item.grade],
      item.title,
      item.overview,
      ...item.keywords,
      ...item.sections.core,
      ...item.sections.summary,
      ...item.sections.rules,
      ...item.sections.exam,
      ...item.people.flatMap((p) => [p.name, p.role]),
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
  return `
    <div class="section-head">
      <div>
        <h2>검색 결과</h2>
        <p>“${escapeHtml(state.query)}”에 대한 단원, 개념, 인물, 공식 검색 결과입니다.</p>
      </div>
      <button class="ghost-btn" data-clear-search>검색 초기화</button>
    </div>
    <section class="search-results">
      ${results.length ? results.map((item) => renderUnitCard(item, item.subject, item.grade)).join("") : `<div class="empty">검색 결과가 없습니다. 단원명, 개념명, 인물명, 공식 이름을 바꿔 검색해 보세요.</div>`}
    </section>
  `;
}

function renderWrongNote(unitId = null) {
  const notes = unitId ? state.wrongNotes.filter((note) => note.unitId === unitId) : state.wrongNotes;
  return `
    <div class="section-head">
      <div>
        <h2>오답노트</h2>
        <p>틀린 문제를 다시 풀고 해설을 확인할 수 있습니다.</p>
      </div>
      ${notes.length ? `<button class="ghost-btn" data-clear-wrong>오답노트 비우기</button>` : ""}
    </div>
    <section class="wrong-note">
      ${notes.length ? notes.map((note) => `
        <article class="card">
          <div class="question-top"><span class="pill">${note.subjectName}</span><span class="pill">${note.unitTitle}</span><span class="pill">${note.type}</span></div>
          <h3>${note.prompt}</h3>
          <p>정답: ${note.correctAnswer}</p>
          <p class="muted">해설: ${note.explanation}</p>
          <button class="small-btn" data-go-unit="${note.unitId}" data-go-subject="${note.subject}" data-go-grade="${note.grade}">단원에서 다시 풀기</button>
        </article>
      `).join("") : `<div class="empty">아직 저장된 오답이 없습니다. 문제를 풀고 정답을 확인하면 자동으로 저장됩니다.</div>`}
    </section>
  `;
}

function renderFavorites() {
  const units = allUnits().filter((item) => state.favorites.includes(item.id));
  return `
    <div class="section-head">
      <div>
        <h2>즐겨찾기</h2>
        <p>중요한 단원을 모아 빠르게 복습합니다.</p>
      </div>
    </div>
    <section class="grid units">
      ${units.length ? units.map((item) => renderUnitCard(item, item.subject, item.grade)).join("") : `<div class="empty">즐겨찾기한 단원이 없습니다. 단원 상세 화면의 별표를 눌러 저장하세요.</div>`}
    </section>
  `;
}

function breadcrumb(items) {
  return `
    <nav class="breadcrumb">
      ${items.map((item, index) => `
        ${item.action ? `<button data-crumb="${item.action}">${item.label}</button>` : `<span>${item.label}</span>`}
        ${index < items.length - 1 ? `<span>/</span>` : ""}
      `).join("")}
    </nav>
  `;
}

function bindEvents() {
  document.querySelector("[data-home]")?.addEventListener("click", () => setRoute({ subject: null, grade: null, unitId: null, query: "", view: null }));
  document.querySelector("[data-search]")?.addEventListener("input", (event) => {
    state.query = event.target.value;
    state.view = null;
    render();
    document.querySelector("[data-search]")?.focus();
  });
  document.querySelector("[data-wrong]")?.addEventListener("click", () => setRoute({ view: "wrong", subject: null, grade: null, unitId: null, query: "" }));
  document.querySelector("[data-favorites]")?.addEventListener("click", () => setRoute({ view: "favorites", subject: null, grade: null, unitId: null, query: "" }));
  document.querySelector("[data-clear-search]")?.addEventListener("click", () => setRoute({ query: "" }));
  document.querySelector("[data-clear-wrong]")?.addEventListener("click", () => {
    state.wrongNotes = [];
    save("perfectNoteWrongNotes", state.wrongNotes);
    render();
  });
  document.querySelectorAll("[data-subject]").forEach((button) => button.addEventListener("click", () => setRoute({ subject: button.dataset.subject, grade: null, unitId: null, view: null })));
  document.querySelectorAll("[data-grade]").forEach((button) => button.addEventListener("click", () => setRoute({ grade: button.dataset.grade, unitId: null })));
  document.querySelector("[data-back-subject]")?.addEventListener("click", () => setRoute({ grade: null, unitId: null }));
  document.querySelectorAll("[data-unit]").forEach((button) => button.addEventListener("click", () => setRoute({ subject: button.dataset.unitSubject, grade: button.dataset.unitGrade, unitId: button.dataset.unit, tab: "concept", view: null })));
  document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => setRoute({ tab: button.dataset.tab })));
  document.querySelectorAll("[data-accordion]").forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.accordion;
    state.openSections.has(key) ? state.openSections.delete(key) : state.openSections.add(key);
    render();
  }));
  document.querySelectorAll("[data-search-key]").forEach((button) => button.addEventListener("click", () => setRoute({ query: button.dataset.searchKey })));
  document.querySelectorAll("[data-toggle-favorite]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.toggleFavorite;
    state.favorites = state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
    save("perfectNoteFavorites", state.favorites);
    render();
  }));
  document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => {
    state.answers[button.dataset.answer] = Number(button.dataset.value);
    render();
  }));
  document.querySelectorAll("[data-text-answer]").forEach((input) => input.addEventListener("input", (event) => {
    state.answers[input.dataset.textAnswer] = event.target.value;
  }));
  document.querySelectorAll("[data-check]").forEach((button) => button.addEventListener("click", () => checkAnswer(button.dataset.check, button.dataset.unitId)));
  document.querySelectorAll("[data-go-unit]").forEach((button) => button.addEventListener("click", () => setRoute({ subject: button.dataset.goSubject, grade: button.dataset.goGrade, unitId: button.dataset.goUnit, tab: "quiz", view: null, query: "" })));
  document.querySelectorAll("[data-crumb]").forEach((button) => button.addEventListener("click", () => {
    const crumb = button.dataset.crumb;
    if (crumb === "home") setRoute({ subject: null, grade: null, unitId: null, view: null, query: "" });
    if (crumb === "subject") setRoute({ grade: null, unitId: null });
    if (crumb === "grade") setRoute({ unitId: null });
  }));
}

function checkAnswer(questionId, unitId) {
  const item = allUnits().find((unitItem) => unitItem.id === unitId);
  const q = item.questions.find((question) => question.id === questionId);
  state.checked[questionId] = true;
  const answer = state.answers[questionId];
  if (isCorrect(q, answer)) {
    bumpProgress(item.id, Math.max(state.progress[item.id] || 0, 65));
  } else {
    const note = {
      id: `${unitId}-${questionId}`,
      unitId,
      subject: item.subject,
      grade: item.grade,
      subjectName: subjectStyles[item.subject].name,
      unitTitle: item.title,
      type: q.type,
      prompt: q.prompt,
      correctAnswer: q.options ? q.options[q.answer] : q.answer,
      explanation: q.explanation,
    };
    state.wrongNotes = [note, ...state.wrongNotes.filter((old) => old.id !== note.id)];
    save("perfectNoteWrongNotes", state.wrongNotes);
  }
  const answeredCount = Object.keys(state.checked).length;
  if (answeredCount >= item.questions.length) bumpProgress(item.id, 100);
  render();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

render();
