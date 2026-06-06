"use client";

import * as React from "react";

import { messageForApiError } from "./errors";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export function useApiResource<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = [],
  initialData: T | null = null,
): AsyncState<T> {
  const [data, setData] = React.useState<T | null>(initialData);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // The dependency list is passed by domain hooks so callers can bind it to query state.
  const reload = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await loader());
    } catch (err) {
      setError(messageForApiError(err));
    } finally {
      setLoading(false);
    }
  }, deps);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload };
}

export function useMutation<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const mutate = React.useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        return await action(...args);
      } catch (err) {
        const message = messageForApiError(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  return { mutate, loading, error };
}
