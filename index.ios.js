'use strict';

var React = require('react-native');
var url = require('url');

var RefreshableListView = require('react-native-refreshable-listview');

var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  StatusBarIOS,
} = React;

var {
  width,
  height
} = require('Dimensions').get('window');

var formatSource = require('./app/format-source');
var API_URL = 'http://www.hearsay.me/api/entries?page=0&perPage=100';

var HearsayNative = React.createClass({
  getInitialState() {
    return {
      dataSource: new RefreshableListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      error: null
    };
  },

  componentDidMount() {
    StatusBarIOS.setStyle(1);
    //this.fetchData();
  },

  loadArticles() {
    return this.fetchData()
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true,
        });
      })
      .catch((error) => {
        this.setState({
          error: error.stack
        });
      })
  },

  fetchData() {
    return fetch(API_URL)
      .then((response) => response.json())
      .catch((error) => {
        this.setState({
          error: error.stack
        });
      })
  },

  renderArticle(article) {
    return (
      <View style={styles.articleContainer}>
        <Image
          source={{uri: (article.content && article.content.image) ? article.content.image : article.image}}
          style={styles.thumbnail}
        />
        <View style={styles.thumbnailOverlay} />
        <View style={styles.sourceContainer}>
          <Text style={styles.source}>{formatSource(article.source)}</Text>
        </View>
        <View style={styles.caption}>
          <Text style={styles.title}>{article.title}</Text>
        </View>
      </View>
    );
  },

  render() {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Hearsay
          </Text>
          <Image
            source={{uri: 'http://www.hearsay.me/logo.png'}}
            style={styles.headerLogo}
          />
        </View>
        <RefreshableListView
          dataSource={this.state.dataSource}
          renderRow={this.renderArticle}
          loadData={this.loadArticles}
          styles={styles.listView}
          refreshDescription='Loading'
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },

  loadingBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  articleContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginTop: 15,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0
    },
    height: 300
  },

  headerContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    marginTop: 0,
    paddingTop: 25,
    paddingBottom: 5
  },

  headerText: {
    color: 'white'
  },

  headerLogo: {
    height: 30,
    width: 30,
    margin: 10
  },

  listView: {
    paddingTop: 10,
  },

  caption: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    position: 'absolute',
    padding: 10,
    bottom: 0,
    width: width
  },

  sourceContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    flex: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 5,
    top: 0,
    right: 0
  },

  thumbnail: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'stretch',
    resizeMode: Image.resizeMode.cover,
    flexDirection:'column'
  },

  thumbnailOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    position: 'absolute',
    flex: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    bottom: 0,
    width: width - (2 * 5),
    height: 300
  },

  title: {
    fontSize: 20,
    marginBottom: 0,
    textAlign: 'center',
    color: 'white'
  },

  source: {
    color: 'white',
    textAlign: 'center'
  }
});

AppRegistry.registerComponent('HearsayNative', () => HearsayNative);
