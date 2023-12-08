import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, View, Text } from 'react-native';
import ContactsScreen from '../screens/ContactsScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import CustomDrawerContent from '../component/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const contactsIcon = require('../../assets/conlist.jpg');
const favoritesIcon = require('../../assets/favcon.png');

const DrawerNavigator = () => (
    <Drawer.Navigator
        initialRouteName="Contacts"
        drawerContent={props => <CustomDrawerContent {...props} />}
        drawerStyle={{ width: '75%', backgroundColor: '#808080' }}
    >
        <Drawer.Screen
            name="Contacts"
            component={ContactsScreen}
            options={{
                title: 'Contact List',
                headerStyle: { backgroundColor: '#D1A5A5' },
                drawerLabel: ({ color }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={contactsIcon} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 50 }} />
                        <Text style={{ color }}>Contact List</Text>
                    </View>
                )
            }}
        />
        <Drawer.Screen
            name="Favorites"
            component={FavoriteScreen}
            options={{
                title: 'Favorite Contact',
                headerStyle: { backgroundColor: '#D1A5A5' },
                drawerLabel: ({ color }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={favoritesIcon} style={{ width: 40, height: 40, marginRight: 10, borderRadius: 50 }} />
                        <Text style={{ color }}>Favorite Contact</Text>
                    </View>
                )
            }}
        />
    </Drawer.Navigator>
);

export default DrawerNavigator;
