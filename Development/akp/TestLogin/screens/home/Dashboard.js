import React from 'react';
import * as Font from 'expo-font';
import {
    Image,
    Platform,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    Dimensions,
    View,
    Text,
} from 'react-native';
import { Card } from 'react-native-elements';
import { Icon } from 'react-native-elements'
import Touchable from 'react-native-platform-touchable';
import { Color } from '../../constants/Colors';
import { PtSansCaption } from '../../components/StyledText';

export default class Dashboard extends React.Component {

    static navigationOptions = {
        headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
        headerStyle: {
            backgroundColor: '#ff9900',
        },
        backgroundColor: '#ff9900',


    };

    // async componentDidMount() {
    //    await Font.loadAsync({
    //      'open-sans-bold': require('../../assets/fonts/SpaeMono-Regular.ttf'),
    //});
    //}

    constructor(props) {
        super(props);
        this.state = {
            width: (Dimensions.get('window').width / 2) - 20,
            height: (Dimensions.get('window').width / 2) - 20,
            Color,
        };

    }

    render() {
        
        return (
            <View style={styles.container}>
            
                <ScrollView>
                    <View style={styles.flexrow}>
                        <View style={styles.flexcolumn}>
                            <Touchable
                                onPress={() =>
                                    this.props.navigation.navigate('Profile')}>
                                <Card
                                    containerStyle={[styles.cardViewStyle, { width: this.state.width, height: this.state.height }]}>
                                    <View style={{ alignItems: 'center' }}>
                                        
                                            <Icon
                                                raised
                                                name='account-circle'
                                                type='material'
                                                color='#ff9900'
                                                size ={30}
                                            />
                                        <PtSansCaption><Text style={[styles.cardViewText,]}>Profile</Text></PtSansCaption>
                                    </View>

                                </Card>
                            </Touchable>
                        </View>



                        <View style={styles.flexcolumn}>
                            <Touchable
                                onPress={() =>
                                    this.props.navigation.navigate('TimeTable')}>
                                <Card
                                    containerStyle={[styles.cardViewStyle, { width: this.state.width, height: this.state.height, }]}>
                                    <View style={{ alignItems: 'center', }}>
                                        <Icon
                                            raised
                                            name='table'
                                            type='font-awesome'
                                            color='#ff9900'
                                            size = {30}
                                        />
                                        <Text style={styles.cardViewText}><PtSansCaption>TimeTable</PtSansCaption></Text>
                                    </View>
                                </Card>
                            </Touchable>
                        </View>
                    </View>

                    <View style={styles.flexrow}>
                        <View style={styles.flexcolumn}>
                            <Touchable
                                onPress={() =>
                                    this.props.navigation.navigate('TimeTableScreen')}>
                                <Card
                                    containerStyle={[styles.cardViewStyle, { width: this.state.width, height: this.state.height }]}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Icon
                                            raised
                                            name='check-circle'
                                            type='feather'
                                            color='#ff9900'
                                            size = {30}
                                        />
                                        <Text style={[styles.cardViewText,]}><PtSansCaption>Check In Now</PtSansCaption></Text>
                                    </View>
                                </Card>
                            </Touchable>
                        </View>

                        <View style={styles.flexcolumn}>
                            <View>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flexrow: {
        flex: 2,
        flexDirection: 'row',
    },
    flexcolumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'stretch',
        marginTop: 5,
    }
    , cardViewStyle: {
        elevation: 7,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 0.25,
        backgroundColor: '#ff9900',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }, cardViewText: {
        marginTop: 5,
        fontSize: 18,

    }
});
