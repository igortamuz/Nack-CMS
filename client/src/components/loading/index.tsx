import React, {Fragment} from 'react';

import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface IProps {
  active: boolean;
}

const Loading: React.FC<IProps> = ({active}) => {
  return (
    <Fragment>
      <div className={active ? 'block' : 'hidden'}>
        <div className="fixed inset-0 bg-gray-400 opacity-50 z-30"/>
        <div className="absolute flex top-1/2 left-1/2 rounded-md z-50">
          <AiOutlineLoading3Quarters className="text-gray-800 text-8xl animate-spin"/>
        </div>
      </div>
      
    </Fragment>
  );
}

export default Loading;
