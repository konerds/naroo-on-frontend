import { FC } from 'react';
import {
  faEnvelope,
  faFax,
  faHome,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSWRListLogoFooter } from '../../hooks/api';
const ComponentFooter: FC = () => {
  const { data: dataListLogoFooter, error: errorListLogoFooter } =
    useSWRListLogoFooter();
  return (
    <div className="flex w-full flex-wrap justify-center bg-[#696969]">
      <div className="flex h-[148px] w-full max-w-[100vw] items-center justify-center sm:h-[128px] sm:max-w-[504px] md:max-w-[680px] lg:max-w-[864px] xl:max-w-[1152px]">
        <div className="w-[80px] xs:w-[150px] sm:w-[210px] md:w-[220px] lg:w-[250px] xl:w-[250px]">
          {!!dataListLogoFooter &&
          !!!errorListLogoFooter &&
          dataListLogoFooter.length > 0 ? (
            <img
              className="mx-auto w-[50px] cursor-pointer xs:mx-0 xs:w-[120px] sm:w-[170px]"
              src={dataListLogoFooter[0].content}
            />
          ) : (
            ''
          )}
        </div>
        <div className="w-[260px] sm:w-[320px] md:w-[480px] lg:w-[660px] xl:w-[950px]">
          <div className="box-border cursor-pointer border-b-[1px] border-solid border-[rgba(255,255,255,0.1)] pb-[5px] text-[0.65rem] font-light leading-[1.25rem] text-[#bfbfbf] sm:text-[0.875rem]">
            이메일무단수집거부
          </div>
          <div className="box-border border-t-[1px] border-solid border-[rgba(0,0,0,0.1)]"></div>
          <div className="pt-[5px] text-[0.65rem] font-light text-[#bfbfbf] sm:text-[0.875rem]">
            <FontAwesomeIcon className="text-xs" icon={faHome} /> 서울특별시
            OO구 OO로 OOO-OO,
            <br className="block sm:hidden" />
            <span className="ml-5 sm:ml-0"> OO (우)00000</span>
            <br className="block md:hidden" />
            <span className="pl-0 sm:pl-0 md:pl-[20px] lg:pl-[20px] xl:pl-[20px]">
              <FontAwesomeIcon className="text-xs" icon={faPhoneAlt} />{' '}
              02.0000.0000
            </span>
            <br className="hidden md:block lg:hidden" />
            <span className="pl-[20px] sm:pl-[20px] md:pl-0 lg:pl-[20px] xl:pl-[20px]">
              <FontAwesomeIcon className="text-xs" icon={faFax} /> 02.0000.0000
            </span>
            <br className="block md:hidden lg:block xl:hidden" />
            <span className="pl-0 sm:pl-0 md:pl-[20px] lg:pl-0 xl:pl-[20px]">
              <FontAwesomeIcon className="text-xs" icon={faEnvelope} />
              <a href="mailto:adr10won@gmail.com"> adr10won@gmail.com</a>
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-[29px] w-full items-center justify-center bg-[#575757]">
        <span className="text-[0.75rem] font-light leading-[1.5625rem] text-[#bfbfbf]">
          © Naroo-On All Rights Reserved.
        </span>
      </div>
    </div>
  );
};

export default ComponentFooter;
