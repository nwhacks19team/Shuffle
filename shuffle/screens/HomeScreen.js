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
  Alert,
} from 'react-native';
import { WebBrowser } from 'expo';
import SelectMultiple from 'react-native-select-multiple'

import { MonoText } from '../components/StyledText';
import { TextInput } from 'react-native-gesture-handler';

export default class HomeScreen extends React.Component {

  state = { selectedUsers: [] }

  onSelectionsChange = (selectedUsers) => {
    this.setState({ selectedUsers })
  }

  static navigationOptions = {
    title: 'Nearby Users',
  };

  render() {
    return (

      <View style={styles.container}>

        {/* <Text style={styles.titleText}>Nearby Users:</Text> */}

        <SelectMultiple
          items={users}
          selectedItems={this.state.selectedUsers}
          onSelectionsChange={this.onSelectionsChange} />

        <View style={styles.tabBarInfoContainer}>
          {(this.state.selectedUsers.length > 0) ? <Button
            style={styles.generateButton}
            onPress={this._generateSet}
            title="Generate a Playlist"
          /> : null}
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

  _generateSet = () => {
    //console.log(this.state.selectedUsers);

    selectedUsers = [];

    this.state.selectedUsers.forEach((object) =>{
      selectedUsers.push(object.value);
    });
    
    console.log(JSON.stringify({
      users: selectedUsers,
    }));

    console.log(playlistName);

    fetch("http://10.19.130.200:8080" + "/playlist/", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        users: selectedUsers
      })
    }).then(Alert.alert("Playlist has been generated!"))
      .catch((error) => {
        console.log("Unable to connect to server." + error);
        Alert.alert("Unable to connect to server." + error);
      });

  }
}

const users = [
  { label: 'Arjan', value: 'arjan97' },
  { label: 'Jennifer', value: 'jenjenngo' },
  { label: 'Karn', value: 'karnrahal' },
  { label: 'Nishat', value: 'nishnish97' },
  { label: 'Pahul', value: 'pahul' }
]

const playlistName = '';

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
