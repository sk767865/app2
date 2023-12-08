import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import * as db from '../database/db';
import FavIcon from '../component/svgIcon/FavIcon';
import { ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const InfoPage = ({ route }) => {
    const [contact, setContact] = useState({});
    const { contactId } = route.params;

    useFocusEffect(
        React.useCallback(() => {
            const fetchContact = async () => {
                try {
                    const result = await db.fetchContactById(contactId);
                    if (result.rows._array && result.rows._array.length > 0) {
                        setContact(result.rows._array[0]);
                    }
                } catch (error) {
                    console.log('Error fetching contact:', error);
                }
            };

            fetchContact();
        }, [contactId])
    );

    const navigation = useNavigation();

    const handleCallPress = () => {
        const phoneNumber = contact.mobileNumber;
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleMessagePress = () => {
        const phoneNumber = contact.mobileNumber;
        Linking.openURL(`sms:${phoneNumber}`);
    };

    return (
        <ImageBackground source={require('../../assets/backgt.jpg')} style={styles.container}>
            <View style={styles.overlay}>
                <Image source={{ uri: contact.photo }} style={styles.image} />
                {contact.favorite === 1 && <FavIcon />}
                <Text style={styles.nameText}>{contact.name}</Text>

                <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleCallPress}>
                        <Image source={require('../../assets/phone.png')} style={styles.iconImage} />
                        <Text>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={handleMessagePress}>
                        <Image source={require('../../assets/msg.png')} style={styles.iconImage} />
                        <Text>Message</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('EditContact', { contactId: contactId })}>
                        <Image source={require('../../assets/editg.png')} style={styles.iconImage} />
                        <Text>Update</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.text}>Mobile: {contact.mobileNumber}</Text>
                <Text style={styles.text}>Landline: {contact.landlineNumber}</Text>
                <Text style={styles.text}>Address: {contact.address}</Text>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#D0E8E4',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: '#333',
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginVertical: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '100%',
        backgroundColor: '#FF6B6B',
        padding: 10,
        borderRadius: 10,
    },
    iconButton: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#FFEB99',
    },
    iconImage: {
        width: 48,
        height: 48,
        marginBottom: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(208, 232, 228, 0.7)',  // 70% opacity
        alignItems: 'center',
        padding: 20,
        width: '100%',
    },
});

export default InfoPage;


