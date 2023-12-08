import React from 'react';
import { View, StyleSheet } from 'react-native';

// Separator component
const Separator = () => {
    return <View style={styles.separator} />;
};

// Styles for the Separator component
const styles = StyleSheet.create({
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#FF8C00',
        marginVertical: 8,
    },
});

export default Separator;
