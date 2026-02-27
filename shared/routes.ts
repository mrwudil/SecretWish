import { z } from 'zod';
import { insertQuestionSchema, insertWishSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  questions: {
    create: {
      method: 'POST' as const,
      path: '/api/questions' as const,
      input: z.object({
        receiverEmail: z.string().email(),
        eventType: z.string().optional(),
        revealOption: z.enum(["After Purchase", "Never"]),
      }),
      responses: {
        201: z.custom<import('./schema').QuestionResponse>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/questions/:id' as const,
      responses: {
        200: z.custom<import('./schema').QuestionWithWishesResponse>(),
        404: errorSchemas.notFound,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/questions' as const,
      responses: {
        200: z.array(z.custom<import('./schema').QuestionWithWishesResponse>()),
        401: errorSchemas.unauthorized,
      },
    }
  },
  wishes: {
    submit: {
      method: 'POST' as const,
      path: '/api/questions/:id/wishes' as const,
      input: z.object({
        wishes: z.array(z.object({
          itemName: z.string(),
          itemLink: z.string().url().optional().or(z.literal('')),
          price: z.number().optional(),
        })).max(3),
      }),
      responses: {
        201: z.array(z.custom<import('./schema').WishResponse>()),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/wishes/:wishId/status' as const,
      input: z.object({
        status: z.enum(["pending", "surprise_in_progress", "not_this_time"]),
      }),
      responses: {
        200: z.custom<import('./schema').WishResponse>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
