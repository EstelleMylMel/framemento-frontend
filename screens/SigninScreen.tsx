import { View, Image, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../reducers/user';
import { FrameType } from '../types/frame';

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
              let framesShared = data.frames?.filter((frame: FrameType) => frame.shared === true)
              console.log('framesShared from signin', framesShared)
                dispatch(updateUser({_id, username, token, rolls, framesShared}));
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
          <Text style={styles.h1}>Connexion</Text>
            <Text style={styles.textEmail}>Email</Text>
            <TextInput style={styles.inputEmail} placeholder={'john@gmail.com'} onChangeText={(value) => setEmail(value)} value={email}/>
            
            <Text style={styles.textPassword}>Mot de passe</Text>
            <TextInput style={styles.inputPassword} placeholder={'*************'} onChangeText={(value) => setPassword(value)} value={password}/>
            
            <TouchableOpacity style={styles.buttonConnexion} onPress={handleSubscription}>
              <Text style={styles.textConnexion}>CONNEXION</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('DrawerNavigator')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text>DEV : SKIP</Text>
            </TouchableOpacity>
              <Text style={styles.textSigninWith}>Se connecter avec</Text>
              <Image 
                style={styles.logoGoogle} 
                source={require('../assets/google.png')} />
              <Image 
                style={styles.logoBehance}
                source={require('../assets/behance.png')} />
              <Image 
                style={styles.logoMeta} 
                source={require('../assets/meta.png')} />
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
    h1: {
      color: '#EEEEEE',
      fontSize: 30,
      fontFamily: 'Poppins',
      fontWeight: '600',
      bottom: 200,
    },
    inputEmail: {
      backgroundColor: '#1B1B1B',
      width: 320,
      height: 40,
      paddingLeft: 10,
      marginTop: -20,
      color: 'white',
      borderRadius: 12,
      bottom: 120,
    },
    textEmail: {
      color: '#EEEEEE',
      bottom: 140,
      marginRight: 260,
    },
    inputPassword: {
      backgroundColor: '#1B1B1B',
      width: 320,
      height: 40,
      paddingLeft: 10,
      marginTop: -20,
      color: 'white',
      borderRadius: 12,
      bottom: 85,
    },
    textPassword: {
      color: '#EEEEEE',
      bottom: 105,
      marginRight: 210,
    },
    buttonConnexion: {
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
      bottom: 50,
    },
    textConnexion: {
      color: 'black',
      fontSize: 14,
      fontFamily: 'Poppins',
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
    textSigninWith: {
      color: '#EEEEEE',
      fontSize: 18,
      top: 80,
    },
    logoGoogle: {
      top: 100,
      marginRight: 150,
    },
    logoBehance: {
      top: 85,
      marginRight: 20,
    },
    logoMeta: {
      top: 70,
      marginLeft: 120,
    },

  });