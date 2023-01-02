import * as React from 'react';

export const useInput = (initialValue: any) => {
  const [value, setValue] = React.useState(initialValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };
  return [value, onChange, setValue];
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
