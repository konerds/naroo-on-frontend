import * as React from 'react';
import useSWR from 'swr';
import { axiosGetfetcher } from '../../hooks/api';
import {
  ILectureInList,
  IResources,
  IUserEdit,
  ITags,
  IInfoMe,
} from '../../interfaces';
import TokenContext from '../../store/TokenContext';
import LectureAdd from './LectureAdd';
import LectureEdit from './LectureEdit';
import LecturePermission from './LecturePermission';
import ResourceEdit from './ResourceEdit';
import TagEdit from './TagEdit';
import UserEdit from './UserEdit';

interface IPropsComponentAdminLecture {}

export const CONST_ADMIN_MENU = {
  LECTURE_ADD: 'lecture_add',
  LECTURE_EDIT: 'lecture_edit',
  LECTURE_PERMISSION: 'lecture_permission',
  STUDENT_EDIT: 'student_edit',
  TAG_EDIT: 'tag_edit',
  RESOURCE_EDIT: 'resource_edit',
} as const;

export type ADMIN_MENU = typeof CONST_ADMIN_MENU[keyof typeof CONST_ADMIN_MENU];

const ComponentAdminLecture: React.FC<IPropsComponentAdminLecture> = ({}) => {
  const tokenCtx = React.useContext(TokenContext);
  const { token, setToken } = tokenCtx;
  const { data: dataGetMe, error: errorGetMe } = useSWR<IInfoMe>(
    !!token ? `${process.env.REACT_APP_BACK_URL}/user/me` : null,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/user/me`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: dataUsers, mutate: mutateUsers } = useSWR<IUserEdit[]>(
    !!token && !!dataGetMe && !!!errorGetMe && dataGetMe.role === 'admin'
      ? `${process.env.REACT_APP_BACK_URL}/user/admin/user`
      : null,
    () =>
      axiosGetfetcher(
        `${process.env.REACT_APP_BACK_URL}/user/admin/user`,
        token,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: tagsData, mutate: tagsMutate } = useSWR<ITags[]>(
    !!token && !!dataGetMe && !!!errorGetMe && dataGetMe.role === 'admin'
      ? `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag`
      : null,
    () =>
      axiosGetfetcher(
        `${process.env.REACT_APP_BACK_URL}/lecture/admin/tag`,
        token,
      ),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: allLecturesData, mutate: allLecturesMutate } = useSWR<
    ILectureInList[]
  >(
    `${process.env.REACT_APP_BACK_URL}/lecture/all`,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/lecture/all`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const { data: allResourcesData, mutate: allResourcesMutate } = useSWR<
    IResources[]
  >(
    `${process.env.REACT_APP_BACK_URL}/resource`,
    () => axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/resource`, token),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  const [selectedMenu, setSelectedMenu] = React.useState<ADMIN_MENU>(
    CONST_ADMIN_MENU.LECTURE_ADD,
  );
  const [isVisibleMenu, setIsVisibleMenu] = React.useState<boolean>(false);
  const menuElementRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <div className="mx-auto mt-[2vh] pb-[96px]">
      <div className="text-4xl font-semibold text-center text-gray-400 mb-[4vh] 2xl:max-w-[900px] xl:max-w-[750px] lg:max-w-[600px] md:max-w-[500px] sm:max-w-[400px] xs:max-w-[350px] mx-auto">
        관리자 페이지
      </div>
      <div className="items-center hidden md:flex justify-evenly">
        <button
          className={`border-[1px] border-[#515A6E] rounded p-[10px] text-xl min-w-max ${
            selectedMenu === CONST_ADMIN_MENU.LECTURE_ADD
              ? 'text-[#8DC556] border-[#678a44]'
              : 'text-[#515A6E]'
          }`}
          onClick={() => setSelectedMenu(CONST_ADMIN_MENU.LECTURE_ADD)}
        >
          강의 추가
        </button>
        <button
          className={`border-[1px] border-[#515A6E] rounded p-[10px] text-xl min-w-max ${
            selectedMenu === CONST_ADMIN_MENU.LECTURE_EDIT
              ? 'text-[#8DC556] border-[#8DC556]'
              : 'text-[#515A6E]'
          }`}
          onClick={() => setSelectedMenu(CONST_ADMIN_MENU.LECTURE_EDIT)}
        >
          강의 관리
        </button>
        <button
          className={`border-[1px] border-[#515A6E] rounded p-[10px] text-xl min-w-max ${
            selectedMenu === CONST_ADMIN_MENU.LECTURE_PERMISSION
              ? 'text-[#8DC556] border-[#8DC556]'
              : 'text-[#515A6E]'
          }`}
          onClick={() => setSelectedMenu(CONST_ADMIN_MENU.LECTURE_PERMISSION)}
        >
          강의 승인
        </button>
        <button
          className={`border-[1px] border-[#515A6E] rounded p-[10px] text-xl min-w-max ${
            selectedMenu === CONST_ADMIN_MENU.STUDENT_EDIT
              ? 'text-[#8DC556] border-[#8DC556]'
              : 'text-[#515A6E]'
          }`}
          onClick={() => setSelectedMenu(CONST_ADMIN_MENU.STUDENT_EDIT)}
        >
          사용자 관리
        </button>
        <button
          className={`border-[1px] border-[#515A6E] rounded p-[10px] text-xl min-w-max ${
            selectedMenu === CONST_ADMIN_MENU.TAG_EDIT
              ? 'text-[#8DC556] border-[#8DC556]'
              : 'text-[#515A6E]'
          }`}
          onClick={() => setSelectedMenu(CONST_ADMIN_MENU.TAG_EDIT)}
        >
          태그 관리
        </button>
        <button
          className={`border-[1px] border-[#515A6E] rounded p-[10px] text-xl min-w-max ${
            selectedMenu === CONST_ADMIN_MENU.RESOURCE_EDIT
              ? 'text-[#8DC556] border-[#8DC556]'
              : 'text-[#515A6E]'
          }`}
          onClick={() => setSelectedMenu(CONST_ADMIN_MENU.RESOURCE_EDIT)}
        >
          리소스 관리
        </button>
      </div>
      <div className="h-full text-center md:hidden">
        <>
          <button
            className="border-[#8DC556] border-[1px] rounded-[4px] text-[#8DC556] font-semibold text-[20px] leading-[20px] w-full px-[10px] py-[5px]"
            onClick={() => setIsVisibleMenu(!isVisibleMenu)}
          >
            메뉴
          </button>
          {isVisibleMenu && (
            <div
              ref={menuElementRef}
              className="flex-none border-[1px] border-[#DCDEE2] box-border rounded-[10px] bg-white min-w-full absolute top-[220px] z-[999]"
            >
              <button
                className={`block w-full px-[10px] py-[10px] ${
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
                className={`block w-full px-[10px] py-[10px]  ${
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
                className={`block w-full px-[10px] py-[10px]  ${
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
                className={`block w-full px-[10px] py-[10px]  ${
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
                className={`block w-full px-[10px] py-[10px]  ${
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
                className={`block w-full px-[10px] py-[10px]  ${
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
        <div className="max-w-[90%] overflow-w-hidden mx-auto">
          <LectureAdd
            token={token}
            setToken={setToken}
            setSelectedMenu={setSelectedMenu}
            allLecturesData={allLecturesData}
            allLecturesMutate={allLecturesMutate}
          />
        </div>
      )}
      {selectedMenu === CONST_ADMIN_MENU.LECTURE_EDIT && (
        <div className="max-w-[90%] overflow-x-hidden mx-auto">
          <LectureEdit
            token={token}
            setToken={setToken}
            allLecturesData={allLecturesData}
            allLecturesMutate={allLecturesMutate}
            allTags={tagsData ? (tagsData.length > 0 ? tagsData : []) : []}
          />
        </div>
      )}
      {selectedMenu === CONST_ADMIN_MENU.LECTURE_PERMISSION && (
        <div className="max-w-[90%] mx-auto">
          <LecturePermission
            token={token}
            setToken={setToken}
            studentOptions={
              dataUsers
                ? dataUsers.length > 0
                  ? dataUsers
                      .filter((user) => {
                        return user.role !== 'admin';
                      })
                      .map((user) => {
                        return {
                          value: user.id,
                          label: user.nickname,
                        };
                      })
                  : []
                : []
            }
            lectureOptions={
              allLecturesData
                ? allLecturesData.length > 0
                  ? allLecturesData.map((lecture) => {
                      return {
                        value: lecture.id,
                        label: `[${lecture.teacher_nickname}] ${lecture.title}`,
                      };
                    })
                  : []
                : []
            }
          />
        </div>
      )}
      {selectedMenu === CONST_ADMIN_MENU.STUDENT_EDIT && (
        <div className="max-w-[90%] overflow-w-hidden mx-auto">
          <UserEdit
            token={token}
            setToken={setToken}
            dataUsers={dataUsers}
            mutateUsers={mutateUsers}
          />
        </div>
      )}
      {selectedMenu === CONST_ADMIN_MENU.TAG_EDIT && (
        <div className="max-w-[90%] overflow-w-hidden mx-auto">
          <TagEdit
            token={token}
            setToken={setToken}
            tagsData={tagsData}
            tagsMutate={tagsMutate}
          />
        </div>
      )}
      {selectedMenu === CONST_ADMIN_MENU.RESOURCE_EDIT && (
        <div className="max-w-[90%] overflow-w-hidden mx-auto">
          <ResourceEdit
            token={token}
            setToken={setToken}
            allResourcesData={allResourcesData}
            allResourcesMutate={allResourcesMutate}
          />
        </div>
      )}
    </div>
  );
};

export default ComponentAdminLecture;
