import * as React from 'react';
import { ReactComponent as ImgClose } from '../../../assets/images/Close.svg';

interface IPropsComponentViewImageExpand {
  src: string;
  hideComponent: () => void;
}

const ComponentViewImageExpand: React.FC<IPropsComponentViewImageExpand> = ({
  src,
  hideComponent,
}) => {
  return (
    <div
      onClick={() => {
        hideComponent();
      }}
      className="cursor-pointer fixed w-[100vw] h-[100vh] top-0 left-0 bg-[#000000bb] z-[1001] flex flex-col align-middle justify-center"
    >
      <div className="flex justify-center items-center relative">
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="cursor-default z-[1002] relative"
        >
          <img
            className="w-[60vw] md:w-[40vw]"
            src={src}
            alt="강의 썸네일 이미지"
          />
          <ImgClose
            onClick={() => {
              hideComponent();
            }}
            width={40}
            height={40}
            className="cursor-pointer absolute top-[10px] right-[10px] w-[40px] h-[40px] m-auto object-fill fill-[black] hover:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentViewImageExpand;
