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
    Image,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { Card } from 'react-native-elements';
import { Platform } from '@unimodules/core';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

const axios = require('axios');
const BAR_HEIGHT = StatusBar.currentHeight;
const AppStatusBar = ({ backgroundColor, ...props }) => {
    return (
        <View style={[styles.statusBar, backgroundColor]}>
            <StatusBar backgroundColor={backgroundColor} {...props} />
        </View>
    );
};

var Carousel = require('react-native-carousel');


export default class TimTableList extends React.Component {

    static navigationOptions = {
        title: 'Profile',
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor: '#ff9900',
        },
        backgroundColor: '#ff9900',


    };


    constructor(props) {
        super(props);

        this.state = {
            profileObj: {},
            width: Dimensions.get('window').width - 40,
            height: Dimensions.get('window').height,
            oriwidth: Dimensions.get('window').width,
            oriheight: Dimensions.get('window').height,

        };

        this._loadAsync = this._loadAsync.bind(this);
        this.auth = this.auth.bind(this)
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
        const studentId = resObject.studentId

        const headers = {
            'Content-Type': 'application/json',
            'auth': token,
            'schoolid': '2'
        }

        // try {
        //     const response = await axios.post('http://192.168.100.6:8080/com.agkt.shmgmt.web.client/rest/student/class/todaytimetable/',
        //         {},
        //         { headers: headers });
        //     console.log(response.data)
        //     this.state.timetablelist = response.data
        //     if (this.mounted) {
        //         this.setState({ timetablelist: response.data, loading: false })
        //     }


        // } catch (error) {
        //     console.log(error.message)
        //     if (error.message === "Request failed with status code 401") {
        //         // login again
        //         //this.props.navigation.navigate('Auth')
        //         console.log('login again')
        //         //this.getChildList(resObject.studentId)
        //         //this._loadAsync()
        //     }
        //     console.log(error)
        // }


        try {
            const response = await axios.get('https://agkt-shmgmt.herokuapp.com/rest/student/' + studentId,
                { headers: headers });
            console.log(response.data)
            if (this.mounted) {
                this.setState({
                    loading: false,
                    profileObj: response.data

                })
            }
        } catch (error) {
            console.log(error.message)
            if (error.message === "Request failed with status code 401") {

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
        const response = await axios.get('http://192.168.100.6:8080/com.agkt.shmgmt.web.client/rest/parent/childAuth' + queryString,
            { headers: headers });

        const studentObject = {};
        studentObject.token = response.data.authenticationToken;
        studentObject.studentId = studentId;
        await AsyncStorage.setItem('studentObject', JSON.stringify(studentObject))
    }

    auth() {
        this.props.navigation.navigate('Auth')
    }


    render() {
        const { loading, profileObj } = this.state;
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

                {/* Header */}
                <ScrollView>
                    <View style={[styles.flexrow, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Card
                            containerStyle={[styles.cardViewHeaderStyle, { width: this.state.oriwidth - 5, }]}>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    profileObj.photoUrl == "" ? (
                                        <Image
                                            source={require('../../assets/images/shichida.png')}
                                            resizeMode="contain"
                                            fadeDuration={0}
                                            style={{ width: 100, height: 100, marginTop: 1, borderRadius: 50, }}
                                        />
                                    ) : (
                                            <Image
                                                source={{ uri: profileObj.photoUrl }}
                                                resizeMode="contain"
                                                fadeDuration={0}
                                                style={{ width: 100, height: 100, marginTop: 1, borderRadius: 50, }}
                                            />
                                        )
                                }

                                <Text style = {styles.profileTextStyle}>{profileObj.name}</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Loµ</Text>
                            </View>
                        </Card>
                        
                    </View>

                </ScrollView>
            </View>
        );
    }
}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DEDEDE'
    }, loadingcontainer: {
        flex: 1,
        backgroundColor: '#DEDEDE',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }, flexrow: {
        flex: 7,
        flexDirection: 'row',
    },
    flexcolumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'stretch',
        marginTop: 2,
    }, cardViewStyle: {
        elevation: 7,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
        backgroundColor: '#ff9900',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "#ff9900"
    }, cardViewHeaderStyle: {
        elevation: 7,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
        backgroundColor: '#fff',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "#fff"
    }, textStyle: {
        fontSize: 15,
        fontWeight: 'bold',
    }, cardViewText: {
        fontSize: 15,
    }, cardViewStyleHor: {
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
    }, profileTextStyle: {
        fontSize : 18,
        fontWeight : 'bold',
        marginTop : 15,
        color : '#ff9900'
    },

});


