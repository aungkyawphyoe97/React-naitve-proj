import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Button } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-elements';
import { Platform } from '@unimodules/core';

const axios = require('axios');
const BAR_HEIGHT = StatusBar.currentHeight;
const AppStatusBar = ({ backgroundColor, ...props }) => {
    return (
        <View style={[styles.statusBar, backgroundColor]}>
            <StatusBar backgroundColor={backgroundColor} {...props} />
        </View>
    );
};


export default class TimTableList extends React.Component {

    static navigationOptions = {
        title: 'TimeTable',
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor: '#ff9900',
        },
        backgroundColor: '#ff9900',
        

    };


    constructor(props) {
        super(props);

        this.state = {
            timetablelist: [],
            loading: true,
            width: Dimensions.get('window').width - 40,
            height: Dimensions.get('window').height

        };

        this._loadAsync = this._loadAsync.bind(this);
        this.checkIn = this.checkIn.bind(this)
        this.home = this.home.bind(this)
        this.getChildList = this.getChildList.bind(this)
    }

    componentDidMount() {
        this.mounted = true;
        this._loadAsync()
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _loadAsync = async () => {
        const object = await AsyncStorage.getItem('studentObject');
        const resObject = JSON.parse(object);
        const token = resObject.token;

        console.log('student token =' + token)
        const headers = {
            'Content-Type': 'application/json',
            'auth': token,
            'schoolid' : '9'
        }
        
        try {
            const response = await axios.post('https://agkt-shmgmt.herokuapp.com/rest/student/class/todaytimetable/',
                {},
                { headers: headers });
            console.log(response.data)
            this.state.timetablelist = response.data
            if (this.mounted) {
                this.setState({ timetablelist: response.data, loading: false })
            }


        } catch (error) {
            console.log(error.message)
            if (error.message === "Request failed with status code 401") {
                // login again
                this.props.navigation.navigate('Auth')
                console.log('login again')
                this.getChildList(resObject.studentId)
                this._loadAsync()
            }
            console.log(error)
        }


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
    }



    checkIn(timetableslotId, batch, subject, teacher) {
        this.props.navigation.navigate('CheckIn',
            { timetableslotid: timetableslotId, batch: batch, subject: subject, teacher: teacher })
    }

    home() {
        this.props.navigation.navigate('Auth')
    }

    render() {
        const { loading, timetablelist } = this.state;
        if (loading) {
            return (
                <View style={styles.loadingcontainer}>
                    {
                        Platform.OS === 'ios' ?
                            <View
                                style={{
                                    backgroundColor: '#00BCD4',
                                    height: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
                                }}>
                                <StatusBar
                                    translucent
                                    backgroundColor="#00BCD4"
                                    barStyle="dark-content"
                                />
                            </View>
                            :
                            <AppStatusBar barStyle="dark-content" />
                    }
                    <ActivityIndicator size="large" color="#ff9900" />
                </View>
            )
        }


        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    {
                        Platform.OS === 'ios' ?
                            <StatusBar
                                translucent
                                backgroundColor="#00BCD4"
                                barStyle="dard-content"
                            />
                            :
                            <AppStatusBar barStyle="dark-content" />
                    }
                    <View style={styles.body}>
                        <ScrollView>
                            <View>
                                {
                                    timetablelist.map(item => {
                                        return (
                                            <View key={item.id}>
                                                <Card
                                                    containerStyle={styles.cardViewStyle}>
                                                    <View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View><Ionicons name="ios-home" size={18} color="#ff9900" style={{ marginRight: 10 }} /></View>
                                                            <View>
                                                                <Text style={styles.optionText}>{item.certificationBatchRep.batchName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View><Ionicons name="ios-book" size={18} color="#ff9900" style={{ marginRight: 10 }} /></View>
                                                            <View>
                                                                <Text style={styles.optionText}>{item.subjectRep.name}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View><Ionicons name="ios-time" size={18} color="#ff9900" style={{ marginRight: 10 }} /></View>
                                                            <View>
                                                                <Text style={styles.optionText}>{item.periodRep.startTime} - {item.periodRep.endTime}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View><Ionicons name="ios-people" size={18} color="#ff9900" style={{ marginRight: 10 }} /></View>
                                                            <View>
                                                                <Text style={styles.optionText}>{item.teacherRep.name}</Text>
                                                            </View>
                                                        </View>

                                                        <View style={[{
                                                            alignItems: 'flex-end', marginRight: 0, alignSelf: 'flex-end',
                                                            borderRadius: 5,
                                                            shadowColor: '#000000',
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 2
                                                            },
                                                            shadowRadius: 10,
                                                            shadowOpacity: 0.25,
                                                            marginTop: 10,
                                                        }]}>
                                                            <Button
                                                                buttonStyle={{ backgroundColor: '#ff9900', height: 35, }}
                                                                titleStyle = {{ fontSize : 15,}}
                                                                title='Get Attendance'
                                                                onPress={() =>
                                                                    this.checkIn(item.id, item.certificationBatchRep.batchName, item.subjectRep.name, item.teacherRep.name)}
                                                            />

                                                        </View>




                                                    </View>


                                                </Card>
                                            </View>
                                        );
                                    }
                                    )
                                }
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.footer}>
                        {
                            Platform.OS === 'ios' ?
                                <View style={[styles.buttonStyle,]}>
                                    <Button
                                        title='Logout'
                                        onPress={() => this.home()}
                                        color="#fff" />
                                </View>
                                :
                                <View>
                                    <Button
                                        title='Logout'
                                        onPress={() => this.home()}
                                        color="#f54775" />
                                </View>

                        }
                    </View>
                </View>

            </View>
        );
    }
}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DEDEDE'
    },
    loadingcontainer: {
        flex: 1,
        backgroundColor: '#DEDEDE',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 12,
        alignItems: 'stretch',

    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
    },
    optionsTitleText: {
        fontSize: 16,
        marginLeft: 15,
        marginTop: 9,
        marginBottom: 12,
    },
    optionIconContainer: {
        marginRight: 9,
    },
    option: {
        backgroundColor: '#fdfdfd',
        borderBottomColor: '#000',
    },
    optionText: {
        fontSize: 15,
        marginTop: 1,
    },
    buttonStyle: {
        backgroundColor: '#f54775',
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
    }, statusBar: {
        height: 0,
        backgroundColor: '#000',
    }, bottom: {
        position: 'absolute', //Here is the trick
        bottom: 0,
    },
    cardStyle: {
        marginBottom: 5,
        elevation: 4,
        borderRadius: 3,

    }, checkInButtonStyle: {
        backgroundColor: '#ff9900',
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
    }, cardViewStyle: {
        elevation: 3,
        marginHorizontal: 5, marginVertical: 8,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
        borderColor: "#ff9900",
        borderRadius: 5,
    },

});


