import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import * as mailComposer from 'expo-mail-composer';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    name: string;
    image: string;
    image_url: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail: React.FC = () => {
  const [data, setData] = useState<Data>({} as Data);
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as Params;

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const getData = async () => {
    const point = await api.get(`points/${routeParams.point_id}`);
    setData(point.data);
  };

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Oi, estou testando o enviou de mensagem no whatsapp...`
    );
  };

  const handleComposeMail = () => {
    mailComposer.composeAsync({
      subject: 'Interesse na coleta de residuos',
      recipients: [data.point.email],
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name='arrow-left' color='#34cb79' size={20} />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: data?.point?.image_url,
          }}
        />

        <Text style={styles.pointName}>{data?.point?.name}</Text>

        <Text style={styles.pointItems}>
          {data?.items?.map((item) => item?.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data?.point?.city} / {data?.point?.uf}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name='whatsapp' size={20} color='#FFF' />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name='mail' size={20} color='#FFF' />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;
