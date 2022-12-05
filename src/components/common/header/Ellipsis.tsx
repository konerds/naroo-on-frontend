import { FC } from 'react';
import { Link, useHistory } from 'react-router-dom';
import EllipsisVector from '../../../assets/images/EllipsisVector.png';

interface EllipsisProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  logoutHandler: () => void;
}

const Ellipsis: FC<EllipsisProps> = ({ token, setToken, logoutHandler }) => {
  const history = useHistory();
  return (
    <div className="absolute md:right-[-46px] right-[-6px] top-[-6px]">
      <div
        className="min-w-[210px] max-w-[210px] min-h-[128px] max-h-[128px] px-[12px] pt-[21px] pb-[11px]"
        style={{
          backgroundImage: `url(${EllipsisVector})`,
        }}
      >
        <Link to="/myinfo">
          <button
            className={`block pl-[26px] py-[10px] text-[18px] leading-[150%] font-medium ${
              location.pathname === '/myinfo'
                ? 'text-[#8DC556]'
                : 'text-[#515A6E]'
            }`}
          >
            개인 정보 수정
          </button>
        </Link>
        <button
          className="block pl-[26px] py-[10px] text-[18px] leading-[150%] font-medium text-[#515A6E]"
          onClick={logoutHandler}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Ellipsis;
