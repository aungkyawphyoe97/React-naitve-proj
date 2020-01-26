import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import { createAppContainer } from 'react-navigation';
import SignInScreen  from '../screens/auth/SignInScreen'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const SignInStack = createStackNavigator(
  {
    SignIn: SignInScreen,
  }
);


export default SignInStack;
