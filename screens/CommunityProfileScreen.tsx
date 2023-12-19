import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../reducers/user';
import { UserProfileType } from '../types/userProfile';
import { FrameType } from '../types/frame';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CategoryType } from '../types/category';
import CustomField from '../components/CustomField';
import CustomButton from '../components/CustomButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { RootStackParamList } from '../App';
import { NavigationProp, ParamListBase, useRoute, RouteProp} from '@react-navigation/native';



// Typage du contenu des paramètres de la route
type CommunityProfileScreenProps = {
    navigation: NavigationProp<RootStackParamList>,
};

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

const CommunityProfileScreen: React.FC<CommunityProfileScreenProps> = ({ navigation }) => {

    const user = useSelector((state: { user: UserState }) => state.user.value);

    const [framesShared, setFramesShared] = useState<FrameType[]>([]);


    /// FETCH LES INFORMATIONS DES FRAMES PARTAGÉES DU USER À L'ARRIVÉE SUR L'ÉCRAN ///

    useEffect(() => {
        fetch(`${BACKEND_LOCAL_ADRESS}/users/${user.username}`)
            .then(response => response.json())
            .then((data): void => {
                if (data.result) {
                    const sharedFrames = data.frames.filter((frame: FrameType) => frame.shared === true);
                    setFramesShared(sharedFrames);
                } else {
                    console.log("fetch for user data went wrong")
                }
            })
    }, []);


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
        // updateLikesInFramesShared(updatedFrame)
    }

    function updateLikesInFramesShared(updatedFrame: FrameType) {
        const updatedFramesShared = framesShared.map(frame => {
            if (frame._id === updatedFrame._id) {
                return updatedFrame;
            }
            return frame;
        });
        setFramesShared(updatedFramesShared);
    }
    

    /// GÉRER LES CATÉGORIES DES FRAMES ///

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

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    function handleCategorySelection(category: string, frameId: string) {
        if (selectedCategories.includes(category)) {
            // Supprimer la catégorie sélectionnée
            const updatedCategories = selectedCategories.filter(cat => cat !== category);
            setSelectedCategories(updatedCategories);

            // Envoyer la requête pour supprimer la catégorie du frame
            fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frameId}/removecategory`, {
                method: 'PUT',
                body: JSON.stringify({ category }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log(`Category ${category} removed successfully from frame ${frameId}`);
                }
            })
            .catch(error => {
                console.error(`Error removing category ${category} from frame ${frameId}:`, error);
            });
        } else {
            // Ajouter la catégorie sélectionnée
            fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frameId}/addcategory`, {
                method: 'PUT',
                body: JSON.stringify({ category }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setSelectedCategories(prevSelectedCategories => [...prevSelectedCategories, category]);
                }
            })
            .catch(error => {
                console.error(`Error adding category ${category} to frame ${frameId}:`, error);
            });
        }
    };

    const selectedCategoriesList = selectedCategories.map((category: string, i: number) => {
        return <Text key={i}>{category}</Text>
    })


    /// AFFICHE LES FRAMES PARTAGÉES DU USER ///

    const [ modalViewFrameVisible, setModalViewFrameVisible ] = useState<boolean>(false);
    const [ frameToDisplay, setFrameToDisplay ] = useState<FrameType | undefined>();

    function handlePressOnFrame(frame: FrameType): void {
        fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}`)
            .then(response => response.json())
            .then(data => {
                setFrameToDisplay(data.frame);
                if (data.frame.categories) {
                    setSelectedCategories(data.frame.categories)
                }
            })
            .catch(error => {
              console.error('Erreur lors du fetch frame cliquée :', error);
            });
        setModalViewFrameVisible(true)
    }

    const framesSharedList = framesShared.map((frame: FrameType, i: number) => {

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
                    <Image source={{ uri: frameToDisplay?.argenticPhoto }} style={styles.argenticPhoto} />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={styles.titleFrame}>{frame.location}</Text>
                    <Text style={styles.infos}>{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} • ${frame.shutterSpeed} • ${frame.aperture}`}</Text>
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


    /// UNSHARE UNE FRAME ///


    function handlePressOnShareButton(displayedFrame: FrameType | undefined) {
        fetch(`${BACKEND_LOCAL_ADRESS}/frames/${displayedFrame?._id}`, {
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify({shared: false}),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('frame unshared successfully')
            setFramesShared((prevFrames) =>
                prevFrames.filter((frame) => frame._id !== displayedFrame?._id)
            );
            setFrameToDisplay(undefined);
            setModalViewFrameVisible(false)
        })
        .catch(error => {
            console.error('Erreur lors du put frameToDisplay :', error);
        });     
    }




    return (
        <View style={styles.container}>

            {/* Sous Header */}
            <View style={styles.topContainer}>
                <View style={styles.topContainerProfile}>
                    <Image source={require("../assets/image-profil.jpg")} style={styles.profilePicture} />
                    <Text style={styles.profileText}>{user.username}</Text>
                </View>
                <Text style={styles.topContainerText}>Mes photos partagées</Text>
            </View>

            {/* Frames shared */}
            <ScrollView style={styles.scrollView}>
                {framesShared.length > 0 && framesSharedList}
            </ScrollView>

            <View style={styles.centeredView}>
            <Modal visible={modalViewFrameVisible} animationType="fade" transparent>
            <SafeAreaProvider>
                
                <View style={styles.modalView}>


                {/* Modal Header */}

                <Header navigation={navigation} iconLeft='close' title='Nom de la photo' iconRight='visibility' onPressLeftButton={() => {setModalViewFrameVisible(false); setSelectedCategories([])}} onPressRightButton={() => handlePressOnShareButton(frameToDisplay)} />
            

                    <ScrollView style={styles.scrollViewModal}>
                    {/* Image de l'argentique */}
                        <Image source={{ uri: frameToDisplay?.argenticPhoto }} style={styles.argenticPhoto} />

                    { /* Choisir la/les catégorie.s de la photo */}
                    <View style={styles.pickerContainer}>
                        <Picker
                        selectedValue={selectedCategoriesList}
                        onValueChange={(itemValue: any) => {if (frameToDisplay) handleCategorySelection(itemValue, frameToDisplay._id)}}
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
                                        selectedCategories.includes(category)
                                            ? { backgroundColor: 'black', color: "#FFDE67", fontWeight: 'bold', fontSize: 14 }
                                            : { backgroundColor: 'black', color: '#EEEEEE', fontWeight: 'normal', fontSize: 12 }
                                    } 
                                />
                            ))}
                        </Picker>
                        <View style={styles.categories}>
                            {
                                selectedCategories.map((category: string, i: number) => {
                                    return <Text key={i} style={styles.category}>{category}</Text>
                                })
                            }
                        </View>
                    </View>
                    
                    {/* numero photo / vitesse / ouverture */}
                    <View style={styles.fieldsGroup}>
                        {/* lieu */}
                        <CustomField label='Lieu' icon='location-on' value={frameToDisplay?.location}></CustomField>

                        {/* date */}
                        <CustomField label='Date' icon='date-range' value={String(frameToDisplay?.date)}></CustomField>

                        {/* meteo */}
                        <CustomField label='Weather' icon='cloud' value={frameToDisplay?.weather}></CustomField>
                    </View>

                    <View style={styles.fieldsGroup}>
                        {/* appareil */}
                        <CustomField label='Appareil' icon='photo-camera' value={`${frameToDisplay?.camera?.brand} - ${frameToDisplay?.camera?.model}`}></CustomField>

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

