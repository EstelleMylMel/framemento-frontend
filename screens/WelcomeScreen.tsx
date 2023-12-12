import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';

type WelcomeScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Framemento</Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Signupscreen')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text>S'INSCRIRE</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text>S'INSCRIRE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('Rolls')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text>ROLLS</Text>
            </TouchableOpacity>
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
    h1: {},

  });