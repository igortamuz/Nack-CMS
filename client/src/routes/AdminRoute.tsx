import React, { useEffect } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

// import internal(own) modules
import MainLayout from "../components/layout";
import {useAuth} from '../hooks/auth'

interface IRouteProps extends RouteProps{
   component: React.ComponentType;
}

const AdminRoute: React.FC<IRouteProps> = ({
   component: Component,
   ...rest
   }) => {
   const {user, token, updateAuth} = useAuth()

   useEffect(() => {
      updateAuth()
   }, [token])

   return (
      <Route
         {...rest}
         render={(matchProps) => {
            if (!!user && user.role === 'admin'){
               return (
               <MainLayout>
                  <Component>{{...matchProps, user}}</Component>
               </MainLayout>)
            } else if (!!user && user.role === 'client'){
               return (
                  <Redirect to={{pathname: "/dashboard/client"}}></Redirect>
               )
            }
             else{
               return <Redirect to={{pathname: '/'}}></Redirect>
            }
         }}
      />
   );
};

export default AdminRoute;