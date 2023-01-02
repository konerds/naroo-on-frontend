import * as React from 'react';

interface ITokenContext {
  token: string | null;
  setToken: (v: string | null) => void;
  isRememberToken: string | null;
  setIsRememberToken: (v: string | null) => void;
}

const TokenContext = React.createContext<ITokenContext>({
  token: null,
  setToken: () => {},
  isRememberToken: null,
  setIsRememberToken: () => {},
});

interface PropsTokenContextProvider {
  children: React.ReactNode;
}

export const TokenContextProvider = ({
  children,
}: PropsTokenContextProvider) => {
  const [token, setToken] = React.useState<string | null>(null);
  const [isRememberToken, setIsRememberToken] = React.useState<string | null>(
    null,
  );
  return (
    <TokenContext.Provider
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
    </TokenContext.Provider>
  );
};

export default TokenContext;
