import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
        {icon && <View style={styles.iconContainer}>
                  <MaterialIcons name={`${icon}`} size={20} color="#AAAAAA"/>
                </View>}
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
    backgroundColor: '#101010',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
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

