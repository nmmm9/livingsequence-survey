import { z } from "zod";

const radioWithOther = z.object({
  value: z.string().min(1),
  other: z.string().optional(),
});

export const surveyResponseSchema = z.object({
  responses: z.object({
    q1: z.string().optional(),              // 주관식 - 선택
    q2: radioWithOther,                      // 객관식 - 필수
    q3: z.string().optional(),              // 주관식 - 선택
    q4: z.string().optional(),              // 주관식 - 선택
    q5: z.string().optional(),              // 주관식 - 선택
    q6: z.string().nullable().optional(),   // 주관식 - 선택
    q7: z.object({                           // 객관식 - 필수
      value: z.string().min(1),
      q7_1: radioWithOther.optional(),
      q7_2: z.string().optional(),
    }),
    q8: z.string().optional(),              // 주관식 - 선택
    q9: z.object({                           // 객관식 - 필수
      value: z.string().min(1),
      q9_1: radioWithOther.optional(),
      q9_2: radioWithOther.optional(),
    }),
    q10: z.object({                          // 객관식 - 필수
      value: z.string().min(1),
      q10_2: radioWithOther.optional(),
    }),
    q11: z.object({                          // 객관식 - 필수
      values: z.array(z.string()).min(1),
      other: z.string().optional(),
      reason: z.string().optional(),
    }),
    q12: z.object({                          // 객관식 - 필수
      values: z.array(z.string()).min(1),
      reason: z.string().optional(),
    }),
    q13: z.object({                          // 객관식 - 필수
      values: z.array(z.string()).min(1),
      other: z.string().optional(),
    }),
    q14: z.string().optional(),             // 주관식 - 선택
    q15: z.object({                          // 객관식 - 필수
      values: z.array(z.string()).min(1),
      other: z.string().optional(),
      q15_1: radioWithOther.optional(),
    }),
    q16: z.string().optional(),             // 주관식 - 선택
    q17: z.string().optional(),             // 주관식 - 선택
  }),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      completionTimeSeconds: z.number().optional(),
    })
    .optional(),
});

export type SurveyResponse = z.infer<typeof surveyResponseSchema>;
