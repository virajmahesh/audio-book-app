import React from "react";
import {withNavigation} from 'react-navigation';

import AuthSessionManager from "../utils/AuthSessionManager";
import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import * as Utils from '../utils/Utils';
import {BUTTON, EVENT, SCREEN} from "../utils/Track";

import * as Segment from "expo-analytics-segment";

@withNavigation
class AuthPage extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        AuthSessionManager.setSegmentIdentity();
    }

    async logInWithGoogle() {
        Segment.trackWithProperties('EVENT', {
            type: EVENT.BUTTON_CLICKED,
            button: BUTTON.SIGN_IN_WITH_GOOGLE
        });

        //TODO: Track how long the sign in with Google takes
        await AuthSessionManager.loginWithGoogle();
        if (AuthSessionManager.isLoggedIn()) {
            this.props.navigation.dispatch(Utils.resetNavigation('Home'));
        }
    }

    render() {
        if (!AuthSessionManager.isLoggedIn()) {
            // Render login screen
            Segment.screen(SCREEN.AUTH_PAGE);

            return (
                <View>
                    <View style={styles.headingWrapper}>
                        <View style={styles.titleWrapper}>
                            <Image
                                source={require('../assets/icon.png')}
                                style={{height: 40, width: 40, marginRight: 10}}
                            />
                            <View>
                                <Text style={styles.authPageTitle}>Aurelius</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.authPageSubtitle}>15,000+ Audiobooks</Text>
                        </View>
                        <View>
                            <Text style={styles.authPageSubtitle}>Audio Fanfiction coming soon!</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '60%'
                    }}>
                        <TouchableHighlight
                            onPress={() => this.logInWithGoogle()}
                            style={{borderRadius: 2}}>
                            <View style={styles.logInButton}>
                                <View style={styles.googleLogo}>
                                    <Image source={require('../assets/google-logo.png')}
                                           style={{height: 30, width: 30}}/>
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
    headingWrapper: {
        height: '40%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    authPageTitle: {
        fontSize: 50,
        textAlign: 'center',
        fontFamily: 'product-sans-bold',
    },
    authPageSubtitle: {
        fontFamily: 'product-sans',
        fontSize: 19,
        marginBottom: 10
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