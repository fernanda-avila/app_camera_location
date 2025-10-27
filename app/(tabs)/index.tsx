import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { LatLng, MapPressEvent, Marker, Region } from 'react-native-maps';

import { colors, styles } from './styles.js';

interface RegistrationState {
  name: string;
  imageUri: string | null;
  location: LatLng | null; 
}

interface RegistrationContextProps extends RegistrationState {
  setName: (name: string) => void;
  setImageUri: (uri: string | null) => void;
  setLocation: (location: LatLng | null) => void;
  clearForm: () => void;
}

const initialState: RegistrationState = {
  name: '',
  imageUri: null,
  location: null,
};

const RegistrationContext = createContext<RegistrationContextProps | undefined>(undefined);

const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration deve ser usado dentro de um RegistrationProvider');
  }
  return context;
};

const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState(initialState.name);
  const [imageUri, setImageUri] = useState(initialState.imageUri);
  const [location, setLocation] = useState(initialState.location);

  const clearForm = () => {
    setName(initialState.name);
    setImageUri(initialState.imageUri);
    setLocation(initialState.location);
  };

  const value = {
    name,
    imageUri,
    location,
    setName,
    setImageUri,
    setLocation,
    clearForm,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

type ScreenProps = {
  setScreen: (screen: 'registration' | 'map' | 'success') => void;
};
const RegistrationScreen = ({ setScreen }: ScreenProps) => {
  const { name, setName, imageUri, setImageUri, location } = useRegistration();

  // Hooks de permissão
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

  const verifyPermissions = async (
    permission: ImagePicker.PermissionResponse | null,
    requestPermission: () => Promise<ImagePicker.PermissionResponse>,
    type: 'câmera' | 'galeria'
  ): Promise<boolean> => {
    if (!permission || permission.status === ImagePicker.PermissionStatus.UNDETERMINED) {
      const response = await requestPermission();
      return response.granted;
    }
    if (permission.status === ImagePicker.PermissionStatus.DENIED) {
      Alert.alert('Permissão Negada', `Você precisa conceder permissão de ${type}.`);
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await verifyPermissions(cameraPermission, requestCameraPermission, 'câmera');
    if (!hasPermission) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    // Verifica se a seleção não foi cancelada e se 'assets' existe
    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePickFromGallery = async () => {
    const hasPermission = await verifyPermissions(libraryPermission, requestLibraryPermission, 'galeria');
    if (!hasPermission) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    // Verifica se a seleção não foi cancelada e se 'assets' existe
    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const isFormComplete = !!name && !!imageUri && !!location;
  const profileImage: ImageSourcePropType = imageUri ? { uri: imageUri } : { uri: 'https://placehold.co/200x200/e0e0e0/333?text=Foto' };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Preencha os seguintes campos para se inscrever</Text>
      <View style={styles.card}>
        {/* --- Foto --- */}
        <Text style={styles.label}>1. Sua Foto </Text>
        <Image
          source={profileImage}
          style={styles.image}
        />
        <View style={styles.buttonsContainer}>
          <Button title="Tirar Foto" onPress={handleTakePhoto} />
          <Button title="Escolher da Galeria" onPress={handlePickFromGallery} />
        </View>

        {/* --- Nome --- */}
        <Text style={styles.label}>2. Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome..."
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />

        {/* --- Endereço (Mapa) --- */}
        <Text style={styles.label}>3. Endereço</Text>
        <TouchableOpacity style={styles.mapButton} onPress={() => setScreen('map')}>
          <Text style={styles.mapButtonText}>
            {location ? 'Endereço Selecionado!' : 'Selecionar no Mapa'}
          </Text>
        </TouchableOpacity>
        {location && (
          <Text style={styles.infoText}>
            Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
          </Text>
        )}

        {/* --- Submit --- */}
        <TouchableOpacity
          style={[styles.submitButton, !isFormComplete && styles.submitButtonDisabled]}
          disabled={!isFormComplete}
          onPress={() => setScreen('success')}
        >
          <Text style={styles.submitButtonText}>Inscrever-se!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const MapScreen = ({ setScreen }: ScreenProps) => {
  const { setLocation } = useRegistration();
  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: -23.5505,  
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [tappedMarker, setTappedMarker] = useState<LatLng | null>(null);

  // Busca a localização atual do usuário para centralizar o mapa
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const getLocation = async () => {
      try {

        const isAvailable = await Location.hasServicesEnabledAsync();
        
        if (!isAvailable) {
          Alert.alert(
            'Localização Desativada',
            'Por favor, ative o serviço de localização do seu dispositivo.',
            [{ text: 'OK' }]
          );
          return;
        }

        // Solicita permissão
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'O app precisa de acesso à sua localização.');
          return;
        }

        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });

        if (initialLocation) {
          const newRegion = {
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          setInitialRegion(newRegion);
          setTappedMarker({
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude
          });
        }

        // Inicia o monitoramento contínuo da localização
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1
          },
          (location) => {
            const newRegion = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
            setInitialRegion(newRegion);
            setTappedMarker({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
          }
        );

      } catch (error) {
        console.error("Erro ao buscar localização:", error);
        Alert.alert(
          'Erro de Localização',
          'Não foi possível obter sua localização. Por favor, verifique se o GPS está ativado.',
          [{ text: 'OK' }]
        );
      }
    };

    getLocation();

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []); // Array vazio garante que rode apenas uma vez

  const handleMapPress = (event: MapPressEvent) => {
    setTappedMarker(event.nativeEvent.coordinate);
  };

  const confirmLocation = () => {
    if (tappedMarker) {
      setLocation(tappedMarker); // Salva no contexto
      setScreen('registration'); // Volta para o formulário
    } else {
      Alert.alert('Selecione um local', 'Toque no mapa para definir seu endereço.');
    }
  };


  return (
    <View style={styles.mapContainer}>
      <Text style={styles.mapHeaderText}>Toque no seu endereço e confirme</Text>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        region={initialRegion} // Controla a região para centralizar
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        onPress={handleMapPress}
      >
        {tappedMarker && <Marker coordinate={tappedMarker} pinColor="blue" />}
      </MapView>
      <View style={styles.mapConfirmButton}>
        <Button title="Confirmar Endereço" onPress={confirmLocation} />
      </View>
      <View style={styles.mapBackButton}>
        <Button title="Voltar" onPress={() => setScreen('registration')} color="#555" />
      </View>
    </View>
  );
};


const SuccessScreen = ({ setScreen }: ScreenProps) => {
  const { name, imageUri, location, clearForm } = useRegistration();
  const [address, setAddress] = useState<string>('Buscando endereço...');

  // Converte as coordenadas (location) em um endereço legível
  useEffect(() => {
    if (location) {
      (async () => {
        try {
          // Solicita permissão novamente (necessário para o geocode em alguns casos)
          await Location.requestForegroundPermissionsAsync();
          const geocoded = await Location.reverseGeocodeAsync(location);
          if (geocoded.length > 0) {
            const g = geocoded[0];
            // Formata o endereço
            const street = g.street || 'Rua não encontrada';
            const number = g.streetNumber || '';
            const city = g.city || g.subregion || 'Cidade não encontrada';
            const region = g.region || '';
            setAddress(`${street}, ${number} - ${city}, ${region}`);
          } else {
            setAddress('Endereço não encontrado');
          }
        } catch (error) {
          console.warn("Erro no reverseGeocode: ", error);
          // Fallback para coordenadas se o geocode falhar
          setAddress(`Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`);
        }
      })();
    }
  }, [location]); // Depende da localização

  const handleBack = () => {
    clearForm();
    setScreen('registration');
  };

  return (

    <View style={{ padding: 20 }}>
      {/* Aplicamos o styles.card E o styles.successCard */}
      <View style={[styles.card, styles.successCard]}>
        <Text style={styles.successTitle}>
          Parabéns, {name.split(' ')[0]}!
        </Text>
        <Text style={styles.successSubtitle}>
          Você acaba de se inscrever como mesário!
        </Text>
        <Image source={imageUri ? { uri: imageUri } : { uri: 'https://placehold.co/200x200' }} style={[styles.image, styles.successImage]} />
        <Text style={[styles.label, styles.successLabel]}>Nome:</Text>
        <Text style={[styles.infoText, styles.successInfoText]}>{name}</Text>
        
        <Text style={[styles.label, styles.successLabel]}>Convocado para:</Text>
        <Text style={[styles.infoText, styles.successInfoText]}>{address}</Text>

        <View style={{ marginTop: 20 }} />
        <Button title="Inscrever Outro (Voltar)" onPress={handleBack} color={colors.macabreRed} />
      </View>
    </View>
  );
};


type ScreenName = 'registration' | 'map' | 'success';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('registration');

  const renderScreen = () => {
    switch (screen) {
      case 'map':
        return <MapScreen setScreen={setScreen} />;
      case 'success':
        return <SuccessScreen setScreen={setScreen} />;
      case 'registration':
      default:
        return <RegistrationScreen setScreen={setScreen} />;
    }
  };

  const getSafeAreaStyle = () => {
    switch (screen) {
      case 'success':
        return [styles.safeArea, styles.successContainer];
      case 'registration':
        return [styles.safeArea, styles.registrationContainer];
      case 'map':
        return [styles.safeArea, styles.mapContainer];
      default:
        return styles.safeArea;
    }
  };

  return (
    // O Provider envolve todo o app
    <RegistrationProvider>
      {/* Aplicamos o estilo dinâmico aqui */}
      <SafeAreaView style={getSafeAreaStyle()}>
        {renderScreen()}
      </SafeAreaView>
    </RegistrationProvider>
  );
}

