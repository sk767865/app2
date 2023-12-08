import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as db from '../database/db';
import * as ImagePicker from 'expo-image-picker';
import FavoriteIcon from '../component/svgIcon/FavoriteIcon';

import { ImageBackground } from 'react-native';

const EditContactScreen = ({ route, navigation }) => {

    const { contactId } = route.params;

    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [landlineNumber, setLandlineNumber] = useState('');
    const [address, setAddress] = useState('');
    const [photo, setPhoto] = useState('');
    const [favorite, setFavorite] = useState(0);


    const deleteContactHandler = async () => {
        Alert.alert('Delete Contact', 'Are you sure you want to delete this contact?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await db.deleteContact(contactId);
                        console.log('Contact deleted');
                        // navigation.goBack();
                        navigation.navigate('Contacts');

                    } catch (err) {
                        console.log('Error deleting contact', err);
                    }
                },
            },
        ]);
    };

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const contact = await db.fetchContactById(contactId);
                if (contact && contact.rows._array.length > 0) {
                    const data = contact.rows._array[0];
                    setName(data.name);
                    setMobileNumber(data.mobileNumber);
                    setLandlineNumber(data.landlineNumber);
                    setAddress(data.address);
                    setPhoto(data.photo);
                    setFavorite(data.favorite);
                } else {
                    Alert.alert('Error', 'Contact not found');
                }
            } catch (error) {
                Alert.alert('Error', 'Error loading contact data');
                console.error(error);
            }
        };

        fetchContact();
    }, [contactId]);



    const saveEditedContact = async () => {
        // Name Validation
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name) || name.length === 0) {
            Alert.alert('Name Error', 'Enter a valid name without numbers or special characters!');
            return;
        }

        // Mobile Number Validation
        const mobileNumberRegex = /^\d{10,15}$/;
        if (!mobileNumberRegex.test(mobileNumber)) {
            Alert.alert(' Mobile No. Error', 'Enter a valid mobile number with 10 to 15 digits!');
            return;
        }

        // Landline Number Validation
        const landlineNumberRegex = /^\d{5,10}$/;
        if (!landlineNumberRegex.test(landlineNumber)) {
            Alert.alert('LandLine No. Error', 'Enter a valid landline number with 5 to 10 digits!');
            return;
        }

        // Address Validation
        if (address.length === 0) {
            Alert.alert('Address Error', 'Address cannot be empty!');
            return;
        }

        // Photo Validation
        if (!photo || photo.length === 0) {
            Alert.alert('Photo Error', 'Please select a photo for the contact!');
            return;
        }

        try {
            await db.updateContact(contactId, name, mobileNumber, landlineNumber, address, photo, favorite);
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Error saving edited contact');
            console.error(error);
        }
    };


    const toggleFavoriteHandler = async () => {
        try {
            const newFavoriteStatus = favorite === 1 ? 0 : 1;
            await db.updateFavoriteStatus(contactId, newFavoriteStatus);
            setFavorite(newFavoriteStatus);
        } catch (error) {
            Alert.alert('Error', 'Error toggling favorite status');
            console.error(error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);

        }
    };

    return (

        <ImageBackground source={require('../../assets/backgt.jpg')} style={styles.container}>
            <View>
                {photo ? (
                    <TouchableOpacity onPress={pickImage}>
                        <Image source={{ uri: photo }} style={styles.image} />
                    </TouchableOpacity>
                ) : (
                    <Button title="Pick an image" onPress={pickImage} />
                )}




                <TouchableOpacity onPress={toggleFavoriteHandler} style={styles.heartContainer}>
                    <FavoriteIcon favorite={favorite === 1} />
                </TouchableOpacity>

                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    style={styles.input}
                />

                <TextInput
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    style={styles.input}
                />

                <TextInput
                    value={landlineNumber}
                    onChangeText={setLandlineNumber}
                    placeholder="Landline Number"
                    keyboardType="phone-pad"
                    style={styles.input}
                />

                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Address"
                    style={styles.input}
                />





                <Button title="Save" onPress={saveEditedContact} />

                <View style={styles.deleteButtonContainer}>
                    <Button title="Delete Contact" color="red" onPress={deleteContactHandler} />
                </View>
            </View>

        </ImageBackground>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#f8f8f8',
        backgroundColor: '#D0E8E4',
    },
    input: {
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 15,
        borderRadius: 10,
        backgroundColor: '#D0E8E4',
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 30,
        borderRadius: 150,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#eee',
    },
    heartContainer: {
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    deleteButtonContainer: {
        marginTop: 20,
    },
    button: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E90FF',
        marginTop: 20,
    },
    deleteButton: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },

});

export default EditContactScreen;