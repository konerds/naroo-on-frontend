import { useRef } from 'react';
import { useState } from 'react';
import { FC } from 'react';
import { MutatorCallback } from 'swr/dist/types';
import { DataResponse, useGetSWR } from '../../hooks/api';
import { ILectureInList, IResources, IUserEdit, ITags } from '../../interfaces';
import LectureAdd from './LectureAdd';
import LectureEdit from './LectureEdit';
import LecturePermission from './LecturePermission';
import ResourceEdit from './ResourceEdit';
import TagEdit from './TagEdit';
import UserEdit from './UserEdit';

interface AdminLectureProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  users: DataResponse<IUserEdit[]>;
  tagsData: ITags[] | undefined;
  tagsMutate: (
    data?: ITags[] | Promise<ITags[]> | MutatorCallback<ITags[]> | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<ITags[] | undefined>;
}

export const CONST_ADMIN_MENU = {
  LECTURE_ADD: 'lecture_add',
  LECTURE_EDIT: 'lecture_edit',
  LECTURE_PERMISSION: 'lecture_permission',
  STUDENT_EDIT: 'student_edit',
  TAG_EDIT: 'tag_edit',
  RESOURCE_EDIT: 'resource_edit',
} as const;

export type ADMIN_MENU = typeof CONST_ADMIN_MENU[keyof typeof CONST_ADMIN_MENU];

const AdminLecture: FC<AdminLectureProps> = ({
  token,
  setToken,
  users,
  tagsData,
  tagsMutate,
}) => {
  const { data: allLecturesData, mutate: allLecturesMutate } = useGetSWR<
    ILectureInList[]
  >(`${process.env.REACT_APP_BACK_URL}/lecture/all`, null, true);
  const { data: allResourcesData, mutate: allResourcesMutate } = useGetSWR<
    IResources[]
  >(`${process.env.REACT_APP_BACK_URL}/resource`, token, true);
  const [selectedMenu, setSelectedMenu] = useState<ADMIN_MENU>(
    CONST_ADMIN_MENU.LECTURE_ADD,
  );
  const [isVisibleMenu, setIsVisibleMenu] = useState<boolean>(false);
  const menuElementRef = useRef<HTMLDivElement | null>(null);
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
              users.data
                ? users.data.length > 0
                  ? users.data
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
          <UserEdit token={token} setToken={setToken} users={users} />
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

export default AdminLecture;
