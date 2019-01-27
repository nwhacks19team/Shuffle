import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

export default class PlaylistScreen extends React.Component {
  static navigationOptions = {
    title: 'Playlists',
  };

  render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}


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
