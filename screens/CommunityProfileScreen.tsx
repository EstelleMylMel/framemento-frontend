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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
                console.log(frameToDisplay)
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

        return (
            <View key={i} style={styles.frameSharedContainer}>
                <TouchableOpacity onPress={() => handlePressOnFrame(frame)}>
                    <Image source={require("../assets/favicon.png")} style={styles.argenticPhoto} />
                </TouchableOpacity>
                <Text>{frame.location}</Text>

                <View style={styles.iconsContainer}>
                    { /* Likes */ }
                    <TouchableOpacity onPress={() => handlePressOnHeart(frame)} >
                        <MaterialIcons name='favorite' color={`${heartColor}`} style={styles.heartIcon} />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{frame.likes?.length}</Text>
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
        })
        .catch(error => {
            console.error('Erreur lors du put frameToDisplay :', error);
        });     
    }




    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Image source={require("../assets/favicon.png")} style={styles.profilePicture} />
                <Text style={styles.profileText}>{user.username}</Text>
            </View>

            {/* Frames shared */}
            {framesShared.length > 0 && framesSharedList}

            <Modal visible={modalViewFrameVisible} animationType="fade" transparent>
            <SafeAreaProvider>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>


                {/* Modal Header */}
                <SafeAreaView style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => {setModalViewFrameVisible(false); setSelectedCategories([])}} style={styles.headerButton} activeOpacity={0.8}>
                        <MaterialIcons name="close" size={24} color="#EEEEEE" />
                    </TouchableOpacity>
                    <Text style={styles.title}>TO CHANGE !!!</Text>
                    <TouchableOpacity 
                        onPress={() => handlePressOnShareButton(frameToDisplay)} 
                        style={styles.headerButton} 
                        activeOpacity={0.8}
                    >
                        { frameToDisplay?.shared? 

                        <MaterialIcons name='visibility' size={24} color="#FFDE67"/> 
                        :
                        <MaterialIcons name='visibility-off' size={24} color="#AAAAAA"/> }

                    </TouchableOpacity>
                </SafeAreaView>
            

                    <ScrollView style={styles.scrollView}>
                    {/* Image de l'argentique */}
                        <Image source={{ uri: frameToDisplay?.argenticPhoto }} style={{ width: 200, height: 200 }} />

                    { /* Choisir la/les catégorie.s de la photo */}
                    <Picker
                    selectedValue={selectedCategoriesList}
                    onValueChange={(itemValue: any) => handleCategorySelection(itemValue, frameToDisplay._id)}
                    style={styles.picker}
                    dropdownIconColor='#EEEEEE'
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
                        <CustomField label='Appareil' icon='photo-camera' value={`${frameToDisplay?.camera.brand} - ${frameToDisplay?.camera.model}`}></CustomField>

                        {/* objectif */}
                        <CustomField label='Objectif' icon='circle' value={`${frameToDisplay?.lens?.brand} - ${frameToDisplay?.lens?.model}`}></CustomField>
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

                </View>
            </SafeAreaProvider>
            </Modal>

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
  picker: {
    height: 50,
    width: 200,
    backgroundColor: 'black',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  pickerItemTitle: {
    color: '#EEEEEE',
    fontSize: 12,
  },
  pickerItem: {
    color: 'black',
    fontSize: 12,
  },
  selectedPickerItem: {

  },
  categories: {
 
  },
  category: {
    color: '#EEEEEE'
  },
  scrollView: {

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

  },
  centeredView: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    },
  modalView: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //marginTop: 52,
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
  title:{

  }
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