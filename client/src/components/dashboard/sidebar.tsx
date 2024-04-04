import React, {Fragment} from 'react';

import { FiPlusCircle, FiSettings, FiUsers } from 'react-icons/fi'
import { MdBusiness, MdDashboard } from 'react-icons/md'
import { FaMoneyCheckAlt, FaUsers, FaWallet } from 'react-icons/fa';

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import {
  SidebarArea, SidebarHeader, SidebarLogo, SidebarMenu,
  SidebarMenuGroup, SidebarMenuGroupHeader, SidebarMenuItem,
  SidebarMenuItemText, SidebarMenuItemIcon
} from './components/sidebar';
import logo from '../../assets/images/logo-semfundo.png'

const AddIcon = SidebarMenuItemIcon(FiPlusCircle)
const DashboardIcon = SidebarMenuItemIcon(MdDashboard)
const SettingsIcon = SidebarMenuItemIcon(FiSettings)
const UsersIcon = SidebarMenuItemIcon(FaUsers)
const VerifyIcon = SidebarMenuItemIcon(FaMoneyCheckAlt)
const AffiliatesIcon = SidebarMenuItemIcon(FiUsers)
const AffiliatesExtractIcon = SidebarMenuItemIcon(MdBusiness)
const WalletIcon = SidebarMenuItemIcon(FaWallet)

const Sidebar: React.FC = () => {
  const {user} = useAuth()
  return (
    <Fragment>
      <SidebarArea>
          <SidebarHeader>
            <SidebarLogo>
              <a href="/"><img className="h-8 lg:h-12" src={logo} alt="gosorte-logo" /></a>
            </SidebarLogo>
          </SidebarHeader>
          <SidebarMenu>
            {user.role === 'admin' ? (
              <Fragment>
                <SidebarMenuGroupHeader>Sorteios</SidebarMenuGroupHeader>
                <SidebarMenuGroup>
                  <SidebarMenuItem>
                    <NavLink exact to={"/dashboard"}>
                      <DashboardIcon/>
                      <SidebarMenuItemText>Sorteios</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink exact to={"/dashboard/create"}>
                      <AddIcon/>
                      <SidebarMenuItemText>Criar sorteio</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenuGroup>

                <SidebarMenuGroupHeader>Usuários</SidebarMenuGroupHeader>
                <SidebarMenuGroup>
                  <SidebarMenuItem>
                    <NavLink exact to={"/dashboard/users"}>
                      <UsersIcon/>
                      <SidebarMenuItemText>Usuários</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenuGroup>

                <SidebarMenuGroupHeader>Autorizações</SidebarMenuGroupHeader>
                <SidebarMenuGroup>
                  <SidebarMenuItem>
                    <NavLink exact to={"/dashboard/validate/tickets"}>
                      <VerifyIcon/>
                      <SidebarMenuItemText>Validar ticket</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink exact to={"/dashboard/validate/credit"}>
                      <WalletIcon/>
                      <SidebarMenuItemText>Validar crédito</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenuGroup>

                <SidebarMenuGroupHeader>Configurações</SidebarMenuGroupHeader>
                <SidebarMenuGroup>
                  <SidebarMenuItem>
                    <NavLink exact to={"/dashboard/config/afiliados"}>
                      <SettingsIcon/>
                      <SidebarMenuItemText>Afiliação</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenuGroup>
              </Fragment>
            ) : (
              <Fragment>
                <SidebarMenuGroupHeader>Dashboard</SidebarMenuGroupHeader>
                <SidebarMenuGroup>
                  <SidebarMenuItem >
                    <NavLink exact to={"/dashboard/client"}>
                      <DashboardIcon/>
                      <SidebarMenuItemText>Dashboard</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem >
                    <NavLink exact to={"/dashboard/client/credits"}>
                      <WalletIcon/>
                      <SidebarMenuItemText>Créditos</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenuGroup>
                <SidebarMenuGroupHeader>Afiliados</SidebarMenuGroupHeader>
                <SidebarMenuGroup>
                  <SidebarMenuItem >
                    <NavLink exact to={"/dashboard/client/afiliados"}>
                      <AffiliatesIcon/>
                      <SidebarMenuItemText>Meus afiliados</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem >
                    <NavLink exact to={"/dashboard/client/extrato"}>
                      <AffiliatesExtractIcon/>
                      <SidebarMenuItemText>Meu extrato</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenuGroup>
                <SidebarMenuGroupHeader>Configurações</SidebarMenuGroupHeader>
                <SidebarMenuGroup>
                  <SidebarMenuItem>
                    <NavLink exact to={"/dashboard/client/atualizar"}>
                      <SettingsIcon/>
                      <SidebarMenuItemText>Editar informações</SidebarMenuItemText>
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenuGroup>
              </Fragment>
            )}
          </SidebarMenu>
        </SidebarArea>
    </Fragment>
  );
}

export default Sidebar;
