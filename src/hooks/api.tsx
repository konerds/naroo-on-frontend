import axios from 'axios';
import { useRecoilState, SetterOrUpdater } from 'recoil';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { toast } from 'react-toastify';
import {
  IInfoMe,
  ILectureDetail,
  ILectureInList,
  ILectureInListAdmin,
  ILectureVideoDetail,
  IResourceContent,
  IResources,
  ITags,
  IUserEdit,
  IUserVerify,
} from '../interfaces';
import stateToken from '../recoil/state-object-token/stateToken';

export function showError(error: any) {
  const defaultMessage = '네트워크 오류가 발생하였습니다';
  const messageData = error.response?.data?.message;
  if (Array.isArray(messageData)) {
    toast(
      <div>
        <p className="xs:text-md mb-[10px] text-sm text-[#e74c3c] sm:mb-[20px] sm:text-2xl">
          다음과 같은 오류가 발생하였습니다
        </p>
        {messageData.length > 0
          ? messageData.map((message, index) => {
              return (
                <p
                  key={index}
                  className="sm:text-md ml-[20px] mt-[3px] text-xs xs:text-sm sm:mt-[10px]"
                >
                  {message}
                </p>
              );
            })
          : defaultMessage}
      </div>,
      {
        type: 'error',
      },
    );
  } else {
    toast(
      <div>
        <p className="xs:text-md text-sm text-[#e74c3c] sm:text-2xl">
          다음과 같은 오류가 발생하였습니다
        </p>
        <br />
        <p className="sm:text-md ml-[20px] mt-[5px] text-xs xs:text-sm sm:mt-[10px]">
          {messageData || defaultMessage}
        </p>
      </div>,
      {
        type: 'error',
      },
    );
  }
}

const getHeaderBearer = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetcherAxios = async (
  url: string,
  token?: string,
  setToken?: SetterOrUpdater<string>,
) => {
  const headerRequest = token ? getHeaderBearer(token) : undefined;
  try {
    const response = await axios.get(url, headerRequest);
    return response.data;
  } catch (error: any) {
    if (url === `${process.env.REACT_APP_BACK_URL}/user/me` && setToken) {
      setToken('');
      window.location.reload();
    } else {
      throw error;
    }
  }
};

export const useSWRListLectureAll = () => {
  return useSWR<ILectureInList[]>(
    `${process.env.REACT_APP_BACK_URL}/lecture/all`,
    () => fetcherAxios(`${process.env.REACT_APP_BACK_URL}/lecture/all`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRInfoMe = () => {
  const [token, setToken] = useRecoilState(stateToken);
  return useSWR<IInfoMe>(
    token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/user/me`,
        token,
        setToken,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRListUserAll = () => {
  const [token, setToken] = useRecoilState(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  return useSWR<IUserEdit[]>(
    dataInfoMe && dataInfoMe.role === 'admin'
      ? `${process.env.REACT_APP_BACK_URL}/user/admin/user`
      : null,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/user/admin/user`,
        token,
        setToken,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRListStatusLecture = () => {
  const [token, setToken] = useRecoilState(stateToken);
  return useSWR<ILectureInListAdmin[]>(
    token ? `${process.env.REACT_APP_BACK_URL}/lecture/admin/status` : null,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/status`,
        token,
        setToken,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRListLogoFooter = () => {
  return useSWRImmutable<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/footer_logo`,
    () =>
      fetcherAxios(`${process.env.REACT_APP_BACK_URL}/resource/footer_logo`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRListLogoHeader = () => {
  return useSWRImmutable<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/header_logo`,
    () =>
      fetcherAxios(`${process.env.REACT_APP_BACK_URL}/resource/header_logo`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRListLectureByUser = () => {
  const [token, setToken] = useRecoilState(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  return useSWR<ILectureInList[]>(
    dataInfoMe ? `${process.env.REACT_APP_BACK_URL}/lecture` : null,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/lecture`,
        token,
        setToken,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRListOrgCarousel = () => {
  return useSWRImmutable<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/org_carousel`,
    () =>
      fetcherAxios(`${process.env.REACT_APP_BACK_URL}/resource/org_carousel`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRListTagAll = () => {
  const [token, setToken] = useRecoilState(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  return useSWR<ITags[]>(
    dataInfoMe && dataInfoMe.role === 'admin'
      ? `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag`
      : null,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag`,
        token,
        setToken,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRListResourceAll = () => {
  const [token, setToken] = useRecoilState(stateToken);
  return useSWR<IResources[]>(
    `${process.env.REACT_APP_BACK_URL}/resource`,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/resource`,
        token,
        setToken,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRDetailLecture = (idLecture: string | undefined) => {
  const [token, setToken] = useRecoilState(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  return dataInfoMe
    ? useSWR<ILectureDetail>(
        idLecture
          ? `${process.env.REACT_APP_BACK_URL}/lecture/${idLecture}`
          : null,
        () =>
          fetcherAxios(
            `${process.env.REACT_APP_BACK_URL}/lecture/${idLecture}`,
            token,
            setToken,
          ),
        { revalidateOnFocus: false, revalidateIfStale: false },
      )
    : useSWR<ILectureDetail>(
        idLecture
          ? `${process.env.REACT_APP_BACK_URL}/lecture/guest/${idLecture}`
          : null,
        () =>
          fetcherAxios(
            `${process.env.REACT_APP_BACK_URL}/lecture/guest/${idLecture}`,
          ),
        { revalidateOnFocus: false, revalidateIfStale: false },
      );
};

export const useSWRListBannerPrimary = () => {
  return useSWRImmutable<IResourceContent[]>(
    `${process.env.REACT_APP_BACK_URL}/resource/info_banner`,
    () =>
      fetcherAxios(`${process.env.REACT_APP_BACK_URL}/resource/info_banner`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRIsVerify = (
  pathname: string,
  requestToken: string | undefined,
) => {
  return useSWR<IUserVerify>(
    pathname.includes('/verify') && !!requestToken
      ? `${process.env.REACT_APP_BACK_URL}/user/verify?requestToken=${requestToken}`
      : null,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/user/verify?requestToken=${requestToken}`,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRVideoLecture = (idVideo: string | undefined) => {
  const [token, setToken] = useRecoilState(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  return useSWR<ILectureVideoDetail>(
    dataInfoMe && idVideo
      ? `${process.env.REACT_APP_BACK_URL}/lecture/video/${idVideo}`
      : null,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/lecture/video/${idVideo}`,
        token,
        setToken,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};

export const useSWRProfileUser = () => {
  const [token, setToken] = useRecoilState(stateToken);
  const { data: dataInfoMe } = useSWRInfoMe();
  return useSWR<IUserEdit>(
    dataInfoMe ? `${process.env.REACT_APP_BACK_URL}/user/myinfo` : null,
    () =>
      fetcherAxios(
        `${process.env.REACT_APP_BACK_URL}/user/myinfo`,
        token,
        setToken,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
};
