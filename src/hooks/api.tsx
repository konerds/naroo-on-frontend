import axios from 'axios';
import { toast } from 'react-toastify';

export function showError(error: any) {
  const defaultMessage = '네트워크 오류가 발생하였습니다';
  const messageData = error.response?.data?.message;
  if (Array.isArray(messageData)) {
    toast(
      <div>
        <p className="text-sm xs:text-md sm:text-2xl text-[#e74c3c] mb-[10px] sm:mb-[20px]">
          다음과 같은 오류가 발생하였습니다
        </p>
        {messageData.length > 0
          ? messageData.map((message, index) => {
              return (
                <p
                  key={index}
                  className="text-xs xs:text-sm sm:text-md ml-[20px] mt-[3px] sm:mt-[10px]"
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
        <p className="text-sm xs:text-md sm:text-2xl text-[#e74c3c]">
          다음과 같은 오류가 발생하였습니다
        </p>
        <br />
        <p className="text-xs xs:text-sm sm:text-md ml-[20px] mt-[5px] sm:mt-[10px]">
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
    throw error;
  }
};
