import { FC, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useParams, useLocation } from 'react-router';
import {
  showError,
  useSWRInfoMe,
  useSWRIsVerify,
  useSWRListBannerPrimary,
} from '../hooks/api';
import ComponentCarouselLectureAll from '../components/main/ComponentCarouselLectureAll';
import ComponentOrgCarousel from '../components/main/ComponentCarouselOrg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { ReactComponent as ArrowPrev } from '../assets/images/PrevArrow.svg';
import { ReactComponent as ArrowNext } from '../assets/images/NextArrow.svg';
import Slider, { CustomArrowProps } from 'react-slick';
import ComponentSkeletonCustom from '../components/common/ui/ComponentSkeletonCustom';
import ComponentCarouselLectureUser from '../components/main/ComponentCarouselLectureUser';
import stateToken from '../recoil/state-object-token/stateToken';

const ComponentArrowPrev = (props: CustomArrowProps) => {
  return (
    <ArrowPrev
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
    <ArrowNext
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

const PageMain: FC = () => {
  const { pathname } = useLocation();
  const { requestToken } = useParams();
  const navigate = useNavigate();
  const token = useRecoilValue(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  const {
    data: dataListBannerPrimary,
    isValidating: isValidatingListBannerPrimary,
    error: errorListBannerPrimary,
  } = useSWRListBannerPrimary();
  const [isLoadingListBannerPrimary, setIsLoadingListBannerPrimary] =
    useState(false);
  useEffect(() => {
    setIsLoadingListBannerPrimary(
      (!!!dataListBannerPrimary && !!!errorListBannerPrimary) ||
        isValidatingListBannerPrimary,
    );
  }, [
    dataListBannerPrimary,
    isValidatingListBannerPrimary,
    errorListBannerPrimary,
  ]);
  const { data: dataIsVerify, error: errorIsVerify } = useSWRIsVerify(
    pathname,
    requestToken,
  );
  useEffect(() => {
    if (!!token && !!dataInfoMe && dataInfoMe.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [token, dataInfoMe?.role]);
  useEffect(() => {
    if (!!errorIsVerify) {
      showError(errorIsVerify);
    }
    if (!!dataIsVerify && !!dataIsVerify.token) {
      toast('이메일 인증이 완료되었습니다', { type: 'success' });
      navigate('/signin', { replace: true });
    }
  }, [dataIsVerify?.token, errorIsVerify]);
  return (
    <div className="mx-auto min-h-screen max-w-full bg-white">
      {!(!!token && !!dataInfoMe && dataInfoMe.role === 'admin') && (
        <>
          {isLoadingListBannerPrimary ? (
            <ComponentSkeletonCustom className="block-important w-screen-important min-h-[380px]" />
          ) : (
            <>
              {!!dataListBannerPrimary &&
                !!!errorListBannerPrimary &&
                dataListBannerPrimary.length > 0 && (
                  <Slider
                    {...{
                      arrows: true,
                      dots: true,
                      adaptiveHeight: true,
                      infinite: true,
                      speed: 500,
                      pauseOnHover: true,
                      autoplay: true,
                      autoplaySpeed: 5000,
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      prevArrow: <ComponentArrowPrev />,
                      nextArrow: <ComponentArrowNext />,
                    }}
                    className="min-h-[380px] bg-white text-center"
                  >
                    {dataListBannerPrimary.map((element, index) => {
                      return (
                        <img
                          key={index}
                          className="pointer-cursor max-h-[380px] min-h-[380px] w-[100vw] object-cover"
                          src={element.content}
                        />
                      );
                    })}
                  </Slider>
                )}
            </>
          )}
          <div className="mx-auto w-full px-[20px] py-[60px] md:max-w-[788px] lg:max-w-[966px] lg:px-0 xl:max-w-[1152px]">
            <ComponentCarouselLectureUser />
            <ComponentCarouselLectureAll />
          </div>
          <div className="min-h-[200px] bg-[#F8F8F9]">
            <ComponentOrgCarousel />
          </div>
        </>
      )}
    </div>
  );
};

export default PageMain;
