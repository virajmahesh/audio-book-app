import React from "react";
import {Dimensions, ScrollView, StatusBar, StyleSheet, Text, View} from "react-native";

import * as Font from "expo-font";
import {AppLoading} from "expo";
import {Book} from "./Book";

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;

const API_URL = 'http://35.197.75.209:8001';
const HOME_API_ENDPOINT = API_URL + '/home';

class HomeScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            booksLoaded: false,
            bookList: []
        };
    }

    componentDidMount() {
        this.loadFonts();
        this.loadHomePageBooks();
    }

    async loadFonts() {
        await Font.loadAsync({
            'product-sans': require('./assets/fonts/ProductSansRegular.ttf'),
            'product-sans-bold': require('./assets/fonts/ProductSansBold.ttf'),
            'product-sans-italic': require('./assets/fonts/ProductSansItalic.ttf'),
            'product-sans-bold-italic': require('./assets/fonts/ProductSansBoldItalic.ttf'),
        });
    }

    async loadHomePageBooks() {
        await fetch(HOME_API_ENDPOINT)
            .then((response => response.json()))
            .then((responseJSON) => {
                let bookList = [];

                // Parse the JSON response and create Book objects
                responseJSON.forEach((b => {
                    bookList.push(React.createElement(Book, b.fields));
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
        if (!this.state.fontsLoaded) {
            return <AppLoading
                startAsync={this.loadFonts}
                onFinish={() => this.setState({fontsLoaded: true})}
            />;
        }

        console.log(this.state.bookList);

        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle="dark-content"/>
                <View style={styles.homePage}>
                    <ScrollView>
                        <Text style={styles.homePageTitle} key={99}>Classic Audiobooks</Text>
                        <View>
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
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: bookMargin,
        paddingRight: bookMargin,
        marginLeft: 0,
        marginRight: 0,
    },
    homePageTitle: {
        fontSize: 32,
        padding: 20,
        fontFamily: 'product-sans-bold',
        textAlign: 'center',
    },
    bookShelfHome: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 0,
        marginLeft: 0,
        marginBottom: 20
    },
});

export default HomeScreen;