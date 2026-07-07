import science from "./science.js";
import math from "./math.js";
import society from "./society.js";
import history from "./history.js";
import english from "./english.js";
import korean from "./korean.js";
import { applyCurriculumExpansion } from "./curriculumExpansion.js";

export const subjects = applyCurriculumExpansion([math, science, society, history, english, korean]);
export const subjectMap = Object.fromEntries(subjects.map((subject) => [subject.id, subject]));

export const gradeLabels = {
  elementary3: "초등학교 3학년",
  elementary4: "초등학교 4학년",
  elementary5: "초등학교 5학년",
  elementary6: "초등학교 6학년",
  middle1: "중학교 1학년",
  middle2: "중학교 2학년",
  middle3: "중학교 3학년",
  highCommon: "고등 공통/기초 · 2029 대입 흐름",
};
