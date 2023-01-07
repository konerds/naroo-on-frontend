import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import useImmutableSWR from 'swr/immutable';
import { IInfoMe, IResourceContent } from '../../../interfaces';
import ComponentEllipsisHeader from './ComponentEllipsisHeader';
import { axiosGetfetcher } from '../../../hooks/api';
import ContextToken from '../../../store/ContextToken';
import MediaQuery from 'react-responsive';
import {
  faArrowRightToBracket,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ComponentHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tokenCtx = React.useContext(ContextToken);
  const { token } = tokenCtx;
  const [isVisibleEllipsis, setIsVisibleEllipsis] =
    React.useState<boolean>(false);
  const [isVisibleMenu, setIsVisibleMenu] = React.useState<boolean>(false);
  const refElementHeader = React.useRef<HTMLDivElement | null>(null);
  const refElementEllipsis = React.useRef<HTMLButtonElement | null>(null);
  const { data: dataGetMe } = useSWR<IInfoMe>(
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
    localStorage.setItem('token', '');
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
      className="max-w-[100vw] fixed z-[1000] bg-white left-0 right-0 min-h-[50px] sm:min-h-[100px] font-semibold text-gray-300 header-container"
    >
      <MediaQuery minWidth={768}>
        <div className="hidden md:h-[100px] md:mx-auto md:flex md:justify-between md:items-center md:max-w-[788px] lg:max-w-[966px] xl:max-w-[1152px]">
          <div className="flex justify-between items-center">
            {!!dataHeaderLogo && dataHeaderLogo.length > 0 && (
              <Link
                className="ml-[20px] lg:ml-0 mr-[45px] hover:opacity-50"
                to="/"
                onClick={() => {
                  setIsVisibleMenu(false);
                }}
              >
                <img
                  src={dataHeaderLogo[0].content}
                  width="110.24"
                  alt="Logo"
                />
              </Link>
            )}
            <div className="flex flex-nowrap">
              {!(!!token && !!dataGetMe && dataGetMe.role === 'admin') && (
                <>
                  <Link
                    to="/"
                    onClick={(event) => {
                      setIsVisibleMenu(false);
                    }}
                  >
                    <button
                      className={`mr-[42px] text-[1.25rem] font-semibold  hover:opacity-50 ${
                        location.pathname === '/'
                          ? 'text-[#8DC556]'
                          : 'text-[#515A6E]'
                      }`}
                    >
                      강의
                    </button>
                  </Link>
                  <a
                    className="hover:opacity-50"
                    href="mailto:mpnaroo@naver.com"
                    onClick={(event) => {
                      setIsVisibleMenu(false);
                    }}
                  >
                    <button className="text-[1.25rem] font-semibold text-[#515A6E]">
                      문의하기
                    </button>
                  </a>
                </>
              )}
            </div>
          </div>
          {!!token &&
            !!dataGetMe &&
            !!dataGetMe.nickname &&
            dataGetMe.role === 'student' && (
              <div
                className="ml-auto md:mr-[30px] lg:mr-[10px]"
                onMouseEnter={() => setIsVisibleEllipsis(true)}
                onMouseLeave={() => setIsVisibleEllipsis(false)}
              >
                <button className="rounded-full w-[40px] h-[40px] flex items-center justify-center bg-[#8dc556] text-white font-semibold hover:opacity-50">
                  {dataGetMe.nickname.charAt(0)}
                </button>
                {isVisibleEllipsis && (
                  <div className="fixed z-[999] min-w-max">
                    <ComponentEllipsisHeader
                      logoutHandler={logoutHandler}
                      setIsVisibleMenu={setIsVisibleMenu}
                    />
                  </div>
                )}
              </div>
            )}
          {!(!!token && !!dataGetMe) && (
            <div className="ml-auto md:mr-[30px] lg:mr-[10px]">
              <Link
                className="hover:opacity-50"
                to="/signin"
                onClick={() => {
                  setIsVisibleMenu(false);
                }}
              >
                <button className="bg-white text-[0.875rem] leading-[1.3125rem] font-semibold text-[#808695] border-[1px] border-[#DCDEE2] box-border rounded-[40px] h-[41px] md:w-[84.48px] xl:w-[99px]">
                  로그인
                </button>
              </Link>
              <Link
                className="hover:opacity-50"
                to="/signup"
                onClick={() => {
                  setIsVisibleMenu(false);
                }}
              >
                <button className="ml-[12px] text-[0.875rem] leading-[1.3125rem] font-semibold text-white bg-[#8DC556] rounded-[40px] h-[41px] md:w-[95.57px] xl:w-[112px]">
                  회원가입
                </button>
              </Link>
            </div>
          )}
          {!!token && !!dataGetMe && dataGetMe.role === 'admin' && (
            <button
              type="button"
              className="ml-auto mr-0 flex justify-center items-center hover:opacity-50"
              onClick={logoutHandler}
            >
              로그아웃
            </button>
          )}
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={767.98}>
        <div className="flex items-center justify-between h-[50px] sm:h-[100px] mx-auto md:hidden">
          <div className="flex items-center justify-center w-full">
            <Link
              className="ml-[20px] mr-0 hover:opacity-50"
              to="/"
              onClick={() => {
                setIsVisibleMenu(false);
              }}
            >
              {!!dataHeaderLogo && dataHeaderLogo.length > 0 && (
                <img
                  className="w-[60px] sm:w-[110.24px]"
                  src={dataHeaderLogo[0].content}
                  width="110.24"
                  alt="Logo"
                />
              )}
            </Link>
            {!(
              !!token &&
              !!dataGetMe &&
              !!dataGetMe.nickname &&
              dataGetMe.role === 'admin'
            ) && (
              <button
                type="button"
                className="rounded-[1px] min-w-max mx-auto"
                onClick={() => setIsVisibleMenu(!isVisibleMenu)}
              >
                메뉴
              </button>
            )}
            {!!token &&
              !!dataGetMe &&
              !!dataGetMe.nickname &&
              dataGetMe.role === 'student' && (
                <>
                  <button
                    ref={refElementEllipsis}
                    className="ml-0 mr-[30px] rounded-full text-xs sm:text-sm w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] flex items-center justify-center bg-[#8dc556] text-white font-semibold"
                    onClick={() => {
                      setIsVisibleMenu(false);
                      setIsVisibleEllipsis(!isVisibleEllipsis);
                    }}
                  >
                    {dataGetMe.nickname.charAt(0)}
                  </button>
                  {isVisibleEllipsis && (
                    <div className="relative top-[20px] right-[30px] z-[999] min-w-max">
                      <ComponentEllipsisHeader
                        logoutHandler={logoutHandler}
                        setIsVisibleMenu={setIsVisibleMenu}
                      />
                    </div>
                  )}
                </>
              )}
            {(!!!token || (!!token && !!!dataGetMe)) && (
              <div className="mr-[10px]">
                <Link
                  to="/signin"
                  onClick={() => {
                    setIsVisibleMenu(false);
                  }}
                >
                  <button className="bg-white text-[0.625rem] leading-[0.625rem] font-semibold text-[#808695] border-[1px] border-[#DCDEE2] box-border rounded-[40px] w-[30px] h-[30px] sm:w-[60px] sm:h-[41px] p-[5px]">
                    <MediaQuery maxWidth={639.98}>
                      <FontAwesomeIcon
                        className="text-[0.7rem]"
                        icon={faArrowRightToBracket}
                      />
                    </MediaQuery>
                    <MediaQuery minWidth={640}>로그인</MediaQuery>
                  </button>
                </Link>
                <Link
                  className="ml-auto mr-[20px]"
                  to="/signup"
                  onClick={() => {
                    setIsVisibleMenu(false);
                  }}
                >
                  <button className="ml-[8px] text-[0.625rem] leading-[0.625rem] font-semibold text-white bg-[#8DC556] rounded-[40px] w-[30px] h-[30px] sm:w-[70px] sm:h-[41px] p-[5px]">
                    <MediaQuery maxWidth={639.98}>
                      <FontAwesomeIcon
                        className="text-[0.7rem]"
                        icon={faUserPlus}
                      />
                    </MediaQuery>
                    <MediaQuery minWidth={640}>회원가입</MediaQuery>
                  </button>
                </Link>
              </div>
            )}
            {!!token &&
              !!dataGetMe &&
              !!dataGetMe.nickname &&
              dataGetMe.role === 'admin' && (
                <button
                  className="flex items-center justify-center ml-auto mr-[20px] hover:opacity-50"
                  onClick={logoutHandler}
                >
                  로그아웃
                </button>
              )}
          </div>
        </div>
        {isVisibleMenu && (
          <div className="block relative border-[1px] border-[#DCDEE2] box-border rounded-[10px] bg-white min-w-full z-[999]">
            <Link
              to="/"
              onClick={(event) => {
                setIsVisibleMenu(false);
              }}
            >
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
            <a
              href="mailto:mpnaroo@naver.com"
              onClick={(event) => {
                setIsVisibleMenu(false);
              }}
            >
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
