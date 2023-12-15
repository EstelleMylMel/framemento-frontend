import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface InputProps {
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (text: string) => void;
  style?: {
    container?: ViewStyle;
    label?: TextStyle;
    inputContainer?: ViewStyle;
    iconContainer?: ViewStyle;
    icon?: TextStyle;
  };
}

const CustomInput: React.FC<InputProps> = ({ label, placeholder, icon, value, onChange, style }) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor='#777777'
        value={value}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#101010',
    height: 48,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '30%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#EEEEEE',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 16,
    alignContent: 'flex-end',
    color: '#EEEEEE',
    fontSize: 14,
    width: '70%',
    backgroundColor: '#101010'
  },
  icon: {
    fontSize: 20,
  },
});


export default CustomInput;

