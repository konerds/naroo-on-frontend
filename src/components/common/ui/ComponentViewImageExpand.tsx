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
      className="fixed top-0 left-0 z-[1001] flex h-[100vh] w-[100vw] cursor-pointer flex-col justify-center bg-[#000000bb] align-middle"
    >
      <div className="relative flex items-center justify-center">
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="relative z-[1002] cursor-default"
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
            className="absolute top-[10px] right-[10px] m-auto h-[40px] w-[40px] cursor-pointer fill-[black] object-fill hover:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentViewImageExpand;
