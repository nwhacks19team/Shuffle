import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import SpotifyWebApi from 'react-native-spotify-web-api';
import { TextInput } from 'react-native-gesture-handler';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  render() {
    return (
      <View style={styles.container}>

        <Button
          onPress={() => {
            // Retrieve an access token
            spotifyApi.clientCredentialsGrant()
              .then(function(data) {
                console.log('The access token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);

                // Save the access token so that it's used in future calls
                spotifyApi.setAccessToken(data.body['access_token']);
              }, function(err) {
                console.log('Something went wrong when retrieving an access token', err.message);
              });
          }}
          title="Login with Spotify"
        />
        
      </View>
    );
  }
}

var spotifyApi = new SpotifyWebApi({
  clientId : 'a4c824f4b72f436aa266f9c4ed386053',
  clientSecret : 'ef99410b365d4cd29206f9ba752875d5',
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
