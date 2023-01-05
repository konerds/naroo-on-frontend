import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComponentHeader from './components/common/header/ComponentHeader';
import ComponentFooter from './components/common/ComponentFooter';
import PageMain from './pages/PageMain';
import PageSignin from './pages/PageSignin';
import PageSignup from './pages/PageSignup';
import PageDetailLecture from './pages/PageDetailLecture';
import PagePlayLecture from './pages/PagePlayLecture';
import PageAdmin from './pages/PageAdmin';
import PageProfile from './pages/PageProfile';
import PageInitPassword from './pages/PageInitPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContextToken, { ContextTokenProvider } from './store/ContextToken';
import { getSavedIsRememberToken, getSavedToken } from './hooks';
import MediaQuery from 'react-responsive';

const AppRouterWrapper: React.FC = () => {
  return (
    <div
      className={`${
        process.env.NODE_ENV !== 'production' ? 'debug-screens' : ''
      }`}
    >
      <ContextTokenProvider>
        <Router>
          <App />
        </Router>
        <MediaQuery maxWidth={639.98}>
          <ToastContainer
            limit={6}
            autoClose={1500}
            hideProgressBar={true}
            position="bottom-center"
          />
        </MediaQuery>
        <MediaQuery minWidth={640}>
          <ToastContainer limit={6} autoClose={1500} hideProgressBar={true} />
        </MediaQuery>
      </ContextTokenProvider>
    </div>
  );
};

const App: React.FC = () => {
  const tokenCtx = React.useContext(ContextToken);
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
      <div className="w-full min-h-[100px] h-[100px] max-h-[100px]">&nbsp;</div>
      <div className="w-full min-h-[calc(100vh-257px)] flex justify-center items-center">
        <Routes>
          <Route path="/" element={<PageMain />} />
          <Route path="/admin" element={<PageAdmin />} />
          <Route path="/signin" element={<PageSignin />} />
          <Route path="/signup" element={<PageSignup />} />
          <Route path="/verify/:requestToken" element={<PageMain />} />
          <Route path="/forgot" element={<PageInitPassword />} />
          <Route path="/myinfo" element={<PageProfile />} />
          <Route path="/lecture/:id" element={<PageDetailLecture />} />
          <Route path="/lecture-play/:id" element={<PagePlayLecture />} />
        </Routes>
      </div>
      <ComponentFooter />
    </>
  );
};

export default AppRouterWrapper;
