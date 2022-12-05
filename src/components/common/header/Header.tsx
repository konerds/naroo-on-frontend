import { Dispatch, SetStateAction, useEffect } from 'react';
import { useRef, useState } from 'react';
import { FC } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useGetSWR } from '../../../hooks/api';
import { IResourceContent } from '../../../interfaces';
import Ellipsis from './Ellipsis';

interface HeaderProps {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  setRememberToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  nickname: string | null;
  userType: string | null;
  setUserType: Dispatch<SetStateAction<string | null>>;
  setUserNickname: Dispatch<SetStateAction<string | null>>;
}

const Header: FC<HeaderProps> = ({
  token,
  setToken,
  setRememberToken,
  nickname,
  userType,
  setUserType,
  setUserNickname,
}) => {
  const history = useHistory();
  const location = useLocation();
  const { data: headerLogo } = useGetSWR<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/header_logo`,
    null,
    false,
  );
  const logoutHandler = () => {
    setToken('');
    localStorage.setItem('token', '');
    setUserType('');
    setUserNickname('');
    history.go(0);
  };
  const [isVisibleEllipsis, setIsVisibleEllipsis] = useState<boolean>(false);
  const [isVisibleMenu, setIsVisibleMenu] = useState<boolean>(false);
  const menuElementRef = useRef<HTMLDivElement | null>(null);
  const menuPositionHandler = (event: any) => {
    if (
      isVisibleMenu &&
      (!menuElementRef.current || !menuElementRef.current !== event.target)
    ) {
      setIsVisibleMenu(false);
    }
  };
  const ellipsisElementRef = useRef<HTMLDivElement | null>(null);
  const ellipsisPositionHandler = (event: any) => {
    if (
      isVisibleEllipsis &&
      (!ellipsisElementRef.current ||
        !ellipsisElementRef.current !== event.target)
    ) {
      setIsVisibleEllipsis(false);
    }
  };
  useEffect(() => {
    window.addEventListener('click', menuPositionHandler);
    return () => window.removeEventListener('click', menuPositionHandler);
  }, [isVisibleMenu]);
  useEffect(() => {
    window.addEventListener('click', ellipsisPositionHandler);
    return () => window.removeEventListener('click', ellipsisPositionHandler);
  }, [isVisibleEllipsis]);
  return (
    <div className="h-[100px] font-semibold text-gray-300 font-noto header-container">
      <div className="xl:max-w-[1152px] lg:max-w-[864px] md:max-w-[680px] md:flex hidden h-full mx-auto justify-center items-center">
        <div className="flex items-center">
          <Link to="/">
            {headerLogo && headerLogo.length > 0 ? (
              <img
                className="xl:mr-[80px] lg:mr-[47px] md:mr-[40px] mr-[20px]"
                src={headerLogo[0].content}
                width="110.24"
                alt="Logo"
              />
            ) : (
              ''
            )}
          </Link>
          <div className="flex flex-nowrap">
            {((token && userType !== 'admin') || token === '' || !token) && (
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
          {token && nickname && userType !== 'admin' && (
            <div
              className="xl:ml-[766px] lg:ml-[512px] md:ml-[334px]"
              onMouseEnter={() => setIsVisibleEllipsis(true)}
              onMouseLeave={() => setIsVisibleEllipsis(false)}
            >
              <button className="rounded-full w-[40px] h-[40px] flex items-center justify-center bg-[#8dc556] leading-[150%] text-white font-semibold">
                {nickname.charAt(0)}
              </button>
              {isVisibleEllipsis && (
                <div className="fixed z-[999] min-w-max">
                  <Ellipsis
                    token={token}
                    setToken={setToken}
                    logoutHandler={logoutHandler}
                  />
                </div>
              )}
            </div>
          )}
          {(token === '' || !token) && (
            <div className="xl:ml-[586px] lg:ml-[360px] md:ml-[230px]">
              <Link to="/signin">
                <button className="bg-white font-[14px] leading-[21px] font-semibold text-[#808695] border-[1px] border-[#DCDEE2] box-border rounded-[40px] h-[41px] xl:w-[99px] lg:w-[84.48px] md:w-[63.36px]">
                  로그인
                </button>
              </Link>
              <Link to="/signup">
                <button className="ml-[12px] font-[14px] leading-[21px] font-semibold text-white bg-[#8DC556] rounded-[40px] h-[41px] xl:w-[112px] lg:w-[95.57px] md:w-[71.68px]">
                  회원가입
                </button>
              </Link>
            </div>
          )}
          {token && nickname && userType === 'admin' && (
            <button
              className="flex items-center justify-center xl:ml-[800px] lg:ml-[550px] md:ml-[400px]"
              onClick={logoutHandler}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between h-full mx-auto md:hidden">
        <div className="flex items-center justify-center w-full">
          <Link to="/">
            {headerLogo && headerLogo.length > 0 ? (
              <img src={headerLogo[0].content} width="110.24" alt="Logo" />
            ) : (
              ''
            )}
          </Link>
          {((token && userType !== 'admin') || token === '' || !token) && (
            <>
              <button
                className={`rounded-[1px] min-w-max ${
                  token === '' || !token
                    ? 'sm:mx-[112px] xs:mx-[63px]'
                    : token && nickname && userType !== 'admin'
                    ? 'sm:mx-[165px] xs:mx-[115px]'
                    : ''
                }`}
                onClick={() => setIsVisibleMenu(!isVisibleMenu)}
              >
                메뉴
              </button>
              {isVisibleMenu && (
                <div
                  ref={menuElementRef}
                  className="flex-none border-[1px] border-[#DCDEE2] box-border rounded-[10px] bg-white min-w-full absolute top-[100px] z-[999]"
                >
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
            </>
          )}
          {token && nickname && userType !== 'admin' && (
            <div>
              <button
                className="rounded-full w-[40px] h-[40px] flex items-center justify-center bg-[#8dc556] leading-[150%] text-white font-semibold"
                onClick={() => setIsVisibleEllipsis(!isVisibleEllipsis)}
              >
                {nickname.charAt(0)}
              </button>
              {isVisibleEllipsis && (
                <div
                  ref={ellipsisElementRef}
                  className="relative z-[999] min-w-max"
                >
                  <Ellipsis
                    token={token}
                    setToken={setToken}
                    logoutHandler={logoutHandler}
                  />
                </div>
              )}
            </div>
          )}
          {(token === '' || !token) && (
            <div>
              <Link to="/signin">
                <button className="bg-white font-[10px] leading-[10px] font-semibold text-[#808695] border-[1px] border-[#DCDEE2] box-border rounded-[40px] w-[60px] h-[41px]">
                  로그인
                </button>
              </Link>
              <Link to="/signup">
                <button className="ml-[12px] font-[10px] leading-[10px] font-semibold text-white bg-[#8DC556] rounded-[40px] w-[70px] h-[41px]">
                  회원가입
                </button>
              </Link>
            </div>
          )}
          {token && nickname && userType === 'admin' && (
            <button
              className="flex items-center justify-center ml-[50%]"
              onClick={logoutHandler}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
