import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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

    /*useEffect(() => {
        fetch(`${BACKEND_LOCAL_ADRESS}/users/${user.username}`)
        .then(response => response.json())
        .then((data): void => {
            if (data.result) {
                console.log('data.frames: ', data.frames)
                for (let i = 0; i < data.frames.length; i++) {
                    if (data.frames[i].shared) {
                        setFramesShared([...framesShared, data.frames[i]])
                        console.log('framesShared useEffect: ', framesShared)
                    }
                }
            }
            else {
                console.log("fetch for user data went wrong")
            }
        })
    }, []);*/

    console.log('framesShared: ', framesShared)
    const framesSharedList = framesShared.map((data: FrameType, i: number) => {
        //console.log(data)
        return (
            <View key={i} style={styles.frameSharedContainer}>
                <Image source={require("../assets/favicon.png")} style={styles.argenticPhoto} />
                <Text>{data.location}</Text>
                <View style={styles.iconsContainer}>
                    <FontAwesome name='tag' style={styles.heartIcon} />
                    <Text style={styles.likeCount}>{data.likes?.length}</Text>
                    <FontAwesome name='tag' style={styles.commentaryIcon} />
                    <Text style={styles.commentaryCount}>{data.commentaries?.length}</Text>
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