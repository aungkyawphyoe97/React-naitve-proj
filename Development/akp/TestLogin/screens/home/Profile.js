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
import Loading from '../../components/Loading'
import Constants from "expo-constants";

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
            profileObj :{},
            pstudentObj : {},
            parentObj : {},
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
        this.setState({loading: true})
        const object = await AsyncStorage.getItem('studentObject');
        const resObject = JSON.parse(object);
        const token = resObject.token;
        const studentId = resObject.studentId

        const headers = {
            'Content-Type': 'application/json',
            'auth': token,
            'schoolid': '9'
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

        console.log('studentId', studentId)
        try {
            console.log('studentId', `${Constants.manifest.extra.baseUrl}student/${studentId}`)
            const response = await axios.get(`${Constants.manifest.extra.baseUrl}student/${studentId}`,
                { headers: headers });

            //destucturing

            const {data}= response
            console.log('data', data)
            console.log(response.data.studentAccountRep.id+">>>>>>")
            if (this.mounted) {
                this.setState({
                    loading: false,
                    profileObj: data,
                    pstudentObj : data.studentAccountRep,
                    parentObj : data.parentAccountRep,

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
        const response = await axios.get(`${Constants.manifest.extra.baseUrl}/parent/childAuth` + queryString,
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
        const { loading, profileObj ,pstudentObj,parentObj} = this.state;
        if (loading) {
            return (
                <Loading icon="name"/>
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

                <ScrollView>
                    <View style={[styles.flexrow, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Card
                            containerStyle={[styles.cardViewHeaderStyle, { width: this.state.oriwidth - 5, }]}>
                        
                            <View style={{ flex: 1,flexDirection : 'column' }}>
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

                                    <Text style={styles.profileTextStyle}>{profileObj.name}</Text>
                                </View>

                                <View style={{ alignItems:'flex-start',marginTop : 30, }}>
                                    <Text style = {styles.labelText}>LocalId</Text>
                                    <Text style ={styles.textStyle}>{profileObj.localId}</Text>
                                </View>

                                <View style={{ alignItems:'flex-start',marginTop : 10, }}>
                                    <Text style = {styles.labelText}>LoginId</Text>
                                    <Text style ={styles.textStyle}>{pstudentObj.email}</Text>
                                </View>

                                <View style={{ alignItems:'flex-start',marginTop : 10, }}>
                                    <Text style = {styles.labelText}>Date Of Birth</Text>
                                    <Text style ={styles.textStyle}>{pstudentObj.dateOfBath}</Text>
                                </View>

                                <View style={{  alignItems:'flex-start',marginTop : 10, }}>
                                    <Text style = {styles.labelText}>NRC</Text>
                                    <Text style ={styles.textStyle}>{pstudentObj.nrc}</Text>
                                </View>

                                <View style={{  alignItems:'flex-start',marginTop : 10, }}>
                                    <Text style = {styles.labelText}>Phone No.</Text>
                                    <Text style ={styles.textStyle}>{pstudentObj.phone1}</Text>
                                </View>
                                <View style={{  alignItems:'flex-start',marginTop : 10, }}>
                                    <Text style = {styles.labelText}>Address</Text>
                                    <Text style ={styles.textStyle}>{pstudentObj.address1}</Text>
                                </View>

                                <View style={{  alignItems:'flex-start',marginTop : 20, }}>
                                    <Text style = {[styles.labelText,{color:'#ff9900'}]}>Parent Info</Text>
                                </View>
                                <View style={{  alignItems:'flex-start', marginTop : 10,}}>
                                    <Text style = {styles.labelText}>Name</Text>
                                    <Text style ={styles.textStyle}>{parentObj.userName}</Text>
                                </View>
                                <View style={{  alignItems:'flex-start',marginTop : 10,}}>
                                    <Text style = {styles.labelText}>LoginId</Text>
                                    <Text style ={styles.textStyle}>{parentObj.loginId}</Text>
                                </View>


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
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#ff9900'
    },labelText : {
        fontSize : 16,
        fontWeight : 'bold'
    },textStyle : {
        fontSize :15,
        marginTop : 5,
        color : '#828282',
        fontWeight : 'bold'
    }

});


