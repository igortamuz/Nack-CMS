import React, { Fragment } from 'react';
import { MdWarning } from 'react-icons/md';

interface IModal {
  cancelModal: any;
  action: any;
}

const AlertModal: React.FC<IModal> = ({
  cancelModal,
  action 
}) => {

  return (
    <Fragment>
      <div className="flex justify-start align-center flex-row mt-3">
          <div className="bg-red-100 rounded-full mx-6 flex items-center justify-center h-12 w-12">
            <MdWarning className="text-red-700 w-6 h-6"/>
          </div>
        <h3 className="mt-3 text-xl leading-6 font-black text-gray-800">Atenção!</h3>
      </div>
      
      <div className="mt-2 px-7 py-3 text-justify">
        <p className="text-md text-gray-600">
          Você tem certeza que deseja <span className="text-red-600 font-bold uppercase">cancelar</span> os números reservados?
        </p>
        <p className="mt-2 text-md text-red-600 font-bold">Essa ação não pode ser revertida!</p>            
      </div>
      <div className="flex justify-end pt-2">
        <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
          onClick={() => action()}>Continuar</button>
        <button className="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
          onClick={() => cancelModal(false)}>Desistir</button>
      </div>
    </Fragment>
  );
}

export default AlertModal;
