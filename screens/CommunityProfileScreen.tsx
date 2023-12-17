import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../reducers/user';
import { UserProfileType } from '../types/userProfile';
import { FrameType } from '../types/frame';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CategoryType } from '../types/category';

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

                <Picker
                    selectedValue={selectedCategoriesList}
                    onValueChange={(itemValue: any) => handleCategorySelection(itemValue, frame._id)}
                    style={styles.picker}
                >
                    <Picker.Item key='Selection' label='Choisir une catégorie' style={styles.pickerItemTitle} />
                    {categoriesPickable.map((category: string) => (
                        <Picker.Item key={category} label={category} value={category} style={styles.pickerItem} />
                    ))}
                </Picker>
                <View>{selectedCategoriesList}</View>

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

            {/* Header */}
            <View style={styles.header}>
                <Image source={require("../assets/favicon.png")} style={styles.profilePicture} />
                <Text style={styles.profileText}>{user.username}</Text>
            </View>

            {/* Frames shared */}
            {framesShared.length > 0 && framesSharedList}

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
    width: 300,
    backgroundColor: '#f8f8f8',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  pickerItemTitle: {
    color: 'black',
    fontSize: 12,
  },
  pickerItem: {
    color: 'black',
    fontSize: 12,
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