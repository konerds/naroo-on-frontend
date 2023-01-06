import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStringInput } from '../hooks';
import { toast } from 'react-toastify';
import ContextToken from '../store/ContextToken';
import { showError } from '../hooks/api';
import { ThreeDots } from 'react-loader-spinner';

const PageSignup: React.FC = () => {
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
  const { token, setToken } = tokenCtx;
  const { value: email, onChange: onChangeEmail } = useStringInput('');
  const { value: password, onChange: onChangePassword } = useStringInput('');
  const { value: passwordCheck, onChange: onChangePasswordCheck } =
    useStringInput('');
  const { value: nickname, onChange: onChangeNickname } = useStringInput('');
  const { value: phone, onChange: onChangePhone } = useStringInput('');
  const [isAgreeEmail, setIsAgreeEmail] = React.useState<boolean>(false);
  const [isRequesting, setIsRequesting] = React.useState<boolean>(false);
  const handlerOnSubmit = async () => {
    try {
      if (password !== passwordCheck) {
        toast('패스워드가 일치하지 않습니다', { type: 'error' });
        return;
      }
      setIsRequesting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/user/signup`,
        {
          email,
          password,
          nickname,
          phone,
          isAgreeEmail: isAgreeEmail ? 'true' : 'false',
        },
      );
      if (response.status === 201) {
        toast('발송된 메일을 통해 이메일 인증을 완료해주세요', {
          type: 'success',
        });
        navigate('/', { replace: true });
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
    <div className="min-h-[605px] flex justify-center items-center">
      <div className="py-[30px] min-w-[90vw] max-w-[90vw] xs:min-w-[295.47px] xs:max-w-[295.47px] sm:min-w-[295.47px] sm:max-w-[295.47px] md:min-w-[354.56px] md:max-w-[354.56px] lg:min-w-[472.75px] lg:max-w-[472.75px] xl:min-w-[554px] xl:max-w-[554px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] m-auto px-[10px] xs:px-[52.27px] sm:px-[52.27px] md:px-[62.72px] lg:px-[83.63px] xl:px-[98px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handlerOnSubmit();
          }}
        >
          <div className="text-[1.5rem] font-semibold">회원가입</div>
          <div className="mt-[32px] mb-[20px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="text"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
          <div className="mb-[20px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          <div className="mb-[20px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="password"
              placeholder="비밀번호 확인"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          <div className="mb-[20px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="text"
              placeholder="이름을 입력해주세요"
              value={nickname}
              onChange={onChangeNickname}
            />
          </div>
          <div className="mb-[19px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="text"
              placeholder="010-1234-5678"
              value={phone}
              onChange={onChangePhone}
            />
          </div>
          <div className="mb-[4px] text-[0.75rem] leading-[1.5rem] text-[#515A6E]">
            가입 시, 마포청년나루의{' '}
            <span className="text-[#007CC8]">이용약관, 개인정보취급방침</span>에
            동의합니다.
          </div>
          <div className="text-[0.6rem] md:text-[0.75rem] leading-[1.5rem] text-[#515A6E] flex items-center">
            <input
              className="mr-[5px]"
              type="checkbox"
              checked={isAgreeEmail}
              onChange={(event) => setIsAgreeEmail(event.target.checked)}
            />
            나루온의 다양한 소식을 받아보시겠어요?
          </div>
          <button
            type="submit"
            className={`flex justify-center items-center w-full box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] mt-[20px] bg-[#4DBFF0] text-white hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed${
              isRequesting ? ' opacity-50' : ''
            }`}
          >
            <span
              className={`relative text-[0.875rem] font-semibold${
                isRequesting ? ' mr-[5px]' : ''
              }`}
            >
              회원가입
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
        </form>
      </div>
    </div>
  );
};

export default PageSignup;
