// KHM Tutoring — Diagnostic Test question engine.
// Math questions are procedurally generated (level-appropriate, infinite supply).
// Reading questions are a curated bank of short original passages + comprehension Qs.
// Both expose topic tags used for the results breakdown.

export type AgeGroupId = 'elementary' | 'middle' | 'high' | 'satact';
export type SubjectId = 'math' | 'reading';
export type LengthId = 20 | 50 | 100;

export interface Question {
  id: string;
  prompt: string;
  topic: string;
  passage?: string;
  choices: string[];
  correctIndex: number;
}

export interface TopicResult {
  topic: string;
  correct: number;
  total: number;
  pct: number;
  strong: boolean;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoiceQ(
  prompt: string,
  correct: number | string,
  distractors: Array<number | string>,
  topic: string,
): Omit<Question, 'id'> {
  const uniq: Array<number | string> = [];
  for (const d of distractors) {
    if (d !== correct && !uniq.includes(d)) uniq.push(d);
    if (uniq.length === 3) break;
  }
  while (uniq.length < 3) {
    const filler =
      typeof correct === 'number'
        ? correct + randInt(1, 9) * (Math.random() < 0.5 ? -1 : 1)
        : correct + '_';
    if (filler !== correct && !uniq.includes(filler)) uniq.push(filler);
  }
  const choices = shuffle<number | string>([correct, ...uniq]);
  return {
    prompt,
    topic,
    choices: choices.map(String),
    correctIndex: choices.indexOf(correct),
  };
}

type MathGen = () => Omit<Question, 'id'>;

const MATH_GENERATORS: Record<AgeGroupId, Record<string, MathGen>> = {
  elementary: {
    Addition: () => {
      const a = randInt(101, 450), b = randInt(101, 450);
      const c = a + b;
      return buildChoiceQ(`${a} + ${b} = ?`, c, [c + 10, c - 10, c + 100], 'Addition');
    },
    Subtraction: () => {
      const a = randInt(200, 900), b = randInt(50, Math.floor(a * 0.8));
      const c = a - b;
      return buildChoiceQ(`${a} − ${b} = ?`, c, [c + 10, c - 10, a + b], 'Subtraction');
    },
    Multiplication: () => {
      const a = randInt(12, 25), b = randInt(3, 9);
      const c = a * b;
      return buildChoiceQ(`${a} × ${b} = ?`, c, [c + b, c - a, c + a], 'Multiplication');
    },
    'Word Problems': () => {
      const price = randInt(3, 12), qty = randInt(4, 9), extra = randInt(2, 8);
      const c = price * qty + extra;
      return buildChoiceQ(
        `Jake buys ${qty} pencil packs at $${price} each and also spends $${extra} on a notebook. How much does Jake spend in total?`,
        c,
        [price * qty, c - extra, c + price],
        'Word Problems',
      );
    },
    Division: () => {
      const b = randInt(4, 12), q = randInt(8, 20);
      const a = b * q;
      return buildChoiceQ(`${a} ÷ ${b} = ?`, q, [q + 1, q - 1, q + b], 'Division');
    },
    Decimals: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const whole1 = randInt(1, 9), dec1 = randInt(1, 8);
        const whole2 = randInt(1, 9), dec2 = randInt(1, 8);
        const c = parseFloat(((whole1 * 10 + dec1 + whole2 * 10 + dec2) / 10).toFixed(1));
        return buildChoiceQ(
          `${whole1}.${dec1} + ${whole2}.${dec2} = ?`,
          c,
          [parseFloat((c + 0.2).toFixed(1)), parseFloat((c - 0.1).toFixed(1)), whole1 + whole2],
          'Decimals',
        );
      } else {
        const a = randInt(2, 9), b = randInt(2, 9);
        const c = parseFloat((a * b / 10).toFixed(1));
        return buildChoiceQ(
          `${a} × 0.${b} = ?`,
          c,
          [parseFloat((c + 0.2).toFixed(1)), parseFloat((c + 1).toFixed(1)), a + b],
          'Decimals',
        );
      }
    },
  },
  middle: {
    Fractions: () => {
      const denPairs: [number, number][] = [[2,3],[2,5],[3,4],[3,5],[4,5],[2,6],[3,6]];
      const [d1, d2] = denPairs[randInt(0, denPairs.length - 1)];
      const L = lcm(d1, d2);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      const numL = n1 * (L / d1) + n2 * (L / d2);
      const g = gcd(numL, L);
      const rn = numL / g, rd = L / g;
      const correct = rd === 1 ? `${rn}` : `${rn}/${rd}`;
      return buildChoiceQ(
        `${n1}/${d1} + ${n2}/${d2} = ?`,
        correct,
        [`${n1 + n2}/${d1 + d2}`, `${n1 * n2}/${L}`, `${rn + 1}/${rd}`],
        'Fractions',
      );
    },
    'Ratios & Percentages': () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const original = randInt(20, 80) * 2;
        const pct = [10, 15, 20, 25, 50][randInt(0, 4)];
        const c = original + Math.round(original * pct / 100);
        return buildChoiceQ(
          `A jacket costs $${original}. After a ${pct}% price increase, what is the new price?`,
          c,
          [original + pct, original - Math.round(original * pct / 100), original * 2],
          'Ratios & Percentages',
        );
      } else {
        const total = [40, 60, 80, 120, 200][randInt(0, 4)];
        const frac = [0.25, 0.30, 0.40, 0.60, 0.75][randInt(0, 4)];
        const part = Math.round(total * frac);
        const c = Math.round(part / total * 100);
        return buildChoiceQ(
          `${part} is what percent of ${total}?`,
          c,
          [c + 10, c - 10, Math.round(total / part * 100)],
          'Ratios & Percentages',
        );
      }
    },
    'Basic Algebra': () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const x = randInt(2, 15), a = randInt(3, 9), b = randInt(5, 30);
        const c = a * x + b;
        return buildChoiceQ(
          `Solve for x: ${a}x + ${b} = ${c}`,
          x,
          [x + 1, x - 1, Math.floor(c / a)],
          'Basic Algebra',
        );
      } else {
        const a = randInt(2, 6), c2 = randInt(3, 12), b = randInt(1, 15);
        const x = a * c2 - b;
        return buildChoiceQ(
          `Solve for x: (x + ${b}) / ${a} = ${c2}`,
          x,
          [x + a, a * c2 + b, x - a],
          'Basic Algebra',
        );
      }
    },
    'Word Problems': () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const rate = randInt(4, 14), hrs = randInt(3, 9), bonus = randInt(10, 50);
        const c = rate * hrs + bonus;
        return buildChoiceQ(
          `Maya earns $${rate} per hour working ${hrs} hours and receives a $${bonus} bonus. What are her total earnings?`,
          c,
          [rate * hrs, c - bonus, c + rate],
          'Word Problems',
        );
      } else {
        const groups = randInt(4, 8), size = randInt(4, 7), extras = randInt(2, 6);
        const c = groups * size + extras;
        return buildChoiceQ(
          `A class has ${groups} groups of ${size} students, plus ${extras} students who work alone. How many students total?`,
          c,
          [groups * size, c - extras, c + size],
          'Word Problems',
        );
      }
    },
    Geometry: () => {
      const type = randInt(0, 2);
      if (type === 0) {
        const base = randInt(4, 14), h = randInt(4, 12);
        const c = Math.round(base * h / 2);
        return buildChoiceQ(
          `A triangle has a base of ${base} and a height of ${h}. What is its area?`,
          c,
          [base * h, c + h, c - base],
          'Geometry',
        );
      } else if (type === 1) {
        const r = randInt(3, 9);
        const c = Math.round(Math.PI * r * r);
        return buildChoiceQ(
          `What is the area of a circle with radius ${r}? (Use π ≈ 3.14, round to nearest whole number)`,
          c,
          [Math.round(2 * Math.PI * r), c + r, c - r],
          'Geometry',
        );
      } else {
        const l = randInt(4, 14), w = randInt(3, 10);
        const c = l * w;
        return buildChoiceQ(
          `A rectangle has length ${l} and width ${w}. What is its area?`,
          c,
          [2 * (l + w), c + l, c - w],
          'Geometry',
        );
      }
    },
    'Negative Numbers': () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const a = randInt(-12, -2), b = randInt(-9, -1);
        const c = a + b;
        return buildChoiceQ(`${a} + (${b}) = ?`, c, [c + 1, Math.abs(a) + Math.abs(b), c - 1], 'Negative Numbers');
      } else {
        const a = randInt(-6, -2), b = randInt(-6, -2);
        const c = a * b;
        return buildChoiceQ(`${a} × ${b} = ?`, c, [-c, c + Math.abs(a), c - Math.abs(b)], 'Negative Numbers');
      }
    },
  },
  high: {
    Algebra: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const x = randInt(2, 10), y = randInt(1, x);
        const a = randInt(2, 5);
        const sumEq = a * x + y;
        const diffEq = x - y;
        return buildChoiceQ(
          `If ${a}x + y = ${sumEq} and x − y = ${diffEq}, what is x?`,
          x,
          [x + 1, y, x - 1],
          'Algebra',
        );
      } else {
        const a = randInt(2, 6), c2 = randInt(2, 10), b = randInt(1, 15);
        const x = a * c2 - b;
        return buildChoiceQ(
          `Solve for x: (x + ${b}) / ${a} = ${c2}`,
          x,
          [x + a, a * c2 + b, x - a],
          'Algebra',
        );
      }
    },
    Geometry: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const l = randInt(3, 10), w = randInt(3, 10), h = randInt(2, 8);
        const c = l * w * h;
        return buildChoiceQ(
          `A rectangular box has length ${l}, width ${w}, and height ${h}. What is its volume?`,
          c,
          [2 * (l * w + l * h + w * h), l * w + w * h, c + l],
          'Geometry',
        );
      } else {
        const b1 = randInt(5, 14), b2 = randInt(3, 10), h = randInt(3, 9);
        const c = Math.round((b1 + b2) * h / 2);
        return buildChoiceQ(
          `A trapezoid has parallel bases of ${b1} and ${b2} with height ${h}. What is its area? (A = ½(b₁ + b₂)h)`,
          c,
          [(b1 + b2) * h, c + h, b1 * b2],
          'Geometry',
        );
      }
    },
    Functions: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const a = randInt(2, 5), b = randInt(1, 8), c2 = randInt(2, 4), d = randInt(1, 6);
        const inner = c2 * 2 + d;
        const c = a * inner + b;
        return buildChoiceQ(
          `If f(x) = ${a}x + ${b} and g(x) = ${c2}x + ${d}, what is f(g(2))?`,
          c,
          [a * 2 + b, c + a, c - b],
          'Functions',
        );
      } else {
        const a = randInt(1, 3), b = randInt(1, 10), x = randInt(2, 5);
        const c = a * x * x + b;
        return buildChoiceQ(
          `If f(x) = ${a}x² + ${b}, what is f(${x})?`,
          c,
          [a * x + b, c + x, (a + b) * x],
          'Functions',
        );
      }
    },
    'Word Problems': () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const qty1 = randInt(3, 8), price1 = randInt(2, 6);
        const qty2 = randInt(3, 8), price2 = randInt(price1 + 1, price1 + 5);
        const c = qty1 * price1 + qty2 * price2;
        return buildChoiceQ(
          `Carla buys ${qty1} pens at $${price1} each and ${qty2} notebooks at $${price2} each. How much does she spend in total?`,
          c,
          [qty1 * price2 + qty2 * price1, c + price1, c - price2],
          'Word Problems',
        );
      } else {
        const rate1 = randInt(25, 55), time1 = randInt(2, 4);
        const rate2 = randInt(rate1 + 5, rate1 + 30), time2 = randInt(1, 3);
        const c = rate1 * time1 + rate2 * time2;
        return buildChoiceQ(
          `A truck travels ${rate1} mph for ${time1} hours, then ${rate2} mph for ${time2} more hours. What is the total distance?`,
          c,
          [rate1 * time1, (rate1 + rate2) * (time1 + time2) / 2, c - rate1],
          'Word Problems',
        );
      }
    },
    Statistics: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const n1 = randInt(3, 8), avg1 = randInt(60, 80);
        const n2 = randInt(3, 8), avg2 = randInt(75, 95);
        const total = n1 * avg1 + n2 * avg2;
        const c = Math.round(total / (n1 + n2));
        return buildChoiceQ(
          `Group A: ${n1} students, average ${avg1}. Group B: ${n2} students, average ${avg2}. What is the combined average? (Round to nearest whole number)`,
          c,
          [Math.round((avg1 + avg2) / 2), c + 5, c - 3],
          'Statistics',
        );
      } else {
        const nums = Array.from({ length: 6 }, () => randInt(10, 50)).sort((a, b) => a - b);
        const median = parseFloat(((nums[2] + nums[3]) / 2).toFixed(1));
        return buildChoiceQ(
          `What is the median of: ${nums.join(', ')}?`,
          median,
          [nums[2], nums[3], Math.round(nums.reduce((a, b) => a + b) / 6)],
          'Statistics',
        );
      }
    },
    Quadratics: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const r1 = randInt(1, 7), r2 = randInt(1, 7);
        const b = -(r1 + r2), c2 = r1 * r2;
        const bStr = b < 0 ? `− ${Math.abs(b)}x` : `+ ${b}x`;
        const cStr = c2 > 0 ? `+ ${c2}` : `− ${Math.abs(c2)}`;
        return buildChoiceQ(
          `One solution of x² ${bStr} ${cStr} = 0 is x = ${r1}. What is the other solution?`,
          r2,
          [r1 + r2, r2 + 1, r2 - 1],
          'Quadratics',
        );
      } else {
        const r1 = randInt(1, 7), r2 = randInt(1, 7);
        const b = -(r1 + r2), c2 = r1 * r2;
        const bStr = b < 0 ? `− ${Math.abs(b)}x` : `+ ${b}x`;
        const cStr = c2 > 0 ? `+ ${c2}` : `− ${Math.abs(c2)}`;
        return buildChoiceQ(
          `The solutions of x² ${bStr} ${cStr} = 0 are both positive. What is the product of the two solutions?`,
          r1 * r2,
          [r1 + r2, r1 * r2 + r1, r1 * r2 - 1],
          'Quadratics',
        );
      }
    },
  },
  satact: {
    Algebra: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const x = randInt(2, 10);
        const k = x * x;
        return buildChoiceQ(
          `If x > 0 and x² = ${k}, what is the value of 3x + 5?`,
          3 * x + 5,
          [3 * x - 5, x + 5, 3 * (x + 1) + 5],
          'Algebra',
        );
      } else {
        const a = randInt(2, 6), bMult = randInt(2, 5), c2 = randInt(2, 8);
        const bClean = a * bMult;
        const xClean = bClean * c2 / a;
        return buildChoiceQ(
          `If ${a}/${bClean} = ${c2}/x, what is x?`,
          xClean,
          [xClean + c2, a * c2, xClean - a],
          'Algebra',
        );
      }
    },
    'Data Analysis': () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const nums = Array.from({ length: 7 }, () => randInt(10, 90)).sort((a, b) => a - b);
        const q1 = nums[1], q3 = nums[5];
        const iqr = q3 - q1;
        return buildChoiceQ(
          `Find the interquartile range (IQR) of: ${nums.join(', ')}`,
          iqr,
          [nums[6] - nums[0], q3, q1 + q3],
          'Data Analysis',
        );
      } else {
        const nums = Array.from({ length: 6 }, () => randInt(10, 90)).sort((a, b) => a - b);
        const median = parseFloat(((nums[2] + nums[3]) / 2).toFixed(1));
        return buildChoiceQ(
          `What is the median of the data set: ${nums.join(', ')}?`,
          median,
          [nums[2], nums[3], Math.round(nums.reduce((a, b) => a + b) / 6)],
          'Data Analysis',
        );
      }
    },
    Geometry: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const leg1 = randInt(3, 14), leg2 = randInt(3, 14);
        const hyp = Math.round(Math.sqrt(leg1 * leg1 + leg2 * leg2));
        return buildChoiceQ(
          `A right triangle has legs of length ${leg1} and ${leg2}. What is the hypotenuse, rounded to the nearest whole number?`,
          hyp,
          [hyp + 2, hyp - 1, leg1 + leg2],
          'Geometry',
        );
      } else {
        const r = [4, 5, 6, 8, 10][randInt(0, 4)];
        const deg = [30, 45, 60, 90, 120][randInt(0, 4)];
        const sector = Math.round(Math.PI * r * r * deg / 360);
        return buildChoiceQ(
          `A circle has radius ${r}. What is the area of a sector with a ${deg}° central angle? (Use π ≈ 3.14, round to nearest whole number)`,
          sector,
          [Math.round(2 * Math.PI * r * deg / 360), sector + r, Math.round(Math.PI * r * r)],
          'Geometry',
        );
      }
    },
    'Advanced Math': () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const n = randInt(3, 8);
        const c = Math.pow(2, n);
        return buildChoiceQ(
          `What is 2^${n}?`,
          c,
          [n * 2, c + n, c - 1],
          'Advanced Math',
        );
      } else {
        const a = randInt(5, 15), b = randInt(2, 8);
        const x1 = a + b, x2 = a - b;
        return buildChoiceQ(
          `If |x − ${a}| = ${b}, what is the larger value of x?`,
          x1,
          [x2, a, x1 + 1],
          'Advanced Math',
        );
      }
    },
    'Systems of Equations': () => {
      const x = randInt(2, 9), y = randInt(1, 8);
      const a1 = randInt(2, 4), a2 = randInt(1, 3);
      const sumEq = a1 * x + a2 * y;
      const diffEq = a1 * x - a2 * y;
      return buildChoiceQ(
        `If ${a1}x + ${a2}y = ${sumEq} and ${a1}x − ${a2}y = ${diffEq}, what is x?`,
        x,
        [x + y, a1 * x, x - 1],
        'Systems of Equations',
      );
    },
    Probability: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const total = randInt(8, 14), favored = randInt(2, total - 2);
        const pNum = favored * (favored - 1);
        const pDen = total * (total - 1);
        const g = gcd(pNum, pDen);
        const c = `${pNum / g}/${pDen / g}`;
        return buildChoiceQ(
          `A bag has ${favored} red and ${total - favored} blue marbles. What is the probability of drawing 2 red marbles in a row without replacement?`,
          c,
          [`${favored}/${total}`, `${favored * favored}/${total * total}`, `${favored - 1}/${total - 1}`],
          'Probability',
        );
      } else {
        const red = randInt(3, 8), blue = randInt(3, 10);
        const total = red + blue;
        const g = gcd(red, total);
        const c = `${red / g}/${total / g}`;
        return buildChoiceQ(
          `A bag has ${red} red and ${blue} blue marbles. What is P(drawing red)?`,
          c,
          [`${red}/${total + 1}`, `${blue}/${total}`, `${red + 1}/${total}`],
          'Probability',
        );
      }
    },
  },
};

