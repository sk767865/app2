import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, View, Text, ImageBackground } from 'react-native';
import Separator from './Separator';


const CustomDrawerContent = (props) => {
    return (
        <ImageBackground
            source={require('../../assets/backgt.jpg')}
            style={{ flex: 1, opacity: 0.9 }}
        >
            <DrawerContentScrollView {...props} style={{ backgroundColor: '#FFA07A', opacity: 0.9 }}>
                <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
                    <Image
                        source={require('../../assets/imgcont.jpg')}
                        style={{
                            width: '60%',
                            height: 150,
                            borderRadius: 100,
                            borderWidth: 2,
                            borderColor: '#FF8C00'
                        }}
                        resizeMode="cover"
                    />
                </View>
                <Separator />
                <DrawerItemList {...props} />
                <Separator />
            </DrawerContentScrollView>
        </ImageBackground>
    );
};

export default CustomDrawerContent;
