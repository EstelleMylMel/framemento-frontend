import { View, Text, StyleSheet } from 'react-native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';

type WelcomeScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
    return (
        <View style={styles.container}>
            <Text>Welcome screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });