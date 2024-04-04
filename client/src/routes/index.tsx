import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ClientRoute from './mainLayoutRoute'
import AdminRoute from './AdminRoute'

import Test from '../pages/Test'
import Raffle from '../pages/Raffle'
import LoginPage from '../pages/Login'
import Home from '../pages/Home'
import Rules from '../pages/Rules'
import RegisterPage from '../pages/CreateAccount'
import Dashboard from '../pages/Dashboard'
import ClientDashboard from '../pages/ClientDashboard'
import CreateRaffle from '../pages/CreateRaffle'
import UsersDashboard from '../components/dashboard/users'
import TicketsDashboard from '../components/dashboard/tickets'
import CreditDashboard from '../components/dashboard/credit'
import CreateUser from '../components/dashboard/users/createUser'
import EditUser from '../components/dashboard/users/editUser'
import EditRaffle from '../components/raffle/editRaffle'
import AffiliatesDashboard from '../components/affiliates/list'
import AffiliatesExtractDashboard from '../components/affiliates/extract'
import SettingsAffiliates from '../components/dashboard/config/affiliate'
import UpdateUserInfo from '../components/user/editUserInfo'
import ForgotPassword from '../pages/ForgotPassword'
import PasswordRecovery from '../pages/PasswordRecovery'
import UserCreditsDashboard from '../components/user/credits'

const Routes: React.FC = () => {
  return (
    <Switch>
      <AdminRoute
        path="/dashboard/create"
        component={CreateRaffle}
      />
      <AdminRoute
        path="/dashboard/edit/:id"
        component={EditRaffle}
      />
      <AdminRoute
        path="/dashboard/config/afiliados"
        component={SettingsAffiliates}
      />
      <AdminRoute
        path="/dashboard/users/add"
        component={CreateUser}
      />
      <AdminRoute
        path="/dashboard/users/edit/:id"
        component={EditUser}
      />
      <AdminRoute
        path="/dashboard/users"
        component={UsersDashboard}
      />
      <AdminRoute
        path="/dashboard/validate/tickets"
        component={TicketsDashboard}
      />
      <AdminRoute
        path="/dashboard/validate/credit"
        component={CreditDashboard}
      />
      <ClientRoute 
        path="/dashboard/client/afiliados"
        component={AffiliatesDashboard}
      />
      <ClientRoute 
        path="/dashboard/client/extrato"
        component={AffiliatesExtractDashboard}
      />
       <ClientRoute 
        path="/dashboard/client/atualizar"
        component={UpdateUserInfo}
      />
      <ClientRoute 
        path="/dashboard/client/credits"
        component={UserCreditsDashboard}
      />
      <ClientRoute 
        path="/dashboard/client"
        component={ClientDashboard}
      />
      <AdminRoute 
        path="/dashboard"
        component={Dashboard}
      />
      <Route path="/premio/:id">
        <Raffle />
      </Route>
      <Route path="/payment/success">
        <Test />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/cadastrar/:affiliate?">
        <RegisterPage />
      </Route>
      <Route path="/regulamento">
        <Rules />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword/>
      </Route>
      <Route path="/recuperar-senha/:recovery">
        <PasswordRecovery/>
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

export default Routes