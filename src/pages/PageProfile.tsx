import { FC, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import ComponentFormUpdateUser from '../components/profile/ComponentFormUpdateUser';
import { useSWRInfoMe, useSWRProfileUser } from '../hooks/api';
import stateToken from '../recoil/state-object-token/stateToken';

const PageProfile: FC = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  const { data: dataProfileUser, error: errorProfileUser } =
    useSWRProfileUser();
  useEffect(() => {
    if (!!!token || (!!token && !!dataInfoMe && dataInfoMe.role === 'admin')) {
      navigate('/', { replace: true });
    }
  }, [token, dataInfoMe, dataInfoMe?.role]);
  return (
    <div className="flex min-h-[530px] w-full items-center justify-center">
      <div className="m-auto box-border min-w-[90vw] max-w-[90vw] rounded-[8px] border-[1px] border-[#DCDEE2] px-[20px] py-[30px] sm:min-w-[70vw] sm:max-w-[70vw] sm:px-[55px] md:min-w-[472.75px] md:max-w-[472.75px] xl:min-w-[554px] xl:max-w-[554px] xl:px-[98px] ">
        <div className="text-[1.5rem] font-semibold">개인 정보 수정</div>
        {dataProfileUser && !errorProfileUser ? (
          <div className="mt-[20px]">
            <div className="space-y-[20px] text-sm sm:text-[1rem]">
              {dataProfileUser.nickname ? (
                <ComponentFormUpdateUser
                  fieldType="nickname"
                  id={dataProfileUser.id}
                  userField={dataProfileUser.nickname}
                />
              ) : (
                <></>
              )}
              <ComponentFormUpdateUser
                fieldType="password"
                id={dataProfileUser.id}
                userField={''}
              />
              {dataProfileUser.phone ? (
                <ComponentFormUpdateUser
                  fieldType="phone"
                  id={dataProfileUser.id}
                  userField={dataProfileUser.phone}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PageProfile;
