import React, { useContext, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import ArtworkDetailMap from '../components/ArtworkDetailMap';
import PhotoSlider from '../components/PhotoSlider';
import ArtworkContext from '../contexts/ArtworkContext';
import ArtistsContext from '../contexts/ArtistsContext';
import { Feather } from '@expo/vector-icons';

const ArtworkDetailScreen = ({ route, navigation }) => {
  const artworkId = route.params.id;
  const { artwork, error, removeArtwork } = useContext(ArtworkContext);
  const { oneArtist, getOneArtist } = useContext(ArtistsContext);

  const work = artwork ? artwork.find((work) => work._id === artworkId) : [];
  const { aboutText, address, coords, photoUrls, title, year } = work;

  useEffect(() => {
    getOneArtist(route.params.artistFbId);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditArtwork', { id: artworkId })}
        >
          <EvilIcons name='pencil' size={35} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // if an indiv artwork is deleted, doesn't try to render DetailScreen; callback redirects to ArtworkList
  if (work) {
    return (
      <Screen style={{ backgroundColor: '#fff' }}>
        {error && (
          <View>
            <Text>{error}</Text>
          </View>
        )}
        <ScrollView>
          <View>
            <PhotoSlider photos={photoUrls} />
          </View>
          <Text>{title}</Text>
          <Text>{oneArtist.name}</Text>
          <Text>{address}</Text>
          <Text>Year: {year ? year : 'NA'}</Text>
          <Text>{aboutText}</Text>

          <TouchableOpacity
            onPress={() =>
              removeArtwork(work._id, () => navigation.navigate('ArtworkList'))
            }
          >
            <Feather style={styles.icon} name='trash' />
          </TouchableOpacity>
          {coords.length ? (
            <ArtworkDetailMap coords={coords} title={title} />
          ) : (
            <Text>Map not available</Text>
          )}
        </ScrollView>
      </Screen>
    );
  }
  return null;
};

const styles = StyleSheet.create({});

export default ArtworkDetailScreen;
