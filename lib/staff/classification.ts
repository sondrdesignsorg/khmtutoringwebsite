import { generateObject, gateway } from 'ai';
import { z } from 'zod';
import { classifyFilename } from './classify';
import { GRADES, SUBJECTS } from './resources';
import type { ClassifiedFile, Difficulty, ResourceType } from './types';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;
const RESOURCE_TYPES = ['worksheet', 'quiz', 'test'] as const;

const classificationSchema = z.object({
  title: z.string().min(1),
  type: z.enum(RESOURCE_TYPES),
  subject: z.enum(SUBJECTS as [string, ...string[]]),
  grade: z.enum(GRADES as [string, ...string[]]),
  topic: z.string().min(1),
  pages: z.number().int().min(1).max(200),
  difficulty: z.enum(DIFFICULTIES),
  confidence: z.enum(['high', 'medium', 'low']),
  reasons: z.array(z.string()).max(4),
});

export type ResourceClassification = z.infer<typeof classificationSchema>;

export interface ClassificationInput {
  filename: string;
  sourcePath?: string;
  firstPageText?: string;
  existingMetadata?: Record<string, unknown>;
  forceAI?: boolean;
}

export async function classifyResourceMetadata(input: ClassificationInput): Promise<ClassifiedFile> {
  const heuristic = classifyFilename(input.filename);
  if (!input.forceAI && (heuristic.confidence === 'high' || !process.env.AI_GATEWAY_API_KEY)) {
    return heuristic;
  }

  if (!process.env.AI_GATEWAY_API_KEY) return heuristic;

  try {
    const { object } = await generateObject({
      model: gateway(process.env.AI_GATEWAY_MODEL || 'openai/gpt-4.1-nano'),
      schema: classificationSchema,
      system: [
        'Classify KHM tutoring PDF metadata for a staff resource library.',
        'Use only the allowed enum values from the schema.',
        'Prefer conservative confidence. Do not invent details unsupported by filename, path, metadata, or text.',
      ].join(' '),
      prompt: JSON.stringify({
        filename: input.filename,
        sourcePath: input.sourcePath ?? '',
        firstPageText: input.firstPageText?.slice(0, 2500) ?? '',
        existingMetadata: input.existingMetadata ?? {},
        heuristic,
      }),
    });

    return {
      ...heuristic,
      type: object.type as ResourceType,
      subject: object.subject,
      grade: object.grade,
      difficulty: object.difficulty as Difficulty,
      pages: object.pages,
      confidence: object.confidence,
      subjectKnown: true,
      gradeKnown: true,
      reasons: object.reasons.length ? object.reasons : ['AI classified metadata'],
      suggestedTitle: object.title,
      suggestedTopic: object.topic,
    };
  } catch {
    return heuristic;
  }
}
