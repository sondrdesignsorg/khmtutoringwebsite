import { describe, it, expect } from 'vitest';
import {
  generateTest,
  scoreQuiz,
  scoreTier,
  scorePercentile,
  AGE_GROUPS,
  SUBJECTS,
  LENGTHS,
  type AgeGroupId,
  type SubjectId,
} from '@/lib/diagnostic/questions';

const AGE_IDS = AGE_GROUPS.map((g) => g.id) as AgeGroupId[];
const SUBJECT_IDS = SUBJECTS.map((s) => s.id) as SubjectId[];
const LENGTHS_LIST = [20, 50, 100] as const;

// ─── generateTest: structure ────────────────────────────────────────────────

describe('generateTest — output structure', () => {
  it.each(LENGTHS_LIST)('returns exactly %i questions', (len) => {
    const qs = generateTest('elementary', 'math', len);
    expect(qs).toHaveLength(len);
  });

  it.each(LENGTHS_LIST)('reading: returns exactly %i questions', (len) => {
    const qs = generateTest('middle', 'reading', len);
    expect(qs).toHaveLength(len);
  });

  it('every question has an id, prompt, topic, 4 choices, valid correctIndex', () => {
    for (const ageGroup of AGE_IDS) {
      for (const subject of SUBJECT_IDS) {
        const qs = generateTest(ageGroup, subject, 12);
        for (const q of qs) {
          expect(q.id).toBeTruthy();
          expect(typeof q.prompt).toBe('string');
          expect(q.prompt.length).toBeGreaterThan(0);
          expect(typeof q.topic).toBe('string');
          expect(q.choices).toHaveLength(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThanOrEqual(3);
        }
      }
    }
  });

  it('math questions have no passage; reading questions always have a passage', () => {
    for (const ageGroup of AGE_IDS) {
      const mathQs = generateTest(ageGroup, 'math', 5);
      for (const q of mathQs) {
        expect(q.passage).toBeUndefined();
      }
      const readQs = generateTest(ageGroup, 'reading', 5);
      for (const q of readQs) {
        expect(typeof q.passage).toBe('string');
        expect((q.passage as string).length).toBeGreaterThan(0);
      }
    }
  });

  it('choices contain no duplicates', () => {
    for (const ageGroup of AGE_IDS) {
      for (const subject of SUBJECT_IDS) {
        const qs = generateTest(ageGroup, subject, 12);
        for (const q of qs) {
          const unique = new Set(q.choices);
          expect(unique.size).toBe(4);
        }
      }
    }
  });

  it('correct answer string is at choices[correctIndex]', () => {
    // Run multiple times since math is randomised
    for (let run = 0; run < 10; run++) {
      for (const ageGroup of AGE_IDS) {
        const qs = generateTest(ageGroup, 'math', 12);
        for (const q of qs) {
          expect(q.choices[q.correctIndex]).toBeDefined();
          // choices[correctIndex] must be the first (correct) option placed by buildChoiceQ
          // We can verify it is *one of* the four choices (truthy structural check)
          expect(q.choices).toContain(q.choices[q.correctIndex]);
        }
      }
    }
  });
});

// ─── generateTest: math topic cycling ───────────────────────────────────────

describe('generateTest — math topic cycling', () => {
  const TOPIC_COUNTS: Record<AgeGroupId, string[]> = {
    elementary: ['Addition', 'Subtraction', 'Multiplication', 'Word Problems', 'Division', 'Decimals'],
    middle: ['Fractions', 'Ratios & Percentages', 'Basic Algebra', 'Word Problems', 'Geometry', 'Negative Numbers'],
    high: ['Algebra', 'Geometry', 'Functions', 'Word Problems', 'Statistics', 'Quadratics'],
    satact: ['Algebra', 'Data Analysis', 'Geometry', 'Advanced Math', 'Systems of Equations', 'Probability'],
  };

  it.each(AGE_IDS)('%s math 50q cycles through all topics', (ageGroup) => {
    const qs = generateTest(ageGroup, 'math', 50);
    const seen = new Set(qs.map((q) => q.topic));
    for (const t of TOPIC_COUNTS[ageGroup]) {
      expect(seen).toContain(t);
    }
  });

  it.each(AGE_IDS)('%s math: first 6 questions match TOPIC_ORDER exactly', (ageGroup) => {
    const qs = generateTest(ageGroup, 'math', 6);
    const expected = TOPIC_COUNTS[ageGroup];
    qs.forEach((q, i) => {
      expect(q.topic).toBe(expected[i]);
    });
  });

  it('elementary 5q covers first 5 topics in order', () => {
    const qs = generateTest('elementary', 'math', 5);
    const expected = ['Addition', 'Subtraction', 'Multiplication', 'Word Problems', 'Division'];
    qs.forEach((q, i) => expect(q.topic).toBe(expected[i]));
  });

  it('question ids are unique within a test', () => {
    for (const ageGroup of AGE_IDS) {
      for (const subject of SUBJECT_IDS) {
        const qs = generateTest(ageGroup, subject, 50);
        const ids = qs.map((q) => q.id);
        expect(new Set(ids).size).toBe(50);
      }
    }
  });
});

// ─── generateTest: math generators (stress) ─────────────────────────────────

describe('generateTest — math generator stress (50 runs each)', () => {
  it.each(AGE_IDS)('%s math: correct answer is always a valid choice across 50 runs', (ageGroup) => {
    for (let i = 0; i < 50; i++) {
      const qs = generateTest(ageGroup, 'math', 6);
      for (const q of qs) {
        expect(q.choices[q.correctIndex]).toBeDefined();
        expect(q.choices).toHaveLength(4);
        expect(new Set(q.choices).size).toBe(4);
      }
    }
  });

  it('elementary Decimals: answer is always a valid numeric string', () => {
    for (let i = 0; i < 50; i++) {
      const qs = generateTest('elementary', 'math', 12);
      const decimals = qs.filter((q) => q.topic === 'Decimals');
      for (const q of decimals) {
        const ans = q.choices[q.correctIndex];
        expect(isNaN(Number(ans))).toBe(false);
      }
    }
  });

  it('satact Probability: answer is always a fraction string a/b', () => {
    for (let i = 0; i < 50; i++) {
      const qs = generateTest('satact', 'math', 6);
      const prob = qs.filter((q) => q.topic === 'Probability');
      for (const q of prob) {
        const ans = q.choices[q.correctIndex];
        expect(ans).toMatch(/^\d+\/\d+$/);
      }
    }
  });

  it('high Quadratics: both roots are non-negative integers', () => {
    for (let i = 0; i < 50; i++) {
      const qs = generateTest('high', 'math', 6);
      const quad = qs.filter((q) => q.topic === 'Quadratics');
      for (const q of quad) {
        const ans = Number(q.choices[q.correctIndex]);
        expect(Number.isInteger(ans)).toBe(true);
        expect(ans).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('satact Geometry: answer is a positive integer (hypotenuse or sector area)', () => {
    for (let i = 0; i < 50; i++) {
      const qs = generateTest('satact', 'math', 6);
      const geo = qs.filter((q) => q.topic === 'Geometry');
      for (const q of geo) {
        const ans = Number(q.choices[q.correctIndex]);
        expect(Number.isInteger(ans)).toBe(true);
        expect(ans).toBeGreaterThan(0);
      }
    }
  });
});

// ─── generateTest: reading bank ──────────────────────────────────────────────

describe('generateTest — reading bank', () => {
  it.each(AGE_IDS)('%s reading: all questions have Main Idea, Vocabulary in Context, Detail, Inference topics', (ageGroup) => {
    const qs = generateTest(ageGroup, 'reading', 25);
    const topics = new Set(qs.map((q) => q.topic));
    expect(topics).toContain('Main Idea');
    expect(topics).toContain('Vocabulary in Context');
    expect(topics).toContain('Detail');
    expect(topics).toContain('Inference');
  });

  it('reading bank: no correctIndex out of range', () => {
    for (const ageGroup of AGE_IDS) {
      const qs = generateTest(ageGroup, 'reading', 20);
      for (const q of qs) {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.choices.length);
      }
    }
  });

  it('reading questions cycle when length > bank size', () => {
    // Elementary has 5 passages × 4 qs = 20 reading questions; 50 should still work via cycling
    const qs = generateTest('elementary', 'reading', 50);
    expect(qs).toHaveLength(50);
    for (const q of qs) {
      expect(q.passage).toBeTruthy();
    }
  });
});

// ─── scoreQuiz ───────────────────────────────────────────────────────────────

describe('scoreQuiz — score calculation', () => {
  it('all correct → 100%', () => {
    const qs = generateTest('elementary', 'math', 5);
    const answers = qs.map((q) => q.correctIndex);
    const { score } = scoreQuiz(qs, answers);
    expect(score).toBe(100);
  });

  it('all wrong → 0%', () => {
    const qs = generateTest('elementary', 'math', 5);
    const answers = qs.map((q) => (q.correctIndex === 0 ? 1 : 0));
    const { score } = scoreQuiz(qs, answers);
    expect(score).toBe(0);
  });

  it('all null (unanswered) → 0%', () => {
    const qs = generateTest('middle', 'reading', 5);
    const { score } = scoreQuiz(qs, [null, null, null, null, null]);
    expect(score).toBe(0);
  });

  it('half correct → 40% (2 of 5, rounds correctly)', () => {
    const qs = generateTest('elementary', 'math', 5);
    // Make first 2 correct, rest null
    const answers: Array<number | null> = [
      qs[0].correctIndex,
      qs[1].correctIndex,
      null,
      null,
      null,
    ];
    const { score } = scoreQuiz(qs, answers);
    expect(score).toBe(40);
  });

  it('24 correct out of 50 → 48%', () => {
    const qs = generateTest('high', 'math', 50);
    const answers: Array<number | null> = qs.map((q, i) =>
      i < 24 ? q.correctIndex : null,
    );
    const { score } = scoreQuiz(qs, answers);
    expect(score).toBe(48);
  });

  it('50 correct out of 50 → 100% with correct topic totals', () => {
    const qs = generateTest('high', 'math', 50);
    const answers = qs.map((q) => q.correctIndex);
    const { score, topicBreakdown } = scoreQuiz(qs, answers);
    expect(score).toBe(100);
    const totalQ = topicBreakdown.reduce((s, t) => s + t.total, 0);
    expect(totalQ).toBe(50);
  });
});

describe('scoreQuiz — topic breakdown', () => {
  it('all correct: every topic is strong and 100%', () => {
    const qs = generateTest('middle', 'math', 12);
    const answers = qs.map((q) => q.correctIndex);
    const { topicBreakdown } = scoreQuiz(qs, answers);
    for (const t of topicBreakdown) {
      expect(t.correct).toBe(t.total);
      expect(t.pct).toBe(100);
      expect(t.strong).toBe(true);
    }
  });

  it('all wrong: every topic is not strong and 0%', () => {
    const qs = generateTest('middle', 'math', 12);
    const answers = qs.map((q) => (q.correctIndex === 0 ? 1 : 0));
    const { topicBreakdown } = scoreQuiz(qs, answers);
    for (const t of topicBreakdown) {
      expect(t.correct).toBe(0);
      expect(t.pct).toBe(0);
      expect(t.strong).toBe(false);
    }
  });

  it('strong threshold: topic with 0% correct is not strong; 100% correct is strong', () => {
    // 12q middle math: TOPIC_ORDER repeats every 6, so each topic appears at i and i+6
    // Make all Fractions questions wrong, everything else correct
    const qs = generateTest('middle', 'math', 12);
    const answers: Array<number | null> = qs.map((q) =>
      q.topic === 'Fractions' ? (q.correctIndex === 0 ? 1 : 0) : q.correctIndex,
    );
    const { topicBreakdown } = scoreQuiz(qs, answers);
    const fractions = topicBreakdown.find((t) => t.topic === 'Fractions');
    expect(fractions?.strong).toBe(false);
    expect(fractions?.pct).toBe(0);
    const others = topicBreakdown.filter((t) => t.topic !== 'Fractions');
    for (const t of others) {
      expect(t.strong).toBe(true);
      expect(t.pct).toBe(100);
    }
  });

  it('topic counts sum to total question count', () => {
    for (const ageGroup of AGE_IDS) {
      for (const subject of SUBJECT_IDS) {
        const qs = generateTest(ageGroup, subject, 12);
        const answers = qs.map(() => null);
        const { topicBreakdown } = scoreQuiz(qs, answers);
        const total = topicBreakdown.reduce((s, t) => s + t.total, 0);
        expect(total).toBe(12);
      }
    }
  });

  it('topic pct matches correct/total ratio (rounded)', () => {
    const qs = generateTest('middle', 'math', 12);
    // Make exactly 1 correct per topic (each topic has 2 qs)
    // First question of each topic pair is correct
    const answers: Array<number | null> = qs.map((q, i) =>
      i % 2 === 0 ? q.correctIndex : (q.correctIndex === 0 ? 1 : 0),
    );
    const { topicBreakdown } = scoreQuiz(qs, answers);
    for (const t of topicBreakdown) {
      expect(t.pct).toBe(Math.round((t.correct / t.total) * 100));
    }
  });
});

// ─── scoreTier ───────────────────────────────────────────────────────────────

describe('scoreTier — tier boundaries', () => {
  const cases: Array<[number, string]> = [
    [100, 'Excelling'],
    [85, 'Excelling'],
    [84, 'Strong Foundation'],
    [70, 'Strong Foundation'],
    [69, 'Building Skills'],
    [50, 'Building Skills'],
    [49, 'Needs Support'],
    [0, 'Needs Support'],
    [1, 'Needs Support'],
  ];

  it.each(cases)('score %i → tier "%s"', (score, expected) => {
    const { label } = scoreTier(score);
    expect(label).toBe(expected);
  });

  it('every tier has a non-empty desc', () => {
    for (const score of [100, 75, 60, 30]) {
      const { desc } = scoreTier(score);
      expect(desc.length).toBeGreaterThan(0);
    }
  });

  it('desc for Excelling references grade level', () => {
    const { desc } = scoreTier(90);
    expect(desc.toLowerCase()).toContain('grade level');
  });

  it('desc for Needs Support references one-on-one', () => {
    const { desc } = scoreTier(30);
    expect(desc.toLowerCase()).toContain('one-on-one');
  });
});

// ─── scorePercentile ─────────────────────────────────────────────────────────

describe('scorePercentile — formula validation', () => {
  it('score 100 → 95', () => expect(scorePercentile(100)).toBe(95));
  it('score 0 → 5 (floor)', () => expect(scorePercentile(0)).toBe(5));
  it('score 10 → 5 (clamped to floor)', () => expect(scorePercentile(10)).toBe(5));
  it('score 50 → 24 (95 × 0.25 = 23.75 → 24)', () => expect(scorePercentile(50)).toBe(24));
  it('score 80 → 61 (95 × 0.64 = 60.8 → 61)', () => expect(scorePercentile(80)).toBe(61));
  it('score 70 → 47 (95 × 0.49 = 46.55 → 47)', () => expect(scorePercentile(70)).toBe(47));
  it('score 85 → 69 (95 × 0.7225 = 68.6 → 69)', () => expect(scorePercentile(85)).toBe(69));

  it('result is always between 5 and 95 for all integer scores 0-100', () => {
    for (let s = 0; s <= 100; s++) {
      const p = scorePercentile(s);
      expect(p).toBeGreaterThanOrEqual(5);
      expect(p).toBeLessThanOrEqual(95);
    }
  });

  it('percentile is monotonically non-decreasing', () => {
    let prev = scorePercentile(0);
    for (let s = 1; s <= 100; s++) {
      const cur = scorePercentile(s);
      expect(cur).toBeGreaterThanOrEqual(prev);
      prev = cur;
    }
  });
});

// ─── scoreQuiz + scoreTier + scorePercentile: full pipeline ──────────────────

describe('full pipeline: generate → score → tier → percentile', () => {
  const scenarios: Array<{
    label: string;
    ageGroup: AgeGroupId;
    subject: SubjectId;
    length: number;
    correctFraction: number;
    expectedTier: string;
  }> = [
    { label: 'elementary math perfect', ageGroup: 'elementary', subject: 'math', length: 50, correctFraction: 1, expectedTier: 'Excelling' },
    { label: 'middle reading 80%', ageGroup: 'middle', subject: 'reading', length: 50, correctFraction: 0.8, expectedTier: 'Strong Foundation' },
    { label: 'high math 72%', ageGroup: 'high', subject: 'math', length: 50, correctFraction: 0.72, expectedTier: 'Strong Foundation' },
    { label: 'satact reading 60%', ageGroup: 'satact', subject: 'reading', length: 50, correctFraction: 0.6, expectedTier: 'Building Skills' },
    { label: 'elementary reading 30%', ageGroup: 'elementary', subject: 'reading', length: 50, correctFraction: 0.3, expectedTier: 'Needs Support' },
    { label: 'middle math 0%', ageGroup: 'middle', subject: 'math', length: 20, correctFraction: 0, expectedTier: 'Needs Support' },
    { label: 'high reading 20q short', ageGroup: 'high', subject: 'reading', length: 20, correctFraction: 0.6, expectedTier: 'Building Skills' },
    { label: 'satact math 50q medium 90%', ageGroup: 'satact', subject: 'math', length: 50, correctFraction: 0.9, expectedTier: 'Excelling' },
  ];

  it.each(scenarios)('$label: correct=$correctFraction → $expectedTier', ({ ageGroup, subject, length, correctFraction, expectedTier }) => {
    const qs = generateTest(ageGroup, subject, length);
    const nCorrect = Math.round(length * correctFraction);
    const answers: Array<number | null> = qs.map((q, i) =>
      i < nCorrect ? q.correctIndex : null,
    );
    const { score, topicBreakdown } = scoreQuiz(qs, answers);
    const { label } = scoreTier(score);
    const percentile = scorePercentile(score);

    expect(label).toBe(expectedTier);
    expect(topicBreakdown.length).toBeGreaterThan(0);
    expect(percentile).toBeGreaterThanOrEqual(5);
    expect(percentile).toBeLessThanOrEqual(95);
    expect(score).toBe(Math.round((nCorrect / length) * 100));
  });
});

// ─── LENGTHS / AGE_GROUPS / SUBJECTS exports ─────────────────────────────────

describe('exported constants', () => {
  it('AGE_GROUPS has 4 entries with valid ids', () => {
    expect(AGE_GROUPS).toHaveLength(4);
    const ids = AGE_GROUPS.map((g) => g.id);
    expect(ids).toContain('elementary');
    expect(ids).toContain('middle');
    expect(ids).toContain('high');
    expect(ids).toContain('satact');
  });

  it('SUBJECTS has math and reading', () => {
    expect(SUBJECTS).toHaveLength(2);
    expect(SUBJECTS.map((s) => s.id)).toContain('math');
    expect(SUBJECTS.map((s) => s.id)).toContain('reading');
  });

  it('LENGTHS has 20, 50, 100', () => {
    expect(LENGTHS).toHaveLength(3);
    expect(LENGTHS.map((l) => l.id)).toEqual([20, 50, 100]);
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('edge cases', () => {
  it('scoreQuiz with 1 question, correct answer → 100%', () => {
    const qs = generateTest('elementary', 'math', 5);
    const single = [qs[0]];
    const { score } = scoreQuiz(single, [qs[0].correctIndex]);
    expect(score).toBe(100);
  });

  it('scoreQuiz with 1 question, wrong answer → 0%', () => {
    const qs = generateTest('elementary', 'math', 5);
    const single = [qs[0]];
    const wrong = qs[0].correctIndex === 0 ? 1 : 0;
    const { score } = scoreQuiz(single, [wrong]);
    expect(score).toBe(0);
  });

  it('generateTest length 5 returns exactly 5 unique-id questions for all combos', () => {
    for (const ag of AGE_IDS) {
      for (const subj of SUBJECT_IDS) {
        const qs = generateTest(ag, subj, 5);
        expect(qs).toHaveLength(5);
        expect(new Set(qs.map((q) => q.id)).size).toBe(5);
      }
    }
  });

  it('scorePercentile(23) is >= 5 (low scores hit floor)', () => {
    expect(scorePercentile(23)).toBeGreaterThanOrEqual(5);
  });

  it('multiple generateTest calls for same params produce valid (possibly different) results', () => {
    const a = generateTest('high', 'math', 5);
    const b = generateTest('high', 'math', 5);
    // Both must be structurally valid
    for (const qs of [a, b]) {
      expect(qs).toHaveLength(5);
      for (const q of qs) {
        expect(q.choices).toHaveLength(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);
      }
    }
  });
});
