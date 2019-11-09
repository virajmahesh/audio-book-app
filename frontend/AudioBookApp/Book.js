import React from "react";
import {Dimensions, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Icon} from "react-native-elements";

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;

class Book extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            book_id: props.book,
            title: props.title,
            author: props.author,
            image_url: props.image_url
        };
        props.key = this.state.book_id;
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('BookDetails', {'book': this})}
                style={styles.book}>
                <View>
                    <View style={styles.albumArt}/>
                    <View style={styles.bookMetadata}>
                        <Text style={styles.bookMetadataText}>{this.state.title}</Text>
                        <Text style={styles.bookMetadataText}>{this.state.author}</Text>
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
        console.log(this.props.isLastChapter);
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('ChapterPlayer', {
                    'book': null,
                    'chapter': this
                })}>
                <View style={chapterStyle(this.props.isLastChapter)}>
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
            </TouchableHighlight>
        )
    }
}

function chapterStyle(isLastChapter) {
    return {
        borderBottomWidth: (isLastChapter) ? 0 : 1,
        borderColor: '#eaeaea',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 55,
        width: '100%',
        backgroundColor: 'white'
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
    chapterTitle: {
        flex: 0.9
    },
    playIcon: {
        flex: 0.1,
    },
    chapterTouch: {}
});

export {Book, Chapter};