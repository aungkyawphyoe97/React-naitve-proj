import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Button,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
  Keyboard,
} from 'react-native';
import { Input } from 'react-native-elements';
import { Platform } from '@unimodules/core';
import Toast from 'react-native-tiny-toast';


const BAR_HEIGHT = StatusBar.currentHeight;
const AppStatusBar = ({ backgroundColor, ...props }) => {
  return (
    <View style={[styles.statusBar, backgroundColor]}>
      <StatusBar backgroundColor={backgroundColor} {...props} />
    </View>
  );
};

const axios = require('axios');

export default class SignInScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      loading: false,
      width: Dimensions.get('window').width - 40
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  sigin = async () => {
    Keyboard.dismiss();

    const username = this.state.username
    const password = this.state.password

    if (username == '' || password == '') {
      Toast.show('Enter phone no. and password')
    } else {
      const headers = {
        'Content-Type': 'application/json',
        'schoolid': '9'
      }

      const response = await axios.post('https://agkt-shmgmt.herokuapp.com/rest/user/auth',
        {
          username: username,
          password: password
        },
        { headers: headers })
      console.log(response.data)
      const authenticated = response.data.authenticated
      if (authenticated) {
        await AsyncStorage.setItem('parentToken', response.data.authenticationToken)
        this.props.navigation.navigate('ChildList')
        if (this.mounted) {
          this.setState({ loading: true })
        }


      } else {
        if (this.mounted) {
          this.setState({ loading: false })
        }

        Toast.show('phone no. or password wrong')
      }
    }
  }

  render() {
    const { loading } = this.state

    return (
      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={60}>
        {
          Platform.OS === 'ios' ?
            <StatusBar barStyle="dark-content" />
            :
            <AppStatusBar barStyle="dark-content" />
        }
        <View style={[styles.container,]}>
          <View style={styles.optionImage}>
            <Image
              source={require('../../assets/images/shichida.png')}
              resizeMode="contain"
              fadeDuration={0}
              style={{ width: 100, height: 100, marginTop: 1, borderRadius: 50, }}
            />
          </View>
          <View>
            <Text style={styles.titleStye}>
              Shichida
              </Text>
          </View>
          <View style={{ marginLeft: 20, marginRight: 20, width: this.state.width }}>
            <Input
              style={{ width: 50, backgroundColor: 'azure', fontSize: 18, borderBottomWidth: 1.0, marginBottom: 10 }}
              placeholder='Phone'
              keyboardType='numeric'
              marginLeft={15}
              leftIcon={{ type: 'material', name: 'call', alignItems: 'left', color: '#000', }}
              onChangeText={(text) => this.setState({ username: text })}
            />
          </View>
          <View style={{ marginLeft: 20, marginRight: 20, marginTop: 20, width: this.state.width }}>
            <Input
              style={styles.inputStyle}
              placeholder='Password'
              marginLeft={15}
              leftIcon={{ type: 'material', name: 'lock', alignItems: 'left', color: '#000', }}
              secureTextEntry={true}
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>

          {
            Platform.OS === 'ios' ?
              <View style={{ width: this.state.width, marginBottom: 20, }}>
                <View style={styles.buttonStyle}>
                  <Button
                    onPress={() => this.sigin()}
                    title="Login"
                    color="#fff"
                  />
                </View>
              </View>
              :
              <View style={{ width: this.state.width, marginTop: 50, marginBottom: 20, }}>
                <Button
                  onPress={() => this.sigin()}
                  title="Login"
                  color="#ff9900"

                />
              </View>
          }

          {this.state.loading ? (
            <View>
              <ActivityIndicator size="large" color="#ff9900" />
            </View>
          ) : (null)
          }
        </View>

      </KeyboardAvoidingView>

    );
  }
}

SignInScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
  },
  optionIconContainer: {
    marginRight: 9,
    textAlign: 'center'
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#828282',
  },
  optionText: {
    fontSize: 15,
    color: "#2e78b7"
  },
  optionImage: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonStyle: {
    marginTop: 50,
    backgroundColor: '#ff9900',
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    shadowOpacity: 0.25
  },
  inputStyle: {
    width: 100,
    backgroundColor: 'azure',
    fontSize: 18,
    borderBottomWidth: 1.0,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  titleStye: {
    marginBottom: 20,
    marginTop: 5,
    color: '#ff9900',
    fontSize: 20,
  }, statusBar: {
    height: BAR_HEIGHT,
    backgroundColor: '#ff9900'
  },

});
