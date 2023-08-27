import axios from 'axios';
import { toast } from 'react-toastify';

export function showError(error: any) {
  const defaultMessage = '네트워크 오류가 발생하였습니다';
  const messageData = error.response?.data?.message;
  if (Array.isArray(messageData)) {
    toast(
      <div>
        <p className="xs:text-md mb-[10px] text-sm text-[#e74c3c] sm:mb-[20px] sm:text-2xl">
          다음과 같은 오류가 발생하였습니다
        </p>
        {messageData.length > 0
          ? messageData.map((message, index) => {
              return (
                <p
                  key={index}
                  className="sm:text-md ml-[20px] mt-[3px] text-xs xs:text-sm sm:mt-[10px]"
                >
                  {message}
                </p>
              );
            })
          : defaultMessage}
      </div>,
      {
        type: 'error',
      },
    );
  } else {
    toast(
      <div>
        <p className="xs:text-md text-sm text-[#e74c3c] sm:text-2xl">
          다음과 같은 오류가 발생하였습니다
        </p>
        <br />
        <p className="sm:text-md ml-[20px] mt-[5px] text-xs xs:text-sm sm:mt-[10px]">
          {messageData || defaultMessage}
        </p>
      </div>,
      {
        type: 'error',
      },
    );
  }
}

export function tokenHeader(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const axiosGetfetcher = async (url: string, token?: string | null) => {
  try {
    const response = await axios.get(
      url,
      !!token ? tokenHeader(token) : undefined,
    );
    return response.data;
  } catch (error: any) {
    if (url === `${process.env.REACT_APP_BACK_URL}/user/me`) {
      localStorage.setItem('token', '');
      window.location.reload();
    } else {
      throw error;
    }
  }
};
