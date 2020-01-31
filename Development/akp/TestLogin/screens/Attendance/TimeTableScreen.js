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
    Slider,
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
            startDayOfWeek: '',
            dayOfweekList: [],
            timetablelist: [],
            calendarRepList: [],
            loading: true,
            datetimetable: false,
            calendar: false,
            clickDate: '',
            monthYear: '',
            width: Dimensions.get('window').width - 40,
            height: Dimensions.get('window').height,
            oriwidth: Dimensions.get('window').width,

            cardwidth: (Dimensions.get('window').width / 7) - 5,
            cardheight: (Dimensions.get('window').width / 7) - 5,

        };

        this._loadAsync = this._loadAsync.bind(this);
        this.checkIn = this.checkIn.bind(this)
        this.home = this.home.bind(this)
        this.getChildList = this.getChildList.bind(this)
        this.gettimetable = this.gettimetable.bind(this)
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


        try {
            const response = await axios.get('https://agkt-shmgmt.herokuapp.com/rest/student/calendardatelist/',
                { headers: headers });
            console.log(response.data)
            if (this.mounted) {
                this.setState({
                    loading: false,
                    dayOfweekList: response.data.dayOfweekList,
                    calendarRepList: response.data.calendarRepList, monthYear: response.data.monthYear, calendar: true,
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
        const response = await axios.get('https://agkt-shmgmt.herokuapp.com/rest/parent/childAuth' + queryString,
            { headers: headers });

        const studentObject = {};
        studentObject.token = response.data.authenticationToken;
        studentObject.studentId = studentId;
        await AsyncStorage.setItem('studentObject', JSON.stringify(studentObject))
    }

    async gettimetable(date) {
        const object = await AsyncStorage.getItem('studentObject');
        const resObject = JSON.parse(object);
        const token = resObject.token;

        const headers = {
            'Content-Type': 'application/json',
            'auth': token,
            'schoolid': '9'
        }


        try {
            const response = await axios.post('https://agkt-shmgmt.herokuapp.com/rest/student/class/datetimetable/' + date + '/',
                {},
                { headers: headers });
            console.log(response.data)
            if (this.mounted) {
                this.setState({
                    loading: false, clickDate: date,
                    timetablelist: response.data, datetimetable: true,
                })
            }


        } catch (error) {
            console.log(error.message)
            if (error.message === "Request failed with status code 401") {

            }
            console.log(error)
        }
    }



    checkIn(timetableslotId, batch, subject, teacher) {
        this.props.navigation.navigate('CheckIn',
            { timetableslotid: timetableslotId, batch: batch, subject: subject, teacher: teacher })
    }

    home() {
        this.props.navigation.navigate('Auth')
    }


    render() {
        const { loading, dayOfweekList, calendarRepList, timetablelist, monthYear, calendar, datetimetable, clickDate } = this.state;
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
                    {
                        calendar == true ? (
                            <View style={[styles.flexrow, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Card
                                    containerStyle={[styles.cardViewHeaderStyle, { width: this.state.oriwidth - 5, }]}>
                                    <Text style={[styles.cardViewText, { fontWeight: 'bold', fontSize: 18 }]}>{monthYear}</Text>
                                </Card>
                            </View>
                        ) : (null)
                    }

                    <View>
                        <View style={styles.flexrow}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                {
                                    dayOfweekList.map((item) => {
                                        return (
                                            <View style={styles.flexcolumn}>
                                                <Card
                                                    containerStyle={[styles.cardViewHeaderStyle, { width: this.state.cardwidth, height: this.state.cardheight, }]}>
                                                    <Text style={styles.cardViewText}>{item}</Text>
                                                </Card>
                                            </View>
                                        )
                                    }
                                    )
                                }
                            </View>
                        </View>
                        <View>
                            {
                                calendarRepList.map((item) => {
                                    return (
                                        <View style={styles.flexrow} key={item.id}>{
                                            item.timetabledatelist.map((inneritem) => {
                                                return (
                                                    inneritem.num != 0 ? (
                                                        inneritem.now == true ? (
                                                            <Touchable
                                                                key={inneritem.id}
                                                                onPress={() => this.gettimetable(inneritem.date)}
                                                                style={styles.flexcolumn} >
                                                                <View >
                                                                    <Card containerStyle={[styles.cardViewStyle, { width: this.state.cardwidth, height: this.state.cardheight + 7, }]}>
                                                                        <Text style={styles.textStyle}>{inneritem.num}</Text>
                                                                    </Card>
                                                                </View>
                                                            </Touchable>
                                                        ) : (<View style={styles.flexcolumn} key={inneritem.id}>
                                                            <Card containerStyle={[styles.cardViewHeaderStyle, { width: this.state.cardwidth, height: this.state.cardheight + 7, }]}>
                                                                <Text style={styles.textStyle}>{inneritem.num}</Text>
                                                            </Card>
                                                        </View>)
                                                    ) : (
                                                            <View style={styles.flexcolumn}></View>
                                                        )
                                                );
                                            }
                                            )
                                        }
                                        </View>
                                    );
                                })
                            }

                        </View>
                        {
                            datetimetable == true ? (
                                <View
                                    style={{
                                        borderBottomColor: '#ff9900',
                                        borderBottomWidth: 1,
                                        marginVertical: 20,
                                        marginHorizontal: 5
                                    }}
                                />
                            ) : (null)
                        }

                        {/* horizontal slider*/}
                        <View style={{ marginBottom: 10 }}>
                            <Carousel
                                hideIndicators={true}
                                animate={false}>
                                {
                                    timetablelist.map(item => {
                                        return (
                                            <View key={item.id} style={{ flexDirection: 'row' }}>
                                                <Card
                                                    containerStyle={[styles.cardViewStyleHor, { width: this.state.oriwidth - 10 }]}>
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
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                                            <View style={[
                                                                { alignItems: 'flex-start', marginRight: 0, alignSelf: 'flex-start', marginTop: 20, }
                                                            ]}>
                                                                <Text style={{ fontWeight: 'bold', fontSize: 15, }}>{clickDate}</Text>
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
                                                                    titleStyle={{ fontSize: 15, }}
                                                                    title='Get Attendance'
                                                                    onPress={() =>
                                                                        this.checkIn(item.id, item.certificationBatchRep.batchName, item.subjectRep.name, item.teacherRep.name)}
                                                                />

                                                            </View>
                                                        </View>

                                                    </View>
                                                </Card>
                                            </View>
                                        );
                                    }
                                    )
                                }
                            </Carousel>
                        </View>

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
    }, cardViewStyleMonth: {

    },

});


