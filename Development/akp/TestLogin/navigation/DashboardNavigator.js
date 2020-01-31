import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import Dashboard from '../screens/home/Dashboard';
import TimeTableNavigator from './TimeTableNavigator'

import TimeTableListScreen from '../screens/Attendance/TimeTableListScreen';
import CheckInScreeen from '../screens/Attendance/CheckInScreen';
import TimeTableScreen from '../screens/Attendance/TimeTableScreen'
import Profile from '../screens/home/Profile'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const DashboardStack = createStackNavigator(
    {
      Profile : Profile,
      TimeTable : TimeTableListScreen,
      TimeTableScreen : TimeTableScreen,
      CheckIn : CheckInScreeen,
      Dashboard : Dashboard
    },
    {
      initialRouteName : 'Dashboard'
    },config
);


export default DashboardStack;
