import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

/// COMPOSANTS ///
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';

/// COMPOSANTS ///
import { CamType } from '../types/camera';

/// REDUCER ///
import { UserState } from '../reducers/user';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type CameraListScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

function CameraListScreen({ navigation }: CameraListScreenProps) {
  // État local pour l'utilisateur, les caméras, le modal, la marque, le modèle et le message d'alerte
  const user = useSelector((state: { user: UserState }) => state.user.value);
  const [userCameras, setUserCameras] = useState<CamType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Fonctions de gestion des changements dans les champs de texte
  const handleBrandChange = (text: string) => {
    setBrand(text);
  };

  const handleModelChange = (text: string) => {
    setModel(text);
  };

  // Effet pour récupérer la liste des caméras de l'utilisateur depuis l'API
  useEffect(() => {
    fetch(`${BACKEND_LOCAL_ADRESS}/material/camera/${user._id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setUserCameras(data.cameras);
        }
      })
      .catch((error) => {
        console.error('Error fetching cameras:', error);
      });
  }, [user._id]);

  // Fonction pour supprimer une caméra
  const handleDeleteCamera = (cameraId: string) => {
    fetch(`${BACKEND_LOCAL_ADRESS}/material/camera/${cameraId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setUserCameras((prevCameras) =>
            prevCameras.filter((camera) => camera._id !== cameraId)
          );
        } else {
          console.error('Error deleting camera:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error deleting camera:', error);
      });

    setUserCameras((prevCameras) =>
      prevCameras.filter((camera) => camera._id !== cameraId)
    );
  };

  // Fonction pour sauvegarder une nouvelle caméra
  const handleSaveCamera = () => {
    setBrand('');
    setModel('');

    if (brand && model) {
      fetch(`${BACKEND_LOCAL_ADRESS}/material/cameras/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand, model }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.result) {
            setUserCameras((prevCameras) => [...prevCameras, data.camera]);
            setAlertMessage(null);

            if (!alertMessage) {
              setModalVisible(false);
            }
          } else if (data && data.error) {
            setAlertMessage('Appareil déjà enregistré');
          } else {
            setAlertMessage('Appareil déjà enregistré');
          }
        })
        .catch((error) => {
          console.error('Error saving camera:', error);
        });
    } else {
      console.error('Brand or model is not defined');
    }
  };

  // Fonction pour annuler l'ajout d'une caméra
  const buttonAnnuler = () => {
    setModalVisible(!modalVisible);
    setAlertMessage(null);
  };

  // Fonction pour ouvrir le modal d'ajout d'une caméra
  const buttonAjout = () => {
    setModalVisible(true);
  };

  // Rendu du composant
  return (
    <View style={styles.cameraContainer}>
      <ScrollView style={styles.scrollView}>
        {userCameras.map((camera) => (
          <View key={camera._id} style={styles.cameraItem}>
            <View style={styles.cameraTextContainer}>
              <Text style={styles.textListBrand}>{camera.brand}</Text>
              <Text style={styles.textListModel}>{camera.model}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteCamera(camera._id)}>
              <MaterialIcons name="delete" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {modalVisible && (
        <View style={styles.centeredView}>
          <Modal
            style={styles.modal}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <Header
                navigation={navigation}
                iconLeft="close"
                onPressLeftButton={buttonAnnuler}
                title="Nouvel appareil"
                marginTop={-100}
              />
              <CustomInput label="Marque" icon="sell">
                <TextInput
                  style={styles.input}
                  placeholder="-"
                  value={brand}
                  onChangeText={(text) => {
                    handleBrandChange(text);
                    setAlertMessage(null);
                  }}
                />
              </CustomInput>
              <CustomInput label="Modèle" icon="photo-camera">
                <TextInput
                  style={styles.input}
                  placeholder="-"
                  value={model}
                  onChangeText={(text) => {
                    handleModelChange(text);
                    setAlertMessage(null);
                  }}
                />
              </CustomInput>
              {alertMessage && (
                <Text style={styles.alertText}>Appareil déjà enregistré</Text>
              )}
              <View style={styles.buttonEnregistrer}>
              <CustomButton
                title="Enregistrer"
                onPress={handleSaveCamera}
                type="primary"
              />
              </View>
            </View>
          </Modal>
        </View>
      )}
      <CustomButton
        title="Ajouter un appareil"
        onPress={buttonAjout}
        type="primary"
      />
    </View>
  );
}

export default CameraListScreen;

// Styles du composant
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  scrollView: {
    backgroundColor: 'transparent',
    marginVertical: 30,
    marginBottom: 120,
  },
  cameraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#101010',
    borderRadius: 2,
    width: 350,
    height: 70,
    paddingRight: 20,
    paddingLeft: 20,
  },
  cameraTextContainer: {
    flex: 1,
  },
  textListBrand: {
    fontFamily: 'Poppins-Regular',
    color: '#EEEEEE',
    fontSize: 14,
  },
  textListModel: {
    fontFamily: 'Poppins-Light',
    color: '#AAAAAA',
    fontSize: 12,
  },
  deleteIcon: {
    marginLeft: 10,
    color: '#EEEEEE',
  },
  modal: {},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    padding: 32,
    backgroundColor: '#000000',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  input: {
    backgroundColor: '#101010',
    width: 320,
    height: 40,
    paddingLeft: 10,
    marginTop: 5,
    color: 'white',
    fontFamily: 'Poppins-Light',
  },
  alertText: {
    color: 'red',
    fontSize: 16,
    marginTop: -10,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  buttonEnregistrer: {
    backgroundColor: '#FFDE67',
    width: 350,
    height: 40,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',  // Ajout de cette ligne pour centrer horizontalement
    position: 'absolute',
    bottom: 24,  // Ajustement pour placer le bouton à 24px du bas
  },
});
