import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
        {icon && <View style={styles.iconContainer}>
                    <MaterialIcons name={`${icon}`} size={20} color="#AAAAAA"/>
                </View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#050505',
    height: 48,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    
  },
  labelContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '30%',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: 24,
    color: '#AAAAAA',
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontFamily: 'Poppins-Light',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: 24,
    color: '#EEEEEE',
    textAlign: 'right',
  }
});


export default CustomField;