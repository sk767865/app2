import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';
import StackNavigator from './src/component/StackNavigator';


LogBox.ignoreLogs([
  'Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead'
]);

const App = () => (
  <NavigationContainer>
    <StackNavigator />
  </NavigationContainer>
);

export default App;
