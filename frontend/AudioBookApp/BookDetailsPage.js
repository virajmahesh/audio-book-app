import React from "react";
import {Dimensions, StyleSheet, Text, View, ScrollView, Image, WebView} from "react-native";
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
        this.setState({
            book: this.props.navigation.getParam('book')
        });
    }

    render() {
        // No book to show details
        if (this.state.book == null) {
            return null;
        }

        let chapters = [];
        for (let i = 0; i < 25; i++) {
            let c = null;
            if (i < 24) {
                c = <Chapter title={'Chapter ' + (i + 1)} isLastChapter={false}/>;
            } else {
               c = <Chapter title={'Chapter ' + (i + 1)} isLastChapter={true}/>;
            }
            chapters.push(c);
        }

        return (
            <ScrollView>
            <View style={styles.bookDetailsPage}>

                <View style={styles.detailsPanel}>
                    <View style={styles.albumArt}>
                      <Image style={{width: '100%', height: '100%'}} source={{uri: this.state.book.getImageURL()}} resizeMode='contain'/>
                    </View>
                    <View style={styles.bookMetadata}>
                        <Text style={styles.bookTitle} numberOfLines={3}>
                            {this.state.book.state.title}
                        </Text>
                        <Text style={styles.bookAuthor} numberOfLines={2}>
                            {this.state.book.state.author}
                        </Text>
                    </View>
                </View>

                <View style={styles.bookDescriptionPanel}>
                    <Text style={{fontSize: 20, fontFamily: 'product-sans-bold'}}>Description</Text>
                    <Text style={styles.bookDescription}> {this.state.book.state.description} </Text>
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
        padding: 30,
    },
    detailsPanel: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    albumArt: {
        flex: 0.3,
        height: 150,
        marginRight: 15,
        marginBottom: 20
    },
    bookMetadata: {
        flex: 0.7,
    },
    bookTitle: {
        flexWrap: 'wrap',
        marginBottom: 5,
        fontSize: 24,
        fontFamily: 'product-sans-bold',
    },
    bookAuthor: {
        fontFamily: 'product-sans',
        flexWrap: 'wrap',
        fontSize: 20
    },
    bookDescriptionPanel: {
        marginBottom: 10
    },
    bookDescription: {
        fontFamily: 'product-sans',
        fontSize: 15
    },
    playButton: {
        marginBottom: 10
    }
});


export default BookDetailsPage;
