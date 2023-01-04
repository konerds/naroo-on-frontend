import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import useImmutableSWR from 'swr/immutable';
import { IInfoMe, IResourceContent } from '../../../interfaces';
import ComponentEllipsisHeader from './ComponentEllipsisHeader';
import { axiosGetfetcher } from '../../../hooks/api';
import ContextToken from '../../../store/ContextToken';
import MediaQuery from 'react-responsive';

const ComponentHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tokenCtx = React.useContext(ContextToken);
  const { token, setToken } = tokenCtx;
  const [isVisibleEllipsis, setIsVisibleEllipsis] =
    React.useState<boolean>(false);
  const [isVisibleMenu, setIsVisibleMenu] = React.useState<boolean>(false);
  const refElementHeader = React.useRef<HTMLDivElement | null>(null);
  const refElementEllipsis = React.useRef<HTMLButtonElement | null>(null);
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: dataHeaderLogo } = useImmutableSWR<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/header_logo`,
    () =>
      axiosGetfetcher(
        `${process.env.REACT_APP_BACK_URL}/resource/header_logo`,
        token,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const handlerOnMousePositionHeader = (event: any) => {
    if (
      isVisibleMenu &&
      (!!!refElementHeader.current ||
        !refElementHeader.current.contains(event.target))
    ) {
      setIsVisibleMenu(false);
    }
  };
  const handlerOnMousePositionEllipsis = (event: any) => {
    if (
      isVisibleEllipsis &&
      (!!!refElementEllipsis.current ||
        refElementEllipsis.current !== event.target)
    ) {
      setIsVisibleEllipsis(false);
    }
  };
  const logoutHandler = () => {
    setToken('');
    navigate(0);
  };
  React.useEffect(() => {
    window.addEventListener('click', handlerOnMousePositionHeader);
    return () =>
      window.removeEventListener('click', handlerOnMousePositionHeader);
  }, [isVisibleMenu]);
  React.useEffect(() => {
    window.addEventListener('click', handlerOnMousePositionEllipsis);
    return () =>
      window.removeEventListener('click', handlerOnMousePositionEllipsis);
  }, [isVisibleEllipsis]);
  return (
    <div
      ref={refElementHeader}
      className="fixed z-[1000] bg-white left-0 right-0 min-h-[100px] font-semibold text-gray-300 header-container"
    >
      <MediaQuery minWidth={768}>
        <div className="xl:max-w-[1152px] lg:max-w-[864px] md:max-w-[680px] md:flex hidden h-[100px] mx-auto justify-center items-center">
          <div className="flex items-center">
            {!!dataHeaderLogo && dataHeaderLogo.length > 0 && (
              <Link to="/">
                <img
                  className="xl:mr-[80px] lg:mr-[47px] md:mr-[40px] mr-[20px]"
                  src={dataHeaderLogo[0].content}
                  width="110.24"
                  alt="Logo"
                />
              </Link>
            )}
            <div className="flex flex-nowrap">
              {!(
                !!token &&
                !!dataGetMe &&
                !!!errorGetMe &&
                dataGetMe.role === 'admin'
              ) && (
                <>
                  <Link to="/">
                    <button
                      className={`mr-[42px] text-[20px] leading-[150%] font-semibold ${
                        location.pathname === '/'
                          ? 'text-[#8DC556]'
                          : 'text-[#515A6E]'
                      }`}
                    >
                      강의
                    </button>
                  </Link>
                  <a href="mailto:mpnaroo@naver.com">
                    <button className="text-[20px] leading-[150%] font-semibold text-[#515A6E]">
                      문의하기
                    </button>
                  </a>
                </>
              )}
            </div>
          </div>
          <div>
            {!!token &&
              !!dataGetMe &&
              !!!errorGetMe &&
              !!dataGetMe.nickname &&
              dataGetMe.role === 'student' && (
                <div
                  className="xl:ml-[766px] lg:ml-[512px] md:ml-[334px]"
                  onMouseEnter={() => setIsVisibleEllipsis(true)}
                  onMouseLeave={() => setIsVisibleEllipsis(false)}
                >
                  <button className="rounded-full w-[40px] h-[40px] flex items-center justify-center bg-[#8dc556] leading-[150%] text-white font-semibold">
                    {dataGetMe.nickname.charAt(0)}
                  </button>
                  {isVisibleEllipsis && (
                    <div className="fixed z-[999] min-w-max">
                      <ComponentEllipsisHeader logoutHandler={logoutHandler} />
                    </div>
                  )}
                </div>
              )}
            {!(!!token && !!dataGetMe && !!!errorGetMe) && (
              <div className="xl:ml-[586px] lg:ml-[360px] md:ml-[230px]">
                <Link to="/signin">
                  <button className="bg-white text-[14px] leading-[21px] font-semibold text-[#808695] border-[1px] border-[#DCDEE2] box-border rounded-[40px] h-[41px] xl:w-[99px] lg:w-[84.48px] md:w-[63.36px]">
                    로그인
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="ml-[12px] text-[14px] leading-[21px] font-semibold text-white bg-[#8DC556] rounded-[40px] h-[41px] xl:w-[112px] lg:w-[95.57px] md:w-[71.68px]">
                    회원가입
                  </button>
                </Link>
              </div>
            )}
            {!!token &&
              !!dataGetMe &&
              !!!errorGetMe &&
              dataGetMe.role === 'admin' && (
                <button
                  type="button"
                  className="flex justify-center items-center w-max xl:ml-[800px] lg:ml-[550px] md:ml-[400px]"
                  onClick={logoutHandler}
                >
                  로그아웃
                </button>
              )}
          </div>
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={767.98}>
        <div className="flex items-center justify-between h-[100px] mx-auto md:hidden">
          <div className="flex items-center justify-center w-full">
            <Link to="/">
              {!!dataHeaderLogo && dataHeaderLogo.length > 0 && (
                <img
                  src={dataHeaderLogo[0].content}
                  width="110.24"
                  alt="Logo"
                />
              )}
            </Link>
            {!(
              !!token &&
              !!dataGetMe &&
              !!!errorGetMe &&
              !!dataGetMe.nickname &&
              dataGetMe.role === 'admin'
            ) && (
              <button
                type="button"
                className={`rounded-[1px] min-w-max ${
                  !!!token
                    ? 'sm:mx-[112px] xs:mx-[63px]'
                    : !!token &&
                      !!dataGetMe &&
                      !!!errorGetMe &&
                      dataGetMe.role === 'student'
                    ? 'sm:mx-[165px] xs:mx-[115px]'
                    : ''
                }`}
                onClick={() => setIsVisibleMenu(!isVisibleMenu)}
              >
                메뉴
              </button>
            )}
            {!!token &&
              !!dataGetMe &&
              !!!errorGetMe &&
              !!dataGetMe.nickname &&
              dataGetMe.role === 'student' && (
                <>
                  <button
                    ref={refElementEllipsis}
                    className="rounded-full w-[40px] h-[40px] flex items-center justify-center bg-[#8dc556] leading-[150%] text-white font-semibold"
                    onClick={() => {
                      setIsVisibleMenu(false);
                      setIsVisibleEllipsis(!isVisibleEllipsis);
                    }}
                  >
                    {dataGetMe.nickname.charAt(0)}
                  </button>
                  {isVisibleEllipsis && (
                    <div className="relative top-[20px] z-[999] min-w-max">
                      <ComponentEllipsisHeader logoutHandler={logoutHandler} />
                    </div>
                  )}
                </>
              )}
            {(!!!token || (!!token && !!!dataGetMe && !!errorGetMe)) && (
              <div>
                <Link to="/signin">
                  <button className="bg-white text-[10px] leading-[10px] font-semibold text-[#808695] border-[1px] border-[#DCDEE2] box-border rounded-[40px] w-[60px] h-[41px]">
                    로그인
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="ml-[12px] text-[10px] leading-[10px] font-semibold text-white bg-[#8DC556] rounded-[40px] w-[70px] h-[41px]">
                    회원가입
                  </button>
                </Link>
              </div>
            )}
            {!!token &&
              !!dataGetMe &&
              !!!errorGetMe &&
              !!dataGetMe.nickname &&
              dataGetMe.role === 'admin' && (
                <button
                  className="flex items-center justify-center ml-[50%]"
                  onClick={logoutHandler}
                >
                  로그아웃
                </button>
              )}
          </div>
        </div>
        {isVisibleMenu && (
          <div className="block relative border-[1px] border-[#DCDEE2] box-border rounded-[10px] bg-white min-w-full z-[999]">
            <Link to="/">
              <button
                className={`block w-full px-[10px] py-[10px] ${
                  location.pathname === '/'
                    ? 'text-[#8DC556]'
                    : 'text-[#515A6E]'
                }`}
              >
                강의
              </button>
            </Link>
            <a href="mailto:mpnaroo@naver.com">
              <button className="block w-full px-[10px] py-[10px]">
                문의하기
              </button>
            </a>
          </div>
        )}
      </MediaQuery>
    </div>
  );
};

export default ComponentHeader;
