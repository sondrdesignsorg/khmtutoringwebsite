import { z } from 'zod';

export const GROUP_SAT_COHORTS = [
  'Sunday Strategy Cohort',
  'Weekday After-School Cohort',
  'Evening Practice Cohort',
] as const;

export const GROUP_SAT_GRADES = ['7', '8', '9', '10', '11', '12', 'Other'] as const;

const optionalText = (max: number) => z.string().trim().max(max).optional().nullable();

const optionalPhone = z
  .string()
  .trim()
  .max(40)
  .refine((value) => value === '' || /^\+?[\d\s().-]+$/.test(value), 'Invalid phone number')
  .refine((value) => value === '' || (value.match(/\d/g)?.length ?? 0) >= 7, 'Invalid phone number')
  .optional()
  .nullable();

const optionalDate = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Invalid SAT date')
  .optional()
  .nullable();

export const GroupSatInquirySchema = z
  .object({
    parentName: z.string().trim().min(1).max(120),
    studentName: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    phone: optionalPhone,
    grade: z.enum(GROUP_SAT_GRADES).optional().nullable(),
    cohort: z.enum(GROUP_SAT_COHORTS),
    satDate: optionalDate,
    currentScore: optionalText(80),
    goals: optionalText(1000),
    notes: optionalText(1000),
    // Commodity form bots commonly populate every input, including this hidden field.
    website: z.literal('').optional(),
    formStartedAt: z.number().int().positive(),
  })
  .strict();

export type GroupSatInquiryPayload = z.infer<typeof GroupSatInquirySchema>;

export function isPlausibleInquiryTiming(formStartedAt: number, now = Date.now()): boolean {
  const elapsed = now - formStartedAt;
  return elapsed >= 3_000 && elapsed <= 24 * 60 * 60 * 1_000;
}

function looksLikeGeneratedText(value: string | null | undefined): boolean {
  if (!value || value.length < 14 || !/^[A-Za-z]+$/.test(value)) return false;
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) return false;

  let caseChanges = 0;
  for (let index = 1; index < value.length; index += 1) {
    const previousIsUpper = value[index - 1] === value[index - 1].toUpperCase();
    const currentIsUpper = value[index] === value[index].toUpperCase();
    if (previousIsUpper !== currentIsUpper) caseChanges += 1;
  }
  return caseChanges >= 3;
}

export function hasGeneratedTextSpam(
  inquiry: Pick<GroupSatInquiryPayload, 'parentName' | 'studentName' | 'currentScore' | 'goals' | 'notes'>,
): boolean {
  const fields = [
    inquiry.parentName,
    inquiry.studentName,
    inquiry.currentScore,
    inquiry.goals,
    inquiry.notes,
  ];
  return fields.filter(looksLikeGeneratedText).length >= 2;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

export function safeEmailSubject(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}
