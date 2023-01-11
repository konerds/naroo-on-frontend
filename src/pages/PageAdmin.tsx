import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import ComponentFormAddLecture from '../components/admin/ComponentFormAddLecture';
import ComponentContainerEditLecture from '../components/admin/ComponentContainerEditLecture';
import ComponentContainerPermissionLecture from '../components/admin/ComponentContainerPermissionLecture';
import ComponentContainerEditResource from '../components/admin/ComponentContainerEditResource';
import ComponentFormEditTag from '../components/admin/ComponentFormEditTag';
import ComponentContainerEditUser from '../components/admin/ComponentContainerEditUser';
import { axiosGetfetcher } from '../hooks/api';
import {
  CONST_ADMIN_MENU,
  IInfoMe,
  ILectureInList,
  IResources,
  ITags,
  IUserEdit,
  TYPE_ADMIN_MENU,
} from '../interfaces';
import ContextToken from '../store/ContextToken';

const PageAdmin: React.FC = () => {
  const navigate = useNavigate();
  const tokenCtx = React.useContext(ContextToken);
  const { token, setToken } = tokenCtx;
  const { data: dataGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const {
    data: dataUsers,
    mutate: mutateUsers,
    error: errorUsers,
  } = useSWR<IUserEdit[]>(
    !!token && !!dataGetMe && dataGetMe.role === 'admin'
      ? `${process.env.REACT_APP_BACK_URL}/user/admin/user`
      : null,
    () =>
      axiosGetfetcher(
        `${process.env.REACT_APP_BACK_URL}/user/admin/user`,
        token,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const {
    data: dataTags,
    mutate: mutateTags,
    error: errorTags,
  } = useSWR<ITags[]>(
    !!token && !!dataGetMe && dataGetMe.role === 'admin'
      ? `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag`
      : null,
    () =>
      axiosGetfetcher(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag`,
        token,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const {
    data: dataAllLectures,
    mutate: mutateAllLectures,
    error: errorAllLectures,
  } = useSWR<ILectureInList[]>(
    `${process.env.REACT_APP_BACK_URL}/lecture/all`,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/lecture/all`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const {
    data: dataAllResource,
    mutate: mutateAllResources,
    error: errorAllResources,
  } = useSWR<IResources[]>(
    `${process.env.REACT_APP_BACK_URL}/resource`,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/resource`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const [selectedMenu, setSelectedMenu] = React.useState<TYPE_ADMIN_MENU>(
    CONST_ADMIN_MENU.LECTURE_ADD,
  );
  const [isVisibleMenu, setIsVisibleMenu] = React.useState<boolean>(false);
  const refMenuElement = React.useRef<HTMLButtonElement | null>(null);
  const handlerOnMousePositionMenu = (event: any) => {
    if (
      isVisibleMenu &&
      (!!!refMenuElement.current || refMenuElement.current !== event.target)
    ) {
      setIsVisibleMenu(false);
    }
  };
  React.useEffect(() => {
    window.addEventListener('click', handlerOnMousePositionMenu);
    return () =>
      window.removeEventListener('click', handlerOnMousePositionMenu);
  }, [isVisibleMenu]);
  React.useEffect(() => {
    if (!(!!token && !!dataGetMe && dataGetMe.role === 'admin')) {
      navigate('/', { replace: true });
    }
  }, [token, dataGetMe, dataGetMe?.role]);
  return (
    <div className="mt-[20px] mb-auto w-full bg-white">
      {!!dataGetMe && dataGetMe.role === 'admin' && (
        <div className="mx-auto">
          <div className="mx-auto mb-[4vh] max-w-[100vw] text-center text-4xl font-semibold text-gray-400 sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[750px] 2xl:max-w-[900px]">
            관리자 페이지
          </div>
          <div className="hidden md:flex md:items-center md:justify-evenly">
            <button
              className={`min-w-max rounded border-[1px] border-[#515A6E] p-[10px] text-xl hover:opacity-50 ${
                selectedMenu === CONST_ADMIN_MENU.LECTURE_ADD
                  ? 'border-[#678a44] text-[#8DC556]'
                  : 'text-[#515A6E]'
              }`}
              onClick={() => setSelectedMenu(CONST_ADMIN_MENU.LECTURE_ADD)}
            >
              강의 추가
            </button>
            <button
              className={`min-w-max rounded border-[1px] border-[#515A6E] p-[10px] text-xl hover:opacity-50 ${
                selectedMenu === CONST_ADMIN_MENU.LECTURE_EDIT
                  ? 'border-[#8DC556] text-[#8DC556]'
                  : 'text-[#515A6E]'
              }`}
              onClick={() => setSelectedMenu(CONST_ADMIN_MENU.LECTURE_EDIT)}
            >
              강의 관리
            </button>
            <button
              className={`min-w-max rounded border-[1px] border-[#515A6E] p-[10px] text-xl hover:opacity-50 ${
                selectedMenu === CONST_ADMIN_MENU.LECTURE_PERMISSION
                  ? 'border-[#8DC556] text-[#8DC556]'
                  : 'text-[#515A6E]'
              }`}
              onClick={() =>
                setSelectedMenu(CONST_ADMIN_MENU.LECTURE_PERMISSION)
              }
            >
              강의 승인
            </button>
            <button
              className={`min-w-max rounded border-[1px] border-[#515A6E] p-[10px] text-xl hover:opacity-50 ${
                selectedMenu === CONST_ADMIN_MENU.STUDENT_EDIT
                  ? 'border-[#8DC556] text-[#8DC556]'
                  : 'text-[#515A6E]'
              }`}
              onClick={() => setSelectedMenu(CONST_ADMIN_MENU.STUDENT_EDIT)}
            >
              사용자 관리
            </button>
            <button
              className={`min-w-max rounded border-[1px] border-[#515A6E] p-[10px] text-xl hover:opacity-50 ${
                selectedMenu === CONST_ADMIN_MENU.TAG_EDIT
                  ? 'border-[#8DC556] text-[#8DC556]'
                  : 'text-[#515A6E]'
              }`}
              onClick={() => setSelectedMenu(CONST_ADMIN_MENU.TAG_EDIT)}
            >
              태그 관리
            </button>
            <button
              className={`min-w-max rounded border-[1px] border-[#515A6E] p-[10px] text-xl hover:opacity-50 ${
                selectedMenu === CONST_ADMIN_MENU.RESOURCE_EDIT
                  ? 'border-[#8DC556] text-[#8DC556]'
                  : 'text-[#515A6E]'
              }`}
              onClick={() => setSelectedMenu(CONST_ADMIN_MENU.RESOURCE_EDIT)}
            >
              리소스 관리
            </button>
          </div>
          <div className="mx-auto h-full max-w-[90vw] text-center md:hidden">
            <>
              <button
                ref={refMenuElement}
                className="w-full rounded-[4px] border-[1px] border-[#8DC556] py-[5px] text-[1.25rem] font-semibold leading-[1.25rem] text-[#8DC556] hover:opacity-50"
                onClick={() => setIsVisibleMenu(!isVisibleMenu)}
              >
                메뉴
              </button>
              {isVisibleMenu && (
                <div className="relative z-[999] box-border min-w-full flex-none rounded-[10px] border-[1px] border-[#DCDEE2] bg-white">
                  <button
                    className={`block w-full px-[10px] py-[10px] hover:opacity-50 ${
                      selectedMenu === CONST_ADMIN_MENU.LECTURE_ADD
                        ? 'text-[#8DC556]'
                        : 'text-[#515A6E]'
                    }`}
                    onClick={() => {
                      setSelectedMenu(CONST_ADMIN_MENU.LECTURE_ADD);
                      setIsVisibleMenu(false);
                    }}
                  >
                    강의 추가
                  </button>
                  <button
                    className={`block w-full px-[10px] py-[10px] hover:opacity-50  ${
                      selectedMenu === CONST_ADMIN_MENU.LECTURE_EDIT
                        ? 'text-[#8DC556]'
                        : 'text-[#515A6E]'
                    }`}
                    onClick={() => {
                      setSelectedMenu(CONST_ADMIN_MENU.LECTURE_EDIT);
                      setIsVisibleMenu(false);
                    }}
                  >
                    강의 관리
                  </button>
                  <button
                    className={`block w-full px-[10px] py-[10px] hover:opacity-50  ${
                      selectedMenu === CONST_ADMIN_MENU.LECTURE_PERMISSION
                        ? 'text-[#8DC556]'
                        : 'text-[#515A6E]'
                    }`}
                    onClick={() => {
                      setSelectedMenu(CONST_ADMIN_MENU.LECTURE_PERMISSION);
                      setIsVisibleMenu(false);
                    }}
                  >
                    강의 승인
                  </button>
                  <button
                    className={`block w-full px-[10px] py-[10px] hover:opacity-50  ${
                      selectedMenu === CONST_ADMIN_MENU.STUDENT_EDIT
                        ? 'text-[#8DC556]'
                        : 'text-[#515A6E]'
                    }`}
                    onClick={() => {
                      setSelectedMenu(CONST_ADMIN_MENU.STUDENT_EDIT);
                      setIsVisibleMenu(false);
                    }}
                  >
                    사용자 관리
                  </button>
                  <button
                    className={`block w-full px-[10px] py-[10px] hover:opacity-50  ${
                      selectedMenu === CONST_ADMIN_MENU.TAG_EDIT
                        ? 'text-[#8DC556]'
                        : 'text-[#515A6E]'
                    }`}
                    onClick={() => {
                      setSelectedMenu(CONST_ADMIN_MENU.TAG_EDIT);
                      setIsVisibleMenu(false);
                    }}
                  >
                    태그 관리
                  </button>
                  <button
                    className={`block w-full px-[10px] py-[10px] hover:opacity-50  ${
                      selectedMenu === CONST_ADMIN_MENU.RESOURCE_EDIT
                        ? 'text-[#8DC556]'
                        : 'text-[#515A6E]'
                    }`}
                    onClick={() => {
                      setSelectedMenu(CONST_ADMIN_MENU.RESOURCE_EDIT);
                      setIsVisibleMenu(false);
                    }}
                  >
                    리소스 관리
                  </button>
                </div>
              )}
            </>
          </div>
          {selectedMenu === CONST_ADMIN_MENU.LECTURE_ADD && (
            <div className="overflow-w-hidden my-[45px] mx-auto max-w-[90vw] rounded-2xl border-[1px] p-[10px] sm:p-[40px] md:max-w-[600px]">
              <ComponentFormAddLecture
                token={token}
                setSelectedMenu={setSelectedMenu}
                allLecturesMutate={mutateAllLectures}
              />
            </div>
          )}
          {selectedMenu === CONST_ADMIN_MENU.LECTURE_EDIT &&
            !!dataTags &&
            !!!errorTags && (
              <div className="my-[45px] mx-auto max-w-[90vw] overflow-x-hidden">
                <ComponentContainerEditLecture
                  token={token}
                  setToken={setToken}
                  allLecturesData={dataAllLectures}
                  allLecturesMutate={mutateAllLectures}
                  allTags={dataTags}
                />
              </div>
            )}
          {selectedMenu === CONST_ADMIN_MENU.LECTURE_PERMISSION &&
            !!dataUsers &&
            !!!errorUsers &&
            !!dataAllLectures &&
            !!!errorAllLectures && (
              <div className="overflow-w-hidden my-[45px] mx-auto max-w-[90vw] rounded-2xl border-[1px] p-[10px] sm:max-w-[500px] sm:p-[40px]">
                <ComponentContainerPermissionLecture
                  token={token}
                  studentOptions={dataUsers
                    .filter((user) => {
                      return user.role !== 'admin';
                    })
                    .map((user) => {
                      return {
                        value: user.id,
                        label: user.nickname,
                      };
                    })}
                  lectureOptions={dataAllLectures.map((lecture) => {
                    return {
                      value: lecture.id,
                      label: `[${lecture.teacher_nickname}] ${lecture.title}`,
                    };
                  })}
                />
              </div>
            )}
          {selectedMenu === CONST_ADMIN_MENU.STUDENT_EDIT && (
            <div className="overflow-w-hidden my-[45px] mx-auto max-w-[90vw] rounded-2xl border-[1px] p-[10px] sm:px-[40px] sm:py-[20px]">
              <ComponentContainerEditUser
                token={token}
                dataUsers={dataUsers}
                mutateUsers={mutateUsers}
              />
            </div>
          )}
          {selectedMenu === CONST_ADMIN_MENU.TAG_EDIT && (
            <div className="overflow-w-hidden my-[45px] mx-auto max-w-[90vw] rounded-2xl border-[1px] p-[10px] sm:px-[40px] sm:py-[20px] md:max-w-[700px]">
              <ComponentFormEditTag
                token={token}
                tagsData={dataTags}
                tagsMutate={mutateTags}
              />
            </div>
          )}
          {selectedMenu === CONST_ADMIN_MENU.RESOURCE_EDIT &&
            !!dataAllResource &&
            !!!errorAllResources && (
              <div className="overflow-w-hidden my-[45px] mx-auto max-w-[90vw] rounded-2xl border-[1px] p-[10px] sm:px-[40px] sm:py-[20px]">
                <ComponentContainerEditResource
                  token={token}
                  logoHeaderResourcesData={dataAllResource.filter(
                    (resource) => {
                      return resource.type === 'header_logo';
                    },
                  )}
                  logoFooterResourcesData={dataAllResource.filter(
                    (resource) => {
                      return resource.type === 'footer_logo';
                    },
                  )}
                  carouselLectureResourcesData={dataAllResource.filter(
                    (resource) => {
                      return resource.type === 'info_banner';
                    },
                  )}
                  carouselOrgResourcesData={dataAllResource.filter(
                    (resource) => {
                      return resource.type === 'org_carousel';
                    },
                  )}
                  allResourcesMutate={mutateAllResources}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default PageAdmin;
