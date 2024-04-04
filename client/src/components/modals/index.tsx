import React, { Fragment } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

const ModalOverlay = styled.div`
  ${tw`fixed inset-0 bg-gray-500 bg-opacity-50 overflow-y-auto h-screen w-screen z-50`}
`

interface IModal {
  active: boolean;
}

const Modal: React.FC<IModal> = ({
  active = false,
  children
}) => {

  if (active === true) {
    document.body.className = "overflow-hidden"
  } else{
    document.body.className = "overflow-show"
  }

  return (
    <Fragment>
      <ModalOverlay className={active ? "block" : "hidden"}>
        <div className="relative top-20 mx-auto p-5 border rounded-md shadow-lg w-96 bg-white">
          {children}
        </div>
      </ModalOverlay>
    </Fragment>
    

  );
}

export default Modal;
