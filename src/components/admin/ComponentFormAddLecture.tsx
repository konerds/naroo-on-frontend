import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useRef,
  ChangeEvent,
} from 'react';
import { useRecoilValue } from 'recoil';
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
  IObjectOptionMultiple,
  TYPE_ADMIN_MENU,
} from '../../interfaces';
import { ReactComponent as ImgPrevArrow } from '../../assets/images/PrevArrow.svg';
import { ReactComponent as ImgNextArrow } from '../../assets/images/NextArrow.svg';
import Slider, { CustomArrowProps } from 'react-slick';
import { showError, useSWRListLectureAll } from '../../hooks/api';
import stateToken from '../../recoil/state-object-token/stateToken';

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

interface IPropsComponentFormAddLecture {
  setSelectedMenu: Dispatch<SetStateAction<TYPE_ADMIN_MENU>>;
}

const ComponentFormAddLecture: FC<IPropsComponentFormAddLecture> = ({
  setSelectedMenu,
}) => {
  const token = useRecoilValue(stateToken);
  const { mutate: mutateLectureAll } = useSWRListLectureAll();
  const { value: title, onChange: onChangeTitle } = useStringInput('');
  const [thumbnail, setThumbnail] = useState<{ preview: any; file: any }>();
  const { value: description, onChange: onChangeDescription } =
    useStringInput('');
  const [expiredAt, setExpiredAt] = useState<Date | null>(new Date());
  const onHandleExpiredAt = (date: Date | null) => {
    setExpiredAt(date);
  };
  const { value: teacherName, onChange: onChangeTeacherName } =
    useStringInput('');
  const [
    listOptionImageLectureDescription,
    setListOptionImageLectureDescription,
  ] = useState<IObjectOptionMultiple[]>([]);
  const onHandleImagesChange = useCallback(
    (changedOptions: any) => {
      setListOptionImageLectureDescription(changedOptions);
    },
    [listOptionImageLectureDescription],
  );
  const onHandleImagesCreate = useCallback(
    (changedOptions: any) => {
      setListOptionImageLectureDescription([
        ...listOptionImageLectureDescription,
        { value: changedOptions, label: changedOptions },
      ]);
    },
    [listOptionImageLectureDescription],
  );
  const inputFileRef = useRef<HTMLInputElement>(null);
  const onMenuOpenSelectImages = () => {
    if (!!inputFileRef.current) {
      inputFileRef.current.click();
    }
  };
  const { value: videoTitle, onChange: onChangeVideoTitle } =
    useStringInput('');
  const { value: videoUrl, onChange: onChangeVideoUrl } = useStringInput('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const onSubmitHandler = async () => {
    try {
      setIsLoadingSubmit(true);
      if (!(!!thumbnail && !!thumbnail.file && expiredAt)) {
        return;
      }
      const images = [];
      for (const image of listOptionImageLectureDescription) {
        if (!!image.value && !!image.value.file) {
          images.push(image.value.file);
        }
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/lecture/create`,
        {
          title,
          thumbnail: thumbnail.file,
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
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status === 201) {
        await mutateLectureAll();
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
            className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] px-[20px] py-[10px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none disabled:opacity-50"
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
      {!!thumbnail && !!thumbnail.preview && (
        <div className="mb-[29px]">
          <img className="rounded-xl" src={thumbnail.preview} />
        </div>
      )}
      <div className="mb-[29px]">
        <label htmlFor="thumbnail-file">
          썸네일 이미지
          <input
            className="w-full border-[1px] border-[#C4C4C4] p-[20px] disabled:opacity-50"
            type="file"
            accept="image/*"
            disabled={isLoadingSubmit}
            onChange={(event) => {
              if (!(!!event.target.files && !!event.target.files[0])) {
                return;
              }
              const fileImageThumbnail = event.target.files[0];
              const fileReader = new FileReader();
              fileReader.readAsDataURL(fileImageThumbnail);
              fileReader.onload = (readerEvent) => {
                if (!!readerEvent.target) {
                  const previewThumbnail = readerEvent.target.result;
                  setThumbnail({
                    preview: previewThumbnail,
                    file: fileImageThumbnail,
                  });
                }
              };
            }}
          />
        </label>
      </div>
      <div className="mb-[29px]">
        <label>
          강의 설명
          <textarea
            className="box-border h-[100px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] px-[20px] py-[10px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none disabled:opacity-50"
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
            className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] px-[20px] py-[10px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none disabled:opacity-50"
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
            accept="image/*"
            ref={inputFileRef}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (!(event.target.files && event.target.files[0])) {
                return;
              }
              const fileImageLectureDescription = event.target.files[0];
              const fileReader = new FileReader();
              fileReader.readAsDataURL(fileImageLectureDescription);
              fileReader.onload = (readerEvent) => {
                if (!!readerEvent.target) {
                  setListOptionImageLectureDescription([
                    ...listOptionImageLectureDescription,
                    {
                      value: {
                        preview: readerEvent.target.result,
                        file: fileImageLectureDescription,
                      },
                      label: `이미지 #${(
                        listOptionImageLectureDescription.length + 1
                      ).toString()}`,
                    },
                  ]);
                }
              };
            }}
            disabled={isLoadingSubmit}
          />
        </label>
        <Slider
          {...{
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            pauseOnHover: true,
            prevArrow: <ComponentArrowPrev />,
            nextArrow: <ComponentArrowNext />,
          }}
        >
          {listOptionImageLectureDescription &&
            listOptionImageLectureDescription.length > 0 &&
            listOptionImageLectureDescription.map(
              (lectureImageOption, index) => {
                if (
                  !!lectureImageOption.value &&
                  !!lectureImageOption.value.preview
                ) {
                  return (
                    <div key={index} className="pr-[4px]">
                      <img
                        className="mb-[15px] w-auto rounded-xl"
                        src={lectureImageOption.value.preview.toString()}
                      />
                    </div>
                  );
                }
              },
            )}
        </Slider>
        <CreatableSelect
          isMulti
          isClearable
          components={{ DropdownIndicator: null }}
          options={listOptionImageLectureDescription}
          value={listOptionImageLectureDescription}
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
          className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] px-[20px] py-[10px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none disabled:opacity-50"
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
          className="box-border h-[41px] w-full rounded-[4px] border-[1px] border-[#DCDEE2] bg-[#F3FBFE] px-[20px] py-[10px] text-[0.875rem] font-medium placeholder-[#DCDEE2] focus:border-[#00A0E9] focus:bg-white focus:outline-none disabled:opacity-50"
          type="text"
          value={videoUrl}
          onChange={onChangeVideoUrl}
          disabled={isLoadingSubmit}
        />
      </div>
      <button
        type="submit"
        disabled={isLoadingSubmit}
        className="mb-[12px] h-[41px] w-full rounded-3xl bg-[#4DBFF0] text-[1.5rem] font-semibold leading-[2.0625rem] text-white hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        강의 추가
      </button>
    </form>
  );
};

export default ComponentFormAddLecture;
