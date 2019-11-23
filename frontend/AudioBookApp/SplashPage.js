import React from "react";
import AuthSessionManager from "./AuthSessionManager";
import {withNavigation} from 'react-navigation';
import {Text, View} from "react-native";
import * as Font from "expo-font";
import * as Utils from './Utils';
import {SplashScreen} from "expo";

@withNavigation
class SplashPage extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            authStateLoaded: false
        };
        SplashScreen.preventAutoHide();
    }

    componentDidMount() {
        console.log('Mounting');
        this.loadFonts();
        this.loadLoginInfo();

        if (this.state.authStateLoaded && this.state.fontsLoaded) {
            this.redirectToApp();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('Did update');
        console.log(this.state);
        if (!this.state.authStateLoaded || !this.state.fontsLoaded) {
            return;
        }

        console.log(AuthSessionManager.isLoggedIn());
        console.log(AuthSessionManager.getState());
        SplashScreen.hide();

        this.redirectToApp();
    }

    redirectToApp() {
        if (AuthSessionManager.isLoggedIn()) {
            this.props.navigation.dispatch(
                Utils.resetNavigation('Home')
            );
        } else {
            this.props.navigation.dispatch(
                Utils.resetNavigation('Auth')
            );
        }
    }

    async loadLoginInfo() {
        await AuthSessionManager.loadLoginInfo();
        this.setState({
            authStateLoaded: true
        })
    }

    async loadFonts() {
        if (this.state.fontsLoaded) {
            return;
        }

        await Font.loadAsync({
            'product-sans': require('./assets/fonts/ProductSansRegular.ttf'),
            'product-sans-bold': require('./assets/fonts/ProductSansBold.ttf'),
            'product-sans-italic': require('./assets/fonts/ProductSansItalic.ttf'),
            'product-sans-bold-italic': require('./assets/fonts/ProductSansBoldItalic.ttf'),
        });

        this.setState({
            fontsLoaded: true
        });
    }

    render() {
        return null;
    }


}

export default SplashPage;