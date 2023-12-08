import React, { useCallback, useState, useEffect } from 'react';
import {
    ScrollView,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native';
import * as db from '../database/db';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { ImageBackground } from 'react-native';

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFavorites, setFilteredFavorites] = useState([]);
    const navigation = useNavigation();

    const fetchFavorites = useCallback(async () => {
        try {
            const dbResult = await db.fetchFavoriteContacts();
            console.log('DB Result:', dbResult);

            if (dbResult && dbResult.length > 0) {
                const sortedFavorites = dbResult.sort((a, b) => a.name.localeCompare(b.name));
                setFavorites(sortedFavorites);
            } else {
                setFavorites([]);
                Alert.alert('No Favorites', 'You have no favorite contacts.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching favorite contacts.');
            console.error(error);
        }
    }, []);

    // New useEffect to handle the update of filteredFavorites when favorites is updated
    useEffect(() => {
        if (searchQuery.trim().length === 0) {
            setFilteredFavorites(favorites);
            return;
        }
        const filtered = favorites.filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
        setFilteredFavorites(filtered);
    }, [favorites, searchQuery]);

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [fetchFavorites])
    );

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        // <ScrollView style={styles.container}>
        <ImageBackground source={require('../../assets/backgt.jpg')} style={styles.backgroundImage}>
            <ScrollView style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Favorites"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />

                {filteredFavorites.length > 0 ? (
                    filteredFavorites.map((contact) => (
                        <TouchableOpacity
                            key={contact.id}
                            style={styles.contactItem}
                            onPress={() => navigation.navigate('InfoPage', { contactId: contact.id })}
                        >
                            {contact.photo ? (
                                <Image
                                    source={{ uri: contact.photo }}
                                    style={styles.contactImage}
                                />
                            ) : null}
                            <Text style={styles.contactName}>{contact.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noFavoritesText}>No favorite contacts found</Text>
                )}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    contactItem: {

        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 213, 128, 0.5)', // 70% opacity
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(204, 204, 204, 0.9)', // 70% opacity for borderBottom as well
        padding: 15,
    },
    contactImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    contactName: {
        fontSize: 18,
    },
    noFavoritesText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: 'white'
    },
    searchInput: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 8,
        borderRadius: 5,

        // color: 'white'
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // This will give the transparent effect
    },
    container: {
        flex: 1,
        padding: 20,
    },
});

export default FavoritesScreen;
