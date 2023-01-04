import * as React from 'react';

interface IPropsComponentElementTag {
  name: string;
}

const ComponentElementTag: React.FC<IPropsComponentElementTag> = ({ name }) => {
  return (
    <div className="rounded-full min-w-max pl-[14px] pr-[14px] py-1 text-xs text-gray-200 bg-harp mr-1">
      #{name}
    </div>
  );
};

export default ComponentElementTag;
