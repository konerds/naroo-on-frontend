import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStringInput } from '../hooks';
import { toast } from 'react-toastify';
import { showError } from '../hooks/api';
import ContextToken from '../store/ContextToken';

const PageInitPassword: React.FC = () => {
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
  const { setToken } = tokenCtx;
  const { value: email, onChange: onChangeEmail } = useStringInput('');
  const { value: nickname, onChange: onChangeNickname } = useStringInput('');
  const { value: phone, onChange: onChangePhone } = useStringInput('');
  const onSubmitHandler = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/user/init`,
        {
          email,
          nickname,
          phone,
        },
      );
      if (response.status === 201) {
        toast(
          <p>
            {'등록된 메일로 초기화 비밀번호가 전송되었습니다'}
            <br />
            <br />
            {'보안을 위해 반드시 비밀번호를 변경하세요'}
          </p>,
          { type: 'success' },
        );
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      showError(error);
    }
  };
  React.useEffect(() => {
    setToken('');
  }, []);
  return (
    <div className="min-h-[73vh] w-full flex justify-center items-center">
      <div className="xl:min-w-[554px] xl:max-w-[554px] lg:min-w-[472.75px] lg:max-w-[472.75px] md:min-w-[354.56px] md:max-w-[354.56px] sm:min-w-[295.47px] sm:max-w-[295.47px] xs:min-w-[295.47px] xs:max-w-[295.47px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] mx-auto my-[120px] py-[30px] xl:px-[98px] lg:px-[83.63px] md:px-[62.72px] sm:px-[52.27px] xs:px-[52.27px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitHandler();
          }}
        >
          <div className="text-[1.5rem] font-semibold">비밀번호 재설정</div>
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
          <button
            type="submit"
            className="w-full box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] mt-[20px] text-[0.875rem] font-semibold bg-[#4DBFF0] text-white hover:opacity-50"
          >
            비밀번호 재설정
          </button>
        </form>
      </div>
    </div>
  );
};

export default PageInitPassword;
