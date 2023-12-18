import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../reducers/user';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type SignupScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

  export default function SignupScreen({ navigation }: SignupScreenProps) {

    const dispatch: any = useDispatch(); //CORRIGER LE TYPE ANY

    const [ email, setEmail ] = useState<string>('');
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');

    const handleSubscription = (): void => {

      // Vérifier que les 3 champs sont remplis
      if ( email !== ''  && username  !== ''  && password !== '' ) {

        const pattern: RegExp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ // regex qui vérifie le format traditionnel d'une adresse email
        // Vérifier le bon format de l'adresse email content@content.content
        const emailFormatIsValid : boolean  = pattern.test(email);
      
        // Si c'est bon --> 
        if ( emailFormatIsValid ) {
          
          //Enregistrement du profil dans la db
          fetch(`${BACKEND_LOCAL_ADRESS}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({ email, username, password }),
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if ( data.result ) {
              console.log(data);
              const { _id, username, token, rolls } = data;
              dispatch(updateUser({_id, username, token, rolls}));
              navigation.navigate('Rolls');
            }
            else  {
              console.log('coucou');
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
            <TextInput style={styles.inputEmail} placeholder={'john@gmail.com'} onChangeText={(value) => setEmail(value)} value={email}/>
            
            <Text>Pseudo</Text>
            <TextInput style={styles.inputPseudo} placeholder={'john'} onChangeText={(value) => setUsername(value)} value={username}/>
            
            <Text>Mot de passe</Text>
            <TextInput style={styles.inputPassword} placeholder={'*************'} onChangeText={(value) => setPassword(value)} value={password}/>
            
            <TouchableOpacity style={styles.buttonInscription} onPress={handleSubscription}>
              <Text style={styles.textInscription}>INSCRIPTION</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputEmail: {
      backgroundColor: 'grey',
      width: 320,
      height: 40,
      paddingLeft: 10,
      marginTop: -20,
      color: 'white',
      borderRadius: 12,
      bottom: 75,
    },
    inputPseudo: {
      backgroundColor: 'grey',
      width: 320,
      height: 40,
      paddingLeft: 10,
      marginTop: -20,
      color: 'white',
      borderRadius: 12,
      bottom: 70,
    }, 
    inputPassword: {
      backgroundColor: 'grey',
      width: 320,
      height: 40,
      paddingLeft: 10,
      marginTop: -20,
      color: 'white',
      borderRadius: 12,
      bottom: 50,
    },
    buttonInscription: {
      backgroundColor: '#FFFF5B',
      width: 320,
      height: 40,
      paddingLeft: 4, 
      paddingRight: 4, 
      paddingTop: 6, 
      paddingBottom: 6,
      borderRadius: 12, 
      overflow: 'hidden', 
      justifyContent: 'center', 
      alignItems: 'center', 
      bottom: 10,
    },
    textInscription: {
      color: 'black',
      fontSize: 14,
      fontFamily: 'Poppins',
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
  });