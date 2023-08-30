import { Dispatch, SetStateAction, FC } from 'react';
import { Link } from 'react-router-dom';
import ImgEllipsisVector from '../../../assets/images/EllipsisVector.png';

interface IPropsComponentEllipsisHeader {
  handlerSignout: () => void;
  setIsVisibleMenu: Dispatch<SetStateAction<boolean>>;
}

const ComponentEllipsisHeader: FC<IPropsComponentEllipsisHeader> = ({
  handlerSignout,
  setIsVisibleMenu,
}) => {
  return (
    <div className="absolute right-[-6px] top-[-6px] md:right-[-46px]">
      <div
        className="max-h-[128px] min-h-[128px] min-w-[210px] max-w-[210px] px-[12px] pb-[11px] pt-[21px]"
        style={{
          backgroundImage: `url(${ImgEllipsisVector})`,
        }}
      >
        <Link
          to="/myinfo"
          onClick={(event) => {
            setIsVisibleMenu(false);
          }}
        >
          <button
            className={`block py-[10px] pl-[26px] text-[1.125rem] font-medium hover:opacity-50 ${
              location.pathname === '/myinfo'
                ? 'text-[#8DC556]'
                : 'text-[#515A6E]'
            }`}
          >
            개인 정보 수정
          </button>
        </Link>
        <button
          className="block py-[10px] pl-[26px] text-[1.125rem] font-medium text-[#515A6E] hover:opacity-50"
          onClick={() => {
            setIsVisibleMenu(false);
            handlerSignout();
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default ComponentEllipsisHeader;
