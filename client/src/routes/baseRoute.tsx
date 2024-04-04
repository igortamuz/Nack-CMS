import React, { useEffect } from "react";
import { Route, RouteProps } from "react-router-dom";

import {useAuth} from '../hooks/auth'

interface IRouteProps extends RouteProps{
  component: React.ComponentType
  user: any
}

interface INRouteProps {
   path: string
}
const RouteBase: React.FC<INRouteProps> = ({
   ...rest
   }) => {
   const {token, user, updateAuth} = useAuth()

   useEffect(() => {
      updateAuth()
   }, [token])

   return (
      <Route
         {...rest}
         render={(matchProps) => {
            if (!!user){
              return {...matchProps, user}
            } else{
               return {...matchProps}
            }
         }}
      />
   );
};

export default RouteBase;