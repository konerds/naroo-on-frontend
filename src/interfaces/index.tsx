export interface IStateToken {
  token: string;
  isRememberToken: boolean;
}

export interface IResourceContent {
  content: string;
}

export interface IResources {
  type: string;
  content_id: string;
  content: string;
}

export interface IInfoMe {
  userId: string;
  role: string;
  nickname: string;
}

export interface IUserVerify {
  token: string | null;
}

export interface IUserEdit {
  id: string;
  email: string;
  nickname: string;
  phone: string;
  role: string;
}

export interface ILectureInList {
  id: string;
  title: string;
  images: string[];
  description: string;
  thumbnail: string;
  teacher_nickname: string;
  status: string | null;
  expired: string | null;
  tags: ITags[] | [] | null;
  video_title: string;
  video_url: string;
}

export interface ILectureInListAdmin {
  student_id: string;
  student_email: string;
  student_nickname: string;
  lecture_id: string;
  title: string;
  thumbnail: string;
  teacher_nickname: string;
  status: string | null;
  expired: string | null;
}

export interface ITags {
  id: string;
  name: string;
}

export interface INoticesInLecture {
  id: string;
  created_at: string;
  title: string;
  description: string;
}

export interface IQnasInLecture {
  question_id: string;
  answer_id: string;
  creator_id: string;
  creator_nickname: string;
  question_created_at: string;
  question_title: string;
  question_description: string;
  answer_created_at: string;
  answer_title: string;
  answer_description: string;
}

export interface ILectureDetail {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  teacher_nickname: string;
  status: string | null;
  expired: string | null;
  video_title: string;
  video_url: string;
  notices: INoticesInLecture[];
  tags: ITags[] | [] | null;
  users: string;
  qnas: IQnasInLecture[];
}

export interface ILectureVideoDetail {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  teacher_nickname: string;
  status: string | null;
  expired: string | null;
  video_title: string;
  video_url: string;
  tags: ITags[] | [] | null;
  users: string;
}

export const CONST_ADMIN_MENU = {
  LECTURE_ADD: 'lecture_add',
  LECTURE_EDIT: 'lecture_edit',
  LECTURE_PERMISSION: 'lecture_permission',
  STUDENT_EDIT: 'student_edit',
  TAG_EDIT: 'tag_edit',
  RESOURCE_EDIT: 'resource_edit',
} as const;

export type TYPE_ADMIN_MENU =
  (typeof CONST_ADMIN_MENU)[keyof typeof CONST_ADMIN_MENU];

export interface IObjectOption {
  value: string;
  label: string;
}

export interface IObjectOptionMultiple {
  value: string | ArrayBuffer | null | undefined;
  label: string | ArrayBuffer | null | undefined;
}
