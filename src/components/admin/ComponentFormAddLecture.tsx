import * as React from 'react';
import axios from 'axios';
import { useStringInput } from '../../hooks';
import CreatableSelect from 'react-select/creatable';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import {
  CONST_ADMIN_MENU,
  ILectureInList,
  TYPE_ADMIN_MENU,
} from '../../interfaces';
import { ReactComponent as ImgPrevArrow } from '../../assets/images/PrevArrow.svg';
import { ReactComponent as ImgNextArrow } from '../../assets/images/NextArrow.svg';
import Slider, { CustomArrowProps } from 'react-slick';
import { KeyedMutator } from 'swr';
import { showError } from '../../hooks/api';

const ComponentArrowPrev = (props: CustomArrowProps) => {
  return (
    <ImgPrevArrow
      className={props.className}
      style={{
        ...props.style,
        display: 'absolute',
        width: 15,
        height: 15,
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const ComponentArrowNext = (props: CustomArrowProps) => {
  return (
    <ImgNextArrow
      className={props.className}
      style={{
        ...props.style,
        display: 'absolute',
        width: 15,
        height: 15,
        zIndex: 999,
      }}
      onClick={props.onClick}
    />
  );
};

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  pauseOnHover: true,
  prevArrow: <ComponentArrowPrev />,
  nextArrow: <ComponentArrowNext />,
};

interface IPropsComponentFormAddLecture {
  token: string | null;
  setSelectedMenu: React.Dispatch<React.SetStateAction<TYPE_ADMIN_MENU>>;
  allLecturesMutate: KeyedMutator<ILectureInList[]>;
}

const ComponentFormAddLecture: React.FC<IPropsComponentFormAddLecture> = ({
  token,
  setSelectedMenu,
  allLecturesMutate,
}) => {
  const { value: title, onChange: onChangeTitle } = useStringInput('');
  const [thumbnail, setThumbnail] = React.useState<any>(null);
  const { value: description, onChange: onChangeDescription } =
    useStringInput('');
  const [expiredAt, setExpiredAt] = React.useState<Date | null>(new Date());
  const onHandleExpiredAt = (date: Date | null) => {
    setExpiredAt(date);
  };
  const { value: teacherName, onChange: onChangeTeacherName } =
    useStringInput('');
  const [lectureImageOptions, setLectureImageOptions] = React.useState<
    {
      value: string | ArrayBuffer | null | undefined;
      label: string | ArrayBuffer | null | undefined;
    }[]
  >([]);
  const onHandleImagesChange = React.useCallback(
    (changedOptions: any) => {
      setLectureImageOptions(changedOptions);
    },
    [lectureImageOptions],
  );
  const onHandleImagesCreate = React.useCallback(
    (changedOptions: any) => {
      setLectureImageOptions([
        ...lectureImageOptions,
        { value: changedOptions, label: changedOptions },
      ]);
    },
    [lectureImageOptions],
  );
  const inputFileRef = React.useRef<any>(null);
  const onMenuOpenSelectImages = () => {
    if (!!inputFileRef.current) {
      inputFileRef.current.click();
    }
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!!!event.target.files || !!!event.target.files[0]) {
      return;
    }
    const imageFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (readerEvent) => {
      setLectureImageOptions([
        ...lectureImageOptions,
        {
          value: readerEvent.target?.result,
          label: `이미지 #${(lectureImageOptions.length + 1).toString()}`,
        },
      ]);
    };
  };
  const { value: videoTitle, onChange: onChangeVideoTitle } =
    useStringInput('');
  const { value: videoUrl, onChange: onChangeVideoUrl } = useStringInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const onSubmitHandler = async () => {
    try {
      setIsLoadingSubmit(true);
      const images = [];
      for (const image of lectureImageOptions) {
        images.push(image.value);
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/lecture/create`,
        {
          title,
          thumbnail,
          expiredAt,
          description,
          teacherName,
          images,
          videoTitle,
          videoUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 201) {
        await allLecturesMutate();
        setSelectedMenu(CONST_ADMIN_MENU.LECTURE_EDIT);
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };
  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmitHandler();
      }}
    >
      <div className="mb-[29px]">
        <label htmlFor="title">
          제목
          <input
            className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
            type="text"
            value={title}
            onChange={onChangeTitle}
            disabled={isLoadingSubmit}
          />
        </label>
      </div>
      <div className="mb-[29px]">
        <label htmlFor="expired_at">
          강의 만료 일시
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              format="yyyy년 MM월 dd일 hh시 mm분 ss초"
              value={expiredAt}
              margin="normal"
              onChange={onHandleExpiredAt}
              className="w-full disabled:opacity-50"
              disabled={isLoadingSubmit}
            />
          </MuiPickersUtilsProvider>
        </label>
      </div>
      {thumbnail && (
        <div className="mb-[29px]">
          <img className="rounded-xl" src={thumbnail} />
        </div>
      )}
      <div className="mb-[29px]">
        <label htmlFor="thumbnail-file">
          썸네일 이미지
          <input
            className="w-full border-[1px] border-[#C4C4C4] p-[20px] disabled:opacity-50"
            type="file"
            disabled={isLoadingSubmit}
            onChange={(event) => {
              if (!event.target.files || !event.target.files[0]) {
                return;
              }
              const imageFile = event.target.files[0];
              const fileReader = new FileReader();
              fileReader.readAsDataURL(imageFile);
              fileReader.onload = (readerEvent) => {
                setThumbnail(readerEvent.target?.result);
              };
            }}
          />
        </label>
      </div>
      <div className="mb-[29px]">
        <label>
          강의 설명
          <textarea
            className="w-full h-[100px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
            value={description}
            onChange={onChangeDescription}
            disabled={isLoadingSubmit}
          ></textarea>
        </label>
      </div>
      <div className="mb-[29px]">
        <label htmlFor="teacher-name">
          강사 이름
          <input
            className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
            type="text"
            value={teacherName}
            onChange={onChangeTeacherName}
            disabled={isLoadingSubmit}
          />
        </label>
      </div>
      <div className="mb-[29px]">
        <label htmlFor="images">
          강의 소개 이미지
          <input
            className="hidden"
            type="file"
            ref={inputFileRef}
            onChange={(event) => {
              onFileChange(event);
            }}
            disabled={isLoadingSubmit}
          />
        </label>
        <Slider {...settings}>
          {lectureImageOptions &&
            lectureImageOptions.length > 0 &&
            lectureImageOptions.map((lectureImageOption) => {
              if (lectureImageOption.value) {
                return (
                  <div className="pr-[4px]">
                    <img
                      className="w-auto rounded-xl mb-[15px]"
                      src={lectureImageOption.value.toString()}
                    />
                  </div>
                );
              }
            })}
        </Slider>
        <CreatableSelect
          isMulti
          isClearable
          components={{ DropdownIndicator: null }}
          options={lectureImageOptions}
          value={lectureImageOptions}
          onChange={onHandleImagesChange}
          onCreateOption={onHandleImagesCreate}
          onMenuOpen={onMenuOpenSelectImages}
          formatCreateLabel={() => '강의 소개 이미지 추가하기'}
          noOptionsMessage={() => null}
          placeholder="강의 소개 이미지를 추가하세요"
          className="disabled:opacity-50"
          isDisabled={isLoadingSubmit}
        />
      </div>
      <div className="mb-[29px]">
        <div>
          <label htmlFor="video_title">강의 영상 제목</label>
        </div>
        <input
          className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
          type="text"
          value={videoTitle}
          onChange={onChangeVideoTitle}
          disabled={isLoadingSubmit}
        />
      </div>
      <div className="mb-[29px]">
        <div>
          <label htmlFor="video_url">강의 영상 URL</label>
        </div>
        <input
          className="w-full h-[41px] border-[1px] box-border rounded-[4px] border-[#DCDEE2] bg-[#F3FBFE] placeholder-[#DCDEE2] font-medium text-[0.875rem] py-[10px] focus:border-[#00A0E9] focus:outline-none focus:bg-white px-[20px] disabled:opacity-50"
          type="text"
          value={videoUrl}
          onChange={onChangeVideoUrl}
          disabled={isLoadingSubmit}
        />
      </div>
      <button
        type="submit"
        disabled={isLoadingSubmit}
        className="w-full h-[41px] rounded-3xl text-[1.5rem] font-semibold leading-[2.0625rem] bg-[#4DBFF0] text-white mb-[12px] disabled:opacity-50 hover:opacity-50 disabled:cursor-not-allowed"
      >
        강의 추가
      </button>
    </form>
  );
};

export default ComponentFormAddLecture;
