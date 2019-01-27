import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import PlaylistScreen from '../screens/PlaylistScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="md-home"
    />
  ),
};

const LoginStack = createStackNavigator({
  Login: LoginScreen,
});

LoginStack.navigationOptions = {
  tabBarLabel: 'Login',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="md-people"
    />
  ),
};

const PlaylistStack = createStackNavigator({
  Playlist: PlaylistScreen,
});

PlaylistStack.navigationOptions = {
  tabBarLabel: 'My Playlist',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="md-play"
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LoginStack,
  PlaylistStack,
});
