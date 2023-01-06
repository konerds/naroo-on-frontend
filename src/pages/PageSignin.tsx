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
    <div className="py-[30px] xl:min-w-[554px] xl:max-w-[554px] lg:min-w-[472.75px] lg:max-w-[472.75px] md:min-w-[354.56px] md:max-w-[354.56px] sm:min-w-[295.47px] sm:max-w-[295.47px] xs:min-w-[295.47px] xs:max-w-[295.47px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] m-auto xl:px-[98px] lg:px-[83.63px] md:px-[62.72px] sm:px-[52.27px] xs:px-[52.27px]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitHandler();
        }}
      >
        <div className="text-[1.5rem] text-[#17233D] font-semibold">로그인</div>
        <div className="mt-[32px] mb-[20px]">
          <input
            className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
            type="text"
            placeholder="아이디"
            value={email}
            onChange={onChangeEmail}
          />
        </div>
        <div className="mb-[20px]">
          <input
            className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={onChangePassword}
          />
        </div>
        <div className="text-[0.75rem] leading-[1rem] flex items-center">
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
          className={`flex justify-center items-center w-full box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] my-[20px] bg-[#4DBFF0] text-white hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed${
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
        <div className="flex justify-between w-full">
          <div className="text-[0.875rem] text-[#515A6E] font-normal underline hover:opacity-50">
            <Link to="/signup">회원가입</Link>
          </div>
          <div className="text-[0.875rem] text-[#515A6E] font-normal underline  hover:opacity-50">
            <Link to="/forgot">비밀번호 재설정</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PageSignin;
