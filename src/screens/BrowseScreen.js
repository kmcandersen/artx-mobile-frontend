import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Avatar } from 'react-native-paper';

import ArtworkContext from '../contexts/ArtworkContext';
import ArtistsContext from '../contexts/ArtistsContext';

import Screen from '../components/Screen';
import colors from '../config/colors';
import PointsMap from '../components/PointsMap';

const { height } = Dimensions.get('window');
const listHeight = height * 0.3;

const BrowseScreen = ({ navigation }) => {
  const { artwork, getArtwork, error } = useContext(ArtworkContext);
  const { artists, getArtists } = useContext(ArtistsContext);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    let data = getArtwork();
    getArtists();
    if (data) {
      setIsDataLoading(false);
    } else {
      setIsDataLoading(true);
    }
  }, []);

  // need list of artists with artwork (not all registered users); a unique list of artistFbId's & their profilePhotoUrl's
  // loop thru artists, if found (once) in artwork (work.artistFbId), save artist.fbId and artist.profilePhotoUrl to artistList

  let getArtistList = () => {
    let result = [];
    artists.forEach((a) => {
      if (artwork.find((work) => work.artistFbId === a.fbId)) {
        result.push({
          artistId: a.fbId,
          initials: a.initials,
          profilePhotoUrl: a.profilePhotoUrl || [],
        });
      }
    });
    return result;
  };

  const artistList = artists && artwork ? getArtistList() : [];

  return (
    <Screen>
      {isDataLoading && !error ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            style={styles.loading}
            size={50}
            animating={true}
            color={colors.secondary}
          />
        </View>
      ) : null}
      {error ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : (
        <>
          <View style={styles.mapContainer}>
            <PointsMap navigation={navigation} data={artwork} />
          </View>
          <View>
            <Text>All Artists</Text>
            <FlatList
              data={artistList}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.artistId}
              style={styles.artistPhotosContainer}
              contentContainerStyle={styles.alignRowItems}
              renderItem={({ item }) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('UserProfile', {
                          artistId: item.artistId,
                        })
                      }
                    >
                      {item.profilePhotoUrl.length ? (
                        <Image
                          source={{ uri: item.profilePhotoUrl[0] }}
                          style={styles.profilePhoto}
                        />
                      ) : (
                        <Avatar.Text
                          size={90}
                          label={item.initials}
                          color='white'
                          style={{
                            backgroundColor: '#0336FF',
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </>
                );
              }}
            />
          </View>

          <View>
            <Text>All Artwork</Text>
            <ScrollView style={styles.list}>
              {artwork.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => {
                    navigation.navigate('ArtworkDetail', {
                      id: item._id,
                      artistId: item.artistFbId,
                    });
                  }}
                >
                  {item._id && (
                    <View style={styles.row}>
                      {item.title && (
                        <Text style={styles.title}>{item.title}</Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  artistPhotosContainer: {
    paddingHorizontal: 10,
  },
  alignRowItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 90,
    margin: 5,
  },
  loading: {
    marginLeft: -25,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  mapContainer: {
    height: 300,
  },
  list: {
    height: listHeight,
  },
  title: {
    fontSize: 18,
  },
  icon: {
    fontSize: 24,
  },
});

export default BrowseScreen;
