import { isArray } from 'lodash';
import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import { useGetSWR } from '../../hooks/api';
import { IResourceContent } from '../../interfaces';
import PrevArrow from '../../assets/images/PrevArrow.svg';
import NextArrow from '../../assets/images/NextArrow.svg';

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
        left: '0px',
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
        right: '0px',
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
}

const OrgCarousel: FC = () => {
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
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
    prevArrow: <LectureCardPrevArrow />,
    nextArrow: <LectureCardNextArrow />,
  };
  const { data } = useGetSWR<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/org_carousel`,
    null,
    false,
  );
  return (
    <div className="xl:max-w-[1152px] lg:max-w-[864px] md:max-w-[680px] sm:max-w-[500px] xs:max-w-[400px] mx-auto mt-[122px] pt-[36px] pb-[32px]">
      <div className="text-center text-[#515A6E] leading-[150%] sm:text-[24px] text-[19px] font-semibold mb-[28px]">
        이미 다양한 기관들이 나루온과 함께하고 있어요.
      </div>
      {data && isArray(data) && data.length > 0 ? (
        <Slider {...settings} className="bg-white">
          {data.map((element, index) => {
            return (
              <img
                key={index}
                className="min-w-[289px] max-w-[289px] min-h-[68px] max-h-[68px] object-fit"
                src={element.content}
              />
            );
          })}
        </Slider>
      ) : (
        <Skeleton className="w-full h-[96px]" />
      )}
    </div>
  );
};

export default OrgCarousel;
