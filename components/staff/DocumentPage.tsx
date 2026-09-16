import Image from 'next/image';
import type { Resource } from '@/lib/staff/types';

/**
 * Faux worksheet/test page used in the file preview — KHM letterhead plus
 * generated sample problems. When real PDFs are wired up, swap this for a PDF
 * viewer (e.g. an <iframe src={resource.fileUrl}> or react-pdf).
 */

type Item = string | { q: string; o: string[] };

function contentFor(file: Resource): { instructions: string; mc?: boolean; items: Item[] } {
  const s = file.subject;
  const math = {
    instructions: 'Show all work. Circle your final answer. Calculators are not permitted.',
    items: [
      'Solve for x:  3x + 7 = 22',
      'Simplify:  4(2x - 5) + 3x',
      'Solve for y:  y/4 - 2 = 6',
      'Write the equation of the line through (2, 3) with slope -1.',
      'Factor completely:  x\u00b2 + 5x + 6',
      'Evaluate  2x\u00b2 - 3x + 1  when  x = 4.',
    ],
  };
  if (s === 'SAT Math')
    return {
      instructions: 'Each question has four answer choices. Select the best answer. 25 minutes, no calculator.',
      mc: true,
      items: [
        { q: 'If 3x - 7 = 11, what is the value of 6x - 14?', o: ['11', '18', '22', '36'] },
        { q: 'A line passes through (0, 4) and (2, 10). What is its slope?', o: ['2', '3', '4', '6'] },
        { q: 'If f(x) = 2x\u00b2 - x, what is f(3)?', o: ['9', '12', '15', '21'] },
        { q: 'The average of 5 numbers is 12. What is their sum?', o: ['48', '55', '60', '72'] },
      ],
    };
  if (s === 'SAT Reading & Writing')
    return {
      instructions: 'Read the passage, then choose the best answer based on what is stated or implied.',
      mc: true,
      items: [
        { q: 'The primary purpose of the passage is to -', o: ['refute a theory', 'describe a change', 'compare experiments', 'summarize a debate'] },
        { q: 'As used in line 14, "novel" most nearly means -', o: ['fictional', 'unfamiliar', 'lengthy', 'complex'] },
        { q: 'The author would most likely agree that -', o: ['progress is inevitable', 'evidence should guide policy', 'tradition limits growth', 'data can mislead'] },
        { q: 'Which choice best supports the previous answer?', o: ['Lines 5-7', 'Lines 12-15', 'Lines 22-24', 'Lines 30-32'] },
      ],
    };
  if (s === 'SSAT')
    return {
      instructions: 'Choose the answer that best completes the relationship or analogy.',
      mc: true,
      items: [
        { q: 'KIND is to CRUEL as -', o: ['happy : joyful', 'hot : cold', 'fast : quick', 'big : large'] },
        { q: 'Select the word most nearly OPPOSITE to ABUNDANT:', o: ['plentiful', 'scarce', 'generous', 'ample'] },
        { q: 'PAINTER is to BRUSH as -', o: ['writer : pen', 'singer : stage', 'doctor : patient', 'teacher : school'] },
        { q: 'The lecture was so ___ that students fell asleep.', o: ['riveting', 'tedious', 'concise', 'brilliant'] },
      ],
    };
  if (s === 'Geometry')
    return {
      instructions: 'Use the diagrams provided. Justify each step with a reason. Round to the nearest tenth.',
      items: [
        'Find the missing angle of a triangle with angles 47\u00b0 and 68\u00b0.',
        'A right triangle has legs of 6 and 8. Find the hypotenuse.',
        'Given congruent parts, prove the two triangles are congruent.',
        'Find the area of a circle with radius 5 cm.',
        'Classify the triangle with side lengths 5, 5, and 8.',
        'Find the arc length of a 60\u00b0 sector in a circle of radius 9.',
      ],
    };
  if (['Algebra 2', 'Pre-Calculus'].includes(s))
    return {
      instructions: 'Show all work. Exact answers where possible; otherwise round to three decimals.',
      items: [
        'Simplify:  log\u2082(32)',
        'Solve:  2^(x + 1) = 16',
        'Factor completely:  x\u00b3 - 8',
        'Convert  5\u03c0/6  radians to degrees.',
        'Verify the identity:  sin\u00b2\u03b8 + cos\u00b2\u03b8 = 1',
        'Find the exact value of  cos(\u03c0/3).',
      ],
    };
  if (s === 'English')
    return {
      instructions: 'Read the passage carefully. Answer in complete sentences and cite evidence.',
      items: [
        'Identify the thesis statement of the passage.',
        'Which detail best supports the main idea? Explain.',
        "What can you infer about the narrator's point of view?",
        'Describe the tone of the second paragraph.',
        'Rewrite the underlined sentence to strengthen the argument.',
      ],
    };
  if (s === 'Biology')
    return {
      instructions: 'Use complete sentences. Diagrams may be labeled where indicated.',
      items: [
        'Label the four phases of mitosis in the diagram.',
        'Describe the primary function of the mitochondria.',
        'Compare passive and active transport.',
        'A cross Aa \u00d7 Aa is performed. Give the genotype ratio.',
        'Explain the role of enzymes in a reaction.',
      ],
    };
  if (s === 'Chemistry')
    return {
      instructions: 'Show all conversions with units. Use the correct number of significant figures.',
      items: [
        'Balance:  H\u2082 + O\u2082 \u2192 H\u2082O',
        'Calculate the molar mass of CO\u2082.',
        'How many moles are in 36 g of water?',
        'Convert 2.5 mol of NaCl to grams.',
        'Identify the limiting reactant: 4 mol H\u2082, 1 mol O\u2082.',
      ],
    };
  return math;
}

