import { createMiniUnit } from "./helpers.js";

const korean = {
  id: "korean",
  name: "국어",
  icon: "✍️",
  color: "#dc5f77",
  description: "독해, 문법, 문학, 비문학, 쓰기를 학생 눈높이로 정리하는 과목입니다.",
  grades: [
    {
      id: "elementary3",
      name: "초등학교 3학년",
      units: [
        createMiniUnit({
          subject: "korean",
          grade: "elementary3",
          title: "이야기 글 읽기",
          field: "읽기",
          difficulty: "기초",
          teaser: "인물, 사건, 배경을 중심으로 이야기 글을 이해하는 초등 기초 단원입니다.",
          achievementGoals: [
            "이야기의 인물, 사건, 배경을 찾을 수 있다.",
            "이야기 순서를 말할 수 있다.",
            "중심 장면을 자기 말로 설명할 수 있다.",
          ],
          examImportance: "국어 독해의 가장 기초가 되는 구조 읽기 감각을 만든다.",
          concepts: [
            { term: "인물", simple: "이야기 속 등장하는 사람", detailed: "행동과 마음이 사건 전개와 연결된다.", exam: "인물의 말과 행동 근거 찾기" },
            { term: "사건", simple: "이야기에서 일어나는 일", detailed: "처음, 가운데, 끝의 흐름으로 정리 가능", exam: "순서 파악" },
            { term: "배경", simple: "시간과 장소", detailed: "이야기가 일어나는 때와 곳", exam: "상황 이해 단서" },
            { term: "중심 내용", simple: "가장 중요한 내용", detailed: "글쓴이가 전하고 싶은 핵심", exam: "세부 장면과 구분" },
          ],
        }),
      ],
    },
    {
      id: "middle1",
      name: "중학교 1학년",
      units: [
        createMiniUnit({
          subject: "korean",
          grade: "middle1",
          title: "설명하는 글 읽기와 비문학 구조",
          field: "독해",
          difficulty: "핵심",
          teaser: "설명문과 정보 글의 구조를 파악하고 서술형 답안을 만드는 방법을 연습합니다.",
          achievementGoals: [
            "설명문과 비문학 글의 구조를 구분할 수 있다.",
            "중심 내용과 세부 내용을 나누어 정리할 수 있다.",
            "서술형 답안을 근거와 함께 작성할 수 있다.",
          ],
          examImportance: "국어 시험에서 내용 일치, 중심 내용 찾기, 글의 구조 파악, 서술형 작성 문제가 꾸준히 나온다.",
          concepts: [
            { term: "중심 내용", simple: "글에서 가장 중요하게 말하는 내용", detailed: "각 문단과 전체 글을 대표하는 핵심 메시지", exam: "제목, 첫 문장, 반복 표현과 연결" },
            { term: "세부 내용", simple: "중심 내용을 뒷받침하는 설명", detailed: "예시, 근거, 부연, 비교, 정의 같은 정보", exam: "중심 내용과 헷갈리지 않도록 역할을 구분" },
            { term: "문단 구조", simple: "문단 안 내용 전개 방식", detailed: "두괄식, 미괄식, 양괄식 등으로 정리 가능", exam: "문단 전개 방식을 서술형으로 설명" },
            { term: "서술형 답안", simple: "근거를 갖춘 문장형 답", detailed: "질문에 맞는 개념어와 지문 근거를 함께 쓰는 답안", exam: "개념어 + 근거 + 문장 완성" },
          ],
        }),
      ],
    },
    {
      id: "middle2",
      name: "중학교 2학년",
      units: [
        createMiniUnit({
          subject: "korean",
          grade: "middle2",
          title: "설명문 쓰기와 정보 전달",
          field: "쓰기",
          difficulty: "응용",
          teaser: "정보를 정확하게 전달하는 설명문 구조와 서술형 답안 쓰기를 함께 다룹니다.",
          achievementGoals: [
            "설명문의 목적과 구조를 설명할 수 있다.",
            "주제와 세부 설명을 구분해 글을 쓸 수 있다.",
            "독자가 이해하기 쉬운 순서로 정보를 배치할 수 있다.",
          ],
          examImportance: "수행평가와 서술형 답안 작성 능력에 직접 연결된다.",
          concepts: [
            { term: "주제", simple: "글이 말하려는 핵심 내용", detailed: "전체 설명을 이끄는 중심 생각", exam: "문단 중심 내용과 연결" },
            { term: "개요", simple: "글쓰기 전 전체 틀", detailed: "도입, 전개, 마무리를 미리 정리하는 계획", exam: "쓰기 절차" },
            { term: "정보 전달", simple: "내용을 정확히 알리는 것", detailed: "순서와 예시, 정의를 알맞게 써야 한다.", exam: "설명 방법 구분" },
            { term: "서술형 답안", simple: "문장으로 쓰는 답", detailed: "질문에 맞는 핵심어와 근거를 넣어 완결된 문장으로 작성", exam: "핵심어 누락 주의" },
          ],
        }),
      ],
    },
    {
      id: "highCommon",
      name: "고등 공통/기초",
      units: [
        createMiniUnit({
          subject: "korean",
          grade: "highCommon",
          title: "공통국어: 비문학 자료 해석과 논증",
          field: "공통국어",
          difficulty: "고등 핵심",
          teaser: "도표와 자료가 들어간 비문학 지문을 읽고 논지와 근거를 정리하는 공통국어 단원입니다.",
          achievementGoals: [
            "글의 논지와 근거를 구분할 수 있다.",
            "자료와 본문 설명의 관계를 파악할 수 있다.",
            "논증 구조를 바탕으로 서술형 답안을 쓸 수 있다.",
          ],
          examImportance: "고등 공통국어는 자료와 글을 함께 읽는 문제가 많아 구조 파악이 중요하다.",
          concepts: [
            { term: "논지", simple: "글쓴이가 중심으로 주장하는 내용", detailed: "전체 글을 관통하는 핵심 판단이나 의견", exam: "근거와 혼동 금지" },
            { term: "근거", simple: "논지를 받쳐 주는 이유와 자료", detailed: "사례, 통계, 비교, 설명 등이 논지 뒷받침 역할", exam: "주장-근거 연결 확인" },
            { term: "자료 해석", simple: "표와 그래프 읽기", detailed: "자료의 핵심 경향과 글의 설명이 어떻게 맞물리는지 파악", exam: "단위와 범례 먼저 확인" },
            { term: "논증 구조", simple: "주장과 근거가 이어지는 방식", detailed: "문단별 역할과 연결 방식을 읽는 틀", exam: "문단 기능 파악" },
          ],
        }),
        createMiniUnit({
          subject: "korean",
          grade: "highCommon",
          title: "문학 작품의 주제와 표현법",
          field: "문학",
          difficulty: "응용",
          teaser: "작품의 주제, 시점, 표현법을 읽고 답안으로 정리하는 기본 단원입니다.",
          achievementGoals: [
            "작품의 주제를 파악할 수 있다.",
            "비유, 상징, 반복 같은 표현법을 구분할 수 있다.",
            "표현 효과를 작품 내용과 연결해 설명할 수 있다.",
          ],
          examImportance: "표현법 이름만 외우기보다 작품 속 효과를 설명하는 문제가 많다.",
          concepts: [
            { term: "주제", simple: "작품이 궁극적으로 말하고자 하는 바", detailed: "소재와 구별해 작품 전체 의미를 압축한 것", exam: "소재와 주제 구분" },
            { term: "비유", simple: "다른 것에 빗대어 표현", detailed: "직유, 은유 등으로 감각적 이미지를 만든다.", exam: "표현 효과와 함께 설명" },
            { term: "상징", simple: "추상 개념을 구체적 대상에 담는 표현", detailed: "반복되는 대상이 특정 의미를 드러낼 수 있다.", exam: "문맥 속 의미 파악" },
            { term: "시점", simple: "이야기를 바라보는 관점", detailed: "1인칭, 3인칭 관찰자/전지적 시점 등으로 나뉜다.", exam: "시점 변화 여부 확인" },
          ],
        }),
      ],
    },
  ],
};

export default korean;
