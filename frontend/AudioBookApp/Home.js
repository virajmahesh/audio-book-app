import React from "react";
import {Dimensions, ScrollView, StatusBar, StyleSheet, Text, View, RefreshControl} from "react-native";
import { withNavigation } from 'react-navigation';

import * as Font from "expo-font";
import {AppLoading} from "expo";
import {Book} from "./Book";
import * as Settings from './Settings';

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;

class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            booksLoaded: false,
            bookList: [],
            refreshing: false
        };
    }

    componentDidMount() {
        this.loadFonts();
        this.loadHomePageBooks();
    }

    onRefresh = async () => {
        this.setState({ refreshing: true });
        await this.loadHomePageBooks();
        this.setState({ refreshing: false });
    }

    async loadFonts() {
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

    async loadHomePageBooks() {
      // TODO: Log errors from fetching home data
      await fetch(Settings.HOME_API_ENDPOINT)
          .then((response => response.json()))
          .then((responseJSON) => {
              let bookList = [];

              // Parse the JSON response and create Book objects
              responseJSON.forEach((b => {
                  bookList.push(React.createElement(Book, b));
              }));

              // Update the app state with the new book list
              this.setState({
                  bookList: bookList,
                  booksLoaded: true
              });
          });
    }

    render() {
        //TODO: Log Home Activity startup time
        if (!this.state.fontsLoaded || !this.state.booksLoaded) {
            return <AppLoading/>;
        }

        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle="dark-content"/>
                <View style={styles.homePage}>
                    <ScrollView  refreshControl={
                          <RefreshControl refreshing={this.state.refreshing}
                                          onRefresh={this.onRefresh}
                                          colors={[Settings.BLUE_TINT]}/>
                        }>
                        <Text style={styles.homePageTitle}>Classic Audiobooks</Text>
                        <View style={styles.bookShelfHome}>
                            {this.state.bookList}
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    homePage: {
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: bookMargin,
        paddingRight: bookMargin,
        backgroundColor: '#fff',
    },
    homePageTitle: {
        fontSize: 32,
        padding: 25,
        textAlign: 'center',
        fontFamily: 'product-sans-bold',
    },
    bookShelfHome: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
});

export default withNavigation(HomeScreen);
