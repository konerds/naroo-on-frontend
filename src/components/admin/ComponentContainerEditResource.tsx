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
  console.log(carouselLectureResourcesData);
  return (
    <div className="mt-[30px]">
      {logoHeaderResourcesData.length > 0 ? (
        <>
          {logoHeaderResourcesData.map((resource, index) => {
            return (
              <>
                <div key={index}>
                  {+index === 0 && (
                    <div className="mt-[20px]">헤더 로고 이미지</div>
                  )}
                </div>
                <div className="border-2 rounded">
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
              </>
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
              <>
                <div key={index}>
                  {+index === 0 && (
                    <div className="mt-[20px]">푸터 로고 이미지</div>
                  )}
                </div>
                <div className="border-2 rounded">
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
              </>
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
              <>
                <div key={index}>
                  {+index === 0 && (
                    <div className="mt-[20px]">
                      상단 서비스 소개 배너 이미지
                    </div>
                  )}
                </div>
                <div className="border-2 rounded">
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
              </>
            );
          })}
        </>
      ) : (
        <>
          <div>
            <div className="mt-[20px]">상단 서비스 소개 배너 이미지</div>
          </div>
          <div className="border-2 rounded">
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
              <>
                <div key={index}>
                  {+index === 0 && (
                    <div className="mt-[20px]">하단 기관 슬라이더 이미지</div>
                  )}
                </div>
                <div className="border-2 rounded">
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
              </>
            );
          })}
        </>
      ) : (
        <>
          <div>
            <div className="mt-[20px]">하단 기관 슬라이더 이미지</div>
          </div>
          <div className="border-2 rounded">
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
    </div>
  );
};

export default ComponentContainerEditResource;
