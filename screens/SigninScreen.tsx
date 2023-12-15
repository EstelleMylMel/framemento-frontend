import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../reducers/user';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type SigninScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

  export default function SigninScreen({ navigation }: SigninScreenProps) {

    const dispatch: any = useDispatch(); //CORRIGER LE TYPE

    const [ email, setEmail ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');

    const handleSubscription = (): void => {

      // Vérifier que les 3 champs sont remplis
      if ( email !== '' && password !== '' ) {

        const pattern: RegExp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ // regex qui vérifie le format traditionnel d'une adresse email
        // Vérifier le bon format de l'adresse email content@content.content
        const emailFormatIsValid : boolean  = pattern.test(email);
      
        // Si c'est bon --> 
        if ( emailFormatIsValid ) {
          
          //Enregistrement du profil dans la db
          fetch(`${BACKEND_LOCAL_ADRESS}/users/signin`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({email, password}),
          })
          .then(response => response.json())
          .then(data => {
            if ( data.result ) {
              const {_id, username, token, rolls } = data;
                dispatch(updateUser({_id, username, token, rolls}));
                navigation.navigate('DrawerNavigator');
            }
            else  {
              console.log(data);
              //si le fetch n'est pas bon --> modale d'erreur pour dire à l'utilisateur que ce n'est pas bon.
            } 
          })
          .catch(error => {
            console.error('Erreur lors du fetch :', error);
          });
          
        } else {
          // Gérer le cas où le format de l'email n'est pas valide
        }
        
      } else { 
        // Gérer le cas où les champs sont mal remplis
      }
    }

    return (
        <View style={styles.container}>
          {/* header ? */}
            <Text>Email</Text>
            <TextInput style={styles.input} placeholder={'john@gmail.com'} onChangeText={(value) => setEmail(value)} value={email}/>
            
            <Text>Mot de passe</Text>
            <TextInput style={styles.input} placeholder={'*************'} onChangeText={(value) => setPassword(value)} value={password}/>
            
            <TouchableOpacity onPress={handleSubscription}>
              <Text>CONNEXION</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('DrawerNavigator')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text>DEV : SKIP</Text>
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