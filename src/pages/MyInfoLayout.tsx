import { FC } from 'react';
import UpdateUserField from '../components/admin/user/UpdateUserField';
import { useGetSWR } from '../hooks/api';
import { IUserEdit } from '../interfaces';

interface MyInfoLayoutProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
}

const MyInfoLayout: FC<MyInfoLayoutProps> = ({ token, setToken }) => {
  const { data: myInfoData, mutate: myInfoMutate } = useGetSWR<IUserEdit>(
    `${process.env.REACT_APP_BACK_URL}/user/myinfo`,
    token,
    true,
  );
  return (
    <div className="min-h-[73vh] w-full flex justify-center items-center">
      <div className="xl:min-w-[554px] xl:max-w-[554px] lg:min-w-[472.75px] lg:max-w-[472.75px] md:min-w-[354.56px] md:max-w-[354.56px] sm:min-w-[295.47px] sm:max-w-[295.47px] xs:min-w-[295.47px] xs:max-w-[295.47px] box-border rounded-[8px] border-[1px] border-[#DCDEE2] mx-auto my-[120px] py-[30px] xl:px-[98px] lg:px-[83.63px] md:px-[62.72px] sm:px-[52.27px] xs:px-[52.27px]">
        <div className="text-[24px] leading-[150%] font-semibold">
          개인 정보 수정
        </div>
        <div className="mt-[20px]">
          {myInfoData && (
            <>
              <div className="space-y-[20px]">
                {myInfoData.nickname && (
                  <UpdateUserField
                    token={token}
                    setToken={setToken}
                    fieldType="nickname"
                    id={myInfoData.id}
                    userField={myInfoData.nickname}
                    mutate={myInfoMutate}
                  />
                )}
                <UpdateUserField
                  token={token}
                  setToken={setToken}
                  fieldType="password"
                  id={myInfoData.id}
                  userField={null}
                  mutate={myInfoMutate}
                />
                {myInfoData.phone && (
                  <UpdateUserField
                    token={token}
                    setToken={setToken}
                    fieldType="phone"
                    id={myInfoData.id}
                    userField={myInfoData.phone}
                    mutate={myInfoMutate}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInfoLayout;
