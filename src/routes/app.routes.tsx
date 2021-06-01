import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Dashboard, Register} from '../screens'

const {Navigator, Screen} = createBottomTabNavigator()
export function AppRoutes(){
  return(
    <Navigator>
      <Screen
        name="listagem"
        component={Dashboard}
      />
      <Screen
        name="cadastrar"
        component={Register}
      />
    </Navigator>
  )
}

export default AppRoutes;