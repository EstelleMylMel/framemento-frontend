import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { FrameType } from '../types/frame';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserState } from '../reducers/user';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { CategoryType } from '../types/category';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import CustomField from '../components/CustomField';
import Header from '../components/Header';
import { RootStackParamList } from '../App';
import { NavigationProp, ParamListBase, useRoute, RouteProp} from '@react-navigation/native';
const { transformDate } = require('../modules/transformDate');


// Typage du contenu des paramètres de la route
type CommunitySearchScreenProps = {
  navigation: NavigationProp<RootStackParamList>,
};

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;


const CommunitySearchScreen = ({ navigation }: {navigation: any}) => {

  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [searchText, setSearchText] = useState<string>("");
  const [allFramesShared, setAllFramesShared] = useState<FrameType[]>([]);


  /// GÉRER LE LIKE - UNLIKE ///

  function handlePressOnHeart(frame: FrameType) {
    if (user.username) {
        if (!frame.likes?.includes(user.username)) {
            fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}/like`, {
                method: 'PUT',
                body: JSON.stringify({ username: user.username }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log("Frame liked successfully")
                }
            })
            .catch(error => {
                console.error('Error liking frame:', error);
            });
        }
        else {
            fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}/unlike`, {
                method: 'PUT',
                body: JSON.stringify({ username: user.username }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log("Frame unliked successfully")
                }
            })
            .catch(error => {
                console.error('Error unliking tweet:', error);
            });
        }
    }
  }


  /* ARRIVÉE SUR L'ÉCRAN */

  /// FETCH LES FRAMES PARTAGÉES À L'ARRIVÉE SUR L'ÉCRAN ///

  useEffect(() => {
      fetch(`${BACKEND_LOCAL_ADRESS}/frames/shared/true`)
          .then(response => response.json())
          .then((data): void => {
              if (data.result) {
                  setAllFramesShared(data.frames);
              } else {
                  console.log("fetch for frames shared went wrong")
              }
          })
  }, []);

  /// AFFICHER TOUTES LES FRAMES PARTAGÉES À L'ARRIVÉE SUR L'ÉCRAN ///

  const [ modalViewFrameVisible, setModalViewFrameVisible ] = useState<boolean>(false);
  const [ frameToDisplay, setFrameToDisplay ] = useState<FrameType | undefined>();

  function handlePressOnFrame(frame: FrameType): void {
      fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}`)
          .then(response => response.json())
          .then(data => {
              setFrameToDisplay(data.frame);
          })
          .catch(error => {
            console.error('Erreur lors du fetch frame cliquée :', error);
          });
      setModalViewFrameVisible(true)
  }

  const allFramesSharedList = allFramesShared.map((frame: FrameType, i: number) => {

    // STYLE LIKE
    let isLikedByUserConnected = false;
    if (user.username) {
        frame.likes?.includes(user.username) ? isLikedByUserConnected = true : undefined;
    }
    let heartColor = isLikedByUserConnected ? "yellow" : "black";

    const date = new Date(frame.date);
    
    return (
      <View key={i} style={styles.frameSharedContainer}>
        <TouchableOpacity onPress={() => handlePressOnFrame(frame)}>
            <Image source={{ uri: frame.argenticPhoto }} style={styles.argenticPhoto} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
            <Text style={styles.titleFrame}>{frame.location}</Text>
            <Text style={styles.infos}>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} • ${frame.shutterSpeed} • ${frame.aperture}`}</Text>
        </View>

        <View style={styles.iconsContainer}>
          { /* Likes */ }
          { /* <TouchableOpacity onPress={() => handlePressOnHeart(frame)} >
              <MaterialIcons name='favorite' color={`${heartColor}`} style={styles.heartIcon} />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{frame.likes?.length}</Text> */}
          { /* Commentaries */ }
          {/* <FontAwesome name='tag' style={styles.commentaryIcon} />
          <Text style={styles.commentaryCount}>{frame.commentaries?.length}</Text> */}
        </View>
      </View>
    )
  })


  function handlePressOnLensUser() {
    if (searchText) {
      navigation.navigate('CommunitySearchUsername', {searchText})
      setSearchText("")
    }
  }

  function handleSearchKeyPress() {
    if (searchText.trim() !== '') {
      navigation.navigate('CommunitySearchUsername', {searchText})
    }
  };


  const [categoriesPickable, setCategoriesPickable] = useState<string[]>([]);

  useEffect(() => {
      fetch(`${BACKEND_LOCAL_ADRESS}/categories`)
      .then(response => response.json())
      .then((data): void => {
          if (data.result) {
              const allCategories = data.categories.map((category: CategoryType) => category.name);
              const allCategoriesSorted = allCategories.sort()
              setCategoriesPickable(allCategoriesSorted);
          } else {
              console.log("fetch for categories went wrong")
          }
      })
  }, [])

  const [selectedCategory, setSelectedCategory] = useState<string>(categoriesPickable[0])

  function handlePressOnLensCategory() {
    if (selectedCategory) {
      navigation.navigate('CommunitySearchCategory', {selectedCategory})
      setSelectedCategory("")
    }
  }


  return (
      <View style={styles.container}>

          {/* Header */}
          <View style={styles.topContainer}>
            <Text style={styles.inspirationText}>En quête d'inspiration ?</Text>
            <View style={styles.topContainerSub1}>
              <TextInput 
                style={styles.searchInput} 
                placeholder="Entrer un nom d'utilisateur" 
                placeholderTextColor='#AAAAAA'
                onChangeText={(value) => setSearchText(value)} 
                keyboardType="default"
                onEndEditing={handleSearchKeyPress}
                value={searchText}
              />
              <TouchableOpacity onPress={handlePressOnLensUser}>
                <MaterialIcons name='search' size={30} color={searchText ? "#FFDE67" : "#AAAAAA"} style={{ marginRight: 5 }}/> 
              </TouchableOpacity>
            </View>
            <View style={styles.topContainerSub2}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedCategory(itemValue)
                }
                style={styles.picker}
                dropdownIconColor='#AAAAAA'
              >
                <Picker.Item key='Selection' label='Choisir une catégorie' style={styles.pickerItemTitle} />
                {categoriesPickable.map((category: string) => (
                    <Picker.Item 
                      key={category} 
                      label={category} 
                      value={category} 
                      style={
                        selectedCategory === category
                            ? { backgroundColor: 'black', color: "#FFDE67", fontWeight: 'bold', fontSize: 12 }
                            : { backgroundColor: 'black', color: '#EEEEEE', fontWeight: 'normal', fontSize: 12 }
                      } 
                    />
                ))}
              </Picker>
              <TouchableOpacity onPress={handlePressOnLensCategory}>
                <MaterialIcons name='search' size={30} color={selectedCategory ? "#FFDE67" : "#AAAAAA"} style={{ marginRight: 6 }}/> 
              </TouchableOpacity>
            </View>
          </View>

          {/* All frames shared */}
          <ScrollView style={styles.scrollView}>
          { allFramesShared.length > 0  && allFramesSharedList }
          </ScrollView>

          <View style={styles.centeredView}>
          <Modal visible={modalViewFrameVisible} animationType="fade" transparent>
            <SafeAreaProvider>
                <View style={styles.modalView}>


                {/* Modal Header */}
                <Header navigation={navigation} iconLeft='close' title={frameToDisplay ? (frameToDisplay?.title ? frameToDisplay.title : frameToDisplay?.location) : ""} onPressLeftButton={() => setModalViewFrameVisible(false)} />

                    <ScrollView style={styles.scrollViewModal}>
                    {/* Image de l'argentique */}
                        <Image source={{ uri: frameToDisplay?.argenticPhoto }} style={styles.argenticPhoto} />
                    
                    {/* numero photo / vitesse / ouverture */}
                    <View style={styles.fieldsGroup}>
                        {/* lieu */}
                        <CustomField label='Lieu' icon='location-on' value={frameToDisplay?.location}></CustomField>

                        {/* date */}
                        <CustomField label='Date' icon='date-range' value={transformDate(frameToDisplay?.date)}></CustomField>

                        {/* meteo */}
                        <CustomField label='Weather' icon='cloud' value={frameToDisplay?.weather}></CustomField>
                    </View>

                    <View style={styles.fieldsGroup}>
                        {/* appareil */}
                        <CustomField label='Appareil' icon='photo-camera' value={`${frameToDisplay?.camera.brand} - ${frameToDisplay?.camera.model}`}></CustomField>

                        {/* objectif */}
                        <CustomField label='Objectif' icon='circle' value={`${frameToDisplay?.lens?.brand} - ${frameToDisplay?.lens?.model}`}></CustomField>
                    </View>

                    <View style={styles.fieldsGroup}>
                        {/* ouverture */}
                        <CustomField label='Ouverture' icon='photo-camera' value={frameToDisplay?.aperture}></CustomField>

                        {/* vitesse d'obturation */}
                        <CustomField label="Vitesse d'obturation" icon='circle' value={frameToDisplay?.shutterSpeed}></CustomField>
                    </View>

                    <View style={styles.fieldsGroup}>
                        {/* nom */}
                        <CustomField label='Nom' icon='local-offer' value={frameToDisplay?.title}></CustomField>

                        {/* commentaire */}
                        <CustomField label='Commentaire' icon='notes' value={frameToDisplay?.comment}></CustomField>
                    </View>

                    {/* photo du téléphone */}
                    <Image source={{ uri: frameToDisplay?.phonePhoto }} style={styles.photoFromPhone} />
                    

                    </ScrollView>

                </View>

                
            </SafeAreaProvider>
        </Modal>
        </View>

      </View>
  );
};

