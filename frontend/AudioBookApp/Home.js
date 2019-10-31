import React from "react";
import {Dimensions, ScrollView, StatusBar, StyleSheet, Text, View} from "react-native";

import * as Font from "expo-font";
import {AppLoading} from "expo";
import {Book} from "./Book";

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;

class HomeScreen extends React.Component {

     static navigationOptions = {
         header: null
     };

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false
        };
    }

    async loadFonts() {
        await Font.loadAsync({
            'product-sans': require('./assets/fonts/ProductSansRegular.ttf'),
            'product-sans-bold': require('./assets/fonts/ProductSansBold.ttf'),
            'product-sans-italic': require('./assets/fonts/ProductSansItalic.ttf'),
            'product-sans-bold-italic': require('./assets/fonts/ProductSansBoldItalic.ttf'),
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

        let bookShelves = [];
        for (let i = 0; i < 10; i++) {
            bookShelves.push(
                <View style={styles.bookShelfHome} key={(i * 10) + 4}>
                    <Book title='Frankenstein' author='Mary Shelly' key={(i * 10) + 1} navigation={this.props.navigation}/>
                    <Book title='Frankenstein' author='Mary Shelly' key={(i * 10) + 2} navigation={this.props.navigation}/>
                    <Book title='Frankenstein' author='Mary Shelly' key={(i * 10) + 3} navigation={this.props.navigation}/>
                </View>
            )
        }

        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle="dark-content"/>
                <View style={styles.homePage}>
                    <ScrollView>
                        <Text style={styles.homePageTitle} key={99}>Classic Audiobooks</Text>
                        {bookShelves}
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
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingLeft: bookMargin,
        paddingRight: bookMargin,
        marginLeft: 0,
        marginRight: 0,
    },
    homePageTitle: {
        fontSize: 32,
        fontFamily: 'product-sans-bold',
        padding: 20,
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