import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import * as Location from 'expo-location';
// import styled from 'styled-components/native';

interface Item {
  id: number;
  tittle: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

const Points: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const navigation = useNavigation();

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleNavigateToDetail = (id: number) => {
    navigation.navigate('Detail', { point_id: id });
  };

  const handleSelectedItem = (id: number) => {
    const alreadySelectedItem_id = selectedItems.indexOf(id);

    if (alreadySelectedItem_id >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getItems = async () => {
    const items = await api.get('items');

    setItems(items.data);
  };

  const getLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Ooops...',
        'Precisamos de sua localização pra obter sua localização'
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync();

    const { latitude, longitude } = location.coords;

    setInitialPosition([latitude, longitude]);
  };

  const getPoints = async () => {
    await api
      .get('points', {
        params: { city: 'Bonito', uf: 'PE', items: selectedItems },
      })
      .then((response) => {
        setPoints(response.data.point);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    getPoints();
  }, [selectedItems]);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name='arrow-left' color='#34cb79' size={20} />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta
        </Text>

        {initialPosition[0] !== 0 ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points &&
                points?.map((point) => (
                  <Marker
                    key={String(point.id)}
                    style={styles.mapMarker}
                    onPress={() => handleNavigateToDetail(point.id)}
                    coordinate={{
                      latitude: point.latitude,
                      longitude: point.longitude,
                    }}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image
                        style={styles.mapMarkerImage}
                        source={{
                          uri: point.image_url,
                        }}
                      />
                      <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                    </View>
                    <View style={styles.triangle} />
                    {/* <Triangle /> */}
                  </Marker>
                ))}
            </MapView>
          </View>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size='large' color='#34cb79' />
          </View>
        )}
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items?.map((item) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              activeOpacity={0.5}
              onPress={() => handleSelectedItem(item.id)}
              key={String(item.id)}
            >
              <SvgUri uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.tittle}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

// const Triangle = styled.View`
//   border-top-color: #34cb79;
//   border-top-width: 10px;

//   border-left-color: transparent;
//   border-left-width: 15px;

//   border-right-color: transparent;
//   border-right-width: 15px;

//   margin: -1px auto 0 auto;
// `;

const styles = StyleSheet.create({
  triangle: {
    borderTopColor: '#34cb79',
    borderTopWidth: 10,

    borderLeftColor: 'transparent',
    borderLeftWidth: 15,

    borderRightColor: 'transparent',
    borderRightWidth: 15,

    marginTop: -1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 80,
    height: 80,
  },

  mapMarkerContainer: {
    width: 80,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 80,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 11,
    lineHeight: 20,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 135,
    width: 135,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;
