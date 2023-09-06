import { FC, useState, useEffect } from 'react';
import Slider, { CustomArrowProps } from 'react-slick';
import { ReactComponent as ArrowPrev } from '../../assets/images/PrevArrow.svg';
import { ReactComponent as ArrowNext } from '../../assets/images/NextArrow.svg';
import { useSWRListOrgCarousel } from '../../hooks/api';
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
        left: useMediaQuery({ minWidth: 1536 }) ? '-45px' : '5px',
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
        right: useMediaQuery({ minWidth: 1536 }) ? '-45px' : '5px',
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const ComponentCarouselOrg: FC = () => {
  const {
    data: dataListContentResource,
    isValidating: isValidatingListContentResource,
    error: errorListContentResource,
  } = useSWRListOrgCarousel();
  const [isLoadingListContentResource, setIsLoadingListContentResource] =
    useState(false);
  useEffect(() => {
    setIsLoadingListContentResource(
      (!!!dataListContentResource && !!!errorListContentResource) ||
        isValidatingListContentResource,
    );
  }, [
    dataListContentResource,
    isValidatingListContentResource,
    errorListContentResource,
  ]);
  return (
    <div className="max-w-screen md:w-788px mx-auto w-screen px-[30px] py-[36px] md:max-w-[788px] lg:w-[966px] lg:max-w-[966px] lg:px-[10px] xl:w-[1152px] xl:max-w-[1152px]">
      <div className="mb-[28px] text-center text-[1.1875rem] font-semibold text-[#515A6E] sm:text-[1.5rem]">
        이미 다양한 기관들이 나루온과 함께하고 있어요
      </div>
      {isLoadingListContentResource ? (
        <ComponentSkeletonCustom className="min-h-[80px] w-[100vw]" />
      ) : (
        <>
          {!!dataListContentResource &&
            !!!errorListContentResource &&
            dataListContentResource.length > 0 && (
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
                }}
                className="bg-white text-center"
              >
                {dataListContentResource.map((element, index) => {
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
            )}
        </>
      )}
    </div>
  );
};

export default ComponentCarouselOrg;