export default CommunityProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
  },
  topContainer: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topContainerProfile: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
  },
  topContainerText: {
    fontSize: 15,
    color: '#EEEEEE',
    fontFamily: 'Poppins-Medium',
  },
  profilePicture: {
    height: 60,
    width: 60,
    borderRadius: 10,
    marginRight: 15
  },
  profileText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EEEEEE'
  },
  noFrameText: {
    color: '#EEEEEE'
  },
  pickerContainer: {
    marginTop: 25,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  picker: {
    height: 50,
    width: 200,
    backgroundColor: 'black',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  pickerItemTitle: {
    backgroundColor: 'black',
    color: '#AAAAAA',
    fontSize: 12,
    fontFamily: 'Poppins-Light'
  },
  pickerItem: {
    color: 'black',
    fontSize: 12,
  },
  categories: {

  },
  category: {
    color: '#EEEEEE',
    fontSize: 12,
    fontFamily: 'Poppins-Light'
  },
  scrollView: {
    width: '100%',
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
  frameSharedContainer: {
    width: '100%',
    justifyContent: 'center',
    marginTop: 15
  },
  argenticPhoto: {
    height: 228,
    width: '100%',
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
    color: '#EEEEEE',
  },
});




/*
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../reducers/user';
import { UserProfileType } from '../types/userProfile';
import { FrameType } from '../types/frame';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;

export default function CommunityProfileScreen() {

    const user = useSelector((state: { user: UserState }) => state.user.value);

    const [framesShared, setFramesShared] = useState<FrameType[]>([]);


    /// FETCH LES INFORMATIONS DES FRAMES PARTAGÉES DU USER À L'ARRIVÉE SUR L'ÉCRAN ///

    useEffect(() => {
        fetch(`${BACKEND_LOCAL_ADRESS}/users/${user.username}`)
            .then(response => response.json())
            .then((data): void => {
                if (data.result) {
                    const sharedFrames = data.frames.filter((frame: FrameType) => frame.shared === true);
                    setFramesShared(sharedFrames);
                } else {
                    console.log("fetch for user data went wrong")
                }
            })
    }, []);


    /// GÉRER LE LIKE - UNLIKE ///

    function handlePressOnHeart(frame: FrameType) {
        if (user.username) {
            if (!frame.likes?.includes(user.username)) {
                fetch(`${BACKEND_LOCAL_ADRESS}/frames/${frame._id}/like`, {
                    method: 'PUT',
                    body: user.username,
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
                    body: user.username,
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
    


    /// AFFICHE LES FRAMES PARTAGÉES DU USER ///

    const framesSharedList = framesShared.map((frame: FrameType, i: number) => {

        // STYLE LIKE
        let isLikedByUserConnected = false;
        if (user.username) {
            frame.likes?.includes(user.username) ? isLikedByUserConnected = true : undefined;
        }
        let heartColor = isLikedByUserConnected ? "yellow" : "black";

        return (
            <View key={i} style={styles.frameSharedContainer}>
                <Image source={require("../assets/favicon.png")} style={styles.argenticPhoto} />
                <Text>{frame.location}</Text>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => handlePressOnHeart(frame)} >
                        <FontAwesome name='tag' color={`${heartColor}`} style={styles.heartIcon} />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{frame.likes?.length}</Text>
                    <FontAwesome name='tag' style={styles.commentaryIcon} />
                    <Text style={styles.commentaryCount}>{frame.commentaries?.length}</Text>
                </View>
            </View>
        )
    })


    return (
        <View style={styles.container}>

            {/* Header 
            <View style={styles.header}>
                <Image source={require("../assets/favicon.png")} style={styles.profilePicture} />
                <Text style={styles.profileText}>{user.username}</Text>
            </View>

            {/* Frames shared 
            {framesShared.length > 0 && framesSharedList}

            <Text style={styles.profileText}>Welcome</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePicture: {
    height: 60,
    width: 60
  },
  profileText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  frameSharedContainer: {

  },
  argenticPhoto: {

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

  }
});
*/