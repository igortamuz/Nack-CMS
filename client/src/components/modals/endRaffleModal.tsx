import React, { useState } from 'react';
import { FaStopwatch } from 'react-icons/fa';

interface IModal{
  action: any;
  cancelModal: any;
  id: string;
}

const EndRaffleModal: React.FC<IModal> = ({
  action, 
  cancelModal,
  id
}) => {

  const [sorted, setSorted] = useState<number>(0)

  return (
    <div>
      <div className="flex justify-start align-center flex-row mt-3">
        <div className="bg-green-100 rounded-full mx-6 flex items-center justify-center h-12 w-12">
          <FaStopwatch className="text-green-600"/>
        </div>
        <h3 className="mt-3 text-xl leading-6 font-black text-gray-800">Finalizar sorteio!</h3>
      </div>
      
      <div className="mt-2 px-7 py-3">
        <p className="text-md text-gray-600 text-justify">
          Para finalizar o sorteio, indique o número ganhador abaixo:
        </p>        
      </div>
      <div className="mt-2 px-7 py-3">
        <input type="number" className="bg-gray-200 p-4 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-300" value={sorted}
         onChange={(e) => setSorted(parseInt(e.target.value))}/>
      </div>
      <div className="flex justify-end pt-2">
        <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
          onClick={() => cancelModal(false)}>Cancelar</button>
        <button className="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
          onClick={() => action(id, sorted)}>Finalizar</button>
      </div>
    </div>
  );
}

export default EndRaffleModal;