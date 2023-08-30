import { FC, useEffect } from 'react';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
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
import MediaQuery from 'react-responsive';
import stateIsRemeberToken from './recoil/state-object-token/stateIsRemeberToken';
import stateToken from './recoil/state-object-token/stateToken';

const AppRouterWrapper: FC = () => {
  return (
    <div
      className={`${
        process.env.NODE_ENV !== 'production' ? 'debug-screens' : ''
      }`}
    >
      <RecoilRoot>
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
      </RecoilRoot>
    </div>
  );
};

const App: FC = () => {
  const { pathname } = useLocation();
  const isRememberToken = useRecoilValue(stateIsRemeberToken);
  const setToken = useSetRecoilState(stateToken);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    if (!isRememberToken) {
      setToken('');
    }
  }, []);
  return (
    <>
      <ComponentHeader />
      <div className="h-[50px] max-h-[50px] min-h-[50px] w-full sm:h-[100px] sm:max-h-[100px] sm:min-h-[100px]">
        &nbsp;
      </div>
      <div className="flex min-h-[calc(100vh-207px)] w-full items-center justify-center md:min-h-[calc(100vh-257px)]">
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
