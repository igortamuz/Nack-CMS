import React, {useEffect, useState, Fragment} from 'react';
import tw from 'twin.macro';

import api from '../../../api'

import ContentAreaHeader from '../contentArea'
import { ContentArea, ContentAreaContainer } from '../components/contentArea';

import Table, { TableContainer } from '../../tables/usersTable';
import { useHistory } from 'react-router-dom';
import Modal from '../../modals';
import ConfirmationModal from '../../modals/confirmation';
import { toast } from 'react-toastify';
import toastOptions from '../../../utils/toastOptions';
import Loading from '../../loading';

const Card = tw.div`bg-white shadow-md rounded`
const Button = tw.button`p-2 rounded`
const CreateUserButton = tw(Button)`p-2 h-10 bg-green-custom text-gray-800 hover:bg-green-custom-darker`

const Dashboard: React.FC = () => {
  const history = useHistory()
  const heads = ['Nome', 'Telefone', 'Email', 'Logradouro', 'CEP', 'Tipo', 'Ações']
  const [allUsers, setUsers] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string>('')
  const [deleteUserModal, setDeleteUserModal] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  const getAllUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/user')
      setUsers(res.data)
    } catch (error) {
      //
    } finally{
      setLoading(false)
    }
  }

  const deleteUser = async() => {
    try {
      setLoading(true)
      if (deleteId === undefined) throw new Error()
      await api.delete(`/user/${deleteId}`)
      setDeleteUserModal(false)
      setDeleteId('')
      toast.success("Usuário removido", toastOptions)
      getAllUsers()
    } catch (error) {
      toast.error("Erro ao remover usuário", toastOptions)
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllUsers()
  }, []);

  return (
    <Fragment>
      <ContentAreaHeader
        title={"Usuários"}
        subHeader={"Usuários cadastrados"}
        actions={[
          <CreateUserButton key={1} onClick={() => history.push('/dashboard/users/add', {
            title: "Usuários",
            subHeader: "Criar usuário novo",
            mode: "create"
          })}>Criar usuário</CreateUserButton>
        ]}
      />

      <ContentAreaContainer>
        <ContentArea>
          <Card>
            <TableContainer>
              <Table 
                allUsers={allUsers}
                heads={heads}
                setDelete={setDeleteId}
                setModal={setDeleteUserModal}
              />
            </TableContainer>
          </Card>
        </ContentArea>
      </ContentAreaContainer>
      <Modal active={deleteUserModal}>
        <ConfirmationModal cancelModal={setDeleteUserModal} action={deleteUser}/>
      </Modal>
      <Loading active={isLoading}/>
    </Fragment>
  );
}

export default Dashboard;
