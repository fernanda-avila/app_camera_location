import * as React from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { LatLng, MapPressEvent, Marker, Region } from 'react-native-maps';

import { colors, styles } from '../../components/styles.js';

interface RegistrationState {
  name: string;
  description: string;
  images: string[]; // várias fotos da arte
  location: LatLng | null;
}

interface RegistrationContextProps extends RegistrationState {
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setImages: (uris: string[]) => void;
  setLocation: (location: LatLng | null) => void;
  clearForm: () => void;
}

const initialState: RegistrationState = {
  name: '',
  description: '',
  images: [],
  location: null,
};

const RegistrationContext = React.createContext<RegistrationContextProps | undefined>(undefined);

const useRegistration = () => {
  const context = React.useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration deve ser usado dentro de um RegistrationProvider');
  }
  return context;
};

const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = React.useState(initialState.name);
  const [images, setImages] = React.useState<string[]>(initialState.images);
  const [description, setDescription] = React.useState(initialState.description);
  const [location, setLocation] = React.useState(initialState.location);

  const clearForm = () => {
    setName(initialState.name);
  setImages(initialState.images);
  setDescription(initialState.description);
    setLocation(initialState.location);
  };

  const value = {
    name,
    description,
    images,
    location,
    setName,
    setDescription,
    setImages,
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
  const { name, setName, description, setDescription, images, setImages, location } = useRegistration();

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
      // adiciona a nova foto ao array
      setImages([...images, result.assets[0].uri]);
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
      // adiciona a(s) imagem(ns) selecionada(s)
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const isFormComplete = !!name && !!description && images.length > 0 && !!location;
  const profileImage: ImageSourcePropType = images.length > 0 ? { uri: images[0] } : { uri: 'https://placehold.co/200x200/e0e0e0/333?text=Foto' };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Detetive de Arte Urbana — Catalogar nova arte</Text>
      <View style={styles.card}>
        {/* --- Fotos da Arte --- */}
        <Text style={styles.label}>1. Fotos da Arte </Text>
        <Image
          source={profileImage}
          style={[styles.successImage, { width: 200, height: 200 }]}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.photoButtonOuter}
            activeOpacity={0.9}
            onPress={handleTakePhoto}
          >
            <View style={[styles.photoButtonInner, styles.photoButtonPrimary, { shadowColor: colors.accent }]}
            >
              <Ionicons name="camera" style={styles.photoIcon} />
              <Text style={styles.photoButtonText}>Tirar Foto</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.photoButtonOuter}
            activeOpacity={0.9}
            onPress={handlePickFromGallery}
          >
            {/* Botão de galeria: sem borda e sem padding conforme pedido */}
            <View style={[styles.photoButtonInnerCompact, styles.photoButtonSecondary]}>
              <Ionicons name="images" style={styles.photoIcon} />
              <Text style={styles.photoButtonText}>Escolher da Galeria</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Miniaturas (sempre que houver) */}
        {images.length > 0 && (
          <ScrollView horizontal style={{ marginTop: 8 }} contentContainerStyle={styles.thumbsRow}>
            {images.map((uri, idx) => (
              <View key={idx} style={styles.thumbWrapper}>
                <Image source={{ uri }} style={styles.thumbImage} />
                <TouchableOpacity style={styles.removeBlob} onPress={() => removeImage(idx)}>
                  <Ionicons name="close" style={styles.removeIcon} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* --- Nome e Descrição --- */}
        <Text style={styles.label}>2. Seu Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome..."
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Descrição da Foto</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          placeholder="Descreva a arte / contexto..."
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#999"
          multiline
        />

        {/* --- Endereço (Mapa) --- */}
        <Text style={styles.label}>3. Localização</Text>
        <TouchableOpacity style={styles.mapButton} onPress={() => setScreen('map')}>
          <Ionicons name="map" size={18} color={colors.primary} />
          <Text style={styles.mapButtonText}>
            {location ? '  Local marcado no mapa' : '  Selecionar local no mapa'}
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
          activeOpacity={0.9}
        >
          <View style={styles.submitButtonInner}>
            <Ionicons name="checkmark-circle" size={22} color={!isFormComplete ? '#9aa' : colors.primary} />
            <Text style={[styles.submitButtonText, !isFormComplete && styles.submitButtonDisabled]}>Catalogar Arte</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const MapScreen = ({ setScreen }: ScreenProps) => {
  const { setLocation } = useRegistration();
  const [initialRegion, setInitialRegion] = React.useState<Region>({
    latitude: -23.5505,  
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [tappedMarker, setTappedMarker] = React.useState<LatLng | null>(null);

  // Busca a localização atual do usuário para centralizar o mapa
  React.useEffect(() => {
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
        <TouchableOpacity style={styles.mapActionButton} onPress={confirmLocation} activeOpacity={0.9}>
          <Ionicons name="checkmark" size={20} color="#071014" />
          <Text style={styles.mapActionButtonText}>Confirmar Endereço</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapBackButton}>
        <TouchableOpacity onPress={() => setScreen('registration')} activeOpacity={0.9} style={{ padding: 10 }}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const SuccessScreen = ({ setScreen }: ScreenProps) => {
  const { name, description, images, location, clearForm } = useRegistration();
  const [address, setAddress] = React.useState<string>('Buscando endereço...');

  // Converte as coordenadas (location) em um endereço legível
  React.useEffect(() => {
    if (location) {
      (async () => {
        try {
          
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
          Arte catalogada!
        </Text>
        <Text style={styles.successSubtitle}>
          Obrigado por contribuir com o catálogo urbano, {name.split(' ')[0]}!
        </Text>
        <ScrollView horizontal style={{ marginVertical: 12 }}>
          {images && images.length > 0 ? (
            images.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={[styles.successImage, { width: 120, height: 120, marginRight: 8 }]} />
            ))
          ) : (
            <Image source={{ uri: 'https://placehold.co/200x200' }} style={[styles.successImage, { width: 120, height: 120 }]} />
          )}
        </ScrollView>
  <Text style={[styles.label, styles.successLabel]}>Nome:</Text>
  <Text style={[styles.infoText, styles.successInfoText]}>{name}</Text>

  <Text style={[styles.label, styles.successLabel]}>Descrição:</Text>
  <Text style={[styles.infoText, styles.successInfoText]}>{description}</Text>

  <Text style={[styles.label, styles.successLabel]}>Local:</Text>
  <Text style={[styles.infoText, styles.successInfoText]}>{address}</Text>

        <View style={{ marginTop: 20 }} />
        <TouchableOpacity style={[styles.submitButton]} onPress={handleBack} activeOpacity={0.9}>
          <View style={styles.submitButtonInner}>
            <Ionicons name="repeat" size={22} color={colors.primary} />
            <Text style={styles.submitButtonText}>Catalogar Outra</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};


type ScreenName = 'registration' | 'map' | 'success';

export default function App() {
  const [screen, setScreen] = React.useState<ScreenName>('registration');

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

