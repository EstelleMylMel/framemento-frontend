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
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

/// COMPOSANTS ///
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';

/// COMPOSANTS ///
import { LensType } from '../types/lens';

/// REDUCER ///
import { UserState } from '../reducers/user';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

type LensListScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

function LensListScreen({ navigation }: LensListScreenProps) {
  // État local pour l'utilisateur, les objectifs, le modal, la marque, le modèle et le message d'alerte
  const user = useSelector((state: { user: UserState }) => state.user.value);
  const [userLenses, setUserLenses] = useState<LensType[]>([]);
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

  // Effet pour récupérer la liste des objectifs de l'utilisateur depuis l'API
  useEffect(() => {
    fetch(`${BACKEND_LOCAL_ADRESS}/material/lens/${user._id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setUserLenses(data.lenses);
        }
      })
      .catch((error) => {
        console.error('Error fetching lenses:', error);
      });
  }, [user._id]);

  // Fonction pour supprimer un objectif
  const handleDeleteLens = (lensId: string) => {
    fetch(`${BACKEND_LOCAL_ADRESS}/material/lens/${lensId}/${user._id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setUserLenses((prevLenses) =>
            prevLenses.filter((lens) => lens._id !== lensId)
          );
        } else {
          console.error('Error deleting lens:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error deleting lens:', error);
      });

    setUserLenses((prevLenses) =>
      prevLenses.filter((lens) => lens._id !== lensId)
    );
  };

  // Fonction pour sauvegarder un nouvel objectif
  const handleSaveLens = () => {
    setBrand('');
    setModel('');

    if (brand && model) {
      fetch(`${BACKEND_LOCAL_ADRESS}/material/lenses/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand, model }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.result) {
            setUserLenses((prevLenses) => [...prevLenses, data.lens]);
            setAlertMessage(null);

            if (!alertMessage) {
              setModalVisible(false);
            }
          } else if (data && data.error) {
            setAlertMessage('Objectif déjà enregistré');
          } else {
            setAlertMessage('Objectif déjà enregistré');
          }
        })
        .catch((error) => {
          console.error('Error saving lens:', error);
        });
    } else {
      console.error('Brand or model is not defined');
    }
  };

  // Fonction pour annuler l'ajout d'un objectif
  const buttonAnnuler = () => {
    setModalVisible(!modalVisible);
    setAlertMessage(null);
  };

  // Fonction pour ouvrir le modal d'ajout d'un objectif
  const buttonAjout = () => {
    setModalVisible(true);
  };

  // Rendu du composant
  return (
    <View style={styles.lensContainer}>
      <ScrollView style={styles.scrollView}>
        {userLenses.map((lens, i) => (
          <View key={i} style={styles.lensItem}>
            <View style={styles.lensTextContainer}>
              <Text style={styles.textListBrand}>{lens.brand}</Text>
              <Text style={styles.textListModel}>{lens.model}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteLens(lens._id)}>
              <MaterialIcons name="delete" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

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
            <SafeAreaProvider>
            <View style={styles.modalView}>
              
              <Header
                navigation={navigation}
                iconLeft="close"
                onPressLeftButton={buttonAnnuler}
                title="Nouvel objectif"
                marginTop={20}
              />
              
              <View style={styles.viewInput}>
                <CustomInput label="Marque" icon="local-offer">
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
                <CustomInput label="Modèle" icon="shutter-speed">
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
              </View>
              {alertMessage && (
                <Text style={styles.alertText}>Objectif déjà enregistré</Text>
              )}
              <View style={styles.buttonEnregistrer}>
              <CustomButton
                title="Enregistrer"
                onPress={handleSaveLens}
                type="primary"
              />
              </View>
            </View>
            </SafeAreaProvider>
          </Modal>
        </View>
      <CustomButton
        title="Ajouter un objectif"
        onPress={buttonAjout}
        type="primary"
      />
    </View>
  );
}

export default LensListScreen;

// Styles du composant
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
    marginBottom: 16,
    backgroundColor: '#101010',
    borderRadius: 12,
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
  modal: {},
  centeredView: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  modalView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    backgroundColor: '#050505',
  },
  // centeredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '100%',
  //   height: '100%',
  // },
  // modalView: {
  //   flex: 1,
  //   padding: 32,
  //   backgroundColor: '#000000',
  //   flexDirection: 'column',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center',
  //   gap: 32,
  //   width: '100%',
  //   height: '100%',
  // },
  input: {
    backgroundColor: '#101010',
    width: 200,
    height: 40,
    paddingLeft: 10,
    marginTop: 5,
    color: 'white',
    fontFamily: 'Poppins-Light',
    textAlign: 'right',
  },
  viewInput: {
    width: '100%',
    marginTop: 250,
    padding: 24, 
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
    alignSelf: 'center',  // Ajout de cette ligne pour centrer horizontalement
    position: 'absolute',
    bottom: 50,  // Ajustement pour placer le bouton à 50px du bas
  },
});
