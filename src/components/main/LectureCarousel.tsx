import { isArray } from 'lodash';
import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import { useGetSWR } from '../../hooks/api';
import { ILectureInList } from '../../interfaces';
import LectureCard from '../lecture/LectureCard';
import PrevArrow from '../../assets/images/PrevArrow.svg';
import NextArrow from '../../assets/images/NextArrow.svg';

interface LectureCarouselProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
}

function LectureCardPrevArrow(props: CustomArrowProps) {
  return (
    <img
      src={PrevArrow}
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
}

function LectureCardNextArrow(props: CustomArrowProps) {
  return (
    <img
      src={NextArrow}
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
}

function LectureCardSmallNextArrow(props: CustomArrowProps) {
  return (
    <img
      src={NextArrow}
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
}

const LectureCarousel: FC<LectureCarouselProps> = ({ token, setToken }) => {
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
          nextArrow: <LectureCardSmallNextArrow />,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          nextArrow: <LectureCardSmallNextArrow />,
        },
      },
    ],
    prevArrow: <LectureCardPrevArrow />,
    nextArrow: <LectureCardNextArrow />,
  };
  const { data: allLecturesData } = useGetSWR<ILectureInList[]>(
    `${process.env.REACT_APP_BACK_URL}/lecture/all`,
    null,
    false,
  );
  const { data: userLecturesData } = useGetSWR<ILectureInList[]>(
    `${process.env.REACT_APP_BACK_URL}/lecture`,
    token,
    false,
    token !== null && token !== '',
  );
  return (
    <div className="xl:max-w-[1260px] lg:max-w-[966px] md:max-w-[788px] xs:w-full mx-auto pl-[54px] lg:pr-[27px] pr-[54px] mt-[122px] pb-[96px]">
      {token !== null && token !== '' && (
        <>
          <div className="text-2xl font-semibold text-gray-400">
            내가 신청한 강좌
            {userLecturesData && userLecturesData.length >= 0
              ? ` (${userLecturesData.length})`
              : ''}
          </div>
          <div className="mt-2 text-gray-300 mb-7">
            내가 신청한 강좌를 복습해보세요
          </div>
          {userLecturesData &&
          isArray(userLecturesData) &&
          userLecturesData.length > 0 ? (
            <div className="">
              <Slider {...settings}>
                {userLecturesData.map((lecture, index) => {
                  return (
                    <LectureCard
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
          ) : isArray(userLecturesData) && userLecturesData.length === 0 ? (
            <div className="flex w-full h-[300px] justify-center items-center">
              신청한 강좌가 존재하지 않습니다!
            </div>
          ) : (
            <Skeleton className="w-full h-[300px]" />
          )}
        </>
      )}
      <div className="mt-[122px] text-2xl font-semibold text-gray-400">
        모든 강좌
        {allLecturesData && allLecturesData.length >= 0
          ? ` (${allLecturesData.length})`
          : ''}
      </div>
      <div className="mt-2 text-gray-300 mb-7">
        완료 혹은 진행중인 전체 강좌를 살펴보세요
      </div>
      {allLecturesData &&
      isArray(allLecturesData) &&
      allLecturesData.length > 0 ? (
        <div className="">
          <Slider {...settings}>
            {allLecturesData.map((lecture, index) => {
              return (
                <LectureCard
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
      ) : allLecturesData &&
        isArray(allLecturesData) &&
        allLecturesData.length === 0 ? (
        <div className="flex w-full h-[300px] justify-center items-center">
          강좌가 존재하지 않습니다!
        </div>
      ) : (
        <Skeleton className="w-full h-[300px]" />
      )}
    </div>
  );
};

export default LectureCarousel;
