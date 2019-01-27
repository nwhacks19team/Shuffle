import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Picker,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { /* initial state */ };
    selected.clear();
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    return (

      <View style={styles.container}>

        <Text style={styles.titleText}>Nearby Users:</Text>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={this._handleUserPress("arjan")} style={styles.userLink}>
              <Text style={styles.userLinkText}>Arjan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userContainer}>
            <TouchableOpacity onPress={this._handleUserPress("jennifer")} style={styles.userLink}>
              <Text style={styles.userLinkText}>Jennifer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userContainer}>
            <TouchableOpacity onPress={this._handleUserPress("karan")} style={styles.userLink}>
              <Text style={styles.userLinkText}>Karan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userContainer}>
            <TouchableOpacity onPress={this._handleUserPress("pahal")} style={styles.userLink}>
              <Text style={styles.userLinkText}>Pahal</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Button
            style={styles.generateButton}
            onPress={()=>{}}
            title="Generate"
          />
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleUserPress = (user) => {

    if(selected.has(user)){
      selected.delete(user);
    }
    else{
      selected.add(user);
    }
    
    console.log(selected)
  };
}

var selected = new Set()


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  titleText: {
    fontSize: 28,
    color: 'rgba(96,100,109, 1)',
    marginTop: 50,
    lineHeight: 28,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  userContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  userLink: {
    paddingVertical: 15,
  },
  userLinkText: {
    fontSize: 22,
    color: '#2e78b7',
  },
  generateButton: {

  },
});