interface ReadingEntry {
  passage: string;
  qs: Array<{
    q: string;
    topic: string;
    choices: string[];
    correctIndex: number;
  }>;
}

const READING_BANK: Record<AgeGroupId, ReadingEntry[]> = {
  elementary: [
    {
      passage: `Mia planted three tiny seeds in a clay pot on her windowsill. Every morning she gave them a small cup of water and moved the pot so the sunlight could reach the leaves. After two weeks, one seed had grown into a bright green sprout with two little leaves. Mia clapped her hands and ran to tell her mom the good news.`,
      qs: [
        {
          q: 'What is the main idea of this passage?',
          topic: 'Main Idea',
          choices: [
            'Mia successfully grows a plant by caring for it',
            'Mia buys a new pot for her window',
            "Mia's mom plants seeds outside",
            'Mia forgets to water her plant',
          ],
          correctIndex: 0,
        },
        {
          q: 'In this passage, what does "sprout" mean?',
          topic: 'Vocabulary in Context',
          choices: [
            'A young plant just starting to grow',
            'A type of watering can',
            'A kind of sunlight',
            'A clay pot',
          ],
          correctIndex: 0,
        },
        {
          q: 'How long did it take for the seed to grow into a sprout?',
          topic: 'Detail',
          choices: ['One day', 'Two weeks', 'One year', 'Three months'],
          correctIndex: 1,
        },
        {
          q: 'How did Mia most likely feel when she saw the sprout?',
          topic: 'Inference',
          choices: ['Bored', 'Excited', 'Angry', 'Confused'],
          correctIndex: 1,
        },
      ],
    },
    {
      passage: `Beavers are known for building dams across streams using sticks, mud, and rocks. These dams create calm ponds where beavers build a safe home called a lodge. A beaver's front teeth never stop growing, so it must chew on wood constantly to keep them from getting too long. This chewing habit is exactly what helps beavers gather the materials they need to build.`,
      qs: [
        {
          q: 'What is this passage mostly about?',
          topic: 'Main Idea',
          choices: [
            'How beavers build dams and lodges',
            'Why streams are dangerous',
            'How beavers swim',
            'The life of a fish',
          ],
          correctIndex: 0,
        },
        {
          q: 'What does "constantly" mean in this passage?',
          topic: 'Vocabulary in Context',
          choices: ['Rarely', 'Never', 'Without stopping', 'Slowly'],
          correctIndex: 2,
        },
        {
          q: 'What do beavers use to build their dams?',
          topic: 'Detail',
          choices: [
            'Sticks, mud, and rocks',
            'Leaves and grass',
            'Sand and shells',
            'Ice and snow',
          ],
          correctIndex: 0,
        },
        {
          q: "Why does the passage mention that a beaver's teeth never stop growing?",
          topic: 'Inference',
          choices: [
            'To explain why beavers must chew wood often',
            'To explain why beavers are afraid of water',
            'To show beavers dislike mud',
            'To explain why beavers hibernate',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      passage: `Every night, Marco climbed the tall stone lighthouse with his grandfather. His grandfather would turn on the bright light at the top so ships could find their way safely through the dark water. Marco learned that the lighthouse had warned sailors of rocky shores for over one hundred years. He felt proud knowing their small island had helped so many people stay safe.`,
      qs: [
        { q: 'What is the main idea of this passage?', topic: 'Main Idea', choices: ['Marco and his grandfather help ships by keeping the lighthouse light on', 'Marco is afraid of the dark water', 'The lighthouse was built just last year', 'Marco climbs the lighthouse alone every morning'], correctIndex: 0 },
        { q: 'What does "warned" mean in this passage?', topic: 'Vocabulary in Context', choices: ['Told people about danger ahead', 'Kept ships away forever', 'Turned off the light', 'Built a new road'], correctIndex: 0 },
        { q: 'How long had the lighthouse been helping sailors?', topic: 'Detail', choices: ['Ten years', 'Over one hundred years', 'Since last winter', 'Fifty years'], correctIndex: 1 },
        { q: 'What can you infer about Marco?', topic: 'Inference', choices: ['He cares about helping others', 'He dislikes going to the lighthouse', 'He wants to be a sailor someday', 'He is afraid of his grandfather'], correctIndex: 0 },
      ],
    },
    {
      passage: `Honeybees live together in large groups called colonies. Each colony has one queen bee, thousands of worker bees, and a smaller number of drones. Worker bees collect nectar from flowers and bring it back to the hive, where it is turned into honey. Bees also help flowers grow by carrying pollen from one plant to another in a process called pollination.`,
      qs: [
        { q: 'What is this passage mostly about?', topic: 'Main Idea', choices: ['How honeybees live and work together', 'Why bees sting people', 'How to make honey at home', 'The life of a flower'], correctIndex: 0 },
        { q: 'What does "nectar" most likely refer to?', topic: 'Vocabulary in Context', choices: ['A sweet liquid found in flowers', 'A type of bee', 'The outside of the hive', 'A kind of pollen'], correctIndex: 0 },
        { q: 'What do worker bees bring back to the hive?', topic: 'Detail', choices: ['Nectar from flowers', 'Leaves from trees', 'Water from ponds', 'Mud from the ground'], correctIndex: 0 },
        { q: 'Why is pollination important based on this passage?', topic: 'Inference', choices: ['It helps flowers grow', 'It keeps bees from stinging', 'It makes the hive bigger', 'It teaches drones to fly'], correctIndex: 0 },
      ],
    },
    {
      passage: `Leon had fallen off his bike four times trying to learn. Each time, his knees stung and he wanted to quit. But his older sister kept running beside him, whispering that balance takes practice and every fall teaches your body something new. On the fifth try, Leon felt the wobbling smooth out. He pedaled faster, and suddenly, he was riding all by himself.`,
      qs: [
        { q: 'What is the main idea of this passage?', topic: 'Main Idea', choices: ['Leon learns to ride a bike through persistence and his sister\'s help', 'Leon decides bikes are too dangerous', 'Leon\'s sister learns to ride a bike', 'Leon falls off his bike and gives up'], correctIndex: 0 },
        { q: 'What does "balance" mean in this context?', topic: 'Vocabulary in Context', choices: ['The ability to stay steady without falling', 'A type of bike helmet', 'How fast you can pedal', 'A feeling of being tired'], correctIndex: 0 },
        { q: 'How many times did Leon fall before he succeeded?', topic: 'Detail', choices: ['One time', 'Two times', 'Four times', 'Ten times'], correctIndex: 2 },
        { q: 'What does Leon\'s sister\'s advice suggest about learning new skills?', topic: 'Inference', choices: ['Making mistakes is a normal part of learning', 'It is better to give up quickly', 'Only strong people learn to ride bikes', 'Falling is always someone else\'s fault'], correctIndex: 0 },
      ],
    },
  ],
  middle: [
    {
      passage: `Before the printing press, books were copied by hand, which took months or even years for a single copy. When Johannes Gutenberg introduced a mechanical printing press in the 1400s, the process changed dramatically. Suddenly, dozens of identical copies could be produced in the time it once took to make one. This meant more people, not just wealthy scholars, could own and read books, which helped spread literacy across Europe.`,
      qs: [
        {
          q: 'What is the main idea of this passage?',
          topic: 'Main Idea',
          choices: [
            'The printing press made books faster to produce and easier to access',
            'Gutenberg was a wealthy scholar',
            'Hand-copied books were more accurate',
            'Literacy declined after the 1400s',
          ],
          correctIndex: 0,
        },
        {
          q: 'What does "dramatically" suggest about the change described?',
          topic: 'Vocabulary in Context',
          choices: [
            'It happened slowly and quietly',
            'It was a small, unnoticeable shift',
            'It was a large and striking change',
            'It was reversed shortly after',
          ],
          correctIndex: 2,
        },
        {
          q: 'According to the passage, who could own books after the printing press was introduced?',
          topic: 'Detail',
          choices: [
            'Only royalty',
            'Only scholars',
            'More people than before, not just the wealthy',
            'No one, books became rarer',
          ],
          correctIndex: 2,
        },
        {
          q: 'What can be inferred about literacy rates after the printing press spread?',
          topic: 'Inference',
          choices: [
            'They likely increased',
            'They likely decreased',
            'They stayed exactly the same',
            'They became impossible to measure',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      passage: `Jordan's hands felt clammy as she waited backstage. She had practiced her speech every night for three weeks, but hearing the crowd murmur on the other side of the curtain made her stomach twist. She took a slow breath, remembering her coach's advice: nervous energy is just excitement with nowhere to go yet. When her name was called, she walked out, found the coach's words true, and let the nervous energy carry her forward.`,
      qs: [
        {
          q: 'What is the main idea of this passage?',
          topic: 'Main Idea',
          choices: [
            'Jordan overcomes nervousness before a speech',
            'Jordan decides not to compete',
            'Jordan forgets her speech',
            "Jordan's coach gives up on her",
          ],
          correctIndex: 0,
        },
        {
          q: 'What does "clammy" most likely describe?',
          topic: 'Vocabulary in Context',
          choices: [
            'Warm and dry',
            'Cold and sweaty',
            'Rough and calloused',
            'Numb and still',
          ],
          correctIndex: 1,
        },
        {
          q: 'How long had Jordan been practicing her speech?',
          topic: 'Detail',
          choices: ['One day', 'One week', 'Three weeks', 'A full year'],
          correctIndex: 2,
        },
        {
          q: "What can you infer about Jordan's coach?",
          topic: 'Inference',
          choices: [
            'The coach offered helpful, reassuring advice',
            'The coach was unavailable that day',
            'The coach discouraged Jordan from competing',
            'The coach was stricter than the crowd',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      passage: `The water cycle describes how water continuously moves through Earth's environments. Water evaporates from oceans, lakes, and rivers when the sun heats the surface. This water vapor rises into the atmosphere, cools, and condenses into clouds. When the clouds hold enough water droplets, rain or snow falls back to the earth in a process called precipitation. This water eventually flows back into oceans and lakes, beginning the cycle again.`,
      qs: [
        { q: 'What is the main idea of this passage?', topic: 'Main Idea', choices: ['Water continuously moves through Earth\'s environments in a repeating cycle', 'Oceans are the only source of rain', 'Clouds are made of solid ice crystals', 'The water cycle only happens in summer'], correctIndex: 0 },
        { q: 'What does "condenses" mean as used in the passage?', topic: 'Vocabulary in Context', choices: ['Changes from a gas into liquid droplets', 'Rises higher into the sky', 'Heats up rapidly', 'Falls as snow'], correctIndex: 0 },
        { q: 'According to the passage, what causes water to evaporate?', topic: 'Detail', choices: ['The sun heats the surface', 'Strong winds blow the water away', 'Clouds release it upward', 'The moon pulls it from the ocean'], correctIndex: 0 },
        { q: 'What can be inferred about why precipitation is important?', topic: 'Inference', choices: ['It returns water to Earth\'s surface so the cycle can continue', 'It stops the water cycle temporarily', 'It only benefits plants near rivers', 'It prevents clouds from forming'], correctIndex: 0 },
      ],
    },
    {
      passage: `Priya spent two weeks designing her science fair project. She wanted to test whether plants grow taller with classical music, rock music, or no music at all. She set up three identical pots with the same soil, seeds, and sunlight. At the end of the experiment, the plants grown in silence were tallest. While the results surprised her, Priya understood that a good experiment sometimes disproves your own prediction.`,
      qs: [
        { q: 'What is the main idea of this passage?', topic: 'Main Idea', choices: ['Priya conducts a fair experiment and learns from its unexpected result', 'Priya proves that classical music helps plants grow', 'Priya gives up on science after her experiment fails', 'Priya wins first place at the science fair'], correctIndex: 0 },
        { q: 'As used in the passage, what does "identical" mean?', topic: 'Vocabulary in Context', choices: ['Exactly the same in every way', 'Slightly different in size', 'Made of different materials', 'Arranged in a circle'], correctIndex: 0 },
        { q: 'Which plants grew tallest in Priya\'s experiment?', topic: 'Detail', choices: ['The ones grown in silence', 'The ones that heard classical music', 'The ones that heard rock music', 'All plants grew equally'], correctIndex: 0 },
        { q: 'What can you infer about Priya\'s attitude toward science?', topic: 'Inference', choices: ['She values results over proving her original idea right', 'She only accepts results that match her prediction', 'She dislikes experiments that take more than one day', 'She believes music always helps plants grow'], correctIndex: 0 },
      ],
    },
    {
      passage: `The Amazon rainforest produces about 20 percent of the world's oxygen and is home to an estimated 10 percent of all species on Earth. Scientists continue to discover new plants, insects, and animals there every year. However, large sections of the Amazon have been cleared for farming and development. Many environmentalists argue that destroying the forest harms not just local wildlife but the global climate, since trees absorb carbon dioxide that would otherwise trap heat in the atmosphere.`,
      qs: [
        { q: 'What is the main idea of this passage?', topic: 'Main Idea', choices: ['The Amazon is vital to Earth\'s biodiversity and climate, yet it faces serious threats', 'The Amazon is too remote to be affected by human activity', 'Farming in the Amazon has improved the global climate', 'Scientists have fully mapped every species in the Amazon'], correctIndex: 0 },
        { q: 'What does "absorb" mean as used in the passage?', topic: 'Vocabulary in Context', choices: ['Take in or soak up', 'Push away or reject', 'Break down into smaller parts', 'Release into the atmosphere'], correctIndex: 0 },
        { q: 'How much of the world\'s oxygen does the Amazon produce?', topic: 'Detail', choices: ['About 20 percent', 'About 10 percent', 'About 50 percent', 'Less than 1 percent'], correctIndex: 0 },
        { q: 'What can be inferred about deforestation\'s effects based on this passage?', topic: 'Inference', choices: ['It may worsen global climate problems', 'It only affects the animals living in the Amazon', 'It helps increase oxygen production', 'It has no measurable effect on the atmosphere'], correctIndex: 0 },
      ],
    },
  ],
  high: [
    {
      passage: `Urban planners increasingly argue that green spaces are not simply aesthetic additions to a city but essential infrastructure. Parks and tree-lined streets reduce ambient temperature, filter airborne pollutants, and provide measurable mental health benefits to residents. Critics counter that in dense cities, every acre devoted to greenery is an acre not used for housing, a tension that becomes sharper as urban populations grow. Still, most planners maintain that a city without green infrastructure eventually pays for that absence through higher public health costs.`,
      qs: [
        {
          q: 'Which statement best captures the main argument of this passage?',
          topic: 'Main Idea',
          choices: [
            'Green spaces should be treated as necessary infrastructure despite competing housing needs',
            'Green spaces are a luxury cities can no longer afford',
            'Housing should always be prioritized over parks',
            'Urban planners agree unanimously on land use',
          ],
          correctIndex: 0,
        },
        {
          q: 'As used in the passage, "ambient" most nearly means',
          topic: 'Vocabulary in Context',
          choices: ['Surrounding or general', 'Extremely hot', 'Artificial', 'Temporary'],
          correctIndex: 0,
        },
        {
          q: 'According to the passage, what is one criticism of prioritizing green space?',
          topic: 'Detail',
          choices: [
            'It reduces air quality',
            'It takes land away from housing development',
            'It raises public health costs',
            'It lowers property values',
          ],
          correctIndex: 1,
        },
        {
          q: "What can be inferred about the author's overall stance?",
          topic: 'Inference',
          choices: [
            'The author leans toward supporting green infrastructure',
            'The author believes parks should be eliminated',
            'The author is entirely neutral with no discernible view',
            'The author opposes all urban development',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      passage: `Ana stared at the acceptance letter for a long moment before folding it back into its envelope. It was everything she had worked toward — a spot at a school three thousand miles from home. Yet as she looked around the kitchen where she'd done a decade of homework, she realized the excitement she expected hadn't fully arrived. It was tangled up with something quieter: the knowledge that saying yes to this letter meant saying goodbye to a version of her life she hadn't finished loving yet.`,
      qs: [
        {
          q: 'What is the main idea of this passage?',
          topic: 'Main Idea',
          choices: [
            'Ana feels conflicted about a major life decision despite its being a success',
            'Ana decides to reject her acceptance letter',
            'Ana is indifferent to leaving home',
            'Ana regrets applying to the school',
          ],
          correctIndex: 0,
        },
        {
          q: 'What does "tangled up with" suggest about Ana\'s excitement?',
          topic: 'Vocabulary in Context',
          choices: [
            'It was completely separate from other feelings',
            'It was mixed together with more complicated feelings',
            'It had disappeared entirely',
            'It was the only emotion she felt',
          ],
          correctIndex: 1,
        },
        {
          q: 'According to the passage, how far away is the school?',
          topic: 'Detail',
          choices: [
            'Three hundred miles',
            'Three thousand miles',
            'Thirty miles',
            'It is not stated',
          ],
          correctIndex: 1,
        },
        {
          q: "What can be inferred about Ana's relationship to her home life?",
          topic: 'Inference',
          choices: [
            'She has meaningful attachment to it and will miss it',
            'She has always wanted to leave',
            'She dislikes her family',
            'She is unaffected by the change',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      passage: `Social media platforms have transformed how people consume news. Studies consistently show that short, emotional posts spread more rapidly than nuanced, fact-checked reporting. Some researchers argue this creates an environment in which misinformation thrives simply because it is more shareable than complex truth. Others counter that social media has democratized information by giving ordinary citizens a voice that traditional gatekeepers once controlled. The tension between reach and accuracy remains one of the defining challenges of the digital age.`,
      qs: [
        { q: 'Which statement best captures the central tension in this passage?', topic: 'Main Idea', choices: ['Social media spreads information widely but may prioritize emotion over accuracy', 'Social media has completely replaced traditional journalism', 'Misinformation is only spread by ordinary citizens', 'Fact-checked reporting is the most widely shared content online'], correctIndex: 0 },
        { q: 'As used in the passage, "nuanced" most nearly means', topic: 'Vocabulary in Context', choices: ['Detailed and carefully balanced', 'Simple and easy to share', 'Incorrect or misleading', 'Popular and widely read'], correctIndex: 0 },
        { q: 'According to the passage, what type of content spreads most rapidly?', topic: 'Detail', choices: ['Short, emotional posts', 'Long, fact-checked articles', 'Videos with expert interviews', 'Government press releases'], correctIndex: 0 },
        { q: 'What can be inferred about the author\'s view of the challenge described?', topic: 'Inference', choices: ['The author sees it as significant and unresolved', 'The author believes it has already been solved', 'The author thinks accuracy is less important than reach', 'The author opposes all forms of social media'], correctIndex: 0 },
      ],
    },
    {
      passage: `For over a thousand years, the Silk Road was not a single road but a network of trade routes connecting China, Central Asia, the Middle East, and Europe. Merchants carried silk, spices, and glassware, but the routes also transmitted ideas, religions, and technologies across civilizations. The bubonic plague, historians believe, also spread along these same paths in the 14th century. The Silk Road reminds us that exchange — whether of goods, culture, or disease — has always moved faster than borders can contain.`,
      qs: [
        { q: 'What is the main idea of this passage?', topic: 'Main Idea', choices: ['The Silk Road was a trade network that transferred goods, ideas, and even disease across civilizations', 'The Silk Road was a single, well-maintained road across Asia', 'The bubonic plague was caused by trade in silk', 'The Silk Road connected only China and Europe'], correctIndex: 0 },
        { q: 'As used in the passage, "transmitted" most nearly means', topic: 'Vocabulary in Context', choices: ['Passed on or carried across', 'Blocked or prevented', 'Created from scratch', 'Traded for profit'], correctIndex: 0 },
        { q: 'What did merchants carry along the Silk Road?', topic: 'Detail', choices: ['Silk, spices, and glassware', 'Cotton, timber, and iron', 'Gold, silver, and diamonds', 'Books, maps, and art'], correctIndex: 0 },
        { q: 'What does the passage suggest about the nature of exchange across borders?', topic: 'Inference', choices: ['It moves faster than borders can easily contain', 'It requires government permission at every step', 'It mainly spreads harmful things like disease', 'It ended with the fall of the Silk Road'], correctIndex: 0 },
      ],
    },
    {
      passage: `Sleep researchers have established that most adolescents require between eight and ten hours of sleep per night, yet surveys consistently find that many teenagers sleep fewer than seven hours on school nights. Chronic sleep deprivation in adolescents is associated with reduced attention, lower academic performance, and heightened emotional reactivity. Despite this evidence, many school districts continue to schedule early start times, creating a structural mismatch between biological sleep patterns and institutional demands.`,
      qs: [
        { q: 'What is the main argument of this passage?', topic: 'Main Idea', choices: ['Adolescent sleep deprivation is a documented problem that school schedules can worsen', 'Teenagers sleep too much on weekends', 'Early start times have no effect on academic performance', 'Sleep requirements are the same for all age groups'], correctIndex: 0 },
        { q: 'As used in the passage, "chronic" most nearly means', topic: 'Vocabulary in Context', choices: ['Persistent and long-lasting', 'Sudden and unexpected', 'Mild and temporary', 'Caused by disease'], correctIndex: 0 },
        { q: 'How many hours of sleep do researchers say adolescents need?', topic: 'Detail', choices: ['Eight to ten hours', 'Six to seven hours', 'Five to six hours', 'Eleven to twelve hours'], correctIndex: 0 },
        { q: 'What can be inferred about early school start times based on the passage?', topic: 'Inference', choices: ['They may contribute to adolescent sleep deprivation', 'They have been shown to improve academic performance', 'They are required by federal law', 'They have no connection to sleep patterns'], correctIndex: 0 },
      ],
    },
  ],
  satact: [
    {
      passage: `Coral reefs, though often described as underwater "forests," are built not by plants but by tiny animals called coral polyps. Each polyp secretes calcium carbonate, gradually forming the hard skeleton that makes up a reef's structure. Reefs cover less than one percent of the ocean floor, yet they support roughly a quarter of all known marine species, making them disproportionately important to ocean biodiversity relative to their physical footprint.`,
      qs: [
        {
          q: 'Which choice best states the main purpose of the passage?',
          topic: 'Main Idea',
          choices: [
            'To explain how coral reefs form and why their biodiversity matters relative to their size',
            'To argue that coral reefs should be classified as plants',
            'To describe the calcium carbonate industry',
            'To compare reefs to rainforests in detail',
          ],
          correctIndex: 0,
        },
        {
          q: 'As used in the passage, "disproportionately" most nearly means',
          topic: 'Vocabulary in Context',
          choices: [
            'Equally',
            'Predictably',
            'Out of proportion to some other measure',
            'Negatively',
          ],
          correctIndex: 2,
        },
        {
          q: 'According to the passage, what percentage of the ocean floor do reefs cover?',
          topic: 'Detail',
          choices: [
            'Less than one percent',
            'About twenty-five percent',
            'Half',
            'Nearly all of it',
          ],
          correctIndex: 0,
        },
        {
          q: 'The comparison between reef area and species supported most strongly supports which idea?',
          topic: 'Inference',
          choices: [
            'Reefs are unusually valuable to biodiversity for their size',
            'Reefs are the largest ocean structures',
            'Most marine species live outside reefs',
            'Reef area is expanding rapidly',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      passage: `Voter turnout in local elections is consistently lower than in national elections, even though local governments often make decisions — school budgets, zoning, policing — with more direct and immediate impact on daily life. Political scientists suggest this gap stems partly from visibility: national races receive far more media coverage, while local candidates and ballot measures can be difficult for time-pressed residents to research. Some cities have experimented with mailing simplified voter guides, a low-cost intervention correlated with modest turnout increases.`,
      qs: [
        {
          q: 'What is the main idea of the passage?',
          topic: 'Main Idea',
          choices: [
            'Local elections often see lower turnout than national ones despite their direct impact, and visibility may explain part of the gap',
            'National elections have no media coverage',
            'Local governments have less influence than national ones',
            'Voter guides have failed in every city that tried them',
          ],
          correctIndex: 0,
        },
        {
          q: 'As used in the passage, "intervention" most nearly means',
          topic: 'Vocabulary in Context',
          choices: [
            'A deliberate action taken to produce an effect',
            'A legal punishment',
            'An election result',
            'A form of media coverage',
          ],
          correctIndex: 0,
        },
        {
          q: 'According to the passage, what is one example of a decision local governments make?',
          topic: 'Detail',
          choices: [
            'School budgets',
            'Foreign policy',
            'National defense spending',
            'Federal tax rates',
          ],
          correctIndex: 0,
        },
        {
          q: 'The passage suggests voter guides are correlated with what outcome?',
          topic: 'Inference',
          choices: [
            'A modest increase in turnout',
            'A sharp decline in turnout',
            'No measurable effect',
            'Increased national election turnout only',
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      passage: `The COVID-19 pandemic exposed the fragility of globally integrated supply chains. When factories in one country shut down, shortages rippled across industries worldwide — from semiconductors to medical equipment. Economists had long praised "just-in-time" manufacturing, in which components are ordered to arrive exactly when needed rather than stockpiled. The pandemic revealed the hidden cost of that efficiency: minimal buffer when disruption strikes. Many companies have since begun diversifying suppliers and holding larger inventories, trading some efficiency for resilience.`,
      qs: [
        { q: 'What is the central idea of this passage?', topic: 'Main Idea', choices: ['The pandemic revealed that efficient global supply chains are vulnerable to disruption, prompting companies to prioritize resilience', 'Just-in-time manufacturing is the optimal approach for all industries', 'The pandemic had no lasting effect on supply chain strategy', 'Stockpiling inventory always increases a company\'s efficiency'], correctIndex: 0 },
        { q: 'As used in the passage, "resilience" most nearly means', topic: 'Vocabulary in Context', choices: ['The ability to recover from or withstand difficulty', 'The speed at which goods are delivered', 'A strategy that eliminates all inventory costs', 'Maximum production efficiency'], correctIndex: 0 },
        { q: 'What did "just-in-time" manufacturing involve?', topic: 'Detail', choices: ['Ordering components to arrive exactly when needed rather than stockpiling them', 'Building large reserves of every component needed', 'Manufacturing all goods domestically', 'Eliminating all suppliers outside the home country'], correctIndex: 0 },
        { q: 'What can be inferred about the relationship between efficiency and risk in supply chains?', topic: 'Inference', choices: ['Greater efficiency can come at the cost of vulnerability to disruption', 'Efficiency and resilience always increase together', 'Diversifying suppliers reduces efficiency without any benefit', 'The pandemic proved that just-in-time manufacturing is always superior'], correctIndex: 0 },
      ],
    },
    {
      passage: `Memory, neuroscientists now understand, is not a recording but a reconstruction. Each time we recall an event, the brain rebuilds it from fragments, and in doing so, subtly edits it. Emotion amplifies certain details while others fade. Repetition of a story — telling it at family dinners, writing it down — can make a version of the event feel more vivid than the actual experience. Eyewitness testimony, once considered nearly infallible in court, has been reexamined in light of these findings, with some convictions overturned when memory science was applied.`,
      qs: [
        { q: 'Which choice best states the main idea of the passage?', topic: 'Main Idea', choices: ['Memory is a reconstructive and therefore fallible process with significant real-world implications', 'Memory records events with perfect accuracy if emotions are strong enough', 'Eyewitness testimony has been proven to be reliable in all court cases', 'Repetition makes memory less accurate over time'], correctIndex: 0 },
        { q: 'As used in the passage, "amplifies" most nearly means', topic: 'Vocabulary in Context', choices: ['Strengthens or makes more intense', 'Erases or removes', 'Distorts beyond recognition', 'Records with accuracy'], correctIndex: 0 },
        { q: 'According to the passage, what has happened to some convictions that relied on eyewitness testimony?', topic: 'Detail', choices: ['They have been overturned after applying memory science', 'They have been upheld as completely reliable', 'They have been retried with new witnesses', 'They have been sealed from public review'], correctIndex: 0 },
        { q: 'What can be inferred about the reliability of eyewitness accounts in legal proceedings?', topic: 'Inference', choices: ['They may be less reliable than previously assumed', 'They are always the most accurate form of evidence', 'They become more reliable when repeated often', 'They are no longer admissible in any court'], correctIndex: 0 },
      ],
    },
    {
      passage: `Invasive species — organisms introduced outside their native range — can alter ecosystems dramatically by outcompeting native species for food and habitat. The brown tree snake, accidentally transported to Guam after World War II, drove nine native bird species to extinction on the island. Unlike predators in their native habitats, invasive species often arrive without the natural checks that keep their populations in balance. Ecologists warn that preventing introduction is far less costly than attempting control after a species is established.`,
      qs: [
        { q: 'What is the main idea of the passage?', topic: 'Main Idea', choices: ['Invasive species can devastate ecosystems and are far easier to prevent than to control once established', 'The brown tree snake is the only invasive species that has caused extinctions', 'Native species always outcompete invasive ones over time', 'Ecologists believe invasive species eventually help ecosystems recover'], correctIndex: 0 },
        { q: 'As used in the passage, "checks" most nearly means', topic: 'Vocabulary in Context', choices: ['Factors that limit or control a population', 'Predators that hunt invasive species', 'Physical barriers like fences or walls', 'Scientific studies of ecosystems'], correctIndex: 0 },
        { q: 'According to the passage, what happened to bird species in Guam after the brown tree snake arrived?', topic: 'Detail', choices: ['Nine native species were driven to extinction', 'Bird populations doubled within a decade', 'Birds migrated to nearby islands and survived', 'A single rare species was affected'], correctIndex: 0 },
        { q: 'What can be inferred about the cost of invasive species management compared to prevention?', topic: 'Inference', choices: ['Prevention is significantly less expensive than control after establishment', 'Control after establishment is always cheaper and more effective', 'Both approaches cost roughly the same amount', 'Prevention is impossible once an organism enters a new region'], correctIndex: 0 },
      ],
    },
  ],
};

const TOPIC_ORDER: Record<string, string[]> = {
  elementary_math: ['Addition', 'Subtraction', 'Multiplication', 'Word Problems', 'Division', 'Decimals'],
  middle_math: ['Fractions', 'Ratios & Percentages', 'Basic Algebra', 'Word Problems', 'Geometry', 'Negative Numbers'],
  high_math: ['Algebra', 'Geometry', 'Functions', 'Word Problems', 'Statistics', 'Quadratics'],
  satact_math: ['Algebra', 'Data Analysis', 'Geometry', 'Advanced Math', 'Systems of Equations', 'Probability'],
  elementary_reading: ['Main Idea', 'Vocabulary in Context', 'Detail', 'Inference'],
  middle_reading: ['Main Idea', 'Vocabulary in Context', 'Detail', 'Inference'],
  high_reading: ['Main Idea', 'Vocabulary in Context', 'Detail', 'Inference'],
  satact_reading: ['Main Idea', 'Vocabulary in Context', 'Detail', 'Inference'],
};

function flattenReading(ageGroup: AgeGroupId): Omit<Question, 'id'>[] {
  const items: Omit<Question, 'id'>[] = [];
  for (const entry of READING_BANK[ageGroup]) {
    for (const q of entry.qs) {
      items.push({
        prompt: q.q,
        passage: entry.passage,
        topic: q.topic,
        choices: q.choices,
        correctIndex: q.correctIndex,
      });
    }
  }
  return items;
}

export function generateTest(
  ageGroup: AgeGroupId,
  subject: SubjectId,
  length: number,
): Question[] {
  if (subject === 'math') {
    const gens = MATH_GENERATORS[ageGroup];
    const topics = TOPIC_ORDER[`${ageGroup}_math`];
    const out: Question[] = [];
    for (let i = 0; i < length; i++) {
      const topic = topics[i % topics.length];
      out.push({ ...gens[topic](), id: `m${i}` });
    }
    return out;
  }
  const bank = shuffle(flattenReading(ageGroup));
  const out: Question[] = [];
  for (let i = 0; i < length; i++) {
    const src = bank[i % bank.length];
    out.push({ ...src, id: `r${i}` });
  }
  return out;
}

export function scoreQuiz(
  questions: Question[],
  answers: Array<number | null>,
): { score: number; topicBreakdown: TopicResult[] } {
  let correct = 0;
  const topicMap: Record<string, { topic: string; correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    const t =
      topicMap[q.topic] ||
      (topicMap[q.topic] = { topic: q.topic, correct: 0, total: 0 });
    t.total += 1;
    if (answers[i] === q.correctIndex) {
      t.correct += 1;
      correct += 1;
    }
  });
  const score = Math.round((correct / questions.length) * 100);
  const topicBreakdown = Object.values(topicMap).map((t) => ({
    topic: t.topic,
    correct: t.correct,
    total: t.total,
    pct: Math.round((t.correct / t.total) * 100),
    strong: t.correct / t.total >= 0.7,
  }));
  return { score, topicBreakdown };
}

export function scoreTier(score: number): { label: string; desc: string } {
  if (score >= 85)
    return {
      label: 'Excelling',
      desc: 'is performing at or above grade level and ready for enrichment challenges.',
    };
  if (score >= 70)
    return {
      label: 'Strong Foundation',
      desc: 'has a solid grasp of the material with a few targeted areas to sharpen.',
    };
  if (score >= 50)
    return {
      label: 'Building Skills',
      desc: 'is building the fundamentals — consistent support now will pay off quickly.',
    };
  return {
    label: 'Needs Support',
    desc: 'would benefit from focused, one-on-one help to close key gaps.',
  };
}

export function scorePercentile(score: number): number {
  return Math.max(5, Math.round(95 * Math.pow(score / 100, 2)));
}

export const AGE_GROUPS: Array<{ id: AgeGroupId; label: string; sub: string }> = [
  { id: 'elementary', label: 'Elementary', sub: 'Grades K–5' },
  { id: 'middle', label: 'Middle School', sub: 'Grades 6–8' },
  { id: 'high', label: 'High School', sub: 'Grades 9–12' },
  { id: 'satact', label: 'SAT / ACT Prep', sub: 'Test-ready practice' },
];

export const SUBJECTS: Array<{ id: SubjectId; label: string }> = [
  { id: 'math', label: 'Math' },
  { id: 'reading', label: 'Reading' },
];

export const LENGTHS: Array<{ id: LengthId; label: string; sub: string }> = [
  { id: 20, label: 'Short', sub: '20 questions · ~15 min' },
  { id: 50, label: 'Medium', sub: '50 questions · ~35 min' },
  { id: 100, label: 'Long', sub: '100 questions · ~70 min' },
];
