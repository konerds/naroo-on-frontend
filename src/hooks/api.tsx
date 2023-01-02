import axios from 'axios';
import { toast } from 'react-toastify';

export function showError(error: any) {
  const defaultMessage = '네트워크 오류가 발생하였습니다';
  const messageData = error.response?.data?.message;
  if (Array.isArray(messageData)) {
    toast(
      <div>
        {messageData.length > 0
          ? messageData.map((message, index) => {
              return (
                <>
                  <p>{message}</p>
                  {index < messageData.length - 1 && (
                    <>
                      <br />
                      <br />
                    </>
                  )}
                </>
              );
            })
          : defaultMessage}
      </div>,
      {
        type: 'error',
      },
    );
  } else {
    toast(messageData || defaultMessage, {
      type: 'error',
    });
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

// export function useGetSWR<T>(
//   requestUrl: string,
//   token: string | null,
//   customConfig: {
//     isImmutable?: boolean;
//     isRevalidateOnFocus?: boolean;
//     isRevalidateIfStale?: boolean;
//     isShowError?: boolean;
//     initialData?: T;
//   },
// ): DataResponse<T> {
//   const isShowError = customConfig.isShowError === false ? false : true;
//   const isImmutable = customConfig.isImmutable === true ? true : false;
//   const isRevalidateOnFocus =
//     customConfig.isRevalidateOnFocus === true ? true : false;
//   const isRevalidateIfStale =
//     customConfig.isRevalidateIfStale === true ? true : false;
//   // const defaultSWRfetcher = async (url: string) => {
//   //   try {
//   //     const response = !!token
//   //       ? await axios.get(url, tokenHeader(token))
//   //       : await axios.get(url);
//   //     return response.data;
//   //   } catch (error: any) {
//   //     if (isShowError) {
//   //       throw error;
//   //     }
//   //   }
//   // };
//   const optionSwr = {
//     revalidateOnFocus: isRevalidateOnFocus,
//     revalidateIfStale: isRevalidateIfStale,
//     // revalidateOnReconnect: false
//     initialData: !!customConfig.initialData ? customConfig.initialData : null,
//   };
//   const { data, mutate, error } = isImmutable
//     ? useSWRImmutable<T>(requestUrl, defaultSWRfetcher, optionSwr)
//     : useSWR<T>(requestUrl, defaultSWRfetcher, optionSwr);
//   return { data, mutate, error };
// }

// export function useGetSWR<T>(
//   requestUrl: string,
//   token: string | null,
//   showError: boolean,
//   shouldFetch = true,
// ): DataResponse<T> {
//   const fetcher = async (url: string) => {
//     try {
//       const response = token
//         ? await axios.get(url, tokenHeader(token))
//         : await axios.get(url);
//       return response.data;
//     } catch (error: any) {
//       if (showError) {
//         const messages = error.response?.data?.message;
//         if (Array.isArray(messages)) {
//           messages.map((message) => {
//             toast.error(message);
//           });
//         } else {
//           toast.error(messages);
//         }
//       }
//       if (url.includes('admin')) {
//         window.location.replace('/signin');
//       }
//       throw error;
//     }
//   };
//   const { data, mutate, error } = useSWR<T>(
//     shouldFetch ? requestUrl : null,
//     fetcher,
//     {
//       revalidateOnFocus: false,
//       revalidateIfStale: false,
//       // revalidateOnReconnect: false
//     },
//   );
//   return { data, mutate, error };
// }
