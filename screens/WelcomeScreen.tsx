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
            <TouchableOpacity onPress={()=> navigation.navigate('Signup')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text>S'INSCRIRE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('Signin')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text>SE CONNECTER</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Rolls')}>
              {/* Faut il faire un composant pour les boutons ? */}
              <Text>DEV : ROLLS</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('Roll')}>
              <Text>DEV : ROLL</Text> 
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