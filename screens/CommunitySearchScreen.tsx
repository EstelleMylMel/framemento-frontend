import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { FrameType } from '../types/frame';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { UserState } from '../reducers/user';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { CategoryType } from '../types/category';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;


export default function CommunitySearchScreen({ navigation }: { navigation: any }) {

  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [searchText, setSearchText] = useState<string>("");
  const [allFramesShared, setAllFramesShared] = useState<FrameType[]>([]);
  const [framesFromUserSearched, setFramesFromUserSearched] = useState<FrameType[]>([]);
  const [framesFromCategorySearched, setFramesFromCategporySearched] = useState<FrameType[]>([]);


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

  const allFramesSharedList = allFramesShared.map((frame: FrameType, i: number) => {

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


  /* RECHERCHE PAR USERNAME */

  /*useEffect(() => {
    if (tag) {
      console.log(route.params)
      console.log(`http://localhost:3000/users/search/${tag}`)
      fetch(`http://localhost:3000/users/search/${tag}`)
          .then(response => response.json())
          .then(data => {
              if (data.result) {
                  setFramesFromUserSearched(data.framesShared);
              }
          })
          .catch(error => {
              console.error(`Error fetching frames shared from ${tag}:`, error);
          });
    }
  }, [tag]);*/


  function handleSearchKeyPress() {
    if (searchText.trim() !== '') {
      navigation.navigate('CommunitySearchUsername', {searchText})
    }
  };

  /// AFFICHER LES FRAMES PARTAGÉES À L'ARRIVÉE SUR L'ÉCRAN ///

  const framesFromUserSearchedList = framesFromUserSearched.map((frame: FrameType, i: number) => {

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

  function handlePressOnLens() {
    if (selectedCategory) {
      navigation.navigate('CommunitySearchCategory', {selectedCategory})
    }
  }


  return (
      <View style={styles.container}>

          {/* Header */}
          <Text style={styles.searchText}>En quête d'inspiration ?</Text>
          <TextInput 
            style={styles.searchInput} 
            placeholder='Votre recherche..' 
            onChangeText={(value) => setSearchText(value)} 
            keyboardType="default"
            onEndEditing={handleSearchKeyPress}
            value={searchText}
          />
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedCategory(itemValue)
            }
            style={styles.picker}
          >
            <Picker.Item key='Selection' label='Choisir une catégorie' style={styles.pickerItemTitle} />
            {categoriesPickable.map((category: string) => (
                <Picker.Item key={category} label={category} value={category} style={styles.pickerItem} />
            ))}
          </Picker>
          <TouchableOpacity onPress={handlePressOnLens}>
            <Text>Loupe</Text>
          </TouchableOpacity>


          {/* All frames shared */}
          <ScrollView>
          {
            allFramesShared.length > 0 
              && framesFromUserSearched.length === 0 
                && framesFromCategorySearched.length === 0 
                  && allFramesSharedList
          }
          </ScrollView>

          {/* All frames shared */}
          {
            framesFromUserSearchedList
          }

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchText: {
    fontSize: 14,
    color: 'black'
  },
  searchInput: {

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