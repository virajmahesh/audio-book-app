import * as Google from "expo-google-app-auth";
import * as AppSettings from "./AppSettings";
import * as Utils from './Utils';
import {EVENT, SIGN_IN_PROVIDERS} from './Track';
import * as SecureStore from "expo-secure-store";
import {withNavigation} from 'react-navigation';
import Constants from "expo-constants";
import * as Segment from "expo-analytics-segment";


@withNavigation
export default class AuthSessionManager {

    static config = {
        androidClientId: AppSettings.GOOGLE_ANDROID_CLIENT_ID_DEV,
        androidStandaloneAppClientId: AppSettings.GOOGLE_ANDROID_CLIENT_ID_PROD,
        scopes: ['profile', 'email']
    };

    static state = {
        isLoggedIn: false
    };

    static async loginWithGoogle() {
        const {type, accessToken, user} = await Google.logInAsync(AuthSessionManager.config);

        Segment.trackWithProperties('EVENT', {
            type: EVENT.SIGN_IN_COMPLETE,
            signInStatus: type,
            signInProvider: SIGN_IN_PROVIDERS.GOOGLE
        });

        if (type === 'success') {
            AuthSessionManager.state.accessToken3P = accessToken;
            AuthSessionManager.state.user = {
                firstName: user.givenName,
                lastName: user.familyName,
                googleID: user.id,
                profileImageURL: user.photoUrl,
                email: user.email,
                backend: 'google',
                installationID: Constants.installationId
            };
            AuthSessionManager.state.backend = 'Google';
            AuthSessionManager.state.isLoggedIn = true;

            await AuthSessionManager.get1PTokens();
            await AuthSessionManager.saveLoginInfo();
        }
    }

    static hasGoogleToken() {
        return AuthSessionManager.state.accessToken3P !== null || AuthSessionManager.state.backend === 'google'
    }

    static hasFacebookToken() {

    }

    static has1PAccessToken() {

    }

    static isLoggedIn() {
        return AuthSessionManager.state !== null && AuthSessionManager.state.isLoggedIn;
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

    static getUserID() {
        return AuthSessionManager.state.user.userID1P;
    }

    static getFullName() {
        return AuthSessionManager.getFirstName() + ' ' + AuthSessionManager.getLastName();
    }

    static getEmail() {
        return AuthSessionManager.state.user.email;
    }

    static getUser() {
        return AuthSessionManager.state.user;
    }

    static async logOut() {
        AuthSessionManager.state = {};
        await AuthSessionManager.saveLoginInfo();
    }

    static setSegmentIdentity() {
        if (!AuthSessionManager.isLoggedIn()) {
            Segment.identify(Constants.installationId);
        } else {
            Segment.identifyWithTraits(
                AuthSessionManager.getEmail(),
                AuthSessionManager.getUser()
            );
        }
    }

    static async get1PTokens() {
        if (this.hasGoogleToken()) {
            let requestBody = Utils.queryString({
                grant_type: 'convert_token',
                client_id: AppSettings.AUTH_CLIENT_ID,
                client_secret: AppSettings.AUTH_CLIENT_SECRET,
                backend: 'google-oauth2',
                token: AuthSessionManager.state.accessToken3P
            });

            //TODO: Log how long this request takes
            await fetch(AppSettings.SOCIAL_AUTH_API_ENDPOINT, {
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
                    AuthSessionManager.state.user.userID1P = responseJson.user_id.toString();
                });
        }
    }

    static async saveLoginInfo() {
        await SecureStore.setItemAsync('STATE', JSON.stringify(AuthSessionManager.state));
    }

    static async loadLoginInfo() {
        AuthSessionManager.state = JSON.parse(await SecureStore.getItemAsync('STATE'));

        if (AuthSessionManager.state === {}) {
            //TODO: Log that there was no state to load
            AuthSessionManager.state = {isLoggedIn: false};
        }
    }
}