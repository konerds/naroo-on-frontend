import * as React from 'react';
import { KeyedMutator } from 'swr';
import { IResources } from '../../interfaces';
import ComponentFormUpdateResource from './resource/ComponentFormUpdateResource';

interface IPropsComponentContainerEditResource {
  token: string | null;
  logoHeaderResourcesData: IResources[];
  logoFooterResourcesData: IResources[];
  carouselLectureResourcesData: IResources[];
  carouselOrgResourcesData: IResources[];
  allResourcesMutate: KeyedMutator<IResources[]>;
}

const ComponentContainerEditResource: React.FC<
  IPropsComponentContainerEditResource
> = ({
  token,
  logoHeaderResourcesData,
  logoFooterResourcesData,
  carouselLectureResourcesData,
  carouselOrgResourcesData,
  allResourcesMutate,
}) => {
  return (
    <>
      {logoHeaderResourcesData.length > 0 ? (
        <>
          {logoHeaderResourcesData.map((resource, index) => {
            return (
              <React.Fragment key={index}>
                {+index === 0 && (
                  <div className="mb-[10px] text-2xl">헤더 로고 이미지</div>
                )}
                <div className="rounded border-2">
                  {!!resource.content && (
                    <ComponentFormUpdateResource
                      index={index}
                      token={token}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                      mutate={allResourcesMutate}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </>
      ) : (
        <></>
      )}
      {logoFooterResourcesData.length > 0 ? (
        <>
          {logoFooterResourcesData.map((resource, index) => {
            return (
              <React.Fragment key={index}>
                {+index === 0 && (
                  <div className="mb-[10px] mt-[20px] text-2xl">
                    푸터 로고 이미지
                  </div>
                )}
                <div className="rounded border-2">
                  {!!resource.content && (
                    <ComponentFormUpdateResource
                      index={index}
                      token={token}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                      mutate={allResourcesMutate}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </>
      ) : (
        <></>
      )}
      {carouselLectureResourcesData.length > 0 ? (
        <>
          {carouselLectureResourcesData.map((resource, index) => {
            return (
              <React.Fragment key={index}>
                {+index === 0 && (
                  <div className="mb-[10px] mt-[20px] text-2xl">
                    상단 서비스 소개 배너 이미지
                  </div>
                )}
                <div className="my-[1px] rounded border-2">
                  {!!resource.content && (
                    <ComponentFormUpdateResource
                      index={index}
                      token={token}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                      mutate={allResourcesMutate}
                    />
                  )}
                </div>
              </React.Fragment>
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
              token={token}
              type="info_banner"
              content_id="0"
              content={''}
              mutate={allResourcesMutate}
            />
          </div>
        </>
      )}
      {carouselOrgResourcesData.length > 0 ? (
        <>
          {carouselOrgResourcesData.map((resource, index) => {
            return (
              <React.Fragment key={index}>
                {+index === 0 && (
                  <div className="mb-[10px] mt-[20px] text-2xl">
                    하단 기관 슬라이더 이미지
                  </div>
                )}
                <div className="my-[1px] rounded border-2">
                  {!!resource.content && (
                    <ComponentFormUpdateResource
                      index={index}
                      token={token}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                      mutate={allResourcesMutate}
                    />
                  )}
                </div>
              </React.Fragment>
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
              token={token}
              type="org_carousel"
              content_id="0"
              content={''}
              mutate={allResourcesMutate}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ComponentContainerEditResource;
