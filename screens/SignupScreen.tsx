import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../reducers/user';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';


/// COMPOSANTS ///
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

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
              console.log('new user data : ',data);
              const { _id, username, token, rolls } = data;
              dispatch(updateUser({_id, username, token, rolls, framesShared: []}));
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

            <View style={styles.body}>
              <SafeAreaView style={styles.headerContainer}>
                <Header
                    navigation={navigation}
                    iconLeft='arrow-back'
                    title='Inscription'
                    marginTop={30}
                  />
              </SafeAreaView>
              <View style={styles.container}>
                <View style={styles.viewInput}>
                  <CustomInput
                    label='Email'
                    icon='alternate-email' 
                    >
                    <TextInput 
                      placeholder='email@email.fr'
                      placeholderTextColor='#AAAAAA'
                      value={email}
                      onChangeText={(value) => setEmail(value)}
                      style={styles.input} 
                      />
                  </CustomInput>
                  <CustomInput 
                    label='Pseudo'
                    icon='account-circle' >
                      <TextInput 
                        placeholder='framemento'
                        placeholderTextColor='#AAAAAA'
                        value={username}
                        onChangeText={(value) => setUsername(value)}
                        style={styles.input} 
                        />
                  </CustomInput>
                  <CustomInput
                    label='Mot de passe'
                    icon='vpn-key' >
                      <TextInput 
                        placeholder='******'
                        placeholderTextColor='#AAAAAA'
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                        style={styles.input}
                        secureTextEntry={true}
                        />
                  </CustomInput>
                  </View>
                <View style={styles.viewButton}>
                  <CustomButton 
                    title='Inscription'
                    onPress={handleSubscription}
                    type='primary'/> 
                </View>  
              </View>
          </View>
    )
}

const styles = StyleSheet.create({
    
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
    height:'100%',
    width: '100%',
  },
  headerContainer: {
    height: 130,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 150,
    },
    header: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center', 
      marginTop: 20,
      marginBottom: 20,
    },
    h1: {
      color: '#EEEEEE',
      fontSize: 30,
      fontFamily: 'Poppins-SemiBold',
      bottom: 200,
    },
    input: {
      width: 180,
      color: '#EEEEEE',
      fontSize: 14,
      fontFamily: 'Poppins-Light',
      fontStyle: 'normal',
      fontWeight: '300',
      lineHeight: 24,
      textAlign: 'right',
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
    buttonInscription: {
      backgroundColor: '#FFDE67',
      paddingLeft: 4, 
      paddingRight: 4, 
      paddingTop: 6, 
      paddingBottom: 6,
      borderRadius: 12, 
      overflow: 'hidden', 
      justifyContent: 'center', 
      alignItems: 'center', 
      top: 5,
    },
    textInscription: {
      color: '#1B1B1B',
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
  });