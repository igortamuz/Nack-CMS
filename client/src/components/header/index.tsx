import React, {Fragment, useEffect, useRef, useState} from 'react';

import { NavLink, useHistory } from 'react-router-dom';
import logo from '../../assets/images/logo-semfundo.png'
import tw from 'twin.macro'
import styled from 'styled-components'
import { useAuth } from '../../hooks/auth';
import useAnimatedNavToggler from './helper';
import { motion } from 'framer-motion';
import {FiMenu} from 'react-icons/fi'
import {MdClose} from 'react-icons/md'
import {IoLogInOutline} from 'react-icons/io5'
import api from '../../api';
import { FaUserCircle } from 'react-icons/fa';

import avatarDefault from '../../assets/images/default.jpg'

export const PrimaryLink = tw(NavLink)`
  lg:mx-0 px-8 py-3 rounded bg-green-custom hover:bg-green-custom-darker text-gray-100 hocus:text-gray-200 focus:shadow-md border-b-0
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-2xl! ml-0!`};

  img {
    ${tw`mr-3`}
    width: 12rem;
  }
`;

export const MobileNavLinksContainer = tw.nav`md:hidden flex flex-1 items-center justify-between`;
export const NavToggle = tw.button`
md:hidden mr-6 mt-4 z-50 focus:outline-none text-white hocus:text-green-500 transition duration-300
`;

export const MobileNavLinks = motion(styled.div`
  ${tw`md:hidden z-50 fixed top-0 inset-x-0 mx-4 my-6 p-8 border text-center rounded-lg text-gray-900 bg-white`}
  div {
    ${tw`flex flex-col items-center`}
  }
`);

const NavbarUserContainer = styled.div`
  ${tw`relative items-center flex flex-row w-full hocus:text-white text-black rounded-md cursor-pointer transition duration-200 ease-out
    font-semibold
  `};
`
const ClearStateButton = tw.button`cursor-default fixed w-full h-full top-0 left-0 right-0 bottom-0 bg-transparent`
const DropdownMenu = tw.span`absolute right-2 top-8 z-50 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100`

const NavLinkItem = styled.div`
  ${tw`mx-8 whitespace-nowrap uppercase transform transition-all`}
  a {
    ${tw`flex relative pt-2 cursor-pointer no-underline`};
    padding-bottom: 0.2rem;
    min-height: 2.5rem;
    &:hover {
      color: #00cd0d;
      text-decoration: none;
    };
    
    transition: color 0.1s ease-in;
  }

  a:hover > span {
    display: block;
  }