export function DocumentPage({ file }: { file: Resource }) {
  const content = contentFor(file);
  const isTest = file.type === 'test';
  const isQuiz = file.type === 'quiz';
  const scored = isTest || isQuiz;
  return (
    <div className="rounded-xl border border-border bg-white px-10 py-9 text-[#1c2c46] shadow-md">
      {/* Letterhead */}
      <div className="mb-[18px] flex items-start justify-between border-b-2 border-primary pb-3">
        <div className="flex items-center gap-2.5">
          <Image src="/images/khm-tutoring-logo.png" alt="" width={30} height={30} className="object-contain" />
          <div>
            <div className="text-[15px] font-bold leading-none">KHM Tutoring</div>
            <div className="text-[10px] italic text-[#5c6a85]">Take it higher</div>
          </div>
        </div>
        <div className="text-right text-[11px] leading-[1.7] text-[#5c6a85]">
          <div>Name: ______________________</div>
          {scored ? <div>Date: __________ Score: ____ / {isQuiz ? 20 : 100}</div> : <div>Date: ______________________</div>}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-[0.08em] ${isTest ? 'text-[hsl(0_70%_45%)]' : isQuiz ? 'text-[hsl(268_60%_45%)]' : 'text-primary'}`}>
            {isTest ? 'Assessment' : isQuiz ? 'Quick Quiz' : 'Practice Worksheet'}
          </span>
          <span className="size-1 rounded-full bg-[#c1cedd]" />
          <span className="text-[10px] text-[#5c6a85]">{file.subject} · {file.grade} Grade</span>
        </div>
        <h2 className="mt-1 text-[22px] font-bold">{file.title}</h2>
      </div>

      {/* Instructions */}
      <p className="mb-[18px] rounded-md border-l-[3px] border-primary bg-[hsl(210_40%_92%/0.5)] px-3 py-2 text-[12px] italic text-[#5c6a85]">
        {content.instructions}
      </p>

      {/* Problems */}
      <ol className="m-0 list-none p-0">
        {content.items.slice(0, 6).map((it, i) => {
          const q = typeof it === 'string' ? it : it.q;
          return (
            <li key={i} className={`flex gap-3 ${content.mc ? 'mb-4' : 'mb-[22px]'}`}>
              <span className="min-w-[18px] font-bold text-primary">{i + 1}.</span>
              <div className="flex-1">
                <div className="text-[13px] leading-[1.5]">{q}</div>
                {typeof it !== 'string' ? (
                  <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1">
                    {it.o.map((opt, k) => (
                      <div key={k} className="flex items-center gap-[7px] text-[12.5px] text-[#33425e]">
                        <span className="flex size-4 items-center justify-center rounded-full border-[1.5px] border-[#9fb0c7] text-[9px] font-bold text-[#5c6a85]">
                          {'ABCD'[k]}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`mt-2.5 border-b border-[#dbe3ec] ${scored ? 'h-7' : ''}`} />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-[18px] flex justify-between border-t border-dashed border-[#dbe3ec] pt-2.5 text-[10px] text-[#9aa6ba]">
        <span>© KHM Tutoring · For instructional use</span>
        <span>Page 1 of {file.pages}</span>
      </div>
    </div>
  );
}
