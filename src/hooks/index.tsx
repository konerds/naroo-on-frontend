import { useState, ChangeEvent } from 'react';
import { IStateToken } from '../interfaces';

export const useStringInput = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);
  return {
    value: value,
    setValue: setValue,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setValue(value);
    },
  };
};

const getParsedStateTokenInLocal = (localStorage: Storage) => {
  const rawStateTokenInLocal = localStorage.getItem('stateToken');
  if (rawStateTokenInLocal) {
    return JSON.parse(rawStateTokenInLocal) as IStateToken;
  } else {
    return undefined;
  }
};

export const getTokenSavedInLocal = (localStorage: Storage) => {
  const parsedStateTokenInLocal = getParsedStateTokenInLocal(localStorage);
  if (parsedStateTokenInLocal) {
    return parsedStateTokenInLocal.token;
  } else {
    return '';
  }
};

export const getIsRememberTokenSavedInLocal = (localStorage: Storage) => {
  const parsedStateTokenInLocal = getParsedStateTokenInLocal(localStorage);
  if (parsedStateTokenInLocal) {
    return parsedStateTokenInLocal.isRememberToken;
  } else {
    return '';
  }
};
