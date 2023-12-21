import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../reducers/user';
import { FrameType } from '../types/frame';
import Header from '../components/Header';

/// COMPOSANTS ///
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

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
          <Header
              navigation={navigation}
              iconLeft='arrow-back'
              title='Connexion'
              marginTop={-100}
             />
          <Text style={styles.h1}>Connexion</Text>
          <View style={styles.viewInput}>
            <CustomInput
              label='Email'
              icon='alternate-email'>
            <TextInput 
              placeholder='email@email.fr'
              placeholderTextColor='#AAAAAA'
              value={email}
              onChangeText={(value) => setEmail(value)}
              style={styles.input} 
              />
            </CustomInput>
            <CustomInput
              label='Mot de passe'
              icon='vpn-key'>
            <TextInput 
              placeholder='******'
              placeholderTextColor='#AAAAAA'
              value={password}
              onChangeText={(value) => setPassword(value)}
              style={styles.input}
              />
            </CustomInput>
            </View>
              <View style={styles.viewButton}>
                <CustomButton
                  title='Connexion'
                  onPress={handleSubscription}
                  type='primary' />
              </View>
            <TouchableOpacity onPress={() => navigation.navigate('DrawerNavigator')}>
              <Text>DEV : SKIP</Text>
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
    h1: {
      color: '#EEEEEE',
      fontSize: 30,
      fontFamily: 'Poppins-SemiBold',
      bottom: 200,
    },
    input: {
      width: 110,
      color: '#101010',
      fontSize: 14,
      fontFamily: 'Poppins-Light',
      fontStyle: 'normal',
      fontWeight: '300',
      lineHeight: 24,
    },
    viewInput: {
      width: 342,
    },
    textInputIcon: {
      color: '#AAAAAA',
      fontSize: 20,
      marginLeft: 12,
      marginRight: 12
    },
    textInput: {
      color: '#AAAAAA',
      fontSize: 14,
      marginRight: 16,
    },
    viewButton: {
      width: 342,
      height: 40,
      marginTop: 50,
    },
    buttonConnexion: {
      backgroundColor: '#FFDE67',
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
      fontFamily: 'Poppins-Regular',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
  });