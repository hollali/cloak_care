"use client";

import { useEffect, useRef, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { saveDraft, getDraft, deleteDraft } from "@/lib/actions/draft.actions";

const DRAFT_PREFIX = "cloak_care_draft_";

function getLocalDraftKey(key: string): string {
  return `${DRAFT_PREFIX}${key}`;
}

function loadLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(getLocalDraftKey(key));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocal(key: string, data: unknown) {
  try {
    localStorage.setItem(getLocalDraftKey(key), JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

function clearLocal(key: string) {
  try {
    localStorage.removeItem(getLocalDraftKey(key));
  } catch {
    // ignore
  }
}

export function useFormDraft<T extends Record<string, unknown>>(
  key: string,
  form: UseFormReturn<T>,
  options?: {
    userId?: string;
    debounceMs?: number;
    excludeFields?: (keyof T)[];
  }
) {
  const { userId, debounceMs = 1500, excludeFields = [] } = options || {};
  const savedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  // Restore on mount
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    const restore = async () => {
      let draft: Record<string, unknown> | null = null;

      // Try server first if userId is available
      if (userId) {
        const serverDraft = await getDraft(userId);
        if (serverDraft) {
          draft = serverDraft.data as Record<string, unknown>;
        }
      }

      // Fall back to localStorage
      if (!draft) {
        draft = loadLocal<Record<string, unknown>>(key);
      }

      if (draft) {
        const values = form.getValues();
        const restored: Record<string, unknown> = {};
        for (const [field, value] of Object.entries(draft)) {
          if (
            !(excludeFields as string[]).includes(field) &&
            value !== undefined &&
            value !== null
          ) {
            restored[field] = value;
          }
        }
        if (Object.keys(restored).length > 0) {
          form.reset({ ...values, ...restored } as any);
        }
      }
    };

    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Save draft on form values change (debounced)
  const values = form.watch();

  const doSave = useCallback(
    async (currentValues: T) => {
      const serialized: Record<string, unknown> = {};
      for (const [field, value] of Object.entries(currentValues as Record<string, unknown>)) {
        if ((excludeFields as string[]).includes(field)) continue;
        if (value instanceof Date) {
          serialized[field] = value.toISOString();
        } else if (value instanceof File || value instanceof FileList || value === undefined) {
          continue;
        } else {
          serialized[field] = value;
        }
      }

      saveLocal(key, serialized);

      if (userIdRef.current) {
        await saveDraft(userIdRef.current, serialized);
      }
    },
    [key, excludeFields]
  );

  useEffect(() => {
    if (!values) return;
    // Debounce: wait for user to stop typing
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      doSave(values);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [values, debounceMs, doSave]);

  const clearDraft = useCallback(async () => {
    clearLocal(key);
    if (userIdRef.current) {
      await deleteDraft(userIdRef.current);
    }
  }, [key]);

  return { clearDraft };
}
