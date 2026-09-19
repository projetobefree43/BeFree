// esse arquivo é o "dicionário de cores e tamanhos" do app.
// em vez de escrever a cor ou o tamanho toda hora, a gente guarda tudo aqui
// com nomes fáceis e usa em qualquer tela. assim fica tudo igual e fácil de mudar.

// as cores do app
export const COLORS = {
  // cores principais (tons de verde)
  primary: "#80A86A", // verde principal (usado em botões)
  primaryDark: "#4A6B3E", // verde escuro (textos e títulos)
  primaryLight: "#E8F5E9", // verde claro (fundos suaves)

  // cores de fundo
  background: "#F9F9F9", // cinza claro (fundo das telas)
  bgLight: "#FAFAFA", // branco quase puro
  white: "#FFFFFF", // branco

  // cores de texto
  textDark: "#1C3113", // preto/esverdeado escuro (textos)
  textGray: "#888888", // cinza médio (textos secundários)
  textGreen: "#6B8E59", // verde médio

  // cores especiais
  danger: "#E57373", // vermelho (alertas, SOS)
  dangerLight: "#FFEBEE", // vermelho claro
  success: "#4CAF50", // verde de sucesso
  warning: "#FFD700", // dourado (conquistas/troféus)
};

// espaçamentos padrão (distâncias entre elementos)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// tamanhos de fonte (letras)
export const FONT_SIZES = {
  small: 12,
  normal: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 28,
  xxxlarge: 32,
};

// pesos de fonte (grossura da letra)
export const FONT_WEIGHTS = {
  normal: "400",
  semibold: "600",
  bold: "bold",
};

// estilos comuns que várias telas usam (pra não repetir)
export const COMMON_STYLES = {
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  inputBox: {
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    fontSize: FONT_SIZES.medium,
    borderWidth: 1,
  },
};
