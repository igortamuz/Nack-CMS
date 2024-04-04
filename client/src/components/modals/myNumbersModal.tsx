import React, { Fragment, useEffect, useState } from 'react';
import { MdConfirmationNumber } from 'react-icons/md';
import api from '../../api';

interface IModal {
  cancelModal: any;
  id: string;
}

const MyNumbersModal: React.FC<IModal> = ({
  cancelModal,
  id
}) => {

  const [slots, setUserSlots] = useState<any[]>([])

  const getUserSlots = async() => {
    try {
      const res = await api.get(`/raffle/user/slots/${id}`)
      let data: any[] = []
      res.data.map((item: any) => {
        data.push(item.slots)
      })
      setUserSlots(data.flat())
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    getUserSlots()
  }, [])

  return (
    <Fragment>
      <div className="flex justify-start align-center flex-row mt-3">
          <div className="bg-red-100 rounded-full mx-6 flex items-center justify-center h-12 w-12">
            <MdConfirmationNumber className="text-red-700 w-6 h-6"/>
          </div>
        <h3 className="mt-3 text-xl leading-6 font-black text-gray-800">Meus números</h3>
      </div>
      
      <div className="mt-2 px-7 py-3 text-justify flex flex-row flex-wrap">
        {slots.length === 0 ? (<p className="text-md text-gray-600">
          Nenhum número adquirido
        </p>) : slots.flatMap((slot: any, index: number) => (
          <p key={index} className="text-md text-gray-600 m-2">
            {slot}{index === slots.length - 1 ? '' : ','}
         </p>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
          onClick={() => cancelModal(false)}>Fechar</button>
      </div>
    </Fragment>
  );
}

export default MyNumbersModal;
