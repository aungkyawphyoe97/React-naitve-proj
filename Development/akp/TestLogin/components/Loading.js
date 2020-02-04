import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
    StatusBar,
} from 'react-native';

import { Platform } from '@unimodules/core';
import Constants from "expo-constants";
import Colors from "../constants/Colors";
const AppStatusBar = ({ backgroundColor, ...props }) => {
    return (
        <View style={[styles.statusBar, backgroundColor]}>
            <StatusBar backgroundColor={backgroundColor} {...props} />
        </View>
    );
};

const Loading = props => (<View style={styles.loadingcontainer}>
{
    Platform.OS === 'ios' ?
        <View
            style={{
                backgroundColor: '#00BCD4',
                height: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
            }}>
            {console.log(Colors[Constants.manifest.extra.theme].tabIconDefault)}
            <StatusBar
                translucent
                backgroundColor={`${Colors[Constants.manifest.extra.theme].tabIconDefault}`}
                barStyle="dark-content"
            />
        </View>
        :
        <AppStatusBar barStyle="dark-content" />
}
<ActivityIndicator size="large" color="#ff9900" />
</View>)

export default Loading;

const styles = StyleSheet.create({ 
    loadingcontainer: {
        flex: 1,
        backgroundColor: '#DEDEDE',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }, 

});