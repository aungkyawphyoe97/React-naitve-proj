import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  AsyncStorage,
  Text,
  View,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {

    componentDidMount() {
        this._loadAsync();
    }

    _loadAsync = async () =>{
        const parentToken = await AsyncStorage.getItem('parentToken');
        const studentObject = await AsyncStorage.getItem('studentObject');
        this.props.navigation.navigate(parentToken ? (studentObject ? 'Dashboard' : 'ChildList') : 'Auth')
    }

    render(){
            return (
                <View>
                    <Text></Text>
                </View>
            );
    }
}

