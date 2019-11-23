import React from "react";
import {withNavigation} from 'react-navigation';

import AuthSessionManager from "./AuthSessionManager";
import {Image, StyleSheet, Text, View, TouchableHighlight} from "react-native";

import * as Settings from './Settings';

@withNavigation
class AuthPage extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    async logInWithGoogle() {
        await AuthSessionManager.loginWithGoogle();
        if (AuthSessionManager.isLoggedIn()) {
            this.props.navigation.navigate('Home');
        }
    }

    render() {
        if (!AuthSessionManager.isLoggedIn()) {
            // Render login screen
            console.log('test');
            return (
                <View>
                    <View>
                        <Text style={styles.authPageTitle}>Aurelius</Text>
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70%'}}>
                        <TouchableHighlight
                            onPress={() => this.logInWithGoogle()}
                            style={{borderRadius: 2}}>
                        <View style={styles.logInButton}>
                            <View style={styles.googleLogo}>
                                <Image source={{uri: Settings.GOOGLE_LOGO_URL}} style={{height: 30, width: 30}}/>
                            </View>
                            <View>
                                <Text style={styles.signInText}>Sign in with Google</Text>
                            </View>
                        </View>
                        </TouchableHighlight>
                    </View>
                </View>
            );
        }
        return null;
    }

}

const styles = StyleSheet.create({
    authPageTitle: {
        fontSize: 40,
        padding: 25,
        textAlign: 'center',
        fontFamily: 'product-sans-bold',
    },
    googleLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50
    },
    signInText: {
        fontFamily: 'product-sans',
        fontSize: 20,
        color: 'grey'
    },
    logInButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        paddingLeft: 30,
        paddingRight: 30,
        height: 50,
        borderWidth: 0.07,
        backgroundColor: '#ffffff'
    }
});

export default AuthPage;