import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import Touchable from 'react-native-platform-touchable';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    StatusBar,
} from 'react-native';
import { Platform } from '@unimodules/core';

import { Card } from 'react-native-elements'

const axios = require('axios');

const AppStatusBar = ({ backgroundColor, ...props }) => {
    return (
        <View style={[styles.statusBar, backgroundColor]}>
            <StatusBar backgroundColor={backgroundColor} {...props} />
        </View>
    );
};

export default class ChildList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            studentList: [],

        };

        this._loadAsync = this._loadAsync.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this._loadAsync()
    }

    componentWillUnmount() {
        this.mounted = false;
    }




    _loadAsync = async () => {
        const parentToken = await AsyncStorage.getItem('parentToken');

        const headers = {
            'Content-Type': 'application/json',
            'auth': parentToken
        }

        const response = await axios.get('https://agkt-shmgmt.herokuapp.com/rest/parent/childList',
            { headers: headers })
        console.log(response.data)

        this.state.studentList = response.data
        if (this.mounted) { this.setState(this.state.studentList) }



    }

    async getChildList(studentId) {
        const parentToken = await AsyncStorage.getItem('parentToken');

        const headers = {
            'Content-Type': 'application/json',
            'auth': parentToken
        }

        const queryString = '?studentId=' + studentId
        const response = await axios.get('https://agkt-shmgmt.herokuapp.com/rest/parent/childAuth' + queryString,
            { headers: headers });

        const studentObject = {};
        studentObject.token = response.data.authenticationToken;
        studentObject.studentId = studentId;
        await AsyncStorage.setItem('studentObject', JSON.stringify(studentObject))

        const object = await AsyncStorage.getItem('studentObject')
        const resObject = JSON.parse(object);
        const token = resObject.token;

        //this.props.navigation.navigate(token ? 'Timetable' : 'Auth')
        this.props.navigation.navigate(token ? 'Dashboard' : 'Auth')
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    Platform.OS === 'ios' ?
                        <StatusBar barStyle="dark-content" />
                        :
                        <AppStatusBar barStyle="dark-content" />
                }

                {
                    this.state.studentList.map(item => {
                        return (
                                <Touchable
                                    key={item.studentId}
                                    style={styles.option}
                                    background={Touchable.Ripple('#ccc', false)}
                                    onPress={() => this.getChildList(item.studentId)}>

                                    <Card
                                        containerStyle={[{
                                            alignItems: 'center',
                                            elevation: 3,
                                            shadowColor: '#000000',
                                            shadowOffset: {
                                                width: 0,
                                                height: 2
                                            },
                                            shadowRadius: 10,
                                            shadowOpacity: 0.25,
                                            borderRadius: 4,
                                            padding: 1,
                                            borderColor : '#fff'
                                        }
                                        ]}>
                                        <Text style={{ color: '#ff9900', fontSize: 18 }}>{item.name}</Text>
                                    </Card>

                                </Touchable>

                        );
                    }
                    )
                }
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ff9900',
        alignItems: 'stretch',
    }
});