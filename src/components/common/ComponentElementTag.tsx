import * as React from 'react';

interface IPropsComponentElementTag {
  name: string;
}

const ComponentElementTag: React.FC<IPropsComponentElementTag> = ({ name }) => {
  return (
    <div className="mr-1 min-w-max rounded-full bg-harp py-1 pl-[14px] pr-[14px] text-xs text-gray-200">
      #{name}
    </div>
  );
};

export default ComponentElementTag;
