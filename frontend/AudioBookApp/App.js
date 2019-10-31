import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from "./Home";
import BookDetailsPage from "./BookDetailsPage";

const MainNavigator = createStackNavigator({
    Home: {screen: HomeScreen},
    BookDetails: {screen: BookDetailsPage}
});

const App = createAppContainer(MainNavigator);
export default App;