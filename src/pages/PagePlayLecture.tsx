import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import ContextToken from '../store/ContextToken';
import useSWR from 'swr';
import { isArray } from 'lodash';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import ComponentElementTag from '../components/common/ComponentElementTag';
import { IInfoMe, ILectureVideoDetail } from '../interfaces';
import { axiosGetfetcher } from '../hooks/api';
import ComponentSkeletonCustom from '../components/common/ui/ComponentSkeletonCustom';
import YouTube from 'react-youtube';

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
  const { data: dataGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: dataLectureVideo, error: errorLectureVideo } =
    useSWR<ILectureVideoDetail>(
      !!token && !!dataGetMe
        ? `${process.env.REACT_APP_BACK_URL}/lecture/video/${id}`
        : null,
      () =>
        axiosGetfetcher(
          `${process.env.REACT_APP_BACK_URL}/lecture/video/${id}`,
          token,
        ),
      { revalidateOnFocus: false, revalidateIfStale: false },
    );
  const [isTypeVideoYoutube, setIsTypeVideoYoutube] =
    React.useState<boolean>(false);
  const [idVideoYoutube, setIdVideoYoutube] = React.useState('');
  React.useEffect(() => {
    if (!!!token || !!!id) {
      navigate('/', { replace: true });
    }
  }, [token, id]);
  React.useEffect(() => {
    if (dataLectureVideo && dataLectureVideo.video_url) {
      if (dataLectureVideo.video_url.includes('youtube.com')) {
        setIsTypeVideoYoutube(true);
      }
    }
  }, [dataLectureVideo?.video_url]);
  React.useEffect(() => {
    if (isTypeVideoYoutube && dataLectureVideo && dataLectureVideo.video_url) {
      const url = new URL(dataLectureVideo.video_url);
      if (url) {
        const { searchParams } = url;
        if (searchParams) {
          const id = searchParams.get('v');
          if (id) {
            setIdVideoYoutube(id);
          }
        }
      }
    }
  }, [isTypeVideoYoutube]);
  return (
    <div className="min-h-[inherit] w-full bg-gray-500 pt-[5px]">
      {!!token &&
        !!dataGetMe &&
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
                        className="flex w-full cursor-grab px-[5px]"
                        {...settings}
                      >
                        {dataLectureVideo.tags.map((tag, index) => {
                          return (
                            <div className="max-w-max py-[5px]" key={index}>
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
                  <ComponentSkeletonCustom className="w-full-important min-h-[34px]" />
                )}
                <div className="flex w-[100vw] pb-[9px] pl-[9px] text-4xl font-medium text-white">
                  {dataLectureVideo.video_title}
                </div>
                <div className="aspect-h-9 aspect-w-16">
                  {isTypeVideoYoutube ? (
                    <>
                      {!!idVideoYoutube && (
                        <YouTube
                          className="[&>iframe]:h-full [&>iframe]:w-full"
                          videoId={idVideoYoutube}
                          opts={{
                            playerVars: {
                              autoplay: 1,
                            },
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <iframe
                      src={dataLectureVideo.video_url}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </>
            )}
            {dataLectureVideo.status !== 'accept' && (
              <>
                <div className="flex items-center p-[10px]">
                  <div className="py-1 text-xs text-white">
                    잘못된 접근입니다
                  </div>
                </div>
                <div className="flex w-[100vw]">
                  <div className="max-h-[69.1vh] min-h-[69.1vh] w-full flex-grow">
                    <ComponentSkeletonCustom className="w-full-vw-important m-0 min-h-[100%] p-0" />
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
