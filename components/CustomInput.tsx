import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface InputProps {
  label?: string;
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
    <View style={[styles.container, style?.container]}>
      {label && <Text style={[styles.label, style?.label]}>{label}</Text>}
      <View style={[styles.inputContainer, style?.inputContainer]}>
        {icon && <View style={[styles.iconContainer, style?.iconContainer]}>{icon}</View>}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          style={styles.input}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    fontSize: 20,
  },
});


export default CustomInput;

