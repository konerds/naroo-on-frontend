import * as React from 'react';
import { isArray } from 'lodash';
import { Link } from 'react-router-dom';
import Slider, { Settings } from 'react-slick';
import { ITags } from '../../interfaces';
import ComponentElementTag from '../common/ComponentElementTag';
import PlayIcon from '../../assets/images/Play.svg';
import ComponentSkeletonCustom from '../common/ui/ComponentSkeletonCustom';

interface IPropsComponentCardLecture {
  id: string;
  title: string;
  thumbnail: string;
  teacherNickname: string;
  status: string | null;
  tags: ITags[] | [] | null;
}

const ComponentCardLecture: React.FC<IPropsComponentCardLecture> = ({
  id,
  title,
  thumbnail,
  teacherNickname,
  status,
  tags,
}) => {
  const settings: Settings | Readonly<Settings> = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    variableWidth: true,
  };
  const [isBackdropShow, setIsBackdropShow] = React.useState<boolean>(false);
  return (
    <div
      className={`mx-0 max-h-[444px] min-h-[444px] w-full rounded-[8px]${
        isBackdropShow
          ? ' lecture-card-container lecture-card-container-hover'
          : ' lecture-card-container'
      }`}
      onMouseEnter={() => {
        setIsBackdropShow(true);
      }}
      onMouseLeave={() => {
        setIsBackdropShow(false);
      }}
    >
      <Link
        className="cursor-pointer"
        to={`/lecture/${id}`}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          className={`relative max-h-[261px] min-h-[261px] w-full rounded-t-[8px] bg-cover${
            isBackdropShow
              ? ' lecture-card-container lecture-card-container-hover'
              : ' lecture-card-container'
          }`}
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
        >
          <div
            className={`z-[999] max-h-[261px] min-h-[261px] w-full rounded-t-[8px]${
              isBackdropShow ? ' absolute bg-[#0000004D]' : ' hidden'
            }`}
          >
            <div className="flex max-h-[261px] min-h-[261px] items-center justify-center">
              <img src={PlayIcon} />
            </div>
          </div>
        </div>
      </Link>
      <div className="flex max-h-[183px] min-h-[183px] w-full flex-wrap items-center pt-[12px]">
        {status && (
          <div className="w-full px-[10px] text-[12px] text-[#808695]">
            {status === 'accept'
              ? '승인 완료'
              : status === 'apply'
              ? '승인 대기'
              : status === 'expired'
              ? '수강 만료'
              : ''}
          </div>
        )}
        <div className="max-h-[48px] w-full overflow-hidden px-[20px] text-[16px] font-semibold text-[#17233D]">
          {title}
        </div>
        <div className="w-full px-[20px] text-[12px] font-medium text-[#808695]">
          {teacherNickname}
        </div>
        {!!tags && isArray(tags) ? (
          <>
            {tags.length > 0 ? (
              <div
                className="max-w-full"
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
              >
                <Slider
                  className="mb-[16px] flex w-full cursor-grab px-[20px] md:max-w-[261px]"
                  {...settings}
                >
                  {tags.map((tag, index) => {
                    return (
                      <div className="max-w-max py-[5px]" key={index}>
                        <ComponentElementTag name={tag.name} />
                      </div>
                    );
                  })}
                </Slider>
              </div>
            ) : (
              <div className="h-[34px] w-full px-[20px] text-xs text-gray-200">
                태그가 존재하지 않습니다
              </div>
            )}
          </>
        ) : (
          <ComponentSkeletonCustom className="w-full-important min-h-[34px]" />
        )}
      </div>
    </div>
  );
};

export default ComponentCardLecture;
