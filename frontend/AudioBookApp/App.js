import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SplashPage from "./pages/SplashPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import PlayerPage from "./pages/PlayerPage";
import {SettingsPage} from "./pages/SettingsPage";

const MainNavigator = createStackNavigator({
    SplashPage: {screen: SplashPage},
    HomePage: {screen: HomePage},
    BookDetailsPage: {screen: BookDetailsPage},
    PlayerPage: {screen: PlayerPage},
    AuthPage: {screen: AuthPage},
    SettingsPage: {screen: SettingsPage},
});

const App = createAppContainer(MainNavigator);
export default App;