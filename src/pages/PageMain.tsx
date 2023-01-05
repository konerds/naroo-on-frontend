import * as React from 'react';
import { useParams, useLocation } from 'react-router';
import { axiosGetfetcher, showError } from '../hooks/api';
import ComponentCarouselLecture from '../components/main/ComponentCarouselLecture';
import ComponentOrgCarousel from '../components/main/ComponentCarouselOrg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { IInfoMe, IResourceContent, IUserVerify } from '../interfaces';
import { isArray } from 'lodash';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import ContextToken from '../store/ContextToken';
import { ReactComponent as ImgPrevArrow } from '../assets/images/PrevArrow.svg';
import { ReactComponent as ImgNextArrow } from '../assets/images/NextArrow.svg';
import Slider, { CustomArrowProps, Settings } from 'react-slick';

const ComponentArrowPrev = (props: CustomArrowProps) => {
  return (
    <ImgPrevArrow
      className={props.className}
      style={{
        ...props.style,
        display: 'absolute',
        width: 30,
        height: 30,
        left: '10px',
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const ComponentArrowNext = (props: CustomArrowProps) => {
  return (
    <ImgNextArrow
      className={props.className}
      style={{
        ...props.style,
        display: 'absolute',
        width: 30,
        height: 30,
        right: '10px',
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const settings: Settings | Readonly<Settings> = {
  arrows: true,
  dots: true,
  infinite: true,
  speed: 500,
  pauseOnHover: true,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <ComponentArrowPrev />,
  nextArrow: <ComponentArrowNext />,
};

const PageMain: React.FC = () => {
  const { requestToken } = useParams();
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
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
    <div className="max-w-full min-h-screen mx-auto bg-white">
      {!(!!dataGetMe && !!!errorGetMe && dataGetMe.role === 'admin') && (
        <>
          {!!infoBanner && isArray(infoBanner) && infoBanner.length > 0 ? (
            <Slider {...settings} className="bg-white text-center">
              {infoBanner.map((element, index) => {
                return (
                  <img
                    key={index}
                    className="pointer-cursor w-[100vw] h-[380px] max-h-[380px] object-fill"
                    src={element.content}
                  />
                );
              })}
            </Slider>
          ) : (
            <Skeleton className="w-full max-h-[380px]" />
          )}
          <ComponentCarouselLecture />
          <div className="min-h-[200px] bg-[#F8F8F9]">
            <ComponentOrgCarousel />
          </div>
        </>
      )}
    </div>
  );
};

export default PageMain;
