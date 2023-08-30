import { FC, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStringInput } from '../hooks';
import { toast } from 'react-toastify';
import { showError } from '../hooks/api';
import { ThreeDots } from 'react-loader-spinner';
import stateToken from '../recoil/state-object-token/stateToken';

const PageInitPassword: FC = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(stateToken);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const { value: email, onChange: onChangeEmail } = useStringInput('');
  const { value: nickname, onChange: onChangeNickname } = useStringInput('');
  const { value: phone, onChange: onChangePhone } = useStringInput('');
  const onSubmitHandler = async () => {
    try {
      setIsRequesting(true);
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
          {
            type: 'success',
          },
        );
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsRequesting(false);
    }
  };
  useEffect(() => {
    if (!!token) {
      navigate('/', { replace: true });
    }
  }, [token]);
  return (
    <div className="flex w-full items-center justify-center">
      <div className="mx-auto my-auto box-border min-w-[90vw] max-w-[90vw] rounded-[8px] border-[1px] border-[#DCDEE2] px-[10px] py-[30px] xs:min-w-[295.47px] xs:max-w-[295.47px] xs:px-[52.27px] sm:min-w-[295.47px] sm:max-w-[295.47px] sm:px-[52.27px] md:min-w-[354.56px] md:max-w-[354.56px] md:px-[62.72px] lg:min-w-[472.75px] lg:max-w-[472.75px] lg:px-[83.63px] xl:min-w-[554px] xl:max-w-[554px] xl:px-[98px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitHandler();
          }}
        >
          <div className="text-[1.5rem] font-semibold">비밀번호 재설정</div>
          <div className="mb-[20px] mt-[32px]">
            <input
              className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] py-[10px] pl-[20px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none"
              type="text"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={onChangeEmail}
            />
          </div>
          <div className="mb-[20px]">
            <input
              className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] py-[10px] pl-[20px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none"
              type="text"
              placeholder="이름을 입력해주세요"
              value={nickname}
              onChange={onChangeNickname}
            />
          </div>
          <div className="mb-[19px]">
            <input
              className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] py-[10px] pl-[20px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none"
              type="text"
              placeholder="010-1234-5678"
              value={phone}
              onChange={onChangePhone}
            />
          </div>
          <button
            type="submit"
            className={`mt-[20px] box-border flex h-[41px] w-full items-center justify-center rounded-[4px] border-[1px] border-[#4DBFF0] bg-[#4DBFF0] text-[0.875rem] font-semibold text-white hover:opacity-50 disabled:cursor-not-allowed${
              isRequesting ? ' opacity-50' : ''
            }`}
          >
            <span
              className={`relative text-[0.875rem] font-semibold${
                isRequesting ? ' mr-[5px]' : ''
              }`}
            >
              비밀번호 재설정
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

export default PageInitPassword;
