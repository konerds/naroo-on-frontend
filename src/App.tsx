import * as React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
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
import { ContextTokenProvider } from './store/ContextToken';
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
        <MediaQuery maxWidth={419.99}>
          <ToastContainer
            limit={6}
            autoClose={1500}
            hideProgressBar={true}
            position="bottom-center"
          />
        </MediaQuery>
        <MediaQuery minWidth={420}>
          <ToastContainer limit={6} autoClose={1500} hideProgressBar={true} />
        </MediaQuery>
      </ContextTokenProvider>
    </div>
  );
};

const App: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <ComponentHeader />
      <div className="w-full min-h-[50px] h-[50px] max-h-[50px] sm:min-h-[100px] sm:h-[100px] sm:max-h-[100px]">
        &nbsp;
      </div>
      <div className="w-full min-h-[calc(100vh-207px)] md:min-h-[calc(100vh-257px)] flex justify-center items-center">
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ComponentFooter />
    </>
  );
};

export default AppRouterWrapper;
