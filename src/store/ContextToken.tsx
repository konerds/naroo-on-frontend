import * as React from 'react';
import { getSavedIsRememberToken, getSavedToken } from '../hooks';

interface IContextToken {
  token: string | null;
  setToken: (v: string | null) => void;
  isRememberToken: string | null;
  setIsRememberToken: (v: string | null) => void;
}

const ContextToken = React.createContext<IContextToken>({
  token: null,
  setToken: () => {},
  isRememberToken: null,
  setIsRememberToken: () => {},
});

interface PropsContextTokenProvider {
  children: React.ReactNode;
}

export const ContextTokenProvider = ({
  children,
}: PropsContextTokenProvider) => {
  const savedIsRememberTokenInLocalStorage =
    getSavedIsRememberToken(localStorage);
  const [isRememberToken, setIsRememberToken] = React.useState<string | null>(
    savedIsRememberTokenInLocalStorage === 'true' ? 'true' : '',
  );
  const [token, setToken] = React.useState<string | null>(
    savedIsRememberTokenInLocalStorage === 'true'
      ? getSavedToken(localStorage)
      : '',
  );
  return (
    <ContextToken.Provider
      value={{
        token: token,
        setToken: (v) => {
          setToken(v);
        },
        isRememberToken,
        setIsRememberToken: (v) => {
          setIsRememberToken(v);
        },
      }}
    >
      {children}
    </ContextToken.Provider>
  );
};

export default ContextToken;
