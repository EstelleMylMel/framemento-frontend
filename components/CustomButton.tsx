
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Définir les props attendues par le composant
type CustomButtonProps = {
    title: string;
    onPress: () => void;
    type: 'primary' | 'secondary';
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, type }) => {
    // Sélectionner le style en fonction du type de bouton
    const buttonStyle = type === 'primary' ? styles.primaryButton : styles.secondaryButton;
    const textStyle = type === 'primary' ? styles.primaryText : styles.secondaryText;

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

// Styles
const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        // Autres styles pour le bouton primaire
    },
    secondaryButton: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        // Autres styles pour le bouton secondaire
    },
    primaryText: {
        color: '#fff',
        // Autres styles pour le texte du bouton primaire
    },
    secondaryText: {
        color: '#fff',
        // Autres styles pour le texte du bouton secondaire
    },
});

export default CustomButton;


