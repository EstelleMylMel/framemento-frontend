import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface FieldProps {
  label: string;
  icon?: React.ReactNode;
  value: string | undefined;
  style?: {
    container?: ViewStyle;
    label?: TextStyle;
    inputContainer?: ViewStyle;
    iconContainer?: ViewStyle;
    icon?: TextStyle;
  };
}

const CustomField: React.FC<FieldProps> = ({ label, icon, value, style }) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text>{value}</Text>
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
  iconContainer: {
    
  },

  icon: {
    fontSize: 20,
  },
});


export default CustomField;

