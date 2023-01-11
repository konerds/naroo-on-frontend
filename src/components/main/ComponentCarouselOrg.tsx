import * as React from 'react';
import { isArray } from 'lodash';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import useSWRImmutable from 'swr/immutable';
import { IResourceContent } from '../../interfaces';
import { ReactComponent as ImgPrevArrow } from '../../assets/images/PrevArrow.svg';
import { ReactComponent as ImgNextArrow } from '../../assets/images/NextArrow.svg';
import { axiosGetfetcher } from '../../hooks/api';
import { useMediaQuery } from 'react-responsive';
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
        left: useMediaQuery({ minWidth: 1536 }) ? '-45px' : '5px',
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
        right: useMediaQuery({ minWidth: 1536 }) ? '-45px' : '5px',
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
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1536,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1200,
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
};

const ComponentCarouselOrg: React.FC = () => {
  const { data: dataResourceContent } = useSWRImmutable<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/org_carousel`,
    () =>
      axiosGetfetcher(
        `${process.env.REACT_APP_BACK_URL}/resource/org_carousel`,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  return (
    <div className="mx-auto w-full px-[30px] py-[36px] md:max-w-[788px] lg:max-w-[966px] lg:px-[10px] xl:max-w-[1152px]">
      <div className="mb-[28px] text-center text-[1.1875rem] font-semibold text-[#515A6E] sm:text-[1.5rem]">
        이미 다양한 기관들이 나루온과 함께하고 있어요
      </div>
      {!!dataResourceContent &&
      isArray(dataResourceContent) &&
      dataResourceContent.length > 0 ? (
        <>
          <Slider {...settings} className="bg-white text-center">
            {dataResourceContent.map((element, index) => {
              return (
                <div key={index} className="px-[10px]">
                  <img
                    className="pointer-events-none mx-auto max-h-[68px] min-h-[68px] min-w-[289px] max-w-[289px] object-cover"
                    src={element.content}
                  />
                </div>
              );
            })}
          </Slider>
        </>
      ) : (
        <ComponentSkeletonCustom className="min-h-[300px] w-[100vw]" />
      )}
    </div>
  );
};

export default ComponentCarouselOrg;
