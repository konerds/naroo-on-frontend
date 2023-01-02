import * as React from 'react';
import { useParams, useLocation } from 'react-router';
import { axiosGetfetcher, showError } from '../hooks/api';
import ComponentLectureCarousel from '../components/main/LectureCarousel';
import ComponentOrgCarousel from '../components/main/OrgCarousel';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { IInfoMe, IResourceContent, IUserVerify } from '../interfaces';
import { isArray } from 'lodash';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import TokenContext from '../store/TokenContext';
import { getSavedToken } from '../hooks';

interface IPropsPageMain {}

const PageMain: React.FC<IPropsPageMain> = ({}) => {
  const { requestToken } = useParams();
  const navigate = useNavigate();
  const tokenCtx = React.useContext(TokenContext);
  const { token } = tokenCtx;
  const location = useLocation();
  const { pathname: currentPathname } = location;
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: infoBanner } = useSWRImmutable<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/info_banner`,
    () =>
      axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/resource/info_banner`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: dataVerify, error: errorVerify } = useSWR<IUserVerify>(
    currentPathname.includes('/verify') && !!requestToken
      ? `${process.env.REACT_APP_BACK_URL}/user/verify?requestToken=${requestToken}`
      : null,
    () =>
      axiosGetfetcher(
        `${process.env.REACT_APP_BACK_URL}/user/verify?requestToken=${requestToken}`,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  React.useEffect(() => {
    if (!!dataGetMe && !!!errorGetMe && dataGetMe.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [dataGetMe?.role, errorGetMe]);
  React.useEffect(() => {
    if (!!errorVerify) {
      showError(errorVerify);
    }
    if (!!dataVerify && !!dataVerify.token) {
      toast('이메일 인증이 완료되었습니다', { type: 'success' });
      navigate('/signin', { replace: true });
    }
  }, [dataVerify?.token, errorVerify]);
  return (
    <div className="max-w-full min-h-screen mx-auto bg-white font-noto">
      {!(!!dataGetMe && !!!errorGetMe && dataGetMe.role === 'admin') && (
        <>
          {!!infoBanner && isArray(infoBanner) && infoBanner.length > 0 ? (
            <img
              className="w-full max-h-[380px] object-fit"
              src={infoBanner[0].content}
            />
          ) : (
            <Skeleton className="w-full h-[380px]" />
          )}
          <ComponentLectureCarousel />
          <div className="min-h-[200px] bg-[#F8F8F9]">
            <ComponentOrgCarousel />
          </div>
        </>
      )}
    </div>
  );
};

export default PageMain;
