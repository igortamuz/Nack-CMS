import React from 'react'

import Navbar from '../dashboard/navbar'
import Sidebar from '../dashboard/sidebar'
import { ContainerFluid } from '../container';

import {Wrapper, ContentWrapper} from '../dashboard/components/contentArea'
import { useAuth } from '../../hooks/auth';

const DashboardLayout: React.FC = ({children}) => {
  const {user} = useAuth()
  return (
    <Wrapper>
      <Sidebar/>
      {/* <Navbar userName={children?.props?.user.name}/> */}
      <Navbar userName={user.name}/>
      <ContentWrapper>
        <ContainerFluid>
          {children}
        </ContainerFluid>
       </ContentWrapper>
     </Wrapper>
  )
}

export default DashboardLayout