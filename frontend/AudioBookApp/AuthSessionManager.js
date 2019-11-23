import * as Google from "expo-google-app-auth";
import * as Settings from "./AppSettings";
import * as Utils from './Utils';
import * as SecureStore from "expo-secure-store";
import {withNavigation} from 'react-navigation';


@withNavigation
export default class AuthSessionManager {

    static config = {
        androidClientId: Settings.GOOGLE_ANDROID_CLIENT_ID,
        scopes: ['profile', 'email']
    };

    static state = {};

    static async loginWithGoogle() {
        //TODO: Log Google log in attempt
        const {type, accessToken, user} = await Google.logInAsync(AuthSessionManager.config);

        if (type === 'success') {
            AuthSessionManager.state.accessToken3P = accessToken;
            AuthSessionManager.state.user = {
                firstName: user.givenName,
                lastName: user.familyName,
                id: user.id,
                profileImageURL: user.photoUrl,
                email: user.email,
                backend: 'google'
            };
            AuthSessionManager.state.backend = 'Google';
            AuthSessionManager.state.isLoggedIn = true;
            console.log(AuthSessionManager.state);
            await AuthSessionManager.get1PTokens();
            await AuthSessionManager.saveLoginInfo();
            //TODO: Log successful login
        }
        //TODO: Log failed login
    }

    static hasGoogleToken() {
        return AuthSessionManager.state.accessToken3P !== null || AuthSessionManager.state.backend === 'google'
    }

    static hasFacebookToken() {

    }

    static has1PAccessToken() {

    }

    static isLoggedIn() {
        return AuthSessionManager.state && AuthSessionManager.state.isLoggedIn;
    }

    static getState() {
        return AuthSessionManager.state;
    }

    static getProfileImageURL() {
        return AuthSessionManager.state.user.profileImageURL;
    }

    static getFirstName() {
        return AuthSessionManager.state.user.firstName;
    }

    static getLastName() {
        return AuthSessionManager.state.user.lastName;
    }

    static getFullName() {
        return AuthSessionManager.getFirstName() + ' ' + AuthSessionManager.getLastName();
    }

    static getEmail() {
        return AuthSessionManager.state.user.email;
    }

    static async logOut() {
        AuthSessionManager.state = {};
        await AuthSessionManager.saveLoginInfo();
    }

    static async get1PTokens() {
        if (this.hasGoogleToken()) {
            let requestBody = Utils.queryString({
                grant_type: 'convert_token',
                client_id: Settings.AUTH_CLIENT_ID,
                client_secret: Settings.AUTH_CLIENT_SECRET,
                backend: 'google-oauth2',
                token: AuthSessionManager.state.accessToken3P
            });

            await fetch(Settings.SOCIAL_AUTH_API_ENDPOINT, {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody
            })
                .then((response => response.json()))
                .then((responseJson) => {
                    AuthSessionManager.state.accessToken1P = responseJson.access_token;
                    AuthSessionManager.state.refreshToken1P = responseJson.refresh_token;
                });
        }
    }

    static async saveLoginInfo() {
        await SecureStore.setItemAsync('STATE', JSON.stringify(AuthSessionManager.state));
    }

    static async loadLoginInfo() {
        AuthSessionManager.state = JSON.parse(await SecureStore.getItemAsync('STATE'));

        if (AuthSessionManager.state === null) {
            console.log('TEST');
            AuthSessionManager.state = {};
        }

        // If isLoggedIn is null, then the user isn't logged in
        if (AuthSessionManager.state.isLoggedIn === null) {
            AuthSessionManager.state.isLoggedIn = false;
        }
    }
}