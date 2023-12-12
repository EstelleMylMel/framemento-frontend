import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useState } from 'react';

type SignupScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

  export default function SignupScreen({ navigation }: SignupScreenProps) {

    const [ email, setEmail ] = useState<string>('');
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');

    const handleSubscription = (): void => {

      // Vérifier que les 3 champs sont remplis
      // Vérifier le bon format de l'adresse email content@content.content
      // Si c'est bon --> 
        //fetch
          //si le fetch est bon --> stocker le user et token dans le store + navigate vers la page suivant
          //si le fetch n'est pas bon --> modale d'erreur pour dire à l'utilisateur que ce n'eest pas bon.
    }

    return (
        <View style={styles.container}>
          {/* header ? */}
            <Text>Email</Text>
            <TextInput style={styles.input} placeholder={'john@gmail.com'} onChangeText={(value) => setEmail(value)} value={email}/>
            
            <Text>Pseudo</Text>
            <TextInput style={styles.input} placeholder={'john'} onChangeText={(value) => setUsername(value)} value={username}/>
            
            <Text>Mot de passe</Text>
            <TextInput style={styles.input} placeholder={'*************'} onChangeText={(value) => setPassword(value)} value={password}/>
            
            <TouchableOpacity onPress={handleSubscription}>
              <Text>INSCRIPTION</Text>
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
    input: {},
    

  });