`

interface IProps {
  scrollTo: any;
}

const Header: React.FC<IProps> = ({scrollTo}) => {
  const {user, signOut} = useAuth()
  const history = useHistory()
  const [balance, setBalance] = useState<number>(0)
  const [active, setActive] = useState<boolean>(false)
  const [activeBalanceDD, setActiveDD] = useState<boolean>(false)
  const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();

  const [avatar, setAvatar] = useState<string>()

  useEffect(() => {
    setAvatar(avatarDefault)
    getUserAvatar()
  }, [])

  const getUserAvatar = async() => {
    try{
      const res = await api.get('user/avatar')
      if (res.data.avatar.avatar !== undefined){
        setAvatar(res.data.url+res.data.avatar.avatar)
      }
    }catch(e){
      //
    }
  }

  const links = [
    <>
      <NavLinkItem key={1} className={showNavLinks ? "text-black" : "text-white"}>
        <NavLink exact to={'/'} onClick={() => scrollTo("sorteios")}>
          Sorteios
          <span className="hidden absolute -bottom-5 bg-green-custom-darker rounded-full h-1 inset-x-0"/>
        </NavLink>
      </NavLinkItem>
      <NavLinkItem key={2} className={showNavLinks ? "text-black" : "text-white"}>
        <NavLink exact to={"/#ganhadores"} onClick={() => scrollTo("ganhadores")}>
          Ganhadores
          <span className="hidden absolute -bottom-5 bg-green-custom-darker rounded-full h-1 inset-x-0"/>
        </NavLink>
        
      </NavLinkItem>
      <NavLinkItem key={3}>
        {user ? 
        <a className={showNavLinks ? "text-black" : "text-white"} onClick={() => user.role === 'admin' ? history.push('/dashboard') : history.push('/dashboard/client', {credit: true})}>
          Adicionar créditos
          <span className="hidden absolute -bottom-5 bg-green-custom-darker rounded-full h-1 inset-x-0"/>
        </a>
          :
        <a className={showNavLinks ? "text-black" : "text-white"} onClick={() => history.push('/login')}>
          Adicionar créditos
          <span className="hidden absolute -bottom-5 bg-green-custom-darker rounded-full h-1 inset-x-0"/>
        </a>
        }
      </NavLinkItem>
      {user ? (
        <Fragment>
          <div className="relative flex items-center p-2 md:mr-2 md:mb-0 mb-2 mr-0 bg-green-400 transition duration-200 ease-out hocus:bg-green-600 hocus:text-white rounded-md cursor-pointer"
            onClick={() => setActiveDD(!activeBalanceDD)}>
            R${balance}
            <ClearStateButton onClick={() => setActiveDD(false)} className={activeBalanceDD ? "block" : "hidden"}/>
            <DropdownMenu className={activeBalanceDD ? "block" : "hidden"}>
              <a onClick={() => user.role === 'admin' ? history.push('/dashboard') : history.push('/dashboard/client', {credit: true})}
               className="block px-4 py-2 text-gray-800 hover:bg-green-custom hover:text-white">Adicionar créditos</a>
            </DropdownMenu>
          </div>
          <NavbarUserContainer className={active ? "text-white" : ''} onClick={() => setActive(!active)}>
            <img src={avatar} className="w-10 h-10 rounded-full object-cover"/>
            <ClearStateButton onClick={() => setActive(false)} className={active ? "block" : "hidden"}/>
            <DropdownMenu className={active ? "block" : "hidden"}>
              <a className="block px-4 py-2 text-gray-800 hover:bg-green-custom hover:text-white"
               onClick={() => user.role === "client" ? history.push("/dashboard/client") : history.push("/dashboard")}>Dashboard</a>
              <a onClick={() => {
                history.push('/dashboard/client/atualizar')
              }} className="block px-4 py-2 text-gray-800 hover:bg-green-custom hover:text-white">Alterar dados</a>
              <a onClick={() => signOut()} className="block px-4 py-2 text-gray-800 hover:bg-green-custom hover:text-white">Sair</a>
            </DropdownMenu>
          </NavbarUserContainer>
        </Fragment>
      ) : (
        <Fragment>
          <div className="flex flex-col lg:flex-row items-center">
            <button className="flex flex-row items-center rounded border text-green-custom border-white font-bold p-2 hover:bg-white transform transition-colors" 
              onClick={() => history.push('/login')}>
              <IoLogInOutline className="mr-1 text-xl"/>
              <h1>Entrar</h1>
            </button>
            <button className="flex flex-row items-center ml-4 rounded font-bold p-2 text-white bg-green-custom-darker hover:bg-green-custom hover:text-white transform transition-colors"
              onClick={() => history.push('/cadastrar')}
            >
              <FaUserCircle className="mr-1 text-xl"/>
              Registrar
            </button>
          </div>
        </Fragment>
      )}
    </>
  ]

  useEffect(() => {
    if (user) getUserBalance()
  }, [])

  const getUserBalance = async() => {
    try {
      const res = await api.get('/user/balance')
      setBalance(res.data.balance.toFixed(2))
    } catch (error) {
      //
    }
  }

  return (
    <header className="fixed flex w-full z-50 bg-black lg:bg-transparent">
      <nav className="hidden max-w-screen-xl mx-auto md:flex p-4 flex-1 bg-black rounded-bl-xl rounded-br-xl justify-between items-center">
        <div className="flex items-center font-black border-b-0 text-2xl ml-0 md:flex lg:flex" >
          <a href="/">
            <img className="mr-3 w-16" src={logo} />
          </a>
        </div>
        <div className="flex flex-row md:flex lg:flex">
          {links}
        </div>
      </nav>
      <MobileNavLinksContainer>
        <a href="/">
          <img className="ml-3 w-16" src={logo} />
        </a>
        <MobileNavLinks initial={{ x: "150%", display: "none" }} animate={animation} >
          {links}
        </MobileNavLinks>
        <NavToggle onClick={toggleNavbar} className={showNavLinks ? "open" : "closed"}>
          {showNavLinks ? <MdClose tw="w-6 h-6" /> : <FiMenu tw="w-6 h-6" />}
        </NavToggle>
      </MobileNavLinksContainer>
    </header>
  );
}

export default Header;
