import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as db from '../database/db';
import FavoriteIcon from '../component/svgIcon/FavoriteIcon';
import { ImageBackground } from 'react-native';

const AddContactScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [mobileNumber, setMobileNumber] = useState('');
    const [landlineNumber, setLandlineNumber] = useState('');
    const [address, setAddress] = useState('');
    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        const initDB = async () => {
            try {
                await db.init();
                console.log('DB initialized');
            } catch (err) {
                console.log('Error initializing DB', err);
            }
        };

        initDB();
    }, []);


    const addContactHandler = async () => {
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

        if (!photo || photo.length === 0) {
            Alert.alert('Photo Error', 'Please select a photo for the contact!');
            return;
        }

        try {
            await db.insertContact(name, photo, mobileNumber, landlineNumber, address, favorite);
            console.log('Contact inserted');
            navigation.goBack();
        } catch (err) {
            console.log('Error inserting contact', err);
        }
    };

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (pickerResult.canceled === true) {
            return;
        }

        setPhoto(pickerResult.assets[0].uri);
    };

    return (

        <ImageBackground source={require('../../assets/backgt.jpg')} style={styles.screen}>
            <View style={styles.overlay}>

                <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.image} />
                    ) : (
                        <>
                            <Text style={styles.cameraText}>Pick an image</Text>
                        </>
                    )}
                </TouchableOpacity>


                <TouchableOpacity
                    onPress={() => setFavorite(!favorite)}
                    style={styles.favoriteContainer}
                >
                    <FavoriteIcon favorite={favorite} />
                </TouchableOpacity>


                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={text => setName(text)}
                />



                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="number-pad"
                    value={mobileNumber}
                    onChangeText={text => setMobileNumber(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Landline Number"
                    keyboardType="number-pad"
                    value={landlineNumber}
                    onChangeText={text => setLandlineNumber(text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={text => setAddress(text)}
                />


                <Button title="Add Contact" onPress={addContactHandler} />
            </View>
        </ImageBackground >
    );
};



const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        backgroundColor: '#D0E8E4',
        alignItems: 'center',  // Added to center the content horizontally
    },
    input: {
        backgroundColor: '#D0E8E4',
        borderBottomColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        padding: 10,
        width: '100%',
    },
    cameraButton: {
        backgroundColor: '#ccc',
        borderRadius: 50,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cameraText: {
        color: '#000',
        marginTop: 5,
    },
    image: {
        width: 100,  // Changed to set a definite size
        height: 100,  // Changed to set a definite size
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    favoriteContainer: {
        alignItems: 'center',
        marginBottom: 15,
        marginTop: -10,  // Adjusted to move the heart closer to the image
    },
    button: {
        backgroundColor: '#4CAF50',
        borderColor: 'transparent',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',  // Added to make the button stretch across the screen
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',  // Centered the text within the button
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(208, 232, 228, 0.7)',  // 70% opacity
        alignItems: 'center',
        padding: 20,
        width: '100%'
    },
});



export default AddContactScreen;
