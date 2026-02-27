import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Helper to log and parse
function parseWithLogging<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    // Fallback: return data as T to avoid complete UI breakage if schema is slightly off
    return data as T;
  }
  return result.data;
}

export function useQuestions() {
  return useQuery({
    queryKey: [api.questions.list.path],
    queryFn: async () => {
      const res = await fetch(api.questions.list.path, { credentials: "include" });
      if (res.status === 401) return null; // Unauthenticated
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      return parseWithLogging(api.questions.list.responses[200], data, "questions.list");
    },
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: [api.questions.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.questions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch question");
      const data = await res.json();
      return parseWithLogging(api.questions.get.responses[200], data, "questions.get");
    },
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: z.infer<typeof api.questions.create.input>) => {
      const validated = api.questions.create.input.parse(input);
      const res = await fetch(api.questions.create.path, {
        method: api.questions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create secret wish");
      }
      return parseWithLogging(api.questions.create.responses[201], data, "questions.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.questions.list.path] });
    },
  });
}

export function useSubmitWishes(questionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: z.infer<typeof api.wishes.submit.input>) => {
      const url = buildUrl(api.wishes.submit.path, { id: questionId });
      const validated = api.wishes.submit.input.parse(input);
      const res = await fetch(url, {
        method: api.wishes.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit wishes");
      }
      return parseWithLogging(api.wishes.submit.responses[201], data, "wishes.submit");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.questions.get.path, questionId] });
      queryClient.invalidateQueries({ queryKey: [api.questions.list.path] });
    },
  });
}

export function useUpdateWishStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ wishId, status }: { wishId: number; status: "pending" | "surprise_in_progress" | "not_this_time" }) => {
      const url = buildUrl(api.wishes.updateStatus.path, { wishId });
      const validated = api.wishes.updateStatus.input.parse({ status });
      const res = await fetch(url, {
        method: api.wishes.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update wish status");
      }
      return parseWithLogging(api.wishes.updateStatus.responses[200], data, "wishes.updateStatus");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.questions.list.path] });
    },
  });
}
