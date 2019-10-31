import React from "react";
import {Dimensions, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Icon} from "react-native-elements";

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;

class Book extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        this.state.title = this.props.title;
        this.state.author = this.props.author;

        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('BookDetails', {'book': this})}
                style={styles.book}>
                <View>
                    <View style={styles.albumArt}/>
                    <View style={styles.bookMetadata}>
                        <Text style={styles.bookMetadataText}>{this.props.title}</Text>
                        <Text style={styles.bookMetadataText}>{this.props.author}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

class Chapter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.title = props.title;
    }

    render() {
        return (
            <View style={styles.chapter}>
                <View style={styles.chapterTitle}>
                    <Text style={{fontFamily: 'product-sans-bold', fontSize: 15}}>{this.state.title}</Text>
                </View>
                <View style={styles.playIcon}>
                    <Icon
                        type="material"
                        name="play-circle-outline"
                        color="#000000"/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bookMetadataText: {
        fontFamily: 'product-sans',
    },
    book: {
        width: width * 0.28,
        height: 200,
        marginLeft: bookMargin,
        marginRight: bookMargin,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
    },
    albumArt: {
        borderColor: 'red',
        height: '80%',
        backgroundColor: 'blue',
        borderWidth: 2,
    },
    bookMetadata: {
        borderColor: 'green',
        borderWidth: 2,
        height: '20%',
        backgroundColor: 'orange',
    },
    chapter: {
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 50,
        width: '100%'
    },
    chapterTitle: {
        flex: 0.9
    },
    playIcon: {
        flex: 0.1,
    }
});

export {Book, Chapter};