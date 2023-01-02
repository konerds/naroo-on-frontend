import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComponentHeader from './components/common/header/Header';
import ComponentFooter from './components/common/Footer';
import MainLayout from './pages/PageMain';
import SigninLayout from './pages/PageSignin';
import SignupLayout from './pages/PageSignup';
import LetcureDetailLayout from './pages/PageLectureDetail';
import LecturePlayLayout from './pages/PageLecturePlay';
import PageAdmin from './pages/PageAdmin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyInfoLayout from './pages/PageProfile';
import PageInitPassword from './pages/PageInitPassword';
import TokenContext, { TokenContextProvider } from './store/TokenContext';
import { getSavedIsRememberToken, getSavedToken } from './hooks';

const AppRouterWrapper: React.FC = () => {
  return (
    <div
      className={`${
        process.env.NODE_ENV !== 'production' ? 'debug-screens' : ''
      }`}
    >
      <TokenContextProvider>
        <Router>
          <App />
        </Router>
        <ToastContainer limit={6} autoClose={500} hideProgressBar={true} />
      </TokenContextProvider>
    </div>
  );
};

const App: React.FC = () => {
  const tokenCtx = React.useContext(TokenContext);
  const { token, setToken, isRememberToken, setIsRememberToken } = tokenCtx;
  React.useEffect(() => {
    const savedIsRememberToken = getSavedIsRememberToken(localStorage);
    setIsRememberToken(savedIsRememberToken);
    if (savedIsRememberToken === 'true') {
      setToken(getSavedToken(localStorage));
    }
  }, []);
  React.useEffect(() => {
    localStorage.setItem(
      'token',
      !!token && token !== 'undefined' && token !== 'null' ? token : '',
    );
  }, [token]);
  React.useEffect(() => {
    localStorage.setItem(
      'isRememberToken',
      isRememberToken === 'false' ? 'false' : 'true',
    );
  }, [isRememberToken]);
  return (
    <>
      <ComponentHeader />
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/admin" element={<PageAdmin />} />
        <Route path="/signin" element={<SigninLayout />} />
        <Route path="/signup" element={<SignupLayout />} />
        <Route path="/verify/:requestToken" element={<MainLayout />} />
        <Route path="/forgot" element={<PageInitPassword />} />
        <Route path="/myinfo" element={<MyInfoLayout />} />
        <Route path="/lecture/:id" element={<LetcureDetailLayout />} />
        <Route path="/lecture-play/:id" element={<LecturePlayLayout />} />
      </Routes>
      <ComponentFooter />
    </>
  );
};

export default AppRouterWrapper;
