import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SignInNavigator from './SignInNavigator'
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import TimeTableNavigator from './TimeTableNavigator'
import ChildList from '../screens/auth/ChildList';
import DashboardNavigator from './DashboardNavigator';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Auth: SignInNavigator,
    AuthLoading :  AuthLoadingScreen,
    ChildList : ChildList,
    Timetable : TimeTableNavigator,
    Dashboard : DashboardNavigator,
  },
  {
    initialRouteName : 'AuthLoading'
  })
);
