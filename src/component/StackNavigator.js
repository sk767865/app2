import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddContactScreen from '../screens/AddContactScreen';
import InfoPage from '../screens/InfoPage';
import EditContactScreen from '../screens/EditContact';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerStyle: { backgroundColor: '#D1A5A5' }, headerTintColor: '#000' }}
    >
        <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="AddContact" component={AddContactScreen} options={{ title: 'Add New Contact' }} />
        <Stack.Screen name="InfoPage" component={InfoPage} options={{ title: 'Details' }} />
        <Stack.Screen name="EditContact" component={EditContactScreen} options={{ title: 'Update Contact' }} />
    </Stack.Navigator>
);

export default StackNavigator;
