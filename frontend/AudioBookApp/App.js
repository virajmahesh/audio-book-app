import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomePage from "./Home";
import AuthPage from "./Auth";
import BookDetailsPage from "./BookDetailsPage";
import ChapterPlayerPage from "./ChapterPlayer";

const MainNavigator = createStackNavigator({
    Auth: {screen: AuthPage},
    Home: {screen: HomePage},
    BookDetails: {screen: BookDetailsPage},
    ChapterPlayer: {screen: ChapterPlayerPage}
});

const App = createAppContainer(MainNavigator);
export default App;