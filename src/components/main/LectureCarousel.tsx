import { isArray } from 'lodash';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import useSWR from 'swr';
import { IInfoMe, ILectureInList } from '../../interfaces';
import ComponentLectureCard from '../lecture/LectureCard';
import ImgPrevArrow from '../../assets/images/PrevArrow.svg';
import ImgNextArrow from '../../assets/images/NextArrow.svg';
import TokenContext from '../../store/TokenContext';
import { axiosGetfetcher } from '../../hooks/api';

interface IPropsComponentLectureCarousel {}

const ComponentPrevArrow = (props: CustomArrowProps) => {
  return (
    <img
      src={ImgPrevArrow}
      className={props.className}
      style={{
        ...props.style,
        display: 'absolute',
        width: 40,
        height: 40,
        left: '-3px',
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const ComponentNextArrow = (props: CustomArrowProps) => {
  return (
    <img
      src={ImgNextArrow}
      className={props.className}
      style={{
        ...props.style,
        display: 'absolute',
        width: 40,
        height: 40,
        right: '30px',
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const ComponentSmallNextArrow = (props: CustomArrowProps) => {
  return (
    <img
      src={ImgNextArrow}
      className={props.className}
      style={{
        ...props.style,
        display: 'absolute',
        width: 40,
        height: 40,
        right: '-3px',
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const ComponentLectureCarousel: React.FC<
  IPropsComponentLectureCarousel
> = ({}) => {
  const settings: Settings | Readonly<Settings> = {
    arrows: true,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          nextArrow: <ComponentSmallNextArrow />,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          nextArrow: <ComponentSmallNextArrow />,
        },
      },
    ],
    prevArrow: <ComponentPrevArrow />,
    nextArrow: <ComponentNextArrow />,
  };
  const tokenCtx = React.useContext(TokenContext);
  const { token } = tokenCtx;
  const { data: dataAllLectures, error: errorAllLectures } = useSWR<
    ILectureInList[]
  >(
    `${process.env.REACT_APP_BACK_URL}/lecture/all`,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/lecture/all`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: dataUserLectures, error: errorUserLectures } = useSWR<
    ILectureInList[]
  >(
    !!token && !!dataGetMe && !!!errorGetMe
      ? `${process.env.REACT_APP_BACK_URL}/lecture`
      : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/lecture`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  return (
    <div className="xl:max-w-[1260px] lg:max-w-[966px] md:max-w-[788px] xs:w-full mx-auto pl-[54px] lg:pr-[27px] pr-[54px] mt-[122px] pb-[96px]">
      {!!token && !!dataGetMe && !!!errorGetMe && (
        <>
          <div className="text-2xl font-semibold text-gray-400">
            내가 신청한 강좌
            {!!dataUserLectures &&
            !!!errorUserLectures &&
            dataUserLectures.length >= 0
              ? ` (${dataUserLectures.length})`
              : ''}
          </div>
          <div className="mt-2 text-gray-300 mb-7">
            내가 신청한 강좌를 복습해보세요
          </div>
          {!!dataUserLectures &&
          !!!errorUserLectures &&
          isArray(dataUserLectures) ? (
            <>
              {dataUserLectures.length > 0 ? (
                <div className="">
                  <Slider {...settings}>
                    {dataUserLectures.map((lecture, index) => {
                      return (
                        <ComponentLectureCard
                          key={lecture.id}
                          id={lecture.id}
                          title={lecture.title}
                          thumbnail={lecture.thumbnail}
                          teacherNickname={lecture.teacher_nickname}
                          status={lecture.status}
                          expired={lecture.expired}
                          tags={lecture.tags}
                        />
                      );
                    })}
                  </Slider>
                </div>
              ) : (
                <div className="flex w-full h-[300px] justify-center items-center">
                  신청한 강좌가 존재하지 않습니다
                </div>
              )}
            </>
          ) : (
            <Skeleton className="w-full h-[300px]" />
          )}
        </>
      )}
      <div className="mt-[122px] text-2xl font-semibold text-gray-400">
        모든 강좌
        {!!dataAllLectures && !!!errorAllLectures && dataAllLectures.length >= 0
          ? ` (${dataAllLectures.length})`
          : ''}
      </div>
      <div className="mt-2 text-gray-300 mb-7">
        완료 혹은 진행중인 전체 강좌를 살펴보세요
      </div>
      {!!dataAllLectures && !!!errorAllLectures && isArray(dataAllLectures) ? (
        <>
          {dataAllLectures.length > 0 ? (
            <div className="">
              <Slider {...settings}>
                {dataAllLectures.map((lecture, index) => {
                  return (
                    <ComponentLectureCard
                      key={lecture.id}
                      id={lecture.id}
                      title={lecture.title}
                      thumbnail={lecture.thumbnail}
                      teacherNickname={lecture.teacher_nickname}
                      status={null}
                      expired={lecture.expired}
                      tags={lecture.tags}
                    />
                  );
                })}
              </Slider>
            </div>
          ) : (
            <div className="flex w-full h-[300px] justify-center items-center">
              강좌가 존재하지 않습니다
            </div>
          )}
        </>
      ) : (
        <Skeleton className="w-full h-[300px]" />
      )}
    </div>
  );
};

export default ComponentLectureCarousel;
