import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, 
  ImageBackground, 
  Image, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Picker 
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECITYResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selecteduf, setSelectedUf] = useState('0');
  const [selectedcity, setSelectedCity] = useState('0');
  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res => {
      const ufInitials = res.data.map(uf =>  uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selecteduf}/municipios`).then(res => {
      const citiesname = res.data.map(city =>  city.nome);
      setCities(citiesname);
    });
  }, [selecteduf]);

  function handleNavigateToPoint() {
    navigation.navigate('Points', { selecteduf, selectedcity });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Picker
            selectedValue={selecteduf}
            style={styles.select}
            onValueChange={(itemValue, itemIndex) => setSelectedUf(itemValue)}
          >
            <Picker.Item  value="0" label="Selecione uma UF"/>
            {ufs.map(uf => (
              <Picker.Item key={uf} value={uf} label={uf}/>
            ))}
          </Picker>

          <Picker
            selectedValue={selectedcity}
            style={styles.select}
            onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}

          >
            <Picker.Item  value="0" label="Selecione uma Cidade"/>
            {cities.map(city => (
              <Picker.Item key={city} value={city} label={city}/>
            ))}
          </Picker>

          <RectButton style={styles.button} onPress={handleNavigateToPoint}>
            <View style={styles.buttonIcon}>
              <Text> 
                <Icon name="arrow-right" color="#FFF" size={24}/>
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height:60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;