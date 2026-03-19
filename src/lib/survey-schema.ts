import { z } from "zod";

const radioWithOther = z.object({
  value: z.string().min(1),
  other: z.string().optional(),
});

export const surveyResponseSchema = z.object({
  responses: z.object({
    q1: z.string().min(1),
    q2: radioWithOther,
    q3: z.string().min(1),
    q4: z.string().min(1),
    q5: z.string().min(1),
    q6: z.string().nullable(),
    q7: z.object({
      value: z.string().min(1),
      q7_1: radioWithOther.optional(),
      q7_2: z.string().optional(),
    }),
    q8: z.string().min(1),
    q9: z.object({
      value: z.string().min(1),
      q9_1: radioWithOther.optional(),
      q9_2: radioWithOther.optional(),
    }),
    q10: z.object({
      value: z.string().min(1),
      q10_2: radioWithOther.optional(),
    }),
    q11: z.object({
      values: z.array(z.string()).min(1),
      other: z.string().optional(),
      reason: z.string().optional(),
    }),
    q12: z.object({
      values: z.array(z.string()).min(1),
      reason: z.string().optional(),
    }),
    q13: z.object({
      values: z.array(z.string()).min(1),
      other: z.string().optional(),
    }),
    q14: z.string().min(1),
    q15: z.object({
      values: z.array(z.string()).min(1),
      other: z.string().optional(),
      q15_1: radioWithOther.optional(),
    }),
    q16: z.string().min(1),
    q17: z.string().min(1),
  }),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      completionTimeSeconds: z.number().optional(),
    })
    .optional(),
});

export type SurveyResponse = z.infer<typeof surveyResponseSchema>;
