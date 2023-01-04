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
  return !!localStorage.getItem('token') &&
    localStorage.getItem('token') !== 'null' &&
    localStorage.getItem('token') !== 'undefined'
    ? localStorage.getItem('token')
    : '';
};

export const getSavedIsRememberToken = (localStorage: Storage) => {
  return !!localStorage.getItem('isRememberToken') &&
    localStorage.getItem('isRememberToken') === 'true'
    ? 'true'
    : 'false';
};
