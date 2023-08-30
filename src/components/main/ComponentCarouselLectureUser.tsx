import { FC, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useMediaQuery } from 'react-responsive';
import Slider, { CustomArrowProps } from 'react-slick';
import { useSWRListLectureByUser, useSWRInfoMe } from '../../hooks/api';
import { ReactComponent as ArrowPrev } from '../../assets/images/PrevArrow.svg';
import { ReactComponent as ArrowNext } from '../../assets/images/NextArrow.svg';
import ComponentCardLecture from '../lecture/ComponentCardLecture';
import ComponentSkeletonCustom from '../common/ui/ComponentSkeletonCustom';
import stateToken from '../../recoil/state-object-token/stateToken';

const ComponentArrowPrev = (props: CustomArrowProps) => {
  return (
    <ArrowPrev
      className={props.className}
      style={{
        ...props.style,
        display: 'absolute',
        width: 30,
        height: 30,
        left: useMediaQuery({ minWidth: 1536 }) ? '-35px' : '15px',
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
        right: useMediaQuery({ minWidth: 1536 }) ? '-35px' : '15px',
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const ComponentCarouselLectureUser: FC = () => {
  const token = useRecoilValue(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  const {
    data: dataListLectureByUser,
    isValidating: isValidatingListLectureByUser,
    error: errorListLectureByUser,
  } = useSWRListLectureByUser();
  const [isLoadingListLectureByUser, setIsLoadingListLectureByUser] =
    useState(false);
  useEffect(() => {
    setIsLoadingListLectureByUser(
      (!!!dataListLectureByUser && !!!errorListLectureByUser) ||
        isValidatingListLectureByUser,
    );
  }, [
    dataListLectureByUser,
    isValidatingListLectureByUser,
    errorListLectureByUser,
  ]);
  return (
    <>
      {!!token && !!dataInfoMe && (
        <div className="mb-[60px]">
          <div className="text-2xl font-semibold text-gray-400">
            내가 신청한 강좌
            {!!dataListLectureByUser &&
              !!!errorListLectureByUser &&
              dataListLectureByUser.length >= 0 &&
              ` (${dataListLectureByUser.length})`}
          </div>
          <div className="mb-7 mt-2 text-gray-300">
            내가 신청한 강좌를 복습해보세요
          </div>
          {isLoadingListLectureByUser ? (
            <ComponentSkeletonCustom className="min-h-[444px] w-full" />
          ) : (
            <>
              {!!dataListLectureByUser &&
              !!!errorListLectureByUser &&
              dataListLectureByUser.length > 0 ? (
                <Slider
                  {...{
                    arrows: true,
                    dots: false,
                    infinite: false,
                    speed: 500,
                    pauseOnHover: true,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    responsive: [
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
                        },
                      },
                      {
                        breakpoint: 768,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                    ],
                    prevArrow: <ComponentArrowPrev />,
                    nextArrow: <ComponentArrowNext />,
                  }}
                >
                  {dataListLectureByUser.map((lecture, index) => {
                    return (
                      <div key={index} className="px-[10px]">
                        <ComponentCardLecture
                          id={lecture.id}
                          title={lecture.title}
                          thumbnail={lecture.thumbnail}
                          teacherNickname={lecture.teacher_nickname}
                          status={lecture.status}
                          tags={lecture.tags}
                        />
                      </div>
                    );
                  })}
                </Slider>
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center">
                  신청한 강좌가 존재하지 않습니다
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ComponentCarouselLectureUser;
