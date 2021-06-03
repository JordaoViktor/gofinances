import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import {SignIn} from '../screens'
const {Navigator, Screen} = createStackNavigator();

export function AuthRoutes(){
  return(
    <Navigator headerMode="none">
      <Screen
        name="SignIn"
        component={SignIn}
      />
    </Navigator>
  )
}
