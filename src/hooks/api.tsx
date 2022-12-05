import axios from 'axios';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { MutatorCallback } from 'swr/dist/types';

export interface DataResponse<T> {
  data: T | undefined;
  mutate: (
    data?: T | Promise<T> | MutatorCallback<T> | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<T | undefined>;
  error: any;
}

export function tokenHeader(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function useGetSWR<T>(
  requestUrl: string,
  token: string | null,
  showError: boolean,
): DataResponse<T> {
  const fetcher = async (url: string) => {
    try {
      const response = token
        ? await axios.get(url, tokenHeader(token))
        : await axios.get(url);
      return response.data;
    } catch (error: any) {
      if (showError) {
        const messages = error.response?.data?.message;
        if (Array.isArray(messages)) {
          messages.map((message) => {
            toast.error(message);
          });
        } else {
          toast.error(messages);
        }
      }
      if (url.includes('admin')) {
        window.location.replace('/signin');
      }
      throw error;
    }
  };
  const { data, mutate, error } = useSWR<T>(requestUrl, fetcher);
  return { data, mutate, error };
}

export async function getMe(token: string | null) {
  if (token === null) {
    return null;
  }
  const response = await axios.get(
    `${process.env.REACT_APP_BACK_URL}/user/me`,
    tokenHeader(token),
  );
  if (response.status === 200) {
    const { userId, role, nickname } = response.data;
    return { userId, role, nickname };
  } else {
    return null;
  }
}
