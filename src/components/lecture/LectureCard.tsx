import { isArray } from 'lodash';
import { FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import Slider, { Settings } from 'react-slick';
import { ITags } from '../../interfaces';
import Tag from '../common/Tag';
import PlayIcon from '../../assets/images/Play.svg';

interface LectureCardProps {
  id: string;
  title: string;
  thumbnail: string;
  teacherNickname: string;
  status: string | null;
  expired: string | null;
  tags: ITags[] | [] | null;
}

const LectureCard: FC<LectureCardProps> = ({
  id,
  title,
  thumbnail,
  teacherNickname,
  status,
  expired,
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
  const [isBackdropShow, setIsBackdropShow] = useState<boolean>(false);
  return (
    <div
      className={`w-full lg:w-[261px] min-h-[444px] max-h-[444px] mx-0 rounded-[8px] ${
        isBackdropShow
          ? 'lecture-card-container lecture-card-container-hover'
          : 'lecture-card-container'
      }`}
    >
      <Link
        to={`/lecture/${id}`}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          className={`rounded-t-[8px] w-full min-h-[261px] max-h-[261px] bg-cover relative ${
            isBackdropShow
              ? 'lecture-card-container lecture-card-container-hover'
              : 'lecture-card-container'
          }`}
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
          onMouseEnter={() => {
            setIsBackdropShow(true);
          }}
          onMouseLeave={() => {
            setIsBackdropShow(false);
          }}
        >
          <div
            className={`rounded-t-[8px] w-full min-h-[261px] max-h-[261px] z-[999] hover:bg-[#0000004D] ${
              isBackdropShow ? 'absolute' : 'hidden'
            }`}
          >
            <div className="flex items-center justify-center min-h-[261px] max-h-[261px]">
              <img src={PlayIcon} />
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-wrap items-center w-full min-h-[183px] max-h-[183px] pt-[12px]">
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
        <div className="w-full max-h-[48px] overflow-hidden px-[20px] text-[16px] font-semibold leading-[150%] text-[#17233D]">
          {title}
        </div>
        <div className="w-full px-[20px] font-medium text-[12px] leading-[150%] text-[#808695]">
          {teacherNickname}
        </div>
        {tags && isArray(tags) && tags.length > 0 ? (
          <div
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            <Slider
              className="flex w-full md:max-w-[261px] px-[20px] mb-[16px]"
              {...settings}
            >
              {tags.map((tag) => {
                return (
                  <div className="max-w-max py-[5px]" key={tag.id}>
                    <Tag name={tag.name} />
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : tags && isArray(tags) && tags.length === 0 ? (
          <div className="w-full h-[34px] px-[20px] text-xs text-gray-200">
            태그가 존재하지 않습니다!
          </div>
        ) : (
          <Skeleton className="w-full h-[34px]" />
        )}
      </div>
    </div>
  );
};

export default LectureCard;
