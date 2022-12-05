import { FC } from 'react';
import { MutatorCallback } from 'swr/dist/types';
import { IResources } from '../../interfaces';
import UpdateResourceField from './resource/UpdateResourceField';

interface ResourceEditProps {
  token: string | null;
  setToken: (
    value: string | ((val: string | null) => string | null) | null,
  ) => void;
  allResourcesData: IResources[] | undefined;
  allResourcesMutate: (
    data?:
      | IResources[]
      | Promise<IResources[]>
      | MutatorCallback<IResources[]>
      | undefined,
    shouldRevalidate?: boolean | undefined,
  ) => Promise<IResources[] | undefined>;
}

const ResourceEdit: FC<ResourceEditProps> = ({
  token,
  setToken,
  allResourcesData,
  allResourcesMutate,
}) => {
  let orgIndex = 0;
  return (
    <div className="mt-[30px]">
      {allResourcesData &&
        allResourcesData.map((resource) => (
          <div key={resource.type + resource.content_id}>
            {resource ? (
              <>
                {+resource.content_id === 0 ? (
                  <div className="mt-[20px]">
                    {resource.type === 'header_logo'
                      ? 'Header 로고 : '
                      : resource.type === 'footer_logo'
                      ? 'Footer 로고 : '
                      : resource.type === 'info_banner'
                      ? '서비스 소개 배너 : '
                      : resource.type === 'org_carousel'
                      ? `기관 슬라이더 이미지 : `
                      : ''}
                  </div>
                ) : (
                  ''
                )}
                <div className="border-2 rounded">
                  {resource.content && (
                    <UpdateResourceField
                      token={token}
                      setToken={setToken}
                      type={resource.type}
                      content_id={resource.content_id}
                      content={resource.content}
                      mutate={allResourcesMutate}
                      resourceIndex={
                        resource.type === 'org_carousel' ? orgIndex++ : null
                      }
                    />
                  )}
                </div>
              </>
            ) : (
              <div>리소스가 존재하지 않습니다!</div>
            )}
          </div>
        ))}
    </div>
  );
};

export default ResourceEdit;
