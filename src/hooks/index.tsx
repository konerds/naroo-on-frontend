import { ChangeEvent, useEffect, useState } from 'react';

export const useInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };

  return [value, onChange, setValue];
};

const isClient = typeof window === 'object';
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

export const useLocalStorage = <T,>(
  key: string,
  initialValue?: T,
  raw?: boolean,
): [T, Dispatch<SetStateAction<T>>] => {
  if (!isClient) {
    return [initialValue as T, () => null];
  }
  const [state, setState] = useState<T>(() => {
    try {
      const localStorageValue = localStorage.getItem(key);
      if (typeof localStorageValue !== 'string') {
        localStorage.setItem(
          key,
          raw ? String(initialValue) : JSON.stringify(initialValue),
        );
        return initialValue;
      } else {
        return raw
          ? localStorageValue
          : JSON.parse(localStorageValue || 'null');
      }
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      const serializedState = raw ? String(state) : JSON.stringify(state);
      state && localStorage.setItem(key, serializedState);
    } catch {}
  }, [state]);
  return [state, setState];
};
