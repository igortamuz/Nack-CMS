import React, { useEffect } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

// import internal(own) modules
import MainLayout from "../components/layout";
import {useAuth} from '../hooks/auth'

interface IRouteProps extends RouteProps{
   component: React.ComponentType;
}

const MainLayoutRoute: React.FC<IRouteProps> = ({
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
            if (user !== undefined ){
               return (
               <MainLayout>
                  <Component>{{...matchProps, user}}</Component>
               </MainLayout>)
            } else{
               return <Redirect to={{pathname: '/'}}></Redirect>
            }
         }}
      />
   );
};

export default MainLayoutRoute;