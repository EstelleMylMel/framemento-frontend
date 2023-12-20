// Importez les bibliothèques nécessaires de React
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Modal, Pressable, Alert, TextInput, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { UserState } from '../reducers/user';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

/// COMPOSANTS ///
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

/// COMPOSANTS ///
import { LensType } from '../types/lens';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type LensListScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

function LensListScreen({ navigation }: LensListScreenProps) {
 
  const user = useSelector((state: { user: UserState }) => state.user.value);
  
  const [userLenses, setUserLenses] = useState<LensType[]>([]);
  const [lenses, setLenses] = useState<LensType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // fonctions permettant d'ajouter du texte dans les inputs
  const handleBrandChange = (text: string) => {
    setBrand(text);
  };
  
  const handleModelChange = (text: string) => {
    setModel(text);
  };

  
  // Effectuer une action après le rendu initial du composant
  useEffect(() => {
    // Requête à l'API pour récupérer la liste des appareils
    fetch(`${BACKEND_LOCAL_ADRESS}/material/lens/${user._id}`)
      .then((response) => response.json()) 
      .then((data) => {
        if (data.result) {
          // Mettre à jour l'état local avec la liste des appareils
          setUserLenses(data.lenses);
        }
      })
      .catch((error) => {
        // Gérer les erreurs en cas d'échec de la requête
        console.error('Error fetching lenses:', error);
      });
  }, [user._id]); // Utiliser une dépendance vide pour n'exécuter useEffect qu'une seule fois (après le rendu initial)

  /// SUPPRIMER UNE LENSE ///
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

  /// AJOUTER UNE LENS ///
  const handleSaveLens = () => {
    // Actions pour réinitialiser les états
    setBrand('');
    setModel('');
  
    // Vérification que brand et model sont définis
    if (brand && model) {
      // requête pour sauvegarder la lens
      fetch(`${BACKEND_LOCAL_ADRESS}/material/lenses/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand, model }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data && data.result) {
            // Mettre à jour l'état local des lenses avec la nouvelle lens
            setLenses((prevLenses) => [...prevLenses, data.lens]);
  
            // Mettre à jour l'état local du UserProfile avec la nouvelle liste des lenses
            setUserLenses((prevUserLenses) => [...prevUserLenses, data.lens]);
  
            // Réinitialiser le message d'alerte
            setAlertMessage(null);
  
            // Fermer la modal seulement si aucun message d'alerte n'est présent
            if (!alertMessage) {
              setModalVisible(false);
            }
          } else if (data && data.error) {
  
            // Définir le message d'alerte
            setAlertMessage('Appareil déjà enregistré');
          } else {
            setAlertMessage('Appareil déjà enregistré');
          }
        })
        .catch((error) => {
          console.error('Error saving lens:', error);
        });
    } else {
      console.error('Brand or model is not defined');
    }
  };

  /// FONCTIONS CUSTOM BUTTON
  const buttonAnnuler = () => {
    setModalVisible(!modalVisible);
    setAlertMessage(null);
  };

  const buttonAjout = () => {
    setModalVisible(true)
  };

  return (
    <View style={styles.lensContainer}>
      <ScrollView style={styles.scrollView}>
          {userLenses.map((lens) => (
            <View key={lens._id} style={styles.lensItem}>
              <View style={styles.lensTextContainer}>
                <Text style={styles.textListBrand}>{lens.brand}</Text>
                <Text style={styles.textListModel}>{lens.model}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteLens(lens._id)}>
                <MaterialIcons name='delete' size={18} color="white" style={styles.deleteIcon}/>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
      {modalVisible && (
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
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        
            <Text style={styles.textAdd}>Nom de l'appareil</Text>
            <CustomInput
              label='Marque'
              icon='sell'
            >
            <TextInput
              style={styles.input}
              placeholder="-"
              value={brand}
              onChangeText={(text) => {
                handleBrandChange(text);
                setAlertMessage(null); // Clear the error message on input change
              }}
            />
            </CustomInput>
            <CustomInput
              label='Modèle'
              icon='camera'
            >
            <TextInput
              style={styles.input}
              placeholder="-"
              value={model}
              onChangeText={(text) => {
                handleModelChange(text);
                setAlertMessage(null); // Clear the error message on input change
              }}
            />
            </CustomInput>
            {alertMessage && (
              <Text style={styles.alertText}>Appareil déjà enregistré</Text>
            )}
            {/*<Pressable
              style={styles.buttonEnregistrer}
              onPress={() => handleSaveLens()}
            >
              <Text style={styles.textButtonSave}>Enregistrer un appareil</Text>
            </Pressable>*/}
            <CustomButton
              title='Enregistrer un appareil'
              onPress={handleSaveLens}
              type='primary'
            />
            {/*<Pressable
              style={styles.buttonAnnuler}
              onPress={() => {
                setModalVisible(!modalVisible);
                setAlertMessage(null); // Clear the error message on "Annuler" press
              }}
            >
              <Text style={styles.textButtonAnnuler}>Annuler</Text>
            </Pressable> */}
            <CustomButton
              title='Annuler'
              onPress={buttonAnnuler}
              type='secondary'
            />
      </View>
    </View>
  </Modal>
)}
      {/*<Pressable
        style={styles.buttonAdd}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textButtonAdd}>Ajouter un appareil</Text>
          </Pressable>*/}
      <CustomButton
        title='Ajouter un appareil'
        onPress={buttonAjout}
        type='primary'
      />
    </View>
  );
}

export default LensListScreen;

const styles = StyleSheet.create({
  lensContainer: {
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
  lensItem: {
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
  lensTextContainer: {
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
  modal: {
    
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 350,
    height: 300,
    padding: 32,
    backgroundColor: '#000000',
    borderRadius: 16,
    borderColor: 'white', 
    borderWidth: 0.5, 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  textAdd: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Light',
  },
  input: {
    backgroundColor: '#101010',
    width: 320,
    height: 40,
    paddingLeft: 10,
    marginTop: -20,
    color: 'white',
    fontFamily: 'Poppins-Light',
  },
  modalText: {
  },
  button: {
  },
  buttonEnregistrer: {
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
  },
  buttonAnnuler: {
    backgroundColor: '#101010',
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
    marginTop: -20,
  },
  textStyle: {
    color: 'white',  
  },
  buttonAdd: {
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
    gap: 10,
    position: 'absolute', 
    bottom: 75, 
    left: '50%', 
    transform: [{ translateX: -150 }], 
  },
  textButtonAdd: {
    color: '#101010',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  textButtonSave: {
    color: '#101010',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  textButtonAnnuler: {
    color: '#FFDE67',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  alertText: {
    color: 'red',
    fontSize: 16,
    marginTop: -10, 
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },  
});
