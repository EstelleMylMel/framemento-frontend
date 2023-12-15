// Importez les bibliothèques nécessaires de React
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MyMaterialScreen from './MyMaterialScreen';
import { UserState } from '../reducers/user';

// IMPORTS TYPES //
import { LensType } from '../types/lens';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type LensListScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};


function LensListScreen({ navigation }: LensListScreenProps) {
 
  const user = useSelector((state: { user: UserState }) => state.user.value);
  
  const [userLenses, setUserLenses] = useState<LensType[]>([]);

  const [lenses, setLenses] = useState<LensType[]>([]);

  // Effectuer une action après le rendu initial du composant
  useEffect(() => {
    // Requête à l'API pour récupérer la liste des objectifs
    fetch(`${BACKEND_LOCAL_ADRESS}/material/lens/${user._id}`)
      .then((response) => response.json()) 
      .then((data) => {
        if (data.result) {
          // Mettre à jour l'état local avec la liste des objectifs
          setUserLenses(data.lenses);
        }
      })
      .catch((error) => {
        // Gérer les erreurs en cas d'échec de la requête
        console.error('Error fetching lenses:', error);
      });
  }, [user._id]); // Utiliser une dépendance vide pour n'exécuter useEffect qu'une seule fois (après le rendu initial)

  
  const handleDeleteLens = (lensId: string) => {
    fetch(`${BACKEND_LOCAL_ADRESS}/material/lens/${lensId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setLenses((prevLenses) => prevLenses.filter((lens) => lens._id !== lensId));
        } else {
          console.error('Error deleting lens:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error deleting lens:', error);
      });

      setUserLenses((prevLenses) => prevLenses.filter((lens) => lens._id !== lensId));
  }

  return (
    <View>
      <Text>Liste des objectifs:</Text>
      {userLenses.map((lens) => (
        <View key={lens._id}>
          <Text>{lens.brand}</Text>
          <Text>{lens.model}</Text>
          <TouchableOpacity onPress={() => handleDeleteLens(lens._id)}>
            <FontAwesome name="trash" size={20} color="red" style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}


export default LensListScreen;

const styles = StyleSheet.create({
    lensContainer: {
      marginBottom: 10,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    deleteIcon: {
      marginLeft: 10,
    },
  });