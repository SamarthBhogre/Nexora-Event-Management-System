import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { apiClient } from '@services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError) => void;
}

export const useApi = <T = any,>(options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (
      method: 'get' | 'post' | 'put' | 'delete' | 'patch',
      url: string,
      data?: any,
      config?: any
    ) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiClient[method]<T>(url, data || undefined, config);
        const result = response.data.data ?? null;

        setState({ data: result, loading: false, error: null });
        if (result !== null) {
          options?.onSuccess?.(result);
        }

        return result;
      } catch (error) {
        const axiosError = error as AxiosError;
        setState({ data: null, loading: false, error: axiosError });
        options?.onError?.(axiosError);

        throw axiosError;
      }
    },
    [options]
  );

  const get = useCallback(
    (url: string, config?: any) => request('get', url, undefined, config),
    [request]
  );

  const post = useCallback(
    (url: string, data?: any, config?: any) => request('post', url, data, config),
    [request]
  );

  const put = useCallback(
    (url: string, data?: any, config?: any) => request('put', url, data, config),
    [request]
  );

  const deleteRequest = useCallback(
    (url: string, config?: any) => request('delete', url, undefined, config),
    [request]
  );

  const patch = useCallback(
    (url: string, data?: any, config?: any) => request('patch', url, data, config),
    [request]
  );

  return {
    ...state,
    get,
    post,
    put,
    delete: deleteRequest,
    patch,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
};
