import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { FrameType } from '../types/frame';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { UserState } from '../reducers/user';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


const BACKEND_LOCAL_ADRESS = process.env.EXPO_PUBLIC_BACKEND_ADRESS;


export default function CommunitySearchUsernameScreen({ route }: { route: any }) {

  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [framesFromUserSearched, setFramesFromUserSearched] = useState<FrameType[]>([]);

  const navigation: any = useNavigation();


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



  /* RECHERCHE PAR USERNAME */

  useEffect(() => {
    fetch(`${BACKEND_LOCAL_ADRESS}/users/search/${route.params.searchText}`)
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                setFramesFromUserSearched(data.framesShared);
            }
        })
        .catch(error => {
            console.error(`Error fetching frames shared from ${route.params.searchText}:`, error);
        });
  }, []);



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


  return (
      <View style={styles.container}>

          {/* Header */}
          <TouchableOpacity style={styles.header}>
            <Text style={styles.headerText} onPress={() => navigation.goBack()}>Retour</Text>
          </TouchableOpacity>

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
  header: {
    backgroundColor: 'black'
  },
  headerText: {
    color: 'white'
  },
  searchText: {
    fontSize: 14,
    color: 'black'
  },
  searchInput: {

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