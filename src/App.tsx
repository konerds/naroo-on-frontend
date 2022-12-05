import { useCallback, useState } from 'react';
import { FC, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  Redirect,
} from 'react-router-dom';
import Footer from './components/common/Footer';
import Header from './components/common/header/Header';
import { useLocalStorage } from './hooks';
import { getMe } from './hooks/api';
import MainLayout from './pages/MainLayout';
import SigninLayout from './pages/SigninLayout';
import SignupLayout from './pages/SignupLayout';
import LetcureDetailLayout from './pages/LectureDetailLayout';
import LecturePlayLayout from './pages/LecturePlayLayout';
import AdminLayout from './pages/AdminLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyInfoLayout from './pages/MyInfoLayout';
import InitPasswordLayout from './pages/InitPasswordLayout';
import dotenv from 'dotenv';
dotenv.config();

const AppRouterWrapper: FC = () => {
  return (
    <div
      className={`${
        process.env.NODE_ENV !== 'production' ? 'debug-screens' : ''
      }`}
    >
      <Router>
        <App />
      </Router>
      <ToastContainer />
    </div>
  );
};

const App: FC = () => {
  const history = useHistory();
  const [userType, setUserType] = useState<string | null>(null);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [rememberToken, setRememeberToken] = useLocalStorage<string | null>(
    'rememberToken',
    localStorage.getItem('rememberToken') === 'true' ? 'true' : 'false',
    true,
  );
  const [token, setToken] = useLocalStorage<string | null>(
    'token',
    localStorage.getItem('token') && localStorage.getItem('token') !== 'null'
      ? localStorage.getItem('token')
      : '',
    true,
  );
  const checkMe = (token: string | null) => {
    getMe(token)
      .then((me) => {
        if (me) {
          setUserType(me.role ? me.role : null);
          setUserNickname(me.nickname ? me.nickname : null);
        }
      })
      .catch((error) => {
        setToken('');
        localStorage.setItem('token', '');
        setUserType(null);
        setUserNickname(null);
        history.replace('/');
      });
  };
  useEffect(() => {
    if (token !== null && token !== '') {
      checkMe(token);
    }
  }, [token]);
  const tokenStorageWatcher = useCallback(
    (e: StorageEvent) => {
      setToken(e.newValue ? e.newValue : '');
      localStorage.setItem('token', e.newValue ? e.newValue : '');
      checkMe(e.newValue);
    },
    [token],
  );
  const clearTokenHandler = () => {
    localStorage.getItem('rememberToken') === 'false'
      ? localStorage.setItem('token', '')
      : null;
  };
  useEffect(() => {
    window.addEventListener('storage', tokenStorageWatcher);
    window.addEventListener('unload', clearTokenHandler);
    return () => {
      window.removeEventListener('storage', tokenStorageWatcher);
      window.removeEventListener('unload', clearTokenHandler);
    };
  }, []);
  return (
    <>
      <Header
        token={token}
        setToken={setToken}
        setRememberToken={setRememeberToken}
        userType={userType}
        setUserType={setUserType}
        setUserNickname={setUserNickname}
        nickname={userNickname}
      />
      <Switch>
        <Route
          exact
          path="/"
          render={() =>
            token !== null && token !== '' ? (
              userType === 'admin' ? (
                <AdminLayout token={token} setToken={setToken} />
              ) : (
                <MainLayout
                  token={token}
                  setToken={setToken}
                  requestToken={null}
                />
              )
            ) : (
              <MainLayout
                token={token}
                setToken={setToken}
                requestToken={null}
              />
            )
          }
        />
        <Route
          path="/signin"
          render={() => (
            <SigninLayout
              token={token}
              setToken={setToken}
              rememberToken={rememberToken}
              setRememberToken={setRememeberToken}
            />
          )}
        />
        <Route
          path="/signup"
          render={() => <SignupLayout token={token} setToken={setToken} />}
        />
        <Route
          path="/verify/:requestToken"
          render={(props) => {
            return (
              <MainLayout
                token={token}
                setToken={setToken}
                requestToken={props.match.params.requestToken}
              />
            );
          }}
        />
        <Route
          path="/forgot"
          render={() => (
            <InitPasswordLayout token={token} setToken={setToken} />
          )}
        />
        <Route
          path="/myinfo"
          render={() =>
            token !== '' ? (
              userType === 'admin' ? (
                <Redirect to="/" />
              ) : (
                <MyInfoLayout token={token} setToken={setToken} />
              )
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route
          path="/lecture/:id"
          render={() => (
            <LetcureDetailLayout
              token={token}
              setToken={setToken}
              userType={userType}
              userNickname={userNickname}
            />
          )}
        />
        <Route
          path="/lecture-play/:id"
          render={() =>
            userType === 'admin' ? (
              <Redirect to="/" />
            ) : (
              <LecturePlayLayout token={token} setToken={setToken} />
            )
          }
        />
      </Switch>
      <Footer />
    </>
  );
};

export default AppRouterWrapper;
