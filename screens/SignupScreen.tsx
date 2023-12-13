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
              const { username, token } = data;
              dispatch(updateUser({username, token}));
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