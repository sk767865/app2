import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Image, ImageBackground } from 'react-native';
import * as db from '../database/db';
import { useFocusEffect } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import FavoriteIcon from '../component/svgIcon/FavoriteIcon';
import addIcon from '../../assets/plusg.png';

const ContactsScreen = ({ navigation }) => {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);

    const fetchContacts = useCallback(async () => {
        try {
            const dbResult = await db.fetchContacts();
            console.log(dbResult);
            if (dbResult && dbResult.length > 0) {
                const sortedContacts = dbResult.sort((a, b) => a.name.localeCompare(b.name));
                setContacts(sortedContacts);
                setFilteredContacts(sortedContacts); // Initialize filteredContacts
            } else {
                setContacts([]); // This will ensure that your component re-renders when all data is lost
                setFilteredContacts([]);
                Alert.alert('No Contacts', 'No contacts found in the database.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching contacts.');
            console.error(error);
        }
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim().length === 0) {
            setFilteredContacts(contacts);
            return;
        }
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(query.trim().toLowerCase())
        );
        setFilteredContacts(filtered);
    };

    const deleteContactHandler = async (id) => {
        try {
            await db.deleteContact(id);
            const updatedContacts = contacts.filter(contact => contact.id !== id);
            setContacts(updatedContacts);
            setFilteredContacts(updatedContacts); // Updated filteredContacts 
        } catch (error) {
            Alert.alert('Error', 'An error occurred while deleting the contact.');
        }
    };

    const toggleFavoriteHandler = async (id, isFavorite) => {
        try {
            await db.toggleFavorite(id, !isFavorite);
            fetchContacts();
        } catch (error) {
            Alert.alert('Error', 'An error occurred while toggling favorite.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchContacts();
        }, [fetchContacts])
    );

    return (
        // <View style={styles.container}>
        <ImageBackground source={require('../../assets/backgt.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Contacts"

                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <SwipeListView
                    data={filteredContacts} 
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={(data, rowMap) => (
                        <View style={styles.listItem}>
                            <TouchableOpacity
                                style={styles.nameTouchable}
                                onPress={() => navigation.navigate('InfoPage', { contactId: data.item.id })}
                            >

                                {data.item.photo ? (
                                    <Image
                                        source={{ uri: data.item.photo }}
                                        style={styles.roundedImage}
                                    />
                                ) : null}
                                <Text style={styles.listItemText}>{data.item.name}</Text>
                            </TouchableOpacity>



                            <TouchableOpacity onPress={() => toggleFavoriteHandler(data.item.id, data.item.favorite)}>
                                <FavoriteIcon favorite={data.item.favorite} />
                            </TouchableOpacity>



                        </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={styles.swipeButtonsContainer}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => navigation.navigate('EditContact', { contactId: data.item.id })}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteContactHandler(data.item.id)}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    rightOpenValue={-150}
                />



                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddContact')}
                >
                    <Image source={addIcon} style={styles.addIconStyle} />
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: '#E6E6FA', // 70% opacity
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(204, 204, 204, 0.9)', // 70% opacity for borderBottom as well
        padding: 15,
        opacity: 0.99
    },


    nameTouchable: {
        flexDirection: 'row', // Added this to align the image and text side by side
        alignItems: 'center', // Align items in center vertically
        flex: 1,
    },
    listItemText: {
        fontSize: 18,
    },


    buttonText: {
        color: '#fff',
        fontSize: 50, // Adjust font size to make the plus symbol bigger or smaller
        fontWeight: 'bold', // Make the plus symbol bold
    },
    swipeButtonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    editButton: {
        backgroundColor: 'blue',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
       
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
       
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    favoriteButton: {
        backgroundColor: 'gold',
        padding: 10,
        borderRadius: 5,
    },
    unfavoriteButton: {
        backgroundColor: 'grey',
        padding: 10,
        borderRadius: 5,
    },
    favoritesButton: {
        backgroundColor: 'purple',
        padding: 15,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center',
    },

    searchInput: { 
        height: 40,
        borderColor: '#888',
        borderWidth: 1,
        borderRadius: 5, // rounded corners
        margin: 10,
        paddingLeft: 10,
        backgroundColor: '#D0E8E4', // white background
        fontSize: 16, // increased font size
    },



    roundedImage: {
        width: 40,
        height: 40,
        borderRadius: 20, // half of width/height to make it completely rounded
        marginRight: 10, // space between image and name
    },

    listItemText: {
        fontSize: 18,
        marginLeft: 10, // added marginLeft to separate text from image
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // This will give the transparent effect
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',  
        padding: 5,
    },

    addButton: {
        backgroundColor: '#3ab449',
        padding: 15,
        borderRadius: 60,
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    addIconStyle: {
        width: 43,
        height: 43,
    },
});

export default ContactsScreen;


