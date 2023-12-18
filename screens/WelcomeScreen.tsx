import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserState } from '../reducers/user';

type WelcomeScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {

  console.log('coucou')

    const user = useSelector((state: { user: UserState }) => state.user.value)

    /// Redirection sur la page rolls si l'utilisateur est déjà connecté
    // useEffect(()=> {
    //   user.username !== '' ? navigation.navigate('Rolls') : undefined;
    // },[]);

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Framemento</Text>
            <TouchableOpacity style={styles.buttonSignin} onPress={()=> navigation.navigate('Signup')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text style={styles.textSignin}>S'INSCRIRE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSignup} onPress={()=> navigation.navigate('Signin')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text style={styles.textSignup}>SE CONNECTER</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('MyMaterial')}>
              <Text>DEV : MATERIAL</Text> 
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
      color: '#FFFF5B',
      fontSize: 40,
      fontFamily: 'Poppins',
      fontWeight: '600',
      bottom: 200,
    },
    buttonSignin: {
      backgroundColor: '#FFFF5B',
      width: 300,
      height: 45,
      borderRadius: 12,
      overflow: 'hidden',
      justifyContent: 'center', 
      alignItems: 'center',
      top: 150,
    },
    textSignin: {
      color: 'black',
      fontSize: 18,
      fontFamily: 'Poppins',
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
    buttonSignup: {
      backgroundColor: '#FFFF5B',
      width: 300,
      height: 45,
      borderRadius: 12,
      overflow: 'hidden',
      justifyContent: 'center', 
      alignItems: 'center',
      top: 165,
      marginHorizontal: 20,
    },
    textSignup: {
      color: 'black',
      fontSize: 18,
      fontFamily: 'Poppins',
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
  });