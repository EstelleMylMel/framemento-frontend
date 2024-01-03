
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


type CustomButtonProps = {
    title: string;
    onPress: () => void;
    type: 'primary' | 'secondary';
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, type }) => {
    
    const buttonStyle = type === 'primary' ? styles.primaryButton : styles.secondaryButton;
    const textStyle = type === 'primary' ? styles.primaryText : styles.secondaryText;

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: '#FFDE67',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        
    },
    secondaryButton: {
        backgroundColor: '#050505',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 40,
        
    },
    primaryText: {
        color: '#050505',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 24,
        textTransform: 'uppercase',
        
    },
    secondaryText: {
        color: '#FFDE67',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 24,
        textTransform: 'uppercase',
        
    },
});

export default CustomButton;


