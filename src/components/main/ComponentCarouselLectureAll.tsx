import { FC, useState, useEffect } from 'react';
import Slider, { CustomArrowProps } from 'react-slick';
import ComponentCardLecture from '../lecture/ComponentCardLecture';
import { ReactComponent as ArrowPrev } from '../../assets/images/PrevArrow.svg';
import { ReactComponent as ArrowNext } from '../../assets/images/NextArrow.svg';
import { useSWRListLectureAll } from '../../hooks/api';
import { useMediaQuery } from 'react-responsive';
import ComponentSkeletonCustom from '../common/ui/ComponentSkeletonCustom';

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

const ComponentCarouselLectureAll: FC = () => {
  const {
    data: dataListLectureAll,
    isValidating: isValidatingListLectureAll,
    error: errorListLectureAll,
  } = useSWRListLectureAll();
  const [isLoadingListLectureAll, setIsLoadingListLectureAll] = useState(false);
  useEffect(() => {
    setIsLoadingListLectureAll(
      (!!!dataListLectureAll && !!!errorListLectureAll) ||
        isValidatingListLectureAll,
    );
  }, [dataListLectureAll, isValidatingListLectureAll, errorListLectureAll]);
  return (
    <>
      <div className="text-2xl font-semibold text-gray-400">
        모든 강좌
        {!!dataListLectureAll &&
          !!!errorListLectureAll &&
          dataListLectureAll.length >= 0 &&
          ` (${dataListLectureAll.length})`}
      </div>
      <div className="mb-7 mt-2 text-gray-300">
        완료 혹은 진행중인 전체 강좌를 살펴보세요
      </div>
      {isLoadingListLectureAll ? (
        <ComponentSkeletonCustom className="min-h-[444px] w-full" />
      ) : (
        <>
          {!!dataListLectureAll && dataListLectureAll.length > 0 ? (
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
              {dataListLectureAll.map((lecture, index) => {
                return (
                  <div key={index} className="px-[10px]">
                    <ComponentCardLecture
                      id={lecture.id}
                      title={lecture.title}
                      thumbnail={lecture.thumbnail}
                      teacherNickname={lecture.teacher_nickname}
                      status={null}
                      tags={lecture.tags}
                    />
                  </div>
                );
              })}
            </Slider>
          ) : (
            <div className="flex h-[300px] w-full items-center justify-center">
              강좌가 존재하지 않습니다
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ComponentCarouselLectureAll;
