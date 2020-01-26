import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import TimeTableListScreen from '../screens/Attendance/TimeTableListScreen';
import CheckInScreeen from '../screens/Attendance/CheckInScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const AttendanceStack = createStackNavigator(
    {
      TimeTableList : TimeTableListScreen,
      CheckIn : CheckInScreeen,
  
    },
    {
      initialRouteName : 'TimeTableList'
    },config
);


export default AttendanceStack;
