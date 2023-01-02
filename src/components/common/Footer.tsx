import {
  faEnvelope,
  faFax,
  faHome,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import useSWRImmutable from 'swr/immutable';
import { axiosGetfetcher } from '../../hooks/api';
import { IResourceContent } from '../../interfaces';

const ComponentFooter: React.FC = () => {
  const { data: dataFooterLogo, error: errorFooterLogo } = useSWRImmutable<
    IResourceContent[]
  >(
    `${process.env.REACT_APP_BACK_URL}/resource/footer_logo`,
    () =>
      axiosGetfetcher(`${process.env.REACT_APP_BACK_URL}/resource/footer_logo`),
    { revalidateOnFocus: false, revalidateIfStale: false },
  );
  return (
    <div className="flex flex-wrap justify-center w-full h-[128px] bg-[#696969]">
      <div className="w-full h-[128px] xl:max-w-[1152px] lg:max-w-[864px] md:max-w-[680px] sm:max-w-[504px] xs:max-w-[400px] flex justify-center items-center">
        <div className="xl:w-[250px] lg:w-[250px] md:w-[220px] sm:w-[210px] xs:w-[150px]">
          {!!dataFooterLogo &&
          !!!errorFooterLogo &&
          dataFooterLogo.length > 0 ? (
            <img
              className="sm:w-[170px] xs:w-[100px]"
              src={dataFooterLogo[0].content}
            />
          ) : (
            ''
          )}
        </div>
        <div className="xl:w-[950px] lg:w-[660px] md:w-[480px] sm:w-[320px] xs:w-[260px]">
          <div className="text-[#bfbfbf] text-[14px] font-light pb-[5px] leading-[20px] border-b-[1px] border-solid border-[rgba(255,255,255,0.1)] box-border">
            이메일무단수집거부
          </div>
          <div className="border-t-[1px] border-solid border-[rgba(0,0,0,0.1)] box-border"></div>
          <div className="pt-[5px] text-[#bfbfbf] text-[14px] font-light">
            <FontAwesomeIcon className="text-xs" icon={faHome} /> 서울특별시
            마포구 토정로 148-22,
            <br className="block sm:hidden" />
            <span className="ml-0 xs:ml-5"> 2층 (우)04081</span>
            <br className="block md:hidden" />
            <span className="xl:pl-[20px] lg:pl-[20px] md:pl-[20px] sm:pl-0 xs:pl-0">
              <FontAwesomeIcon className="text-xs" icon={faPhoneAlt} />{' '}
              02.6261.1939~1943
            </span>
            <br className="hidden lg:hidden md:block" />
            <span className="xl:pl-[20px] lg:pl-[20px] md:pl-0 sm:pl-[20px] xs:pl-[20px]">
              <FontAwesomeIcon className="text-xs" icon={faFax} /> 02.6261.1944
            </span>
            <br className="block xl:hidden lg:block md:hidden" />
            <span className="xl:pl-[20px] md:pl-[20px] lg:pl-0 sm:pl-0 xs:pl-0">
              <FontAwesomeIcon className="text-xs" icon={faEnvelope} />
              <a href="mailto:mpnaroo@naver.com"> mpnaroo@naver.com</a>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[29px] bg-[#575757] flex justify-center items-center">
        <span className="text-[#bfbfbf] font-light text-[12px] leading-[25px]">
          © Naroo-On All Rights Reserved.
        </span>
      </div>
    </div>
  );
};

export default ComponentFooter;
