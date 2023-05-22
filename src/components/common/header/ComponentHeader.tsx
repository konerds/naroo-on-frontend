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
  const { token, setToken } = tokenCtx;
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
    setToken(null);
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
      className="header-container fixed left-0 right-0 z-[1000] min-h-[50px] max-w-[100vw] bg-white font-semibold text-gray-300 sm:min-h-[100px]"
    >
      <MediaQuery maxWidth={767.98}>
        <div className="mx-auto flex h-[50px] items-center justify-between sm:h-[100px] md:hidden">
          <div className="flex w-full items-center justify-center">
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
                className="mx-auto min-w-max rounded-[1px]"
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
                    className="ml-0 mr-[30px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#8dc556] text-xs font-semibold text-white sm:h-[40px] sm:w-[40px] sm:text-sm"
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
                  <button className="box-border h-[30px] w-[30px] rounded-[40px] border-[1px] border-[#DCDEE2] bg-white p-[5px] text-[0.625rem] font-semibold leading-[0.625rem] text-[#808695] sm:h-[41px] sm:w-[60px]">
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
                  <button className="ml-[8px] h-[30px] w-[30px] rounded-[40px] bg-[#8DC556] p-[5px] text-[0.625rem] font-semibold leading-[0.625rem] text-white sm:h-[41px] sm:w-[70px]">
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
                  className="ml-auto mr-[20px] flex items-center justify-center hover:opacity-50"
                  onClick={logoutHandler}
                >
                  로그아웃
                </button>
              )}
          </div>
        </div>
        {isVisibleMenu && (
          <div className="relative z-[999] box-border block min-w-full rounded-[10px] border-[1px] border-[#DCDEE2] bg-white">
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
              href="mailto:adr10won@gmail.com"
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
      <MediaQuery minWidth={768}>
        <div className="hidden md:mx-auto md:flex md:h-[100px] md:max-w-[788px] md:items-center md:justify-between lg:max-w-[966px] xl:max-w-[1152px]">
          <div className="flex items-center justify-between">
            {!!dataHeaderLogo && dataHeaderLogo.length > 0 && (
              <Link
                className="ml-[20px] mr-[45px] hover:opacity-50 lg:ml-0"
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
                <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#8dc556] font-semibold text-white hover:opacity-50">
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
                <button className="box-border h-[41px] rounded-[40px] border-[1px] border-[#DCDEE2] bg-white text-[0.875rem] font-semibold leading-[1.3125rem] text-[#808695] md:w-[84.48px] xl:w-[99px]">
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
                <button className="ml-[12px] h-[41px] rounded-[40px] bg-[#8DC556] text-[0.875rem] font-semibold leading-[1.3125rem] text-white md:w-[95.57px] xl:w-[112px]">
                  회원가입
                </button>
              </Link>
            </div>
          )}
          {!!token && !!dataGetMe && dataGetMe.role === 'admin' && (
            <button
              type="button"
              className="ml-auto mr-0 flex items-center justify-center hover:opacity-50"
              onClick={logoutHandler}
            >
              로그아웃
            </button>
          )}
        </div>
      </MediaQuery>
    </div>
  );
};

export default ComponentHeader;
