import * as Google from "expo-google-app-auth";
import * as Settings from "./Settings";
import * as SecureStore from "expo-secure-store";

export default class AuthSessionManager {

    static config = {
        androidClientId: Settings.GOOGLE_ANDROID_CLIENT_ID,
        scopes: ['profile', 'email']
    };

    static state = {};

    static async fetchNewGoogleAccessToken() {
        const {type, accessToken, user} = await Google.logInAsync(AuthSessionManager.config);

        if (type === 'success') {
            AuthSessionManager.state.accessToken3P = accessToken;
            AuthSessionManager.state.user = {
                firstName: user.givenName,
                lastName: user.familyName,
                id: user.id,
                profileImageURL: user.photoUrl,
                email: user.email
            };
            AuthSessionManager.state.backend = 'Google';
            AuthSessionManager.state.isLoggedIn = true;
            return true;
        }
        return false;
    }

    static async saveGoogleLoginInfo() {
    }

    static async loadGoogleLoginInfo() {
       AuthSessionManager.state.accessToken = await SecureStore.getItemAsync('ACCESS_TOKEN');
       AuthSessionManager.state.user = await SecureStore.getItemAsync('USER');
       AuthSessionManager.state.backend = await SecureStore.getItemAsync('BACKEND');
    }

    static async logInWithGoogle() {
        // Check the secure store to see if the access token is available

        // If no access token exists, fetch a new access token

        // Save the new access token to the database
    }
}