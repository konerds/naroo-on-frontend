import * as React from 'react';

export const useStringInput = (initialValue: string) => {
  const [value, setValue] = React.useState<string>(initialValue);
  return {
    value: value,
    setValue: setValue,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const { value } = e.target;
      setValue(value);
    },
  };
};

export const getSavedToken = (localStorage: Storage) => {
  const savedTokenInLocalStorage = localStorage.getItem('token');
  return !!savedTokenInLocalStorage &&
    savedTokenInLocalStorage !== 'null' &&
    savedTokenInLocalStorage !== 'undefined'
    ? savedTokenInLocalStorage
    : '';
};

export const getSavedIsRememberToken = (localStorage: Storage) => {
  return !!localStorage.getItem('isRememberToken') &&
    localStorage.getItem('isRememberToken') === 'true'
    ? 'true'
    : 'false';
};
