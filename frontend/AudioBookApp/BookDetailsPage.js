import React from "react";
import {Dimensions, StyleSheet, Text, View, ScrollView} from "react-native";
import {Button, Icon} from 'react-native-elements'
import {Book, Chapter} from './Book'
import loremIpsum from "lorem-ipsum-react-native"

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;


class BookDetailsPage extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log('5e434 ' + this.props.navigation.getParam('book'));
        this.setState({
            book: this.props.navigation.getParam('book')
        });

        console.log(this.state.book);
        if (this.state.book != null) {
            console.log(this.state.book.state.title);
            console.log(this.state.book.state.author);
        }

    }

    render() {
        console.log(loremIpsum);
        // No book to show details
        if (this.state.book == null) {
            return null;
        }

        let chapters = [];
        for (let i = 0; i < 25; i++) {
            chapters.push(
                <Chapter title={'Chapter ' + (i + 1)} />
            )
        }

        return (
            <ScrollView>
            <View style={styles.bookDetailsPage}>
                <View style={styles.detailsPanel}>
                    <View style={styles.albumArt}/>
                    <View styles={styles.bookMetadata}>
                        <Text style={styles.bookTitle}>{this.state.book.state.title}</Text>
                        <Text style={styles.bookAuthor}>{this.state.book.state.author}</Text>
                    </View>
                </View>
                <View style={styles.bookDescriptionPanel}>
                    <Text style={{fontSize: 20, fontFamily: 'product-sans-bold'}}>Description</Text>
                    <Text style={styles.bookDescription}
                          numberOfLines={3}
                          ellipsizeMode="tail">
                        {loremIpsum({count: 100})}
                    </Text>
                </View>
                <View style={styles.playButton}>
                    <Button
                        icon={
                            <Icon type="material"
                                  name="play-arrow"
                                  size={15}
                                  color="#ffffff"
                            />
                        }
                        title="Play"
                    />
                </View>
                {chapters}
            </View>
                </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    bookDetailsPage: {
        padding: 25,
    },
    detailsPanel: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    bookMetadata: {},
    bookDescriptionPanel: {
        marginBottom: 10
    },
    albumArt: {
        width: width * 0.28,
        height: 150,
        borderColor: 'red',
        backgroundColor: 'red',
        borderWidth: 2,
        marginRight: 15,
        marginBottom: 20
    },
    bookTitle: {
        fontFamily: 'product-sans-bold',
        fontSize: 30,
        marginBottom: 5
    },
    bookAuthor: {
        fontFamily: 'product-sans',
        fontSize: 20
    },
    bookDescription: {
        fontFamily: 'product-sans',
        fontSize: 15
    },
    playButton: {
        marginBottom: 20
    }
});


export default BookDetailsPage;