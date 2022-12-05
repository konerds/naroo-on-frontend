import { isArray } from 'lodash';
import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import Tag from '../components/common/Tag';
import { useGetSWR } from '../hooks/api';
import { ILectureVideoDetail } from '../interfaces';

interface LecturePlayLayoutProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
}

const LecturePlayLayout: FC<LecturePlayLayoutProps> = ({ token, setToken }) => {
  const { id } = useParams<{ id: string }>();
  const settings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    variableWidth: true,
  };
  const { data: lectureVideoData } = useGetSWR<ILectureVideoDetail>(
    `${process.env.REACT_APP_BACK_URL}/lecture/video/${id}`,
    token,
    true,
  );
  return (
    <>
      {token &&
        lectureVideoData &&
        lectureVideoData.video_url &&
        lectureVideoData.video_title && (
          <div className="bg-gray-500">
            {lectureVideoData.status === 'accept' && (
              <>
                {lectureVideoData.tags &&
                isArray(lectureVideoData.tags) &&
                lectureVideoData.tags.length > 0 ? (
                  <Slider className="flex w-full px-[5px]" {...settings}>
                    {lectureVideoData.tags.map((tag) => {
                      return (
                        <div className="max-w-max py-[5px]" key={tag.id}>
                          <Tag name={tag.name} />
                        </div>
                      );
                    })}
                  </Slider>
                ) : lectureVideoData.tags &&
                  isArray(lectureVideoData.tags) &&
                  lectureVideoData.tags.length === 0 ? (
                  <div className="p-[10px] text-xs text-white">
                    태그가 존재하지 않습니다!
                  </div>
                ) : (
                  <Skeleton className="w-full h-[34px]" />
                )}
                <div className="w-[100vw] flex pl-[9px] pb-[9px] text-4xl text-white font-medium">
                  {lectureVideoData.video_title}
                </div>
                <div className="w-[100vw] flex aspect-w-16 aspect-h-9">
                  <iframe
                    src={lectureVideoData.video_url}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  )
                </div>
              </>
            )}
            {lectureVideoData.status !== 'accept' && (
              <>
                <div className="flex p-[10px] items-center">
                  <div className="py-1 text-xs text-white">
                    잘못된 접근입니다!
                  </div>
                </div>
                <div className="w-[100vw] flex">
                  <div className="flex-grow w-full min-h-[69.1vh] max-h-[69.1vh]">
                    <Skeleton className="w-[80%] p-0 m-0 h-full" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
    </>
  );
};

export default LecturePlayLayout;
