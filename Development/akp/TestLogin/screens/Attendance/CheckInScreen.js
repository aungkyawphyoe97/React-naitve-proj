import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    Platform,
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    StatusBar,
    Container, Navbar ,
} from 'react-native';


import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-elements';

const axios = require('axios');

const BAR_HEIGHT = StatusBar.currentHeight;
const AppStatusBar = ({ backgroundColor, ...props }) => {
    return (
        <View style={[styles.statusBar, backgroundColor]}>
            <StatusBar backgroundColor={backgroundColor} {...props} />
        </View>
    );
};

export default class CheckInScreen extends React.Component {

    static navigationOptions = {
        title: 'Check In',
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor: '#fff',
        },
        backgroundColor: '#fff',
    };

    constructor(props) {
        super(props);

        this.state = {
            studentList: [],

        };
        this.home = this.home.bind(this);
        this.checkIn = this.checkIn.bind(this);
    }

    async checkIn(timetableslotid) {
        const object = await AsyncStorage.getItem('studentObject');
        const resObject = JSON.parse(object);
        const token = resObject.token;
        const studentId = resObject.studentId;

        const headers = {
            'Content-Type': 'application/json',
            'auth': token,
            'schoolid' : '9'
        }

        const queryString = studentId + '/' + timetableslotid
        const response = await axios.get('https://agkt-shmgmt.herokuapp.com/rest/parent/attendancecheckin/' + queryString,
            { headers: headers });

        const msg = response.data.msg

        if (msg == 'success') {
            Alert.alert(
                'Attendance',
                'Check In Successful',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ]
            );
        } else {
            Alert.alert(
                'Attendance',
                'Check In Fail',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ]
            );
        }

    }

    home() {
        this.props.navigation.navigate('TimeTableList')
    }

    render() {
        const timetableslotid = this.props.navigation.getParam('timetableslotid', '0');
        const batch = this.props.navigation.getParam('batch', '');
        const subject = this.props.navigation.getParam('subject', '');
        const teacher = this.props.navigation.getParam('teacher', '');

        return (
                <View style={styles.container}>
                {
                    Platform.OS === 'ios' ?
                            <StatusBar
                                translucent
                                backgroundColor="#00BCD4"
                                barStyle="dark-content"
                            />
                        :
                        <AppStatusBar barStyle="dark-content" />
                }

                    <Card
                        containerStyle={[{
                            elevation: 3,
                            marginHorizontal: 5, marginVertical: 8,
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowRadius: 10,
                            shadowOpacity: 0.25,
                        }
                        ]}>
                        <View>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <View><Ionicons name="ios-home" size={30} color="#ff9900" style={{ marginRight: 10 }} /></View>
                                <View>
                                    <Text style={styles.optionText}>{batch}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <View><Ionicons name="ios-book" size={30} color="#ff9900" style={{ marginRight: 10 }} /></View>
                                <View>
                                    <Text style={styles.optionText}>{subject}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <View><Ionicons name="ios-people" size={30} color="#ff9900" style={{ marginRight: 10 }} /></View>
                                <View>
                                    <Text style={styles.optionText}>{teacher}</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                    <View style={{ marginTop: 80, alignItems: 'center' }}>
                        {
                            Platform.OS === 'ios' ?
                                <View style={[styles.buttonStyle,]}>
                                    <Button
                                        onPress={() => this.checkIn(timetableslotid)}
                                        title="Check In"
                                        color="#fff"

                                    />
                                </View>
                                :
                                <View style={styles.buttonStyleAndroid}>
                                    <Button
                                        upperCase={false}
                                        title='CheckIn'
                                        onPress={() => this.checkIn(timetableslotid)}
                                        color="#ff9900" />
                                </View>

                        }
                    </View>
                    <View></View>
                </View>
        );

    }

}




const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DEDEDE',
        flex: 1,
        flexDirection: 'column',

    },
    buttonStyle: {
        width: 200,
        height: 40,
        backgroundColor: '#ff9900',
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
    },
    buttonStyleAndroid: {
        width: 200,
        height: 40,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
    },
    optionText: {
        paddingTop: 4,
        fontSize: 18,
        marginTop: 1,
    },
    statusBar: {
        height: 0,
        backgroundColor: '#000',
    },


});
