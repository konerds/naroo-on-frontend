import { FC, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import ComponentElementTag from '../components/common/ComponentElementTag';
import { useSWRInfoMe, useSWRVideoLecture } from '../hooks/api';
import ComponentSkeletonCustom from '../components/common/ui/ComponentSkeletonCustom';
import YouTube from 'react-youtube';
import stateToken from '../recoil/state-object-token/stateToken';

const PagePlayLecture: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useRecoilValue(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  const {
    data: dataVideoLecture,
    isValidating: isValidatingVideoLecture,
    error: errorVideoLecture,
  } = useSWRVideoLecture(id);
  const [isLoadingVideoLecture, setIsLoadingVideoLecture] = useState(false);
  const [isTypeVideoYoutube, setIsTypeVideoYoutube] = useState<boolean>(false);
  const [idVideoYoutube, setIdVideoYoutube] = useState('');
  useEffect(() => {
    setIsLoadingVideoLecture(
      (!!!dataVideoLecture && !!!errorVideoLecture) || isValidatingVideoLecture,
    );
  }, [dataVideoLecture, isValidatingVideoLecture, errorVideoLecture]);
  useEffect(() => {
    if (!!!token || !!!id) {
      navigate('/', { replace: true });
    }
  }, [token, id]);
  useEffect(() => {
    if (dataVideoLecture && dataVideoLecture.video_url) {
      if (dataVideoLecture.video_url.includes('youtube.com')) {
        setIsTypeVideoYoutube(true);
      }
    }
  }, [dataVideoLecture?.video_url]);
  useEffect(() => {
    if (isTypeVideoYoutube && dataVideoLecture && dataVideoLecture.video_url) {
      const url = new URL(dataVideoLecture.video_url);
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
        !!dataInfoMe &&
        !!dataVideoLecture &&
        !!!errorVideoLecture &&
        !!dataVideoLecture.video_url &&
        !!dataVideoLecture.video_title && (
          <div className="bg-gray-500">
            {dataVideoLecture.status === 'accept' && (
              <>
                {isLoadingVideoLecture ? (
                  <ComponentSkeletonCustom className="w-full-important min-h-[34px]" />
                ) : (
                  <>
                    {!!dataVideoLecture &&
                    !!!errorVideoLecture &&
                    dataVideoLecture.tags &&
                    Array.isArray(dataVideoLecture.tags) &&
                    dataVideoLecture.tags.length > 0 ? (
                      <Slider
                        className="flex w-full cursor-grab px-[5px]"
                        {...{
                          arrows: false,
                          dots: false,
                          infinite: false,
                          speed: 500,
                          slidesToShow: 1,
                          slidesToScroll: 1,
                          pauseOnHover: true,
                          variableWidth: true,
                        }}
                      >
                        {dataVideoLecture.tags.map((tag, index) => {
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
                )}
                <div className="flex w-[100vw] pb-[9px] pl-[9px] text-4xl font-medium text-white">
                  {dataVideoLecture.video_title}
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
                      src={dataVideoLecture.video_url}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </>
            )}
            {dataVideoLecture.status !== 'accept' && (
              <>
                <div className="flex items-center p-[10px]">
                  <div className="py-1 text-xs text-white">
                    잘못된 접근입니다
                  </div>
                </div>
                <div className="flex w-[100vw]">
                  <div className="max-h-[69.1vh] min-h-[69.1vh] w-full flex-grow">
                    <ComponentSkeletonCustom className="w-screen-important m-0 min-h-[100%] p-0" />
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
