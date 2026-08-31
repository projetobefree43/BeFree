// 🎨 CORES DO APP - Toda a paleta de cores centralizada
export const COLORS = {
  // Cores primárias
  primary: "#80A86A", // Verde principal
  primaryDark: "#4A6B3E", // Verde escuro
  primaryLight: "#E8F5E9", // Verde claro

  // Cores de fundo
  background: "#F9F9F9", // Cinza claro
  bgLight: "#FAFAFA", // Branco quase puro
  white: "#FFFFFF", // Branco

  // Cores de texto
  textDark: "#1C3113", // Preto/Texto escuro
  textGray: "#888888", // Cinza médio
  textGreen: "#6B8E59", // Verde médio

  // Cores especiais
  danger: "#E57373", // Vermelho/Alerta
  dangerLight: "#FFEBEE", // Vermelho claro
  success: "#4CAF50", // Verde sucesso
  warning: "#FFD700", // Ouro/Aviso
};

// 📐 ESPAÇAMENTO PADRÃO
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// 📝 TAMANHOS DE FONTE
export const FONT_SIZES = {
  small: 12,
  normal: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 28,
  xxxlarge: 32,
};

// 🏋️ PESOS DE FONTE
export const FONT_WEIGHTS = {
  normal: "400",
  semibold: "600",
  bold: "bold",
};

// 🔘 ESTILOS COMUNS REUTILIZÁVEIS
export const COMMON_STYLES = {
  // Botão padrão
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  // Cartão padrão
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },

  // Header padrão
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },

  // Ícone de voltar
  backButton: {
    marginRight: SPACING.md,
  },

  // Caixa de entrada
  inputBox: {
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    fontSize: FONT_SIZES.medium,
    borderWidth: 1,
  },
};