export default CommunitySearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
  },
  topContainer: {
    marginTop: 25,
    width: '88%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topContainerSub1: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
    marginTop: 10,
    borderLeftColor: '#EEEEEE',
    borderLeftWidth: 1
  },
  topContainerSub2: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
    borderLeftColor: '#EEEEEE',
    borderLeftWidth: 1
  },
  inspirationText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 20,
    marginTop: 10
  },
  searchInput: {
    color: '#EEEEEE',
    marginLeft: 17,
  },
  scrollView: {
    width: '100%',
    height: '40%',
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
    gap: 24,
    marginTop: 10
  }, 
  scrollViewModal: {
    width: '100%',
    padding: 10,
    gap: 24,
    marginTop: 80,
    backgroundColor: '#050505'
  }, 
  fieldsGroup: {
    width: 370,
    height: 'auto',
    borderRadius: 12,
    gap: -1,
    borderColor: '#222222',
    borderWidth: 0.5,
  },
  photoFromPhone: {

  },
  picker: {
    height: 50,
    width: 230,
    backgroundColor: 'black',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  pickerItemTitle: {
    backgroundColor: 'black',
    color: '#AAAAAA',
    fontSize: 14,
    fontFamily: 'Poppins-Light'
  },
  pickerItem: {
    color: 'black',
    fontSize: 12,
    
  },
  category: {
    color: '#EEEEEE',
    fontSize: 12,
    fontFamily: 'Poppins-Light'
  },
  frameSharedContainer: {
    width: '100%',
    justifyContent: 'center',
    marginTop: 15
  },
  argenticPhoto: {
    height: 228,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  textContainer: {
    flex: 1,
    marginTop: 7
  },
  titleFrame: {
    color: '#EEEEEE',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24,
    fontFamily: 'Poppins-Medium'
  },
  infos: {
    flexDirection: 'row',
    color: '#AAAAAA',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: 24,
    fontFamily: 'Poppins-Light'
  },
  iconsContainer: {

  },
  heartIcon: {

  },
  likeCount: {

  },
  commentaryIcon: {

  },
  commentaryCount: {

  },
  centeredView: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '100%',
  },
  headerButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101010',
    borderRadius: 16,
  },
  closeModalIcon: {
    color: '#EEEEEE',
    fontSize: 24,
  },
  textModalHeader: {
    color: '#EEEEEE',
    fontSize: 24,
    marginLeft: 15
  },
  title: {
    color: '#EEEEEE'
  }
});