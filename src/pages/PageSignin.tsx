import * as React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useStringInput } from '../hooks';
import ContextToken from '../store/ContextToken';
import { showError } from '../hooks/api';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';

const PageSignin: React.FC = () => {
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
  const { token, setToken, isRememberToken, setIsRememberToken } = tokenCtx;
  const { value: email, onChange: onChangeEmail } = useStringInput('');
  const { value: password, onChange: onChangePassword } = useStringInput('');
  const [isRequesting, setIsRequesting] = React.useState<boolean>(false);
  const onSubmitHandler = async () => {
    try {
      setIsRequesting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/user/signin`,
        {
          email,
          password,
        },
      );
      if (response.status === 201) {
        toast('나루온에 오신 것을 환영합니다', { type: 'success' });
        setToken(response.data.token);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsRequesting(false);
    }
  };
  React.useEffect(() => {
    if (!!token) {
      navigate('/', { replace: true });
    }
  }, [token]);
  return (
    <div className="m-auto box-border min-w-[90vw] max-w-[90vw] rounded-[8px] border-[1px] border-[#DCDEE2] px-[10px] py-[30px] xs:min-w-[295.47px] xs:max-w-[295.47px] xs:px-[52.27px] sm:min-w-[295.47px] sm:max-w-[295.47px] sm:px-[52.27px] md:min-w-[354.56px] md:max-w-[354.56px] md:px-[62.72px] lg:min-w-[472.75px] lg:max-w-[472.75px] lg:px-[83.63px] xl:min-w-[554px] xl:max-w-[554px] xl:px-[98px]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitHandler();
        }}
      >
        <div className="text-[1.5rem] font-semibold text-[#17233D]">로그인</div>
        <div className="mb-[20px] mt-[32px]">
          <input
            className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] py-[10px] pl-[20px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none"
            type="text"
            placeholder="아이디"
            value={email}
            onChange={onChangeEmail}
          />
        </div>
        <div className="mb-[20px]">
          <input
            autoComplete="off"
            className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] py-[10px] pl-[20px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={onChangePassword}
          />
        </div>
        <div className="flex items-center text-[0.75rem] leading-[1rem]">
          <input
            className="mr-[5px]"
            type="checkbox"
            checked={isRememberToken === 'true' ? true : false}
            onChange={(event) =>
              setIsRememberToken(event.target.checked ? 'true' : 'false')
            }
          />
          자동 로그인
        </div>
        <button
          type="submit"
          className={`my-[20px] box-border flex h-[41px] w-full items-center justify-center rounded-[4px] border-[1px] border-[#4DBFF0] bg-[#4DBFF0] text-white hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed${
            isRequesting ? ' opacity-50' : ''
          }`}
        >
          <span
            className={`relative text-[0.875rem] font-semibold${
              isRequesting ? ' mr-[5px]' : ''
            }`}
          >
            로그인
          </span>
          {isRequesting && (
            <ThreeDots
              height="16"
              width="16"
              radius="9"
              color="#ffffff"
              ariaLabel="three-dots-loading"
              visible={true}
            />
          )}
        </button>
        <div className="flex w-full justify-between">
          <div className="text-[0.7rem] font-normal text-[#515A6E] underline hover:opacity-50 xs:text-[0.875rem]">
            <Link to="/signup">회원가입</Link>
          </div>
          <div className="text-[0.7rem] font-normal text-[#515A6E] underline hover:opacity-50  xs:text-[0.875rem]">
            <Link to="/forgot">비밀번호 재설정</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PageSignin;
