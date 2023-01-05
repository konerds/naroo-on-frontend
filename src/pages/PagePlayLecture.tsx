import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import ContextToken from '../store/ContextToken';
import useSWR from 'swr';
import { isArray } from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import ComponentElementTag from '../components/common/ComponentElementTag';
import { IInfoMe, ILectureVideoDetail } from '../interfaces';
import { axiosGetfetcher } from '../hooks/api';

const PagePlayLecture: React.FC = () => {
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
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
  const { token } = tokenCtx;
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: dataLectureVideo, error: errorLectureVideo } =
    useSWR<ILectureVideoDetail>(
      !!dataGetMe && !!!errorGetMe
        ? `${process.env.REACT_APP_BACK_URL}/lecture/video/${id}`
        : null,
      () =>
        axiosGetfetcher(
          `${process.env.REACT_APP_BACK_URL}/lecture/video/${id}`,
          token,
        ),
      { revalidateOnFocus: false, revalidateIfStale: false },
    );
  React.useEffect(() => {
    if (token === '' || !!errorGetMe || !!!id) {
      navigate('/', { replace: true });
    }
  }, [token, dataGetMe, errorGetMe]);
  return (
    <div className="w-full bg-gray-500 min-h-[inherit] pt-[5px]">
      {!!token &&
        !!dataGetMe &&
        !!!errorGetMe &&
        !!dataLectureVideo &&
        !!!errorLectureVideo &&
        !!dataLectureVideo.video_url &&
        !!dataLectureVideo.video_title && (
          <div className="bg-gray-500">
            {dataLectureVideo.status === 'accept' && (
              <>
                {!!dataLectureVideo.tags && isArray(dataLectureVideo.tags) ? (
                  <>
                    {dataLectureVideo.tags.length > 0 ? (
                      <Slider
                        className="cursor-grab flex w-full px-[5px]"
                        {...settings}
                      >
                        {dataLectureVideo.tags.map((tag) => {
                          return (
                            <div className="max-w-max py-[5px]" key={tag.id}>
                              <ComponentElementTag name={tag.name} />
                            </div>
                          );
                        })}
                      </Slider>
                    ) : (
                      <div className="p-[10px] text-xs text-white">
                        태그가 존재하지 않습니다
                      </div>
                    )}
                  </>
                ) : (
                  <Skeleton className="w-full h-[34px]" />
                )}
                <div className="w-[100vw] flex pl-[9px] pb-[9px] text-4xl text-white font-medium">
                  {dataLectureVideo.video_title}
                </div>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={dataLectureVideo.video_url}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </>
            )}
            {dataLectureVideo.status !== 'accept' && (
              <>
                <div className="flex p-[10px] items-center">
                  <div className="py-1 text-xs text-white">
                    잘못된 접근입니다
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
    </div>
  );
};

export default PagePlayLecture;
