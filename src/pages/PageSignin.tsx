import * as React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useStringInput } from '../hooks';
import ContextToken from '../store/ContextToken';
import { showError } from '../hooks/api';
import { toast } from 'react-toastify';

const PageSignin: React.FC = () => {
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
  const { token, setToken, isRememberToken, setIsRememberToken } = tokenCtx;
  const { value: email, onChange: onChangeEmail } = useStringInput('');
  const { value: password, onChange: onChangePassword } = useStringInput('');
  const onSubmitHandler = async () => {
    try {
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
    }
  };
  React.useEffect(() => {
    if (!!token) {
      navigate('/', { replace: true });
    }
  }, [token]);
  React.useEffect(() => {
    setToken('');
  }, []);
  return (
    <div className="pt-[100px] min-h-[73vh] w-full flex justify-center items-center">
      <div className="xl:min-w-[554px] xl:max-w-[554px] lg:min-w-[472.75px] lg:max-w-[472.75px] md:min-w-[354.56px] md:max-w-[354.56px] sm:min-w-[295.47px] sm:max-w-[295.47px] xs:min-w-[295.47px] xs:max-w-[295.47px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] mx-auto my-[120px] py-[30px] xl:px-[98px] lg:px-[83.63px] md:px-[62.72px] sm:px-[52.27px] xs:px-[52.27px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitHandler();
          }}
        >
          <div className="text-[24px] leading-[150%] text-[#17233D] font-semibold">
            로그인
          </div>
          <div className="mt-[32px] mb-[20px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[14px] leading-[150%] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="text"
              placeholder="아이디"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
          <div className="mb-[20px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[14px] leading-[150%] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          <div className="text-[12px] leading-[16px] flex items-center">
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
            className="w-full box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] my-[20px] text-[14px] font-semibold leading-[150%] bg-[#4DBFF0] text-white"
          >
            로그인
          </button>
          <div className="flex justify-between w-full">
            <div className="text-[14px] leading-[150%] text-[#515A6E] font-normal underline">
              <Link to="/signup">회원가입</Link>
            </div>
            <div className="text-[14px] leading-[150%] text-[#515A6E] font-normal underline">
              <Link to="/forgot">비밀번호 재설정</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageSignin;
