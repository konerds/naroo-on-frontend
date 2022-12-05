import { FC, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useInput } from '../hooks';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface InitPasswordLayoutProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
}

const InitPasswordLayout: FC<InitPasswordLayoutProps> = ({
  token,
  setToken,
}) => {
  const history = useHistory();
  useEffect(() => {
    setToken('');
    localStorage.setItem('token', '');
  }, []);
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [phone, onChangePhone] = useInput('');
  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/user/init`,
        {
          email,
          nickname,
          phone,
        },
      );

      if (response.status === 201) {
        toast.success('발송된 메일을 통해 초기화된 비밀번호를 확인해주세요!');
        history.replace('/');
      }
    } catch (error: any) {
      const messages = error.response?.data?.message;
      if (Array.isArray(messages)) {
        messages.map((message) => {
          toast.error(message);
        });
      } else {
        toast.error(messages);
      }
    }
  };
  return (
    <div className="min-h-[73vh] w-full flex justify-center items-center">
      <div className="xl:min-w-[554px] xl:max-w-[554px] lg:min-w-[472.75px] lg:max-w-[472.75px] md:min-w-[354.56px] md:max-w-[354.56px] sm:min-w-[295.47px] sm:max-w-[295.47px] xs:min-w-[295.47px] xs:max-w-[295.47px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] mx-auto my-[120px] py-[30px] xl:px-[98px] lg:px-[83.63px] md:px-[62.72px] sm:px-[52.27px] xs:px-[52.27px]">
        <form onSubmit={onSubmitHandler}>
          <div className="text-[24px] leading-[150%] font-semibold">
            비밀번호 재설정
          </div>
          <div className="mt-[32px] mb-[20px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[14px] leading-[150%] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="text"
              placeholder="이메일을 입력해주세요!"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
          <div className="mb-[20px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[14px] leading-[150%] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="text"
              placeholder="이름을 입력해주세요!"
              value={nickname}
              onChange={onChangeNickname}
            />
          </div>
          <div className="mb-[19px]">
            <input
              className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[14px] leading-[150%] pl-[20px] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white"
              type="text"
              placeholder="010-1234-5678"
              value={phone}
              onChange={onChangePhone}
            />
          </div>
          <button
            type="submit"
            className="w-full box-border rounded-[4px] border-[1px] border-[#4DBFF0] h-[41px] mt-[20px] text-[14px] font-semibold leading-[150%] bg-[#4DBFF0] text-white"
          >
            비밀번호 재설정
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitPasswordLayout;
