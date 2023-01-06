import * as React from 'react';
import { isArray } from 'lodash';
import Slider, { CustomArrowProps, Settings } from 'react-slick';
import useSWRImmutable from 'swr/immutable';
import { IResourceContent } from '../../interfaces';
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
    <div className="mt-[30px] xl:max-w-[1152px] lg:max-w-[966px] md:max-w-[788px] xs:w-full px-[30px] lg:px-[10px] mx-auto pt-[36px] pb-[32px]">
      <div className="text-center text-[#515A6E] sm:text-[1.5rem] text-[1.1875rem] font-semibold mb-[28px]">
        이미 다양한 기관들이 나루온과 함께하고 있어요
      </div>
      {!!dataResourceContent &&
      isArray(dataResourceContent) &&
      dataResourceContent.length > 0 ? (
        <>
          <MediaQuery maxWidth={767.98}>
            <Slider
              {...{ ...settings, slidesToShow: 1, slidesToScroll: 1 }}
              className="bg-white text-center"
            >
              {dataResourceContent.map((element, index) => {
                return (
                  <div className="px-[10px]">
                    <img
                      key={index}
                      className="pointer-events-none min-w-[289px] max-w-[289px] min-h-[68px] max-h-[68px] object-cover mx-auto"
                      src={element.content}
                    />
                  </div>
                );
              })}
            </Slider>
          </MediaQuery>
          <MediaQuery minWidth={768} maxWidth={1023.98}>
            <Slider
              {...{ ...settings, slidesToShow: 2, slidesToScroll: 1 }}
              className="bg-white text-center"
            >
              {dataResourceContent.map((element, index) => {
                return (
                  <div className="px-[10px]">
                    <img
                      key={index}
                      className="pointer-events-none min-w-[289px] max-w-[289px] min-h-[68px] max-h-[68px] object-cover"
                      src={element.content}
                    />
                  </div>
                );
              })}
            </Slider>
          </MediaQuery>
          <MediaQuery minWidth={1024} maxWidth={1199.98}>
            <Slider
              {...{ ...settings, slidesToShow: 2, slidesToScroll: 1 }}
              className="bg-white text-center"
            >
              {dataResourceContent.map((element, index) => {
                return (
                  <div className="px-[10px]">
                    <img
                      key={index}
                      className="pointer-events-none min-w-[289px] max-w-[289px] min-h-[68px] max-h-[68px] object-cover"
                      src={element.content}
                    />
                  </div>
                );
              })}
            </Slider>
          </MediaQuery>
          <MediaQuery minWidth={1200} maxWidth={1535.98}>
            <Slider
              {...{ ...settings, slidesToShow: 3, slidesToScroll: 1 }}
              className="bg-white text-center"
            >
              {dataResourceContent.map((element, index) => {
                return (
                  <div className="px-[10px]">
                    <img
                      key={index}
                      className="pointer-events-none min-w-[289px] max-w-[289px] min-h-[68px] max-h-[68px] object-cover"
                      src={element.content}
                    />
                  </div>
                );
              })}
            </Slider>
          </MediaQuery>
          <MediaQuery minWidth={1536}>
            <Slider
              {...{ ...settings, slidesToShow: 4, slidesToScroll: 1 }}
              className="bg-white text-center"
            >
              {dataResourceContent.map((element, index) => {
                return (
                  <div className="px-[10px]">
                    <img
                      key={index}
                      className="pointer-events-none min-w-[289px] max-w-[289px] min-h-[68px] max-h-[68px] object-cover"
                      src={element.content}
                    />
                  </div>
                );
              })}
            </Slider>
          </MediaQuery>
        </>
      ) : (
        <ComponentSkeletonCustom className="w-[100vw] min-h-[300px]" />
      )}
    </div>
  );
};

export default ComponentCarouselOrg;
