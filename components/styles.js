import { StyleSheet } from 'react-native';

// Tema escuro com acentos neon (graffiti)
export const colors = {
  background: '#0B0F12',
  cardBackground: 'rgba(10,12,14,0.75)',
  primary: '#00F5FF', // ciano
  accent: '#FF2D95', // magenta
  neonLime: '#39FF14', // verde neon
  text: '#E6F7FF',
  textSecondary: '#A8F0E6',
  border: 'rgba(255,45,149,0.12)',
  inputBackground: 'rgba(255,255,255,0.03)',
  disabledGray: '#6B7280',
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
    // glow neon
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
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
  successImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.accent,
    alignSelf: 'center',
    backgroundColor: '#0F1112',
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  // Photo buttons
  photoButtonOuter: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  photoButtonInner: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Variante compacta para botões que não devem ter preenchimento
  photoButtonInnerCompact: {
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  photoButtonPrimary: {
    backgroundColor: colors.accent,
    borderWidth: 0,
  },
  photoButtonSecondary: {
    // Sem borda e sem preenchimento por padrão — uso específico em botão de galeria
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  photoIcon: {
    marginRight: 10,
    fontSize: 18,
    color: colors.text,
  },
  photoButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },

  // Thumbnails
  thumbsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  thumbWrapper: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeBlob: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  removeIcon: {
    color: '#0B0F12',
    fontSize: 14,
    fontWeight: '800',
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
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  mapButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },

  // Submit
  submitButton: {
    backgroundColor: colors.neonLime,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 22,
    shadowColor: colors.neonLime,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 10,
    borderWidth: 0,
  },
  submitButtonDisabled: {
    // cinza liso sem sombra
    backgroundColor: colors.disabledGray,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 0,
  },
  submitButtonText: {
    color: '#071014',
    fontSize: 18,
    fontWeight: '900',
  },
  submitButtonTextDisabled: {
    color: '#F3F4F6',
  },
  submitButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
    fontSize: 20,
    color: '#071014',
  },
  submitButtonIconDisabled: {
    color: '#F3F4F6',
  },

  mapActionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  mapActionButtonText: {
    color: '#071014',
    fontWeight: '700',
    marginLeft: 8,
  },

  // Mapa
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    fontWeight: '700',
    color: colors.primary,
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.12)',
  },

  // Success
  successContainer: {
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.accent,
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
