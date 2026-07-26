// KHM Tutoring — Diagnostic Test question engine.
// Math questions are procedurally generated (level-appropriate, infinite supply).
// Reading questions are a curated bank of short original passages + comprehension Qs.
// Both expose topic tags used for the results breakdown.

export type AgeGroupId = 'elementary' | 'middle' | 'high' | 'satact';
export type SubjectId = 'math' | 'reading';
export type LengthId = 5 | 12 | 25;

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
      const a = randInt(10, 89),
        b = randInt(10, 89);
      const c = a + b;
      return buildChoiceQ(`${a} + ${b} = ?`, c, [c + 1, c - 1, c + 10], 'Addition');
    },
    Subtraction: () => {
      const a = randInt(20, 99);
      const b = randInt(5, a - 1);
      const c = a - b;
      return buildChoiceQ(`${a} - ${b} = ?`, c, [c + 1, c - 1, c + 10], 'Subtraction');
    },
    Multiplication: () => {
      const a = randInt(2, 12),
        b = randInt(2, 12);
      const c = a * b;
      return buildChoiceQ(`${a} × ${b} = ?`, c, [c + a, c - b, c + b], 'Multiplication');
    },
    'Word Problems': () => {
      const apples = randInt(3, 9),
        bags = randInt(2, 6);
      const c = apples * bags;
      return buildChoiceQ(
        `Mia packs ${apples} apples into each bag. If she fills ${bags} bags, how many apples does she use in total?`,
        c,
        [c + bags, c - apples, apples + bags],
        'Word Problems',
      );
    },
    Division: () => {
      const b = randInt(2, 9), a = b * randInt(2, 9);
      const c = a / b;
      return buildChoiceQ(`${a} ÷ ${b} = ?`, c, [c + 1, c - 1, c + b], 'Division');
    },
    Decimals: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const a = randInt(1, 9), b = randInt(1, 9);
        const c = parseFloat(((a + b) / 10).toFixed(1));
        return buildChoiceQ(`0.${a} + 0.${b} = ?`, c, [parseFloat(((a + b + 1) / 10).toFixed(1)), parseFloat(((a + b - 1) / 10).toFixed(1)), parseFloat((a / b).toFixed(1))], 'Decimals');
      } else {
        const whole = randInt(1, 5), dec = randInt(1, 8);
        const sub = randInt(1, dec);
        const c = parseFloat((whole + (dec - sub) / 10).toFixed(1));
        return buildChoiceQ(`${whole}.${dec} - 0.${sub} = ?`, c, [parseFloat((c + 0.1).toFixed(1)), parseFloat((c - 0.1).toFixed(1)), parseFloat((whole + dec / 10).toFixed(1))], 'Decimals');
      }
    },
  },
  middle: {
    Fractions: () => {
      const d = randInt(3, 8);
      let n1 = randInt(1, d - 1),
        n2 = randInt(1, d - 1);
      if (n1 + n2 >= d) n2 = d - n1 - 1 || 1;
      const c = `${n1 + n2}/${d}`;
      return buildChoiceQ(
        `${n1}/${d} + ${n2}/${d} = ?`,
        c,
        [`${n1 + n2 + 1}/${d}`, `${n1 + n2}/${d + 1}`, `${n1 * n2}/${d}`],
        'Fractions',
      );
    },
    'Ratios & Percentages': () => {
      const pct = [10, 20, 25, 50, 75][randInt(0, 4)];
      const base = randInt(2, 40) * 4;
      const c = (pct / 100) * base;
      return buildChoiceQ(
        `What is ${pct}% of ${base}?`,
        c,
        [c + base * 0.1, c - 10, c + 5],
        'Ratios & Percentages',
      );
    },
    'Basic Algebra': () => {
      const x = randInt(2, 12),
        a = randInt(2, 9),
        b = randInt(1, 20);
      const c = a * x + b;
      return buildChoiceQ(
        `Solve for x: ${a}x + ${b} = ${c}`,
        x,
        [x + 1, x - 1, x + a],
        'Basic Algebra',
      );
    },
    'Word Problems': () => {
      const rate = randInt(2, 9),
        hrs = randInt(2, 8);
      const c = rate * hrs;
      return buildChoiceQ(
        `A tutor reads ${rate} pages every hour. How many pages are read in ${hrs} hours?`,
        c,
        [c + rate, c - hrs, rate + hrs],
        'Word Problems',
      );
    },
    Geometry: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const l = randInt(3, 12), w = randInt(3, 12);
        const c = 2 * (l + w);
        return buildChoiceQ(`A rectangle has length ${l} and width ${w}. What is its perimeter?`, c, [l * w, c + 2, c - 4], 'Geometry');
      } else {
        const s1 = randInt(3, 10), s2 = randInt(3, 10), s3 = randInt(3, 10);
        const c = s1 + s2 + s3;
        return buildChoiceQ(`A triangle has sides ${s1}, ${s2}, and ${s3}. What is its perimeter?`, c, [c + s1, c - 1, s1 * s2], 'Geometry');
      }
    },
    'Negative Numbers': () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const a = randInt(-9, -1), b = randInt(1, 15);
        const c = a + b;
        return buildChoiceQ(`${a} + ${b} = ?`, c, [c + 1, c - 1, Math.abs(a) + b], 'Negative Numbers');
      } else {
        const a = randInt(-8, -1), b = randInt(2, 6);
        const c = a * b;
        return buildChoiceQ(`${a} × ${b} = ?`, c, [c + b, Math.abs(c), c - b], 'Negative Numbers');
      }
    },
  },
  high: {
    Algebra: () => {
      const x = randInt(-8, 8),
        a = randInt(2, 6),
        b = randInt(-15, 15);
      const c = a * x + b;
      return buildChoiceQ(
        `Solve for x: ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${c}`,
        x,
        [x + 1, x - 1, -x],
        'Algebra',
      );
    },
    Geometry: () => {
      const type = randInt(0, 1);
      if (type === 0) {
        const w = randInt(3, 15),
          h = randInt(3, 15);
        const c = w * h;
        return buildChoiceQ(
          `A rectangle has width ${w} and height ${h}. What is its area?`,
          c,
          [c + w, c - h, 2 * (w + h)],
          'Geometry',
        );
      } else {
        const r = randInt(2, 10);
        const c = Math.round(Math.PI * r * r);
        return buildChoiceQ(
          `A circle has radius ${r}. What is its area, rounded to the nearest whole number? (use π ≈ 3.14)`,
          c,
          [c + r, Math.round(2 * Math.PI * r), c - r],
          'Geometry',
        );
      }
    },
    Functions: () => {
      const a = randInt(2, 5),
        b = randInt(1, 10),
        x = randInt(1, 9);
      const c = a * x + b;
      return buildChoiceQ(
        `If f(x) = ${a}x + ${b}, what is f(${x})?`,
        c,
        [c + a, c - b, a + x + b],
        'Functions',
      );
    },
    'Word Problems': () => {
      const speed = randInt(30, 65),
        time = randInt(2, 6);
      const c = speed * time;
      return buildChoiceQ(
        `A car travels at ${speed} mph for ${time} hours. How far does it travel?`,
        c,
        [c + speed, c - time, speed + time],
        'Word Problems',
      );
    },
    Statistics: () => {
      const nums = Array.from({ length: 5 }, () => randInt(5, 30));
      const total = nums.reduce((a, b) => a + b, 0);
      const mean = Math.round(total / nums.length);
      return buildChoiceQ(`What is the mean of: ${nums.join(', ')}?`, mean, [mean + 2, mean - 2, Math.round(total / (nums.length + 1))], 'Statistics');
    },
    Quadratics: () => {
      const r1 = randInt(1, 6), r2 = randInt(1, 6);
      const b = -(r1 + r2), c2 = r1 * r2;
      const bStr = b < 0 ? `- ${Math.abs(b)}x` : `+ ${b}x`;
      const cStr = c2 > 0 ? `+ ${c2}` : `- ${Math.abs(c2)}`;
      return buildChoiceQ(`One solution of x² ${bStr} ${cStr} = 0 is x = ${r1}. What is the other solution?`, r2, [r1 + r2, r2 + 1, r2 - 1], 'Quadratics');
    },
  },
  satact: {
    Algebra: () => {
      const x = randInt(-6, 10),
        a = randInt(2, 7),
        b = randInt(-20, 20);
      const c = a * x - b;
      return buildChoiceQ(
        `Solve for x: ${a}x - (${b}) = ${c - b}... simplify: ${a}x = ${a * x}`,
        x,
        [x + 2, x - 2, -x],
        'Algebra',
      );
    },
    'Data Analysis': () => {
      const nums = Array.from({ length: 5 }, () => randInt(10, 90)).sort((a, b) => a - b);
      const median = nums[2];
      return buildChoiceQ(
        `What is the median of this data set: ${nums.join(', ')}?`,
        median,
        [nums[1], nums[3], Math.round(nums.reduce((a, b) => a + b) / 5)],
        'Data Analysis',
      );
    },
    Geometry: () => {
      const leg1 = randInt(3, 12),
        leg2 = randInt(3, 12);
      const hyp = Math.round(Math.sqrt(leg1 * leg1 + leg2 * leg2));
      return buildChoiceQ(
        `A right triangle has legs of length ${leg1} and ${leg2}. What is the length of the hypotenuse, rounded to the nearest whole number?`,
        hyp,
        [hyp + 1, hyp - 1, leg1 + leg2],
        'Geometry',
      );
    },
    'Advanced Math': () => {
      const a = randInt(2, 5),
        b = randInt(1, 6);
      const c = a * a + b;
      return buildChoiceQ(
        `If x² = ${a * a}, what is x² + ${b}?`,
        c,
        [c + 1, c - b, a + b],
        'Advanced Math',
      );
    },
    'Systems of Equations': () => {
      const x = randInt(1, 8), y = randInt(1, 8);
      const a1 = randInt(1, 3), a2 = randInt(1, 3);
      const sum = a1 * x + a2 * y;
      const diff = x - y;
      return buildChoiceQ(`If ${a1}x + ${a2}y = ${sum} and x - y = ${diff}, what is x?`, x, [x + 1, y, x - 1], 'Systems of Equations');
    },
    Probability: () => {
      const red = randInt(2, 6), blue = randInt(2, 8);
      const total = red + blue;
      const num = red, den = total;
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const g = gcd(num, den);
      const c = `${num / g}/${den / g}`;
      const wrong1 = `${red}/${red + blue + 1}`;
      const wrong2 = `${blue}/${total}`;
      const wrong3 = `${red + 1}/${total}`;
      return buildChoiceQ(`A bag has ${red} red marbles and ${blue} blue marbles. What is the probability of drawing a red marble?`, c, [wrong1, wrong2, wrong3], 'Probability');
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
  { id: 5, label: 'Short', sub: '5 questions · ~4 min' },
  { id: 12, label: 'Medium', sub: '12 questions · ~10 min' },
  { id: 25, label: 'Long', sub: '25 questions · ~20 min' },
];
