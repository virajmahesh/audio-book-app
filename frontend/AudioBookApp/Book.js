import React from "react";
import {Dimensions, StyleSheet, Text, TouchableHighlight, View, Image} from "react-native";
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
            image_url: props.image_url,
            isbn: props.isbn,
            isbn13: props.isbn13
        };
        props.key = this.state.book_id;
    }

    getImageURL() {
        console.log('http://covers.openlibrary.org/b/isbn/' + this.state.isbn13 + '-M.jpg');
        return 'http://covers.openlibrary.org/b/isbn/' + this.state.isbn13 + '-M.jpg';
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('BookDetails', {'book': this})}
                style={styles.book}>
                <View>
                    <Image style={styles.albumArt} source={{uri: this.getImageURL()}}/>
                    <View style={styles.bookMetadata}>
                        <Text style={styles.bookMetadataText} numberOfLines={1}>{this.state.title}</Text>
                        <Text style={styles.bookMetadataText} numberOfLines={1}>{this.state.author}</Text>
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
    book: {
        width: '28%',
        height: 200,
        borderRadius: 5,
        margin: 10,
    },
    albumArt: {
        height: '80%',
    },
    bookMetadata: {
        height: '20%',
    },
    bookMetadataText: {
        fontSize: 14,
        fontFamily: 'product-sans',
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