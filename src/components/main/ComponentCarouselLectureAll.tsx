import * as React from 'react';
import { isArray } from 'lodash';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import useSWR from 'swr';
import { ILectureInList } from '../../interfaces';
import ComponentCardLecture from '../lecture/ComponentCardLecture';
import { ReactComponent as ImgPrevArrow } from '../../assets/images/PrevArrow.svg';
import { ReactComponent as ImgNextArrow } from '../../assets/images/NextArrow.svg';
import { axiosGetfetcher } from '../../hooks/api';
import { useMediaQuery } from 'react-responsive';
import MediaQuery from 'react-responsive';
import ComponentSkeletonCustom from '../common/ui/ComponentSkeletonCustom';

const ComponentArrowPrev = (props: CustomArrowProps) => {
  return (
    <ImgPrevArrow
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
    <ImgNextArrow
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

const settings: Settings | Readonly<Settings> = {
  arrows: true,
  dots: false,
  infinite: false,
  speed: 500,
  pauseOnHover: true,
  prevArrow: <ComponentArrowPrev />,
  nextArrow: <ComponentArrowNext />,
};

const ComponentCarouselLectureAll: React.FC = () => {
  const { data: dataAllLectures, error: errorAllLectures } = useSWR<
    ILectureInList[]
  >(
    `${process.env.REACT_APP_BACK_URL}/lecture/all`,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/lecture/all`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  return (
    <>
      <div className="text-2xl font-semibold text-gray-400">
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
            <>
              <MediaQuery maxWidth={767.98}>
                <Slider
                  {...{ ...settings, slidesToShow: 1, slidesToScroll: 1 }}
                >
                  {dataAllLectures.map((lecture, index) => {
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
              </MediaQuery>
              <MediaQuery minWidth={768} maxWidth={1023.98}>
                <Slider
                  {...{ ...settings, slidesToShow: 2, slidesToScroll: 1 }}
                >
                  {dataAllLectures.map((lecture, index) => {
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
              </MediaQuery>
              <MediaQuery minWidth={1024} maxWidth={1199.98}>
                <Slider
                  {...{ ...settings, slidesToShow: 3, slidesToScroll: 1 }}
                >
                  {dataAllLectures.map((lecture, index) => {
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
              </MediaQuery>
              <MediaQuery minWidth={1200}>
                <Slider
                  {...{ ...settings, slidesToShow: 4, slidesToScroll: 1 }}
                >
                  {dataAllLectures.map((lecture, index) => {
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
              </MediaQuery>
            </>
          ) : (
            <div className="flex w-full h-[300px] justify-center items-center">
              강좌가 존재하지 않습니다
            </div>
          )}
        </>
      ) : (
        <ComponentSkeletonCustom className="w-full min-h-[444px]" />
      )}
    </>
  );
};

export default ComponentCarouselLectureAll;
