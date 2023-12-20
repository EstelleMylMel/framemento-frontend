import { View, ImageBackground, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NavigationProp, ParamListBase, } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserState } from '../reducers/user';


type WelcomeScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {

    const user = useSelector((state: { user: UserState }) => state.user.value)

    /// Redirection sur la page rolls si l'utilisateur est déjà connecté
    // useEffect(()=> {
    //   user.username !== '' ? navigation.navigate('Rolls') : undefined;
    // },[]);

    return (
        <View style={styles.container}>
          {/*<ImageBackground style={styles.backgroundImage} resizeMode="cover" source={require('../assets/backgroundImageWelcomescreen.jpg')} >*/}
            <Text style={styles.h1}>Framemento</Text>
            <TouchableOpacity style={styles.buttonSignup} onPress={()=> navigation.navigate('Signup')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text style={styles.textSignup}>S'INSCRIRE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSignin} onPress={()=> navigation.navigate('Signin')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text style={styles.textSignin}>SE CONNECTER</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('MyMaterial')}>
              <Text style={styles.buttonTest}>DEV : MATERIAL</Text> 
            </TouchableOpacity>
            {/*</ImageBackground>*/}
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
    buttonTest: {
      color: 'white'
    },
    buttonSignup: {
      backgroundColor: '#FFFF5B',
      width: 300,
      height: 45,
      borderRadius: 12,
      overflow: 'hidden',
      justifyContent: 'center', 
      alignItems: 'center',
      top: 150,
    },
    textSignup: {
      color: 'black',
      fontSize: 18,
      fontFamily: 'Poppins',
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
    buttonSignin: {
      backgroundColor: '#1B1B1B',
      width: 300,
      height: 45,
      borderRadius: 12,
      overflow: 'hidden',
      justifyContent: 'center', 
      alignItems: 'center',
      top: 165,
      marginHorizontal: 20,
    },
    textSignin: {
      color: '#FFFF5B',
      fontSize: 18,
      fontFamily: 'Poppins',
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0.15,
    },
  });