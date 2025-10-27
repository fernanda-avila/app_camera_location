import { StyleSheet } from 'react-native';

// Paleta clean / leve
export const colors = {
  primary: '#3B82F6',        // azul suave
  success: '#10B981',        // verde
  successLight: '#C7F3E0',
  background: '#F7FAFC',     // fundo muito claro
  cardBackground: '#FFFFFF',
  text: '#0F172A',           // texto escuro
  textSecondary: '#475569',  // texto secundário
  border: '#E6E9EE',
  inputBackground: '#F8FAFC',
  macabreRed: '#EF4444',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 14,
    marginBottom: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.primary,
    alignSelf: 'center',
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    width: '100%',
    color: colors.text,
  },
  mapButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  mapButtonText: {
    color: colors.cardBackground,
    fontSize: 15,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: colors.success,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 22,
  },
  submitButtonDisabled: {
    backgroundColor: colors.successLight,
  },
  submitButtonText: {
    color: colors.cardBackground,
    fontSize: 17,
    fontWeight: '700',
  },
  // Estilos do Mapa
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapHeaderText: {
    padding: 14,
    fontSize: 17,
    textAlign: 'center',
    backgroundColor: colors.cardBackground,
    fontWeight: '600',
    color: colors.text,
  },
  mapConfirmButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mapBackButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  // Estilos da tela de Sucesso
  successContainer: {
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.primary,
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16,
  },
  successCard: {
    maxWidth: 420,
    alignSelf: 'center',
    padding: 18,
    borderRadius: 12,
  },
  successImage: {
    marginVertical: 18,
  },
  successLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  successInfoText: {
    fontSize: 15,
    marginBottom: 12,
    color: colors.textSecondary,
  },
  registrationContainer: {
    backgroundColor: colors.background,
  },
});