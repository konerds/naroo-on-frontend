import { FC, Fragment, useState, useEffect } from 'react';
import { IResources } from '../../interfaces';
import ComponentFormUpdateResource from './resource/ComponentFormUpdateResource';
import { useSWRListResourceAll } from '../../hooks/api';

interface IPropsComponentContainerEditResource {}

const ComponentContainerEditResource: FC<
  IPropsComponentContainerEditResource
> = ({}) => {
  const { data: dataListResourceAll, error: errorListResourceAll } =
    useSWRListResourceAll();
  const [dataListLogoHeader, setDataListLogoHeader] = useState<IResources[]>(
    [],
  );
  const [dataListLogoFooter, setDataListLogoFooter] = useState<IResources[]>(
    [],
  );
  const [dataListCarouselBanner, setDataListCarouselBanner] = useState<
    IResources[]
  >([]);
  const [dataListCarouselOrg, setDataListCarouselOrg] = useState<IResources[]>(
    [],
  );
  useEffect(() => {
    if (dataListResourceAll && !errorListResourceAll) {
      setDataListLogoHeader(
        dataListResourceAll.filter((resource) => {
          return resource.type === 'header_logo';
        }),
      );
      setDataListLogoFooter(
        dataListResourceAll.filter((resource) => {
          return resource.type === 'footer_logo';
        }),
      );
      setDataListCarouselBanner(
        dataListResourceAll.filter((resource) => {
          return resource.type === 'info_banner';
        }),
      );
      setDataListCarouselOrg(
        dataListResourceAll.filter((resource) => {
          return resource.type === 'org_carousel';
        }),
      );
    }
  }, [dataListResourceAll, errorListResourceAll]);
  return (
    <>
      {dataListLogoHeader.length > 0 ? (
        <>
          {dataListLogoHeader.map((resource, index) => {
            return (
              <Fragment key={index}>
                {+index === 0 && (
                  <div className="mb-[10px] text-2xl">헤더 로고 이미지</div>
                )}
                <div className="rounded border-2">
                  {!!resource.content && (
                    <ComponentFormUpdateResource
                      index={index}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                    />
                  )}
                </div>
              </Fragment>
            );
          })}
        </>
      ) : (
        <></>
      )}
      {dataListLogoFooter.length > 0 ? (
        <>
          {dataListLogoFooter.map((resource, index) => {
            return (
              <Fragment key={index}>
                {+index === 0 && (
                  <div className="mb-[10px] mt-[20px] text-2xl">
                    푸터 로고 이미지
                  </div>
                )}
                <div className="rounded border-2">
                  {!!resource.content && (
                    <ComponentFormUpdateResource
                      index={index}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                    />
                  )}
                </div>
              </Fragment>
            );
          })}
        </>
      ) : (
        <></>
      )}
      {dataListCarouselBanner.length > 0 ? (
        <>
          {dataListCarouselBanner.map((resource, index) => {
            return (
              <Fragment key={index}>
                {+index === 0 && (
                  <div className="mb-[10px] mt-[20px] text-2xl">
                    상단 서비스 소개 배너 이미지
                  </div>
                )}
                <div className="my-[1px] rounded border-2">
                  {!!resource.content && (
                    <ComponentFormUpdateResource
                      index={index}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                    />
                  )}
                </div>
              </Fragment>
            );
          })}
        </>
      ) : (
        <>
          <div className="mb-[10px] mt-[20px] text-2xl">
            상단 서비스 소개 배너 이미지
          </div>
          <div className="my-[1px] rounded border-2">
            <ComponentFormUpdateResource
              index={0}
              type="info_banner"
              content_id="0"
              content=""
            />
          </div>
        </>
      )}
      {dataListCarouselOrg.length > 0 ? (
        <>
          {dataListCarouselOrg.map((resource, index) => {
            return (
              <Fragment key={index}>
                {+index === 0 && (
                  <div className="mb-[10px] mt-[20px] text-2xl">
                    하단 기관 슬라이더 이미지
                  </div>
                )}
                <div className="my-[1px] rounded border-2">
                  {!!resource.content && (
                    <ComponentFormUpdateResource
                      index={index}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                    />
                  )}
                </div>
              </Fragment>
            );
          })}
        </>
      ) : (
        <>
          <div className="mb-[10px] mt-[20px] text-2xl">
            하단 기관 슬라이더 이미지
          </div>
          <div className="my-[1px] rounded border-2">
            <ComponentFormUpdateResource
              index={0}
              type="org_carousel"
              content_id="0"
              content=""
            />
          </div>
        </>
      )}
    </>
  );
};

export default ComponentContainerEditResource;
