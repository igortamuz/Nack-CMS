import React, {useEffect, useState} from 'react';
import tw from 'twin.macro';
// import { FiChevronDown } from "react-icons/fi";
import { useAuth } from '../../hooks/auth';
import { Navbar, NavbarUser, NavbarUserBtn } from './components/navbar';
import avatarDefault from '../../assets/images/default.jpg'
import api from '../../api';

// const ConfigIcon = NavbarUserIcon(FiChevronDown)

interface INavbar {
  userName: string
}

const ClearStateButton = tw.button`cursor-default fixed w-full h-full top-0 left-0 right-0 bottom-0 bg-transparent`
const DropdownMenu = tw.div`absolute right-2 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl`

const NavbarHeader: React.FC<INavbar> = () => {
  const {signOut} = useAuth()
  const [active, setDropdownActive] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string>()

  useEffect(() => {
    setAvatar(avatarDefault)
    getUserAvatar()
  }, [])

  const getUserAvatar = async() => {
    const res = await api.get('user/avatar')
    if (res.data.avatar.avatar !== undefined){
      setAvatar(res.data.url+res.data.avatar.avatar)
    }
  }

  return (
    <Navbar>
      <NavbarUser>
        <div className="relative">
          <NavbarUserBtn className={active ? "text-white" : ''} onClick={() => setDropdownActive(!active)}>
            <img src={avatar} className="w-12 h-12 rounded-full object-cover"/>
            {/* <ConfigIcon/> */}
          </NavbarUserBtn>
          <ClearStateButton onClick={() => setDropdownActive(false)} className={active ? "block" : "hidden"}/>
          <DropdownMenu className={active ? "block" : "hidden"}>
            <a href="/" onClick={() => signOut()} className="block px-4 py-2 text-gray-800 hover:bg-green-custom-darker hover:text-white">Sair</a>
          </DropdownMenu>
        </div>
        
      </NavbarUser>
    </Navbar>
  );
}

export default NavbarHeader;
