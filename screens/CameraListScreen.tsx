// Importez les bibliothèques nécessaires de React
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MyMaterialScreen from './MyMaterialScreen';
import { UserState } from '../reducers/user';


// IMPORTS TYPES //
import { CameraType } from '../types/camera';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type CameraListScreenProps = {
  (navigation: any) : NavigationProp<ParamListBase>;
};


function CameraListScreen() {
    
    const user = useSelector((state: { user: UserState }) => state.user.value);

    const [allCameras, setAllCameras] = useState<CameraType[]>([]);
    const [userCameras, setUserCameras] = useState<CameraType[]>([]);

    const [cameras, setCameras] = useState<CameraType[]>([]);

  // Effectuer une action après le rendu initial du composant
  useEffect(() => {
    // Requête à l'API pour récupérer la liste des objectifs
    fetch(`${BACKEND_LOCAL_ADRESS}/camera`)
      .then((response) => response.json()) 
      .then((data) => {
        if (data.result) {
          // Mettre à jour l'état local avec la liste des objectifs
          setAllCameras(data.cameras);
          console.log(cameras)
        }
      })
      .catch((error) => {
        // Gérer les erreurs en cas d'échec de la requête
        console.error('Error fetching cameras:', error);
      });
  }, []); // Utiliser une dépendance vide pour n'exécuter useEffect qu'une seule fois (après le rendu initial)


  useEffect(() => {
    if (user.username) {
      const filteredCameras = allCameras.filter((camera) => camera._id === user.username);
      setUserCameras(filteredCameras);
    }
  }, [user.username, allCameras]);

  const handleDeleteCamera = (cameraId: string) => {
    fetch(`${BACKEND_LOCAL_ADRESS}/camera/${cameraId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setCameras((prevCameras) => prevCameras.filter((camera) => camera._id !== cameraId));
        } else {
          console.error('Error deleting camera:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error deleting camera:', error);
      });
      setUserCameras((prevCameras) => prevCameras.filter((camera) => camera._id !== cameraId));
  }

  return (
    <View>
      <Text>List of cameras:</Text>
      {userCameras.map((camera) => (
        <View key={camera._id}>
          <Text>{camera.brand}</Text>
          <Text>{camera.model}</Text>
          <TouchableOpacity onPress={() => handleDeleteCamera(camera._id)}>
            <FontAwesome name="trash" size={20} color="red" style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}


export default CameraListScreen;

const styles = StyleSheet.create({
    camera: {
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