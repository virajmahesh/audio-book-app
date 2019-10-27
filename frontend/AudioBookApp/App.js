import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';


console.log('statusBarHeight: ', StatusBar.currentHeight);
console.log('statusBarHeight: ', StatusBar.currentHeight * 1.25);

const bookMargin = '1.75%';

console.log(bookMargin);

function Book(props) {
    return (
        <View style={styles.book}>
            <View style={styles.albumArt}/>
            <View style={styles.bookMetadata}>
                <Text>{props.title}</Text>
                <Text>{props.author}</Text>
            </View>
        </View>
    )
}

export default function App() {
    return (
        <View style={styles.homePage}>
            <View style={styles.bookShelfHome}>

                <Book title='Frankenstein' author='Mary Shelly'/>

                <View style={styles.book}>
                    <View style={styles.albumArt}/>
                </View>

                <View style={styles.book}>
                    <View style={styles.albumArt}/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    homePage: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: StatusBar.currentHeight * 1.25,
        paddingLeft: bookMargin,
        paddingRight: bookMargin,
        marginLeft: 0,
        marginRight: 0
    },
    bookShelfHome: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 0,
        marginLeft: 0
    },
    book: {
        width: '30%',
        height: 200,
        marginLeft: bookMargin,
        marginRight: bookMargin,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5
    },
    albumArt: {
        borderColor: 'red',
        height: '80%',
        backgroundColor: 'blue',
        borderWidth: 2
    },
    bookMetadata: {
        borderColor: 'green',
        borderWidth: 2,
        height: '20%',
        backgroundColor: 'orange'
    }
});
